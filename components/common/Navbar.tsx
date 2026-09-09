"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDormitory } from "@/lib/store/dormitory-context";
import {
  KeyRound,
  ShieldCheck,
  LogIn,
  LogOut,
  Menu,
  X,
  BedDouble,
  Grid3X3,
  Sparkles,
  Phone,
  ChevronRight,
  BookOpen,
} from "lucide-react";

export const Navbar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser, isOwner, isAuthenticated, logout } = useDormitory();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    logout();
    router.push("/login");
    setMobileMenuOpen(false);
  };

  return (
    <header
      className="navbar-header"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 999,
        height: 56,
        minHeight: 56,
        maxHeight: 56,
        background: "rgba(255, 255, 255, 0.94)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(226, 232, 240, 0.8)",
        display: "flex",
        alignItems: "center",
        boxSizing: "border-box",
      }}
    >
      <div
        className="navbar-inner"
        style={{
          width: "100%",
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 1.25rem",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxSizing: borderBoxOrUndefined(),
        }}
      >
        {/* Brand Logo with Horizontal Emblem & Typography */}
        <Link
          href="/"
          className="navbar-brand"
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "0.65rem",
            textDecoration: "none",
            height: "100%",
            flexShrink: 0,
          }}
        >
          <img
            src="/logo-icon.png"
            alt="The Saranrom Logo"
            className="brand-logo-img"
            width={34}
            height={34}
            style={{
              width: 34,
              height: 34,
              maxWidth: 34,
              maxHeight: 34,
              objectFit: "contain",
              borderRadius: 6,
              flexShrink: 0,
              display: "block",
            }}
          />
          <div
            className="brand-text"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              lineHeight: 1.15,
            }}
          >
            <span
              className="brand-name"
              style={{
                fontSize: "0.92rem",
                fontWeight: 800,
                letterSpacing: "-0.01em",
                color: "#0f172a",
                lineHeight: 1.1,
                whiteSpace: "nowrap",
              }}
            >
              THE SARANROM
            </span>
            <span
              className="brand-sub"
              style={{
                fontSize: "0.6rem",
                letterSpacing: "0.01em",
                color: "#64748b",
                fontWeight: 500,
                lineHeight: 1.1,
                whiteSpace: "nowrap",
                marginTop: "2px",
              }}
            >
              หอพักและอพาร์ตเมนต์รายเดือน
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          className="desktop-nav"
          style={{
            alignItems: "center",
            gap: "1.5rem",
            height: "100%",
          }}
        >
          <div
            className="nav-links"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1.25rem",
            }}
          >
            <Link href="/#rooms" className="nav-link">
              ห้องพัก & อัตราเช่า
            </Link>
            <Link href="/#matrix" className="nav-link">
              ผังห้องว่าง
            </Link>
            <Link href="/#amenities" className="nav-link">
              สิ่งอำนวยความสะดวก
            </Link>
            <Link href="/#contact" className="nav-link">
              ติดต่อสอบถาม
            </Link>
            <Link href="/manual" className="nav-link">
              คู่มือการใช้งาน
            </Link>
          </div>

          {/* Desktop User Auth Buttons */}
          <div
            className="auth-group"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.65rem",
              borderLeft: "1px solid rgba(226, 232, 240, 0.8)",
              paddingLeft: "1.25rem",
            }}
          >
            {isAuthenticated && currentUser ? (
              <>
                {currentUser.role === "rental" ? (
                  <Link
                    href="/rental/dashboard"
                    className="btn-user-portal"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      padding: "0.38rem 0.85rem",
                      borderRadius: "8px",
                      background: "#4f46e5",
                      color: "#ffffff",
                      fontSize: "0.82rem",
                      fontWeight: 600,
                      textDecoration: "none",
                      whiteSpace: "nowrap",
                      height: 34,
                      boxSizing: "border-box",
                    }}
                  >
                    <KeyRound size={14} />
                    <span>ห้อง {currentUser.full_name.split(" ")[0]}</span>
                  </Link>
                ) : (
                  <Link
                    href="/staff/dashboard"
                    className="btn-user-portal"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      padding: "0.38rem 0.85rem",
                      borderRadius: "8px",
                      background: "#4f46e5",
                      color: "#ffffff",
                      fontSize: "0.82rem",
                      fontWeight: 600,
                      textDecoration: "none",
                      whiteSpace: "nowrap",
                      height: 34,
                      boxSizing: "border-box",
                    }}
                  >
                    <ShieldCheck size={14} />
                    <span>{isOwner ? "แดชบอร์ดเจ้าของ" : "ระบบนิติบุคคล"}</span>
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="btn-logout-icon"
                  title="ออกจากระบบ"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 34,
                    height: 34,
                    borderRadius: "8px",
                    background: "#f8fafc",
                    border: "1px solid rgba(226, 232, 240, 0.8)",
                    color: "#64748b",
                    cursor: "pointer",
                  }}
                >
                  <LogOut size={14} />
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="btn-login-cta"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.4rem",
                  height: 34,
                  padding: "0 0.95rem",
                  borderRadius: "8px",
                  background: "#0f172a",
                  color: "#ffffff",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  textDecoration: "none",
                  boxShadow: "0 2px 6px rgba(15, 23, 42, 0.12)",
                  border: "1px solid rgba(15, 23, 42, 0.1)",
                  whiteSpace: "nowrap",
                  boxSizing: "border-box",
                }}
              >
                <LogIn size={14} />
                <span>เข้าสู่ระบบ</span>
              </Link>
            )}
          </div>
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="mobile-toggle-btn"
          aria-label={mobileMenuOpen ? "ปิดเมนู" : "เปิดเมนู"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Navigation Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu-drawer">
          <div className="mobile-nav-links">
            <Link
              href="/#rooms"
              onClick={() => setMobileMenuOpen(false)}
              className="mobile-nav-item"
            >
              <div className="item-icon-wrap">
                <BedDouble size={18} />
              </div>
              <div className="item-text">
                <span className="item-title">ห้องพัก & อัตราเช่า</span>
                <span className="item-desc">ดูประเภทห้องพักและค่าเช่ารายเดือน</span>
              </div>
              <ChevronRight size={16} className="item-arrow" />
            </Link>

            <Link
              href="/#matrix"
              onClick={() => setMobileMenuOpen(false)}
              className="mobile-nav-item"
            >
              <div className="item-icon-wrap">
                <Grid3X3 size={18} />
              </div>
              <div className="item-text">
                <span className="item-title">ผังห้องว่างเรียลไทม์</span>
                <span className="item-desc">ตรวจสถานะห้องพักว่างและทำเลแต่ละชั้น</span>
              </div>
              <ChevronRight size={16} className="item-arrow" />
            </Link>

            <Link
              href="/#amenities"
              onClick={() => setMobileMenuOpen(false)}
              className="mobile-nav-item"
            >
              <div className="item-icon-wrap">
                <Sparkles size={18} />
              </div>
              <div className="item-text">
                <span className="item-title">สิ่งอำนวยความสะดวก</span>
                <span className="item-desc">ฟิตเนส ที่จอดรถ ระบบความปลอดภัย</span>
              </div>
              <ChevronRight size={16} className="item-arrow" />
            </Link>

            <Link
              href="/#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="mobile-nav-item"
            >
              <div className="item-icon-wrap">
                <Phone size={18} />
              </div>
              <div className="item-text">
                <span className="item-title">ติดต่อสอบถาม</span>
                <span className="item-desc">แผนที่ เบอร์โทร และ LINE Official</span>
              </div>
              <ChevronRight size={16} className="item-arrow" />
            </Link>

            <Link
              href="/manual"
              onClick={() => setMobileMenuOpen(false)}
              className="mobile-nav-item"
            >
              <div className="item-icon-wrap">
                <BookOpen size={18} />
              </div>
              <div className="item-text">
                <span className="item-title">คู่มือการใช้งาน</span>
                <span className="item-desc">คู่มือระบบผู้เช่า เจ้าหน้าที่ และผู้บริหาร</span>
              </div>
              <ChevronRight size={16} className="item-arrow" />
            </Link>
          </div>

          {/* Mobile Auth Section */}
          <div className="mobile-auth-section">
            {isAuthenticated && currentUser ? (
              <div className="mobile-user-box">
                <div className="mobile-user-info">
                  <div className="user-label">เข้าสู่ระบบในชื่อ</div>
                  <div className="user-name">
                    {currentUser.full_name} ({currentUser.role === "rental" ? "ผู้เช่า" : "เจ้าหน้าที่"})
                  </div>
                </div>
                <div className="mobile-user-btns">
                  <Link
                    href={currentUser.role === "rental" ? "/rental/dashboard" : "/staff/dashboard"}
                    onClick={() => setMobileMenuOpen(false)}
                    className="mobile-btn-portal"
                  >
                    {currentUser.role === "rental" ? <KeyRound size={16} /> : <ShieldCheck size={16} />}
                    <span>เข้าสู่แดชบอร์ด</span>
                  </Link>
                  <button onClick={handleLogout} className="mobile-btn-logout">
                    <LogOut size={16} />
                    <span>ออกจากระบบ</span>
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="mobile-btn-login"
              >
                <LogIn size={18} />
                <span>เข้าสู่ระบบหอพัก</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

// Helper for strict TypeScript CSS typing
function borderBoxOrUndefined(): "border-box" {
  return "border-box";
}
