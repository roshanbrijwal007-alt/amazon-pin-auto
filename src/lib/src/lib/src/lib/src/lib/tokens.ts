const ACCESS = "pinterest_access_token";
const REFRESH = "pinterest_refresh_token";
const EXPIRES = "pinterest_expires_at";

export const tokenStorage = {
  save(access: string, refresh: string, expiresIn: number) {
    if (typeof window === "undefined") return;
    localStorage.setItem(ACCESS, access);
    localStorage.setItem(REFRESH, refresh);
    localStorage.setItem(EXPIRES, String(Date.now() + expiresIn * 1000));
  },
  getAccess(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(ACCESS);
  },
  getRefresh(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(REFRESH);
  },
  isExpired(): boolean {
    if (typeof window === "undefined") return true;
    const exp = localStorage.getItem(EXPIRES);
    if (!exp) return true;
    return Date.now() > Number(exp) - 90000;
  },
  clear() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(ACCESS);
    localStorage.removeItem(REFRESH);
    localStorage.removeItem(EXPIRES);
  },
};
