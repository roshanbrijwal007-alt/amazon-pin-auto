import { NextRequest, NextResponse } from "next/server";
import { refreshAccessToken } from "@/lib/pinterest";

export async function POST(req: NextRequest) {
  try {
    const { refreshToken } = await req.json();
    if (!refreshToken) {
      return NextResponse.json({ error: "Missing refresh token" }, { status: 400 });
    }

    const tokens = await refreshAccessToken(refreshToken);
    return NextResponse.json(tokens);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Refresh failed" },
      { status: 401 }
    );
  }
}
