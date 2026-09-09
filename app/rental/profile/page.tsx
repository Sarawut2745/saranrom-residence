"use client";

import React from "react";
import { useDormitory } from "@/lib/store/dormitory-context";
import {
  FileText,
  User,
  Phone,
  Calendar,
  CheckCircle2,
  Building2,
  ShieldCheck,
  MessageCircle,
  Bell,
  MessageSquare,
  Zap,
} from "lucide-react";

export default function RentalProfilePage() {
  const { currentUser, currentRentalProfile, rooms, roomTypes, contracts } = useDormitory();

  const userRoom = rooms.find((r) => r.id === currentRentalProfile?.room_id);
  const roomType = roomTypes.find((rt) => rt.id === userRoom?.room_type_id);
  const contract = contracts.find((c) => c.rental_profile_id === currentRentalProfile?.id);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
      <div>
        <h1 style={{ fontSize: "1.45rem", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
          ข้อมูลห้องพักและสัญญาเช่า
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginTop: "0.25rem", margin: 0 }}>
          รายละเอียดผู้เช่า ระยะเวลาสัญญาเช่า และเงินมัดจำประกันความเสียหาย
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.25rem" }}>
        {/* Tenant Information Card */}
        <div className="bento-card hover-card-lift" style={{ padding: "1.75rem", background: "#ffffff", borderRadius: "var(--radius-lg)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.25rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.75rem" }}>
            <User size={20} style={{ color: "#4f46e5" }} />
            <h2 style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
              ข้อมูลผู้เช่า
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <span style={{ color: "var(--text-muted)", fontSize: "0.82rem", display: "block" }}>ชื่อ-นามสกุล</span>
              <strong style={{ fontSize: "1.05rem", color: "var(--text-primary)" }}>{currentUser?.full_name}</strong>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <div>
                <span style={{ color: "var(--text-muted)", fontSize: "0.82rem", display: "block" }}>เบอร์โทรศัพท์</span>
                <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{currentUser?.phone}</span>
              </div>
              <div>
                <span style={{ color: "var(--text-muted)", fontSize: "0.82rem", display: "block" }}>อีเมล</span>
                <span style={{ color: "var(--text-secondary)" }}>{currentUser?.email}</span>
              </div>
            </div>

            <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "0.85rem" }}>
              <span style={{ color: "var(--text-muted)", fontSize: "0.82rem", display: "block" }}>บุคคลติดต่อฉุกเฉิน</span>
              <strong style={{ color: "var(--text-primary)" }}>{currentRentalProfile?.emergency_contact}</strong>
              <div style={{ color: "#4f46e5", fontSize: "0.88rem", fontWeight: 600, marginTop: "0.15rem" }}>
                โทร: {currentRentalProfile?.emergency_phone}
              </div>
            </div>
          </div>
        </div>

        {/* Contract & Deposit Details Card */}
        <div className="bento-card hover-card-lift" style={{ padding: "1.75rem", background: "#ffffff", borderRadius: "var(--radius-lg)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.25rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.75rem" }}>
            <FileText size={20} style={{ color: "#4f46e5" }} />
            <h2 style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
              สัญญาเช่าและเงินประกัน
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span style={{ color: "var(--text-muted)", fontSize: "0.8rem", display: "block" }}>สถานะสัญญา</span>
                <span
                  style={{
                    background: "rgba(5, 150, 105, 0.08)",
                    border: "1px solid rgba(5, 150, 105, 0.25)",
                    color: "#065f46",
                    fontSize: "0.76rem",
                    padding: "0.15rem 0.6rem",
                    borderRadius: "9999px",
                    fontWeight: 700,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.3rem",
                  }}
                >
                  <CheckCircle2 size={12} />
                  <span>สัญญาสมบูรณ์</span>
                </span>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ color: "var(--text-muted)", fontSize: "0.8rem", display: "block" }}>ห้องพัก</span>
                <strong className="tabular-nums" style={{ color: "#4f46e5", fontSize: "1.2rem" }}>
                  ห้อง {userRoom?.room_number}
                </strong>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", background: "#f8fafc", padding: "0.85rem", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
              <div>
                <span style={{ color: "var(--text-muted)", fontSize: "0.78rem", display: "block" }}>วันเริ่มสัญญา</span>
                <strong style={{ color: "var(--text-primary)", fontSize: "0.9rem" }}>{contract?.start_date}</strong>
              </div>
              <div>
                <span style={{ color: "var(--text-muted)", fontSize: "0.78rem", display: "block" }}>วันหมดสัญญา</span>
                <strong style={{ color: "var(--text-primary)", fontSize: "0.9rem" }}>{contract?.end_date}</strong>
              </div>
            </div>

            <div style={{ background: "rgba(5, 150, 105, 0.08)", border: "1px solid rgba(5, 150, 105, 0.25)", padding: "1rem", borderRadius: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <span style={{ color: "#065f46", fontSize: "0.88rem", fontWeight: 700 }}>เงินประกันความเสียหาย</span>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>
                    คืนให้เต็มจำนวนเมื่อครบสัญญาและส่งมอบห้อง
                  </div>
                </div>
                <div className="tabular-nums" style={{ fontSize: "1.35rem", fontWeight: 800, color: "#065f46" }}>
                  ฿{contract?.deposit_amount.toLocaleString()}
                </div>
              </div>
            </div>

            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.4, margin: 0 }}>
              หากต้องการต่อสัญญาเช่าหรือแจ้งย้ายออก กรุณาแจ้งสำนักงานนิติบุคคลล่วงหน้าอย่างน้อย 30 วัน
            </p>
          </div>
        </div>
      </div>

      {/* LINE OA Announcement & Contact Card (No-Emoji, High Contrast) */}
      <LineAnnouncementCard />
    </div>
  );
}

