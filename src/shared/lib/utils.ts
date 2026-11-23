import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { IS_STAGING } from "../api/supabase/client"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Telegram Mini App production fullscreen reserves 84px at the top for native Telegram controls;
 * Staging runs as a web preview without native Telegram chrome and uses compact 12px top padding.
 */
export const HEADER_TOP_PADDING = IS_STAGING ? "pt-[12px]" : "pt-[84px]";
