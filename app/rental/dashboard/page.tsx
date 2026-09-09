"use client";

import React from "react";
import Link from "next/link";
import { useDormitory } from "@/lib/store/dormitory-context";
import {
  ReceiptText,
  Wrench,
  QrCode,
  CheckCircle2,
  AlertCircle,
  Phone,
  Droplets,
  Zap,
  Building2,
  Clock,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

export default function RentalDashboardPage() {
  const {
    currentRentalProfile,
    rooms,
    roomTypes,
    bills,
    repairRequests,
    announcements,
  } = useDormitory();

  const userRoom = rooms.find((r) => r.id === currentRentalProfile?.room_id);
  const roomType = roomTypes.find((rt) => rt.id === userRoom?.room_type_id);

  // User's bills
  const userBills = bills.filter((b) => b.rental_profile_id === currentRentalProfile?.id);
  const latestBill = userBills[0];

  // User's repair requests
  const userRepairs = repairRequests.filter(
    (r) => r.rental_profile_id === currentRentalProfile?.id
  );
  const pendingRepairsCount = userRepairs.filter((r) => r.status !== "completed").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* 1. Hero Bill Status Card (High Priority for Tenants) */}
      {latestBill && (
        <div
          className="bento-card hover-card-lift"
          style={{
            padding: "1.75rem 2rem",
            borderRadius: "var(--radius-lg)",
            background:
              latestBill.status === "unpaid"
                ? "linear-gradient(135deg, rgba(220, 38, 38, 0.05), rgba(220, 38, 38, 0.01))"
                : latestBill.status === "pending_verification"
                ? "linear-gradient(135deg, rgba(217, 119, 6, 0.05), rgba(217, 119, 6, 0.01))"
                : "linear-gradient(135deg, rgba(5, 150, 105, 0.05), rgba(5, 150, 105, 0.01))",
            border:
              latestBill.status === "unpaid"
                ? "1.5px solid rgba(220, 38, 38, 0.28)"
                : latestBill.status === "pending_verification"
                ? "1.5px solid rgba(217, 119, 6, 0.28)"
                : "1.5px solid rgba(5, 150, 105, 0.28)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1.25rem",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
                {latestBill.status === "unpaid" && (
                  <span
                    style={{
                      background: "rgba(220, 38, 38, 0.1)",
                      border: "1px solid rgba(220, 38, 38, 0.3)",
                      color: "#dc2626",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      padding: "0.25rem 0.65rem",
                      borderRadius: "6px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.35rem",
                    }}
                  >
                    <AlertCircle size={14} />
                    <span>รอการชำระเงิน</span>
                  </span>
                )}
                {latestBill.status === "pending_verification" && (
                  <span
                    style={{
                      background: "rgba(217, 119, 6, 0.1)",
                      border: "1px solid rgba(217, 119, 6, 0.3)",
                      color: "#d97706",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      padding: "0.25rem 0.65rem",
                      borderRadius: "6px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.35rem",
                    }}
                  >
                    <Clock size={14} />
                    <span>แนบสลิปแล้ว • รอเจ้าหน้าที่ตรวจสอบ</span>
                  </span>
                )}
                {latestBill.status === "paid" && (
                  <span
                    style={{
                      background: "rgba(5, 150, 105, 0.1)",
                      border: "1px solid rgba(5, 150, 105, 0.3)",
                      color: "#065f46",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      padding: "0.25rem 0.65rem",
                      borderRadius: "6px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.35rem",
                    }}
                  >
                    <CheckCircle2 size={14} />
                    <span>ชำระเงินเรียบร้อยแล้ว</span>
                  </span>
                )}
                <span style={{ color: "var(--text-secondary)", fontSize: "0.88rem", fontWeight: 500 }}>
                  บิลประจำเดือน {latestBill.month}/{latestBill.year}
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem", flexWrap: "wrap" }}>
                <span style={{ fontSize: "1.05rem", color: "var(--text-secondary)", fontWeight: 600 }}>
                  ยอดเงินสุทธิ:
                </span>
                <span
                  className="tabular-nums"
                  style={{
                    fontSize: "2.3rem",
                    fontWeight: 800,
                    color: latestBill.status === "unpaid" ? "#dc2626" : "#065f46",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.1,
                  }}
                >
                  ฿{latestBill.total_amount.toLocaleString()}
                </span>
              </div>
              <p style={{ color: "var(--text-muted)", fontSize: "0.84rem", marginTop: "0.3rem", margin: 0 }}>
                กำหนดชำระภายในวันที่ {latestBill.due_date}
              </p>
            </div>

            <div>
              {latestBill.status === "unpaid" ? (
                <Link
                  href="/rental/bills"
                  className="btn btn-primary"
                  style={{
                    padding: "0.75rem 1.4rem",
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    background: "#0f172a",
                    minHeight: "46px",
                    boxShadow: "0 4px 14px rgba(15, 23, 42, 0.2)",
                    borderRadius: "10px",
                  }}
                >
                  <QrCode size={18} />
                  <span>สแกน QR จ่ายเงิน & แนบสลิป</span>
                </Link>
              ) : (
                <Link
                  href="/rental/bills"
                  className="btn btn-secondary"
                  style={{
                    padding: "0.65rem 1.25rem",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    minHeight: "44px",
                    borderRadius: "10px",
                  }}
                >
                  <ReceiptText size={16} />
                  <span>ดูรายละเอียดบิล & ใบเสร็จ</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. Fast 2-Column Action Cards: Repairs & Office Contact */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
        {/* Repair Action Card */}
        <div className="bento-card hover-card-lift" style={{ padding: "1.5rem", background: "#ffffff" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "10px",
                  background: "rgba(79, 70, 229, 0.08)",
                  border: "1px solid rgba(79, 70, 229, 0.15)",
                  color: "#4f46e5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Wrench size={18} />
              </div>
              <h2 style={{ fontSize: "1.08rem", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
                แจ้งซ่อมห้องพัก
              </h2>
            </div>
            {pendingRepairsCount > 0 ? (
              <span
                style={{
                  background: "rgba(217, 119, 6, 0.08)",
                  border: "1px solid rgba(217, 119, 6, 0.25)",
                  color: "#d97706",
                  fontSize: "0.74rem",
                  padding: "0.15rem 0.55rem",
                  borderRadius: "9999px",
                  fontWeight: 700,
                }}
              >
                ค้างซ่อม {pendingRepairsCount} รายการ
              </span>
            ) : (
              <span
                style={{
                  background: "rgba(5, 150, 105, 0.08)",
                  border: "1px solid rgba(5, 150, 105, 0.25)",
                  color: "#065f46",
                  fontSize: "0.74rem",
                  padding: "0.15rem 0.55rem",
                  borderRadius: "9999px",
                  fontWeight: 700,
                }}
              >
                ปกติ ไม่มีงานค้าง
              </span>
            )}
          </div>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.86rem", lineHeight: 1.5, marginBottom: "1.25rem" }}>
            แอร์ไม่เย็น ไฟดับ ท่อน้ำรั่ว ส่งคำร้องให้ทีมช่างประจำหอเข้าตรวจสอบได้ทันที
          </p>
          <Link
            href="/rental/repairs"
            className="btn btn-secondary"
            style={{ width: "100%", justifyContent: "center", minHeight: "42px", fontWeight: 600, borderRadius: "8px", fontSize: "0.88rem" }}
          >
            <span>กดแจ้งซ่อมที่นี่</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        {/* Office Call Action Card */}
        <div className="bento-card hover-card-lift" style={{ padding: "1.5rem", background: "#ffffff" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.75rem" }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: "10px",
                background: "rgba(5, 150, 105, 0.08)",
                border: "1px solid rgba(5, 150, 105, 0.2)",
                color: "#065f46",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Phone size={18} />
            </div>
            <h2 style={{ fontSize: "1.08rem", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
              ติดต่อสำนักงานนิติบุคคล
            </h2>
          </div>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.86rem", lineHeight: 1.5, marginBottom: "1.25rem" }}>
            เปิดบริการทุกวัน 08:30 - 18:00 น. (กรณีฉุกเฉินน้ำรั่วไฟช็อตโทรติดต่อได้ 24 ชม.)
          </p>
          <a
            href="tel:0819998888"
            className="btn btn-primary"
            style={{
              width: "100%",
              justifyContent: "center",
              minHeight: "42px",
              fontWeight: 600,
              background: "#0f172a",
              borderRadius: "8px",
              fontSize: "0.88rem",
            }}
          >
            <Phone size={15} />
            <span>โทร 081-999-8888</span>
          </a>
        </div>
      </div>

      {/* 3. Detailed Meter & Charges Summary Bento Card */}
      {latestBill && (
        <div className="bento-card" style={{ padding: "1.5rem 1.75rem", background: "#ffffff" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.5rem" }}>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
              รายละเอียดค่าใช้จ่ายงวดนี้ (เดือน {latestBill.month}/{latestBill.year})
            </h2>
            <Link
              href="/rental/bills"
              style={{
                color: "#4f46e5",
                fontSize: "0.86rem",
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: "0.25rem",
              }}
            >
              <span>ดูประวัติบิลทั้งหมด</span>
              <ChevronRight size={15} />
            </Link>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: "0.85rem",
              marginBottom: "1.25rem",
            }}
          >
            <div style={{ background: "#f8fafc", padding: "0.95rem", borderRadius: "10px", border: "1px solid var(--border-color)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#2563eb", fontSize: "0.84rem", fontWeight: 600, marginBottom: "0.25rem" }}>
                <Droplets size={15} />
                <span>ค่าน้ำประปา</span>
              </div>
              <div className="tabular-nums" style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--text-primary)" }}>
                ฿{latestBill.water_fee.toLocaleString()}
              </div>
              <div style={{ fontSize: "0.76rem", color: "var(--text-muted)", marginTop: "0.15rem" }}>
                ใช้น้ำ {latestBill.water_units} หน่วย
              </div>
            </div>

            <div style={{ background: "#f8fafc", padding: "0.95rem", borderRadius: "10px", border: "1px solid var(--border-color)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#d97706", fontSize: "0.84rem", fontWeight: 600, marginBottom: "0.25rem" }}>
                <Zap size={15} />
                <span>ค่าไฟฟ้า</span>
              </div>
              <div className="tabular-nums" style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--text-primary)" }}>
                ฿{latestBill.electric_fee.toLocaleString()}
              </div>
              <div style={{ fontSize: "0.76rem", color: "var(--text-muted)", marginTop: "0.15rem" }}>
                ใช้ไฟ {latestBill.electric_units} หน่วย
              </div>
            </div>

            <div style={{ background: "#f8fafc", padding: "0.95rem", borderRadius: "10px", border: "1px solid var(--border-color)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#4f46e5", fontSize: "0.84rem", fontWeight: 600, marginBottom: "0.25rem" }}>
                <Building2 size={15} />
                <span>ค่าห้องพัก</span>
              </div>
              <div className="tabular-nums" style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--text-primary)" }}>
                ฿{latestBill.room_fee.toLocaleString()}
              </div>
              <div style={{ fontSize: "0.76rem", color: "var(--text-muted)", marginTop: "0.15rem" }}>
                {roomType?.name || "ห้องพักมาตรฐาน"}
              </div>
            </div>

            <div style={{ background: "#f8fafc", padding: "0.95rem", borderRadius: "10px", border: "1px solid var(--border-color)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#64748b", fontSize: "0.84rem", fontWeight: 600, marginBottom: "0.25rem" }}>
                <ShieldCheck size={15} />
                <span>ค่าส่วนกลาง</span>
              </div>
              <div className="tabular-nums" style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--text-primary)" }}>
                ฿{latestBill.other_fees.toLocaleString()}
              </div>
              <div style={{ fontSize: "0.76rem", color: "var(--text-muted)", marginTop: "0.15rem" }}>
                ค่าบริการรายเดือน
              </div>
            </div>
          </div>

          <div
            style={{
              borderTop: "1px solid var(--border-color)",
              paddingTop: "0.9rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-primary)" }}>
              รวมยอดที่ต้องชำระทั้งสิ้น:
            </span>
            <span className="tabular-nums" style={{ fontSize: "1.45rem", fontWeight: 800, color: "#4f46e5" }}>
              ฿{latestBill.total_amount.toLocaleString()}
            </span>
          </div>
        </div>
      )}

      {/* 4. Latest Dorm Announcement Bento Card */}
      {announcements.length > 0 && (
        <div className="bento-card" style={{ padding: "1.5rem", background: "#ffffff" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem", flexWrap: "wrap", gap: "0.5rem" }}>
            <h2 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
              ประกาศล่าสุดจากนิติบุคคล
            </h2>
            <Link
              href="/rental/announcements"
              style={{
                color: "#4f46e5",
                fontSize: "0.85rem",
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: "0.25rem",
              }}
            >
              <span>ดูประกาศทั้งหมด</span>
              <ChevronRight size={15} />
            </Link>
          </div>
          <div style={{ background: "#f8fafc", padding: "1rem", borderRadius: "10px", border: "1px solid var(--border-color)" }}>
            <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.3rem" }}>
              {announcements[0].title}
            </div>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", lineHeight: 1.5, margin: 0 }}>
              {announcements[0].content}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
