import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

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

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { initData, fallbackUser } = body || {};

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
          // ignore parse error
        }
      }
      if (botToken) {
        isVerified = await verifyTelegramWebAppData(initData, botToken);
        if (!isVerified) {
          return new Response(
            JSON.stringify({ error: "Invalid Telegram initData signature" }),
            { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      } else {
        isVerified = true;
      }
    }

    if (!tgUser || !tgUser.id) {
      return new Response(
        JSON.stringify({ error: "Missing Telegram user payload" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const telegramId = Number(tgUser.id);
    const username = tgUser.username ? String(tgUser.username).toLowerCase().replace(/^@/, "") : null;
    const fullName = [tgUser.first_name, tgUser.last_name].filter(Boolean).join(" ") || tgUser.username || `Player #${telegramId}`;
    const avatarUrl = tgUser.photo_url || null;

    // 1. Check if this Telegram user is a Coach (Admin) in public.coaches
    let { data: coach } = await supabase.from("coaches").select("*").eq("telegram_id", telegramId).maybeSingle();

    if (!coach && username) {
      const { data: coachByUsername } = await supabase
        .from("coaches")
        .select("*")
        .ilike("telegram_username", username)
        .maybeSingle();
      if (coachByUsername) {
        const { data: updatedCoach } = await supabase
          .from("coaches")
          .update({
            telegram_id: telegramId,
            name: coachByUsername.name || fullName,
            avatar_url: avatarUrl || coachByUsername.avatar_url,
            updated_at: new Date().toISOString(),
          })
          .eq("id", coachByUsername.id)
          .select("*")
          .single();
        coach = updatedCoach || coachByUsername;
      }
    }

    if (coach) {
      return new Response(
        JSON.stringify({
          role: "coach",
          isVerified,
          coach,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 2. Otherwise, check or create Player in public.players
    let { data: player } = await supabase
      .from("players")
      .select("*")
      .eq("telegram_id", telegramId)
      .maybeSingle();

    if (!player) {
      const { data: newPlayer, error: insertError } = await supabase
        .from("players")
        .insert({
          telegram_id: telegramId,
          telegram_username: username,
          name: fullName,
          avatar_url: avatarUrl,
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
          onboarding_completed: false,
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
    } else if (avatarUrl && player.avatar_url !== avatarUrl) {
      const { data: updatedPlayer } = await supabase
        .from("players")
        .update({ avatar_url: avatarUrl, telegram_username: username, updated_at: new Date().toISOString() })
        .eq("id", player.id)
        .select("*")
        .single();
      if (updatedPlayer) player = updatedPlayer;
    }

    return new Response(
      JSON.stringify({
        role: "player",
        isVerified,
        player,
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
