"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDormitory } from "@/lib/store/dormitory-context";
import {
  LayoutDashboard,
  CreditCard,
  Receipt,
  DoorOpen,
  Wrench,
  Bell,
  Globe,
  Users,
  UserPlus,
  Layers,
  BarChart3,
  Crown,
  ShieldCheck,
  AlertCircle,
  Clock,
  LogOut,
  Lock,
} from "lucide-react";

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, currentStaffProfile, isOwner, paymentSlips, repairRequests, bills, logout, isLoading, users, switchUser } =
    useDormitory();

  const pendingSlipsCount = paymentSlips.filter((s) => s.status === "pending").length;
  const pendingRepairsCount = repairRequests.filter((r) => r.status === "pending").length;
  const unpaidBillsCount = bills.filter((b) => b.status === "unpaid").length;

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  // 1. Loading State: Wait for data before evaluating auth
  if (isLoading) {
    return (
      <div className="container" style={{ padding: "5rem 1.5rem", minHeight: "70vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            border: "3.5px solid rgba(79, 70, 229, 0.15)",
            borderTopColor: "#4f46e5",
            animation: "staffLayoutSpin 0.75s linear infinite",
          }}
        />
        <style dangerouslySetInnerHTML={{ __html: `@keyframes staffLayoutSpin { to { transform: rotate(360deg); } }` }} />
        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", fontWeight: 500 }}>
          กำลังตรวจสอบสิทธิ์การเข้าใช้งานระบบนิติบุคคล...
        </p>
      </div>
    );
  }

  // 2. Not Logged In State
  if (!currentUser) {
    return (
      <div className="container" style={{ padding: "4rem 1.5rem", minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="glass-card" style={{ padding: "3rem", textAlign: "center", maxWidth: 500 }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(244, 63, 94, 0.15)", color: "#fb7185", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem" }}>
            <Lock size={28} />
          </div>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.5rem" }}>
            พื้นที่สำหรับเจ้าหน้าที่นิติบุคคลและเจ้าของหอพัก
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", lineHeight: 1.6, marginBottom: "1.75rem" }}>
            กรุณาเข้าสู่ระบบด้วยบัญชีนิติบุคคลหรือเจ้าของหอพักเพื่อเข้าถึงส่วนการจัดการนี้
          </p>
          <Link href="/login" className="btn btn-primary" style={{ width: "100%", height: "46px", justifyContent: "center" }}>
            ไปที่หน้าเข้าสู่ระบบ
          </Link>
        </div>
      </div>
    );
  }

  // 3. Logged in as Tenant (Role Mismatch)
  if (currentUser.role !== "staff") {
    return (
      <div className="container" style={{ padding: "4rem 1.5rem", minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="glass-card" style={{ padding: "2.5rem 2rem", textAlign: "center", maxWidth: 480 }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(79, 70, 229, 0.12)", color: "#4f46e5", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem" }}>
            <ShieldCheck size={28} />
          </div>
          <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "0.5rem" }}>
            คุณกำลังเข้าสู่ระบบในฐานะผู้เช่าห้องพัก
          </h2>
          <div
            style={{
              background: "#f8fafc",
              border: "1px solid var(--border-color)",
              borderRadius: "10px",
              padding: "0.85rem 1rem",
              marginBottom: "1.25rem",
              fontSize: "0.88rem",
              color: "var(--text-secondary)",
              textAlign: "left",
            }}
          >
            <div>ผู้ใช้งานปัจจุบัน: <strong style={{ color: "var(--text-primary)" }}>{currentUser.full_name}</strong></div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
              อีเมล: {currentUser.email} • สิทธิ์: ผู้เช่าห้องพัก
            </div>
          </div>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.5, marginBottom: "1.5rem" }}>
            หน้านี้สงวนไว้สำหรับ <strong>เจ้าหน้าที่นิติบุคคลและเจ้าของหอพัก</strong> เท่านั้น
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <Link href="/rental/dashboard" className="btn btn-primary" style={{ width: "100%", height: "46px", justifyContent: "center" }}>
              ไปยังหน้าแดชบอร์ดผู้เช่า
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="btn btn-secondary"
              style={{ width: "100%", height: "44px", justifyContent: "center" }}
            >
              ออกจากระบบ เพื่อเข้าสู่ระบบเจ้าหน้าที่
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="staff-layout">
      {/* Sidebar */}
      <aside className="staff-sidebar">
        {/* Brand Header with Official Logo */}
        <div className="sidebar-brand">
          <img
            src="/logo-icon.png"
            alt="The Saranrom Logo"
            width={34}
            height={34}
            style={{ width: 34, height: 34, maxWidth: 34, maxHeight: 34, objectFit: "contain", borderRadius: 6, flexShrink: 0 }}
          />
          <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
            <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.01em", lineHeight: 1.2, whiteSpace: "nowrap" }}>
              THE SARANROM
            </span>
            <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", fontWeight: 500 }}>
              ระบบจัดการหอพัก
            </span>
          </div>
        </div>

        {/* User Card (Desktop Only) */}
        <div
          className="sidebar-user-card"
          style={{
            padding: "0.85rem",
            borderRadius: "12px",
            background: isOwner ? "rgba(147, 51, 234, 0.06)" : "#f8fafc",
            border: `1px solid ${isOwner ? "rgba(147, 51, 234, 0.2)" : "var(--border-color)"}`,
            marginBottom: "1rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "9px",
                background: isOwner ? "linear-gradient(135deg, #7e22ce, #9333ea)" : "linear-gradient(135deg, #4f46e5, #4338ca)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {isOwner ? <Crown size={18} /> : <ShieldCheck size={18} />}
            </div>
            <div style={{ overflow: "hidden", flex: 1 }}>
              <div style={{ fontSize: "0.86rem", fontWeight: 700, color: "var(--text-primary)", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>
                {currentUser?.full_name || "เจ้าหน้าที่"}
              </div>
              <span
                className={`badge ${isOwner ? "badge-owner" : "badge-maintenance"}`}
                style={{ fontSize: "0.68rem", padding: "0.1rem 0.4rem", marginTop: "0.15rem", display: "inline-flex" }}
              >
                {isOwner ? "Owner" : "Staff"}
              </span>
            </div>
          </div>
        </div>

        {/* Section: งานปฏิบัติการทั่วไป (Staff & Owner) */}
        <div className="sidebar-section-label">
          งานปฏิบัติการนิติบุคคล
        </div>

        <Link
          href="/staff/dashboard"
          className={`staff-sidebar-link ${pathname === "/staff/dashboard" ? "active" : ""}`}
        >
          <LayoutDashboard size={17} /> ภาพรวมแดชบอร์ด
        </Link>

        <Link
          href="/staff/payments"
          className={`staff-sidebar-link ${pathname === "/staff/payments" ? "active" : ""}`}
        >
          <CreditCard size={17} /> ตรวจสอบสลิปโอน
          {pendingSlipsCount > 0 && (
            <span className="badge badge-urgent" style={{ marginLeft: "auto", fontSize: "0.68rem", padding: "0.1rem 0.4rem" }}>
              {pendingSlipsCount}
            </span>
          )}
        </Link>

        <Link
          href="/staff/bills"
          className={`staff-sidebar-link ${pathname === "/staff/bills" ? "active" : ""}`}
        >
          <Receipt size={17} /> ออกบิล & จดมิเตอร์
          {unpaidBillsCount > 0 && (
            <span className="badge badge-unpaid" style={{ marginLeft: "auto", fontSize: "0.68rem", padding: "0.1rem 0.4rem" }}>
              {unpaidBillsCount}
            </span>
          )}
        </Link>

        <Link
          href="/staff/rooms"
          className={`staff-sidebar-link ${pathname === "/staff/rooms" ? "active" : ""}`}
        >
          <DoorOpen size={17} /> ผังห้องพัก & สถานะ
        </Link>

        <Link
          href="/staff/repairs"
          className={`staff-sidebar-link ${pathname === "/staff/repairs" ? "active" : ""}`}
        >
          <Wrench size={17} /> งานแจ้งซ่อม
          {pendingRepairsCount > 0 && (
            <span className="badge badge-pending" style={{ marginLeft: "auto", fontSize: "0.68rem", padding: "0.1rem 0.4rem" }}>
              {pendingRepairsCount}
            </span>
          )}
        </Link>

        <Link
          href="/staff/announcements"
          className={`staff-sidebar-link ${pathname === "/staff/announcements" ? "active" : ""}`}
        >
          <Bell size={17} /> ประกาศ & ส่ง LINE
        </Link>

        <Link
          href="/staff/site-content"
          className={`staff-sidebar-link ${pathname === "/staff/site-content" ? "active" : ""}`}
        >
          <Globe size={17} /> แก้ไขเนื้อหาหน้าแรก
        </Link>

        <Link
          href="/staff/tenants"
          className={`staff-sidebar-link ${pathname === "/staff/tenants" ? "active" : ""}`}
        >
          <Users size={17} /> ผู้เช่า & ทำสัญญาห้อง
        </Link>

        {/* Section: เฉพาะเจ้าของหอพัก (Owner Exclusive) */}
        {isOwner && (
          <div style={{ marginTop: "1.25rem", borderTop: "1px solid rgba(245, 158, 11, 0.25)", paddingTop: "1rem" }}>
            <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--accent-gold)", textTransform: "uppercase", letterSpacing: "0.04em", paddingLeft: "0.5rem", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.3rem" }}>
              <Crown size={13} /> เมนูเจ้าของหอพัก
            </div>

            <Link
              href="/staff/owner/staff"
              className={`staff-sidebar-link ${pathname === "/staff/owner/staff" ? "active" : ""}`}
            >
              <UserPlus size={17} /> จัดการบัญชี Staff
            </Link>

            <Link
              href="/staff/owner/room-types"
              className={`staff-sidebar-link ${pathname === "/staff/owner/room-types" ? "active" : ""}`}
            >
              <Layers size={17} /> ประเภทห้อง & อัตราค่าน้ำไฟ
            </Link>

            <Link
              href="/staff/owner/analytics"
              className={`staff-sidebar-link ${pathname === "/staff/owner/analytics" ? "active" : ""}`}
            >
              <BarChart3 size={17} /> วิเคราะห์รายรับ & การเงิน
            </Link>
          </div>
        )}

        {/* Logout Button */}
        <div className="sidebar-logout">
          <button
            onClick={handleLogout}
            className="btn btn-secondary btn-sm"
            style={{ width: "100%", color: "#dc2626", borderColor: "rgba(220, 38, 38, 0.25)", justifyContent: "center", gap: "0.5rem" }}
          >
            <LogOut size={15} /> ออกจากระบบ
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="staff-main-content">
        {children}
      </main>
    </div>
  );
}
