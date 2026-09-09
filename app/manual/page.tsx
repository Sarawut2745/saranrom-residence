"use client";

import React from "react";
import Link from "next/link";
import "./manual.css";
import {
  BookOpen,
  FileText,
  Download,
  ShieldCheck,
  Smartphone,
  CheckCircle2,
  Clock,
  ArrowRight,
  Home,
  Wrench,
  UserCheck,
  PhoneCall,
  ChevronRight,
} from "lucide-react";

interface ManualVolume {
  id: string;
  volumeNumber: number;
  title: string;
  subtitle: string;
  targetRole: string;
  description: string;
  status: "available" | "coming_soon";
  statusText: string;
  readOnlineUrl?: string;
  pdfDownloadUrl?: string;
  pdfSize?: string;
  features: string[];
}

const volumes: ManualVolume[] = [
  {
    id: "rental",
    volumeNumber: 1,
    title: "คู่มือผู้เช่าห้องพัก (Rental Portal)",
    subtitle: "ระบบบริการตนเองสำหรับผู้พักอาศัย เดอะ สราญรมย์ เรสซิเดนซ์",
    targetRole: "ผู้เช่าห้องพักทุกท่าน",
    description:
      "รวบรวมขั้นตอนการใช้งานระบบสำหรับผู้เช่าอย่างละเอียด พร้อมภาพถ่ายหน้าจอจริงทุกขั้นตอน ทั้งการตรวจสอบบิล ชำระผ่าน QR PromptPay แนบสลิป แจ้งซ่อม และตรวจสอบสัญญาเช่า",
    status: "available",
    statusText: "พร้อมใช้งาน",
    readOnlineUrl: "/manual/rental",
    pdfDownloadUrl: "/manual/manual-rental.pdf",
    pdfSize: "3.3 MB",
    features: [
      "การเข้าสู่ระบบด้วยอีเมลและรหัสผ่าน",
      "หน้าหลักแดชบอร์ดและการตรวจสอบสถานะห้องพัก",
      "การชำระเงินผ่าน QR PromptPay และอัปโหลดสลิป",
      "การตรวจสอบสถานะสลิปและการพิมพ์ใบเสร็จรับเงิน",
      "การส่งคำขอแจ้งซ่อมและกล่องข้อควรระวังสำคัญ",
      "คำถามที่พบบ่อย (FAQ) และแนวทางแก้ไขปัญหา",
    ],
  },
  {
    id: "staff",
    volumeNumber: 2,
    title: "คู่มือเจ้าหน้าที่นิติและช่าง (Staff Portal)",
    subtitle: "ระบบปฏิบัติการสำหรับเจ้าหน้าที่ธุรการและช่างประจำอาคาร",
    targetRole: "เจ้าหน้าที่นิติบุคคล, ช่างเทคนิค",
    description:
      "คู่มือการปฏิบัติงานประจำวัน การบันทึกเลขมิเตอร์น้ำ-ไฟ การออกบิลแจ้งหนี้ประจำเดือน การตรวจสอบความถูกต้องของสลิปโอนเงิน การจัดผังห้องพัก และการจัดการสถานะงานซ่อมบำรุง",
    status: "available",
    statusText: "พร้อมใช้งาน",
    readOnlineUrl: "/manual/staff",
    pdfDownloadUrl: "/manual/manual-staff.pdf",
    pdfSize: "3.2 MB",
    features: [
      "ระบบจดมิเตอร์น้ำและไฟฟ้าประจำเดือน",
      "การประมวลผลและออกบิลแจ้งหนี้รายเดือน",
      "การตรวจสอบสลิปการโอนเงินและอนุมัติใบเสร็จ",
      "การบริหารผังห้องพักและเปลี่ยนสถานะห้อง",
      "การจ่ายงานและติดตามสถานะงานแจ้งซ่อม",
      "คำถามที่พบบ่อย (FAQ) สำหรับเจ้าหน้าที่",
    ],
  },
  {
    id: "owner",
    volumeNumber: 3,
    title: "คู่มือผู้บริหารและเจ้าของหอพัก (Owner-Only Portal)",
    subtitle: "ระบบควบคุมเชิงบริหารและการเงินระดับสูง",
    targetRole: "เจ้าของหอพัก, ผู้บริหาร",
    description:
      "คู่มือการใช้งานแดชบอร์ดสรุปผลประกอบการ การตรวจสอบสถิติการเข้าพัก การตั้งค่าประเภทห้องพักและอัตราค่าน้ำ-ค่าไฟมาตรฐาน การจัดการบัญชี Staff และการควบคุมความโปร่งใสด้านการเงิน",
    status: "available",
    statusText: "พร้อมใช้งาน",
    readOnlineUrl: "/manual/owner",
    pdfDownloadUrl: "/manual/manual-owner.pdf",
    pdfSize: "3.1 MB",
    features: [
      "แดชบอร์ดภาพรวมรายรับ-รายจ่ายและอัตราการเช่า",
      "การกำหนดราคาห้องพักและอัตราค่าน้ำ-ค่าไฟมาตรฐาน",
      "การสร้างและบริหารจัดการบัญชีพนักงานนิติบุคคล",
      "การกำกับดูแลการเงินและการตรวจสอบสลิปย้อนหลัง",
      "แนวปฏิบัติและกฎเหล็กสำหรับผู้บริหาร (Golden Rules)",
      "คำถามที่พบบ่อย (FAQ) สำหรับเจ้าของหอพัก",
    ],
  },
];

