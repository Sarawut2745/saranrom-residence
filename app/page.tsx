"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useDormitory } from "@/lib/store/dormitory-context";
import {
  Building2,
  Sparkles,
  ShieldCheck,
  Wifi,
  Car,
  Clock,
  Phone,
  MapPin,
  ChevronRight,
  KeyRound,
  Eye,
  BadgeAlert,
  Zap,
  Package,
  Check,
  ArrowRight,
  MessageCircle,
  X,
  Layers,
  Info,
} from "lucide-react";

export default function HomePage() {
  const { siteContent, roomTypes, rooms, announcements } = useDormitory();
  const [selectedRoomType, setSelectedRoomType] = useState<string>("all");
  const [modalRoom, setModalRoom] = useState<any | null>(null);
  const [viewingAnnouncement, setViewingAnnouncement] = useState<any | null>(null);

  // Content configuration
  const heroSection = siteContent.find((s) => s.section_key === "hero") || siteContent[0];
  const amenitiesSection = siteContent.find((s) => s.section_key === "amenities");
  const contactSection = siteContent.find((s) => s.section_key === "contact");

  const heroPhone = heroSection?.content_json?.phone || "081-999-8888";

  // Filtered rooms
  const availableRooms = rooms.filter((r) => r.status === "available");
  const filteredRooms =
    selectedRoomType === "all"
      ? rooms
      : rooms.filter((r) => r.room_type_id === selectedRoomType);

  const pinnedAnnouncement = announcements.find((a) => a.is_pinned);

  // Unique floors for structured floor matrix view
  const floors = Array.from(new Set(rooms.map((r) => r.floor))).sort((a, b) => a - b);

  return (
    <div style={{ position: "relative", minHeight: "100vh", background: "transparent" }}>
      {/* Soft Ambient Background Glow */}
      <div className="ambient-glow-wrapper" aria-hidden="true">
        <div className="ambient-glow-orb" />
      </div>

      {/* Pinned Announcement Bar (No-Emoji, Clean Glass Design) */}
      {pinnedAnnouncement && (
        <div
          style={{
            background: "rgba(255, 241, 242, 0.95)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            borderBottom: "1px solid rgba(254, 205, 211, 0.9)",
            padding: "0.6rem 0",
            position: "relative",
            zIndex: 10,
          }}
        >
          <div
            className="container"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", flexWrap: "wrap" }}>
              <span
                style={{
                  background: "#e11d48",
                  color: "#ffffff",
                  padding: "0.2rem 0.65rem",
                  borderRadius: "9999px",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  boxShadow: "0 1px 4px rgba(225, 29, 72, 0.25)",
                }}
              >
                <BadgeAlert size={13} />
                <span>ประกาศหอพัก</span>
              </span>
              <span style={{ color: "#881337", fontSize: "0.9rem", fontWeight: 600 }}>
                {pinnedAnnouncement.title}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setViewingAnnouncement(pinnedAnnouncement)}
              style={{
                color: "#be123c",
                fontSize: "0.82rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.3rem",
                fontWeight: 600,
                padding: "0.3rem 0.8rem",
                borderRadius: "8px",
                background: "rgba(225, 29, 72, 0.08)",
                border: "1px solid rgba(225, 29, 72, 0.25)",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              <span>อ่านรายละเอียด</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      )}

      {/* 1. Hero Section - Bento Cards & Direct Actions */}
      <section style={{ position: "relative", paddingTop: "3.5rem", paddingBottom: "3rem", zIndex: 2 }}>
        <div className="container">
          <div style={{ maxWidth: 880, margin: "0 auto", textAlign: "center" }}>
            {/* Tagline Pill */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", padding: "0.3rem 0.95rem", borderRadius: "9999px", background: "rgba(79, 70, 229, 0.08)", border: "1px solid rgba(79, 70, 229, 0.2)", color: "#4f46e5", fontSize: "0.82rem", fontWeight: 600, marginBottom: "1.25rem" }}>
              <Sparkles size={14} />
              <span>หอพักและอพาร์ตเมนต์รายเดือนมาตรฐาน สุขุมวิท 71</span>
            </div>

            {/* Main Headline */}
            <h1
              style={{
                fontSize: "clamp(2.1rem, 5vw, 3.4rem)",
                fontWeight: 800,
                color: "var(--text-primary)",
                lineHeight: 1.18,
                marginBottom: "1rem",
                letterSpacing: "-0.025em",
              }}
            >
              เดอะ สราญรมย์ เรสซิเดนซ์
            </h1>

            {/* Subheading */}
            <p
              style={{
                fontSize: "clamp(1rem, 2vw, 1.2rem)",
                color: "var(--text-secondary)",
                lineHeight: 1.65,
                maxWidth: 640,
                margin: "0 auto 2.25rem",
              }}
            >
              ห้องพักสะอาด บรรยากาศเงียบสงบ เฟอร์นิเจอร์ครบชุด พร้อมอินเทอร์เน็ตความเร็วสูง ระบบรักษาความปลอดภัย 24 ชั่วโมง ใกล้สถานีรถไฟฟ้า BTS พระโขนง
            </p>

            {/* 3 Main Action Buttons */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.85rem",
                flexWrap: "wrap",
                marginBottom: "2.75rem",
              }}
            >
              <a
                href="#rooms"
                className="btn btn-primary"
                style={{
                  fontSize: "0.95rem",
                  padding: "0.75rem 1.6rem",
                  minHeight: "48px",
                  borderRadius: "10px",
                  boxShadow: "0 4px 14px rgba(15, 23, 42, 0.18)",
                }}
              >
                <span>ดูห้องว่างและอัตราเช่า</span>
                <ChevronRight size={17} />
              </a>

              <Link
                href="/login"
                className="btn btn-secondary"
                style={{
                  fontSize: "0.95rem",
                  padding: "0.75rem 1.6rem",
                  minHeight: "48px",
                  borderRadius: "10px",
                  border: "1px solid var(--border-color)",
                  fontWeight: 600,
                  background: "rgba(255, 255, 255, 0.9)",
                }}
              >
                <KeyRound size={17} style={{ color: "#4f46e5" }} />
                <span>พอร์ทัลผู้เช่า / นิติบุคคล</span>
              </Link>

              <a
                href={`tel:${heroPhone}`}
                className="btn btn-outline"
                style={{
                  fontSize: "0.95rem",
                  padding: "0.75rem 1.4rem",
                  minHeight: "48px",
                  borderRadius: "10px",
                  background: "#ffffff",
                }}
              >
                <Phone size={17} style={{ color: "#059669" }} />
                <span>โทร {heroPhone}</span>
              </a>
            </div>

            {/* 3 Bento Metric Cards (No-Emoji, Clear Typography) */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "1rem",
                textAlign: "left",
              }}
            >
              <div className="bento-card hover-card-lift" style={{ padding: "1.35rem 1.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 600 }}>
                    สถานะห้องพัก
                  </span>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
                    <span className="pulsing-dot-green" />
                    <span style={{ fontSize: "0.76rem", color: "#065f46", fontWeight: 700 }}>เรียลไทม์</span>
                  </div>
                </div>
                <div className="tabular-nums" style={{ fontSize: "2.1rem", fontWeight: 800, color: "#065f46", lineHeight: 1.1 }}>
                  {availableRooms.length}{" "}
                  <span style={{ fontSize: "1.05rem", fontWeight: 500, color: "var(--text-secondary)" }}>ห้องว่าง</span>
                </div>
                <div
                  style={{
                    color: "#065f46",
                    fontSize: "0.82rem",
                    marginTop: "0.45rem",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.35rem",
                  }}
                >
                  <Check size={15} />
                  <span>พร้อมเข้าทำสัญญาได้ทันที</span>
                </div>
              </div>

              <div className="bento-card hover-card-lift" style={{ padding: "1.35rem 1.5rem" }}>
                <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 600, marginBottom: "0.5rem" }}>
                  อัตราค่าเช่ามาตรฐาน
                </div>
                <div className="tabular-nums" style={{ fontSize: "2.1rem", fontWeight: 800, color: "#4f46e5", lineHeight: 1.1 }}>
                  ฿4,500{" "}
                  <span style={{ fontSize: "0.95rem", fontWeight: 500, color: "var(--text-secondary)" }}>/ เดือน</span>
                </div>
                <div style={{ color: "var(--text-secondary)", fontSize: "0.82rem", marginTop: "0.45rem" }}>
                  ราคาเริ่มต้น • สัญญาเช่า 6 เดือนขึ้นไป
                </div>
              </div>

              <div className="bento-card hover-card-lift" style={{ padding: "1.35rem 1.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 600 }}>
                    ความปลอดภัย
                  </span>
                  <ShieldCheck size={16} style={{ color: "#0f172a" }} />
                </div>
                <div style={{ fontSize: "1.55rem", fontWeight: 800, color: "var(--text-primary)", lineHeight: 1.2 }}>
                  CCTV 24 ชม.
                </div>
                <div style={{ color: "var(--text-secondary)", fontSize: "0.82rem", marginTop: "0.45rem" }}>
                  เข้า-ออกด้วยระบบคีย์การ์ดเฉพาะชั้น
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Room Showcase Section */}
      <section id="rooms" style={{ position: "relative", padding: "3.5rem 0", zIndex: 2 }}>
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 2rem" }}>
            <h2 style={{ fontSize: "1.9rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "0.4rem" }}>
              แบบห้องพักและอัตราค่าเช่า
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
              เลือกดูประเภทห้องพักที่ตรงกับความต้องการ ทุกห้องมีห้องน้ำในตัวและระเบียงส่วนตัว
            </p>
          </div>

          {/* Interactive Filter Pills (shadcn-inspired Tab Pills) */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "2rem" }}>
            <div
              className="chip-filter-row"
              style={{
                background: "rgba(255, 255, 255, 0.85)",
                padding: "0.35rem",
                borderRadius: "12px",
                border: "1px solid var(--border-color)",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                gap: "0.4rem",
              }}
            >
              <button
                type="button"
                onClick={() => setSelectedRoomType("all")}
                className={`chip-btn ${selectedRoomType === "all" ? "active" : ""}`}
                style={{
                  padding: "0.45rem 1.15rem",
                  fontSize: "0.88rem",
                  fontWeight: 600,
                  borderRadius: "8px",
                }}
              >
                ดูทุกประเภท ({rooms.length} ห้อง)
              </button>
              {roomTypes.map((rt) => {
                const count = rooms.filter((r) => r.room_type_id === rt.id).length;
                return (
                  <button
                    key={rt.id}
                    type="button"
                    onClick={() => setSelectedRoomType(rt.id)}
                    className={`chip-btn ${selectedRoomType === rt.id ? "active" : ""}`}
                    style={{
                      padding: "0.45rem 1.15rem",
                      fontSize: "0.88rem",
                      fontWeight: 600,
                      borderRadius: "8px",
                    }}
                  >
                    {rt.name} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Room Type Bento Cards Grid */}
          <div className="grid-responsive-3" style={{ marginBottom: "3rem" }}>
            {roomTypes.map((rt) => {
              const roomsOfType = rooms.filter((r) => r.room_type_id === rt.id);
              const availableCount = roomsOfType.filter((r) => r.status === "available").length;

              return (
                <div
                  key={rt.id}
                  className="bento-card hover-card-lift"
                  style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}
                >
                  {/* Room Image Container */}
                  <div style={{ position: "relative", height: 220, width: "100%", overflow: "hidden" }}>
                    <img
                      src={
                        rt.image_url ||
                        "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80"
                      }
                      alt={rt.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.3s ease",
                      }}
                    />

                    {/* Room Availability Status Badge */}
                    <div style={{ position: "absolute", top: 12, right: 12 }}>
                      {availableCount > 0 ? (
                        <span
                          style={{
                            background: "rgba(255, 255, 255, 0.95)",
                            backdropFilter: "blur(8px)",
                            color: "#065f46",
                            border: "1px solid rgba(5, 150, 105, 0.3)",
                            fontSize: "0.78rem",
                            padding: "0.3rem 0.75rem",
                            borderRadius: "9999px",
                            fontWeight: 700,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.35rem",
                            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                          }}
                        >
                          <span className="pulsing-dot-green" />
                          <span>ว่าง {availableCount} ห้อง</span>
                        </span>
                      ) : (
                        <span
                          style={{
                            background: "rgba(255, 255, 255, 0.95)",
                            backdropFilter: "blur(8px)",
                            color: "#dc2626",
                            border: "1px solid rgba(220, 38, 38, 0.3)",
                            fontSize: "0.78rem",
                            padding: "0.3rem 0.75rem",
                            borderRadius: "9999px",
                            fontWeight: 700,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.35rem",
                          }}
                        >
                          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#dc2626" }} />
                          <span>เต็มแล้ว</span>
                        </span>
                      )}
                    </div>

                    {/* Price Pill */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: 12,
                        left: 12,
                        background: "rgba(255, 255, 255, 0.96)",
                        backdropFilter: "blur(8px)",
                        padding: "0.35rem 0.85rem",
                        borderRadius: "9999px",
                        display: "flex",
                        alignItems: "baseline",
                        gap: "0.35rem",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                        border: "1px solid rgba(226, 232, 240, 0.8)",
                      }}
                    >
                      <span
                        className="tabular-nums"
                        style={{ fontSize: "1.2rem", fontWeight: 800, color: "#4f46e5" }}
                      >
                        ฿{rt.base_price.toLocaleString()}
                      </span>
                      <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 500 }}>
                        / เดือน
                      </span>
                    </div>
                  </div>

                  {/* Room Card Body */}
                  <div style={{ padding: "1.4rem", flex: 1, display: "flex", flexDirection: "column" }}>
                    <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "0.35rem" }}>
                      {rt.name}
                    </h3>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", lineHeight: 1.5, marginBottom: "1rem" }}>
                      {rt.description}
                    </p>

                    {/* Amenities Chips */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginBottom: "1.25rem" }}>
                      {rt.amenities.slice(0, 4).map((item, idx) => (
                        <span
                          key={idx}
                          style={{
                            background: "#f8fafc",
                            border: "1px solid var(--border-color)",
                            padding: "0.25rem 0.55rem",
                            borderRadius: "6px",
                            fontSize: "0.76rem",
                            color: "var(--text-secondary)",
                            fontWeight: 500,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.25rem",
                          }}
                        >
                          <Check size={12} style={{ color: "#065f46" }} />
                          <span>{item}</span>
                        </span>
                      ))}
                    </div>

                    {/* Card Footer */}
                    <div
                      style={{
                        marginTop: "auto",
                        borderTop: "1px solid var(--border-color)",
                        paddingTop: "0.9rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "0.5rem",
                      }}
                    >
                      <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                        ค่าน้ำ ฿{rt.water_rate} • ค่าไฟ ฿{rt.electric_rate}/หน่วย
                      </div>
                      <button
                        type="button"
                        onClick={() => setModalRoom(rt)}
                        className="btn btn-secondary btn-sm"
                        style={{
                          fontWeight: 600,
                          fontSize: "0.82rem",
                          padding: "0.35rem 0.75rem",
                          borderRadius: "8px",
                        }}
                      >
                        <Eye size={14} />
                        <span>ข้อมูลห้อง</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 3. Live Floor Matrix - Structured Floor by Floor View */}
          <div id="matrix" className="bento-card" style={{ padding: "2rem" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
                flexWrap: "wrap",
                gap: "1rem",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                  <Layers size={18} style={{ color: "#4f46e5" }} />
                  <h3 style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
                    ผังห้องพักและสถานะว่างแบบเรียลไทม์
                  </h3>
                </div>
                <p style={{ fontSize: "0.86rem", color: "var(--text-secondary)", margin: 0 }}>
                  ตรวจเช็คห้องพักว่างแต่ละชั้น (ชั้น 2 ถึงชั้น 5) อัปเดตข้อมูลอัตโนมัติ
                </p>
              </div>

              {/* Status Legend Badges */}
              <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", fontSize: "0.82rem" }}>
                <span
                  style={{
                    background: "rgba(5, 150, 105, 0.08)",
                    border: "1px solid rgba(5, 150, 105, 0.25)",
                    color: "#065f46",
                    padding: "0.3rem 0.75rem",
                    borderRadius: "9999px",
                    fontWeight: 700,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.35rem",
                  }}
                >
                  <span className="pulsing-dot-green" />
                  <span>ว่าง ({availableRooms.length} ห้อง)</span>
                </span>
                <span
                  style={{
                    background: "#f1f5f9",
                    border: "1px solid var(--border-color)",
                    color: "var(--text-secondary)",
                    padding: "0.3rem 0.75rem",
                    borderRadius: "9999px",
                    fontWeight: 600,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.35rem",
                  }}
                >
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#94a3b8" }} />
                  <span>มีผู้เช่า ({rooms.filter((r) => r.status === "occupied").length} ห้อง)</span>
                </span>
              </div>
            </div>

            {/* Matrix Grouped by Floor Rows */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {floors.map((floorNum) => {
                const floorRooms = filteredRooms.filter((r) => r.floor === floorNum);
                if (floorRooms.length === 0) return null;

                return (
                  <div
                    key={floorNum}
                    style={{
                      background: "#f8fafc",
                      borderRadius: "12px",
                      border: "1px solid var(--border-color)",
                      padding: "1rem 1.25rem",
                    }}
                  >
                    {/* Floor Label */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "0.75rem",
                        paddingBottom: "0.45rem",
                        borderBottom: "1px solid rgba(226, 232, 240, 0.8)",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        <span style={{ fontSize: "0.88rem", fontWeight: 800, color: "var(--text-primary)" }}>
                          ชั้น {floorNum}
                        </span>
                        <span style={{ fontSize: "0.76rem", color: "var(--text-muted)" }}>
                          ({floorRooms.length} ห้องพัก)
                        </span>
                      </div>
                      <span style={{ fontSize: "0.76rem", color: "#065f46", fontWeight: 600 }}>
                        ว่าง {floorRooms.filter((r) => r.status === "available").length} ห้อง
                      </span>
                    </div>

                    {/* Room Grid inside Floor */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(135px, 1fr))",
                        gap: "0.65rem",
                      }}
                    >
                      {floorRooms.map((room) => {
                        const rt = roomTypes.find((t) => t.id === room.room_type_id);
                        const isAvail = room.status === "available";

                        return (
                          <div
                            key={room.id}
                            style={{
                              padding: "0.75rem 0.65rem",
                              borderRadius: "10px",
                              background: isAvail ? "rgba(5, 150, 105, 0.05)" : "#ffffff",
                              border: `1.5px solid ${
                                isAvail ? "rgba(5, 150, 105, 0.28)" : "rgba(226, 232, 240, 0.9)"
                              }`,
                              textAlign: "center",
                              transition: "all 0.15s ease",
                            }}
                          >
                            <div
                              style={{
                                fontSize: "1.1rem",
                                fontWeight: 800,
                                color: "var(--text-primary)",
                                lineHeight: 1.2,
                              }}
                            >
                              {room.room_number}
                            </div>
                            <div
                              style={{
                                fontSize: "0.74rem",
                                color: "var(--text-muted)",
                                marginTop: "0.15rem",
                                marginBottom: "0.25rem",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {rt?.name.split(" ")[0]}
                            </div>
                            <div
                              className="tabular-nums"
                              style={{
                                fontSize: "0.85rem",
                                fontWeight: 700,
                                color: "#4f46e5",
                                marginBottom: "0.4rem",
                              }}
                            >
                              ฿{room.monthly_rent.toLocaleString()}
                            </div>
                            <span
                              style={{
                                fontSize: "0.72rem",
                                padding: "0.15rem 0.55rem",
                                borderRadius: "9999px",
                                fontWeight: 700,
                                display: "inline-block",
                                background: isAvail ? "rgba(5, 150, 105, 0.1)" : "#f1f5f9",
                                color: isAvail ? "#065f46" : "#64748b",
                                border: `1px solid ${isAvail ? "rgba(5, 150, 105, 0.2)" : "#e2e8f0"}`,
                              }}
                            >
                              {isAvail ? "ว่าง" : "มีผู้เช่า"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Amenities Section - 6 Bento Cards */}
      <section id="amenities" style={{ position: "relative", padding: "3.5rem 0", zIndex: 2 }}>
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 2.5rem" }}>
            <h2 style={{ fontSize: "1.9rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "0.4rem" }}>
              สิ่งอำนวยความสะดวก
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
              พร้อมสรรพด้วยระบบสาธารณูปโภคและการดูแลความปลอดภัยตลอดการพักอาศัย
            </p>
          </div>

          <div className="grid-responsive-3">
            {[
              { icon: ShieldCheck, title: "ระบบกล้อง CCTV 24 ชม.", desc: "ติดตั้งทุกชั้น พร้อมระบบคีย์การ์ดเข้าออกเฉพาะผู้พักอาศัย" },
              { icon: Wifi, title: "อินเทอร์เน็ตความเร็วสูง", desc: "สัญญาณ WiFi ครอบคลุมทุกห้องพักและพื้นที่ส่วนกลาง" },
              { icon: Car, title: "ที่จอดรถยนต์ & มอเตอร์ไซค์", desc: "พื้นที่จอดรถในร่มกว้างขวาง ปลอดภัย สะดวกสบาย" },
              { icon: Zap, title: "ชำระค่าห้องผ่าน QR Code", desc: "สแกนจ่ายค่าห้องและค่าน้ำ-ค่าไฟผ่าน Mobile Banking สะดวก 24 ชม." },
              { icon: Package, title: "จุดรับพัสดุเป็นระเบียบ", desc: "มีตู้รับและคัดแยกพัสดุปลอดภัย ป้องกันการสูญหาย" },
              { icon: Clock, title: "เจ้าหน้าที่และช่างดูแล", desc: "แจ้งซ่อมบำรุงผ่านระบบออนไลน์ มีช่างเข้าตรวจสอบรวดเร็ว" },
            ].map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div
                  key={idx}
                  className="bento-card hover-card-lift"
                  style={{ padding: "1.5rem", display: "flex", gap: "1rem", alignItems: "flex-start" }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "10px",
                      background: "rgba(79, 70, 229, 0.08)",
                      border: "1px solid rgba(79, 70, 229, 0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#4f46e5",
                      flexShrink: 0,
                    }}
                  >
                    <IconComp size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.25rem" }}>
                      {item.title}
                    </h3>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", lineHeight: 1.5, margin: 0 }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Location & Contact Section */}
      <section id="contact" style={{ position: "relative", padding: "3.5rem 0", zIndex: 2 }}>
        <div className="container">
          <div className="bento-card" style={{ padding: "2.5rem" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "2.5rem",
                alignItems: "center",
              }}
            >
              <div>
                <h2 style={{ fontSize: "1.85rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "0.5rem" }}>
                  ติดต่อหอพัก & นัดหมายดูห้อง
                </h2>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginBottom: "1.75rem", lineHeight: 1.6 }}>
                  เปิดให้เข้าชมห้องพักตัวอย่างได้ทุกวัน กรุณาโทรนัดหมายล่วงหน้า หรือสอบถามข้อมูลเพิ่มเติมผ่าน LINE Official
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem", marginBottom: "2rem" }}>
                  <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: "8px",
                        background: "rgba(5, 150, 105, 0.1)",
                        border: "1px solid rgba(5, 150, 105, 0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#065f46",
                        flexShrink: 0,
                      }}
                    >
                      <Phone size={18} />
                    </div>
                    <div>
                      <span style={{ display: "block", color: "var(--text-muted)", fontSize: "0.78rem", fontWeight: 500 }}>
                        โทรศัพท์สอบถาม:
                      </span>
                      <a href={`tel:${heroPhone}`} style={{ color: "#065f46", fontWeight: 800, fontSize: "1.1rem" }}>
                        {heroPhone}
                      </a>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: "8px",
                        background: "rgba(79, 70, 229, 0.1)",
                        border: "1px solid rgba(79, 70, 229, 0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#4f46e5",
                        flexShrink: 0,
                      }}
                    >
                      <MapPin size={18} />
                    </div>
                    <div>
                      <span style={{ display: "block", color: "var(--text-muted)", fontSize: "0.78rem", fontWeight: 500 }}>
                        สถานที่ตั้ง:
                      </span>
                      <span style={{ color: "var(--text-primary)", fontSize: "0.9rem", fontWeight: 500 }}>
                        128/9 ซอยสุขุมวิท 71 แขวงพระโขนงเหนือ เขตวัฒนา กรุงเทพฯ (ใกล้ BTS พระโขนง 3 นาที)
                      </span>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: "8px",
                        background: "rgba(15, 23, 42, 0.08)",
                        border: "1px solid rgba(15, 23, 42, 0.15)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#0f172a",
                        flexShrink: 0,
                      }}
                    >
                      <Clock size={18} />
                    </div>
                    <div>
                      <span style={{ display: "block", color: "var(--text-muted)", fontSize: "0.78rem", fontWeight: 500 }}>
                        เวลาทำการสำนักงาน:
                      </span>
                      <span style={{ color: "var(--text-primary)", fontSize: "0.9rem", fontWeight: 500 }}>
                        08:30 - 18:00 น. (เปิดให้บริการทุกวัน)
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                  <a
                    href={`tel:${heroPhone}`}
                    className="btn btn-primary"
                    style={{
                      minHeight: "46px",
                      flex: "1 1 180px",
                      borderRadius: "10px",
                      fontSize: "0.92rem",
                      boxShadow: "0 2px 8px rgba(15, 23, 42, 0.15)",
                    }}
                  >
                    <Phone size={16} />
                    <span>โทรออก ({heroPhone})</span>
                  </a>
                  <a
                    href={process.env.NEXT_PUBLIC_LINE_OA_URL || "https://lin.ee/ryw8d3c"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn"
                    style={{
                      minHeight: "46px",
                      flex: "1 1 180px",
                      borderRadius: "10px",
                      background: "#06c755",
                      color: "#ffffff",
                      border: "none",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      fontSize: "0.92rem",
                      fontWeight: 600,
                      boxShadow: "0 2px 8px rgba(6, 199, 85, 0.3)",
                    }}
                  >
                    <MessageCircle size={18} />
                    <span>แชท LINE OA (@594vkfpm)</span>
                  </a>
                </div>
              </div>

              {/* Photo Preview Container */}
              <div
                style={{
                  borderRadius: "14px",
                  overflow: "hidden",
                  height: 330,
                  border: "1px solid var(--border-color)",
                  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06)",
                }}
              >
                <img
                  src={
                    contactSection?.image_url ||
                    "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80"
                  }
                  alt="ภาพหอพัก เดอะ สราญรมย์ เรสซิเดนซ์"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Room Detail Modal (Bottom Sheet on Mobile, Dialog on Desktop) */}
      {modalRoom && (
        <div className="modal-overlay" onClick={() => setModalRoom(null)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ padding: "1.75rem" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <div>
                <h3 style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
                  {modalRoom.name}
                </h3>
                <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                  รายละเอียดห้องพักและสิ่งอำนวยความสะดวก
                </span>
              </div>
              <button
                type="button"
                onClick={() => setModalRoom(null)}
                aria-label="ปิดหน้าต่าง"
                style={{
                  background: "#f1f5f9",
                  border: "1px solid var(--border-color)",
                  color: "var(--text-secondary)",
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <X size={18} />
              </button>
            </div>

            <div className="tabular-nums" style={{ color: "#4f46e5", fontWeight: 800, fontSize: "1.45rem", marginBottom: "1rem" }}>
              ฿{modalRoom.base_price.toLocaleString()}{" "}
              <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 500 }}>/ เดือน</span>
            </div>

            <div style={{ borderRadius: "10px", overflow: "hidden", height: 210, marginBottom: "1.25rem", border: "1px solid var(--border-color)" }}>
              <img
                src={modalRoom.image_url}
                alt={modalRoom.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>

            <div style={{ marginBottom: "1.25rem" }}>
              <h4 style={{ color: "var(--text-primary)", fontSize: "0.9rem", fontWeight: 700, marginBottom: "0.5rem" }}>
                สิ่งอำนวยความสะดวกในห้อง:
              </h4>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                {modalRoom.amenities.map((item: string, i: number) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                    <Check size={14} style={{ color: "#065f46" }} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                background: "#f8fafc",
                border: "1px solid var(--border-color)",
                padding: "0.9rem",
                borderRadius: "10px",
                marginBottom: "1.5rem",
                fontSize: "0.85rem",
                color: "var(--text-secondary)",
                lineHeight: 1.6,
              }}
            >
              <div>• ค่าน้ำ: ฿{modalRoom.water_rate} ต่อหน่วย</div>
              <div>• ค่าไฟ: ฿{modalRoom.electric_rate} ต่อหน่วย</div>
              <div>• เงินประกันห้อง: 2 เดือน (สัญญาเช่า 6 เดือนขึ้นไป)</div>
            </div>

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <a
                href={`tel:${heroPhone}`}
                className="btn btn-primary"
                style={{ flex: 1, minHeight: "46px", borderRadius: "10px", fontSize: "0.9rem" }}
              >
                <Phone size={16} />
                <span>โทรนัดดูห้อง ({heroPhone})</span>
              </a>
              <button
                type="button"
                onClick={() => setModalRoom(null)}
                className="btn btn-secondary"
                style={{ minHeight: "46px", borderRadius: "10px", padding: "0 1.25rem", fontSize: "0.9rem" }}
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pinned Announcement Modal (Bottom Sheet on Mobile, Dialog on Desktop) */}
      {viewingAnnouncement && (
        <div className="modal-overlay" onClick={() => setViewingAnnouncement(null)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ padding: "1.75rem", maxWidth: "540px" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <span
                style={{
                  background: "#e11d48",
                  color: "#ffffff",
                  padding: "0.25rem 0.65rem",
                  borderRadius: "9999px",
                  fontSize: "0.74rem",
                  fontWeight: 700,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                }}
              >
                <BadgeAlert size={13} />
                <span>ประกาศหอพัก</span>
              </span>
              <button
                type="button"
                onClick={() => setViewingAnnouncement(null)}
                aria-label="ปิดหน้าต่าง"
                style={{
                  background: "#f1f5f9",
                  border: "1px solid var(--border-color)",
                  color: "var(--text-secondary)",
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <X size={18} />
              </button>
            </div>

            <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "0.75rem", lineHeight: 1.35 }}>
              {viewingAnnouncement.title}
            </h3>

            <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", lineHeight: 1.7, whiteSpace: "pre-wrap", marginBottom: "1.5rem" }}>
              {viewingAnnouncement.content}
            </p>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
              <button
                type="button"
                onClick={() => setViewingAnnouncement(null)}
                className="btn btn-secondary"
                style={{ minHeight: "42px", padding: "0 1.5rem", borderRadius: "8px" }}
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
