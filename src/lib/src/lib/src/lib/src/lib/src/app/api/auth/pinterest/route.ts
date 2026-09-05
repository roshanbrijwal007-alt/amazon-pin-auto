import { NextResponse } from "next/server";

export async function GET() {
  const params = new URLSearchParams({
    client_id: process.env.PINTEREST_CLIENT_ID!,
    redirect_uri: process.env.PINTEREST_REDIRECT_URI!,
    response_type: "code",
    scope: "boards:read,boards:write,pins:read,pins:write",
    state: crypto.randomUUID(),
  });

  return NextResponse.redirect(
    `https://www.pinterest.com/oauth/?${params.toString()}`
  );
}
