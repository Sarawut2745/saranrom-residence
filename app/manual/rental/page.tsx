"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDormitory } from "@/lib/store/dormitory-context";
import "../manual.css";
import {
  BookOpen,
  ArrowLeft,
  Download,
  Printer,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  Info,
  ShieldCheck,
  Maximize2,
  X,
  PhoneCall,
  HelpCircle,
  Smartphone,
  Receipt,
  Wrench,
  Menu,
  Home,
} from "lucide-react";

interface ManualChapter {
  id: string;
  number: string;
  title: string;
  shortTitle: string;
  description: string;
}

const chapters: ManualChapter[] = [
  {
    id: "quickstart",
    number: "⭐",
    title: "คู่มือฉบับเข้าใจง่ายที่สุด (สำหรับผู้เช่าห้องพัก)",
    shortTitle: "⭐ สำหรับผู้เริ่มต้น (อ่านง่าย)",
    description: "จ่ายค่าเช่าและแจ้งซ่อมใน 3 ก้าว ไม่ใช้ศัพท์เทคนิค เข้าใจง่ายที่สุด",
  },
  {
    id: "ch1",
    number: "บทที่ 1",
    title: "การเข้าสู่ระบบผู้เช่า",
    shortTitle: "1. เข้าสู่ระบบ",
    description: "ขั้นตอนการเข้าใช้งานระบบด้วยอีเมลและรหัสผ่านของผู้เช่า",
  },
  {
    id: "ch2",
    number: "บทที่ 2",
    title: "หน้าหลักผู้เช่า",
    shortTitle: "2. หน้าหลักแดชบอร์ด",
    description: "การดูภาพรวมห้องพัก บิลค้างชำระ และเมนูด่วน",
  },
  {
    id: "ch3",
    number: "บทที่ 3",
    title: "การชำระเงินและบิลรายเดือน",
    shortTitle: "3. ชำระบิลและ QR",
    description: "ดูรายการบิล สแกน QR PromptPay อัปโหลดสลิป และรับใบเสร็จ",
  },
  {
    id: "ch4",
    number: "บทที่ 4",
    title: "การแจ้งซ่อมบำรุงห้องพัก",
    shortTitle: "4. การแจ้งซ่อม",
    description: "แจ้งปัญหาเครื่องใช้ไฟฟ้า น้ำรั่ว แอร์ พร้อมแนบรูปถ่าย",
  },
  {
    id: "ch5",
    number: "บทที่ 5",
    title: "การติดตามประกาศหอพัก",
    shortTitle: "5. ประกาศหอพัก",
    description: "รับทราบข่าวสารสำคัญ ล้างถังพักน้ำ กำจัดแมลง และช่องทาง LINE OA",
  },
  {
    id: "ch6",
    number: "บทที่ 6",
    title: "ข้อมูลผู้เช่าและสัญญาเช่า",
    shortTitle: "6. สัญญาเช่า",
    description: "ตรวจสอบระยะเวลาสัญญาเช่า เงินประกัน และเบอร์ติดต่อฉุกเฉิน",
  },
  {
    id: "ch7",
    number: "บทที่ 7",
    title: "กฎระเบียบและข้อควรระวังสำคัญ",
    shortTitle: "7. ข้อควรระวัง",
    description: "ข้อกำหนดและระเบียบหอพักเพื่อความปลอดภัยและความสงบเรียบร้อย",
  },
  {
    id: "ch8",
    number: "บทที่ 8",
    title: "คำถามที่พบบ่อย",
    shortTitle: "8. คำถามที่พบบ่อย",
    description: "รวมข้อสงสัยและคำถามที่พบบ่อยเกี่ยวกับการใช้งานระบบและการพักอาศัย",
  },
];

