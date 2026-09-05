export interface ProductData {
  asin: string;
  title: string;
  description: string;
  imageUrl: string;
}

export async function fetchProductByASIN(asin: string): Promise<ProductData> {
  // TODO: Replace this mock with real Amazon Creators API call
  // after you add your Credential ID & Secret

  console.warn("Using temporary sample data. Add Creators API credentials for real products.");

  return {
    asin,
    title: `Amazon Product ${asin}`,
    description: `Product details for ASIN ${asin}. Replace with real Creators API data.`,
    imageUrl: "https://m.media-amazon.com/images/I/71p3P3qGqLL._AC_SL1500_.jpg",
  };
}
