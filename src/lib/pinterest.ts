import axios from "axios";

const BASE = "https://api.pinterest.com/v5";

function getBasicAuth() {
  return Buffer.from(
    `${process.env.PINTEREST_CLIENT_ID}:${process.env.PINTEREST_CLIENT_SECRET}`
  ).toString("base64");
}

export async function exchangeCodeForTokens(code: string) {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: process.env.PINTEREST_REDIRECT_URI!,
  });

  const { data } = await axios.post(`${BASE}/oauth/token`, body.toString(), {
    headers: {
      Authorization: `Basic ${getBasicAuth()}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  return data;
}

export async function refreshAccessToken(refreshToken: string) {
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });

  const { data } = await axios.post(`${BASE}/oauth/token`, body.toString(), {
    headers: {
      Authorization: `Basic ${getBasicAuth()}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  return data;
}

export async function createPin(accessToken: string, payload: any) {
  const { data } = await axios.post(`${BASE}/pins`, payload, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  return data;
}