function LineAnnouncementCard() {
  const lineOaUrl = process.env.NEXT_PUBLIC_LINE_OA_URL || "https://lin.ee/ryw8d3c";
  const lineOaId = process.env.NEXT_PUBLIC_LINE_OA_ID || "@594vkfpm";

  return (
    <div
      className="bento-card hover-card-lift"
      style={{
        padding: "1.85rem 1.75rem",
        background: "linear-gradient(135deg, rgba(6, 199, 85, 0.04), #ffffff)",
        borderRadius: "var(--radius-lg)",
        border: "1.5px solid rgba(6, 199, 85, 0.25)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", maxWidth: "680px" }}>
          <div
            style={{
              width: 50,
              height: 50,
              borderRadius: "12px",
              background: "#06c755",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              boxShadow: "0 4px 14px rgba(6, 199, 85, 0.3)",
              flexShrink: 0,
            }}
          >
            <MessageCircle size={26} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap", marginBottom: "0.35rem" }}>
              <h2 style={{ fontSize: "1.18rem", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
                LINE Official Account หอพัก ({lineOaId})
              </h2>
              <span
                style={{
                  fontSize: "0.74rem",
                  padding: "0.15rem 0.55rem",
                  borderRadius: "9999px",
                  background: "rgba(6, 199, 85, 0.1)",
                  color: "#065f46",
                  fontWeight: 700,
                  border: "1px solid rgba(6, 199, 85, 0.25)",
                }}
              >
                ช่องทางข่าวสารทางการ
              </span>
            </div>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", lineHeight: 1.6, margin: "0 0 0.85rem" }}>
              กดเพิ่มเพื่อนเพื่อรับประกาศข่าวสารสำคัญ นัดหมายช่างซ่อมบำรุงอาคาร ประกาศตัดน้ำตัดไฟ และแชทคุยกับนิติบุคคลได้สะดวกตลอด 24 ชม.
            </p>
            <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap", fontSize: "0.8rem", color: "var(--text-muted)" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                <Bell size={13} style={{ color: "#065f46" }} />
                <span>รับประกาศข่าวสารทันที</span>
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                <MessageSquare size={13} style={{ color: "#4f46e5" }} />
                <span>แชทติดต่อนิติตรง</span>
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                <ShieldCheck size={13} style={{ color: "#0f172a" }} />
                <span>ปลอดภัย บัญชีทางการ</span>
              </span>
            </div>
          </div>
        </div>

        <div>
          <a
            href={lineOaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn"
            style={{
              background: "#06c755",
              color: "#ffffff",
              padding: "0.75rem 1.6rem",
              borderRadius: "10px",
              fontWeight: 700,
              fontSize: "0.95rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              textDecoration: "none",
              boxShadow: "0 4px 14px rgba(6, 199, 85, 0.3)",
              minHeight: "46px",
            }}
          >
            <MessageCircle size={18} />
            <span>แอด LINE รับข่าวสาร ({lineOaId})</span>
          </a>
        </div>
      </div>
    </div>
  );
}
