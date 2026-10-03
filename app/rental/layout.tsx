"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDormitory } from "@/lib/store/dormitory-context";
import {
  LayoutDashboard,
  ReceiptText,
  Wrench,
  Bell,
  FileText,
  LogOut,
  Lock,
  AlertCircle,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

export default function RentalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, currentRentalProfile, rooms, bills, logout, isLoading } = useDormitory();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  // 1. Loading State: Wait for Supabase to finish checking auth and loading data
  if (isLoading) {
    return (
      <div
        className="container"
        style={{
          padding: "5rem 1.5rem",
          minHeight: "70vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            border: "3.5px solid rgba(79, 70, 229, 0.15)",
            borderTopColor: "#4f46e5",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", fontWeight: 500 }}>
          กำลังโหลดข้อมูล...
        </p>
      </div>
    );
  }

  // 2. Not Logged In State
  if (!currentUser) {
    return (
      <div
        className="container"
        style={{
          padding: "4rem 1.5rem",
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          className="bento-card"
          style={{
            padding: "2.5rem 2rem",
            textAlign: "center",
            maxWidth: 440,
            background: "#ffffff",
            borderRadius: "var(--radius-xl)",
          }}
        >
          <div
            style={{
              width: 54,
              height: 54,
              borderRadius: "50%",
              background: "rgba(234, 88, 12, 0.1)",
              color: "#c2410c",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "1rem",
            }}
          >
            <Lock size={26} />
          </div>
          <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "0.5rem" }}>
            กรุณาเข้าสู่ระบบ
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", marginBottom: "1.5rem", lineHeight: 1.5 }}>
            พื้นที่นี้สำหรับผู้เช่าห้องพักเพื่อดูยอดค่าห้อง สัญญาเช่า และส่งคำร้องแจ้งซ่อม
          </p>
          <Link href="/login" className="btn btn-primary" style={{ width: "100%", height: "46px", justifyContent: "center" }}>
            <span>ไปที่หน้าเข้าสู่ระบบ</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  // 3. Logged in as Staff/Owner (Role Mismatch)
  if (currentUser.role !== "rental") {
    return (
      <div
        className="container"
        style={{
          padding: "4rem 1.5rem",
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          className="bento-card"
          style={{
            padding: "2.5rem 2.25rem",
            textAlign: "center",
            maxWidth: 480,
            background: "#ffffff",
            borderRadius: "var(--radius-xl)",
            border: "1.5px solid rgba(79, 70, 229, 0.2)",
            boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.08)",
          }}
        >
          <div
            style={{
              width: 58,
              height: 58,
              borderRadius: "16px",
              background: "rgba(79, 70, 229, 0.1)",
              color: "#4f46e5",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "1.25rem",
            }}
          >
            <ShieldCheck size={30} />
          </div>
          <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "0.5rem" }}>
            คุณกำลังเข้าสู่ระบบในฐานะเจ้าหน้าที่
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
            <div>
              เข้าใช้งานในชื่อ: <strong style={{ color: "var(--text-primary)" }}>{currentUser.full_name}</strong>
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
              อีเมล: {currentUser.email} • ตำแหน่ง: {currentUser.role === "staff" ? "เจ้าหน้าที่" : currentUser.role}
            </div>
          </div>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "1.5rem", lineHeight: 1.5 }}>
            หน้านี้เป็นระบบพอร์ทัลสำหรับ <strong>ผู้เช่าห้องพัก</strong> เท่านั้น
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <Link
              href="/staff/dashboard"
              className="btn btn-primary"
              style={{ width: "100%", height: "46px", justifyContent: "center", fontSize: "0.95rem" }}
            >
              ไปหน้าเจ้าหน้าที่
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="btn btn-secondary"
              style={{ width: "100%", height: "44px", justifyContent: "center", fontSize: "0.92rem" }}
            >
              ออกจากระบบ เพื่อเข้าสู่ระบบผู้เช่า
            </button>
          </div>
        </div>
      </div>
    );
  }

  const userRoom = rooms.find((r) => r.id === currentRentalProfile?.room_id);
  const unpaidBillsCount = bills.filter(
    (b) => b.rental_profile_id === currentRentalProfile?.id && b.status === "unpaid"
  ).length;

  return (
    <div className="container" style={{ padding: "1.75rem 1.25rem" }}>
      {/* Rental Header Banner */}
      <div
        className="bento-card"
        style={{
          padding: "1.35rem 1.6rem",
          marginBottom: "1.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
          background: "#ffffff",
          borderRadius: "var(--radius-lg)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: "12px",
              background: "rgba(79, 70, 229, 0.08)",
              border: "1.5px solid rgba(79, 70, 229, 0.22)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#4f46e5",
              fontWeight: 800,
              fontSize: "1.3rem",
            }}
          >
            {userRoom?.room_number || "201"}
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <h1 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
                ห้อง {userRoom?.room_number || "201"}
              </h1>
              <span
                style={{
                  background: "rgba(5, 150, 105, 0.08)",
                  border: "1px solid rgba(5, 150, 105, 0.25)",
                  color: "#065f46",
                  fontSize: "0.74rem",
                  padding: "0.15rem 0.6rem",
                  borderRadius: "9999px",
                  fontWeight: 700,
                }}
              >
                ผู้เช่าปัจจุบัน
              </span>
            </div>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.86rem", marginTop: "0.2rem", margin: 0 }}>
              ผู้เช่า: <strong style={{ color: "var(--text-primary)" }}>{currentUser.full_name}</strong> (ชั้น {userRoom?.floor || 2})
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexShrink: 0 }}>
          {unpaidBillsCount > 0 && (
            <Link
              href="/rental/bills"
              className="btn btn-primary"
              style={{
                background: "#dc2626",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "0.85rem",
                padding: "0.45rem 0.85rem",
                whiteSpace: "nowrap",
                boxShadow: "0 2px 6px rgba(220, 38, 38, 0.2)",
              }}
            >
              <AlertCircle size={15} />
              <span>รอชำระ {unpaidBillsCount}</span>
            </Link>
          )}

          <button
            type="button"
            onClick={handleLogout}
            className="btn btn-secondary btn-sm"
            style={{ color: "var(--text-secondary)", height: "36px", flexShrink: 0, padding: "0 0.85rem" }}
            title="ออกจากระบบ"
          >
            <LogOut size={14} />
            <span className="logout-label">ออกจากระบบ</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs: horizontal scroll row for all screen sizes */}
      <div
        className="chip-filter-row"
        style={{
          borderBottom: "1px solid var(--border-color)",
          paddingBottom: "0.75rem",
          marginBottom: "1.5rem",
          gap: "0.4rem",
          flexWrap: "nowrap",
          overflowX: "auto",
        }}
      >
        <Link
          href="/rental/dashboard"
          className={`chip-btn ${pathname === "/rental/dashboard" ? "active" : ""}`}
          style={{ minHeight: "42px", padding: "0.45rem 0.95rem", fontSize: "0.88rem", fontWeight: 600, whiteSpace: "nowrap" }}
        >
          <LayoutDashboard size={16} />
          <span>หน้าหลัก</span>
        </Link>
        <Link
          href="/rental/bills"
          className={`chip-btn ${pathname === "/rental/bills" ? "active" : ""}`}
          style={{ minHeight: "42px", padding: "0.45rem 0.95rem", fontSize: "0.88rem", fontWeight: 600, whiteSpace: "nowrap" }}
        >
          <ReceiptText size={16} />
          <span>จ่ายค่าห้อง {unpaidBillsCount > 0 ? `(${unpaidBillsCount})` : ""}</span>
        </Link>
        <Link
          href="/rental/repairs"
          className={`chip-btn ${pathname === "/rental/repairs" ? "active" : ""}`}
          style={{ minHeight: "42px", padding: "0.45rem 0.95rem", fontSize: "0.88rem", fontWeight: 600, whiteSpace: "nowrap" }}
        >
          <Wrench size={16} />
          <span>แจ้งซ่อม</span>
        </Link>
        <Link
          href="/rental/announcements"
          className={`chip-btn ${pathname === "/rental/announcements" ? "active" : ""}`}
          style={{ minHeight: "42px", padding: "0.45rem 0.95rem", fontSize: "0.88rem", fontWeight: 600, whiteSpace: "nowrap" }}
        >
          <Bell size={16} />
          <span>ข่าวสาร</span>
        </Link>
        <Link
          href="/rental/profile"
          className={`chip-btn ${pathname === "/rental/profile" ? "active" : ""}`}
          style={{ minHeight: "42px", padding: "0.45rem 0.95rem", fontSize: "0.88rem", fontWeight: 600, whiteSpace: "nowrap" }}
        >
          <FileText size={16} />
          <span>สัญญาเช่า</span>
        </Link>
      </div>

      {children}
    </div>
  );
}
