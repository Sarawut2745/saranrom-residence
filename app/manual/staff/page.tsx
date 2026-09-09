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
  FileCheck,
  Building,
  Wrench,
  Users,
  Megaphone,
  LayoutTemplate,
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
    title: "หน้าแดชบอร์ดนิติบุคคลและคิวงานประจำวัน (Staff Dashboard)",
    shortTitle: "1. แดชบอร์ดนิติบุคคล",
    description: "ภาพรวมตัวชี้วัดสำคัญ คิวตรวจสลิป และสรุปสถานะห้องพักประจำอาคาร",
  },
  {
    id: "ch2",
    number: "บทที่ 2",
    title: "การออกบิลและจดมิเตอร์น้ำ-ไฟประจำเดือน (Monthly Bills & Meter Entry)",
    shortTitle: "2. ออกบิล & จดมิเตอร์",
    description: "บันทึกเลขมิเตอร์ คำนวณค่าน้ำ-ค่าไฟอัตโนมัติ และพิมพ์ใบแจ้งหนี้",
  },
  {
    id: "ch3",
    number: "บทที่ 3",
    title: "การตรวจสอบสลิปและอนุมัติการชำระเงิน (Payments & Slip Verification)",
    shortTitle: "3. ตรวจสอบสลิปโอนเงิน",
    description: "ตรวจสอบยอดเงิน วันที่และเวลาโอนกับสเตตเมนต์ และอนุมัติการชำระเงิน",
  },
  {
    id: "ch4",
    number: "บทที่ 4",
    title: "การจัดการผังห้องพักและเปลี่ยนสถานะ (Rooms Management)",
    shortTitle: "4. จัดการผังห้องพัก",
    description: "ดูผังห้องพักทุกชั้น เปลี่ยนสถานะว่าง มีผู้เช่า หรือปิดปรับปรุง",
  },
  {
    id: "ch5",
    number: "บทที่ 5",
    title: "การจัดการงานแจ้งซ่อมบำรุง (Repairs & Maintenance Workflow)",
    shortTitle: "5. คิวงานแจ้งซ่อมบำรุง",
    description: "รับเรื่องแจ้งซ่อม จ่ายงานช่างเทคนิค และอัปเดตสถานะการแก้ไข",
  },
  {
    id: "ch6",
    number: "บทที่ 6",
    title: "ข้อมูลผู้เช่าและสัญญาเช่า (Tenants & Contracts)",
    shortTitle: "6. ผู้เช่าและสัญญาเช่า",
    description: "บันทึกประวัติผู้เช่า ระยะเวลาสัญญา เงินประกัน และเอกสารประจำห้อง",
  },
  {
    id: "ch7",
    number: "บทที่ 7",
    title: "การส่งประกาศและแจ้งเตือนผ่าน LINE (Announcements & LINE Broadcast)",
    shortTitle: "7. ส่งประกาศ & LINE OA",
    description: "กระจายข่าวสาร ปิดปรับปรุงระบบน้ำ-ไฟ และบรอดแคสต์เข้า LINE ผู้เช่า",
  },
  {
    id: "ch8",
    number: "บทที่ 8",
    title: "การจัดการเนื้อหาหน้าเว็บไซต์หลัก (Landing Page Content CMS)",
    shortTitle: "8. จัดการเนื้อหาเว็บ",
    description: "อัปเดตราคาห้องพัก ข้อมูลสิ่งอำนวยความสะดวก และรูปภาพส่วนกลาง",
  },
  {
    id: "ch9",
    number: "บทที่ 9",
    title: "คำถามที่พบบ่อยสำหรับนิติบุคคล (Staff Operations FAQ)",
    shortTitle: "9. คำถามที่พบบ่อย (FAQ)",
    description: "รวมแนวทางแก้ไขปัญหาการใช้งานระบบและแนวปฏิบัติการดูแลอาคาร",
  },
];

