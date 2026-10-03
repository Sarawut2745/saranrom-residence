"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useDormitory } from "@/lib/store/dormitory-context";
import {
  Sparkles,
  ShieldCheck,
  Wifi,
  Car,
  Clock,
  Phone,
  MapPin,
  ChevronRight,
  Eye,
  Zap,
  Package,
  Check,
  MessageCircle,
  X,
  Star,
  Train,
  ShoppingBag,
  HelpCircle,
} from "lucide-react";

export default function HomePage() {
  const { siteContent, roomTypes, rooms } = useDormitory();

  // Selected room for modal
  const [modalRoom, setModalRoom] = useState<any | null>(null);

  // Hero interactive visual tab preview
  const [heroActiveTab, setHeroActiveTab] = useState<string>("building");

  // FAQ accordion state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Sticky Bar visibility on scroll
  const [showStickyBar, setShowStickyBar] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowStickyBar(true);
      } else {
        setShowStickyBar(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Content configuration
  const heroSection = siteContent.find((s) => s.section_key === "hero") || siteContent[0];
  const amenitiesSection = siteContent.find((s) => s.section_key === "amenities");
  const contactSection = siteContent.find((s) => s.section_key === "contact");

  const heroPhone = heroSection?.content_json?.phone || "081-999-8888";
  const lineOaUrl = process.env.NEXT_PUBLIC_LINE_OA_URL || "https://lin.ee/ryw8d3c";

  // Available rooms for count
  const availableRooms = rooms.filter((r) => r.status === "available");

  // Hero Preview Map
  const heroPreviewData: Record<
    string,
    { title: string; subtitle: string; price?: string; size?: string; img: string; roomObj?: any }
  > = {
    building: {
      title: "เดอะ สราญรมย์ เรสซิเดนซ์",
      subtitle: "หอพักสไตล์ Modern Japandi ซอยสุขุมวิท 71",
      size: "4 ชั้น 18 ห้องพัก",
      img: "/images/property/residence-building.jpg",
    },
    studio: {
      title: "Studio Standard",
      subtitle: "ห้องสตูดิโอมีระเบียง โต๊ะทำงานไม้โอ๊ค",
      price: "฿4,500/เดือน",
      size: "28 ตร.ม.",
      img: "/images/rooms/studio-standard.jpg",
      roomObj: roomTypes.find((t) => t.id === "11111111-1111-1111-1111-111111111101" || t.id === "rt-1"),
    },
    deluxe: {
      title: "Deluxe Corner Room",
      subtitle: "ห้องมุมวิวเปิดโล่ง มีโซฟาและเตียง King Size",
      price: "฿5,500/เดือน",
      size: "35 ตร.ม.",
      img: "/images/rooms/deluxe-corner.jpg",
      roomObj: roomTypes.find((t) => t.id === "11111111-1111-1111-1111-111111111102" || t.id === "rt-2"),
    },
    suite: {
      title: "1-Bedroom Executive Suite",
      subtitle: "ห้องชุด 1 ห้องนอนแยกส่วน มีครัวและมุมนั่งเล่น",
      price: "฿7,500/เดือน",
      size: "45 ตร.ม.",
      img: "/images/rooms/executive-suite.jpg",
      roomObj: roomTypes.find((t) => t.id === "11111111-1111-1111-1111-111111111103" || t.id === "rt-3"),
    },
    entrance: {
      title: "ทางเข้าและล็อบบี้ต้อนรับ",
      subtitle: "จุดรับ-ส่งกว้าง มีสวนร่มรื่นหน้าอาคาร",
      size: "บริการ 24 ชม.",
      img: "/images/property/residence-entrance.jpg",
    },
  };

  const currentPreview = heroPreviewData[heroActiveTab] || heroPreviewData.building;

  // Key neighborhood highlights (Distilled & concise)
  const locationHighlights = [
    {
      name: "สถานีรถไฟฟ้า BTS พระโขนง",
      desc: "นั่งวิน 3 นาที หรือเดิน 10 นาที ต่อรถไปอโศก-สยามได้เลย",
      time: "3 นาที",
      icon: Train,
    },
    {
      name: "ทางพิเศษฉลองรัช (รามอินทรา-อาจณรงค์)",
      desc: "ขึ้น-ลงทางด่วนซอย 71 ไปพระราม 9 ลาดพร้าว หรือสุวรรณภูมิได้สะดวก",
      time: "5 นาที",
      icon: Car,
    },
    {
      name: "MaxValu 24h & W District",
      desc: "ซูเปอร์มาร์เก็ตเปิด 24 ชม. มีร้านอาหาร คาเฟ่ตลอดซอย",
      time: "เดิน 3-5 นาที",
      icon: ShoppingBag,
    },
    {
      name: "โรงพยาบาลสุขุมวิท & ม.กรุงเทพ",
      desc: "ใกล้โรงพยาบาลและมหาวิทยาลัย เดินทางไม่กี่นาที",
      time: "6 นาที",
      icon: ShieldCheck,
    },
  ];

  // FAQs
  const faqList = [
    {
      q: "สัญญาเช่าขั้นต่ำกี่เดือน และมีโปรโมชั่นหรือไม่?",
      a: "สัญญาเช่าขั้นต่ำ 6 เดือนครับ ถ้าทำ 12 เดือนขึ้นไปจะได้ส่วนลดค่าเช่า 5% และจอดรถฟรีตามเงื่อนไข",
    },
    {
      q: "เงินประกันห้องพักคิดอย่างไร และจะได้รับคืนเมื่อใด?",
      a: "เก็บประกัน 2 เดือน คืนเต็มจำนวนตอนหมดสัญญา หลังหักค่าน้ำค่าไฟค้างจ่ายและตรวจสภาพห้องเรียบร้อยครับ",
    },
    {
      q: "อัตราค่าน้ำประปาและค่าไฟฟ้าคิดตามจริงอย่างไร?",
      a: "ค่าน้ำ ฿18/หน่วย ค่าไฟ ฿8/หน่วย จดมิเตอร์ทุกสิ้นเดือน ดูภาพถ่ายมิเตอร์และประวัติใช้งานย้อนหลังได้ในระบบผู้เช่าตลอดครับ",
    },
    {
      q: "หอพักมีที่จอดรถรองรับหรือไม่ และระบบความปลอดภัยเป็นอย่างไร?",
      a: "มีที่จอดรถในร่มทั้งรถยนต์และมอเตอร์ไซค์ครับ กล้อง CCTV ทุกชั้น ประตูล็อคคีย์การ์ดแยกชั้น และห้องพักทุกห้องเป็น Digital Door Lock",
    },
    {
      q: "หากพบปัญหาหรืออุปกรณ์ในห้องชำรุด มีช่างดูแลอย่างไร?",
      a: "มีช่างประจำหอพักครับ แจ้งซ่อมผ่านระบบผู้เช่าได้เลย กด 'แจ้งซ่อม' แนบรูปมาได้ตลอด 24 ชม. ช่างจะนัดเข้าดูให้เร็วที่สุด",
    },
  ];

  return (
    <div style={{ position: "relative", minHeight: "100vh", background: "transparent", overflow: "hidden" }}>
      {/* Continuous Japandi Ambient Canvas & Architectural Lighting System */}
      <div className="ambient-canvas-wrapper" aria-hidden="true">
        <div className="ambient-grid-pattern" />
        <div className="ambient-glow-orb-top" />
        <div className="ambient-glow-orb-mid" />
        <div className="ambient-glow-orb-lower" />
      </div>

      {/* 1. Hero Section - Modern Split Grid with Interactive Preview */}
      <section style={{ position: "relative", paddingTop: "2.75rem", paddingBottom: "3rem", zIndex: 2 }}>
        <div className="container">
          <div className="hero-split-grid">
            {/* Left Column: Compelling Editorial & Direct Action */}
            <div>
              {/* Tagline Pill */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.45rem",
                  padding: "0.4rem 1rem",
                  borderRadius: "9999px",
                  background: "linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(254, 243, 199, 0.8))",
                  border: "1px solid rgba(245, 158, 11, 0.35)",
                  boxShadow: "0 2px 10px rgba(245, 158, 11, 0.12)",
                  color: "#b45309",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  marginBottom: "1.2rem",
                }}
              >
                <Sparkles size={14} style={{ color: "#d97706" }} />
                <span>เปิดจองห้องพักว่างสุขุมวิท 71 • สัญญา 6 เดือนขึ้นไป</span>
              </div>

              {/* Main Headline */}
              <h1
                style={{
                  fontSize: "clamp(2.2rem, 4.2vw, 3.2rem)",
                  fontWeight: 800,
                  color: "var(--text-primary)",
                  lineHeight: 1.15,
                  marginBottom: "0.5rem",
                  letterSpacing: "-0.025em",
                }}
              >
                เดอะ สราญรมย์ เรสซิเดนซ์
              </h1>
              <div
                style={{
                  fontFamily: "var(--font-serif-accent)",
                  fontStyle: "italic",
                  fontSize: "1.2rem",
                  color: "#4f46e5",
                  marginBottom: "1.1rem",
                }}
              >
                The Saranrom Residence & Apartment • Sukhumvit 71
              </div>

              {/* Subheading */}
              <p
                style={{
                  fontSize: "1.02rem",
                  color: "var(--text-secondary)",
                  lineHeight: 1.68,
                  marginBottom: "1.5rem",
                }}
              >
                หอพักสไตล์ Modern Japandi ซอยสุขุมวิท 71 เงียบสงบ ใกล้ BTS พระโขนงแค่ 3 นาที
                เฟอร์นิเจอร์ไม้โอ๊คครบ มีช่างประจำดูแล 24 ชม.
              </p>

              {/* 4 Feature Checklist Highlights */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0.6rem",
                  marginBottom: "2rem",
                }}
              >
                {[
                  "ใกล้ BTS พระโขนง (นั่งวิน 3 นาที)",
                  "เฟอร์นิเจอร์ไม้โอ๊คครบ + แอร์ Inverter",
                  "CCTV 24 ชม. + คีย์การ์ดล็อคเฉพาะชั้น",
                  "High-speed Fiber Wi-Fi แยกทุกชั้น",
                ].map((text, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.45rem",
                      fontSize: "0.84rem",
                      color: "var(--text-primary)",
                      fontWeight: 600,
                    }}
                  >
                    <div
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        background: "rgba(5, 150, 105, 0.15)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#059669",
                        flexShrink: 0,
                      }}
                    >
                      <Check size={12} />
                    </div>
                    <span>{text}</span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  flexWrap: "wrap",
                  marginBottom: "2rem",
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

                <a
                  href={lineOaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn"
                  style={{
                    fontSize: "0.95rem",
                    padding: "0.75rem 1.4rem",
                    minHeight: "48px",
                    borderRadius: "10px",
                    background: "#06c755",
                    color: "#ffffff",
                    border: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    fontWeight: 600,
                    boxShadow: "0 2px 10px rgba(6, 199, 85, 0.25)",
                  }}
                >
                  <MessageCircle size={18} />
                  <span>แชท LINE OA</span>
                </a>

                <a
                  href={`tel:${heroPhone}`}
                  className="btn btn-secondary"
                  style={{
                    fontSize: "0.92rem",
                    padding: "0.75rem 1.15rem",
                    minHeight: "48px",
                    borderRadius: "10px",
                  }}
                >
                  <Phone size={16} style={{ color: "#059669" }} />
                  <span>{heroPhone}</span>
                </a>
              </div>

              {/* 3 Metric Pills */}
              <div
                style={{
                  display: "flex",
                  gap: "1.25rem",
                  padding: "0.85rem 1.25rem",
                  background: "rgba(255, 255, 255, 0.78)",
                  backdropFilter: "blur(12px)",
                  borderRadius: "14px",
                  border: "1px solid rgba(226, 232, 240, 0.85)",
                  boxShadow: "0 4px 16px -4px rgba(15, 23, 42, 0.05)",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <div className="tabular-nums" style={{ fontSize: "1.45rem", fontWeight: 800, color: "#065f46" }}>
                    {availableRooms.length} ห้อง
                  </div>
                  <div style={{ fontSize: "0.76rem", color: "var(--text-muted)", fontWeight: 500 }}>
                    พร้อมเข้าอยู่ทันที
                  </div>
                </div>
                <div style={{ width: 1, background: "rgba(15, 23, 42, 0.08)" }} />
                <div>
                  <div className="tabular-nums" style={{ fontSize: "1.45rem", fontWeight: 800, color: "#4f46e5" }}>
                    ฿4,500
                  </div>
                  <div style={{ fontSize: "0.76rem", color: "var(--text-muted)", fontWeight: 500 }}>
                    เริ่มต้น / เดือน
                  </div>
                </div>
                <div style={{ width: 1, background: "rgba(15, 23, 42, 0.08)" }} />
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <span style={{ fontSize: "1.45rem", fontWeight: 800, color: "#c2410c" }}>4.9</span>
                    <div style={{ display: "flex", color: "#f59e0b" }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} fill="#f59e0b" />
                      ))}
                    </div>
                  </div>
                  <div style={{ fontSize: "0.76rem", color: "var(--text-muted)", fontWeight: 500 }}>
                    ความพึงพอใจผู้เช่าจริง
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Visual Showcase Hub */}
            <div>
              <div
                className="bento-card"
                style={{
                  padding: "0.75rem",
                  borderRadius: "20px",
                  background: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(16px)",
                  boxShadow: "0 16px 40px -10px rgba(15, 23, 42, 0.12), 0 0 0 1px rgba(245, 158, 11, 0.08)",
                  border: "1px solid rgba(226, 232, 240, 0.9)",
                }}
              >
                {/* Segmented Switcher Tabs */}
                <div
                  style={{
                    display: "flex",
                    gap: "0.35rem",
                    padding: "0.35rem",
                    background: "#f1f5f9",
                    borderRadius: "12px",
                    marginBottom: "0.75rem",
                    overflowX: "auto",
                    scrollbarWidth: "none",
                  }}
                >
                  {[
                    { key: "building", label: "ตัวอาคาร" },
                    { key: "studio", label: "Studio 28ม²" },
                    { key: "deluxe", label: "Deluxe 35ม²" },
                    { key: "suite", label: "Suite 45ม²" },
                    { key: "entrance", label: "ทางเข้า/ล็อบบี้" },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setHeroActiveTab(tab.key)}
                      className={`hero-preview-tab ${heroActiveTab === tab.key ? "active" : ""}`}
                      style={{ flexShrink: 0 }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Main Interactive Preview Container */}
                <div
                  style={{
                    position: "relative",
                    height: 380,
                    width: "100%",
                    borderRadius: "14px",
                    overflow: "hidden",
                    background: "#0f172a",
                  }}
                >
                  <img
                    key={currentPreview.img}
                    src={currentPreview.img}
                    alt={currentPreview.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "opacity 0.3s ease",
                    }}
                  />



                  {/* Bottom Gradient Glass Overlay */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background:
                        "linear-gradient(to top, rgba(15, 23, 42, 0.92) 0%, rgba(15, 23, 42, 0.45) 60%, transparent 100%)",
                      padding: "1.5rem",
                      color: "#ffffff",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-end",
                      gap: "1rem",
                      flexWrap: "wrap",
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                        <h3 style={{ fontSize: "1.25rem", fontWeight: 800, margin: 0, color: "#ffffff" }}>
                          {currentPreview.title}
                        </h3>
                        {currentPreview.size && (
                          <span
                            style={{
                              background: "rgba(255, 255, 255, 0.2)",
                              backdropFilter: "blur(6px)",
                              fontSize: "0.72rem",
                              padding: "0.15rem 0.5rem",
                              borderRadius: "6px",
                              fontWeight: 600,
                            }}
                          >
                            {currentPreview.size}
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: "0.82rem", opacity: 0.9, margin: 0, maxWidth: 320 }}>
                        {currentPreview.subtitle}
                      </p>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      {currentPreview.price && (
                        <div
                          className="tabular-nums"
                          style={{
                            background: "rgba(255, 255, 255, 0.95)",
                            color: "#4f46e5",
                            fontWeight: 800,
                            fontSize: "0.95rem",
                            padding: "0.35rem 0.75rem",
                            borderRadius: "8px",
                          }}
                        >
                          {currentPreview.price}
                        </div>
                      )}

                      {currentPreview.roomObj ? (
                        <button
                          type="button"
                          onClick={() => setModalRoom(currentPreview.roomObj)}
                          className="btn btn-sm"
                          style={{
                            background: "#4f46e5",
                            color: "#ffffff",
                            border: "none",
                            borderRadius: "8px",
                            padding: "0.4rem 0.75rem",
                            fontSize: "0.8rem",
                            fontWeight: 700,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.3rem",
                          }}
                        >
                          <Eye size={13} />
                          <span>ดูสเปก</span>
                        </button>
                      ) : (
                        <a
                          href="#rooms"
                          className="btn btn-sm"
                          style={{
                            background: "#ffffff",
                            color: "#0f172a",
                            border: "none",
                            borderRadius: "8px",
                            padding: "0.4rem 0.75rem",
                            fontSize: "0.8rem",
                            fontWeight: 700,
                          }}
                        >
                          <span>ดูทุกแบบ</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Room Showcase Section */}
      <section id="rooms" style={{ position: "relative", padding: "3.5rem 0", zIndex: 2 }}>
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 2.5rem" }}>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "0.4rem" }}>
              แบบห้องพักและอัตราค่าเช่า
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
              ดูแบบห้องที่ถูกใจ ทุกห้องตกแต่งครบพร้อมอยู่ มีห้องน้ำในตัวและระเบียงส่วนตัว
            </p>
          </div>

          {/* Room Type Bento Cards Grid */}
          <div className="grid-responsive-3">
            {roomTypes.map((rt) => {
              const roomsOfType = rooms.filter((r) => r.room_type_id === rt.id);
              const availableCount = roomsOfType.filter((r) => r.status === "available").length;

              return (
                <div
                  key={rt.id}
                  className="bento-card hover-card-lift"
                  style={{ display: "flex", flexDirection: "column", overflow: "hidden", borderRadius: "18px" }}
                >
                  {/* Room Image Container */}
                  <div style={{ position: "relative", height: 230, width: "100%", overflow: "hidden" }}>
                    <img
                      src={rt.image_url || "/images/rooms/studio-standard.jpg"}
                      alt={rt.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.4s ease",
                      }}
                    />

                    {/* Room Availability Status Badge */}
                    <div style={{ position: "absolute", top: 12, right: 12 }}>
                      {availableCount > 0 ? (
                        <span
                          style={{
                            background: "rgba(255, 255, 255, 0.96)",
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
                            background: "rgba(255, 255, 255, 0.96)",
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
                  <div style={{ padding: "1.5rem", flex: 1, display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.35rem" }}>
                      <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
                        {rt.name}
                      </h3>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          color: "#4f46e5",
                          background: "rgba(79, 70, 229, 0.08)",
                          padding: "0.2rem 0.5rem",
                          borderRadius: "6px",
                        }}
                      >
                        {rt.id.includes("3") ? "45 ตร.ม." : rt.id.includes("2") ? "35 ตร.ม." : "28 ตร.ม."}
                      </span>
                    </div>

                    <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", lineHeight: 1.55, marginBottom: "1.1rem" }}>
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

                    {/* Card Footer Actions */}
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
                      <div style={{ fontSize: "0.76rem", color: "var(--text-muted)" }}>
                        ค่าน้ำ ฿{rt.water_rate} • ค่าไฟ ฿{rt.electric_rate}/หน่วย
                      </div>
                      <div style={{ display: "flex", gap: "0.4rem" }}>
                        <button
                          type="button"
                          onClick={() => setModalRoom(rt)}
                          className="btn btn-secondary btn-sm"
                          style={{
                            fontWeight: 600,
                            fontSize: "0.8rem",
                            padding: "0.35rem 0.75rem",
                            borderRadius: "8px",
                          }}
                        >
                          <Eye size={13} />
                          <span>รายละเอียด</span>
                        </button>
                        <a
                          href={`tel:${heroPhone}`}
                          className="btn btn-primary btn-sm"
                          style={{
                            fontWeight: 600,
                            fontSize: "0.8rem",
                            padding: "0.35rem 0.75rem",
                            borderRadius: "8px",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.3rem",
                          }}
                        >
                          <Phone size={13} />
                          <span>โทรสอบถาม</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 3. Amenities Section - 6 Bento Cards */}
      <section
        id="amenities"
        style={{
          position: "relative",
          padding: "4rem 0",
          background: "linear-gradient(180deg, transparent 0%, rgba(245, 243, 238, 0.55) 20%, rgba(245, 243, 238, 0.55) 80%, transparent 100%)",
          zIndex: 2,
        }}
      >
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 2.5rem" }}>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "0.4rem" }}>
              สิ่งอำนวยความสะดวกครบครัน
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
              อยู่สะดวก ปลอดภัย ไม่ต้องกังวลเรื่องอะไร
            </p>
          </div>

          <div className="grid-responsive-3">
            {[
              {
                icon: ShieldCheck,
                title: "ระบบกล้อง CCTV 24 ชม.",
                desc: "กล้องครอบคลุมทุกทางเดิน ทางเข้า-ออก และลิฟต์ พร้อมระบบคีย์การ์ดล็อคเฉพาะชั้น",
              },
              {
                icon: Wifi,
                title: "High-Speed Fiber Wi-Fi",
                desc: "เน็ตไฟเบอร์แยก Access Point ทุกชั้น สัญญาณแรงทั่วถึง ทำงานที่ห้องได้สบาย",
              },
              {
                icon: Car,
                title: "ที่จอดรถยนต์ & มอเตอร์ไซค์",
                desc: "ที่จอดรถในร่มกว้าง ปลอดภัย มีไฟสว่างและจุดชาร์จ EV",
              },
              {
                icon: Zap,
                title: "ชำระเงินผ่าน QR Code ทันใจ",
                desc: "จ่ายค่าเช่า ค่าน้ำ-ไฟ สแกน QR ผ่าน Mobile Banking แนบสลิปได้เลย 24 ชม.",
              },
              {
                icon: Package,
                title: "Smart Parcel Drop ตู้รับพัสดุ",
                desc: "มีตู้รับพัสดุเป็นระเบียบ ไม่ต้องห่วงเรื่องของหายหรือเปียกฝน",
              },
              {
                icon: Clock,
                title: "ทีมช่างและนิติบุคคลประจำ",
                desc: "แจ้งซ่อมออนไลน์ได้เลย ช่างเข้าดูให้เร็ว",
              },
            ].map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div
                  key={idx}
                  className="bento-card hover-card-lift"
                  style={{ padding: "1.65rem", display: "flex", gap: "1.1rem", alignItems: "flex-start", borderRadius: "16px" }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: "12px",
                      background: "rgba(79, 70, 229, 0.08)",
                      border: "1px solid rgba(79, 70, 229, 0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#4f46e5",
                      flexShrink: 0,
                    }}
                  >
                    <IconComp size={24} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.3rem" }}>
                      {item.title}
                    </h3>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.86rem", lineHeight: 1.55, margin: 0 }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Location & Commute Highlights */}
      <section
        id="location"
        style={{
          position: "relative",
          padding: "4rem 0",
          background: "linear-gradient(180deg, transparent 0%, rgba(243, 244, 246, 0.65) 15%, rgba(245, 242, 235, 0.7) 85%, transparent 100%)",
          zIndex: 2,
        }}
      >
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 2.5rem" }}>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "0.4rem" }}>
              ทำเลศักยภาพ & การเดินทาง
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
              อยู่ซอยสุขุมวิท 71 (ปรีดี พนมยงค์) ใกล้ BTS พระโขนง ทางด่วน ร้านอาหาร และคอมมูนิตี้มอลล์
            </p>
          </div>

          {/* Location 4 Highlights Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {locationHighlights.map((place, idx) => {
              const PlaceIcon = place.icon;
              return (
                <div
                  key={idx}
                  className="bento-card hover-card-lift"
                  style={{
                    padding: "1.5rem",
                    borderRadius: "16px",
                    background: "#ffffff",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.85rem" }}>
                    <div
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: "10px",
                        background: "rgba(5, 150, 105, 0.1)",
                        color: "#059669",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <PlaceIcon size={20} />
                    </div>
                    <span
                      style={{
                        background: "rgba(5, 150, 105, 0.12)",
                        color: "#065f46",
                        padding: "0.25rem 0.65rem",
                        borderRadius: "9999px",
                        fontSize: "0.76rem",
                        fontWeight: 700,
                      }}
                    >
                      {place.time}
                    </span>
                  </div>

                  <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "0.35rem" }}>
                    {place.name}
                  </h3>
                  <p style={{ fontSize: "0.86rem", color: "var(--text-secondary)", lineHeight: 1.55, margin: 0 }}>
                    {place.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Resident Testimonials & Community Reviews */}
      <section style={{ position: "relative", padding: "3.5rem 0", zIndex: 2 }}>
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 2.5rem" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
                padding: "0.3rem 0.75rem",
                borderRadius: "9999px",
                background: "rgba(245, 158, 11, 0.1)",
                color: "#b45309",
                fontSize: "0.8rem",
                fontWeight: 700,
                marginBottom: "0.75rem",
              }}
            >
              <Star size={14} fill="#f59e0b" />
              <span>คะแนนความพึงพอใจ 4.9 จาก 5 ดาว (รีวิวจริงจากลูกบ้าน)</span>
            </div>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "0.4rem" }}>
              เสียงจากผู้เช่าจริง
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
              รีวิวจากลูกบ้านที่อยู่จริงที่ เดอะ สราญรมย์ เรสซิเดนซ์
            </p>
          </div>

          <div className="grid-responsive-3">
            {[
              {
                name: "คุณนัทธิยา (คุณนัท)",
                room: "ผู้เช่าห้อง 201 • พักอาศัย 1 ปี 4 เดือน",
                quote:
                  "ชอบบรรยากาศมาก เงียบสงบ ไม่วุ่นวาย เหมาะกับคน Work from home สไตล์ห้องไม้โอ๊คสวยตรงปกเหมือนในรูป มีระเบียงรับลม นิติบุคคลพูดจาดีมาก ประทับใจค่ะ",
                rating: 5,
              },
              {
                name: "คุณพงศกร (คุณมาร์ค)",
                room: "ผู้เช่าห้อง 302 • พักอาศัย 8 เดือน",
                quote:
                  "ทำเลดีมาก นั่งวินมอเตอร์ไซค์ 3 นาทีถึง BTS พระโขนง ของกินแถวสุขุมวิท 71 มีให้เลือกทั้งวันทั้งคืน ระบบจ่ายค่าเช่าสแกน QR ผ่านเว็บสะดวก ไม่ต้องคอยทักไลน์ตามบิล",
                rating: 5,
              },
              {
                name: "คุณธนภัทร (คุณเจมส์)",
                room: "ผู้เช่าห้อง 401 • พักอาศัย 1 ปีเต็ม",
                quote:
                  "เคยแจ้งซ่อมแอร์ไปตอนเช้า บ่ายช่างก็เข้าตรวจเช็คให้เลย บริการเร็วมาก ระบบคีย์การ์ดล็อคชั้นทำให้รู้สึกปลอดภัย คุ้มค่ากับราคาค่าเช่า แนะนำเลยครับ",
                rating: 5,
              },
            ].map((review, idx) => (
              <div
                key={idx}
                className="review-card hover-card-lift"
                style={{
                  background: "linear-gradient(145deg, #ffffff 0%, #fffdfa 100%)",
                  border: "1px solid rgba(245, 158, 11, 0.22)",
                  borderTop: "3.5px solid #f59e0b",
                  boxShadow: "0 8px 24px -6px rgba(245, 158, 11, 0.08)",
                  borderRadius: "16px",
                  padding: "1.75rem",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div style={{ display: "flex", gap: "0.2rem", color: "#f59e0b", marginBottom: "0.75rem" }}>
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} size={15} fill="#f59e0b" />
                  ))}
                </div>
                <p style={{ fontSize: "0.92rem", color: "var(--text-secondary)", lineHeight: 1.65, fontStyle: "italic", marginBottom: "1.25rem" }}>
                  "{review.quote}"
                </p>
                <div style={{ marginTop: "auto", borderTop: "1px solid var(--border-color)", paddingTop: "0.75rem" }}>
                  <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "var(--text-primary)" }}>
                    {review.name}
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                    {review.room}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Interactive FAQ Accordion */}
      <section
        style={{
          position: "relative",
          padding: "4rem 0",
          background: "linear-gradient(180deg, transparent 0%, rgba(245, 243, 238, 0.5) 20%, rgba(245, 243, 238, 0.5) 80%, transparent 100%)",
          zIndex: 2,
        }}
      >
        <div className="container" style={{ maxWidth: 840 }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
                padding: "0.3rem 0.75rem",
                borderRadius: "9999px",
                background: "rgba(79, 70, 229, 0.08)",
                color: "#4f46e5",
                fontSize: "0.8rem",
                fontWeight: 700,
                marginBottom: "0.75rem",
              }}
            >
              <HelpCircle size={14} />
              <span>คลายข้อสงสัย</span>
            </div>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "0.4rem" }}>
              คำถามที่พบบ่อย (FAQ)
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
              รวมคำถามที่คนสนใจเช่ามักถามบ่อยๆ
            </p>
          </div>

          <div>
            {faqList.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div key={index} className={`faq-item ${isOpen ? "open" : ""}`}>
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="faq-question-btn"
                  >
                    <span>{faq.q}</span>
                    <ChevronRight
                      size={18}
                      style={{
                        transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                        transition: "transform 0.2s ease",
                        color: isOpen ? "#4f46e5" : "var(--text-muted)",
                        flexShrink: 0,
                      }}
                    />
                  </button>
                  {isOpen && (
                    <div className="faq-answer">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. Concierge & Office Contact Section */}
      <section id="contact" style={{ position: "relative", padding: "4rem 0", zIndex: 2 }}>
        <div className="container">
          <div
            className="bento-card"
            style={{
              padding: "2.75rem",
              borderRadius: "24px",
              background: "linear-gradient(145deg, #0f172a 0%, #1e1b4b 60%, #0f172a 100%)",
              border: "1px solid rgba(255, 255, 255, 0.14)",
              boxShadow: "0 24px 60px -12px rgba(15, 23, 42, 0.4)",
              color: "#ffffff",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "2.5rem",
                alignItems: "center",
              }}
            >
              <div>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    padding: "0.3rem 0.8rem",
                    borderRadius: "9999px",
                    background: "rgba(255, 255, 255, 0.1)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    color: "#fde68a",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    marginBottom: "1rem",
                  }}
                >
                  <Sparkles size={13} style={{ color: "#f59e0b" }} />
                  <span>ติดต่อหอพัก</span>
                </div>

                <h2 style={{ fontSize: "2rem", fontWeight: 800, color: "#ffffff", marginBottom: "0.6rem", letterSpacing: "-0.02em" }}>
                  ติดต่อหอพัก เดอะ สราญรมย์ เรสซิเดนซ์
                </h2>
                <p style={{ color: "#cbd5e1", fontSize: "0.95rem", marginBottom: "1.75rem", lineHeight: 1.65 }}>
                  เปิดทุกวัน สอบถามห้องว่าง ค่าเช่า หรือเส้นทาง โทรหรือแชท LINE ได้เลยครับ
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem", marginBottom: "2rem" }}>
                  <div style={{ display: "flex", gap: "0.85rem", alignItems: "center" }}>
                    <div
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: "10px",
                        background: "rgba(16, 185, 129, 0.18)",
                        border: "1px solid rgba(16, 185, 129, 0.3)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#34d399",
                        flexShrink: 0,
                      }}
                    >
                      <Phone size={18} />
                    </div>
                    <div>
                      <span style={{ display: "block", color: "#94a3b8", fontSize: "0.78rem", fontWeight: 500 }}>
                        โทรหาเรา:
                      </span>
                      <a href={`tel:${heroPhone}`} style={{ color: "#34d399", fontWeight: 800, fontSize: "1.2rem" }}>
                        {heroPhone}
                      </a>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "0.85rem", alignItems: "flex-start" }}>
                    <div
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: "10px",
                        background: "rgba(99, 102, 241, 0.2)",
                        border: "1px solid rgba(99, 102, 241, 0.35)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#a5b4fc",
                        flexShrink: 0,
                      }}
                    >
                      <MapPin size={18} />
                    </div>
                    <div>
                      <span style={{ display: "block", color: "#94a3b8", fontSize: "0.78rem", fontWeight: 500 }}>
                        ที่อยู่:
                      </span>
                      <span style={{ color: "#f8fafc", fontSize: "0.9rem", fontWeight: 500 }}>
                        128/9 ซอยสุขุมวิท 71 แขวงพระโขนงเหนือ เขตวัฒนา กรุงเทพฯ 10110 (ใกล้ BTS พระโขนง 3 นาที)
                      </span>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "0.85rem", alignItems: "center" }}>
                    <div
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: "10px",
                        background: "rgba(255, 255, 255, 0.1)",
                        border: "1px solid rgba(255, 255, 255, 0.18)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#f1f5f9",
                        flexShrink: 0,
                      }}
                    >
                      <Clock size={18} />
                    </div>
                    <div>
                      <span style={{ display: "block", color: "#94a3b8", fontSize: "0.78rem", fontWeight: 500 }}>
                        เวลาทำการ:
                      </span>
                      <span style={{ color: "#f8fafc", fontSize: "0.9rem", fontWeight: 500 }}>
                        08:30 - 18:00 น. (เปิดให้บริการทุกวัน)
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                  <a
                    href={`tel:${heroPhone}`}
                    className="btn"
                    style={{
                      minHeight: "48px",
                      flex: "1 1 180px",
                      borderRadius: "12px",
                      fontSize: "0.92rem",
                      fontWeight: 700,
                      background: "#ffffff",
                      color: "#0f172a",
                      border: "none",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
                    }}
                  >
                    <Phone size={16} style={{ color: "#065f46" }} />
                    <span>โทรติดต่อสำนักงาน ({heroPhone})</span>
                  </a>
                  <a
                    href={lineOaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn"
                    style={{
                      minHeight: "48px",
                      flex: "1 1 180px",
                      borderRadius: "12px",
                      background: "#06c755",
                      color: "#ffffff",
                      border: "none",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      fontSize: "0.92rem",
                      fontWeight: 700,
                      boxShadow: "0 4px 16px rgba(6, 199, 85, 0.35)",
                    }}
                  >
                    <MessageCircle size={18} />
                    <span>แชท LINE สอบถาม</span>
                  </a>
                </div>
              </div>

              {/* Photo Preview Container */}
              <div
                style={{
                  borderRadius: "20px",
                  overflow: "hidden",
                  height: 360,
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  boxShadow: "0 12px 32px rgba(0, 0, 0, 0.3)",
                }}
              >
                <img
                  src={contactSection?.image_url || "/images/property/residence-entrance.jpg"}
                  alt="ภาพหอพัก เดอะ สราญรมย์ เรสซิเดนซ์"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Sticky Floating Action Bar on Scroll */}
      {showStickyBar && (
        <aside
          aria-label="เมนูติดต่อด่วน"
          className="sticky-floating-bar"
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span className="pulsing-dot-green" />
            <span style={{ fontSize: "0.85rem", fontWeight: 700 }}>
              ห้องว่าง {availableRooms.length} ห้อง
            </span>
          </div>

          <div className="sticky-floating-actions" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <a
              href={`tel:${heroPhone}`}
              className="btn btn-sm"
              style={{
                background: "#4f46e5",
                color: "#ffffff",
                border: "none",
                borderRadius: "9999px",
                padding: "0.4rem 0.9rem",
                fontWeight: 700,
                fontSize: "0.82rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.3rem",
              }}
            >
              <Phone size={14} />
              <span>โทร {heroPhone}</span>
            </a>
            <a
              href={lineOaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm"
              style={{
                background: "#06c755",
                color: "#ffffff",
                border: "none",
                borderRadius: "9999px",
                padding: "0.4rem 0.85rem",
                fontSize: "0.82rem",
                fontWeight: 700,
                display: "inline-flex",
                alignItems: "center",
                gap: "0.3rem",
              }}
            >
              <MessageCircle size={14} />
              <span>แชท LINE OA</span>
            </a>
          </div>
        </aside>
      )}

      {/* 9. Room Detail Modal */}
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

            <div style={{ borderRadius: "10px", overflow: "hidden", height: 220, marginBottom: "1.25rem", border: "1px solid var(--border-color)" }}>
              <img
                src={modalRoom.image_url || "/images/rooms/studio-standard.jpg"}
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
              <div>• ค่าน้ำประปา: ฿{modalRoom.water_rate} ต่อหน่วย</div>
              <div>• ค่าไฟฟ้า: ฿{modalRoom.electric_rate} ต่อหน่วย</div>
              <div>• เงินประกันสัญญา: 2 เดือน (สัญญาเช่า 6 เดือนขึ้นไป)</div>
            </div>

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <a
                href={`tel:${heroPhone}`}
                className="btn btn-primary"
                style={{ flex: 1, minHeight: "46px", borderRadius: "10px", fontSize: "0.9rem", fontWeight: 700, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.4rem" }}
              >
                <Phone size={16} />
                <span>โทรติดต่อห้องนี้ ({heroPhone})</span>
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
    </div>
  );
}
