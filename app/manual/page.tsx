"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  PhoneCall,
  ChevronRight,
} from "lucide-react";
import { useDormitory } from "@/lib/store/dormitory-context";

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
    title: "คู่มือผู้เช่าห้องพัก",
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
      "⭐ ฉบับเข้าใจง่ายที่สุด: จ่ายค่าเช่าและแจ้งซ่อมใน 3 ก้าว",
      "การเข้าสู่ระบบด้วยอีเมลและรหัสผ่าน",
      "หน้าหลักแดชบอร์ดและการตรวจสอบสถานะห้องพัก",
      "การชำระเงินผ่าน QR PromptPay และอัปโหลดสลิป",
      "การตรวจสอบสถานะสลิปและการพิมพ์ใบเสร็จรับเงิน",
      "การส่งคำขอแจ้งซ่อมและกล่องข้อควรระวังสำคัญ",
      "คำถามที่พบบ่อยและแนวทางแก้ไขปัญหา",
    ],
  },
  {
    id: "staff",
    volumeNumber: 2,
    title: "คู่มือเจ้าหน้าที่หอพักและช่างประจำอาคาร",
    subtitle: "ระบบปฏิบัติการสำหรับเจ้าหน้าที่ธุรการและช่างประจำอาคาร",
    targetRole: "เจ้าหน้าที่หอพัก, ช่างประจำอาคาร",
    description:
      "คู่มือการปฏิบัติงานประจำวัน การบันทึกเลขมิเตอร์น้ำ-ไฟผ่านมือถือ การออกบิลแจ้งหนี้ประจำเดือน การตรวจสอบความถูกต้องของสลิปโอนเงิน การจัดผังห้องพัก และการจัดการสถานะงานซ่อมบำรุง",
    status: "available",
    statusText: "พร้อมใช้งาน",
    readOnlineUrl: "/manual/staff",
    pdfDownloadUrl: "/manual/manual-staff.pdf",
    pdfSize: "3.2 MB",
    features: [
      "⭐ ฉบับเข้าใจง่ายที่สุด: ภาษาพูดทีละก้าวสำหรับผู้เริ่มต้น",
      "ระบบเดินจดมิเตอร์บนมือถือและออกบิลอัตโนมัติ",
      "การประมวลผลและออกบิลแจ้งหนี้รายเดือน",
      "การตรวจสอบสลิปการโอนเงินและอนุมัติใบเสร็จ",
      "การบริหารผังห้องพักและเปลี่ยนสถานะห้อง",
      "การจ่ายงานและติดตามสถานะงานแจ้งซ่อม",
      "คำถามที่พบบ่อยสำหรับเจ้าหน้าที่",
    ],
  },
  {
    id: "owner",
    volumeNumber: 3,
    title: "คู่มือเจ้าของหอพักและผู้บริหาร",
    subtitle: "ระบบควบคุมเชิงบริหารและการเงินระดับสูง",
    targetRole: "เจ้าของหอพัก, ผู้บริหาร",
    description:
      "คู่มือการใช้งานแดชบอร์ดสรุปผลประกอบการ การตรวจสอบสถิติการเข้าพัก การตั้งค่าประเภทห้องพักและอัตราค่าน้ำ-ค่าไฟมาตรฐาน การจัดการบัญชีพนักงาน และการควบคุมความโปร่งใสด้านการเงิน",
    status: "available",
    statusText: "พร้อมใช้งาน",
    readOnlineUrl: "/manual/owner",
    pdfDownloadUrl: "/manual/manual-owner.pdf",
    pdfSize: "3.1 MB",
    features: [
      "แดชบอร์ดภาพรวมรายรับ-รายจ่ายและอัตราการเช่า",
      "การกำหนดราคาห้องพักและอัตราค่าน้ำ-ค่าไฟมาตรฐาน",
      "การสร้างและบริหารจัดการบัญชีเจ้าหน้าที่หอพัก",
      "การกำกับดูแลการเงินและการตรวจสอบสลิปย้อนหลัง",
      "แนวปฏิบัติและกฎเหล็กสำหรับผู้บริหาร",
      "คำถามที่พบบ่อยสำหรับเจ้าของหอพัก",
    ],
  },
];

export default function ManualHubPage() {
  const router = useRouter();
  const { currentUser, currentStaffProfile, currentRentalProfile, isOwner, isLoading } = useDormitory();

  useEffect(() => {
    if (!isLoading && !currentUser) {
      router.replace("/login");
    }
  }, [isLoading, currentUser, router]);

  // กำลังโหลดหรือยังไม่ได้ login → แสดงหน้าว่าง รอ redirect
  if (isLoading || !currentUser) {
    return <div style={{ minHeight: "100vh" }} />;
  }

  // กรองเล่มคู่มือตาม role
  let filteredVolumes: ManualVolume[] = [];

  if (currentUser.role === "rental" || currentRentalProfile) {
    filteredVolumes = volumes.filter((v) => v.id === "rental");
  } else if (isOwner || (currentStaffProfile && currentStaffProfile.is_owner)) {
    filteredVolumes = volumes.filter((v) => v.id === "owner");
  } else if (currentUser.role === "staff" || currentStaffProfile) {
    filteredVolumes = volumes.filter((v) => v.id === "staff");
  } else {
    return <div style={{ minHeight: "100vh" }} />;
  }



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
                เดอะ สราญรมย์ เรสซิเดนซ์ (The Saranrom Residence &amp; Apartment)
                จัดทำคู่มือการใช้งานระบบตามบทบาทผู้ใช้งาน พร้อมภาพหน้าจอจริงและคำแนะนำอย่างเป็นขั้นตอน
              </p>
            </div>

            {filteredVolumes.length === 1 && filteredVolumes[0].readOnlineUrl && (
              <div className="manual-actions-row">
                <Link href={filteredVolumes[0].readOnlineUrl} className="manual-btn-primary">
                  <BookOpen size={16} />
                  <span>เปิดอ่านคู่มือ</span>
                </Link>
              </div>
            )}
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

        {/* Volume Cards */}
        <div style={{ marginBottom: "2rem" }}>
          <div className="volumes-section-title">
            <div className="volumes-title-text">
              <FileText size={20} style={{ color: "#065f46" }} />
              <span>
                {filteredVolumes.length === 1
                  ? "คู่มือการใช้งานของคุณ"
                  : `รายการเล่มคู่มือการใช้งาน (${filteredVolumes.length} Volumes)`}
              </span>
            </div>
          </div>

          <div className="volumes-list">
            {filteredVolumes.map((vol) => (
              <div
                key={vol.id}
                className={`volume-card ${vol.status === "available" ? "volume-card-ready" : "volume-card-disabled"}`}
              >
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

                  <div>
                    <div className="volume-features-title">หัวข้อสำคัญในคู่มือเล่มนี้:</div>
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

        {/* Contact */}
        <div className="manual-contact-card">
          <div className="manual-contact-left">
            <div className="manual-contact-icon">
              <PhoneCall size={22} />
            </div>
            <div>
              <h4 className="manual-contact-title">มีข้อสงสัยหรือพบปัญหาการใช้งานระบบ?</h4>
              <p className="manual-contact-subtitle">
                ติดต่อสำนักงานหอพัก เดอะ สราญรมย์ เรสซิเดนซ์ ชั้น 1 (เวลาทำการ 08:30 - 18:00 น.)
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
