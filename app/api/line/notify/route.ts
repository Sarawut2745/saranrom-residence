import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

function getLineToken(): string {
  if (process.env.LINE_CHANNEL_ACCESS_TOKEN) {
    return process.env.LINE_CHANNEL_ACCESS_TOKEN.trim();
  }
  try {
    const envPath = path.join(process.cwd(), ".env.local");
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, "utf-8");
      for (const line of content.split(/\r?\n/)) {
        const trimmed = line.trim();
        if (trimmed.startsWith("#")) continue;
        if (trimmed.startsWith("LINE_CHANNEL_ACCESS_TOKEN=")) {
          return trimmed.slice("LINE_CHANNEL_ACCESS_TOKEN=".length).trim().replace(/^["']|["']$/g, "");
        }
      }
    }
  } catch {}
  return "";
}

// GET: Check LINE bot status and quota
export async function GET() {
  const token = getLineToken();
  if (!token) {
    return NextResponse.json({
      configured: false,
      message: "LINE_CHANNEL_ACCESS_TOKEN ยังไม่ได้ระบุใน .env.local",
    });
  }

  try {
    const [botRes, quotaRes, usageRes] = await Promise.all([
      fetch("https://api.line.me/v2/bot/info", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      }),
      fetch("https://api.line.me/v2/bot/message/quota", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      }),
      fetch("https://api.line.me/v2/bot/message/quota/consumption", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      }),
    ]);

    if (!botRes.ok) {
      const errText = await botRes.text();
      return NextResponse.json({
        configured: false,
        error: `LINE Token ไม่ถูกต้อง หรือหมดอายุ: ${errText}`,
      }, { status: 400 });
    }

    const bot = await botRes.json();
    const quota = quotaRes.ok ? await quotaRes.json() : null;
    const usage = usageRes.ok ? await usageRes.json() : null;

    return NextResponse.json({
      configured: true,
      bot,
      quota,
      usage,
    });
  } catch (err: any) {
    return NextResponse.json({
      configured: false,
      error: err.message || "Failed to check LINE status",
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type = "broadcast", line_user_id, message } = body;

    if (!message || !message.trim()) {
      return NextResponse.json({ success: false, error: "กรุณาระบุข้อความที่ต้องการส่ง" }, { status: 400 });
    }

    const lineToken = getLineToken();

    // Verify LINE Channel Access Token
    if (!lineToken) {
      return NextResponse.json({
        success: false,
        error: "ยังไม่ได้ตั้งค่า LINE_CHANNEL_ACCESS_TOKEN ในระบบ",
      }, { status: 400 });
    }

    if (type === "push") {
      if (!line_user_id) {
        return NextResponse.json({ success: false, error: "Missing line_user_id for push message" }, { status: 400 });
      }

      const res = await fetch("https://api.line.me/v2/bot/message/push", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${lineToken}`,
        },
        body: JSON.stringify({
          to: line_user_id,
          messages: [{ type: "text", text: message }],
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("[LINE Push Error]:", res.status, errText);
        return NextResponse.json({ success: false, error: errText }, { status: res.status });
      }

      return NextResponse.json({ success: true, mode: "line_messaging_api_push" });
    } else if (type === "broadcast") {
      const res = await fetch("https://api.line.me/v2/bot/message/broadcast", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${lineToken}`,
        },
        body: JSON.stringify({
          messages: [{ type: "text", text: message }],
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("[LINE Broadcast Error]:", res.status, errText);
        return NextResponse.json({ success: false, error: errText }, { status: res.status });
      }

      return NextResponse.json({ success: true, mode: "line_messaging_api_broadcast" });
    }

    return NextResponse.json({ success: false, error: "Invalid type" }, { status: 400 });
  } catch (err: any) {
    console.error("[LINE Notify Route Exception]:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
