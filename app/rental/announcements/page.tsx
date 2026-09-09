"use client";

import React from "react";
import { useDormitory } from "@/lib/store/dormitory-context";
import { Bell, MessageCircle, Pin, Calendar, ShieldAlert } from "lucide-react";

export default function RentalAnnouncementsPage() {
  const { announcements } = useDormitory();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.45rem", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
            ข่าวสารและประกาศจากหอพัก
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginTop: "0.25rem", margin: 0 }}>
            ติดตามข่าวสาร กำหนดการล้างแอร์ และการซ่อมบำรุงอาคารส่วนกลาง
          </p>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.45rem",
            background: "rgba(5, 150, 105, 0.08)",
            border: "1px solid rgba(5, 150, 105, 0.25)",
            padding: "0.35rem 0.85rem",
            borderRadius: "9999px",
            color: "#065f46",
            fontSize: "0.82rem",
            fontWeight: 700,
          }}
        >
          <MessageCircle size={15} />
          <span>เชื่อมต่อระบบ LINE แจ้งเตือนแล้ว</span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {announcements.length === 0 ? (
          <div className="bento-card" style={{ padding: "3rem 1.5rem", textAlign: "center", background: "#ffffff" }}>
            <div
              style={{
                width: 54,
                height: 54,
                borderRadius: "14px",
                background: "rgba(79, 70, 229, 0.08)",
                color: "#4f46e5",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "0.85rem",
              }}
            >
              <Bell size={26} />
            </div>
            <h3 style={{ color: "var(--text-primary)", fontSize: "1.15rem", fontWeight: 700, marginBottom: "0.3rem" }}>
              ยังไม่มีประกาศใหม่
            </h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", margin: 0 }}>
              เมื่อนิติบุคคลมีประกาศแจ้งเตือน จะปรากฏให้ท่านทราบที่นี่และผ่าน LINE Official
            </p>
          </div>
        ) : (
          announcements.map((ann) => (
            <div
              key={ann.id}
              className="bento-card hover-card-lift"
              style={{
                padding: "1.5rem 1.75rem",
                background: "#ffffff",
                borderRadius: "var(--radius-lg)",
                border: ann.is_pinned ? "1.5px solid rgba(79, 70, 229, 0.3)" : "1px solid var(--border-color)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.75rem", marginBottom: "0.6rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                  {ann.is_pinned && (
                    <span
                      style={{
                        background: "rgba(79, 70, 229, 0.08)",
                        border: "1px solid rgba(79, 70, 229, 0.25)",
                        color: "#4f46e5",
                        fontSize: "0.74rem",
                        fontWeight: 700,
                        padding: "0.15rem 0.55rem",
                        borderRadius: "6px",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.3rem",
                      }}
                    >
                      <Pin size={12} />
                      <span>ปักหมุดสำคัญ</span>
                    </span>
                  )}
                  {ann.priority === "urgent" && (
                    <span
                      style={{
                        background: "rgba(220, 38, 38, 0.08)",
                        border: "1px solid rgba(220, 38, 38, 0.25)",
                        color: "#dc2626",
                        fontSize: "0.74rem",
                        fontWeight: 700,
                        padding: "0.15rem 0.55rem",
                        borderRadius: "6px",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.3rem",
                      }}
                    >
                      <ShieldAlert size={12} />
                      <span>ด่วน</span>
                    </span>
                  )}
                  <h2 style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
                    {ann.title}
                  </h2>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.78rem", color: "var(--text-muted)" }}>
                  <Calendar size={13} />
                  <span>{new Date(ann.created_at).toLocaleDateString("th-TH")}</span>
                </div>
              </div>

              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.65, margin: 0, whiteSpace: "pre-wrap" }}>
                {ann.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
