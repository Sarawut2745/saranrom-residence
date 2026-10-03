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
  Clock,
  Layers,
  FileCheck,
  Building,
  Wrench,
  Users,
  Megaphone,
  LayoutTemplate,
  Smartphone,
  Zap,
  Droplets,
  Receipt,
  Search,
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
    title: "คู่มือฉบับเข้าใจง่ายที่สุด (สำหรับพนักงานใหม่และผู้เริ่มต้น)",
    shortTitle: "⭐ สำหรับผู้เริ่มต้น (อ่านง่าย)",
    description: "ภาษาพูดเข้าใจง่าย ทำตามทีละก้าว ไม่ใช้ศัพท์เทคนิค เหมาะสำหรับผู้เริ่มต้น",
  },
  {
    id: "ch1",
    number: "บทที่ 1",
    title: "หน้าแดชบอร์ดเจ้าหน้าที่และคิวงานประจำวัน",
    shortTitle: "1. แดชบอร์ดเจ้าหน้าที่",
    description: "ภาพรวมตัวชี้วัดสำคัญ คิวตรวจสลิป และสรุปสถานะห้องพักประจำอาคาร",
  },
  {
    id: "ch2",
    number: "บทที่ 2",
    title: "การออกบิลและจดมิเตอร์น้ำ-ไฟผ่านมือถือ",
    shortTitle: "2. ออกบิลและจดมิเตอร์มือถือ",
    description: "โหมดเดินจดมิเตอร์บนมือถือ บันทึกเลขมิเตอร์ คำนวณค่าน้ำ-ไฟอัตโนมัติ และออกบิลพร้อมกันทั้งชั้น",
  },
  {
    id: "ch3",
    number: "บทที่ 3",
    title: "การตรวจสอบสลิปและอนุมัติการชำระเงิน",
    shortTitle: "3. ตรวจสอบสลิปโอนเงิน",
    description: "ตรวจสอบยอดเงิน วันที่และเวลาโอนกับสเตตเมนต์ และอนุมัติการชำระเงิน",
  },
  {
    id: "ch4",
    number: "บทที่ 4",
    title: "การจัดการผังห้องพักและเปลี่ยนสถานะ",
    shortTitle: "4. จัดการผังห้องพัก",
    description: "ดูผังห้องพักทุกชั้น เปลี่ยนสถานะห้องว่าง มีผู้เช่า หรือปิดปรับปรุง",
  },
  {
    id: "ch5",
    number: "บทที่ 5",
    title: "การจัดการงานแจ้งซ่อมบำรุง",
    shortTitle: "5. คิวงานแจ้งซ่อมบำรุง",
    description: "รับเรื่องแจ้งซ่อม จ่ายงานช่างเทคนิค และอัปเดตสถานะการแก้ไข",
  },
  {
    id: "ch6",
    number: "บทที่ 6",
    title: "ข้อมูลผู้เช่าและสัญญาเช่า",
    shortTitle: "6. ผู้เช่าและสัญญาเช่า",
    description: "บันทึกประวัติผู้เช่า ระยะเวลาสัญญา เงินประกัน และเอกสารประจำห้อง",
  },
  {
    id: "ch7",
    number: "บทที่ 7",
    title: "การส่งประกาศและแจ้งเตือนผ่านไลน์",
    shortTitle: "7. ส่งประกาศและไลน์แจ้งเตือน",
    description: "กระจายข่าวสาร ปิดปรับปรุงระบบน้ำ-ไฟ และบรอดแคสต์เข้า LINE ผู้เช่า",
  },
  {
    id: "ch8",
    number: "บทที่ 8",
    title: "การจัดการเนื้อหาหน้าเว็บไซต์หลัก",
    shortTitle: "8. จัดการเนื้อหาเว็บ",
    description: "อัปเดตราคาห้องพัก ข้อมูลสิ่งอำนวยความสะดวก และรูปภาพส่วนกลาง",
  },
  {
    id: "ch9",
    number: "บทที่ 9",
    title: "คำถามที่พบบ่อยสำหรับการปฏิบัติงาน",
    shortTitle: "9. คำถามที่พบบ่อย",
    description: "รวมแนวทางแก้ไขปัญหาการใช้งานระบบและแนวปฏิบัติการดูแลอาคาร",
  },
];

