"use client";

import React from "react";
import Link from "next/link";
import { useDormitory } from "@/lib/store/dormitory-context";
import {
  CreditCard,
  Receipt,
  DoorOpen,
  Wrench,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  Crown,
  Users,
  Building,
  ArrowRight,
  ShieldCheck,
  Percent,
} from "lucide-react";

export default function StaffDashboardPage() {
  const { isOwner, currentUser, rooms, bills, paymentSlips, repairRequests, users, roomTypes } =
    useDormitory();

  // Metrics
  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter((r) => r.status === "occupied").length;
  const availableRooms = rooms.filter((r) => r.status === "available").length;
  const maintenanceRooms = rooms.filter((r) => r.status === "maintenance").length;
  const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

  const pendingSlips = paymentSlips.filter((s) => s.status === "pending");
  const unpaidBills = bills.filter((b) => b.status === "unpaid");
  const paidBills = bills.filter((b) => b.status === "paid");

  // Financials
  const totalPaidRevenue = paidBills.reduce((acc, b) => acc + b.total_amount, 0);
  const totalUnpaidAmount = unpaidBills.reduce((acc, b) => acc + b.total_amount, 0);

  const activeRepairs = repairRequests.filter((r) => r.status !== "completed");

  return (
    <div>
      {/* Top Welcome Banner */}
      <div
        className="bento-card"
        style={{
          padding: "1.75rem 2rem",
          marginBottom: "2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1.25rem",
          width: "100%",
          boxSizing: "border-box",
          background: isOwner
            ? "linear-gradient(135deg, rgba(147, 51, 234, 0.05), rgba(79, 70, 229, 0.05))"
            : "linear-gradient(135deg, rgba(79, 70, 229, 0.05), rgba(14, 165, 233, 0.05))",
          border: "1px solid var(--border-color)",
        }}
      >
        <div style={{ flex: "1 1 320px", minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.35rem", flexWrap: "wrap" }}>
            <h1 style={{ fontSize: "1.55rem", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.3 }}>
              ยินดีต้อนรับ, {currentUser?.full_name}
            </h1>
            {isOwner ? (
              <span className="badge badge-owner">
                <Crown size={12} /> สิทธิ์เจ้าของหอพัก (Owner Dashboard)
              </span>
            ) : (
              <span className="badge badge-maintenance">
                <ShieldCheck size={12} /> นิติบุคคล (Staff Operations)
              </span>
            )}
          </div>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            {isOwner
              ? "ภาพรวมการดำเนินงาน การเงิน อัตราการเข้าพัก และการจัดการระบบหอพัก"
              : "ติดตามคิวงานประจำวัน: ตรวจสอบสลิป บิลค้างชำระ และสถานะงานแจ้งซ่อม"}
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <Link href="/staff/payments" className="btn btn-primary btn-sm">
            <CreditCard size={15} /> ตรวจสอบสลิปรออนุมัติ ({pendingSlips.length})
          </Link>
          <Link href="/staff/bills" className="btn btn-secondary btn-sm">
            <Receipt size={15} /> ออกบิลใหม่
          </Link>
        </div>
      </div>

      {/* Owner Specific Financial Highlights */}
      {isOwner && (
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
            <Crown size={18} style={{ color: "#7e22ce" }} />
            <h2 style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--text-primary)" }}>
              สรุปภาพรวมการเงินและผลประกอบการ (Owner Financial Highlights)
            </h2>
          </div>

          <div className="grid-responsive-4">
            <div className="bento-card" style={{ padding: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <span style={{ color: "var(--text-secondary)", fontSize: "0.82rem", fontWeight: 600 }}>
                  รายรับรวมที่ชำระแล้ว
                </span>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#065f46", display: "inline-block" }} />
              </div>
              <div className="tabular-nums" style={{ fontSize: "1.8rem", fontWeight: 800, color: "#065f46" }}>
                ฿{totalPaidRevenue.toLocaleString()}
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.4rem" }}>
                จาก {paidBills.length} บิลที่ตรวจสอบผ่านแล้ว
              </div>
            </div>

            <div className="bento-card" style={{ padding: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <span style={{ color: "var(--text-secondary)", fontSize: "0.82rem", fontWeight: 600 }}>
                  ยอดค้างชำระรวม
                </span>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#dc2626", display: "inline-block" }} />
              </div>
              <div className="tabular-nums" style={{ fontSize: "1.8rem", fontWeight: 800, color: "#dc2626" }}>
                ฿{totalUnpaidAmount.toLocaleString()}
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.4rem" }}>
                จาก {unpaidBills.length} บิลที่ยังไม่ชำระ
              </div>
            </div>

            <div className="bento-card" style={{ padding: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <span style={{ color: "var(--text-secondary)", fontSize: "0.82rem", fontWeight: 600 }}>
                  อัตราการเช่าห้องพัก
                </span>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#2563eb", display: "inline-block" }} />
              </div>
              <div className="tabular-nums" style={{ fontSize: "1.8rem", fontWeight: 800, color: "#2563eb" }}>
                {occupancyRate}%
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.4rem" }}>
                เช่าแล้ว {occupiedRooms} จากทั้งหมด {totalRooms} ห้อง
              </div>
            </div>

            <div className="bento-card" style={{ padding: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <span style={{ color: "var(--text-secondary)", fontSize: "0.82rem", fontWeight: 600 }}>
                  ประเภทห้องพัก
                </span>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#4f46e5", display: "inline-block" }} />
              </div>
              <div className="tabular-nums" style={{ fontSize: "1.8rem", fontWeight: 800, color: "#4f46e5" }}>
                {roomTypes.length} ประเภท
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.4rem" }}>
                <Link href="/staff/owner/room-types" style={{ color: "#4f46e5", textDecoration: "underline", fontWeight: 500 }}>
                  แก้ไขราคา/หน่วยน้ำไฟ →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Operational Metrics */}
      <div className="grid-responsive-4" style={{ marginBottom: "2rem" }}>
        {/* Pending Slips Queue */}
        <Link href="/staff/payments" className="glass-card-interactive" style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.8rem" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 600 }}>
              สลิปที่รอตรวจสอบ
            </span>
            <div style={{ width: 34, height: 34, borderRadius: "8px", background: "rgba(234, 88, 12, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#c2410c" }}>
              <CreditCard size={18} />
            </div>
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: pendingSlips.length > 0 ? "#c2410c" : "var(--text-primary)" }}>
            {pendingSlips.length} รายการ
          </div>
          <div style={{ fontSize: "0.78rem", color: pendingSlips.length > 0 ? "#c2410c" : "var(--text-muted)", marginTop: "0.4rem", fontWeight: 500, display: "flex", alignItems: "center", gap: "0.3rem" }}>
            {pendingSlips.length > 0 ? (
              <>
                <AlertCircle size={13} />
                <span>ต้องตรวจสอบและอนุมัติ</span>
              </>
            ) : (
              <span>ไม่มีสลิปค้าง</span>
            )}
          </div>
        </Link>

        {/* Unpaid Bills */}
        <Link href="/staff/bills" className="glass-card-interactive" style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.8rem" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 600 }}>
              บิลที่ยังไม่ชำระ
            </span>
            <div style={{ width: 34, height: 34, borderRadius: "8px", background: "rgba(220, 38, 38, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#dc2626" }}>
              <Receipt size={18} />
            </div>
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: unpaidBills.length > 0 ? "#dc2626" : "var(--text-primary)" }}>
            {unpaidBills.length} บิล
          </div>
          <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "0.4rem" }}>
            รวม ฿{totalUnpaidAmount.toLocaleString()}
          </div>
        </Link>

        {/* Active Repairs */}
        <Link href="/staff/repairs" className="glass-card-interactive" style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.8rem" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 600 }}>
              งานแจ้งซ่อมที่ค้างอยู่
            </span>
            <div style={{ width: 34, height: 34, borderRadius: "8px", background: "rgba(37, 99, 235, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#2563eb" }}>
              <Wrench size={18} />
            </div>
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-primary)" }}>
            {activeRepairs.length} รายการ
          </div>
          <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "0.4rem" }}>
            รอรับเรื่อง {repairRequests.filter((r) => r.status === "pending").length} รายการ
          </div>
        </Link>

        {/* Available Rooms */}
        <Link href="/staff/rooms" className="glass-card-interactive" style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.8rem" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 600 }}>
              ห้องพักว่างปัจจุบัน
            </span>
            <div style={{ width: 34, height: 34, borderRadius: "8px", background: "rgba(5, 150, 105, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#059669" }}>
              <DoorOpen size={18} />
            </div>
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "#059669" }}>
            {availableRooms} ห้อง
          </div>
          <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "0.4rem" }}>
            จาก {totalRooms} ห้องทั้งหมด
          </div>
        </Link>
      </div>

      {/* Two Column Layout: Pending Slips Review & Room Quick Status */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "1.5rem" }}>
        {/* Pending Slips Widget */}
        <div className="bento-card" style={{ padding: "1.75rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <CreditCard size={18} style={{ color: "#4f46e5" }} />
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)" }}>
                คิวตรวจสอบสลิปโอนเงินล่าสุด
              </h3>
            </div>
            <Link href="/staff/payments" style={{ color: "#4f46e5", fontSize: "0.85rem", fontWeight: 600 }}>
              ดูทั้งหมด →
            </Link>
          </div>

          {pendingSlips.length === 0 ? (
            <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-secondary)" }}>
              <CheckCircle2 size={36} style={{ color: "#059669", marginBottom: "0.5rem" }} />
              <p>ไม่มีสลิปที่รอการตรวจสอบในขณะนี้</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              {pendingSlips.map((slip) => {
                const b = bills.find((item) => item.id === slip.bill_id);
                const rm = rooms.find((item) => item.id === b?.room_id);
                return (
                  <div
                    key={slip.id}
                    style={{
                      background: "#f8fafc",
                      padding: "1rem",
                      borderRadius: "10px",
                      border: "1px solid var(--border-color)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <div style={{ width: 44, height: 44, borderRadius: "6px", overflow: "hidden", background: "#e2e8f0" }}>
                        <img src={slip.slip_image_url} alt="สลิป" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                      <div>
                        <strong style={{ color: "var(--text-primary)", fontSize: "0.95rem" }}>
                          ห้อง {rm?.room_number} (งวด {b?.month}/{b?.year})
                        </strong>
                        <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>
                          ยอดโอน: <span style={{ color: "#4f46e5", fontWeight: 700 }}>฿{slip.transfer_amount.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <Link href="/staff/payments" className="btn btn-primary btn-sm">
                      ตรวจสลิป
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Room Status Summary Grid */}
        <div className="bento-card" style={{ padding: "1.75rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <DoorOpen size={18} style={{ color: "#4f46e5" }} />
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)" }}>
                สรุปสถานะห้องพักประจำอาคาร
              </h3>
            </div>
            <Link href="/staff/rooms" style={{ color: "#4f46e5", fontSize: "0.85rem", fontWeight: 600 }}>
              จัดการผังห้อง →
            </Link>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: "0.75rem" }}>
            {rooms.map((r) => (
              <div
                key={r.id}
                style={{
                  padding: "0.75rem 0.5rem",
                  borderRadius: "8px",
                  textAlign: "center",
                  background:
                    r.status === "available"
                      ? "rgba(5, 150, 105, 0.05)"
                      : r.status === "occupied"
                      ? "rgba(37, 99, 235, 0.04)"
                      : "rgba(234, 88, 12, 0.05)",
                  border: `1px solid ${
                    r.status === "available"
                      ? "rgba(5, 150, 105, 0.2)"
                      : r.status === "occupied"
                      ? "rgba(15, 23, 42, 0.08)"
                      : "rgba(234, 88, 12, 0.2)"
                  }`,
                }}
              >
                <div style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-primary)" }}>
                  {r.room_number}
                </div>
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                  ชั้น {r.floor}
                </div>
                <div style={{ marginTop: "0.3rem" }}>
                  <span
                    className={`badge ${
                      r.status === "available"
                        ? "badge-available"
                        : r.status === "occupied"
                        ? "badge-occupied"
                        : "badge-maintenance"
                    }`}
                    style={{ fontSize: "0.68rem", padding: "0.1rem 0.4rem" }}
                  >
                    {r.status === "available"
                      ? "ว่าง"
                      : r.status === "occupied"
                      ? "มีผู้เช่า"
                      : "ปรับปรุง"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
