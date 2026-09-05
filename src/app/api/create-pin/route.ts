import { NextRequest, NextResponse } from "next/server";
import { extractASIN, buildAffiliateLink } from "@/lib/asin";
import { fetchProductByASIN } from "@/lib/amazon";
import { createPin } from "@/lib/pinterest";

export async function POST(req: NextRequest) {
  try {
    const { amazonUrl, accessToken } = await req.json();

    if (!amazonUrl || !accessToken) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    const asin = extractASIN(amazonUrl);
    if (!asin) {
      return NextResponse.json({ error: "Invalid Amazon link" }, { status: 400 });
    }

    const product = await fetchProductByASIN(asin);
    const affiliateLink = buildAffiliateLink(asin);

    const pin = await createPin(accessToken, {
      board_id: "1103733889868312260",
      title: product.title.slice(0, 100),
      description: product.description.slice(0, 800),
      link: affiliateLink,
      media_source: {
        source_type: "image_url",
        url: product.imageUrl,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Pin created successfully!",
      pinId: pin.id,
      pinUrl: `https://www.pinterest.com/pin/${pin.id}`,
      affiliateLink,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error.response?.data?.message || error.message || "Failed to create pin" },
      { status: 500 }
    );
  }
}