export default function StaffManualPage() {
  const router = useRouter();
  const { currentUser, currentStaffProfile, isLoading } = useDormitory();

  useEffect(() => {
    if (!isLoading) {
      if (!currentUser) {
        router.replace("/login");
      } else if (currentUser.role !== "staff" && !currentStaffProfile) {
        router.replace("/manual");
      }
    }
  }, [isLoading, currentUser, currentStaffProfile, router]);

  const [activeChapter, setActiveChapter] = useState("quickstart");
  const [lightboxImg, setLightboxImg] = useState<{ src: string; caption: string } | null>(null);

  if (isLoading || !currentUser || (currentUser.role !== "staff" && !currentStaffProfile)) {
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
            <span className="manual-breadcrumb-current">คู่มือเจ้าหน้าที่หอพักและช่างเทคนิค (เล่มที่ 2)</span>
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
              <span>คู่มือการใช้งานระบบ - เล่มที่ 2: สำหรับเจ้าหน้าที่หอพักและช่างประจำอาคาร</span>
            </div>
            <h1 className="manual-hero-title-light">คู่มือการใช้งานระบบสำหรับเจ้าหน้าที่หอพักและช่างเทคนิค</h1>
            <p className="manual-hero-desc-light">
              เดอะ สราญรมย์ เรสซิเดนซ์
              รวบรวมขั้นตอนการบริหารงานอาคาร การออกบิลและจดมิเตอร์น้ำ-ไฟ การตรวจสอบและอนุมัติสลิปโอนเงิน
              การจัดผังห้องพัก การรับเรื่องและจ่ายงานซ่อมบำรุง ตลอดจนการส่งประกาศแจ้งเตือนอย่างละเอียด
            </p>
            <div style={{ display: "flex", gap: "1rem", fontSize: "0.75rem", color: "#a7f3d0", marginTop: "1rem", flexWrap: "wrap" }}>
              <span>ฉบับปรับปรุง: กันยายน 2026</span>
              <span>•</span>
              <span>ผู้ใช้งาน: เจ้าหน้าที่หอพักและช่างประจำอาคาร</span>
              <span>•</span>
              <span>จำนวนบท: 9 บท (พร้อมภาพหน้าจอประกอบจริง)</span>
            </div>
          </div>
        </div>

        {/* Main Content Layout: Sidebar + Chapters */}
        <div className="rental-manual-layout">
          {/* Sticky Sidebar Navigation */}
          <div className="rental-sidebar">
            <div className="rental-sidebar-title">สารบัญเนื้อหา</div>
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
                <span>สำนักงานหอพัก</span>
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
            {/* SPECIAL QUICK START: FOR BEGINNERS & NON-TECH USERS */}
            <section
              id="quickstart"
              className="chapter-box"
              style={{
                background: "linear-gradient(135deg, rgba(79, 70, 229, 0.05) 0%, rgba(245, 158, 11, 0.04) 100%)",
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
                    คู่มือฉบับเข้าใจง่ายที่สุด (สำหรับพนักงานใหม่และผู้เริ่มต้น)
                  </h2>
                  <p style={{ fontSize: "0.85rem", color: "#64748b", margin: "0.2rem 0 0" }}>
                    อธิบายเป็นภาษาพูดเหมือนคุยกับเพื่อน ทีละก้าว ไม่ใช้ศัพท์เทคนิค แม้ไม่เคยใช้ระบบมาก่อนก็ทำตามได้ทันที
                  </p>
                </div>
              </div>

              {/* SECTION 1: Phone vs Computer */}
              <div style={{ background: "#ffffff", borderRadius: "14px", border: "1px solid #e2e8f0", padding: "1.25rem", marginBottom: "1.25rem" }}>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#0f172a", margin: "0 0 0.5rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <span>1. จอมือถือ กับ จอคอมพิวเตอร์ ต่างกันอย่างไร?</span>
                </h3>
                <p style={{ fontSize: "0.86rem", color: "#475569", lineHeight: 1.6, margin: "0 0 0.75rem" }}>
                  คิดภาพตามง่ายๆ นะครับ ระบบนี้เหมือนมีเครื่องมือทำงานให้เรา 2 ชิ้นตามความสะดวก:
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "0.85rem" }}>
                  <div style={{ background: "#f8fafc", padding: "1rem", borderRadius: "10px", border: "1.5px solid #e0e7ff" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#4f46e5", fontWeight: 700, fontSize: "0.92rem", marginBottom: "0.35rem" }}>
                      <Smartphone size={16} />
                      <span>เมื่อเปิดบนโทรศัพท์มือถือ (การ์ดในกระเป๋า)</span>
                    </div>
                    <p style={{ margin: 0, fontSize: "0.82rem", color: "#475569", lineHeight: 1.6 }}>
                      เหมือนถือแผ่นกระดาษโน้ตใบๆ ทีละห้องอยู่ในมือ ตัวหนังสือใหญ่ ชัดเจน แตะปุ่มด้วยนิ้วโป้งมือเดียวได้สบาย ไม่ต้องเลื่อนจอซ้าย-ขวาให้เวียนหัว เหมาะมากเวลาเดินจดมิเตอร์หรือยืนตรวจงาน
                    </p>
                  </div>
                  <div style={{ background: "#f8fafc", padding: "1rem", borderRadius: "10px", border: "1.5px solid #e2e8f0" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#0f172a", fontWeight: 700, fontSize: "0.92rem", marginBottom: "0.35rem" }}>
                      <Building size={16} />
                      <span>เมื่อเปิดบนจอคอมพิวเตอร์ (สมุดบัญชีเล่มใหญ่)</span>
                    </div>
                    <p style={{ margin: 0, fontSize: "0.82rem", color: "#475569", lineHeight: 1.6 }}>
                      เหมือนกางสมุดบัญชีเล่มใหญ่บนโต๊ะทำงาน ข้อมูลเรียงเป็นตารางแถวยาว กวาดสายตามองเห็นครบทุกห้องพร้อมกันในหน้าเดียว เหมาะสำหรับนั่งทำงานในสำนักงาน
                    </p>
                  </div>
                </div>
              </div>

              {/* SECTION 2: Hamburger Menu on Mobile */}
              <div style={{ background: "#ffffff", borderRadius: "14px", border: "1px solid #e2e8f0", padding: "1.25rem", marginBottom: "1.25rem" }}>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#0f172a", margin: "0 0 0.5rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <Menu size={18} style={{ color: "#4f46e5" }} />
                  <span>2. วิธีเปิดเมนูนำทางบนมือถือ (ปุ่มสามขีด ☰)</span>
                </h3>
                <p style={{ fontSize: "0.86rem", color: "#475569", lineHeight: 1.6, margin: "0 0 0.75rem" }}>
                  เปรียบเทียบง่ายๆ เหมือน <strong>"ลิ้นชักเก็บเครื่องมือข้างโต๊ะ"</strong> ที่ซ่อนไว้เพื่อไม่ให้รกหน้าจอ:
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem", fontSize: "0.84rem", color: "#334155" }}>
                  <div><strong>ก้าวที่ 1:</strong> มองไปที่มุมบนซ้ายของหน้าจอมือถือ</div>
                  <div><strong>ก้าวที่ 2:</strong> แตะที่ปุ่มสัญลักษณ์สามขีด ☰ (ปุ่มเปิดเมนู)</div>
                  <div><strong>ก้าวที่ 3:</strong> ลิ้นชักเมนูจะเลื่อนเปิดออกมา แตะเลือกหน้าที่ต้องการไปทำงาน เช่น "ตรวจสลิปชำระเงิน" หรือ "โหมดเดินจดมิเตอร์"</div>
                  <div><strong>ก้าวที่ 4:</strong> เมื่อแตะเลือกหน้าแล้ว เมนูจะปิดเองโดยอัตโนมัติ พร้อมพาไปยังหน้านั้นทันที</div>
                </div>
              </div>

              {/* SECTION 3: Walk meter reading mode */}
              <div style={{ background: "#ffffff", borderRadius: "14px", border: "1px solid #e2e8f0", padding: "1.25rem", marginBottom: "1.25rem" }}>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#4f46e5", margin: "0 0 0.5rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <Zap size={18} />
                  <span>3. วิธีเดินจดมิเตอร์น้ำ-ไฟผ่านมือถือ (ทำทีละก้าว)</span>
                </h3>
                <p style={{ fontSize: "0.86rem", color: "#475569", lineHeight: 1.6, margin: "0 0 0.75rem" }}>
                  เปรียบเหมือนมี <strong>"เครื่องคิดเลขส่วนตัว"</strong> เดินไปด้วยกัน ไม่ต้องจำสูตรคำนวณ ไม่ต้องพกกระดาษปากกา:
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem", fontSize: "0.84rem", color: "#334155" }}>
                  <div><strong>ก้าวที่ 1:</strong> แตะปุ่มสีน้ำเงินม่วง "โหมดเดินจดมิเตอร์บนมือถือ"</div>
                  <div><strong>ก้าวที่ 2:</strong> แตะเลือกชั้นที่กำลังจะเดินจด เช่น ปุ่ม <code>[ ชั้น 2 ]</code></div>
                  <div><strong>ก้าวที่ 3:</strong> เดินไปยืนหน้าห้องแรก (เช่น ห้อง 201)</div>
                  <div><strong>ก้าวที่ 4:</strong> ก้มดูเลขมิเตอร์น้ำหน้าห้อง แล้วพิมพ์ตัวเลขลงในช่อง "มิเตอร์น้ำ"</div>
                  <div><strong>ก้าวที่ 5:</strong> ก้มดูเลขมิเตอร์ไฟหน้าห้อง แล้วพิมพ์ตัวเลขลงในช่อง "มิเตอร์ไฟ"</div>
                  <div><strong>ก้าวที่ 6:</strong> แตะปุ่มสีเขียวขนาดใหญ่ "บันทึก & ไปห้องถัดไป" ด้วยนิ้วโป้ง</div>
                  <div><strong>ก้าวที่ 7:</strong> หน้าจอจะสลับไปห้องถัดไปทันที (เช่น ห้อง 202) ให้เดินจดต่อไปเรื่อยๆ</div>
                  <div><strong>ก้าวที่ 8:</strong> เมื่อจดครบทั้งชั้นแล้ว ให้แตะปุ่ม "ตรวจทาน & ออกบิลทั้งชั้น" เป็นอันเสร็จสิ้น</div>
                </div>
                <div style={{ marginTop: "0.85rem", padding: "0.75rem 1rem", background: "rgba(79, 70, 229, 0.07)", borderRadius: "10px", fontSize: "0.82rem", color: "#4338ca", lineHeight: 1.6 }}>
                  <strong>ตัวอย่างจริง:</strong> หน้าห้อง 201 เดือนก่อนเลขมิเตอร์ไฟอยู่ที่ 500 วันนี้เราเห็นเลข 560 เราก็พิมพ์แค่ 560 ลงในช่อง ระบบจะรู้ทันทีว่าใช้ไฟไป 60 หน่วย คิดเป็นเงิน 480 บาท โดยที่เราไม่ต้องกดเครื่องคิดเลขเลย
                </div>
              </div>

              {/* SECTION 4: Slip Inspection */}
              <div style={{ background: "#ffffff", borderRadius: "14px", border: "1px solid #e2e8f0", padding: "1.25rem", marginBottom: "1.25rem" }}>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#065f46", margin: "0 0 0.5rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <Receipt size={18} />
                  <span>4. วิธีตรวจสลิปโอนเงินของผู้เช่า (ทำทีละก้าว)</span>
                </h3>
                <p style={{ fontSize: "0.86rem", color: "#475569", lineHeight: 1.6, margin: "0 0 0.75rem" }}>
                  เปรียบเหมือนเราหยิบใบเสร็จโอนเงินมาทาบดูกับบิลค่าห้อง ว่ายอดเงินตรงกันเป๊ะไหม:
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem", fontSize: "0.84rem", color: "#334155" }}>
                  <div><strong>ก้าวที่ 1:</strong> แตะเข้าเมนู "ตรวจสลิปชำระเงิน"</div>
                  <div><strong>ก้าวที่ 2:</strong> มองหาห้องที่มีป้ายสีส้มเขียนว่า "รอตรวจสอบ"</div>
                  <div><strong>ก้าวที่ 3:</strong> แตะปุ่ม "🔍 ตรวจสอบสลิป"</div>
                  <div><strong>ก้าวที่ 4:</strong> กวาดตามองดูตัวเลขยอดเงิน ถ้าขึ้นตัวเลขสีเขียวแปลว่ายอดเงินตรงกันถูกต้อง</div>
                  <div><strong>ก้าวที่ 5:</strong> แตะปุ่มสีเขียว "✓ อนุมัติการชำระเงิน" เพื่อยืนยัน</div>
                </div>
                <div style={{ marginTop: "0.85rem", padding: "0.75rem 1rem", background: "rgba(220, 38, 38, 0.07)", borderRadius: "10px", fontSize: "0.82rem", color: "#b91c1c", lineHeight: 1.6 }}>
                  <strong>ตัวอย่างจริง กรณีเงินไม่ครบ:</strong> ผู้เช่าห้อง 302 บิลค่าเช่า 5,000 บาท แต่โอนมา 4,500 บาท ระบบจะเตือนตัวเลขสีแดง ให้เราแตะปุ่มสีแดง "✕ ปฏิเสธสลิปนี้" แล้วพิมพ์บอกว่า "ยอดเงินขาด 500 บาท" ข้อความจะส่งเตือนไปที่มือถือผู้เช่าทันที
                </div>
              </div>

              {/* SECTION 5: Tenant & Room Search */}
              <div style={{ background: "#ffffff", borderRadius: "14px", border: "1px solid #e2e8f0", padding: "1.25rem", marginBottom: "1.25rem" }}>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#0f172a", margin: "0 0 0.5rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <Search size={18} style={{ color: "#4f46e5" }} />
                  <span>5. วิธีค้นหาห้องพักและผู้เช่าอย่างรวดเร็ว (ทำทีละก้าว)</span>
                </h3>
                <p style={{ fontSize: "0.86rem", color: "#475569", lineHeight: 1.6, margin: "0 0 0.75rem" }}>
                  เปรียบเหมือน <strong>"สมุดโทรศัพท์ที่มีแว่นขยายช่วยหา"</strong> ไม่ต้องไล่หาทีละหน้า:
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem", fontSize: "0.84rem", color: "#334155" }}>
                  <div><strong>ก้าวที่ 1:</strong> แตะเข้าเมนู "ข้อมูลผู้เช่า"</div>
                  <div><strong>ก้าวที่ 2:</strong> แตะที่ช่องค้นหาที่มีรูปแว่นขยาย 🔍</div>
                  <div><strong>ก้าวที่ 3:</strong> พิมพ์หมายเลขห้อง เช่น "201" หรือพิมพ์ชื่อผู้เช่า เช่น "สมชาย"</div>
                  <div><strong>ก้าวที่ 4:</strong> รายชื่อห้องนั้นจะปรากฏขึ้นมาทันที สามารถดูเบอร์โทรหรือกดตั้งรหัสผ่านใหม่ได้ทันที</div>
                </div>
              </div>

              {/* SECTION 6: Repairs Management */}
              <div style={{ background: "#ffffff", borderRadius: "14px", border: "1px solid #e2e8f0", padding: "1.25rem", marginBottom: "1.25rem" }}>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#0f172a", margin: "0 0 0.5rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <Wrench size={18} style={{ color: "#b45309" }} />
                  <span>6. วิธีรับเรื่องแจ้งซ่อมและส่งช่างไปแก้ไข (ทำทีละก้าว)</span>
                </h3>
                <p style={{ fontSize: "0.86rem", color: "#475569", lineHeight: 1.6, margin: "0 0 0.75rem" }}>
                  เปรียบเหมือน <strong>"กระดานแปะใบสั่งงานช่าง"</strong> ของหอพัก:
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem", fontSize: "0.84rem", color: "#334155" }}>
                  <div><strong>ก้าวที่ 1:</strong> แตะเข้าเมนู "งานแจ้งซ่อมบำรุง"</div>
                  <div><strong>ก้าวที่ 2:</strong> แตะดูรายการที่ขึ้นป้ายสีส้ม "รอดำเนินการ" เพื่ออ่านปัญหาและแตะดูภาพถ่ายความเสียหาย</div>
                  <div><strong>ก้าวที่ 3:</strong> โทรประสานงานช่างประจำอาคาร (ช่างไฟ ช่างประปา หรือช่างแอร์) พร้อมแตะเปลี่ยนสถานะเป็น "กำลังดำเนินการ"</div>
                  <div><strong>ก้าวที่ 4:</strong> เมื่อช่างแก้ไขเรียบร้อย ให้แตะปุ่ม "เสร็จสิ้น" และพิมพ์บันทึกสั้นๆ เช่น "เปลี่ยนก๊อกน้ำใหม่เรียบร้อย" เพื่อจบงาน</div>
                </div>
              </div>

              {/* SECTION 7: 3 Colors to Remember */}
              <div style={{ background: "#ffffff", borderRadius: "14px", border: "1px solid #e2e8f0", padding: "1.25rem", marginBottom: "1.25rem" }}>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#0f172a", margin: "0 0 0.5rem" }}>
                  7. ข้อจำง่ายๆ 3 สีประจำระบบ
                </h3>
                <p style={{ fontSize: "0.86rem", color: "#475569", lineHeight: 1.6, margin: "0 0 0.75rem" }}>
                  จำแค่ 3 สีนี้ จะเข้าใจสถานะงานทุกอย่างในหอพักได้ทันที:
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.65rem", fontSize: "0.84rem" }}>
                  <div style={{ padding: "0.65rem 0.85rem", borderRadius: "8px", background: "rgba(220, 38, 38, 0.08)", color: "#dc2626", fontWeight: 600 }}>
                    🔴 <strong>สีแดง:</strong> ยังไม่จ่ายเงิน หรือมีเรื่องด่วนที่ต้องรีบทำทันที
                  </div>
                  <div style={{ padding: "0.65rem 0.85rem", borderRadius: "8px", background: "rgba(245, 158, 11, 0.08)", color: "#b45309", fontWeight: 600 }}>
                    🟡 <strong>สีเหลือง/ส้ม:</strong> รอเจ้าหน้าที่ตรวจสลิป หรือช่างกำลังดำเนินการซ่อม
                  </div>
                  <div style={{ padding: "0.65rem 0.85rem", borderRadius: "8px", background: "rgba(5, 150, 105, 0.08)", color: "#065f46", fontWeight: 600 }}>
                    🟢 <strong>สีเขียว:</strong> เรียบร้อยดี เช่น จ่ายเงินครบแล้ว หรือซ่อมเสร็จแล้ว
                  </div>
                </div>
              </div>

              {/* SECTION 8: Help & Reset */}
              <div style={{ background: "rgba(79, 70, 229, 0.04)", borderRadius: "14px", border: "1px solid rgba(79, 70, 229, 0.2)", padding: "1.25rem" }}>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#4338ca", margin: "0 0 0.5rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <Home size={18} />
                  <span>8. คำแนะนำเมื่อทำอะไรไม่ถูก หรือหน้าจอค้าง</span>
                </h3>
                <p style={{ fontSize: "0.84rem", color: "#334155", lineHeight: 1.6, margin: 0 }}>
                  หากแตะผิดหน้า หรือสับสนว่ากำลังอยู่ที่ไหน ให้แตะที่ชื่อหอพัก <strong>"เดอะ สราญรมย์ เรสซิเดนซ์"</strong> หรือปุ่ม <strong>"หน้าหลัก"</strong> ที่มุมบนซ้าย เพื่อกลับมาเริ่มต้นใหม่ที่หน้าแรกเสมอ เหมือนกดปุ่มกลับจุดเริ่มต้น หรือหากอินเทอร์เน็ตสะดุด ให้แตะรีเฟรชหน้าจอเหมือนเปิดกระดาษหน้าใหม่ ข้อมูลที่บันทึกไปแล้วจะไม่สูญหาย
                </p>
              </div>
            </section>

            {/* CHAPTER 1: DASHBOARD */}
            <section id="ch1" className="chapter-box">
              <div className="chapter-header">
                <span className="chapter-badge">บทที่ 1</span>
                <h2 className="chapter-title">หน้าแดชบอร์ดเจ้าหน้าที่และคิวงานประจำวัน</h2>
                <p className="chapter-subtitle">
                  ศูนย์รวมตัวชี้วัดสำคัญ คิวงานด่วนที่ต้องดำเนินการ และสถานะห้องพักล่าสุด
                </p>
              </div>

              <div className="screenshot-container">
                <div
                  className="screenshot-frame"
                  onClick={() =>
                    setLightboxImg({
                      src: "/manual/images/staff/01_staff_dashboard.png",
                      caption: "ภาพรวมแดชบอร์ดเจ้าหน้าที่และคิวงานเร่งด่วน",
                    })
                  }
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/manual/images/staff/01_staff_dashboard.png" alt="หน้าแดชบอร์ดเจ้าหน้าที่" />
                  <div className="screenshot-hover-hint">
                    <Maximize2 size={13} />
                    <span>คลิกเพื่อขยายภาพ</span>
                  </div>
                </div>
                <div className="screenshot-caption">
                  ภาพที่ 1: ภาพรวมแดชบอร์ดเจ้าหน้าที่ พร้อมจุดสำคัญ (1) คิวตรวจสลิป (2) ปุ่มออกบิลด่วน (3) ตัวชี้วัดงาน
                </div>
              </div>

              <div className="manual-steps-list">
                <div className="manual-step-item">
                  <span className="step-num">1</span>
                  <div>
                    <strong>จุดที่ 1: คิวตรวจสอบสลิปโอนเงินล่าสุด</strong>
                    <div style={{ color: "#475569", marginTop: "0.15rem" }}>
                      แสดงรายการสลิปที่ผู้เช่าอัปโหลดเข้ามาใหม่ เจ้าหน้าที่สามารถคลิกปุ่ม "ตรวจสลิป" เพื่อเปิดหน้าต่างตรวจสอบยอดเงินได้ทันที
                    </div>
                  </div>
                </div>
                <div className="manual-step-item">
                  <span className="step-num">2</span>
                  <div>
                    <strong>จุดที่ 2: ปุ่มออกบิลใหม่และเดินจดมิเตอร์บนมือถือ</strong>
                    <div style={{ color: "#475569", marginTop: "0.15rem" }}>
                      ทางลัดเข้าสู่ระบบบันทึกมิเตอร์น้ำประปาและไฟฟ้า ทั้งแบบเปิดบนคอมพิวเตอร์และโหมดเดินจดบนมือถือ เพื่อออกใบแจ้งหนี้ให้ผู้เช่า
                    </div>
                  </div>
                </div>
                <div className="manual-step-item">
                  <span className="step-num">3</span>
                  <div>
                    <strong>จุดที่ 3: แผงตัวชี้วัดด่วน 4 ด้าน</strong>
                    <div style={{ color: "#475569", marginTop: "0.15rem" }}>
                      สรุปสถิติด่วน ได้แก่ จำนวนสลิปรอตรวจ, บิลค้างชำระทั้งหมด, งานแจ้งซ่อมที่ยังค้างอยู่ และจำนวนห้องว่างพร้อมเปิดเช่า
                    </div>
                  </div>
                </div>
              </div>

              <div className="callout-tip">
                <div className="callout-tip-header">
                  <Info size={16} />
                  <span>คำแนะนำการปฏิบัติงานประจำวัน</span>
                </div>
                <div className="callout-tip-text">
                  เจ้าหน้าที่หอพักควรเปิดหน้าแดชบอร์ดตรวจสอบเป็นสิ่งแรกในทุกเช้า (เวลา 08:30 น.)
                  เพื่อเคลียร์คิวสลิปที่ผู้เช่าโอนเข้ามาช่วงค่ำ และจ่ายงานแจ้งซ่อมเร่งด่วนให้ช่างเทคนิคดำเนินการภายใน 2 ชั่วโมง
                </div>
              </div>
            </section>

            {/* CHAPTER 2: BILLS & METERS */}
            <section id="ch2" className="chapter-box">
              <div className="chapter-header">
                <span className="chapter-badge">บทที่ 2</span>
                <h2 className="chapter-title">การออกบิลและจดมิเตอร์น้ำ-ไฟผ่านมือถือ</h2>
                <p className="chapter-subtitle">
                  ขั้นตอนการเดินจดเลขมิเตอร์ผ่านมือถือ, การคำนวณค่าน้ำ-ไฟอัตโนมัติ, การออกบิลพร้อมกันทั้งชั้น และการพิมพ์ใบแจ้งหนี้
                </p>
              </div>

              {/* Callout Box: 2 Methods */}
              <div style={{ background: "rgba(79, 70, 229, 0.05)", border: "1.5px solid rgba(79, 70, 229, 0.2)", borderRadius: "14px", padding: "1.25rem", marginBottom: "1.75rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#4f46e5", fontWeight: 800, fontSize: "1rem", marginBottom: "0.5rem" }}>
                  <Smartphone size={18} />
                  <span>ระบบรองรับการทำงาน 2 รูปแบบตามความสะดวก</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "0.85rem", fontSize: "0.86rem", color: "#334155" }}>
                  <div style={{ background: "#ffffff", padding: "0.85rem", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                    <strong style={{ color: "#4f46e5" }}>📱 วิธีที่ 1: โหมดเดินจดบนมือถือ (แนะนำ)</strong>
                    <p style={{ margin: "0.25rem 0 0", color: "#64748b", fontSize: "0.82rem", lineHeight: 1.5 }}>
                      ใช้สมาร์ตโฟนถือเดินจดหน้าห้องพัก มีระบบจำเลขครั้งก่อน คำนวณเงินทันที และกดออกบิลรวมทั้งชั้นได้ในคลิกเดียว
                    </p>
                  </div>
                  <div style={{ background: "#ffffff", padding: "0.85rem", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                    <strong style={{ color: "#0f172a" }}>💻 วิธีที่ 2: โหมดคอมพิวเตอร์สำนักงาน</strong>
                    <p style={{ margin: "0.25rem 0 0", color: "#64748b", fontSize: "0.82rem", lineHeight: 1.5 }}>
                      เปิดหน้าจอจัดการใบแจ้งหนี้บนคอมพิวเตอร์ เพื่อออกบิลรายห้อง ตรวจสอบประวัติบิลย้อนหลัง และพิมพ์ใบแจ้งหนี้เป็นกระดาษ
                    </p>
                  </div>
                </div>
              </div>

              {/* SECTION 2.1: MOBILE PWA INSTALL & USAGE */}
              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.45rem" }}>
                  <Smartphone size={18} style={{ color: "#4f46e5" }} />
                  2.1 วิธีติดตั้งและใช้งานเป็น "แอปพลิเคชันบนมือถือ"
                </h3>
                <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", marginBottom: "1rem", lineHeight: 1.6 }}>
                  เจ้าหน้าที่สามารถติดตั้งหน้าจดมิเตอร์ลงบนหน้าจอโฮมของสมาร์ตโฟนได้ทันที โดยไม่ต้องดาวน์โหลดผ่านร้านค้าแอปพลิเคชัน เมื่อแตะเปิดใช้งาน จะแสดงผลเต็มหน้าจอ 100% ไร้แถบที่อยู่เว็บหรือปุ่มเบราว์เซอร์กวนใจ
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
                  {/* iOS */}
                  <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "1rem" }}>
                    <strong style={{ display: "block", fontSize: "0.92rem", color: "#0f172a", marginBottom: "0.5rem" }}>
                      🍎 สำหรับ iPhone และ iPad (ผ่าน Safari)
                    </strong>
                    <ol style={{ paddingLeft: "1.25rem", margin: 0, fontSize: "0.84rem", color: "#475569", lineHeight: 1.7 }}>
                      <li>เปิด Safari เข้าไปที่หน้าจดมิเตอร์ (<code style={{ background: "#e2e8f0", padding: "0.1rem 0.3rem", borderRadius: "4px" }}>/staff/meter-reading</code>)</li>
                      <li>แตะปุ่ม <strong>แชร์</strong> ที่แถบด้านล่างของจอ</li>
                      <li>เลื่อนลงมาแล้วเลือก <strong>"เพิ่มไปยังหน้าจอโฮม"</strong></li>
                      <li>แตะ <strong>"เพิ่ม"</strong> ไอคอนแอปจะปรากฏบนหน้าจอมือถือทันที</li>
                    </ol>
                  </div>

                  {/* Android */}
                  <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "1rem" }}>
                    <strong style={{ display: "block", fontSize: "0.92rem", color: "#0f172a", marginBottom: "0.5rem" }}>
                      🤖 สำหรับมือถือ Android (ผ่าน Google Chrome)
                    </strong>
                    <ol style={{ paddingLeft: "1.25rem", margin: 0, fontSize: "0.84rem", color: "#475569", lineHeight: 1.7 }}>
                      <li>เปิด Chrome เข้าไปที่หน้าจดมิเตอร์</li>
                      <li>แตะปุ่ม <strong>จุดสามจุด (⋮)</strong> ที่มุมบนขวา</li>
                      <li>เลือก <strong>"ติดตั้งแอป"</strong> หรือ "เพิ่มลงในหน้าจอหลัก"</li>
                      <li>กดยืนยันการติดตั้ง ไอคอนแอปจะไปอยู่ที่หน้าจอหลักทันที</li>
                    </ol>
                  </div>
                </div>

                {/* Screenshot of Mobile Walk Mode */}
                <div className="screenshot-container" style={{ maxWidth: "340px", margin: "1.5rem auto" }}>
                  <div
                    className="screenshot-frame"
                    style={{ borderRadius: "28px", overflow: "hidden", boxShadow: "0 10px 30px -5px rgba(0,0,0,0.18)" }}
                    onClick={() =>
                      setLightboxImg({
                        src: "/manual/images/staff/02c_meter_reading_mobile.png",
                        caption: "หน้าจอโหมดเดินจดมิเตอร์น้ำ-ไฟบนมือถือ แสดงผลเต็มหน้าจอ 100%",
                      })
                    }
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/manual/images/staff/02c_meter_reading_mobile.png" alt="หน้าจอเดินจดมิเตอร์บนมือถือ" />
                    <div className="screenshot-hover-hint">
                      <Maximize2 size={13} />
                      <span>คลิกเพื่อขยายภาพ</span>
                    </div>
                  </div>
                  <div className="screenshot-caption" style={{ textAlign: "center" }}>
                    ภาพที่ 2a: หน้าจอเดินจดมิเตอร์บนมือถือ พร้อมระบบจำเลขก่อนหน้าและคำนวณยอดเงินอัตโนมัติ
                  </div>
                </div>

                <div className="manual-steps-list">
                  <div className="manual-step-item">
                    <span className="step-num">1</span>
                    <div>
                      <strong>เลือกชั้นที่ต้องการเดินจด และรอบเดือน</strong>
                      <div style={{ color: "#475569", marginTop: "0.15rem" }}>
                        แตะเลือกแถบชั้น เช่น <code>[ ชั้น 2 ]</code> <code>[ ชั้น 3 ]</code> ระบบจะกรองห้องเฉพาะชั้นนั้นขึ้นมา พร้อมหลอดแสดงเปอร์เซ็นต์ความคืบหน้า
                      </div>
                    </div>
                  </div>
                  <div className="manual-step-item">
                    <span className="step-num">2</span>
                    <div>
                      <strong>บันทึกเลขมิเตอร์ใน "โหมดเดินจดทีละห้อง"</strong>
                      <div style={{ color: "#475569", marginTop: "0.15rem" }}>
                        หน้าจอจะแสดงการ์ดห้องขนาดใหญ่ พร้อม <strong>"เลขมิเตอร์ครั้งก่อน"</strong> ที่ระบบดึงมาให้อัตโนมัติ กรอกเลขปัจจุบันของมิเตอร์น้ำและไฟฟ้า ระบบจะคำนวณหน่วยที่ใช้และยอดเงินรวมให้เห็นทันที
                      </div>
                    </div>
                  </div>
                  <div className="manual-step-item">
                    <span className="step-num">3</span>
                    <div>
                      <strong>แตะปุ่ม "บันทึก & ห้องถัดไป" เพื่อเดินจดห้องถัดไป</strong>
                      <div style={{ color: "#475569", marginTop: "0.15rem" }}>
                        ระบบจะบันทึกข้อมูลลงเครื่องอัตโนมัติ (แม้สัญญาณอินเทอร์เน็ตขาดหายข้อมูลก็ไม่สูญหาย) แล้วสลับไปยังห้องถัดไปทันทีด้วยมือเดียวอย่างรวดเร็ว
                      </div>
                    </div>
                  </div>
                  <div className="manual-step-item">
                    <span className="step-num">4</span>
                    <div>
                      <strong>แตะ "ตรวจทาน & ออกบิล" เพื่อสร้างบิลพร้อมกันทั้งชั้น</strong>
                      <div style={{ color: "#475569", marginTop: "0.15rem" }}>
                        เมื่อจดครบแล้ว แตะปุ่มตรวจทานที่แถบด้านล่าง กำหนดวันครบกำหนดชำระ แล้วกดยืนยัน ระบบจะออกใบแจ้งหนี้ให้ทุกห้องพร้อมกันในคลิกเดียว
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2.2: DESKTOP BILLING & PRINTING */}
              <div style={{ marginBottom: "2rem", borderTop: "1px solid #e2e8f0", paddingTop: "1.5rem" }}>
                <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.45rem" }}>
                  <Receipt size={18} style={{ color: "#4f46e5" }} />
                  2.2 การออกบิลและพิมพ์ใบแจ้งหนี้ผ่านคอมพิวเตอร์สำนักงาน
                </h3>
                <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", marginBottom: "1rem", lineHeight: 1.6 }}>
                  สำหรับกรณีต้องการออกบิลเป็นรายห้อง หรือต้องการสั่งพิมพ์ใบแจ้งหนี้ขนาดมาตรฐาน A4 พร้อม QR Code เพื่อนำไปใส่กล่องจดหมายหน้าห้องพัก
                </p>

                <div className="screenshot-container">
                  <div
                    className="screenshot-frame"
                    onClick={() =>
                      setLightboxImg({
                        src: "/manual/images/staff/02a_bills_overview.png",
                        caption: "หน้ารายการใบแจ้งหนี้ประจำเดือนบนคอมพิวเตอร์",
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
                    ภาพที่ 2b: หน้ารายการใบแจ้งหนี้บนคอมพิวเตอร์ (1) ปุ่มเข้าโหมดมือถือ (2) ปุ่มออกบิลใหม่ (3) ตารางรายการบิลรายห้อง
                  </div>
                </div>

                <div className="screenshot-container">
                  <div
                    className="screenshot-frame"
                    onClick={() =>
                      setLightboxImg({
                        src: "/manual/images/staff/02b_meter_entry_modal.png",
                        caption: "หน้าต่างบันทึกเลขมิเตอร์รายห้องบนคอมพิวเตอร์",
                      })
                    }
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/manual/images/staff/02b_meter_entry_modal.png" alt="หน้าต่างบันทึกเลขมิเตอร์" />
                    <div className="screenshot-hover-hint">
                      <Maximize2 size={13} />
                      <span>คลิกเพื่อขยายภาพ</span>
                    </div>
                  </div>
                  <div className="screenshot-caption">
                    ภาพที่ 2c: หน้าต่างบันทึกมิเตอร์รายห้องบนคอมพิวเตอร์ พร้อมระบบคำนวณค่าน้ำ-ค่าไฟ
                  </div>
                </div>

                <div className="manual-steps-list">
                  <div className="manual-step-item">
                    <span className="step-num">1</span>
                    <div>
                      <strong>เข้าสู่เมนู "ออกบิลค่าห้อง"</strong>
                      <div style={{ color: "#475569", marginTop: "0.15rem" }}>
                        คลิกเมนูด้านซ้ายเพื่อดูรายการบิลทั้งหมด สามารถค้นหาตามเลขห้อง หรือกรองดูเฉพาะบิลค้างชำระ รอตรวจ หรือชำระแล้วได้
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
                      <strong>กรอกเลขมิเตอร์ปัจจุบัน และกดบันทึก</strong>
                      <div style={{ color: "#475569", marginTop: "0.15rem" }}>
                        กรอกเลขมิเตอร์น้ำประปา (18 บ./หน่วย) และไฟฟ้า (8 บ./หน่วย) ระบบคำนวณยอดสุทธิและสร้างบิลพร้อม QR Code ทันที
                      </div>
                    </div>
                  </div>
                  <div className="manual-step-item">
                    <span className="step-num">4</span>
                    <div>
                      <strong>การพิมพ์ใบแจ้งหนี้และใบเสร็จ</strong>
                      <div style={{ color: "#475569", marginTop: "0.15rem" }}>
                        คลิกไอคอนเครื่องพิมพ์ที่แถวของบิลห้องนั้นๆ เพื่อเปิดหน้าตัวอย่างพิมพ์ขนาด A4 พร้อมหัวจดหมายทางการของหอพักเดอะ สราญรมย์
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CALLOUT WARNING */}
              <div className="callout-danger">
                <div className="callout-danger-header">
                  <AlertTriangle size={16} />
                  <span>กฎเหล็กและข้อควรระวังสำคัญ: ตรวจสอบเลขมิเตอร์ก่อนออกบิล</span>
                </div>
                <div className="callout-danger-text">
                  <ul style={{ margin: 0, paddingLeft: "1.25rem", lineHeight: 1.6 }}>
                    <li><strong>เลขมิเตอร์ปัจจุบันต้องมากกว่าเลขครั้งก่อนเสมอ</strong>: หากพิมพ์ตัวเลขน้อยกว่า ระบบจะมีแถบเตือนสีส้มแจ้งเตือนทันที กรุณาตรวจทานตัวเลขที่ตู้มิเตอร์อีกครั้ง</li>
                    <li><strong>ห้องว่างที่ไม่มีผู้เช่า</strong>: ระบบจะขึ้นป้ายสีเทาว่า "ห้องว่าง" ให้อัตโนมัติ และจะไม่นำไปรวมในการออกบิลค่าเช่า เพื่อป้องกันการสร้างบิลผิดพลาด</li>
                    <li><strong>การแก้ไขบิล</strong>: เมื่อกดออกบิลแล้ว ผู้เช่าจะเห็นยอดเงินทันทีในหน้าแดชบอร์ด หากพบว่าใส่ตัวเลขผิด กรุณาแจ้งผู้ดูแลระบบเพื่อปรับปรุงข้อมูลให้ถูกต้อง</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* CHAPTER 3: PAYMENTS & SLIP VERIFICATION */}
            <section id="ch3" className="chapter-box">
              <div className="chapter-header">
                <span className="chapter-badge">บทที่ 3</span>
                <h2 className="chapter-title">การตรวจสอบสลิปและอนุมัติการชำระเงิน</h2>
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
                    <strong>เข้าสู่เมนู "การชำระเงิน"</strong>
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
                <h2 className="chapter-title">การจัดการผังห้องพักและเปลี่ยนสถานะ</h2>
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
                    <strong>เข้าสู่เมนู "ผังห้องพัก"</strong>
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
                      • <strong>มีผู้เช่า:</strong> การ์ดสีน้ำเงิน/เขียว มีผู้พักอาศัยอยู่และมีสัญญาเช่าที่ยังมีผล
                      <br />• <strong>ห้องว่าง:</strong> การ์ดสีเขียวมิ้นต์ ห้องสะอาดพร้อมเปิดทำสัญญาให้ผู้เช่าใหม่
                      <br />• <strong>ปรับปรุง:</strong> การ์ดสีส้ม ห้องอยู่ระหว่างทำความสะอาดหรือซ่อมแซม ห้ามเปิดเช่า
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
                <h2 className="chapter-title">การจัดการงานแจ้งซ่อมบำรุง</h2>
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
                    <strong>ประเมินความเร่งด่วนและจ่ายงานช่าง</strong>
                    <div style={{ color: "#475569", marginTop: "0.15rem" }}>
                      เลือกช่างเทคนิคผู้รับผิดชอบงาน (ช่างไฟ, ช่างประปา, หรือช่างแอร์) พร้อมระบุกำหนดเวลาเข้าดำเนินการ
                    </div>
                  </div>
                </div>
                <div className="manual-step-item">
                  <span className="step-num">3</span>
                  <div>
                    <strong>อัปเดตสถานะเป็น "กำลังดำเนินการ"</strong>
                    <div style={{ color: "#475569", marginTop: "0.15rem" }}>
                      เมื่อช่างเริ่มเข้าตรวจสอบห้องพัก ให้ปรับสถานะเพื่อให้ผู้เช่าเห็นความคืบหน้าได้ทันทีในระบบ
                    </div>
                  </div>
                </div>
                <div className="manual-step-item">
                  <span className="step-num">4</span>
                  <div>
                    <strong>ปิดงานซ่อมบำรุงเป็น "เสร็จสิ้น"</strong>
                    <div style={{ color: "#475569", marginTop: "0.15rem" }}>
                      เมื่อช่างแก้ไขเรียบร้อย ให้บันทึกรายละเอียดการซ่อม (เช่น เปลี่ยนก๊อกน้ำใหม่) และกดยืนยันปิดงาน
                    </div>
                  </div>
                </div>
              </div>

              <div className="callout-danger">
                <div className="callout-danger-header">
                  <AlertTriangle size={16} />
                  <span>เกณฑ์เวลามาตรฐานสำหรับงานซ่อมฉุกเฉิน</span>
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
                <h2 className="chapter-title">ข้อมูลผู้เช่าและสัญญาเช่า</h2>
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
                      ระบบจะแสดงสถานะสัญญาว่าปกติ ใกล้หมดอายุ (น้อยกว่า 30 วัน) หรือหมดอายุแล้ว เพื่อให้เจ้าหน้าที่ดำเนินการต่อสัญญาได้ทันท่วงที
                    </div>
                  </div>
                </div>
                <div className="manual-step-item">
                  <span className="step-num">3</span>
                  <div>
                    <strong>บันทึกยอดเงินประกันห้องพัก</strong>
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
                <h2 className="chapter-title">การส่งประกาศและแจ้งเตือนผ่านไลน์</h2>
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
                    <strong>คลิกปุ่ม "สร้างประกาศใหม่"</strong>
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
                <h2 className="chapter-title">การจัดการเนื้อหาหน้าเว็บไซต์หลัก</h2>
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
                      caption: "แผงควบคุมเนื้อหาหน้าเว็บไซต์หลัก",
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
                    <strong>เข้าสู่เมนู "เนื้อหาหน้าแรก"</strong>
                    <div style={{ color: "#475569", marginTop: "0.15rem" }}>
                      ระบบจะแสดงส่วนต่างๆ ของหน้าเว็บที่อนุญาตให้เจ้าหน้าที่หอพักปรับแต่งได้
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
                    <strong>กดปุ่ม "บันทึกการเปลี่ยนแปลง"</strong>
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
                <h2 className="chapter-title">คำถามที่พบบ่อยสำหรับการปฏิบัติงาน</h2>
                <p className="chapter-subtitle">
                  รวมคำถามและแนวทางแก้ไขปัญหาที่พบบ่อยในการปฏิบัติงานประจำวันของเจ้าหน้าที่หอพัก
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
                    <strong>คำตอบ:</strong> หากบิลดังกล่าวยังอยู่ในสถานะ "รอชำระ" เจ้าหน้าที่สามารถกดเข้าไปที่รายละเอียดบิลใบนั้น แล้วคลิก "แก้ไขมิเตอร์" เพื่อกรอกเลขที่ถูกต้องใหม่ได้ แต่หากผู้เช่าได้ทำการโอนเงินเข้ามาแล้ว ให้ติดต่อเจ้าของหอพัก เพื่อปรับยอดส่วนต่างในบิลรอบถัดไป
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
                    <strong>คำตอบ:</strong> ให้ไปที่เมนู "ผังห้องพัก" ค้นหาหมายเลขห้องที่ต้องการ แล้วคลิกเปลี่ยนสถานะจากการ์ดห้องพักจาก "ปรับปรุง" เป็น "ห้องว่าง" เมื่อเปลี่ยนสถานะแล้ว ห้องนั้นจะพร้อมทำสัญญาเช่าใหม่ได้ทันที
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
                  <span>การประสานงานความช่วยเหลือระดับสูง</span>
                </div>
                <div className="callout-tip-text">
                  หากพบปัญหาทางเทคนิคของระบบฐานข้อมูล หรือกรณีมีข้อพิพาทเรื่องการเงินกับผู้เช่าที่เจ้าหน้าที่ไม่สามารถตัดสินใจได้เอง
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
              <div className="manual-contact-title">สำนักงานหอพัก เดอะ สราญรมย์ เรสซิเดนซ์</div>
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
