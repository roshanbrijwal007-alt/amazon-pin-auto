"use client";

import { useEffect, useState } from "react";
import { tokenStorage } from "@/lib/tokens";

export default function HomePage() {
  const [amazonUrl, setAmazonUrl] = useState("");
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = tokenStorage.getAccess();
    setIsAuthenticated(!!token && !tokenStorage.isExpired());
    setChecking(false);
  }, []);

  const log = (msg: string) => {
    setLogs((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 25));
  };

  const handleCreate = async () => {
    if (!amazonUrl.trim()) return;
    setLoading(true);
    log("Processing Amazon link...");

    try {
      let accessToken = tokenStorage.getAccess();

      if (!accessToken || tokenStorage.isExpired()) {
        const refresh = tokenStorage.getRefresh();
        if (!refresh) {
          log("Please login again");
          tokenStorage.clear();
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        const res = await fetch("/api/refresh", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken: refresh }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error("Token refresh failed");

        tokenStorage.save(data.access_token, data.refresh_token || refresh, data.expires_in || 2592000);
        accessToken = data.access_token;
        log("Token refreshed");
      }

      const res = await fetch("/api/create-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amazonUrl, accessToken }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");

      log(`✅ ${data.message}`);
      log(`Pin: ${data.pinUrl}`);
      log(`Affiliate: ${data.affiliateLink}`);
      setAmazonUrl("");
    } catch (err: any) {
      log(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md w-full">
          <h1 className="text-2xl font-bold mb-2">Amazon Pin Auto</h1>
          <p className="text-gray-600 mb-6">Create Pins from Amazon India links automatically</p>
          <a
            href="/api/auth/pinterest"
            className="block w-full py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700"
          >
            Connect Pinterest Account
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Amazon Pin Auto</h1>
          <button
            onClick={() => {
              tokenStorage.clear();
              setIsAuthenticated(false);
            }}
            className="text-sm text-gray-500 underline"
          >
            Logout
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow space-y-4">
          <input
            type="url"
            value={amazonUrl}
            onChange={(e) => setAmazonUrl(e.target.value)}
            placeholder="Paste Amazon India product link here..."
            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
            disabled={loading}
          />
          <button
            onClick={handleCreate}
            disabled={loading || !amazonUrl.trim()}
            className="w-full py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? "Creating Pin..." : "Create Pin"}
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="font-semibold mb-3">Activity Log</h2>
          <div className="bg-gray-50 p-4 rounded-xl h-64 overflow-y-auto text-sm font-mono space-y-1">
            {logs.length === 0 ? (
              <p className="text-gray-400">Ready. Paste an Amazon link above.</p>
            ) : (
              logs.map((l, i) => <div key={i}>{l}</div>)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
