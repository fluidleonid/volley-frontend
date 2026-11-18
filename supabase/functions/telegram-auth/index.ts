import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

async function hmacSha256Hex(keyStr: string, message: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(keyStr),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(message));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function verifyTelegramWebAppData(initData: string, botToken: string): Promise<boolean> {
  try {
    const params = new URLSearchParams(initData);
    const hash = params.get("hash");
    if (!hash) return false;
    params.delete("hash");

    const entries = Array.from(params.entries()).sort(([a], [b]) => a.localeCompare(b));
    const dataCheckString = entries.map(([k, v]) => `${k}=${v}`).join("\n");

    const encoder = new TextEncoder();
    const secretKeyMaterial = await crypto.subtle.importKey(
      "raw",
      encoder.encode("WebAppData"),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const secretKeyBytes = await crypto.subtle.sign(
      "HMAC",
      secretKeyMaterial,
      encoder.encode(botToken)
    );
    const hmacKey = await crypto.subtle.importKey(
      "raw",
      secretKeyBytes,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const signatureBytes = await crypto.subtle.sign(
      "HMAC",
      hmacKey,
      encoder.encode(dataCheckString)
    );
    const calculatedHash = Array.from(new Uint8Array(signatureBytes))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    return calculatedHash === hash;
  } catch {
    return false;
  }
}

async function fetchAndStoreCompactAvatar(
  telegramId: number,
  botToken: string | undefined,
  supabase: any,
  supabaseUrl: string,
  secretSalt: string
): Promise<string | null> {
  if (!botToken) return null;
  try {
    const photosRes = await fetch(
      `https://api.telegram.org/bot${botToken}/getUserProfilePhotos?user_id=${telegramId}&limit=1`
    );
    const photosData = await photosRes.json();
    const firstPhotoSizes = photosData?.result?.photos?.[0];
    if (Array.isArray(firstPhotoSizes) && firstPhotoSizes.length > 0) {
      const compactSize = firstPhotoSizes[0];
      const fileId = compactSize.file_id;
      const fileRes = await fetch(
        `https://api.telegram.org/bot${botToken}/getFile?file_id=${encodeURIComponent(fileId)}`
      );
      const fileData = await fileRes.json();
      const filePath = fileData?.result?.file_path;
      if (filePath) {
        const tgFileUrl = `https://api.telegram.org/file/bot${botToken}/${filePath}`;
        const imgRes = await fetch(tgFileUrl);
        if (imgRes.ok) {
          const imgBytes = await imgRes.arrayBuffer();
          const fileHash = await hmacSha256Hex(secretSalt, `avatar:${telegramId}`);
          const storagePath = `u_${fileHash.slice(0, 32)}.jpg`;
          const { error: uploadError } = await supabase.storage
            .from("avatars")
            .upload(storagePath, imgBytes, {
              contentType: "image/jpeg",
              cacheControl: "86400",
              upsert: true,
            });
          if (!uploadError) {
            return `${supabaseUrl}/storage/v1/object/public/avatars/${storagePath}`;
          }
        }
      }
    }
  } catch {
    // ignore
  }
  return null;
}

async function issueSupabaseSession(params: {
  supabaseAdmin: any;
  supabaseUrl: string;
  supabaseAnonKey: string;
  secretSalt: string;
  telegramId: number;
  role: "coach" | "player";
  coachId: string | null;
  playerId: string | null;
  existingAuthUserId: string | null;
}): Promise<{ access_token: string; refresh_token: string } | null> {
  const {
    supabaseAdmin,
    supabaseUrl,
    supabaseAnonKey,
    secretSalt,
    telegramId,
    role,
    coachId,
    playerId,
    existingAuthUserId,
  } = params;

  const email = `tg_${telegramId}@telegram.volley.internal`;
  const password = await hmacSha256Hex(secretSalt, `tg-auth-pwd:${telegramId}`);
  const appMetadata = {
    telegram_id: telegramId,
    role_type: role,
    coach_id: coachId,
    player_id: playerId,
  };

  const anonClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // Fast path: if auth_user_id already exists, sign in directly in 1 call (skip redundant updateUserById)
  if (existingAuthUserId) {
    const { data: fastSession } = await anonClient.auth.signInWithPassword({ email, password });
    if (fastSession?.session) {
      return {
        access_token: fastSession.session.access_token,
        refresh_token: fastSession.session.refresh_token,
      };
    }
  }

  // Fallback / first-time creation path
  let authUserId = existingAuthUserId;
  if (authUserId) {
    const { error } = await supabaseAdmin.auth.admin.updateUserById(authUserId, {
      email,
      password,
      email_confirm: true,
      app_metadata: appMetadata,
    });
    if (error) authUserId = null;
  }

  if (!authUserId) {
    const { data: created, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      app_metadata: appMetadata,
    });

    if (created?.user?.id) {
      authUserId = created.user.id;
    } else if (createError) {
      const { data: signInData } = await anonClient.auth.signInWithPassword({ email, password });
      if (signInData?.user?.id) {
        authUserId = signInData.user.id;
        await supabaseAdmin.auth.admin.updateUserById(authUserId, {
          app_metadata: appMetadata,
        });
      }
    }

    if (authUserId) {
      if (role === "coach" && coachId) {
        await supabaseAdmin.from("coaches").update({ auth_user_id: authUserId }).eq("id", coachId);
      } else if (role === "player" && playerId) {
        await supabaseAdmin.from("players").update({ auth_user_id: authUserId }).eq("id", playerId);
      }
    }
  }

  const { data: sessionData, error: sessionErr } = await anonClient.auth.signInWithPassword({
    email,
    password,
  });

  if (sessionErr || !sessionData?.session) {
    return null;
  }

  return {
    access_token: sessionData.session.access_token,
    refresh_token: sessionData.session.refresh_token,
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { initData, fallbackUser, action, playerId, level, xp, skipSession } = body || {};

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || supabaseServiceKey;
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    if (action === "complete_onboarding" && playerId) {
      const { data: updated } = await supabase
        .from("players")
        .update({
          level: Number(level ?? 1),
          xp: Number(xp ?? 0),
          onboarding_completed: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", playerId)
        .select("*")
        .single();

      return new Response(JSON.stringify({ ok: true, player: updated }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const botToken = Deno.env.get("TELEGRAM_BOT_TOKEN");
    let tgUser = fallbackUser || null;
    let isVerified = false;

    if (initData && typeof initData === "string" && initData.length > 0) {
      const params = new URLSearchParams(initData);
      const userJson = params.get("user");
      if (userJson) {
        try {
          tgUser = JSON.parse(userJson);
        } catch {
          // ignore
        }
      }
      isVerified = botToken ? await verifyTelegramWebAppData(initData, botToken) : true;
    }

    if (!tgUser || !tgUser.id) {
      return new Response(
        JSON.stringify({ error: "Missing Telegram user payload" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const telegramId = Number(tgUser.id);
    const username = tgUser.username ? String(tgUser.username).toLowerCase().replace(/^@/, "") : null;
    const fullName =
      [tgUser.first_name, tgUser.last_name].filter(Boolean).join(" ") ||
      tgUser.username ||
      `Player #${telegramId}`;
    const rawPhotoUrl: string | null = tgUser.photo_url || null;
    const isRealWebAppPhoto =
      Boolean(rawPhotoUrl) &&
      !rawPhotoUrl!.endsWith(".svg") &&
      !rawPhotoUrl!.includes("api.telegram.org/file/bot");

    const webAppAvatarUrl: string | null = isRealWebAppPhoto ? rawPhotoUrl : null;

    // 1. Check Coach & Player in parallel for speed
    const [{ data: coachById }, { data: existingPlayer }] = await Promise.all([
      supabase.from("coaches").select("*").eq("telegram_id", telegramId).maybeSingle(),
      supabase.from("players").select("*").eq("telegram_id", telegramId).maybeSingle(),
    ]);

    let coach = coachById;
    if (!coach && username) {
      const { data: coachByUsername } = await supabase
        .from("coaches")
        .select("*")
        .ilike("telegram_username", username)
        .maybeSingle();
      coach = coachByUsername;
    }

    // Background avatar sync helper (never blocks login response!)
    const scheduleBackgroundAvatarSync = (table: "coaches" | "players", rowId: string) => {
      if (webAppAvatarUrl || !botToken) return;
      const task = (async () => {
        const storedUrl = await fetchAndStoreCompactAvatar(
          telegramId,
          botToken,
          supabase,
          supabaseUrl,
          supabaseServiceKey
        );
        if (storedUrl) {
          await supabase.from(table).update({ avatar_url: storedUrl }).eq("id", rowId);
        }
      })();
      try {
        // @ts-ignore EdgeRuntime is available in Supabase Edge Functions
        if (typeof EdgeRuntime !== "undefined" && typeof EdgeRuntime.waitUntil === "function") {
          // @ts-ignore
          EdgeRuntime.waitUntil(task);
        }
      } catch {
        // ignore
      }
    };

    if (coach) {
      const finalAvatar = webAppAvatarUrl || coach.avatar_url || null;
      const updateCoachPromise = supabase
        .from("coaches")
        .update({
          telegram_id: telegramId,
          telegram_username: username || coach.telegram_username,
          name: fullName || coach.name,
          avatar_url: finalAvatar,
          updated_at: new Date().toISOString(),
        })
        .eq("id", coach.id)
        .select("*")
        .single();

      const sessionPromise = skipSession
        ? Promise.resolve(null)
        : issueSupabaseSession({
            supabaseAdmin: supabase,
            supabaseUrl,
            supabaseAnonKey,
            secretSalt: supabaseServiceKey,
            telegramId,
            role: "coach",
            coachId: coach.id,
            playerId: null,
            existingAuthUserId: coach.auth_user_id || null,
          });

      const [{ data: updatedCoach }, session, { data: allPlayers }] = await Promise.all([
        updateCoachPromise,
        sessionPromise,
        supabase.from("players").select("*").order("created_at", { ascending: false }),
      ]);

      const finalCoach = updatedCoach || coach;
      if (!finalAvatar) {
        scheduleBackgroundAvatarSync("coaches", finalCoach.id);
      }

      return new Response(
        JSON.stringify({
          role: "coach",
          isVerified,
          coach: finalCoach,
          allPlayers: allPlayers || [],
          session,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 2. Player flow
    let player = existingPlayer;
    let isFirstRegistration = false;

    if (!player) {
      isFirstRegistration = true;
      const { data: newPlayer, error: insertError } = await supabase
        .from("players")
        .insert({
          telegram_id: telegramId,
          telegram_username: username,
          name: fullName,
          avatar_url: webAppAvatarUrl,
          level: 1,
          xp: 0,
          bp_total: 0,
          bp_today: 0,
          status: "spectating",
          is_hardmode: false,
          has_telegram: true,
          games_played: 0,
          wins: 0,
          win_streak: 0,
          onboarding_completed: true,
        })
        .select("*")
        .single();

      if (insertError) {
        return new Response(
          JSON.stringify({ error: insertError.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      player = newPlayer;
    } else {
      const finalAvatar = webAppAvatarUrl || player.avatar_url || null;
      const { data: updatedPlayer } = await supabase
        .from("players")
        .update({
          name: fullName || player.name,
          avatar_url: finalAvatar,
          telegram_username: username,
          onboarding_completed: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", player.id)
        .select("*")
        .single();
      if (updatedPlayer) player = updatedPlayer;
    }

    if (!player.avatar_url) {
      scheduleBackgroundAvatarSync("players", player.id);
    }

    const session = skipSession
      ? null
      : await issueSupabaseSession({
          supabaseAdmin: supabase,
          supabaseUrl,
          supabaseAnonKey,
          secretSalt: supabaseServiceKey,
          telegramId,
          role: "player",
          coachId: null,
          playerId: player.id,
          existingAuthUserId: player.auth_user_id || null,
        });

    return new Response(
      JSON.stringify({
        role: "player",
        isVerified,
        player: {
          ...player,
          onboarding_completed: !isFirstRegistration,
        },
        session,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