export default function RentalManualPage() {
  const router = useRouter();
  const { currentUser, currentRentalProfile, isLoading } = useDormitory();

  useEffect(() => {
    if (!isLoading) {
      if (!currentUser) {
        router.replace("/login");
      } else if (currentUser.role !== "rental" && !currentRentalProfile) {
        router.replace("/manual");
      }
    }
  }, [isLoading, currentUser, currentRentalProfile, router]);

  const [activeChapter, setActiveChapter] = useState("quickstart");
  const [lightboxImg, setLightboxImg] = useState<{ src: string; caption: string } | null>(null);

  if (isLoading || !currentUser || (currentUser.role !== "rental" && !currentRentalProfile)) {
    return <div style={{ minHeight: "100vh" }} />;
  }

  const scrollToSection = (id: string) => {
    setActiveChapter(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="manual-wrapper">
      {/* Lightbox Modal */}
      {lightboxImg && (
        <div className="manual-lightbox-modal" onClick={() => setLightboxImg(null)}>
          <div className="lightbox-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="lightbox-header">
              <span className="lightbox-title">{lightboxImg.caption}</span>
              <button onClick={() => setLightboxImg(null)} className="lightbox-close-btn">
                <X size={18} />
              </button>
            </div>
            <div className="lightbox-body">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={lightboxImg.src} alt={lightboxImg.caption} className="lightbox-img" />
            </div>
          </div>
        </div>
      )}

      <div className="manual-container">
        {/* Top Breadcrumb & Action Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem", paddingBottom: "1rem", borderBottom: "1px solid rgba(15, 23, 42, 0.08)" }}>
          <div className="manual-breadcrumb" style={{ margin: 0 }}>
            <Link href="/manual" style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
              <ArrowLeft size={15} />
              <span>ศูนย์คู่มือ</span>
            </Link>
            <ChevronRight size={14} />
            <span className="manual-breadcrumb-current">คู่มือผู้เช่าห้องพัก (เล่มที่ 1)</span>
          </div>

          <div className="manual-actions-row">
            <button onClick={handlePrint} className="manual-btn-secondary" style={{ padding: "0.45rem 0.9rem", fontSize: "0.82rem" }}>
              <Printer size={15} />
              <span>สั่งพิมพ์</span>
            </button>
            <a href="/manual/manual-rental.pdf" download className="manual-btn-primary" style={{ padding: "0.45rem 1rem", fontSize: "0.82rem" }}>
              <Download size={15} />
              <span>ดาวน์โหลด PDF (3.3 MB)</span>
            </a>
          </div>
        </div>

        {/* Manual Cover Banner */}
        <div className="manual-hero-rental-banner">
          <div>
            <div className="manual-tag manual-tag-banner">
              <BookOpen size={13} />
              <span>คู่มือการใช้งานระบบ - เล่มที่ 1: สำหรับผู้เช่าห้องพัก</span>
            </div>
            <h1 className="manual-hero-title-light">
              คู่มือการใช้งานระบบบริการตนเองสำหรับผู้เช่า
            </h1>
            <p className="manual-hero-desc-light">
              เดอะ สราญรมย์ เรสซิเดนซ์
              รวบรวมขั้นตอนการใช้งานตั้งแต่การเข้าสู่ระบบ ตรวจสอบบิล ชำระเงินผ่าน QR PromptPay อัปโหลดสลิป แจ้งซ่อมบำรุง
              และตรวจสอบสัญญาเช่าอย่างละเอียด พร้อมภาพประกอบจริงทุกขั้นตอน
            </p>
            <div style={{ display: "flex", gap: "1rem", fontSize: "0.75rem", color: "#a7f3d0", marginTop: "1rem", flexWrap: "wrap" }}>
              <span>ฉบับปรับปรุง: กันยายน 2026</span>
              <span>•</span>
              <span>เวอร์ชันระบบ: 1.0.0</span>
              <span>•</span>
              <span>จำนวนบท: 8 บท</span>
            </div>
          </div>
        </div>

        {/* Main Content Layout: Sidebar + Chapters */}
        <div className="rental-manual-layout">
          {/* Sticky Sidebar Navigation */}
          <div className="rental-sidebar">
            <div className="rental-sidebar-title">
              สารบัญเนื้อหา
            </div>
            <nav className="rental-sidebar-menu">
              {chapters.map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => scrollToSection(ch.id)}
                  className={`rental-sidebar-btn ${activeChapter === ch.id ? "rental-sidebar-btn-active" : ""}`}
                >
                  <span>{ch.shortTitle}</span>
                  <ChevronRight size={13} style={{ opacity: 0.5, flexShrink: 0 }} />
                </button>
              ))}
            </nav>

            <div className="rental-sidebar-contact">
              <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#0f172a", display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.3rem" }}>
                <PhoneCall size={14} style={{ color: "#065f46" }} />
                <span>ติดต่อสำนักงานหอพัก</span>
              </div>
              <p style={{ fontSize: "0.75rem", color: "#64748b", lineHeight: 1.5, margin: 0 }}>
                โทร: 02-999-8888
                <br />
                LINE OA: @saranrom-residence
              </p>
            </div>
          </div>

          {/* Chapters Content */}
          <div className="rental-content-area">
            {/* SPECIAL QUICK START: FOR BEGINNERS */}
            <section
              id="quickstart"
              className="chapter-box"
              style={{
                background: "linear-gradient(135deg, rgba(79, 70, 229, 0.05) 0%, rgba(16, 185, 129, 0.05) 100%)",
                border: "2px solid rgba(79, 70, 229, 0.25)",
                borderRadius: "18px",
                padding: "2rem",
                marginBottom: "2.5rem",
                boxShadow: "0 4px 20px -2px rgba(79, 70, 229, 0.08)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                <div style={{ width: 42, height: 42, borderRadius: "12px", background: "#4f46e5", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <BookOpen size={22} />
                </div>
                <div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", padding: "0.2rem 0.55rem", background: "rgba(79, 70, 229, 0.12)", color: "#4338ca", borderRadius: "6px", fontSize: "0.74rem", fontWeight: 700, marginBottom: "0.25rem" }}>
                    ⭐ ฉบับเข้าใจง่ายที่สุด
                  </div>
                  <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                    คู่มือฉบับเข้าใจง่ายที่สุด (สำหรับผู้เช่าห้องพัก)
                  </h2>
                  <p style={{ fontSize: "0.85rem", color: "#64748b", margin: "0.2rem 0 0" }}>
                    จ่ายค่าเช่าและแจ้งซ่อมได้ง่ายๆ ทีละก้าว ไม่ใช้ศัพท์เทคนิค แม้เพิ่งเริ่มใช้สมาร์ตโฟนก็ทำได้ทันที
                  </p>
                </div>
              </div>

              {/* 1. Phone Concept */}
              <div style={{ background: "#ffffff", borderRadius: "14px", border: "1px solid #e2e8f0", padding: "1.25rem", marginBottom: "1.25rem" }}>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#0f172a", margin: "0 0 0.5rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <Smartphone size={18} style={{ color: "#4f46e5" }} />
                  <span>1. ระบบนี้เหมือนมี "กระเป๋าสตางค์และสมุดบริการห้องพัก" อยู่ในมือถือ</span>
                </h3>
                <p style={{ fontSize: "0.86rem", color: "#475569", lineHeight: 1.6, margin: 0 }}>
                  ผู้เช่าสามารถเปิดดูบิลค่าเช่า สแกนจ่ายเงินผ่านแอปพลิเคชันธนาคาร และถ่ายรูปแจ้งซ่อมได้จากทุกที่ ไม่ต้องเดินไปสำนักงานหอพักให้เหนื่อย เมื่อเปิดบนมือถือ ข้อความจะเรียงเป็นการ์ดอ่านง่าย และมีปุ่มกดขนาดใหญ่แตะสะดวก
                </p>
              </div>

              {/* 2. Pay Bill Step-by-Step */}
              <div style={{ background: "#ffffff", borderRadius: "14px", border: "1px solid #e2e8f0", padding: "1.25rem", marginBottom: "1.25rem" }}>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#065f46", margin: "0 0 0.5rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <Receipt size={18} />
                  <span>2. วิธีดูบิลและชำระค่าห้องผ่านมือถือ (ทำทีละก้าว)</span>
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem", fontSize: "0.84rem", color: "#334155" }}>
                  <div><strong>ก้าวที่ 1:</strong> แตะเข้าเมนู "บิลค่าเช่าของฉัน"</div>
                  <div><strong>ก้าวที่ 2:</strong> มองหาบิลที่มีป้ายสีแดงเขียนว่า "รอชำระเงิน" แล้วแตะปุ่ม "ดูรายละเอียดบิล & ชำระเงิน"</div>
                  <div><strong>ก้าวที่ 3:</strong> ตรวจดูยอดเงินรวม แล้วใช้โทรศัพท์สแกนรหัสคิวอาร์พร้อมเพย์ หรือโอนเงินผ่านแอปพลิเคชันธนาคาร</div>
                  <div><strong>ก้าวที่ 4:</strong> เมื่อโอนเงินเสร็จ ให้บันทึกรูปใบเสร็จโอนเงิน (สลิป) ลงในโทรศัพท์</div>
                  <div><strong>ก้าวที่ 5:</strong> แตะปุ่ม "แนบสลิปโอนเงิน" เลือกรูปสลิป แล้วกดยืนยันส่งเรื่อง เจ้าหน้าที่จะตรวจและออกใบเสร็จให้ทันที</div>
                </div>
                <div style={{ marginTop: "0.85rem", padding: "0.75rem 1rem", background: "rgba(16, 185, 129, 0.08)", borderRadius: "10px", fontSize: "0.82rem", color: "#065f46", lineHeight: 1.6 }}>
                  <strong>ตัวอย่างจริง:</strong> บิลเดือนนี้มียอดรวม 5,260 บาท เราโอนเงินเข้าพร้อมเพย์หอพักพอดี 5,260 บาท แล้วแนบรูปสลิป สถานะจะเปลี่ยนเป็น "รอตรวจสอบ" เมื่อเจ้าหน้าที่กดตรวจแล้ว จะเปลี่ยนเป็น "ชำระแล้ว" พร้อมปุ่มให้แตะดูใบเสร็จรับเงิน
                </div>
              </div>

              {/* 3. Repair Step-by-Step */}
              <div style={{ background: "#ffffff", borderRadius: "14px", border: "1px solid #e2e8f0", padding: "1.25rem", marginBottom: "1.25rem" }}>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#b45309", margin: "0 0 0.5rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <Wrench size={18} />
                  <span>3. วิธีแจ้งซ่อมอุปกรณ์ในห้องพัก (ทำทีละก้าว)</span>
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem", fontSize: "0.84rem", color: "#334155" }}>
                  <div><strong>ก้าวที่ 1:</strong> แตะเข้าเมนู "แจ้งซ่อมบำรุง"</div>
                  <div><strong>ก้าวที่ 2:</strong> แตะปุ่ม "➕ แจ้งเรื่องซ่อมใหม่"</div>
                  <div><strong>ก้าวที่ 3:</strong> เลือกประเภทปัญหา เช่น ไฟฟ้า น้ำประปา หรือเครื่องปรับอากาศ</div>
                  <div><strong>ก้าวที่ 4:</strong> พิมพ์บอกอาการสั้นๆ เช่น "น้ำหยดใต้อ่างล้างหน้า" พร้อมแตะถ่ายรูปจุดที่ชำรุด</div>
                  <div><strong>ก้าวที่ 5:</strong> แตะปุ่ม "ส่งเรื่องแจ้งซ่อม" ช่างและเจ้าหน้าที่หอพักจะได้รับข้อความแจ้งเตือนทันที</div>
                </div>
              </div>

              {/* 4. Three Colors */}
              <div style={{ background: "#ffffff", borderRadius: "14px", border: "1px solid #e2e8f0", padding: "1.25rem", marginBottom: "1.25rem" }}>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#0f172a", margin: "0 0 0.5rem" }}>
                  4. ข้อจำง่ายๆ 3 สีประจำระบบ
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.65rem", fontSize: "0.84rem" }}>
                  <div style={{ padding: "0.65rem 0.85rem", borderRadius: "8px", background: "rgba(220, 38, 38, 0.08)", color: "#dc2626", fontWeight: 600 }}>
                    🔴 <strong>สีแดง:</strong> มีบิลที่ยังไม่ได้จ่ายเงิน หรือมีเรื่องด่วน
                  </div>
                  <div style={{ padding: "0.65rem 0.85rem", borderRadius: "8px", background: "rgba(245, 158, 11, 0.08)", color: "#b45309", fontWeight: 600 }}>
                    🟡 <strong>สีเหลือง/ส้ม:</strong> ส่งสลิปแล้ว กำลังรอเจ้าหน้าที่ตรวจทาน
                  </div>
                  <div style={{ padding: "0.65rem 0.85rem", borderRadius: "8px", background: "rgba(5, 150, 105, 0.08)", color: "#065f46", fontWeight: 600 }}>
                    🟢 <strong>สีเขียว:</strong> จ่ายเงินแล้ว หรือซ่อมเสร็จแล้ว เรียบร้อยดี
                  </div>
                </div>
              </div>

              {/* 5. Mobile Menu Button */}
              <div style={{ background: "rgba(79, 70, 229, 0.04)", borderRadius: "14px", border: "1px solid rgba(79, 70, 229, 0.2)", padding: "1.25rem" }}>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#4338ca", margin: "0 0 0.5rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <Menu size={18} />
                  <span>5. วิธีเปิดเมนูบนมือถือ (ปุ่มสามขีด ☰)</span>
                </h3>
                <p style={{ fontSize: "0.84rem", color: "#334155", lineHeight: 1.6, margin: 0 }}>
                  หากใช้งานบนโทรศัพท์มือถือแล้วมองไม่เห็นแถบเมนู ให้แตะที่ <strong>ปุ่มสัญลักษณ์สามขีด ☰</strong> ที่มุมบนซ้ายของจอ เมนูจะเลื่อนเปิดออกมาให้แตะเลือกไปหน้ารายการบิล หรือหน้าแจ้งซ่อมได้อย่างง่ายดาย
                </p>
              </div>
            </section>

            {/* บทที่ 1: การเข้าสู่ระบบ */}
            <section id="ch1" className="chapter-box">
              <div className="chapter-header">
                <span className="chapter-badge">บทที่ 1</span>
                <h2 className="chapter-title">การเข้าสู่ระบบผู้เช่า</h2>
                <p className="chapter-subtitle">
                  ขั้นตอนการเข้าใช้งานระบบบริการตนเองของผู้พักอาศัย
                </p>
              </div>

              {/* Screenshot Frame */}
              <div className="screenshot-container">
                <div
                  className="screenshot-frame"
                  onClick={() =>
                    setLightboxImg({
                      src: "/manual/images/rental/01_login_page.png",
                      caption: "ภาพที่ 1: หน้าจอเข้าสู่ระบบผู้เช่า พร้อมจุดกรอกอีเมล รหัสผ่าน และปุ่มเข้าสู่ระบบ",
                    })
                  }
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/manual/images/rental/01_login_page.png"
                    alt="หน้าจอเข้าสู่ระบบผู้เช่า"
                  />
                  <div className="screenshot-hover-hint">
                    <Maximize2 size={13} />
                    <span>คลิกเพื่อขยายภาพ</span>
                  </div>
                </div>
                <div className="screenshot-caption">
                  ภาพที่ 1: หน้าจอเข้าสู่ระบบ พร้อมจุดสำคัญ (1) อีเมล (2) รหัสผ่าน (3) ปุ่มเข้าสู่ระบบ (4) ติดต่อสำนักงานหอพัก
                </div>
              </div>

              {/* Steps */}
              <div>
                <h3 style={{ fontSize: "0.92rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.75rem" }}>
                  ขั้นตอนการปฏิบัติ:
                </h3>
                <div className="manual-steps-list">
                  <div className="manual-step-item">
                    <div className="step-num">1</div>
                    <div>
                      <strong>เปิดเว็บไซต์:</strong> เข้าใช้งานผ่านเบราว์เซอร์บนมือถือหรือคอมพิวเตอร์ที่ระบบของหอพัก แล้วกดปุ่ม <em>"เข้าสู่ระบบ"</em>
                    </div>
                  </div>
                  <div className="manual-step-item">
                    <div className="step-num">2</div>
                    <div>
                      <strong>กรอกอีเมล [จุดที่ 1]:</strong> ใส่อีเมลที่ท่านได้ลงทะเบียนไว้กับทางหอพักตอนทำสัญญาเช่า (เช่น <code className="step-code">tenant201@gmail.com</code>)
                    </div>
                  </div>
                  <div className="manual-step-item">
                    <div className="step-num">3</div>
                    <div>
                      <strong>กรอกรหัสผ่าน [จุดที่ 2]:</strong> ใส่รหัสผ่านประจำตัวของท่านให้ถูกต้อง
                    </div>
                  </div>
                  <div className="manual-step-item">
                    <div className="step-num">4</div>
                    <div>
                      <strong>กดปุ่มเข้าสู่ระบบ [จุดที่ 3]:</strong> ระบบจะทำการตรวจสอบและนำท่านเข้าสู่หน้าแดชบอร์ดห้องพักทันที
                    </div>
                  </div>
                </div>
              </div>

              {/* Warning Box */}
              <div className="callout-warning">
                <div className="callout-warning-header">
                  <AlertTriangle size={16} />
                  <span>ข้อควรระวังสำคัญ</span>
                </div>
                <p className="callout-warning-text">
                  หากท่านลืมรหัสผ่าน ไม่สามารถรีเซ็ตด้วยตนเองผ่านหน้าเว็บได้เพื่อความปลอดภัยสูงสุดของข้อมูลห้องพัก กรุณากดลิงก์ติดต่อสำนักงานหอพัก [จุดที่ 4] เพื่อให้เจ้าหน้าที่ตรวจสอบตัวตนและตั้งรหัสผ่านใหม่ให้
                </p>
              </div>
            </section>

            {/* บทที่ 2: หน้าหลักแดชบอร์ด */}
            <section id="ch2" className="chapter-box">
              <div className="chapter-header">
                <span className="chapter-badge">บทที่ 2</span>
                <h2 className="chapter-title">หน้าหลักผู้เช่า</h2>
                <p className="chapter-subtitle">
                  ศูนย์รวมข้อมูลสำคัญประจำห้องพัก การ์ดบิลค้างชำระ และเมนูด่วน
                </p>
              </div>

              <div className="screenshot-container">
                <div
                  className="screenshot-frame"
                  onClick={() =>
                    setLightboxImg({
                      src: "/manual/images/rental/02_dashboard_overview.png",
                      caption: "ภาพที่ 2: หน้าแดชบอร์ดผู้เช่า แสดงการ์ดบิลค้างชำระ หมายเลขห้อง และเมนูด่วน",
                    })
                  }
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/manual/images/rental/02_dashboard_overview.png"
                    alt="หน้าแดชบอร์ดผู้เช่า"
                  />
                  <div className="screenshot-hover-hint">
                    <Maximize2 size={13} />
                    <span>คลิกเพื่อขยายภาพ</span>
                  </div>
                </div>
                <div className="screenshot-caption">
                  ภาพที่ 2: ภาพรวมหน้าแดชบอร์ด (1) ป้ายหมายเลขห้อง (2) การ์ดบิลค้างจ่าย & ปุ่มจ่ายเงิน (3) เมนูด่วน (4) สถิติใช้น้ำ-ไฟ
                </div>
              </div>

              <div className="grid-2">
                <div className="info-card-item">
                  <div className="info-card-title">
                    <span className="badge-red-circle">1</span>
                    <span>ป้ายหมายเลขห้องพัก</span>
                  </div>
                  <p className="info-card-desc">
                    แสดงหมายเลขห้อง เช่น "ห้อง 201" ชั้น 2 ประเภทห้อง และสถานะการพักอาศัยปัจจุบัน
                  </p>
                </div>

                <div className="info-card-item">
                  <div className="info-card-title">
                    <span className="badge-red-circle">2</span>
                    <span>การ์ดแจ้งหนี้เด่น</span>
                  </div>
                  <p className="info-card-desc">
                    หากมีบิลค้างชำระ ระบบจะแสดงยอดเงินรวมและกำหนดวันชำระ พร้อมปุ่มกดไปชำระเงินทันที
                  </p>
                </div>

                <div className="info-card-item">
                  <div className="info-card-title">
                    <span className="badge-red-circle">3</span>
                    <span>เมนูด่วน</span>
                  </div>
                  <p className="info-card-desc">
                    ทางลัดสำหรับการแจ้งซ่อม การดูบิลย้อนหลัง การดูสัญญาเช่า และการติดตามประกาศ
                  </p>
                </div>

                <div className="info-card-item">
                  <div className="info-card-title">
                    <span className="badge-red-circle">4</span>
                    <span>สรุปการใช้พลังงาน</span>
                  </div>
                  <p className="info-card-desc">
                    แสดงหน่วยน้ำและไฟฟ้าที่ใช้ในเดือนล่าสุด ช่วยให้วางแผนค่าใช้จ่ายได้แม่นยำ
                  </p>
                </div>
              </div>
            </section>

            {/* บทที่ 3: การชำระเงินและบิลรายเดือน */}
            <section id="ch3" className="chapter-box">
              <div className="chapter-header">
                <span className="chapter-badge">บทที่ 3</span>
                <h2 className="chapter-title">การตรวจสอบและชำระบิลรายเดือน</h2>
                <p className="chapter-subtitle">
                  ขั้นตอนตั้งแต่ตรวจบิล สแกน QR PromptPay อัปโหลดสลิป จนถึงรับใบเสร็จรับเงิน
                </p>
              </div>

              {/* 3.1 ตารางรายการบิล */}
              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ width: 26, height: 26, borderRadius: "50%", background: "rgba(5, 150, 105, 0.1)", color: "#065f46", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", fontWeight: 700 }}>
                    3.1
                  </span>
                  <span>ตรวจสอบรายการบิลประจำเดือน</span>
                </h3>

                <div className="screenshot-container">
                  <div
                    className="screenshot-frame"
                    onClick={() =>
                      setLightboxImg({
                        src: "/manual/images/rental/03a_bills_list.png",
                        caption: "ภาพที่ 3a: หน้ารายการบิลรายเดือน แสดงสถานะค้างชำระ รอตรวจสอบ และชำระแล้ว",
                      })
                    }
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/manual/images/rental/03a_bills_list.png" alt="หน้ารายการบิลรายเดือน" />
                    <div className="screenshot-hover-hint">
                      <Maximize2 size={13} />
                      <span>คลิกเพื่อขยายภาพ</span>
                    </div>
                  </div>
                  <div className="screenshot-caption">
                    ภาพที่ 3a: ตารางบิลรายเดือน (1) บิลค้างจ่าย (2) บิลรอตรวจสลิป (3) บิลที่ชำระแล้ว
                  </div>
                </div>

                <div className="callout-info">
                  <div className="callout-info-header">
                    <Info size={16} />
                    <span>คำอธิบายสถานะบิลในระบบ</span>
                  </div>
                  <div className="callout-info-text">
                    <ul style={{ margin: 0, paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                      <li>
                        <strong>ค้างชำระ (สีแดง):</strong> บิลใหม่ที่ยังไม่ได้ชำระ กรุณากดปุ่ม <em>"ชำระเงิน"</em> เพื่อเปิด QR Code
                      </li>
                      <li>
                        <strong>รอตรวจสอบ (สีส้ม):</strong> ท่านได้อัปโหลดสลิปแล้ว กำลังรอเจ้าหน้าที่หอพักตรวจสอบยอดเงิน
                      </li>
                      <li>
                        <strong>ชำระแล้ว (สีเขียว):</strong> การชำระเงินเสร็จสมบูรณ์ สามารถกดปุ่ม <em>"ใบเสร็จ"</em> เพื่อดูและพิมพ์ได้ทันที
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 3.2 สแกน QR PromptPay */}
              <div style={{ marginBottom: "2rem", paddingTop: "1.5rem", borderTop: "1px solid rgba(15, 23, 42, 0.06)" }}>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ width: 26, height: 26, borderRadius: "50%", background: "rgba(5, 150, 105, 0.1)", color: "#065f46", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", fontWeight: 700 }}>
                    3.2
                  </span>
                  <span>การสแกน QR PromptPay ชำระเงิน</span>
                </h3>

                <div className="screenshot-container">
                  <div
                    className="screenshot-frame"
                    onClick={() =>
                      setLightboxImg({
                        src: "/manual/images/rental/03b_qr_promptpay_modal.png",
                        caption: "ภาพที่ 3b: หน้าต่าง QR Code พร้อมเพย์ พร้อมยอดเงินตรงตามบิล",
                      })
                    }
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/manual/images/rental/03b_qr_promptpay_modal.png" alt="หน้าต่าง QR Code พร้อมเพย์" />
                    <div className="screenshot-hover-hint">
                      <Maximize2 size={13} />
                      <span>คลิกเพื่อขยายภาพ</span>
                    </div>
                  </div>
                  <div className="screenshot-caption">
                    ภาพที่ 3b: ป็อปอัป QR พร้อมเพย์ (1) สแกนจ่าย (2) ยอดเงินคงที่ (3) ปุ่มไปแนบสลิป
                  </div>
                </div>

                <div className="callout-warning">
                  <div className="callout-warning-header">
                    <AlertTriangle size={16} />
                    <span>ข้อควรระวังสำคัญ: โอนเงินตรงตามยอดสตางค์</span>
                  </div>
                  <p className="callout-warning-text">
                    ระบบสร้าง QR พร้อมเพย์ระบุยอดเงินตรงตามบิลอย่างแม่นยำ (เช่น ฿5,260.00) กรุณาอย่าแก้ไขหรือโอนยอดที่คลาดเคลื่อน เพื่อให้ระบบและเจ้าหน้าที่จับคู่บิลได้อย่างถูกต้องและรวดเร็ว
                  </p>
                </div>
              </div>

              {/* 3.3 อัปโหลดสลิป */}
              <div style={{ marginBottom: "2rem", paddingTop: "1.5rem", borderTop: "1px solid rgba(15, 23, 42, 0.06)" }}>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ width: 26, height: 26, borderRadius: "50%", background: "rgba(5, 150, 105, 0.1)", color: "#065f46", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", fontWeight: 700 }}>
                    3.3
                  </span>
                  <span>การอัปโหลดสลิปหลักฐานการโอน</span>
                </h3>

                <div className="screenshot-container">
                  <div
                    className="screenshot-frame"
                    onClick={() =>
                      setLightboxImg({
                        src: "/manual/images/rental/03c_upload_slip.png",
                        caption: "ภาพที่ 3c: แบบฟอร์มอัปโหลดสลิปโอนเงิน พร้อมปุ่มบันทึกและส่งตรวจสอบ",
                      })
                    }
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/manual/images/rental/03c_upload_slip.png" alt="แบบฟอร์มอัปโหลดสลิปโอนเงิน" />
                    <div className="screenshot-hover-hint">
                      <Maximize2 size={13} />
                      <span>คลิกเพื่อขยายภาพ</span>
                    </div>
                  </div>
                  <div className="screenshot-caption">
                    ภาพที่ 3c: แบบฟอร์มอัปโหลดสลิป (1) ปุ่มเลือกรูป (2) ปุ่มยืนยันและส่งสลิป
                  </div>
                </div>

                <div className="manual-steps-list">
                  <div className="manual-step-item">
                    <div className="step-num">1</div>
                    <div>
                      กดปุ่ม <strong>"เลือกไฟล์สลิป"</strong> เพื่อเลือกรูปภาพสลิปจากแอปพลิเคชันธนาคารในโทรศัพท์มือถือของท่าน
                    </div>
                  </div>
                  <div className="manual-step-item">
                    <div className="step-num">2</div>
                    <div>
                      ระบบจะแสดงรูปตัวอย่างสลิป ให้ท่านตรวจสอบความชัดเจนของวันเวลาและยอดเงิน
                    </div>
                  </div>
                  <div className="manual-step-item">
                    <div className="step-num">3</div>
                    <div>
                      กดปุ่ม <strong>"ยืนยันและส่งสลิป"</strong> ระบบจะบันทึกสลิปและปรับสถานะบิลเป็น <em>"รอตรวจสอบ"</em> ทันที
                    </div>
                  </div>
                </div>
              </div>

              {/* 3.4 รอตรวจสอบ & 3.5 ใบเสร็จ */}
              <div className="grid-2" style={{ paddingTop: "1.5rem", borderTop: "1px solid rgba(15, 23, 42, 0.06)" }}>
                <div>
                  <h4 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.65rem", display: "flex", alignItems: "center", gap: "0.45rem" }}>
                    <span style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(217, 119, 6, 0.1)", color: "#d97706", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700 }}>
                      3.4
                    </span>
                    <span>สถานะรอตรวจสอบสลิป</span>
                  </h4>
                  <div
                    className="screenshot-frame"
                    onClick={() =>
                      setLightboxImg({
                        src: "/manual/images/rental/03d_pending_verification.png",
                        caption: "ภาพที่ 3d: ป้ายสถานะรอตรวจสอบสลิปจากเจ้าหน้าที่หอพัก",
                      })
                    }
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/manual/images/rental/03d_pending_verification.png" alt="สถานะรอตรวจสอบสลิป" />
                  </div>
                  <p style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "0.5rem" }}>
                    เจ้าหน้าที่จะทำการตรวจสอบยอดเงินและออกใบเสร็จภายใน 24 ชั่วโมงในวันทำการ
                  </p>
                </div>

                <div>
                  <h4 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.65rem", display: "flex", alignItems: "center", gap: "0.45rem" }}>
                    <span style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(5, 150, 105, 0.1)", color: "#065f46", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700 }}>
                      3.5
                    </span>
                    <span>ใบเสร็จรับเงินทางการ</span>
                  </h4>
                  <div
                    className="screenshot-frame"
                    onClick={() =>
                      setLightboxImg({
                        src: "/manual/images/rental/03e_official_receipt.png",
                        caption: "ภาพที่ 3e: ใบเสร็จรับเงินทางการ พร้อมปุ่มสั่งพิมพ์/ดาวน์โหลด PDF",
                      })
                    }
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/manual/images/rental/03e_official_receipt.png" alt="ใบเสร็จรับเงินทางการ" />
                  </div>
                  <p style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "0.5rem" }}>
                    เมื่อได้รับการอนุมัติแล้ว ท่านสามารถกดพิมพ์หรือบันทึกเป็น PDF เพื่อเป็นหลักฐานได้ทันที
                  </p>
                </div>
              </div>
            </section>

            {/* บทที่ 4: การแจ้งซ่อมบำรุง */}
            <section id="ch4" className="chapter-box">
              <div className="chapter-header">
                <span className="chapter-badge">บทที่ 4</span>
                <h2 className="chapter-title">การแจ้งซ่อมบำรุงห้องพัก</h2>
                <p className="chapter-subtitle">
                  ระบบส่งคำขอแจ้งซ่อม ติดตามความคืบหน้า และประวัติงานช่าง
                </p>
              </div>

              <div className="grid-2">
                <div>
                  <div
                    className="screenshot-frame"
                    onClick={() =>
                      setLightboxImg({
                        src: "/manual/images/rental/04a_repairs_overview.png",
                        caption: "ภาพที่ 4a: หน้ารายการแจ้งซ่อม แสดงสถานะรอดำเนินการและประวัติเดิม",
                      })
                    }
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/manual/images/rental/04a_repairs_overview.png" alt="หน้ารายการแจ้งซ่อม" />
                  </div>
                  <div className="screenshot-caption">
                    ภาพที่ 4a: รายการแจ้งซ่อม (1) ปุ่มแจ้งซ่อมใหม่ (2) การ์ดสถานะงาน
                  </div>
                </div>

                <div>
                  <div
                    className="screenshot-frame"
                    onClick={() =>
                      setLightboxImg({
                        src: "/manual/images/rental/04b_new_repair_modal.png",
                        caption: "ภาพที่ 4b: แบบฟอร์มแจ้งซ่อมใหม่ เลือกหมวดหมู่ ความเร่งด่วน และแนบรูป",
                      })
                    }
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/manual/images/rental/04b_new_repair_modal.png" alt="แบบฟอร์มแจ้งซ่อมใหม่" />
                  </div>
                  <div className="screenshot-caption">
                    ภาพที่ 4b: ฟอร์มระบุอาการ (1) หัวข้อ (2) หมวดหมู่ (3) รายละเอียด (4) แนบรูป (5) ส่งคำขอ
                  </div>
                </div>
              </div>

              <div className="callout-info" style={{ marginTop: "1.5rem" }}>
                <div className="callout-info-header">
                  <Info size={16} />
                  <span>คำแนะนำสำหรับการแจ้งซ่อมเพื่อความรวดเร็ว</span>
                </div>
                <div className="callout-info-text">
                  <ul style={{ margin: 0, paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                    <li>
                      เลือกหมวดหมู่ให้ตรงกับปัญหา เช่น <em>ระบบไฟฟ้า, ประปา/ห้องน้ำ, เครื่องปรับอากาศ, เฟอร์นิเจอร์</em>
                    </li>
                    <li>
                      หากเป็นเหตุฉุกเฉินที่มีผลกระทบเร่งด่วน เช่น น้ำรั่วซึมปริมาณมาก หรือไฟฟ้าลัดวงจร ให้ระบุความเร่งด่วนเป็น <em>"ด่วนมาก"</em> และโทรแจ้งเจ้าหน้าที่หอพักควบคู่กัน
                    </li>
                    <li>
                      การถ่ายรูปภาพจุดที่ชำรุดอย่างชัดเจน จะช่วยให้ช่างเตรียมอะไหล่และเครื่องมือเข้าซ่อมแซมได้รวดเร็วยิ่งขึ้น
                    </li>
                  </ul>
                </div>
              </div>

              <div className="callout-warning" style={{ marginTop: "1rem" }}>
                <div className="callout-warning-header">
                  <AlertTriangle size={16} />
                  <span>ข้อควรระวังสำคัญ: ห้ามส่งคำร้องแจ้งซ่อมซ้ำซ้อน</span>
                </div>
                <p className="callout-warning-text">
                  หากมีรายการแจ้งซ่อมเดิมที่ยังอยู่ในสถานะ <strong>"รอดำเนินการ"</strong> หรือ <strong>"กำลังดำเนินการ"</strong> กรุณาอย่าส่งคำขอแจ้งซ่อมซ้ำสำหรับปัญหาเดิม เพื่อป้องกันความสับสนในการมอบหมายงานช่างและการจัดซื้ออะไหล่ หากต้องการติดตามความคืบหน้าเร่งด่วน ให้โทรติดต่อสำนักงานหอพักหรือแจ้งผ่าน LINE Official Account โดยตรง
                </p>
              </div>
            </section>

            {/* บทที่ 5: ประกาศหอพัก */}
            <section id="ch5" className="chapter-box">
              <div className="chapter-header">
                <span className="chapter-badge">บทที่ 5</span>
                <h2 className="chapter-title">การติดตามประกาศหอพัก</h2>
                <p className="chapter-subtitle">
                  รับทราบข่าวสาร กำหนดการล้างถังพักน้ำ ฉีดพ่นกำจัดแมลง และระเบียบสำคัญ
                </p>
              </div>

              <div className="screenshot-container">
                <div
                  className="screenshot-frame"
                  onClick={() =>
                    setLightboxImg({
                      src: "/manual/images/rental/05_announcements.png",
                      caption: "ภาพที่ 5: หน้าประกาศหอพัก พร้อมป้ายหมุดประกาศด่วน และช่องทาง LINE OA",
                    })
                  }
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/manual/images/rental/05_announcements.png" alt="หน้าประกาศหอพัก" />
                  <div className="screenshot-hover-hint">
                    <Maximize2 size={13} />
                    <span>คลิกเพื่อขยายภาพ</span>
                  </div>
                </div>
                <div className="screenshot-caption">
                  ภาพที่ 5: หน้าประกาศหอพัก (1) แถบปักหมุดประกาศสำคัญ (2) กล่องเชื่อมต่อ LINE OA
                </div>
              </div>

              <div className="callout-info">
                <div className="callout-info-text">
                  <p style={{ marginBottom: "0.5rem" }}>
                    <strong style={{ color: "#0f172a" }}>ประกาศด่วนและสำคัญ:</strong> จะปรากฏอยู่ด้านบนสุดเสมอ พร้อมแถบสีแดงหรือส้ม เพื่อให้ผู้เช่าไม่พลาดกำหนดการตัดน้ำ/ตัดไฟเพื่อบำรุงรักษา
                  </p>
                  <p style={{ margin: 0 }}>
                    <strong style={{ color: "#0f172a" }}>การเชื่อมต่อ LINE Official Account:</strong> แนะนำให้ผู้พักอาศัยกดปุ่มเพิ่มเพื่อนใน LINE เพื่อรับการแจ้งเตือนบิลรายเดือนและประกาศฉุกเฉินผ่านมือถือได้ทันที
                  </p>
                </div>
              </div>

              <div className="callout-warning" style={{ marginTop: "1rem" }}>
                <div className="callout-warning-header">
                  <AlertTriangle size={16} />
                  <span>ข้อควรระวังสำคัญ: ประกาศปักหมุดสีแดงต้องอ่านและเตรียมตัวทันที</span>
                </div>
                <p className="callout-warning-text">
                  ประกาศที่มีแถบสีแดงหรือปักหมุด <strong>"ด่วนมาก"</strong> คือประกาศที่มีผลกระทบต่อชีวิตความเป็นอยู่และการใช้สาธารณูปโภคโดยตรง เช่น กำหนดการตัดน้ำประปาเพื่อล้างถังพักน้ำประจำปี, การซ่อมบำรุงหม้อแปลงไฟฟ้าส่วนกลาง, หรือการฉีดพ่นสารเคมีกำจัดแมลง ผู้พักอาศัยควรอ่านรายละเอียดวันและเวลาให้ชัดเจน และเตรียมสำรองน้ำดื่ม/น้ำใช้ หรือปิดระเบียงห้องพักให้เรียบร้อยล่วงหน้า
                </p>
              </div>
            </section>

            {/* บทที่ 6: ข้อมูลผู้เช่าและสัญญาเช่า */}
            <section id="ch6" className="chapter-box">
              <div className="chapter-header">
                <span className="chapter-badge">บทที่ 6</span>
                <h2 className="chapter-title">ข้อมูลผู้เช่าและสัญญาเช่า</h2>
                <p className="chapter-subtitle">
                  ตรวจสอบวันเริ่มต้น-สิ้นสุดสัญญาเช่า ยอดเงินประกันห้อง และเบอร์ติดต่อฉุกเฉิน
                </p>
              </div>

              <div className="screenshot-container">
                <div
                  className="screenshot-frame"
                  onClick={() =>
                    setLightboxImg({
                      src: "/manual/images/rental/06_profile_contract.png",
                      caption: "ภาพที่ 6: หน้าโปรไฟล์ผู้เช่าและรายละเอียดสัญญาเช่า",
                    })
                  }
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/manual/images/rental/06_profile_contract.png" alt="หน้าโปรไฟล์และสัญญาเช่า" />
                  <div className="screenshot-hover-hint">
                    <Maximize2 size={13} />
                    <span>คลิกเพื่อขยายภาพ</span>
                  </div>
                </div>
                <div className="screenshot-caption">
                  ภาพที่ 6: ข้อมูลสัญญาเช่า (1) วันที่เริ่ม-สิ้นสุดสัญญา (2) ยอดเงินประกัน (3) ข้อมูลติดต่อฉุกเฉิน
                </div>
              </div>

              <div className="grid-3">
                <div className="info-card-item">
                  <div className="info-card-title">วันสิ้นสุดสัญญาเช่า</div>
                  <p className="info-card-desc">
                    ควรตรวจสอบล่วงหน้าอย่างน้อย 30 วันก่อนหมดสัญญา หากประสงค์จะต่อสัญญาหรือย้ายออก
                  </p>
                </div>
                <div className="info-card-item">
                  <div className="info-card-title">เงินประกันความเสียหาย</div>
                  <p className="info-card-desc">
                    บันทึกยอดเงินประกันตามสัญญาเช่า จะได้รับคืนเมื่อย้ายออกและตรวจสภาพห้องเรียบร้อย
                  </p>
                </div>
                <div className="info-card-item">
                  <div className="info-card-title">บุคคลติดต่อกรณีฉุกเฉิน</div>
                  <p className="info-card-desc">
                    โปรดตรวจสอบว่าเบอร์โทรศัพท์ติดต่อฉุกเฉินเป็นปัจจุบันอยู่เสมอ เพื่อความปลอดภัย
                  </p>
                </div>
              </div>
            </section>

            {/* บทที่ 7: ข้อควรระวังและกฎระเบียบ */}
            <section id="ch7" className="chapter-box">
              <div className="chapter-header">
                <span className="chapter-badge-dark">บทที่ 7</span>
                <h2 className="chapter-title">กฎระเบียบและข้อควรระวังสำคัญ</h2>
                <p className="chapter-subtitle">
                  ข้อกำหนดและแนวทางปฏิบัติเพื่อความปลอดภัยและความสงบสุขของผู้พักอาศัยทุกท่าน
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                <div className="callout-success" style={{ margin: 0 }}>
                  <div className="callout-success-header">
                    <CheckCircle2 size={16} />
                    <span>1. กำหนดการชำระค่าเช่าและค่าสาธารณูปโภค</span>
                  </div>
                  <p className="callout-success-text" style={{ paddingLeft: "1.5rem" }}>
                    กำหนดชำระเงินไม่เกินวันที่ 5 ของทุกเดือน หากชำระหลังวันที่ 5 อาจมีค่าปรับตามที่ระบุไว้ในสัญญาเช่า
                  </p>
                </div>

                <div className="callout-warning" style={{ margin: 0 }}>
                  <div className="callout-warning-header">
                    <AlertTriangle size={16} />
                    <span>2. การสแกนจ่ายและแนบสลิปที่ถูกต้อง</span>
                  </div>
                  <p className="callout-warning-text" style={{ paddingLeft: "1.5rem" }}>
                    สแกน QR PromptPay จากระบบโดยตรง และอัปโหลดภาพสลิปที่เห็นยอดเงิน วันเวลา และเลขอ้างอิงชัดเจน ห้ามใช้ภาพสลิปซ้ำ
                  </p>
                </div>

                <div className="callout-info" style={{ margin: 0 }}>
                  <div className="callout-info-header">
                    <ShieldCheck size={16} />
                    <span>3. ความปลอดภัยและการแจ้งเหตุฉุกเฉิน</span>
                  </div>
                  <p className="callout-info-text" style={{ paddingLeft: "1.5rem" }}>
                    ห้ามส่งต่อรหัสผ่านให้บุคคลภายนอก หากเกิดเหตุฉุกเฉินนอกเวลาทำการ ติดต่อ รปภ. ประจำอาคาร หรือสแกน LINE OA ทางการทันที
                  </p>
                </div>
              </div>
            </section>

            {/* บทที่ 8: คำถามที่พบบ่อย (FAQ) */}
            <section id="ch8" className="chapter-box">
              <div className="chapter-header">
                <span className="chapter-badge" style={{ background: "#4f46e5" }}>บทที่ 8</span>
                <h2 className="chapter-title">คำถามที่พบบ่อย</h2>
                <p className="chapter-subtitle">
                  รวบรวมข้อสงสัยและคำถามที่พบบ่อยเกี่ยวกับการใช้งานระบบและการพักอาศัย
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div className="info-card-item">
                  <div className="info-card-title">
                    <HelpCircle size={17} style={{ color: "#4f46e5", flexShrink: 0 }} />
                    <span>ถาม: หากลืมรหัสผ่านเข้าสู่ระบบ ต้องทำอย่างไร?</span>
                  </div>
                  <p className="info-card-desc" style={{ paddingLeft: "1.55rem" }}>
                    <strong>ตอบ:</strong> เนื่องจากระบบยึดหลักความปลอดภัยสูงสุดของข้อมูลห้องพัก ผู้พักอาศัยจะไม่สามารถกดรีเซ็ตรหัสผ่านด้วยตนเองผ่านหน้าเว็บได้ กรุณาติดต่อสำนักงานหอพัก ชั้น 1 หรือโทร 081-999-8888 เพื่อให้เจ้าหน้าที่ตรวจสอบตัวตนและทำการออกรหัสผ่านเริ่มต้นใหม่ให้
                  </p>
                </div>

                <div className="info-card-item">
                  <div className="info-card-title">
                    <HelpCircle size={17} style={{ color: "#4f46e5", flexShrink: 0 }} />
                    <span>ถาม: อัปโหลดสลิปแล้ว แต่สถานะแจ้งว่าไม่ผ่าน หรือถูกปฏิเสธ ต้องทำอย่างไร?</span>
                  </div>
                  <p className="info-card-desc" style={{ paddingLeft: "1.55rem" }}>
                    <strong>ตอบ:</strong> ตรวจสอบว่ายอดเงินที่โอนตรงตามยอดในบิลทุกประการหรือไม่ (ห้ามปัดเศษสตางค์) และภาพสลิปมีความคมชัดเห็นวันเวลาและรหัสอ้างอิงชัดเจน หากข้อมูลถูกต้องแต่ระบบปฏิเสธ ให้ติดต่อเจ้าหน้าที่หอพักพร้อมนำสลิปจากแอปธนาคารตัวจริงมาให้เจ้าหน้าที่ตรวจสอบเพื่ออนุมัติเข้าระบบแบบแมนนวล
                  </p>
                </div>

                <div className="info-card-item">
                  <div className="info-card-title">
                    <HelpCircle size={17} style={{ color: "#4f46e5", flexShrink: 0 }} />
                    <span>ถาม: หากเข้าเว็บไซต์ไม่ได้ หรือระบบเกิดข้อขัดข้องชั่วคราว ต้องโทรแจ้งใคร?</span>
                  </div>
                  <p className="info-card-desc" style={{ paddingLeft: "1.55rem" }}>
                    <strong>ตอบ:</strong> สามารถติดต่อเจ้าหน้าที่หอพักประจำอาคารได้ทางโทรศัพท์ 081-999-8888 หรือ 02-711-0099 (เวลาทำการ 08:30 - 18:00 น.) หรือส่งข้อความแจ้งทาง LINE Official Account: @thesaranrom ได้ตลอด 24 ชั่วโมง โดยเจ้าหน้าที่จะตรวจสอบและอำนวยความสะดวกให้ทันที
                  </p>
                </div>

                <div className="info-card-item">
                  <div className="info-card-title">
                    <HelpCircle size={17} style={{ color: "#4f46e5", flexShrink: 0 }} />
                    <span>ถาม: ต้องการต่อสัญญาเช่า หรือย้ายออกเมื่อสิ้นสุดสัญญา ต้องแจ้งล่วงหน้ากี่วัน?</span>
                  </div>
                  <p className="info-card-desc" style={{ paddingLeft: "1.55rem" }}>
                    <strong>ตอบ:</strong> ผู้เช่าต้องแจ้งความประสงค์ล่วงหน้าอย่างน้อย 30 วันก่อนวันสิ้นสุดสัญญาเช่า เพื่อให้เจ้าหน้าที่หอพักจัดเตรียมเอกสารสัญญาฉบับใหม่ หรือทำการนัดหมายตรวจสภาพห้องพักและดำเนินการขั้นตอนการคืนเงินประกันความเสียหายตามระเบียบ
                  </p>
                </div>

                <div className="info-card-item">
                  <div className="info-card-title">
                    <HelpCircle size={17} style={{ color: "#4f46e5", flexShrink: 0 }} />
                    <span>ถาม: ต้องการเปลี่ยนเบอร์โทรศัพท์ หรือเบอร์ติดต่อฉุกเฉิน ต้องทำอย่างไร?</span>
                  </div>
                  <p className="info-card-desc" style={{ paddingLeft: "1.55rem" }}>
                    <strong>ตอบ:</strong> เพื่อความถูกต้องของข้อมูลตามสัญญาเช่า ให้ผู้เช่าติดต่อเจ้าหน้าที่หอพักที่สำนักงาน ชั้น 1 หรือส่งข้อความยืนยันผ่าน LINE Official Account เพื่อให้เจ้าหน้าที่ดำเนินการอัปเดตข้อมูลผู้ติดต่อฉุกเฉินในฐานข้อมูลระบบกลาง
                  </p>
                </div>

                <div className="info-card-item">
                  <div className="info-card-title">
                    <HelpCircle size={17} style={{ color: "#4f46e5", flexShrink: 0 }} />
                    <span>ถาม: กำหนดชำระค่าเช่าห้องพักถึงวันที่เท่าไหร่ และมีค่าปรับกรณีชำระล่าช้าหรือไม่?</span>
                  </div>
                  <p className="info-card-desc" style={{ paddingLeft: "1.55rem" }}>
                    <strong>ตอบ:</strong> กำหนดชำระเงินไม่เกินวันที่ 5 ของทุกเดือน หากชำระหลังวันที่ 5 จะมีค่าปรับวันละ 100 บาทตามที่ระบุไว้ในสัญญาเช่า จึงขอความกรุณาชำระเงินภายในระยะเวลาที่กำหนด
                  </p>
                </div>
              </div>

              {/* Bottom Actions */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid rgba(15, 23, 42, 0.08)" }}>
                <Link href="/manual" style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", fontSize: "0.85rem", fontWeight: 600, color: "#475569" }}>
                  <ArrowLeft size={15} />
                  <span>กลับหน้ารวมศูนย์คู่มือ</span>
                </Link>

                <div className="manual-actions-row">
                  <button
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    className="manual-btn-secondary"
                    style={{ padding: "0.45rem 0.85rem", fontSize: "0.82rem" }}
                  >
                    กลับสู่ด้านบนสุด
                  </button>
                  <a
                    href="/manual/manual-rental.pdf"
                    download
                    className="manual-btn-primary"
                    style={{ padding: "0.45rem 1rem", fontSize: "0.82rem" }}
                  >
                    <Download size={14} />
                    <span>ดาวน์โหลดคู่มือ PDF (3.3 MB)</span>
                  </a>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