export default function ManualHubPage() {
  return (
    <div className="manual-wrapper">
      <div className="manual-container">
        {/* Breadcrumb */}
        <div className="manual-breadcrumb">
          <Link href="/">หน้าหลัก</Link>
          <ChevronRight size={14} />
          <span className="manual-breadcrumb-current">ศูนย์คู่มือการใช้งาน</span>
        </div>

        {/* Hero Header */}
        <div className="manual-hero-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1.5rem" }}>
            <div>
              <div className="manual-tag manual-tag-emerald">
                <BookOpen size={14} />
                <span>OFFICIAL SYSTEM DOCUMENTATION</span>
              </div>
              <h1 className="manual-hero-title">ศูนย์รวมคู่มือการใช้งานระบบ</h1>
              <p className="manual-hero-desc">
                เดอะ สราญรมย์ เรสซิเดนซ์ (The Saranrom Residence & Apartment)
                จัดทำคู่มือการใช้งานระบบ 3 เล่มตามบทบาทผู้ใช้งาน พร้อมภาพหน้าจอจริงและคำแนะนำอย่างเป็นขั้นตอน
              </p>
            </div>

            <div className="manual-actions-row">
              <Link href="/manual/rental" className="manual-btn-primary">
                <BookOpen size={16} />
                <span>เปิดอ่านคู่มือผู้เช่า</span>
              </Link>
              <a href="/manual/manual-rental.pdf" download className="manual-btn-secondary">
                <Download size={16} />
                <span>ดาวน์โหลด PDF</span>
              </a>
            </div>
          </div>

          {/* Quick highlight bar */}
          <div className="manual-highlights-grid">
            <div className="manual-highlight-item">
              <div className="manual-highlight-icon" style={{ background: "#f1f5f9", color: "#334155" }}>
                <Smartphone size={18} />
              </div>
              <div>
                <h4 className="manual-highlight-title">รองรับทุกอุปกรณ์</h4>
                <p className="manual-highlight-desc">
                  เปิดอ่านได้สะดวกทั้งคอมพิวเตอร์ แท็บเล็ต และสมาร์ตโฟน
                </p>
              </div>
            </div>

            <div className="manual-highlight-item">
              <div className="manual-highlight-icon" style={{ background: "rgba(5, 150, 105, 0.08)", color: "#065f46" }}>
                <CheckCircle2 size={18} />
              </div>
              <div>
                <h4 className="manual-highlight-title">ภาพประกอบจริงทุกขั้นตอน</h4>
                <p className="manual-highlight-desc">
                  มีไฮไลต์กรอบแดงและตัวเลขกำกับปุ่มที่ต้องกดชัดเจน
                </p>
              </div>
            </div>

            <div className="manual-highlight-item">
              <div className="manual-highlight-icon" style={{ background: "rgba(79, 70, 229, 0.08)", color: "#4f46e5" }}>
                <ShieldCheck size={18} />
              </div>
              <div>
                <h4 className="manual-highlight-title">ข้อควรระวังมาตรฐาน</h4>
                <p className="manual-highlight-desc">
                  ระบุหลักเกณฑ์การตรวจสอบยอดและกฎระเบียบสำคัญอย่างชัดเจน
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Volume Cards List */}
        <div style={{ marginBottom: "2rem" }}>
          <div className="volumes-section-title">
            <div className="volumes-title-text">
              <FileText size={20} style={{ color: "#065f46" }} />
              <span>รายการเล่มคู่มือการใช้งาน (3 Volumes)</span>
            </div>
            <span style={{ fontSize: "0.8rem", color: "#64748b" }}>อ้างอิงข้อกำหนด AGENT_SPEC</span>
          </div>

          <div className="volumes-list">
            {volumes.map((vol) => (
              <div
                key={vol.id}
                className={`volume-card ${vol.status === "available" ? "volume-card-ready" : "volume-card-disabled"}`}
              >
                {/* Left content */}
                <div className="volume-card-left">
                  <div className="volume-meta-row">
                    <span className="volume-badge-number">เล่มที่ {vol.volumeNumber}</span>
                    {vol.status === "available" ? (
                      <span className="volume-badge-status-ready">
                        <span className="status-dot-green"></span>
                        {vol.statusText}
                      </span>
                    ) : (
                      <span className="volume-badge-status-soon">
                        <Clock size={12} />
                        {vol.statusText}
                      </span>
                    )}
                    <span className="volume-target-text">
                      กลุ่มเป้าหมาย: {vol.targetRole}
                    </span>
                  </div>

                  <h3 className="volume-card-title">{vol.title}</h3>
                  <p className="volume-card-subtitle">{vol.subtitle}</p>

                  <p className="volume-card-desc">{vol.description}</p>

                  {/* Features list */}
                  <div>
                    <div className="volume-features-title">
                      หัวข้อสำคัญในคู่มือเล่มนี้:
                    </div>
                    <div className="volume-features-grid">
                      {vol.features.map((feat, idx) => (
                        <div key={idx} className="volume-feature-item">
                          <CheckCircle2
                            size={14}
                            style={{
                              color: vol.status === "available" ? "#065f46" : "#94a3b8",
                              flexShrink: 0,
                            }}
                          />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right actions */}
                <div className="volume-card-actions">
                  {vol.status === "available" ? (
                    <>
                      <Link href={vol.readOnlineUrl || "#"} className="manual-btn-primary">
                        <span>เปิดอ่านแบบเว็บ</span>
                        <ArrowRight size={15} />
                      </Link>
                      {vol.pdfDownloadUrl && (
                        <a href={vol.pdfDownloadUrl} download className="manual-btn-secondary">
                          <Download size={15} />
                          <span>ดาวน์โหลด PDF ({vol.pdfSize})</span>
                        </a>
                      )}
                    </>
                  ) : (
                    <div className="volume-soon-box">
                      รอเริ่มจัดทำหลังตรวจสอบเล่มที่ 2
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Office Contact Info Box */}
        <div className="manual-contact-card">
          <div className="manual-contact-left">
            <div className="manual-contact-icon">
              <PhoneCall size={22} />
            </div>
            <div>
              <h4 className="manual-contact-title">
                มีข้อสงสัยหรือพบปัญหาการใช้งานระบบ?
              </h4>
              <p className="manual-contact-subtitle">
                ติดต่อสำนักงานนิติบุคคล เดอะ สราญรมย์ เรสซิเดนซ์ ชั้น 1 (เวลาทำการ 08:30 - 18:00 น.)
              </p>
            </div>
          </div>
          <div className="manual-contact-badge">
            โทร: 02-999-8888 | LINE OA: @saranrom-residence
          </div>
        </div>
      </div>
    </div>
  );
}
