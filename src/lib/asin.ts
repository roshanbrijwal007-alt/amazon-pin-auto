export function extractASIN(url: string): string | null {
  const clean = url.trim();
  const patterns = [
    /\/(?:dp|gp\/product|product)\/([A-Z0-9]{10})(?:[/?]|$)/i,
    /[?&]asin=([A-Z0-9]{10})/i,
    /\/([A-Z0-9]{10})(?:[/?&#]|$)/i,
  ];

  for (const re of patterns) {
    const match = clean.match(re);
    if (match) return match[1].toUpperCase();
  }
  return null;
}

export function buildAffiliateLink(asin: string): string {
  return `https://www.amazon.in/dp/${asin}?tag=lycusstore-21`;
}
