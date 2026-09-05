import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForTokens } from "@/lib/pinterest";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}?error=no_code`);
  }

  try {
    const tokens = await exchangeCodeForTokens(code);

    const html = `
      <!DOCTYPE html>
      <html>
        <body>
          <script>
            localStorage.setItem('pinterest_access_token', '${tokens.access_token}');
            localStorage.setItem('pinterest_refresh_token', '${tokens.refresh_token}');
            localStorage.setItem('pinterest_expires_at', '${Date.now() + (tokens.expires_in || 2592000) * 1000}');
            window.location.href = '/';
          </script>
          <p style="font-family: system-ui; text-align:center; margin-top:40vh;">
            Connected successfully! Redirecting...
          </p>
        </body>
      </html>
    `;

    return new NextResponse(html, {
      headers: { "Content-Type": "text/html" },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}?error=auth_failed`);
  }
}
