"use client";

import React from "react";
import { useDormitory } from "@/lib/store/dormitory-context";
import {
  TrendingUp,
  Receipt,
  Users,
  CreditCard,
  Crown,
  Percent,
  Lock,
  ArrowUpRight,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export default function OwnerAnalyticsPage() {
  const { isOwner, rooms, bills, paymentSlips } = useDormitory();

  if (!isOwner) {
    return (
      <div className="bento-card" style={{ padding: "3rem", textAlign: "center", background: "#ffffff" }}>
        <Lock size={48} style={{ color: "#dc2626", marginBottom: "1rem" }} />
        <h2 style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.5rem" }}>
          สงวนสิทธิ์เฉพาะเจ้าของหอพัก (Owner Only)
        </h2>
        <p style={{ color: "var(--text-secondary)" }}>
          คุณไม่มีสิทธิ์เข้าถึงหน้านี้ กรุณาเข้าสู่ระบบด้วยบัญชีเจ้าของหอพัก (Owner)
        </p>
      </div>
    );
  }

  // Calculations
  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter((r) => r.status === "occupied").length;
  const availableRooms = rooms.filter((r) => r.status === "available").length;
  const maintenanceRooms = rooms.filter((r) => r.status === "maintenance").length;
  const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

  const paidBills = bills.filter((b) => b.status === "paid");
  const unpaidBills = bills.filter((b) => b.status === "unpaid");
  const pendingBills = bills.filter((b) => b.status === "pending_verification");

  const totalPaidRevenue = paidBills.reduce((acc, b) => acc + b.total_amount, 0);
  const totalUnpaidArrears = unpaidBills.reduce((acc, b) => acc + b.total_amount, 0);
  const totalPendingVerification = pendingBills.reduce((acc, b) => acc + b.total_amount, 0);

  // Revenue Breakdown
  const roomRentRevenue = paidBills.reduce((acc, b) => acc + b.room_fee, 0);
  const waterRevenue = paidBills.reduce((acc, b) => acc + b.water_fee, 0);
  const electricRevenue = paidBills.reduce((acc, b) => acc + b.electric_fee, 0);
  const otherFeesRevenue = paidBills.reduce((acc, b) => acc + b.other_fees, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.2rem" }}>
            <h1 style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--text-primary)" }}>
              รายงานผลประกอบการและการเงิน (Financial Analytics)
            </h1>
            <span className="badge badge-owner">
              <Crown size={12} /> สิทธิ์เจ้าของหอพัก
            </span>
          </div>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            สรุปรายรับรวม บิลค้างชำระ อัตราการเช่าห้องพัก และโครงสร้างรายได้
          </p>
        </div>
      </div>

      {/* 4 Financial Stat Cards */}
      <div className="grid-responsive-4">
        <div className="bento-card" style={{ padding: "1.5rem", background: "#ffffff" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
            <span style={{ color: "var(--text-secondary)", fontSize: "0.85rem", fontWeight: 600 }}>
              รายรับจริงที่ได้รับแล้ว
            </span>
            <div style={{ width: 34, height: 34, borderRadius: "8px", background: "rgba(5, 150, 105, 0.1)", color: "#065f46", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <TrendingUp size={18} />
            </div>
          </div>
          <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#065f46" }}>
            ฿{totalPaidRevenue.toLocaleString()}
          </div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.3rem" }}>
            ชำระแล้ว {paidBills.length} บิล
          </div>
        </div>

        <div className="bento-card" style={{ padding: "1.5rem", background: "#ffffff" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
            <span style={{ color: "var(--text-secondary)", fontSize: "0.85rem", fontWeight: 600 }}>
              ยอดค้างชำระ (หนี้ค้าง)
            </span>
            <div style={{ width: 34, height: 34, borderRadius: "8px", background: "rgba(220, 38, 38, 0.1)", color: "#dc2626", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <AlertCircle size={18} />
            </div>
          </div>
          <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#dc2626" }}>
            ฿{totalUnpaidArrears.toLocaleString()}
          </div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.3rem" }}>
            ค้างชำระ {unpaidBills.length} บิล
          </div>
        </div>

        <div className="bento-card" style={{ padding: "1.5rem", background: "#ffffff" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
            <span style={{ color: "var(--text-secondary)", fontSize: "0.85rem", fontWeight: 600 }}>
              รอตรวจสลิปโอนเงิน
            </span>
            <div style={{ width: 34, height: 34, borderRadius: "8px", background: "rgba(217, 119, 6, 0.1)", color: "#d97706", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Receipt size={18} />
            </div>
          </div>
          <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#d97706" }}>
            ฿{totalPendingVerification.toLocaleString()}
          </div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.3rem" }}>
            รอตรวจ {pendingBills.length} รายการ
          </div>
        </div>

        <div className="bento-card" style={{ padding: "1.5rem", background: "#ffffff" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
            <span style={{ color: "var(--text-secondary)", fontSize: "0.85rem", fontWeight: 600 }}>
              อัตราการเข้าพัก (Occupancy)
            </span>
            <div style={{ width: 34, height: 34, borderRadius: "8px", background: "rgba(79, 70, 229, 0.1)", color: "#4f46e5", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Percent size={18} />
            </div>
          </div>
          <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#4f46e5" }}>
            {occupancyRate}%
          </div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.3rem" }}>
            มีผู้เช่า {occupiedRooms} / {totalRooms} ห้อง
          </div>
        </div>
      </div>

      {/* Breakdown Charts & Tables */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "1.5rem" }}>
        {/* Revenue Source Breakdown */}
        <div className="bento-card" style={{ padding: "1.75rem", background: "#ffffff" }}>
          <h2 style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "1.25rem" }}>
            โครงสร้างรายรับแยกตามประเภท
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.15rem" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", marginBottom: "0.35rem" }}>
                <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>ค่าเช่าห้องพัก</span>
                <strong style={{ color: "var(--text-primary)" }}>฿{roomRentRevenue.toLocaleString()}</strong>
              </div>
              <div style={{ width: "100%", height: 8, background: "#f1f5f9", borderRadius: "4px", overflow: "hidden" }}>
                <div style={{ width: `${totalPaidRevenue > 0 ? (roomRentRevenue / totalPaidRevenue) * 100 : 0}%`, height: "100%", background: "#4f46e5" }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", marginBottom: "0.35rem" }}>
                <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>ค่าไฟฟ้า</span>
                <strong style={{ color: "var(--text-primary)" }}>฿{electricRevenue.toLocaleString()}</strong>
              </div>
              <div style={{ width: "100%", height: 8, background: "#f1f5f9", borderRadius: "4px", overflow: "hidden" }}>
                <div style={{ width: `${totalPaidRevenue > 0 ? (electricRevenue / totalPaidRevenue) * 100 : 0}%`, height: "100%", background: "#ea580c" }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", marginBottom: "0.35rem" }}>
                <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>ค่าน้ำประปา</span>
                <strong style={{ color: "var(--text-primary)" }}>฿{waterRevenue.toLocaleString()}</strong>
              </div>
              <div style={{ width: "100%", height: 8, background: "#f1f5f9", borderRadius: "4px", overflow: "hidden" }}>
                <div style={{ width: `${totalPaidRevenue > 0 ? (waterRevenue / totalPaidRevenue) * 100 : 0}%`, height: "100%", background: "#2563eb" }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", marginBottom: "0.35rem" }}>
                <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>ค่าส่วนกลางและขยะ</span>
                <strong style={{ color: "var(--text-primary)" }}>฿{otherFeesRevenue.toLocaleString()}</strong>
              </div>
              <div style={{ width: "100%", height: 8, background: "#f1f5f9", borderRadius: "4px", overflow: "hidden" }}>
                <div style={{ width: `${totalPaidRevenue > 0 ? (otherFeesRevenue / totalPaidRevenue) * 100 : 0}%`, height: "100%", background: "#065f46" }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Occupancy Status Matrix */}
        <div className="bento-card" style={{ padding: "1.75rem", background: "#ffffff" }}>
          <h2 style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "1.25rem" }}>
            สัดส่วนสถานะห้องพัก
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.85rem 1rem", borderRadius: "8px", background: "rgba(37, 99, 235, 0.08)", border: "1px solid rgba(37, 99, 235, 0.2)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <span className="badge-dot" style={{ background: "#2563eb" }}></span>
                <span style={{ color: "var(--text-primary)", fontSize: "0.92rem", fontWeight: 600 }}>ห้องที่มีผู้เช่า (Occupied)</span>
              </div>
              <strong style={{ color: "#1e40af", fontSize: "1.2rem" }}>{occupiedRooms} ห้อง</strong>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.85rem 1rem", borderRadius: "8px", background: "rgba(5, 150, 105, 0.08)", border: "1px solid rgba(5, 150, 105, 0.2)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <span className="badge-dot" style={{ background: "#065f46" }}></span>
                <span style={{ color: "var(--text-primary)", fontSize: "0.92rem", fontWeight: 600 }}>ห้องว่างพร้อมเช่า (Available)</span>
              </div>
              <strong style={{ color: "#065f46", fontSize: "1.2rem" }}>{availableRooms} ห้อง</strong>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.85rem 1rem", borderRadius: "8px", background: "rgba(217, 119, 6, 0.08)", border: "1px solid rgba(217, 119, 6, 0.2)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <span className="badge-dot" style={{ background: "#d97706" }}></span>
                <span style={{ color: "var(--text-primary)", fontSize: "0.92rem", fontWeight: 600 }}>ปิดปรับปรุง / ซ่อมแซม (Maintenance)</span>
              </div>
              <strong style={{ color: "#b45309", fontSize: "1.2rem" }}>{maintenanceRooms} ห้อง</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
