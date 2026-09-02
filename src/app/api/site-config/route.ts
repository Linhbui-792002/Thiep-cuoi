import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { loadSiteConfig, saveSiteConfig } from "@/lib/site-config-store";
import { revalidateInvitation } from "@/lib/revalidate";

export async function GET() {
  try {
    const config = await loadSiteConfig();
    return NextResponse.json(config);
  } catch (error) {
    console.error("GET site-config error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Không thể tải cấu hình" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  const session = await getSession();
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const config = await saveSiteConfig(body);
    revalidateInvitation();
    return NextResponse.json(config);
  } catch (error) {
    console.error("PUT site-config error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Không thể cập nhật" },
      { status: 500 },
    );
  }
}
