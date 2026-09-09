"use client";

import React, { useState } from "react";
import Link from "next/link";
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
  Clock,
  Layers,
  Crown,
  BarChart3,
  UserPlus,
  Lock,
  Building,
  DollarSign,
  FileText,
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
    id: "ch1",
    number: "บทที่ 1",
    title: "การเข้าสู่ระบบและภาพรวมสิทธิ์เจ้าของหอพัก (Owner Login & Executive Overview)",
    shortTitle: "1. แดชบอร์ดเจ้าของ",
    description: "โครงสร้างสิทธิ์ระดับสูงสุด (Super Admin / Owner) และแถบเมนูควบคุมเฉพาะผู้บริหาร",
  },
  {
    id: "ch2",
    number: "บทที่ 2",
    title: "รายงานผลประกอบการและการเงินเชิงลึก (Financial Analytics & Occupancy Dashboard)",
    shortTitle: "2. วิเคราะห์การเงิน",
    description: "การวิเคราะห์รายรับจริง หนี้ค้างชำระ สัดส่วนโครงสร้างรายได้ และอัตราการเข้าพัก",
  },
  {
    id: "ch3",
    number: "บทที่ 3",
    title: "การจัดการประเภทห้องพักและกำหนดอัตราค่าบริการ (Room Types & Utility Rates)",
    shortTitle: "3. ประเภทห้อง & ค่าน้ำไฟ",
    description: "การกำหนดราคาค่าเช่าฐาน อัตราค่าน้ำประปา (18฿) ค่าไฟฟ้า (8฿) และสิ่งอำนวยความสะดวก",
  },
  {
    id: "ch4",
    number: "บทที่ 4",
    title: "การบริหารจัดการบัญชีเจ้าหน้าที่นิติบุคคล (Staff Accounts & Access Management)",
    shortTitle: "4. จัดการบัญชี Staff",
    description: "การสร้างบัญชีพนักงานใหม่ กำหนดบทบาท มอบสิทธิ์การเข้าถึง และระงับบัญชีเมื่อพ้นสภาพ",
  },
  {
    id: "ch5",
    number: "บทที่ 5",
    title: "การกำกับดูแลการเงินและการตรวจสอบสลิป (Financial Supervision & Slip Auditing)",
    shortTitle: "5. กำกับดูแลการเงิน",
    description: "การสุ่มตรวจสลิปโอนเงินย้อนหลัง การตรวจทานใบเสร็จรับเงินทางการ และการกระทบยอดธนาคาร",
  },
  {
    id: "ch6",
    number: "บทที่ 6",
    title: "การบริหารสัญญาเช่า เงินประกัน และการเข้าพัก (Tenants, Contracts & Deposits Control)",
    shortTitle: "6. สัญญาเช่า & เงินประกัน",
    description: "การควบคุมยอดเงินมัดจำประกันความเสียหายรวมของอาคาร และการติดตามสัญญาเช่าระยะยาว",
  },
  {
    id: "ch7",
    number: "บทที่ 7",
    title: "การควบคุมงานบำรุงรักษาและการสื่อสารกับผู้เช่า (Maintenance Oversight & Broadcast Control)",
    shortTitle: "7. งานซ่อมบำรุง & LINE",
    description: "การติดตามประสิทธิภาพงานซ่อม งบประมาณส่วนกลาง และนโยบายบรอดแคสต์ LINE OA",
  },
  {
    id: "ch8",
    number: "บทที่ 8",
    title: "แนวปฏิบัติและข้อควรระวังสำคัญสำหรับเจ้าของหอพัก (Executive Governance & Golden Rules)",
    shortTitle: "8. แนวปฏิบัติ & กฎเหล็ก",
    description: "4 กฎเหล็กด้านความปลอดภัย การเงิน กองทุนสำรองบำรุงรักษาอาคาร (Sinking Fund) และ PDPA",
  },
  {
    id: "ch9",
    number: "บทที่ 9",
    title: "คำถามที่พบบ่อยสำหรับเจ้าของหอพัก (Executive FAQ)",
    shortTitle: "9. คำถามที่พบบ่อย (FAQ)",
    description: "รวม 6 ข้อสงสัยเชิงบริหาร การเงิน ภาษี และแนวทางจัดการความเสี่ยง",
  },
];

