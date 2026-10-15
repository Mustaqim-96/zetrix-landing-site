import { NextResponse, type NextRequest } from "next/server";
import { MYID_APP_STORE_URL, MYID_GOOGLE_PLAY_URL } from "@/lib/myid-stores";

// Target of the "Download MyID Superapp" QR code. A QR can hold only one URL,
// so this sends iPhones/iPads to the App Store and Android to Google Play.
// Anything else (desktop, unknown) lands on the ZID download section, which
// shows both store buttons.
export function GET(request: NextRequest) {
  const ua = request.headers.get("user-agent") ?? "";
  // iPadOS reports a Mac UA; "Mobile" separates it from desktop Safari.
  const isApple = /iPhone|iPad|iPod/i.test(ua) || (/Macintosh/i.test(ua) && /Mobile/i.test(ua));
  const target = /Android/i.test(ua)
    ? MYID_GOOGLE_PLAY_URL
    : isApple
      ? MYID_APP_STORE_URL
      : new URL("/zid#download", request.url).toString();

  // Vary on UA so a CDN never serves one device's redirect to another.
  return NextResponse.redirect(target, { status: 302, headers: { "Cache-Control": "no-store", Vary: "User-Agent" } });
}