export default function StaffManualPage() {
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
            <span className="manual-breadcrumb-current">คู่มือนิติบุคคลและช่างเทคนิค (เล่มที่ 2)</span>
          </div>

          <div className="manual-actions-row">
            <button onClick={handlePrint} className="manual-btn-secondary" style={{ padding: "0.45rem 0.9rem", fontSize: "0.82rem" }}>
              <Printer size={15} />
              <span>สั่งพิมพ์</span>
            </button>
            <a
              href="/manual/manual-staff.pdf"
              download
              className="manual-btn-primary"
              style={{ padding: "0.45rem 1rem", fontSize: "0.82rem" }}
            >
              <Download size={15} />
              <span>ดาวน์โหลด PDF (3.2 MB)</span>
            </a>
          </div>
        </div>

        {/* Manual Cover Banner */}
        <div
          className="manual-hero-rental-banner"
          style={{
            background: "linear-gradient(135deg, #064e3b 0%, #0f172a 65%, #065f46 100%)",
          }}
        >
          <div>
            <div className="manual-tag manual-tag-banner">
              <BookOpen size={13} />
              <span>USER MANUAL - VOLUME 2: STAFF OPERATIONS PORTAL</span>
            </div>
            <h1 className="manual-hero-title-light">คู่มือการใช้งานระบบสำหรับนิติบุคคลและช่างเทคนิค</h1>
            <p className="manual-hero-desc-light">
              เดอะ สราญรมย์ เรสซิเดนซ์ (The Saranrom Residence & Apartment)
              รวบรวมขั้นตอนการบริหารงานอาคาร การออกบิลและจดมิเตอร์น้ำ-ไฟ การตรวจสอบและอนุมัติสลิปโอนเงิน
              การจัดผังห้องพัก การรับเรื่องและจ่ายงานซ่อมบำรุง ตลอดจนการบรอดแคสต์ประกาศแจ้งเตือนอย่างละเอียด
            </p>
            <div style={{ display: "flex", gap: "1rem", fontSize: "0.75rem", color: "#a7f3d0", marginTop: "1rem", flexWrap: "wrap" }}>
              <span>ฉบับปรับปรุง: กันยายน 2026</span>
              <span>•</span>
              <span>ผู้ใช้งาน: เจ้าหน้าที่นิติบุคคลและช่างประจำอาคาร</span>
              <span>•</span>
              <span>จำนวนบท: 9 บท (พร้อมภาพหน้าจอประกอบจริง)</span>
            </div>
          </div>
        </div>

        {/* Main Content Layout: Sidebar + Chapters */}
        <div className="rental-manual-layout">
          {/* Sticky Sidebar Navigation */}
          <div className="rental-sidebar">
            <div className="rental-sidebar-title">สารบัญเนื้อหา (Staff Chapters)</div>
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
                <PhoneCall size={14} style={{ color: "#065f46" }} />
                <span>ฝ่ายบริหารจัดการอาคาร</span>
              </div>
              <div style={{ fontSize: "0.78rem", color: "#64748b", lineHeight: 1.5 }}>
                โทร: 081-999-8888, 02-711-0099
                <br />
                LINE OA: @thesaranrom
                <br />
                เวลาทำการ: ทุกวัน 08:30 - 18:00 น.
              </div>
            </div>
          </div>

          {/* Chapters Content */}
          <div className="rental-content-area">
            {/* CHAPTER 1: DASHBOARD */}
            <section id="ch1" className="chapter-box">
              <div className="chapter-header">
                <span className="chapter-badge">บทที่ 1</span>
                <h2 className="chapter-title">หน้าแดชบอร์ดนิติบุคคลและคิวงานประจำวัน (Staff Dashboard)</h2>
                <p className="chapter-subtitle">
                  ศูนย์รวมตัวชี้วัดสำคัญ คิวงานด่วนที่ต้องดำเนินการ และสถานะห้องพักแบบเรียลไทม์
                </p>
              </div>

              <div className="screenshot-container">
                <div
                  className="screenshot-frame"
                  onClick={() =>
                    setLightboxImg({
                      src: "/manual/images/staff/01_staff_dashboard.png",
                      caption: "ภาพรวมแดชบอร์ดนิติบุคคลและคิวงานเร่งด่วน",
                    })
                  }
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/manual/images/staff/01_staff_dashboard.png" alt="หน้าแดชบอร์ดนิติบุคคล" />
                  <div className="screenshot-hover-hint">
                    <Maximize2 size={13} />
                    <span>คลิกเพื่อขยายภาพ</span>
                  </div>
                </div>
                <div className="screenshot-caption">
                  ภาพที่ 1: ภาพรวมแดชบอร์ดนิติบุคคล พร้อมจุดสำคัญ (1) คิวตรวจสลิป (2) ปุ่มออกบิลด่วน (3) ตัวชี้วัดงาน
                </div>
              </div>

              <div className="manual-steps-list">
                <div className="manual-step-item">
                  <span className="step-num">1</span>
                  <div>
                    <strong>จุดที่ 1: คิวตรวจสอบสลิปโอนเงินล่าสุด (Pending Slips Queue)</strong>
                    <div style={{ color: "#475569", marginTop: "0.15rem" }}>
                      แสดงรายการสลิปที่ผู้เช่าอัปโหลดเข้ามาใหม่ เจ้าหน้าที่สามารถคลิกปุ่ม "ตรวจสลิป" เพื่อเปิดหน้าต่างตรวจสอบยอดเงินได้ทันที
                    </div>
                  </div>
                </div>
                <div className="manual-step-item">
                  <span className="step-num">2</span>
                  <div>
                    <strong>จุดที่ 2: ปุ่มออกบิลใหม่ / จดมิเตอร์ (Quick Action)</strong>
                    <div style={{ color: "#475569", marginTop: "0.15rem" }}>
                      ทางลัดสำหรับเปิดหน้าต่างบันทึกเลขมิเตอร์น้ำประปาและไฟฟ้าประจำเดือน เพื่อคำนวณและออกใบแจ้งหนี้ให้ผู้เช่า
                    </div>
                  </div>
                </div>
                <div className="manual-step-item">
                  <span className="step-num">3</span>
                  <div>
                    <strong>จุดที่ 3: แผงตัวชี้วัดด่วน 4 ด้าน (Key Metrics Cards)</strong>
                    <div style={{ color: "#475569", marginTop: "0.15rem" }}>
                      สรุปสถิติด่วน ได้แก่ จำนวนสลิปรอตรวจ, บิลค้างชำระทั้งหมด, งานแจ้งซ่อมที่ยังค้างอยู่ และจำนวนห้องว่างพร้อมเปิดเช่า
                    </div>
                  </div>
                </div>
              </div>

              <div className="callout-tip">
                <div className="callout-tip-header">
                  <Info size={16} />
                  <span>คำแนะนำการปฏิบัติงานประจำวัน (Daily Routine)</span>
                </div>
                <div className="callout-tip-text">
                  เจ้าหน้าที่นิติบุคคลควรเปิดหน้าแดชบอร์ดตรวจสอบเป็นสิ่งแรกในทุกเช้า (เวลา 08:30 น.)
                  เพื่อเคลียร์คิวสลิปที่ผู้เช่าโอนเข้ามาช่วงค่ำ และจ่ายงานแจ้งซ่อมเร่งด่วนให้ช่างเทคนิคดำเนินการภายใน 2 ชั่วโมง
                </div>
              </div>
            </section>

            {/* CHAPTER 2: BILLS & METERS */}
            <section id="ch2" className="chapter-box">
              <div className="chapter-header">
                <span className="chapter-badge">บทที่ 2</span>
                <h2 className="chapter-title">การออกบิลและจดมิเตอร์น้ำ-ไฟประจำเดือน (Monthly Bills & Meter Entry)</h2>
                <p className="chapter-subtitle">
                  ขั้นตอนการบันทึกเลขมิเตอร์น้ำประปาและไฟฟ้า การคำนวณยูนิตอัตโนมัติ และการพิมพ์ใบแจ้งหนี้
                </p>
              </div>

              <div className="screenshot-container">
                <div
                  className="screenshot-frame"
                  onClick={() =>
                    setLightboxImg({
                      src: "/manual/images/staff/02a_bills_overview.png",
                      caption: "หน้ารายการใบแจ้งหนี้ประจำเดือน",
                    })
                  }
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/manual/images/staff/02a_bills_overview.png" alt="หน้ารายการใบแจ้งหนี้" />
                  <div className="screenshot-hover-hint">
                    <Maximize2 size={13} />
                    <span>คลิกเพื่อขยายภาพ</span>
                  </div>
                </div>
                <div className="screenshot-caption">
                  ภาพที่ 2a: หน้ารายการใบแจ้งหนี้ (1) ปุ่มออกบิลใหม่ (2) แท็บตัวกรองสถานะ (3) ตารางรายการบิลรายห้อง
                </div>
              </div>

              <div className="screenshot-container">
                <div
                  className="screenshot-frame"
                  onClick={() =>
                    setLightboxImg({
                      src: "/manual/images/staff/02b_meter_entry_modal.png",
                      caption: "หน้าต่างบันทึกเลขมิเตอร์น้ำ-ไฟฟ้า",
                    })
                  }
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/manual/images/staff/02b_meter_entry_modal.png" alt="หน้าต่างบันทึกมิเตอร์" />
                  <div className="screenshot-hover-hint">
                    <Maximize2 size={13} />
                    <span>คลิกเพื่อขยายภาพ</span>
                  </div>
                </div>
                <div className="screenshot-caption">
                  ภาพที่ 2b: หน้าต่างบันทึกมิเตอร์ (1) เลือกหมายเลขห้อง (2) กรอกเลขมิเตอร์น้ำและไฟฟ้า (3) บันทึกและออกบิล
                </div>
              </div>

              <div className="manual-steps-list">
                <div className="manual-step-item">
                  <span className="step-num">1</span>
                  <div>
                    <strong>เข้าสู่เมนู "จัดการใบแจ้งหนี้" (Billing)</strong>
                    <div style={{ color: "#475569", marginTop: "0.15rem" }}>
                      คลิกเมนูด้านซ้ายเพื่อดูรายการบิลทั้งหมด สามารถกรองดูเฉพาะบิลค้างชำระ รอตรวจ หรือชำระแล้วได้
                    </div>
                  </div>
                </div>
                <div className="manual-step-item">
                  <span className="step-num">2</span>
                  <div>
                    <strong>คลิกปุ่ม "ออกบิลใหม่ / บันทึกมิเตอร์"</strong>
                    <div style={{ color: "#475569", marginTop: "0.15rem" }}>
                      ระบบจะเปิดหน้าต่างบันทึกมิเตอร์ เลือกห้องพักที่ต้องการ และตรวจสอบเลขมิเตอร์ครั้งก่อนที่ระบบดึงมาให้อัตโนมัติ
                    </div>
                  </div>
                </div>
                <div className="manual-step-item">
                  <span className="step-num">3</span>
                  <div>
                    <strong>กรอกเลขมิเตอร์ปัจจุบัน</strong>
                    <div style={{ color: "#475569", marginTop: "0.15rem" }}>
                      กรอกเลขมิเตอร์น้ำประปา (อัตรา 18 บาท/ยูนิต) และไฟฟ้า (อัตรา 8 บาท/ยูนิต) ระบบจะคำนวณผลต่างยูนิตและยอดรวมทันที
                    </div>
                  </div>
                </div>
                <div className="manual-step-item">
                  <span className="step-num">4</span>
                  <div>
                    <strong>กดปุ่ม "บันทึกและออกบิล"</strong>
                    <div style={{ color: "#475569", marginTop: "0.15rem" }}>
                      ระบบจะสร้างใบแจ้งหนี้พร้อมรหัส QR PromptPay และส่งแจ้งเตือนเข้าหน้าผู้เช่าของห้องนั้นทันที
                    </div>
                  </div>
                </div>
              </div>

              <div className="callout-danger">
                <div className="callout-danger-header">
                  <AlertTriangle size={16} />
                  <span>ข้อควรระวังสำคัญ: ตรวจสอบเลขมิเตอร์ก่อนกดยืนยัน</span>
                </div>
                <div className="callout-danger-text">
                  ก่อนกดยืนยันออกบิล ต้องตรวจสอบให้แน่ใจว่าเลขมิเตอร์ปัจจุบันมีค่ามากกว่าเลขมิเตอร์ครั้งก่อนเสมอ
                  หากใส่เลขผิดจนออกบิลแล้ว ต้องประสานงานผู้ดูแลระบบเพื่อทำการยกเลิกบิลใบเดิมก่อนออกใบใหม่
                </div>
              </div>
            </section>

            {/* CHAPTER 3: PAYMENTS & SLIP VERIFICATION */}
            <section id="ch3" className="chapter-box">
              <div className="chapter-header">
                <span className="chapter-badge">บทที่ 3</span>
                <h2 className="chapter-title">การตรวจสอบสลิปและอนุมัติการชำระเงิน (Payments & Slip Verification)</h2>
                <p className="chapter-subtitle">
                  ขั้นตอนการตรวจสอบหลักฐานการโอนเงิน เทียบยอดและเวลาโอนกับสเตตเมนต์ธนาคาร และการออกใบเสร็จ
                </p>
              </div>

              <div className="screenshot-container">
                <div
                  className="screenshot-frame"
                  onClick={() =>
                    setLightboxImg({
                      src: "/manual/images/staff/03a_payments_list.png",
                      caption: "รายการตรวจสอบการชำระเงิน",
                    })
                  }
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/manual/images/staff/03a_payments_list.png" alt="รายการตรวจสอบการชำระเงิน" />
                  <div className="screenshot-hover-hint">
                    <Maximize2 size={13} />
                    <span>คลิกเพื่อขยายภาพ</span>
                  </div>
                </div>
                <div className="screenshot-caption">
                  ภาพที่ 3a: รายการชำระเงิน (1) แท็บสถานะรอตรวจ (2) ปุ่มตรวจสลิป (3) ปุ่มดูสลิปภาพขยาย
                </div>
              </div>

              <div className="screenshot-container">
                <div
                  className="screenshot-frame"
                  onClick={() =>
                    setLightboxImg({
                      src: "/manual/images/staff/03b_slip_inspection_modal.png",
                      caption: "หน้าต่างตรวจสอบสลิปและอนุมัติยอด",
                    })
                  }
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/manual/images/staff/03b_slip_inspection_modal.png" alt="หน้าต่างตรวจสอบสลิป" />
                  <div className="screenshot-hover-hint">
                    <Maximize2 size={13} />
                    <span>คลิกเพื่อขยายภาพ</span>
                  </div>
                </div>
                <div className="screenshot-caption">
                  ภาพที่ 3b: หน้าต่างตรวจสอบสลิป (1) ภาพสลิปจริง (2) ข้อมูลบิลและยอดเงิน (3) ปุ่มอนุมัติหรือปฏิเสธ
                </div>
              </div>

              <div className="manual-steps-list">
                <div className="manual-step-item">
                  <span className="step-num">1</span>
                  <div>
                    <strong>เข้าสู่เมนู "การชำระเงิน" (Payments)</strong>
                    <div style={{ color: "#475569", marginTop: "0.15rem" }}>
                      เลือกแท็บ "รอตรวจสอบ" เพื่อดูรายการสลิปที่ผู้เช่าส่งเข้ามาใหม่
                    </div>
                  </div>
                </div>
                <div className="manual-step-item">
                  <span className="step-num">2</span>
                  <div>
                    <strong>คลิกปุ่ม "ตรวจสลิป" เพื่อเปิดหน้าต่างตรวจสอบ</strong>
                    <div style={{ color: "#475569", marginTop: "0.15rem" }}>
                      ตรวจสอบรายละเอียด 4 จุด: (ก) ยอดเงินโอนตรงกับยอดบิล (ข) บัญชีผู้รับเงินเป็นของหอพัก (ค) วันที่และเวลาโอนตรงกับสเตตเมนต์ธนาคาร (ง) รหัสอ้างอิงธุรกรรมไม่ซ้ำกับสลิปอื่น
                    </div>
                  </div>
                </div>
                <div className="manual-step-item">
                  <span className="step-num">3</span>
                  <div>
                    <strong>คลิกปุ่ม "อนุมัติการชำระเงิน" หรือ "ปฏิเสธสลิป"</strong>
                    <div style={{ color: "#475569", marginTop: "0.15rem" }}>
                      เมื่ออนุมัติ ระบบจะเปลี่ยนสถานะบิลเป็น "ชำระแล้ว" พร้อมออกเลขที่ใบเสร็จรับเงินให้ผู้เช่าทันที
                      หากปฏิเสธ ให้ระบุเหตุผล เช่น "ยอดเงินไม่ครบ" หรือ "สลิปซ้ำ" เพื่อแจ้งเตือนให้ผู้เช่าทราบ
                    </div>
                  </div>
                </div>
              </div>

              <div className="callout-danger">
                <div className="callout-danger-header">
                  <AlertTriangle size={16} />
                  <span>ข้อควรระวัง: ป้องกันการใช้สลิปปลอมหรือสลิปซ้ำ</span>
                </div>
                <div className="callout-danger-text">
                  ห้ามอนุมัติการชำระเงินโดยดูเพียงรูปภาพสลิปเพียงอย่างเดียวเด็ดขาด!
                  เจ้าหน้าที่ต้องเปิดแอพพลิเคชันธนาคารของหอพักหรือระบบแจ้งเตือน SMS เพื่อยืนยันว่ามียอดเงินเข้าบัญชีจริงตามวันเวลาที่ระบุในสลิป
                </div>
              </div>
            </section>

            {/* CHAPTER 4: ROOMS MANAGEMENT */}
            <section id="ch4" className="chapter-box">
              <div className="chapter-header">
                <span className="chapter-badge">บทที่ 4</span>
                <h2 className="chapter-title">การจัดการผังห้องพักและเปลี่ยนสถานะ (Rooms Management)</h2>
                <p className="chapter-subtitle">
                  การตรวจสอบผังห้องพักแยกตามชั้น การเปลี่ยนสถานะห้องพัก และการเตรียมความพร้อมสำหรับผู้เช่าใหม่
                </p>
              </div>

              <div className="screenshot-container">
                <div
                  className="screenshot-frame"
                  onClick={() =>
                    setLightboxImg({
                      src: "/manual/images/staff/04_rooms_management.png",
                      caption: "ผังห้องพักประจำอาคารและการจัดการสถานะ",
                    })
                  }
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/manual/images/staff/04_rooms_management.png" alt="ผังห้องพักประจำอาคาร" />
                  <div className="screenshot-hover-hint">
                    <Maximize2 size={13} />
                    <span>คลิกเพื่อขยายภาพ</span>
                  </div>
                </div>
                <div className="screenshot-caption">
                  ภาพที่ 4: ผังห้องพัก (1) สถิติภาพรวมว่าง/ไม่ว่าง (2) การ์ดห้องพักพร้อมป้ายสถานะ (3) ปุ่มปรับสถานะห้อง
                </div>
              </div>

              <div className="manual-steps-list">
                <div className="manual-step-item">
                  <span className="step-num">1</span>
                  <div>
                    <strong>เข้าสู่เมนู "ผังห้องพัก" (Rooms)</strong>
                    <div style={{ color: "#475569", marginTop: "0.15rem" }}>
                      ระบบจะแสดงการ์ดห้องพักทั้งหมดแยกตามชั้น พร้อมสีบอกสถานะอย่างชัดเจน
                    </div>
                  </div>
                </div>
                <div className="manual-step-item">
                  <span className="step-num">2</span>
                  <div>
                    <strong>ความหมายของสถานะห้องพักทั้ง 3 แบบ</strong>
                    <div style={{ color: "#475569", marginTop: "0.15rem" }}>
                      • <strong>มีผู้เช่า (Occupied):</strong> การ์ดสีน้ำเงิน/เขียว มีผู้พักอาศัยอยู่และมีสัญญาเช่าที่ยังมีผล
                      <br />• <strong>ห้องว่าง (Vacant):</strong> การ์ดสีเขียวมิ้นต์ ห้องสะอาดพร้อมเปิดทำสัญญาให้ผู้เช่าใหม่
                      <br />• <strong>ปรับปรุง (Maintenance):</strong> การ์ดสีส้ม ห้องอยู่ระหว่างทำความสะอาดหรือซ่อมแซม ห้ามเปิดเช่า
                    </div>
                  </div>
                </div>
                <div className="manual-step-item">
                  <span className="step-num">3</span>
                  <div>
                    <strong>การปรับเปลี่ยนสถานะห้องพัก</strong>
                    <div style={{ color: "#475569", marginTop: "0.15rem" }}>
                      คลิกที่ปุ่มตัวเลือกบนการ์ดห้องพักเพื่อสลับสถานะ เช่น เมื่อช่างซ่อมห้องเสร็จ ให้เปลี่ยนจาก "ปรับปรุง" เป็น "ห้องว่าง" เพื่อให้ฝ่ายขายเปิดรับลูกค้าใหม่ได้
                    </div>
                  </div>
                </div>
              </div>

              <div className="callout-tip">
                <div className="callout-tip-header">
                  <Info size={16} />
                  <span>คำแนะนำ: การตรวจรับห้องก่อนเปิดเป็นสถานะว่าง</span>
                </div>
                <div className="callout-tip-text">
                  เมื่อผู้เช่าเก่าย้ายออก ให้ปรับห้องเป็นสถานะ "ปรับปรุง" ทันที จากนั้นแม่บ้านและช่างจะเข้าทำความสะอาดและตรวจเช็คอุปกรณ์ 10 รายการ
                  เมื่อตรวจรับเรียบร้อยแล้ว จึงกดเปลี่ยนเป็น "ห้องว่าง" เพื่อความพร้อม 100%
                </div>
              </div>
            </section>

            {/* CHAPTER 5: REPAIRS WORKFLOW */}
            <section id="ch5" className="chapter-box">
              <div className="chapter-header">
                <span className="chapter-badge">บทที่ 5</span>
                <h2 className="chapter-title">การจัดการงานแจ้งซ่อมบำรุง (Repairs & Maintenance Workflow)</h2>
                <p className="chapter-subtitle">
                  ขั้นตอนการรับเรื่องแจ้งซ่อมจากผู้เช่า การประเมินความเร่งด่วน การจ่ายงานช่าง และการบันทึกผลการซ่อม
                </p>
              </div>

              <div className="screenshot-container">
                <div
                  className="screenshot-frame"
                  onClick={() =>
                    setLightboxImg({
                      src: "/manual/images/staff/05_repairs_management.png",
                      caption: "คิวงานแจ้งซ่อมบำรุงประจำอาคาร",
                    })
                  }
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/manual/images/staff/05_repairs_management.png" alt="คิวงานแจ้งซ่อมบำรุง" />
                  <div className="screenshot-hover-hint">
                    <Maximize2 size={13} />
                    <span>คลิกเพื่อขยายภาพ</span>
                  </div>
                </div>
                <div className="screenshot-caption">
                  ภาพที่ 5: คิวงานแจ้งซ่อม (1) แท็บรอดำเนินการ/กำลังซ่อม/เสร็จสิ้น (2) รายละเอียดและรูปภาพปัญหา (3) ปุ่มจ่ายงานช่าง
                </div>
              </div>

              <div className="manual-steps-list">
                <div className="manual-step-item">
                  <span className="step-num">1</span>
                  <div>
                    <strong>รับเรื่องแจ้งซ่อมใหม่จากผู้เช่า</strong>
                    <div style={{ color: "#475569", marginTop: "0.15rem" }}>
                      ตรวจสอบรายการแจ้งซ่อมในแท็บ "รอดำเนินการ" อ่านรายละเอียดปัญหา ดูภาพถ่ายความเสียหายที่ผู้เช่าแนบมา และหมายเลขห้องพัก
                    </div>
                  </div>
                </div>
                <div className="manual-step-item">
                  <span className="step-num">2</span>
                  <div>
                    <strong>ประเมินความเร่งด่วนและจ่ายงานช่าง (Assign Technician)</strong>
                    <div style={{ color: "#475569", marginTop: "0.15rem" }}>
                      เลือกช่างเทคนิคผู้รับผิดชอบงาน (ช่างไฟ, ช่างประปา, หรือช่างแอร์) พร้อมระบุกำหนดเวลาเข้าดำเนินการ
                    </div>
                  </div>
                </div>
                <div className="manual-step-item">
                  <span className="step-num">3</span>
                  <div>
                    <strong>อัปเดตสถานะเป็น "กำลังดำเนินการ" (In Progress)</strong>
                    <div style={{ color: "#475569", marginTop: "0.15rem" }}>
                      เมื่อช่างเริ่มเข้าตรวจสอบห้องพัก ให้ปรับสถานะเพื่อให้ผู้เช่าเห็นความคืบหน้าแบบเรียลไทม์ในหน้าแอพ
                    </div>
                  </div>
                </div>
                <div className="manual-step-item">
                  <span className="step-num">4</span>
                  <div>
                    <strong>ปิดงานซ่อมบำรุงเป็น "เสร็จสิ้น" (Completed)</strong>
                    <div style={{ color: "#475569", marginTop: "0.15rem" }}>
                      เมื่อช่างแก้ไขเรียบร้อย ให้บันทึกรายละเอียดการซ่อม (เช่น เปลี่ยนก๊อกน้ำใหม่) และกดยืนยันปิดงาน
                    </div>
                  </div>
                </div>
              </div>

              <div className="callout-danger">
                <div className="callout-danger-header">
                  <AlertTriangle size={16} />
                  <span>เกณฑ์ SLA สำหรับงานซ่อมฉุกเฉิน (Emergency Repairs)</span>
                </div>
                <div className="callout-danger-text">
                  หากเป็นกรณีฉุกเฉิน เช่น ไฟฟ้าลัดวงจร ท่อน้ำแตกน้ำท่วมห้อง หรือแอร์น้ำรั่วอย่างหนัก เจ้าหน้าที่ต้องโทรประสานช่างเทคนิคเข้าหน้างานภายใน 30 นาที และดำเนินการแก้ไขให้แล้วเสร็จภายใน 2 ชั่วโมง
                </div>
              </div>
            </section>

            {/* CHAPTER 6: TENANTS & CONTRACTS */}
            <section id="ch6" className="chapter-box">
              <div className="chapter-header">
                <span className="chapter-badge">บทที่ 6</span>
                <h2 className="chapter-title">ข้อมูลผู้เช่าและสัญญาเช่า (Tenants & Contracts)</h2>
                <p className="chapter-subtitle">
                  การจัดเก็บข้อมูลผู้พักอาศัย การตรวจสอบระยะเวลาสัญญาเช่า และการจัดการเงินประกันความเสียหาย
                </p>
              </div>

              <div className="screenshot-container">
                <div
                  className="screenshot-frame"
                  onClick={() =>
                    setLightboxImg({
                      src: "/manual/images/staff/06_tenants_contracts.png",
                      caption: "รายชื่อผู้เช่าและรายละเอียดสัญญาเช่า",
                    })
                  }
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/manual/images/staff/06_tenants_contracts.png" alt="รายชื่อผู้เช่าและสัญญาเช่า" />
                  <div className="screenshot-hover-hint">
                    <Maximize2 size={13} />
                    <span>คลิกเพื่อขยายภาพ</span>
                  </div>
                </div>
                <div className="screenshot-caption">
                  ภาพที่ 6: ทะเบียนผู้เช่า (1) ค้นหาชื่อ/ห้อง (2) ข้อมูลระยะเวลาสัญญา (3) ข้อมูลเงินประกันห้องพัก
                </div>
              </div>

              <div className="manual-steps-list">
                <div className="manual-step-item">
                  <span className="step-num">1</span>
                  <div>
                    <strong>ค้นหาข้อมูลผู้เช่ารายห้อง</strong>
                    <div style={{ color: "#475569", marginTop: "0.15rem" }}>
                      ใช้ช่องค้นหาพิมพ์หมายเลขห้อง ชื่อผู้เช่า หรือเบอร์โทรศัพท์ เพื่อเรียกดูประวัติการเช่าได้ทันที
                    </div>
                  </div>
                </div>
                <div className="manual-step-item">
                  <span className="step-num">2</span>
                  <div>
                    <strong>ตรวจสอบวันเริ่มและสิ้นสุดสัญญาเช่า</strong>
                    <div style={{ color: "#475569", marginTop: "0.15rem" }}>
                      ระบบจะแสดงสถานะสัญญาว่าปกติ ใกล้หมดอายุ (น้อยกว่า 30 วัน) หรือหมดอายุแล้ว เพื่อให้นิติดำเนินการต่อสัญญาได้ทันท่วงที
                    </div>
                  </div>
                </div>
                <div className="manual-step-item">
                  <span className="step-num">3</span>
                  <div>
                    <strong>บันทึกยอดเงินประกันห้องพัก (Deposit)</strong>
                    <div style={{ color: "#475569", marginTop: "0.15rem" }}>
                      แสดงยอดเงินประกันความเสียหายที่ผู้เช่าเคยวางไว้ สำหรับใช้คำนวณหักลบกลบหนี้เมื่อแจ้งย้ายออก
                    </div>
                  </div>
                </div>
              </div>

              <div className="callout-tip">
                <div className="callout-tip-header">
                  <Info size={16} />
                  <span>คำแนะนำ: การแจ้งเตือนต่อสัญญาล่วงหน้า 30 วัน</span>
                </div>
                <div className="callout-tip-text">
                  เจ้าหน้าที่ควรตรวจสอบรายการสัญญาเช่าในสัปดาห์แรกของทุกเดือน หากพบห้องที่สัญญาจะหมดอายุในอีก 30-45 วัน ให้โทรสอบถามความจำนงในการต่อสัญญาเช่าล่วงหน้า เพื่อเตรียมจัดทำสัญญาฉบับใหม่
                </div>
              </div>
            </section>

            {/* CHAPTER 7: ANNOUNCEMENTS & LINE */}
            <section id="ch7" className="chapter-box">
              <div className="chapter-header">
                <span className="chapter-badge">บทที่ 7</span>
                <h2 className="chapter-title">การส่งประกาศและแจ้งเตือนผ่าน LINE (Announcements & LINE Broadcast)</h2>
                <p className="chapter-subtitle">
                  ขั้นตอนการเผยแพร่ข่าวสารของอาคาร การแจ้งปิดปรับปรุงระบบสาธารณูปโภค และการบรอดแคสต์เข้า LINE OA
                </p>
              </div>

              <div className="screenshot-container">
                <div
                  className="screenshot-frame"
                  onClick={() =>
                    setLightboxImg({
                      src: "/manual/images/staff/07_announcements_broadcast.png",
                      caption: "ระบบส่งประกาศและบรอดแคสต์แจ้งเตือน",
                    })
                  }
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/manual/images/staff/07_announcements_broadcast.png" alt="ระบบส่งประกาศและบรอดแคสต์" />
                  <div className="screenshot-hover-hint">
                    <Maximize2 size={13} />
                    <span>คลิกเพื่อขยายภาพ</span>
                  </div>
                </div>
                <div className="screenshot-caption">
                  ภาพที่ 7: ระบบประกาศ (1) ฟอร์มสร้างประกาศใหม่ (2) ตัวเลือกส่ง LINE Broadcast (3) ประวัติประกาศที่ส่งแล้ว
                </div>
              </div>

              <div className="manual-steps-list">
                <div className="manual-step-item">
                  <span className="step-num">1</span>
                  <div>
                    <strong>คลิกปุ่ม "สร้างประกาศใหม่" (Create Announcement)</strong>
                    <div style={{ color: "#475569", marginTop: "0.15rem" }}>
                      เลือกหมวดหมู่ประกาศ เช่น ประกาศด่วน ปิดปรับปรุงน้ำ-ไฟ กิจกรรมหอพัก หรือระเบียบการอยู่อาศัย
                    </div>
                  </div>
                </div>
                <div className="manual-step-item">
                  <span className="step-num">2</span>
                  <div>
                    <strong>กรอกหัวข้อและเนื้อหาประกาศ</strong>
                    <div style={{ color: "#475569", marginTop: "0.15rem" }}>
                      ระบุวันและเวลาที่มีผลบังคับใช้ให้ชัดเจน เช่น "แจ้งปิดน้ำประปาเพื่อล้างถังพักน้ำ วันที่ 15 ก.ย. เวลา 10:00 - 14:00 น."
                    </div>
                  </div>
                </div>
                <div className="manual-step-item">
                  <span className="step-num">3</span>
                  <div>
                    <strong>เลือกส่งแจ้งเตือนผ่าน LINE Broadcast</strong>
                    <div style={{ color: "#475569", marginTop: "0.15rem" }}>
                      ทำเครื่องหมายถูกที่ช่อง "ส่งเข้า LINE Official Account" เพื่อให้ข้อความเด้งเตือนในมือถือของผู้เช่าทุกคนทันที
                    </div>
                  </div>
                </div>
              </div>

              <div className="callout-danger">
                <div className="callout-danger-header">
                  <AlertTriangle size={16} />
                  <span>ข้อควรระวัง: การส่ง LINE Broadcast แจ้งเตือนทั้งอาคาร</span>
                </div>
                <div className="callout-danger-text">
                  ข้อความที่ส่งผ่าน LINE Broadcast จะถูกส่งตรงถึงผู้เช่าทุกคนที่เชื่อมต่อบัญชีไว้ทันทีและไม่สามารถยกเลิกข้อความได้
                  ดังนั้น เจ้าหน้าที่ต้องตรวจสอบตัวสะกด วันที่ และเวลาให้ถูกต้องถี่ถ้วนก่อนกดยืนยันส่งทุกครั้ง
                </div>
              </div>
            </section>

            {/* CHAPTER 8: CMS */}
            <section id="ch8" className="chapter-box">
              <div className="chapter-header">
                <span className="chapter-badge">บทที่ 8</span>
                <h2 className="chapter-title">การจัดการเนื้อหาหน้าเว็บไซต์หลัก (Landing Page Content CMS)</h2>
                <p className="chapter-subtitle">
                  การแก้ไขราคาค่าเช่า ข้อมูลสิ่งอำนวยความสะดวก และรูปภาพส่วนกลางที่แสดงบนหน้าแรกของเว็บไซต์
                </p>
              </div>

              <div className="screenshot-container">
                <div
                  className="screenshot-frame"
                  onClick={() =>
                    setLightboxImg({
                      src: "/manual/images/staff/08_site_content.png",
                      caption: "แผงควบคุมเนื้อหาหน้าเว็บไซต์หลัก CMS",
                    })
                  }
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/manual/images/staff/08_site_content.png" alt="แผงควบคุมเนื้อหาเว็บไซต์" />
                  <div className="screenshot-hover-hint">
                    <Maximize2 size={13} />
                    <span>คลิกเพื่อขยายภาพ</span>
                  </div>
                </div>
                <div className="screenshot-caption">
                  ภาพที่ 8: แผงควบคุมเนื้อหาเว็บ (1) แก้ไขข้อความต้อนรับ (2) ข้อมูลประเภทห้องและราคา (3) ปุ่มบันทึกการเปลี่ยนแปลง
                </div>
              </div>

              <div className="manual-steps-list">
                <div className="manual-step-item">
                  <span className="step-num">1</span>
                  <div>
                    <strong>เข้าสู่เมนู "เนื้อหาหน้าแรก" (Site Content)</strong>
                    <div style={{ color: "#475569", marginTop: "0.15rem" }}>
                      ระบบจะแสดงส่วนต่างๆ ของหน้าเว็บที่อนุญาตให้นิติบุคคลปรับแต่งได้
                    </div>
                  </div>
                </div>
                <div className="manual-step-item">
                  <span className="step-num">2</span>
                  <div>
                    <strong>อัปเดตราคาห้องพักและโปรโมชั่น</strong>
                    <div style={{ color: "#475569", marginTop: "0.15rem" }}>
                      แก้ไขราคาเริ่มต้นของห้องพักแต่ละประเภท (เช่น ห้องสตูดิโอ 4,500 บาท/เดือน) และข้อความโปรโมชั่นพิเศษ
                    </div>
                  </div>
                </div>
                <div className="manual-step-item">
                  <span className="step-num">3</span>
                  <div>
                    <strong>กดปุ่ม "บันทึกการเปลี่ยนแปลง" (Save Changes)</strong>
                    <div style={{ color: "#475569", marginTop: "0.15rem" }}>
                      ข้อมูลที่อัปเดตจะแสดงผลบนหน้าเว็บไซต์หลักสาธารณะทันทีโดยไม่ต้องเริ่มต้นระบบใหม่
                    </div>
                  </div>
                </div>
              </div>

              <div className="callout-tip">
                <div className="callout-tip-header">
                  <Info size={16} />
                  <span>คำแนะนำ: อัปเดตข้อมูลราคาและรูปภาพส่วนกลางสม่ำเสมอ</span>
                </div>
                <div className="callout-tip-text">
                  การอัปเดตรูปถ่ายพื้นที่ส่วนกลาง (เช่น ฟิตเนส ที่จอดรถ ระบบคีย์การ์ด) และราคาห้องพักให้เป็นปัจจุบันอยู่เสมอ
                  จะช่วยเพิ่มความน่าเชื่อถือและดึงดูดผู้สนใจเช่ารายใหม่เข้ามาติดต่อสอบถามมากยิ่งขึ้น
                </div>
              </div>
            </section>

            {/* CHAPTER 9: FAQ */}
            <section id="ch9" className="chapter-box">
              <div className="chapter-header">
                <span className="chapter-badge">บทที่ 9</span>
                <h2 className="chapter-title">คำถามที่พบบ่อยสำหรับนิติบุคคล (Staff Operations FAQ)</h2>
                <p className="chapter-subtitle">
                  รวมคำถามและแนวทางแก้ไขปัญหาที่พบบ่อยในการปฏิบัติงานประจำวันของเจ้าหน้าที่นิติบุคคล
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
                    <HelpCircle size={17} style={{ color: "#065f46" }} />
                    <span>คำถามที่ 1: หากกรอกเลขมิเตอร์น้ำหรือไฟฟ้าผิด และกดยืนยันออกบิลไปแล้ว ต้องแก้ไขอย่างไร?</span>
                  </div>
                  <div style={{ color: "#475569", fontSize: "0.88rem", lineHeight: 1.6, paddingLeft: "1.6rem" }}>
                    <strong>คำตอบ:</strong> หากบิลดังกล่าวยังอยู่ในสถานะ "รอชำระ" เจ้าหน้าที่สามารถกดเข้าไปที่รายละเอียดบิลใบนั้น แล้วคลิก "แก้ไขมิเตอร์" เพื่อกรอกเลขที่ถูกต้องใหม่ได้ แต่หากผู้เช่าได้ทำการโอนเงินเข้ามาแล้ว ให้ติดต่อผู้ดูแลระบบ (Owner) เพื่อปรับยอดส่วนต่างในบิลรอบถัดไป
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
                    <HelpCircle size={17} style={{ color: "#065f46" }} />
                    <span>คำถามที่ 2: เมื่อผู้เช่าอัปโหลดสลิปที่ยอดเงินไม่ถูกต้อง หรือสลิปไม่ชัดเจน ต้องดำเนินการอย่างไร?</span>
                  </div>
                  <div style={{ color: "#475569", fontSize: "0.88rem", lineHeight: 1.6, paddingLeft: "1.6rem" }}>
                    <strong>คำตอบ:</strong> ให้กดปุ่ม "ปฏิเสธสลิป" พร้อมพิมพ์ระบุเหตุผล เช่น "ยอดเงินขาดไป 200 บาท กรุณาโอนเพิ่มพร้อมแนบสลิปใหม่" หรือ "ภาพสลิปไม่ชัดเจน ไม่เห็นรหัสอ้างอิง" ระบบจะส่งแจ้งเตือนให้ผู้เช่าทราบและเปิดให้อัปโหลดสลิปใหม่อีกครั้ง
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
                    <HelpCircle size={17} style={{ color: "#065f46" }} />
                    <span>คำถามที่ 3: ห้องพักที่ซ่อมแซมและทำความสะอาดเสร็จเรียบร้อย จะเปิดให้เช่าได้อย่างไร?</span>
                  </div>
                  <div style={{ color: "#475569", fontSize: "0.88rem", lineHeight: 1.6, paddingLeft: "1.6rem" }}>
                    <strong>คำตอบ:</strong> ให้ไปที่เมนู "ผังห้องพัก" (Rooms) ค้นหาหมายเลขห้องที่ต้องการ แล้วคลิกเปลี่ยนสถานะจากการ์ดห้องพักจาก "ปรับปรุง" (Maintenance) เป็น "ห้องว่าง" (Vacant) เมื่อเปลี่ยนสถานะแล้ว ห้องนั้นจะพร้อมทำสัญญาเช่าใหม่ได้ทันที
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
                    <HelpCircle size={17} style={{ color: "#065f46" }} />
                    <span>คำถามที่ 4: การมอบหมายช่างเทคนิคในใบแจ้งซ่อม มีผลแจ้งเตือนช่างอย่างไร?</span>
                  </div>
                  <div style={{ color: "#475569", fontSize: "0.88rem", lineHeight: 1.6, paddingLeft: "1.6rem" }}>
                    <strong>คำตอบ:</strong> เมื่อเจ้าหน้าที่เลือกมอบหมายช่างในระบบ ระบบจะส่งการแจ้งเตือนไปยังบัญชีของช่างคนนั้น และส่งข้อความเตือนเข้ากลุ่ม LINE งานช่างประจำอาคาร เพื่อให้ช่างทราบหมายเลขห้องและปัญหาความขัดข้องได้ในทันที
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
                    <HelpCircle size={17} style={{ color: "#065f46" }} />
                    <span>คำถามที่ 5: ประกาศสำคัญที่ส่งผ่านระบบ จะแจ้งเตือนถึงผู้เช่าทางช่องทางใดบ้าง?</span>
                  </div>
                  <div style={{ color: "#475569", fontSize: "0.88rem", lineHeight: 1.6, paddingLeft: "1.6rem" }}>
                    <strong>คำตอบ:</strong> ประกาศจะแสดงผลที่แถบด้านบนของหน้าแดชบอร์ดผู้เช่า และหากติ๊กเลือก "ส่งเข้า LINE Official Account" ระบบจะทำการบรอดแคสต์ข้อความแจ้งเตือนตรงไปยัง LINE ของผู้เช่าทุกคนพร้อมกันทันที
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
                    <HelpCircle size={17} style={{ color: "#065f46" }} />
                    <span>คำถามที่ 6: สัญญาเช่าที่ใกล้หมดอายุ ระบบมีการเตือนล่วงหน้าอย่างไร?</span>
                  </div>
                  <div style={{ color: "#475569", fontSize: "0.88rem", lineHeight: 1.6, paddingLeft: "1.6rem" }}>
                    <strong>คำตอบ:</strong> ระบบจะแสดงป้ายเตือนสีส้ม "ใกล้หมดสัญญา" ในหน้ารายชื่อผู้เช่าเมื่อสัญญาเหลือเวลาน้อยกว่า 30 วัน พร้อมมีตัวกรองให้เจ้าหน้าที่สามารถกดดูรายชื่อห้องที่ต้องต่อสัญญาได้ในคลิกเดียว
                  </div>
                </div>
              </div>

              <div className="callout-tip" style={{ marginTop: "1.5rem" }}>
                <div className="callout-tip-header">
                  <ShieldCheck size={16} />
                  <span>การประสานงานความช่วยเหลือระดับสูง (Escalation Support)</span>
                </div>
                <div className="callout-tip-text">
                  หากพบปัญหาทางเทคนิคของระบบฐานข้อมูล หรือกรณีมีข้อพิพาทเรื่องการเงินกับผู้เช่าที่นิติบุคคลไม่สามารถตัดสินใจได้เอง
                  ให้ส่งรายงานสรุปเรื่องเข้าสู่อีเมลผู้บริหารโครงการที่ <strong>owner@saranrom-residence.com</strong> เพื่อให้เจ้าของโครงการพิจารณาอนุมัติเป็นกรณีพิเศษ
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Bottom Contact Card */}
        <div className="manual-contact-card">
          <div className="manual-contact-left">
            <div className="manual-contact-icon">
              <PhoneCall size={22} />
            </div>
            <div>
              <div className="manual-contact-title">สำนักงานนิติบุคคล เดอะ สราญรมย์ เรสซิเดนซ์</div>
              <div className="manual-contact-subtitle">
                บริการงานบริหารอาคาร ดูแลความปลอดภัย จดมิเตอร์ และงานซ่อมบำรุงประจำวัน
              </div>
            </div>
          </div>
          <div className="manual-contact-badge">โทร: 081-999-8888, 02-711-0099 | LINE OA: @thesaranrom</div>
        </div>
      </div>
    </div>
  );
}