export default function OwnerManualPage() {
  const [activeChapter, setActiveChapter] = useState("ch1");
  const [lightboxImg, setLightboxImg] = useState<{ src: string; caption: string } | null>(null);

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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
            marginBottom: "1.5rem",
            paddingBottom: "1rem",
            borderBottom: "1px solid rgba(15, 23, 42, 0.08)",
          }}
        >
          <div className="manual-breadcrumb" style={{ margin: 0 }}>
            <Link href="/manual" style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
              <ArrowLeft size={15} />
              <span>ศูนย์คู่มือ</span>
            </Link>
            <ChevronRight size={14} />
            <span className="manual-breadcrumb-current">คู่มือเจ้าของและผู้บริหาร (เล่มที่ 3)</span>
          </div>

          <div className="manual-actions-row">
            <button onClick={handlePrint} className="manual-btn-secondary" style={{ padding: "0.45rem 0.9rem", fontSize: "0.82rem" }}>
              <Printer size={15} />
              <span>สั่งพิมพ์</span>
            </button>
            <a
              href="/manual/manual-owner.pdf"
              download
              className="manual-btn-primary"
              style={{
                padding: "0.45rem 1rem",
                fontSize: "0.82rem",
                background: "#7e22ce",
                borderColor: "#7e22ce",
              }}
            >
              <Download size={15} />
              <span>ดาวน์โหลด PDF (3.1 MB)</span>
            </a>
          </div>
        </div>

        {/* Manual Cover Banner */}
        <div
          className="manual-hero-rental-banner"
          style={{
            background: "linear-gradient(135deg, #4c1d95 0%, #0f172a 65%, #7e22ce 100%)",
            borderColor: "rgba(147, 51, 234, 0.3)",
            boxShadow: "0 20px 40px -10px rgba(76, 29, 149, 0.35)",
          }}
        >
          <div>
            <div className="manual-tag manual-tag-banner" style={{ background: "rgba(147, 51, 234, 0.25)", color: "#e9d5ff", borderColor: "rgba(147, 51, 234, 0.4)" }}>
              <Crown size={13} />
              <span>USER MANUAL - VOLUME 3: EXECUTIVE & OWNER PORTAL</span>
            </div>
            <h1 className="manual-hero-title-light">คู่มือการใช้งานระบบสำหรับเจ้าของและผู้บริหาร</h1>
            <p className="manual-hero-desc-light">
              เดอะ สราญรมย์ เรสซิเดนซ์ (The Saranrom Residence & Apartment)
              รวบรวมฟังก์ชันควบคุมเชิงบริหารระดับสูง การติดตามรายงานผลประกอบการและการเงินเชิงลึก
              การตั้งค่าประเภทห้องและอัตราค่าน้ำ-ไฟมาตรฐาน การบริหารจัดการบัญชีพนักงานนิติบุคคล
              และการกำกับดูแลนโยบายอาคารอย่างเป็นระบบ
            </p>
            <div style={{ display: "flex", gap: "1rem", fontSize: "0.75rem", color: "#e9d5ff", marginTop: "1rem", flexWrap: "wrap" }}>
              <span>ฉบับปรับปรุง: กันยายน 2026</span>
              <span>•</span>
              <span>กลุ่มเป้าหมาย: เจ้าของหอพักและคณะผู้บริหาร</span>
              <span>•</span>
              <span>จำนวนบท: 9 บท (พร้อมภาพหน้าจอประกอบจริง)</span>
            </div>
          </div>
        </div>

        {/* Main Content Layout: Sidebar + Chapters */}
        <div className="rental-manual-layout">
          {/* Sticky Sidebar Navigation */}
          <div className="rental-sidebar">
            <div className="rental-sidebar-title" style={{ color: "#7e22ce" }}>
              สารบัญเนื้อหา (Owner Chapters)
            </div>
            <nav className="rental-sidebar-menu">
              {chapters.map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => scrollToSection(ch.id)}
                  className={`rental-sidebar-btn ${activeChapter === ch.id ? "rental-sidebar-btn-active" : ""}`}
                  style={
                    activeChapter === ch.id
                      ? {
                          background: "rgba(147, 51, 234, 0.08)",
                          color: "#7e22ce",
                          borderColor: "rgba(147, 51, 234, 0.2)",
                        }
                      : {}
                  }
                >
                  <span>{ch.shortTitle}</span>
                  <ChevronRight size={13} style={{ opacity: 0.5, flexShrink: 0 }} />
                </button>
              ))}
            </nav>

            <div className="rental-sidebar-contact">
              <div
                style={{
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  color: "#0f172a",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  marginBottom: "0.3rem",
                }}
              >
                <Crown size={14} style={{ color: "#7e22ce" }} />
                <span>ศูนย์ควบคุมผู้บริหาร</span>
              </div>
              <div style={{ fontSize: "0.78rem", color: "#64748b", lineHeight: 1.5 }}>
                โทรตรง: 081-999-8888
                <br />
                อีเมล: owner@saranrom-residence.com
                <br />
                LINE OA: @thesaranrom
              </div>
            </div>
          </div>

          {/* Chapters Content */}
          <div className="rental-content-area">
            {/* CHAPTER 1: OWNER OVERVIEW */}
            <section id="ch1" className="chapter-box">
              <div className="chapter-header">
                <span className="chapter-badge" style={{ background: "#7e22ce" }}>บทที่ 1</span>
                <h2 className="chapter-title">การเข้าสู่ระบบและภาพรวมสิทธิ์เจ้าของหอพัก (Owner Login & Executive Overview)</h2>
                <p className="chapter-subtitle">
                  โครงสร้างสิทธิ์ระดับสูงสุด (Super Admin / Owner) และเมนูควบคุมพิเศษเฉพาะผู้บริหาร
                </p>
              </div>

              <div className="screenshot-container">
                <div
                  className="screenshot-frame"
                  onClick={() =>
                    setLightboxImg({
                      src: "/manual/images/owner/01_owner_dashboard_sidebar.png",
                      caption: "ภาพรวมแดชบอร์ดหลักในมุมมองเจ้าของหอพัก พร้อมเมนูพิเศษ",
                    })
                  }
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/manual/images/owner/01_owner_dashboard_sidebar.png" alt="หน้าแดชบอร์ดเจ้าของหอพัก" />
                  <div className="screenshot-hover-hint">
                    <Maximize2 size={13} />
                    <span>คลิกเพื่อขยายภาพ</span>
                  </div>
                </div>
                <div className="screenshot-caption">
                  ภาพที่ 1: ภาพรวมแดชบอร์ดเจ้าของหอพัก พร้อมจุดสำคัญ (1) การ์ดโปรไฟล์ Owner (2) เมนูเฉพาะเจ้าของหอพัก (3) แผงตัวชี้วัดภาพรวม
                </div>
              </div>

              <div className="manual-steps-list">
                <div className="manual-step-item">
                  <span className="step-num" style={{ background: "#7e22ce" }}>1</span>
                  <div>
                    <strong>จุดที่ 1: การ์ดโปรไฟล์เจ้าของหอพัก (Owner Profile Card)</strong>
                    <div style={{ color: "#475569", marginTop: "0.15rem" }}>
                      แสดงชื่อผู้บริหาร สัญลักษณ์มงกุฎ และป้ายกำกับสิทธิ์สีม่วง "Owner" ยืนยันว่าคุณกำลังใช้งานระบบในฐานะผู้มีอำนาจตัดสินใจสูงสุด
                    </div>
                  </div>
                </div>
                <div className="manual-step-item">
                  <span className="step-num" style={{ background: "#7e22ce" }}>2</span>
                  <div>
                    <strong>จุดที่ 2: แถบเมนูเฉพาะเจ้าของหอพัก (Owner Exclusive Menu)</strong>
                    <div style={{ color: "#475569", marginTop: "0.15rem" }}>
                      ประกอบด้วย 3 เครื่องมือหลัก: จัดการบัญชี Staff, ประเภทห้อง & อัตราค่าน้ำไฟ, และ วิเคราะห์รายรับ & การเงิน ซึ่งถูกซ่อนไว้จากเจ้าหน้าที่ทั่วไป
                    </div>
                  </div>
                </div>
                <div className="manual-step-item">
                  <span className="step-num" style={{ background: "#7e22ce" }}>3</span>
                  <div>
                    <strong>จุดที่ 3: แผงตัวชี้วัดภาพรวมอาคาร (Executive Highlights)</strong>
                    <div style={{ color: "#475569", marginTop: "0.15rem" }}>
                      สรุปสถิติด่วน 4 ด้าน: รายรับรวมที่ชำระแล้ว, ยอดหนี้ค้างชำระ, อัตราการเช่าห้องพัก (%), และจำนวนประเภทห้องพักที่เปิดให้บริการ
                    </div>
                  </div>
                </div>
              </div>

              <div className="callout-tip">
                <div className="callout-tip-header">
                  <Info size={16} />
                  <span>คำแนะนำการแบ่งแยกหน้าที่ระหว่างเจ้าของกับนิติบุคคล</span>
                </div>
                <div className="callout-tip-text">
                  แม้ว่าบัญชี Owner จะสามารถเข้าถึงฟังก์ชันงานประจำวันของนิติบุคคลได้ทุกอย่าง (เช่น ออกบิล หรือตรวจสลิป)
                  แต่แนะนำให้มอบหมายงานหน้างานให้นิติบุคคลปฏิบัติการเป็นหลัก และใช้บัญชี Owner สำหรับงานเชิงบริหาร กำกับดูแล และอนุมัติกรณีพิเศษ
                </div>
              </div>
            </section>

            {/* CHAPTER 2: FINANCIAL ANALYTICS */}
            <section id="ch2" className="chapter-box">
              <div className="chapter-header">
                <span className="chapter-badge" style={{ background: "#7e22ce" }}>บทที่ 2</span>
                <h2 className="chapter-title">รายงานผลประกอบการและการเงินเชิงลึก (Financial Analytics & Occupancy Dashboard)</h2>
                <p className="chapter-subtitle">
                  การวิเคราะห์กระแสเงินสด โครงสร้างรายได้ และสถิติอัตราการเช่าห้องพักรายเดือน
                </p>
              </div>

              <div className="screenshot-container">
                <div
                  className="screenshot-frame"
                  onClick={() =>
                    setLightboxImg({
                      src: "/manual/images/owner/02a_financial_analytics_overview.png",
                      caption: "หน้ารายงานผลประกอบการและการเงินเชิงลึก",
                    })
                  }
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/manual/images/owner/02a_financial_analytics_overview.png" alt="หน้ารายงานผลประกอบการ" />
                  <div className="screenshot-hover-hint">
                    <Maximize2 size={13} />
                    <span>คลิกเพื่อขยายภาพ</span>
                  </div>
                </div>
                <div className="screenshot-caption">
                  ภาพที่ 2a: หน้ารายงานผลประกอบการ (1) ตัวชี้วัด 4 มิติ (รายรับจริง/หนี้ค้าง/รอตรวจ/อัตราเช่า) (2) ป้ายสิทธิ์บริหาร Executive Crown
                </div>
              </div>

              <div className="screenshot-container">
                <div
                  className="screenshot-frame"
                  onClick={() =>
                    setLightboxImg({
                      src: "/manual/images/owner/02b_revenue_breakdown.png",
                      caption: "โครงสร้างสัดส่วนรายได้และสถิติห้องพัก",
                    })
                  }
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/manual/images/owner/02b_revenue_breakdown.png" alt="โครงสร้างสัดส่วนรายได้" />
                  <div className="screenshot-hover-hint">
                    <Maximize2 size={13} />
                    <span>คลิกเพื่อขยายภาพ</span>
                  </div>
                </div>
                <div className="screenshot-caption">
                  ภาพที่ 2b: โครงสร้างรายได้ (1) สัดส่วนรายรับแยกตามประเภท (ค่าห้อง/ค่าน้ำ/ค่าไฟ/ค่าบริการ) (2) สถิติห้องพักว่าง-ไม่ว่าง
                </div>
              </div>

              <div className="manual-steps-list">
                <div className="manual-step-item">
                  <span className="step-num" style={{ background: "#7e22ce" }}>1</span>
                  <div>
                    <strong>การวิเคราะห์รายรับจริงที่ได้รับแล้ว (Realized Revenue)</strong>
                    <div style={{ color: "#475569", marginTop: "0.15rem" }}>
                      แสดงยอดเงินรวมจากบิลที่มีสถานะ "ชำระแล้ว" (Paid) พร้อมแสดงจำนวนบิลที่ปิดรอบชำระเรียบร้อย
                    </div>
                  </div>
                </div>
                <div className="manual-step-item">
                  <span className="step-num" style={{ background: "#7e22ce" }}>2</span>
                  <div>
                    <strong>การติดตามหนี้ค้างชำระ (Arrears & Overdue Tracking)</strong>
                    <div style={{ color: "#475569", marginTop: "0.15rem" }}>
                      แสดงยอดหนี้ที่ผู้เช่ายังไม่ชำระ เพื่อให้ผู้บริหารติดตามนิติบุคคลในการออกหนังสือแจ้งเตือนชำระเงินตามกำหนด
                    </div>
                  </div>
                </div>
                <div className="manual-step-item">
                  <span className="step-num" style={{ background: "#7e22ce" }}>3</span>
                  <div>
                    <strong>การวิเคราะห์โครงสร้างรายได้ 4 ด้าน (Revenue Breakdown)</strong>
                    <div style={{ color: "#475569", marginTop: "0.15rem" }}>
                      แยกแยะรายรับชัดเจนระหว่าง ค่าเช่าห้องพัก (รายได้หลัก), ค่าไฟฟ้า (อัตรา 8 บาท/หน่วย), ค่าน้ำประปา (อัตรา 18 บาท/หน่วย), และค่าบริการส่วนกลาง
                    </div>
                  </div>
                </div>
                <div className="manual-step-item">
                  <span className="step-num" style={{ background: "#7e22ce" }}>4</span>
                  <div>
                    <strong>การติดตามอัตราการเข้าพัก (Occupancy Rate %)</strong>
                    <div style={{ color: "#475569", marginTop: "0.15rem" }}>
                      คำนวณสัดส่วนห้องพักที่มีผู้เช่าเทียบกับจำนวนห้องทั้งหมดในอาคาร ใช้ประเมินความคุ้มค่าและวางแผนการตลาดห้องว่าง
                    </div>
                  </div>
                </div>
              </div>

              <div className="callout-danger">
                <div className="callout-danger-header">
                  <AlertTriangle size={16} />
                  <span>ข้อควรระวัง: การกระทบยอดบัญชีธนาคาร (Bank Reconciliation)</span>
                </div>
                <div className="callout-danger-text">
                  ยอด "รายรับจริงที่ได้รับแล้ว" ในระบบมาจากการที่นิติบุคคลกดยืนยันอนุมัติสลิป
                  เจ้าของหอพักควรตรวจทานยอดรวมในระบบกับยอดเงินเข้าในสเตตเมนต์ธนาคารจริงอย่างน้อยสัปดาห์ละ 1 ครั้ง เพื่อป้องกันข้อผิดพลาดทางบัญชี
                </div>
              </div>
            </section>

            {/* CHAPTER 3: ROOM TYPES & RATES */}
            <section id="ch3" className="chapter-box">
              <div className="chapter-header">
                <span className="chapter-badge" style={{ background: "#7e22ce" }}>บทที่ 3</span>
                <h2 className="chapter-title">การจัดการประเภทห้องพักและกำหนดอัตราค่าบริการ (Room Types & Utility Rates)</h2>
                <p className="chapter-subtitle">
                  การกำหนดราคาค่าเช่ามาตรฐาน อัตราค่าน้ำ-ค่าไฟต่อหน่วย และข้อมูลสิ่งอำนวยความสะดวก
                </p>
              </div>

              <div className="screenshot-container">
                <div
                  className="screenshot-frame"
                  onClick={() =>
                    setLightboxImg({
                      src: "/manual/images/owner/03a_room_types_list.png",
                      caption: "หน้ารายการประเภทห้องพักและอัตราค่าน้ำ-ค่าไฟ",
                    })
                  }
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/manual/images/owner/03a_room_types_list.png" alt="หน้ารายการประเภทห้องพัก" />
                  <div className="screenshot-hover-hint">
                    <Maximize2 size={13} />
                    <span>คลิกเพื่อขยายภาพ</span>
                  </div>
                </div>
                <div className="screenshot-caption">
                  ภาพที่ 3a: หน้ารายการประเภทห้องพัก (1) ปุ่มเพิ่มประเภทห้องใหม่ (2) การ์ดข้อมูลราคาและค่าน้ำ-ไฟ (3) ปุ่มแก้ไขข้อมูล
                </div>
              </div>

              <div className="screenshot-container">
                <div
                  className="screenshot-frame"
                  onClick={() =>
                    setLightboxImg({
                      src: "/manual/images/owner/03b_room_type_modal.png",
                      caption: "หน้าต่างแก้ไขประเภทห้องพักและอัตราค่าน้ำ-ไฟ",
                    })
                  }
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/manual/images/owner/03b_room_type_modal.png" alt="หน้าต่างแก้ไขประเภทห้องพัก" />
                  <div className="screenshot-hover-hint">
                    <Maximize2 size={13} />
                    <span>คลิกเพื่อขยายภาพ</span>
                  </div>
                </div>
                <div className="screenshot-caption">
                  ภาพที่ 3b: หน้าต่างแก้ไขห้องพัก (1) ราคาค่าเช่าฐาน (2) รายการสิ่งอำนวยความสะดวก (3) ปุ่มบันทึกข้อมูล
                </div>
              </div>

              <div className="manual-steps-list">
                <div className="manual-step-item">
                  <span className="step-num" style={{ background: "#7e22ce" }}>1</span>
                  <div>
                    <strong>เข้าสู่เมนู "ประเภทห้อง & อัตราค่าน้ำไฟ"</strong>
                    <div style={{ color: "#475569", marginTop: "0.15rem" }}>
                      ระบบจะแสดงประเภทห้องพักที่เปิดให้บริการ เช่น Studio Standard, Deluxe Suite พร้อมอัตราค่าเช่าและค่าน้ำ-ไฟ
                    </div>
                  </div>
                </div>
                <div className="manual-step-item">
                  <span className="step-num" style={{ background: "#7e22ce" }}>2</span>
                  <div>
                    <strong>คลิกปุ่ม "แก้ไขข้อมูล" หรือ "เพิ่มประเภทห้องใหม่"</strong>
                    <div style={{ color: "#475569", marginTop: "0.15rem" }}>
                      ระบบจะเปิดหน้าต่างแก้ไขข้อมูล ให้กำหนดชื่อประเภท ขนาดห้อง รายละเอียดเฟอร์นิเจอร์ และลิงก์รูปภาพตัวอย่าง
                    </div>
                  </div>
                </div>
                <div className="manual-step-item">
                  <span className="step-num" style={{ background: "#7e22ce" }}>3</span>
                  <div>
                    <strong>กำหนดอัตราค่าน้ำประปาและค่าไฟฟ้าต่อหน่วย</strong>
                    <div style={{ color: "#475569", marginTop: "0.15rem" }}>
                      ระบุราคาค่าเช่าฐาน (เช่น 4,500 บาท/เดือน), อัตราค่าน้ำประปา (18 บาท/ยูนิต) และค่าไฟฟ้า (8 บาท/ยูนิต)
                    </div>
                  </div>
                </div>
              </div>

              <div className="callout-danger">
                <div className="callout-danger-header">
                  <AlertTriangle size={16} />
                  <span>ข้อควรระวังสำคัญ: การปรับอัตราค่าน้ำ-ค่าไฟต่อหน่วย</span>
                </div>
                <div className="callout-danger-text">
                  เมื่อปรับเปลี่ยนอัตราค่าน้ำหรือค่าไฟฟ้าในประเภทห้องพัก การคำนวณใหม่จะมีผลเฉพาะกับ "ใบแจ้งหนี้รอบใหม่" ที่จะออกหลังจากนี้เท่านั้น
                  จะไม่มีผลย้อนหลังกับใบแจ้งหนี้ที่เคยออกไปแล้วในรอบก่อนหน้า
                </div>
              </div>
            </section>

            {/* CHAPTER 4: STAFF ACCOUNTS */}
            <section id="ch4" className="chapter-box">
              <div className="chapter-header">
                <span className="chapter-badge" style={{ background: "#7e22ce" }}>บทที่ 4</span>
                <h2 className="chapter-title">การบริหารจัดการบัญชีเจ้าหน้าที่นิติบุคคล (Staff Accounts & Access Management)</h2>
                <p className="chapter-subtitle">
                  การสร้างบัญชีผู้ใช้งานใหม่ กำหนดบทบาท มอบสิทธิ์การเข้าถึง และระงับบัญชีเมื่อพ้นสภาพ
                </p>
              </div>

              <div className="screenshot-container">
                <div
                  className="screenshot-frame"
                  onClick={() =>
                    setLightboxImg({
                      src: "/manual/images/owner/04a_staff_accounts_list.png",
                      caption: "หน้ารายชื่อเจ้าหน้าที่นิติบุคคลและตำแหน่งงาน",
                    })
                  }
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/manual/images/owner/04a_staff_accounts_list.png" alt="หน้ารายชื่อเจ้าหน้าที่นิติบุคคล" />
                  <div className="screenshot-hover-hint">
                    <Maximize2 size={13} />
                    <span>คลิกเพื่อขยายภาพ</span>
                  </div>
                </div>
                <div className="screenshot-caption">
                  ภาพที่ 4a: หน้ารายชื่อบัญชี Staff (1) ปุ่มเพิ่มบัญชี Staff ใหม่ (2) รายชื่อและตำแหน่งงาน (3) ป้ายสิทธิ์ระดับบัญชี
                </div>
              </div>

              <div className="screenshot-container">
                <div
                  className="screenshot-frame"
                  onClick={() =>
                    setLightboxImg({
                      src: "/manual/images/owner/04b_staff_create_modal.png",
                      caption: "หน้าต่างเพิ่มบัญชีพนักงานนิติบุคคลใหม่",
                    })
                  }
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/manual/images/owner/04b_staff_create_modal.png" alt="หน้าต่างเพิ่มบัญชีพนักงานใหม่" />
                  <div className="screenshot-hover-hint">
                    <Maximize2 size={13} />
                    <span>คลิกเพื่อขยายภาพ</span>
                  </div>
                </div>
                <div className="screenshot-caption">
                  ภาพที่ 4b: หน้าต่างสร้าง Staff ใหม่ (1) ข้อมูลพนักงานและอีเมล (2) เช็กบ็อกซ์มอบสิทธิ์ Owner (3) ปุ่มยืนยันสร้างบัญชี
                </div>
              </div>

              <div className="manual-steps-list">
                <div className="manual-step-item">
                  <span className="step-num" style={{ background: "#7e22ce" }}>1</span>
                  <div>
                    <strong>คลิกปุ่ม "เพิ่มบัญชี Staff ใหม่"</strong>
                    <div style={{ color: "#475569", marginTop: "0.15rem" }}>
                      เปิดหน้าต่างสร้างบัญชี กรอกชื่อ-นามสกุล เบอร์โทรศัพท์ อีเมลล็อกอิน และรหัสผ่านเริ่มต้น (เช่น staff1234)
                    </div>
                  </div>
                </div>
                <div className="manual-step-item">
                  <span className="step-num" style={{ background: "#7e22ce" }}>2</span>
                  <div>
                    <strong>ระบุตำแหน่งงานและหน้าที่รับผิดชอบ</strong>
                    <div style={{ color: "#475569", marginTop: "0.15rem" }}>
                      เลือกหรือพิมพ์ตำแหน่ง เช่น "ผู้จัดการนิติบุคคล", "ช่างประจำอาคาร" หรือ "เจ้าหน้าที่ธุรการ"
                    </div>
                  </div>
                </div>
                <div className="manual-step-item">
                  <span className="step-num" style={{ background: "#7e22ce" }}>3</span>
                  <div>
                    <strong>การมอบสิทธิ์ระดับเจ้าของหอพัก (Owner Flag)</strong>
                    <div style={{ color: "#475569", marginTop: "0.15rem" }}>
                      หากติ๊กถูกที่ช่อง "มอบสิทธิ์เจ้าของหอพัก (is_owner = true)" บัญชีนั้นจะสามารถเข้าถึงเมนูการเงินและจัดการ Staff ได้เหมือนเจ้าของ
                    </div>
                  </div>
                </div>
              </div>

              <div className="callout-danger">
                <div className="callout-danger-header">
                  <AlertTriangle size={16} />
                  <span>ข้อควรระวังสำคัญ: การมอบสิทธิ์ระดับเจ้าของ (Owner Privileges)</span>
                </div>
                <div className="callout-danger-text">
                  ห้ามมอบสิทธิ์ระดับเจ้าของหอพัก (Owner) ให้แก่พนักงานทั่วไปโดยเด็ดขาด ควรมอบให้เฉพาะหุ้นส่วนหรือทายาทผู้ร่วมบริหารเท่านั้น
                  เนื่องจากผู้ถือสิทธิ์ Owner สามารถดูข้อมูลการเงินเชิงลึกและลบบัญชีพนักงานอื่นได้
                </div>
              </div>
            </section>

            {/* CHAPTER 5: FINANCIAL AUDIT */}
            <section id="ch5" className="chapter-box">
              <div className="chapter-header">
                <span className="chapter-badge" style={{ background: "#7e22ce" }}>บทที่ 5</span>
                <h2 className="chapter-title">การกำกับดูแลการเงินและการตรวจสอบสลิป (Financial Supervision & Slip Auditing)</h2>
                <p className="chapter-subtitle">
                  การตรวจสอบประวัติการอนุมัติสลิปย้อนหลัง การตรวจทานใบเสร็จรับเงิน และการป้องกันการทุจริต
                </p>
              </div>

              <div className="screenshot-container">
                <div
                  className="screenshot-frame"
                  onClick={() =>
                    setLightboxImg({
                      src: "/manual/images/owner/05_financial_audit_payments.png",
                      caption: "การตรวจสอบรายการชำระเงินและสลิปย้อนหลัง",
                    })
                  }
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/manual/images/owner/05_financial_audit_payments.png" alt="หน้าตรวจสอบรายการชำระเงิน" />
                  <div className="screenshot-hover-hint">
                    <Maximize2 size={13} />
                    <span>คลิกเพื่อขยายภาพ</span>
                  </div>
                </div>
                <div className="screenshot-caption">
                  ภาพที่ 5: การตรวจสอบการเงิน (1) ตัวกรองตรวจสอบประวัติสลิป (2) รายการอนุมัติยอดเงินและเลขที่ใบเสร็จทางการ
                </div>
              </div>

              <div className="manual-steps-list">
                <div className="manual-step-item">
                  <span className="step-num" style={{ background: "#7e22ce" }}>1</span>
                  <div>
                    <strong>เข้าสู่เมนู "การชำระเงิน" และกรองดูรายการ "ชำระแล้ว"</strong>
                    <div style={{ color: "#475569", marginTop: "0.15rem" }}>
                      ตรวจสอบสถิติการชำระเงินของผู้เช่าแต่ละห้อง ยอดเงินที่อนุมัติ และวันเวลาที่ทำรายการ
                    </div>
                  </div>
                </div>
                <div className="manual-step-item">
                  <span className="step-num" style={{ background: "#7e22ce" }}>2</span>
                  <div>
                    <strong>การคลิกดูภาพสลิปย้อนหลัง (Audit Inspection)</strong>
                    <div style={{ color: "#475569", marginTop: "0.15rem" }}>
                      คลิกเปิดดูภาพสลิปที่แนบมา เพื่อตรวจเช็ครหัสธุรกรรม (Transaction Ref) และชื่อผู้โอนเงิน
                    </div>
                  </div>
                </div>
                <div className="manual-step-item">
                  <span className="step-num" style={{ background: "#7e22ce" }}>3</span>
                  <div>
                    <strong>การตรวจสอบความถูกต้องของใบเสร็จทางการ</strong>
                    <div style={{ color: "#475569", marginTop: "0.15rem" }}>
                      ระบบจะกำกับเลขที่ใบเสร็จรับเงิน (Receipt No.) แบบต่อเนื่องอัตโนมัติ สำหรับใช้เป็นหลักฐานประกอบการลงบัญชี
                    </div>
                  </div>
                </div>
              </div>

              <div className="callout-tip">
                <div className="callout-tip-header">
                  <Info size={16} />
                  <span>คำแนะนำ: การสุ่มตรวจสลิปประจำสัปดาห์ (Weekly Spot-Check)</span>
                </div>
                <div className="callout-tip-text">
                  เจ้าของหอพักควรสุ่มตรวจสลิปการโอนเงินที่นิติบุคคลกดอนุมัติไปแล้วสัปดาห์ละ 5-10 รายการ
                  โดยนำรหัสอ้างอิงไปตรวจสอบกับประวัติยอดเงินเข้าในบัญชีธนาคารจริง เพื่อสร้างมาตรฐานความโปร่งใสสูงสุด
                </div>
              </div>
            </section>

            {/* CHAPTER 6: CONTRACTS & DEPOSITS */}
            <section id="ch6" className="chapter-box">
              <div className="chapter-header">
                <span className="chapter-badge" style={{ background: "#7e22ce" }}>บทที่ 6</span>
                <h2 className="chapter-title">การบริหารสัญญาเช่า เงินประกัน และการเข้าพัก (Tenants, Contracts & Deposits Control)</h2>
                <p className="chapter-subtitle">
                  การควบคุมวงเงินประกันความเสียหายรวมของทั้งอาคาร และการบริหารสัญญาเช่าระยะยาว
                </p>
              </div>

              <div className="manual-steps-list">
                <div className="manual-step-item">
                  <span className="step-num" style={{ background: "#7e22ce" }}>1</span>
                  <div>
                    <strong>การดูแลเงินประกันความเสียหาย (Security Deposit Pool)</strong>
                    <div style={{ color: "#475569", marginTop: "0.15rem" }}>
                      เงินประกันห้องพัก (เช่น 9,000 บาท/ห้อง สำหรับสัญญา 1 ปี) ถือเป็นเงินที่ต้องส่งคืนผู้เช่าเมื่อย้ายออกและตรวจรับห้องเรียบร้อย เจ้าของควรจัดเก็บในบัญชีสำรองแยกต่างหาก
                    </div>
                  </div>
                </div>
                <div className="manual-step-item">
                  <span className="step-num" style={{ background: "#7e22ce" }}>2</span>
                  <div>
                    <strong>การติดตามสัญญาเช่าที่ใกล้หมดอายุ (Contract Renewal Tracking)</strong>
                    <div style={{ color: "#475569", marginTop: "0.15rem" }}>
                      ระบบจะแจ้งเตือนห้องที่มีสัญญาเหลือน้อยกว่า 30 วัน เพื่อให้นิติดำเนินการสอบถามความต้องการต่อสัญญาหรือเตรียมการเปิดรับผู้เช่าใหม่
                    </div>
                  </div>
                </div>
                <div className="manual-step-item">
                  <span className="step-num" style={{ background: "#7e22ce" }}>3</span>
                  <div>
                    <strong>การจัดการหักลบกลบหนี้เงินประกันเมื่อย้ายออก</strong>
                    <div style={{ color: "#475569", marginTop: "0.15rem" }}>
                      เมื่อผู้เช่าแจ้งย้ายออก เจ้าของสามารถกำกับดูแลรายงานการหักค่าน้ำ-ไฟคงค้าง และค่าชดเชยอุปกรณ์เสียหายจากเงินประกันได้อย่างเป็นธรรม
                    </div>
                  </div>
                </div>
              </div>

              <div className="callout-danger">
                <div className="callout-danger-header">
                  <AlertTriangle size={16} />
                  <span>ข้อควรระวังสำคัญ: กฎหมายคุ้มครองผู้บริโภคเกี่ยวกับเงินประกัน</span>
                </div>
                <div className="callout-danger-text">
                  ตามประกาศ สคบ. การเก็บเงินประกันการเช่าที่อยู่อาศัยต้องไม่เกินอัตราค่าเช่า 1 เดือน
                  และต้องคืนเงินประกันให้แก่ผู้เช่าภายใน 7 วันทำการนับแต่วันสิ้นสุดสัญญาเช่าและตรวจรับห้องพักเสร็จสิ้น
                </div>
              </div>
            </section>

            {/* CHAPTER 7: MAINTENANCE & LINE */}
            <section id="ch7" className="chapter-box">
              <div className="chapter-header">
                <span className="chapter-badge" style={{ background: "#7e22ce" }}>บทที่ 7</span>
                <h2 className="chapter-title">การควบคุมงานบำรุงรักษาและการสื่อสารกับผู้เช่า (Maintenance Oversight & Broadcast Control)</h2>
                <p className="chapter-subtitle">
                  การควบคุมค่าใช้จ่ายในการซ่อมบำรุง และการกำกับดูแลนโยบายการกระจายข่าวสารผ่าน LINE OA
                </p>
              </div>

              <div className="manual-steps-list">
                <div className="manual-step-item">
                  <span className="step-num" style={{ background: "#7e22ce" }}>1</span>
                  <div>
                    <strong>การติดตามประสิทธิภาพการซ่อมบำรุง (Maintenance SLA Monitoring)</strong>
                    <div style={{ color: "#475569", marginTop: "0.15rem" }}>
                      ตรวจสอบจำนวนงานซ่อมที่ค้างอยู่ เวลาเฉลี่ยในการเข้าแก้ไขของช่างเทคนิค และรายการอุปกรณ์ที่ต้องเปลี่ยนบ่อยเป็นพิเศษ
                    </div>
                  </div>
                </div>
                <div className="manual-step-item">
                  <span className="step-num" style={{ background: "#7e22ce" }}>2</span>
                  <div>
                    <strong>การอนุมัติงบประมาณซ่อมแซมส่วนกลาง</strong>
                    <div style={{ color: "#475569", marginTop: "0.15rem" }}>
                      กรณีงานซ่อมใหญ่ที่มีมูลค่าเกินวงเงินอำนาจนิติบุคคล (เช่น มอเตอร์ปั๊มน้ำอาคาร, หม้อแปลงไฟฟ้า, ลิฟต์โดยสาร) ต้องได้รับการอนุมัติจากเจ้าของผ่านระบบก่อนสั่งซื้ออะไหล่
                    </div>
                  </div>
                </div>
                <div className="manual-step-item">
                  <span className="step-num" style={{ background: "#7e22ce" }}>3</span>
                  <div>
                    <strong>นโยบายการบรอดแคสต์ประกาศแจ้งเตือน</strong>
                    <div style={{ color: "#475569", marginTop: "0.15rem" }}>
                      กำกับดูแลให้นิติบุคคลส่งบรอดแคสต์ LINE OA เฉพาะกรณีจำเป็นจริง เช่น แจ้งปิดระบบน้ำ-ไฟ หรือแจ้งพายุเข้า เพื่อป้องกันไม่ให้ผู้เช่ารำคาญและบล็อก LINE OA ของหอพัก
                    </div>
                  </div>
                </div>
              </div>

              <div className="callout-tip">
                <div className="callout-tip-header">
                  <Info size={16} />
                  <span>คำแนะนำ: การจัดทำแผนบำรุงรักษาเชิงป้องกัน (Preventive Maintenance)</span>
                </div>
                <div className="callout-tip-text">
                  เจ้าของควรจัดรอบตรวจเช็คระบบไฟฟ้า ปั๊มน้ำ ถังพักน้ำ และล้างแอร์ส่วนกลางทุกๆ 6 เดือน
                  เพื่อยืดอายุการใช้งานอุปกรณ์และลดค่าใช้จ่ายในการซ่อมแซมฉุกเฉิน
                </div>
              </div>
            </section>

            {/* CHAPTER 8: GOLDEN RULES */}
            <section id="ch8" className="chapter-box">
              <div className="chapter-header">
                <span className="chapter-badge" style={{ background: "#7e22ce" }}>บทที่ 8</span>
                <h2 className="chapter-title">แนวปฏิบัติและข้อควรระวังสำคัญสำหรับเจ้าของหอพัก (Executive Governance & Golden Rules)</h2>
                <p className="chapter-subtitle">
                  4 กฎเหล็กด้านความปลอดภัย การเงิน และกฎหมายเพื่อการบริหารจัดการอาคารอย่างยั่งยืน
                </p>
              </div>

              <div className="manual-steps-list">
                <div className="manual-step-item">
                  <span className="step-num" style={{ background: "#7e22ce" }}>1</span>
                  <div>
                    <strong>กฎข้อที่ 1: การรักษาความปลอดภัยของบัญชีระดับ Owner</strong>
                    <div style={{ color: "#475569", marginTop: "0.15rem" }}>
                      รหัสผ่านบัญชีเจ้าของต้องมีความยาวไม่น้อยกว่า 8 ตัวอักษร ผสมตัวอักษรพิมพ์ใหญ่ พิมพ์เล็ก ตัวเลข และสัญลักษณ์ ห้ามจดรหัสผ่านไว้ในที่เปิดเผย หรือแชร์บัญชีร่วมกับเจ้าหน้าที่ธุรการ
                    </div>
                  </div>
                </div>
                <div className="manual-step-item">
                  <span className="step-num" style={{ background: "#7e22ce" }}>2</span>
                  <div>
                    <strong>กฎข้อที่ 2: การกระทบยอดบัญชีธนาคารทุกสิ้นเดือน</strong>
                    <div style={{ color: "#475569", marginTop: "0.15rem" }}>
                      พิมพ์รายงานสรุปรายรับจากระบบ และนำไปตรวจสอบเทียบกับ Statement ธนาคารทุกสิ้นเดือน เพื่อให้แน่ใจว่ายอดเงินตรงกัน 100% ก่อนปิดงบการเงินประจำรอบ
                    </div>
                  </div>
                </div>
                <div className="manual-step-item">
                  <span className="step-num" style={{ background: "#7e22ce" }}>3</span>
                  <div>
                    <strong>กฎข้อที่ 3: การจัดสรรเงินกองทุนสำรองบำรุงรักษา (Sinking Fund)</strong>
                    <div style={{ color: "#475569", marginTop: "0.15rem" }}>
                      ควรกันเงินสำรอง 5% - 10% ของรายรับสุทธิในแต่ละเดือนเข้าบัญชีกองทุนสำรอง สำหรับการทาสีอาคารใหม่ การเปลี่ยนเครื่องปรับอากาศเมื่อครบอายุ และการปรับปรุงภูมิทัศน์
                    </div>
                  </div>
                </div>
                <div className="manual-step-item">
                  <span className="step-num" style={{ background: "#7e22ce" }}>4</span>
                  <div>
                    <strong>กฎข้อที่ 4: การปฏิบัติตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA)</strong>
                    <div style={{ color: "#475569", marginTop: "0.15rem" }}>
                      ภาพถ่ายบัตรประชาชน เอกสารสัญญาเช่า และเบอร์โทรศัพท์ของผู้พักอาศัย ถือเป็นข้อมูลส่วนบุคคลที่ต้องได้รับการคุ้มครอง ห้ามนำไปเผยแพร่ภายนอกโดยไม่ได้รับความยินยอม
                    </div>
                  </div>
                </div>
              </div>

              <div className="callout-danger">
                <div className="callout-danger-header">
                  <AlertTriangle size={16} />
                  <span>คำเตือนระดับผู้บริหาร: การระงับสิทธิ์พนักงานที่สิ้นสุดสัญญาจ้างทันที</span>
                </div>
                <div className="callout-danger-text">
                  เมื่อพนักงานนิติบุคคลหรือช่างเทคนิคลาออก เจ้าของหอพักต้องเข้ามาที่เมนู "จัดการบัญชี Staff"
                  และทำการระงับหรือลบบัญชีของพนักงานผู้นั้นทันทีในวันสุดท้ายของการทำงาน เพื่อป้องกันการเข้าถึงข้อมูลระบบโดยไม่ได้รับอนุญาต
                </div>
              </div>
            </section>

            {/* CHAPTER 9: FAQ */}
            <section id="ch9" className="chapter-box">
              <div className="chapter-header">
                <span className="chapter-badge" style={{ background: "#7e22ce" }}>บทที่ 9</span>
                <h2 className="chapter-title">คำถามที่พบบ่อยสำหรับเจ้าของหอพัก (Executive FAQ)</h2>
                <p className="chapter-subtitle">
                  รวม 6 ข้อสงสัยเชิงบริหาร การเงิน ภาษี และแนวทางจัดการความเสี่ยง
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
                <div
                  style={{
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    padding: "1.25rem",
                  }}
                >
                  <div style={{ fontWeight: 700, color: "#0f172a", marginBottom: "0.4rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <HelpCircle size={17} style={{ color: "#7e22ce" }} />
                    <span>คำถามที่ 1: หากเจ้าของต้องการมอบหมายให้นิติบุคคลจัดการงานแทน สามารถตั้งสิทธิ์อย่างไร?</span>
                  </div>
                  <div style={{ color: "#475569", fontSize: "0.88rem", lineHeight: 1.6, paddingLeft: "1.6rem" }}>
                    <strong>คำตอบ:</strong> เจ้าของสามารถสร้างบัญชี Staff ทั่วไปให้นิติบุคคล โดยไม่ต้องติ๊กช่อง "มอบสิทธิ์เจ้าของหอพัก" นิติบุคคลจะสามารถออกบิล ตรวจสลิป ดูแลงานซ่อม และจัดผังห้องได้ครบถ้วน แต่นิติบุคคลจะไม่สามารถดูรายงานผลประกอบการการเงิน และไม่สามารถแก้ไขประเภทห้องพักหรือลบบัญชีพนักงานได้
                  </div>
                </div>

                <div
                  style={{
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    padding: "1.25rem",
                  }}
                >
                  <div style={{ fontWeight: 700, color: "#0f172a", marginBottom: "0.4rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <HelpCircle size={17} style={{ color: "#7e22ce" }} />
                    <span>คำถามที่ 2: ยอดรายรับในหน้าวิเคราะห์การเงิน เป็นยอดเงินสุทธิหรือรวมภาษีแล้ว?</span>
                  </div>
                  <div style={{ color: "#475569", fontSize: "0.88rem", lineHeight: 1.6, paddingLeft: "1.6rem" }}>
                    <strong>คำตอบ:</strong> ยอดรายรับที่แสดงเป็นยอดรวมที่เรียกเก็บจริงตามใบแจ้งหนี้ (ค่าเช่าห้องพัก + ค่าน้ำ + ค่าไฟ + ค่าบริการ) ซึ่งยังไม่ได้หักภาษีเงินได้หัก ณ ที่จ่าย หรือภาษีที่ดินและสิ่งปลูกสร้าง เจ้าของสามารถนำยอดสรุปนี้ไปให้ผู้ทำบัญชีคำนวณภาษีประจำปีได้โดยตรง
                  </div>
                </div>

                <div
                  style={{
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    padding: "1.25rem",
                  }}
                >
                  <div style={{ fontWeight: 700, color: "#0f172a", marginBottom: "0.4rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <HelpCircle size={17} style={{ color: "#7e22ce" }} />
                    <span>คำถามที่ 3: การปรับราคาค่าเช่าห้องพัก จะมีผลกระทบต่อสัญญาเช่าเดิมที่ยังไม่หมดอายุหรือไม่?</span>
                  </div>
                  <div style={{ color: "#475569", fontSize: "0.88rem", lineHeight: 1.6, paddingLeft: "1.6rem" }}>
                    <strong>คำตอบ:</strong> ไม่มีผลกระทบ สัญญาเช่าเดิมจะยังคงใช้อัตราค่าเช่าตามที่ระบุไว้ในสัญญาจนกว่าจะสิ้นสุดระยะเวลาสัญญา การปรับราคาฐานในระบบจะมีผลเฉพาะกับสัญญาใหม่ที่จะทำขึ้นหลังจากวันที่มีการปรับเปลี่ยนเท่านั้น
                  </div>
                </div>

                <div
                  style={{
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    padding: "1.25rem",
                  }}
                >
                  <div style={{ fontWeight: 700, color: "#0f172a", marginBottom: "0.4rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <HelpCircle size={17} style={{ color: "#7e22ce" }} />
                    <span>คำถามที่ 4: เมื่อพนักงานนิติบุคคลลาออก เจ้าของควรดำเนินการเกี่ยวกับบัญชีในระบบอย่างไร?</span>
                  </div>
                  <div style={{ color: "#475569", fontSize: "0.88rem", lineHeight: 1.6, paddingLeft: "1.6rem" }}>
                    <strong>คำตอบ:</strong> ให้เจ้าของเข้าสู่ระบบด้วยบัญชี Owner ไปที่เมนู "จัดการบัญชี Staff" ค้นหาชื่อพนักงานที่ลาออก แล้วคลิกปุ่ม "ลบบัญชี" ระบบจะตัดสิทธิ์การเข้าใช้งานทันที ป้องกันไม่ให้อดีตพนักงานล็อกอินเข้าระบบได้อีก
                  </div>
                </div>

                <div
                  style={{
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    padding: "1.25rem",
                  }}
                >
                  <div style={{ fontWeight: 700, color: "#0f172a", marginBottom: "0.4rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <HelpCircle size={17} style={{ color: "#7e22ce" }} />
                    <span>คำถามที่ 5: สามารถส่งออกข้อมูลรายงานการเงิน (Export Report) เพื่อนำไปยื่นบัญชีได้อย่างไร?</span>
                  </div>
                  <div style={{ color: "#475569", fontSize: "0.88rem", lineHeight: 1.6, paddingLeft: "1.6rem" }}>
                    <strong>คำตอบ:</strong> ในหน้ารายงานผลประกอบการ (`/staff/owner/analytics`) เจ้าของสามารถกดปุ่ม "สั่งพิมพ์" หรือ "พิมพ์เป็น PDF" ในเบราว์เซอร์ เพื่อพิมพ์รายงานสรุปผลประกอบการประจำเดือน และสามารถพิมพ์ใบเสร็จรับเงินทางการรายห้องเพื่อใช้เป็นเอกสารประกอบการลงบัญชีได้ครบถ้วน
                  </div>
                </div>

                <div
                  style={{
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    padding: "1.25rem",
                  }}
                >
                  <div style={{ fontWeight: 700, color: "#0f172a", marginBottom: "0.4rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <HelpCircle size={17} style={{ color: "#7e22ce" }} />
                    <span>คำถามที่ 6: กรณีผู้เช่าค้างชำระค่าเช่าเกินกำหนด ระบบมีมาตรการช่วยเหลือเจ้าของอย่างไร?</span>
                  </div>
                  <div style={{ color: "#475569", fontSize: "0.88rem", lineHeight: 1.6, paddingLeft: "1.6rem" }}>
                    <strong>คำตอบ:</strong> ระบบจะแสดงยอดค้างชำระเป็นตัวเลขสีแดงในแดชบอร์ด และขึ้นสถานะ "ค้างชำระ" ที่การ์ดห้องพักในหน้าผังห้อง นิติบุคคลสามารถกดออกหนังสือแจ้งเตือนชำระเงิน และสามารถส่งข้อความแจ้งเตือนตรงเข้า LINE ของผู้เช่าห้องดังกล่าวได้ทันที
                  </div>
                </div>
              </div>

              <div className="callout-tip" style={{ marginTop: "1.5rem" }}>
                <div className="callout-tip-header">
                  <ShieldCheck size={16} />
                  <span>การให้คำปรึกษาด้านการขยายสาขาและการลงทุนอพาร์ตเมนต์</span>
                </div>
                <div className="callout-tip-text">
                  หากเจ้าของโครงการต้องการขยายสาขาเพิ่มเติม หรือต้องการเชื่อมต่อระบบเข้ากับเครื่องคิดเงินอัตโนมัติ/ประตูคีย์การ์ดกลาง
                  สามารถติดต่อทีมพัฒนาระบบได้ที่ <strong>support@thesaranrom.com</strong> เพื่อขอรับการประเมินสถาปัตยกรรมทางเทคนิคเพิ่มเติม
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Bottom Contact Card */}
        <div className="manual-contact-card">
          <div className="manual-contact-left">
            <div className="manual-contact-icon" style={{ background: "rgba(147, 51, 234, 0.08)", color: "#7e22ce" }}>
              <Crown size={22} />
            </div>
            <div>
              <div className="manual-contact-title">คณะผู้บริหาร เดอะ สราญรมย์ เรสซิเดนซ์</div>
              <div className="manual-contact-subtitle">
                ศูนย์กลางการตัดสินใจเชิงบริหาร การควบคุมต้นทุนสาธารณูปโภค และการกำกับดูแลความโปร่งใส
              </div>
            </div>
          </div>
          <div className="manual-contact-badge">โทรสายตรง: 081-999-8888 | LINE OA: @thesaranrom</div>
        </div>
      </div>
    </div>
  );
}
