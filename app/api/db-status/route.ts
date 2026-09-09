import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const envPath = path.join(process.cwd(), ".env.local");
    let activeUrl = "";
    let activeKey = "";
    let isCommented = false;

    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, "utf-8");
      const lines = content.split(/\r?\n/);

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        if (trimmed.startsWith("#")) {
          // Check if this commented line was NEXT_PUBLIC_SUPABASE
          if (trimmed.includes("NEXT_PUBLIC_SUPABASE_URL") || trimmed.includes("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY")) {
            isCommented = true;
          }
          continue;
        }

        if (trimmed.startsWith("NEXT_PUBLIC_SUPABASE_URL=")) {
          activeUrl = trimmed.slice("NEXT_PUBLIC_SUPABASE_URL=".length).trim();
          // Remove surrounding quotes if present
          activeUrl = activeUrl.replace(/^["']|["']$/g, "");
        }

        if (trimmed.startsWith("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=")) {
          activeKey = trimmed.slice("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=".length).trim();
          activeKey = activeKey.replace(/^["']|["']$/g, "");
        }
      }
    } else {
      // Fallback to process.env if .env.local file doesn't exist on disk
      activeUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
      activeKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "";
    }

    if (!activeUrl || !activeKey) {
      const errorDetail = isCommented
        ? "ตรวจพบว่าตัวแปร NEXT_PUBLIC_SUPABASE_URL หรือ PUBLISHABLE_KEY ในไฟล์ .env.local ถูกใส่ Comment (#) ไว้"
        : "ไม่พบการตั้งค่า NEXT_PUBLIC_SUPABASE_URL หรือ PUBLISHABLE_KEY ใน .env.local";

      return NextResponse.json({
        connected: false,
        error: errorDetail,
        reason: isCommented ? "env_commented" : "env_missing",
      }, { status: 503 });
    }

    // Ping Supabase REST endpoint to verify real connectivity
    try {
      const endpoint = `${activeUrl.replace(/\/+$/, "")}/rest/v1/users?select=id&limit=1`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(endpoint, {
        headers: {
          apikey: activeKey,
          Authorization: `Bearer ${activeKey}`,
        },
        signal: controller.signal,
        cache: "no-store",
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        const errText = await res.text();
        return NextResponse.json({
          connected: false,
          error: `Supabase ตอบกลับสถานะ ${res.status}: ${errText.slice(0, 150)}`,
          reason: "supabase_error",
        }, { status: 502 });
      }

      return NextResponse.json({
        connected: true,
        supabaseUrl: activeUrl,
        supabaseKey: activeKey,
      });
    } catch (fetchErr: any) {
      return NextResponse.json({
        connected: false,
        error: `ไม่สามารถเชื่อมต่อไปยัง Supabase URL ได้: ${fetchErr?.message || "การเชื่อมต่อขัดข้อง"}`,
        reason: "network_error",
      }, { status: 502 });
    }
  } catch (err: any) {
    return NextResponse.json({
      connected: false,
      error: `ระบบขัดข้องขณะตรวจสอบการเชื่อมต่อ: ${err?.message}`,
      reason: "server_error",
    }, { status: 500 });
  }
}
