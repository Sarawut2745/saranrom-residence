"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDormitory } from "@/lib/store/dormitory-context";
import {
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  PhoneCall,
  Loader2,
  Shield,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, logout, currentUser, isLoading: isDormLoading } = useDormitory();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const targetUrl = currentUser?.role === "rental" ? "/rental/dashboard" : "/staff/dashboard";

  // นำทางไปยังหน้าหลักทันทีหากผู้ใช้งานเข้าสู่ระบบอยู่แล้ว
  useEffect(() => {
    if (!isDormLoading && currentUser) {
      const target = currentUser.role === "rental" ? "/rental/dashboard" : "/staff/dashboard";
      window.location.replace(target);
    }
  }, [currentUser, isDormLoading]);

  const executeLogin = (loginEmail: string, loginPass: string) => {
    setError("");
    setIsLoading(true);
    try {
      const result = login(loginEmail, loginPass);
      if (result.success && result.user) {
        const target = result.user.role === "rental" ? "/rental/dashboard" : "/staff/dashboard";
        window.location.replace(target);
      } else {
        setError(result.error || "อีเมลหรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง");
        setIsLoading(false);
      }
    } catch {
      setError("เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError("กรุณากรอกอีเมลและรหัสผ่าน");
      return;
    }
    executeLogin(email, password);
  };

  // แสดงสถานะกำลังโหลดขณะกำลังตรวจสอบหรือกำลังเปลี่ยนเส้นทาง
  if (isDormLoading || currentUser) {
    return (
      <div
        className="login-wrapper"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          padding: "1.5rem",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "14px",
            color: "var(--text-secondary)",
            background: "#ffffff",
            padding: "2rem 2.5rem",
            borderRadius: "16px",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.06)",
            border: "1px solid var(--border-color)",
            textAlign: "center",
            maxWidth: "400px",
            width: "100%",
          }}
        >
          <Loader2 size={36} className="animate-spin" style={{ color: "#4f46e5" }} />
          <div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0f172a", margin: "0 0 0.35rem" }}>
              เข้าสู่ระบบสำเร็จ
            </h3>
            <span style={{ fontSize: "0.86rem", color: "#64748b" }}>
              กำลังนำท่านไปยังหน้าหลักของระบบ...
            </span>
          </div>
          {currentUser && (
            <div style={{ marginTop: "0.75rem", display: "flex", flexDirection: "column", gap: "0.5rem", width: "100%" }}>
              <a
                href={targetUrl}
                className="btn btn-primary"
                style={{ width: "100%", height: "42px", justifyContent: "center", fontSize: "0.88rem" }}
              >
                คลิกที่นี่เพื่อไปหน้าหลักทันที
              </a>
              <button
                type="button"
                onClick={() => {
                  logout();
                  window.location.reload();
                }}
                className="btn btn-secondary"
                style={{ width: "100%", height: "38px", justifyContent: "center", fontSize: "0.82rem" }}
              >
                ออกจากระบบ / สลับบัญชี
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="login-wrapper">
      <div className="login-card-container">
        <div className="login-card">
          {/* Official Logo Header */}
          <div className="login-header">
            <img
              src="/logo-icon.png"
              alt="The Saranrom Residence & Apartment"
              className="login-brand-logo"
            />
            <h1 className="login-title">เข้าสู่ระบบหอพัก</h1>
            <p className="login-subtitle">
              The Saranrom Residence & Apartment
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="error-banner">
              <AlertCircle size={18} className="error-icon" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form with Bulletproof Absolute Icon Positioning */}
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label className="form-label" htmlFor="email-input">
                อีเมล
              </label>
              <div style={{ position: "relative", width: "100%" }}>
                <div
                  style={{
                    position: "absolute",
                    left: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-muted)",
                    pointerEvents: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 3,
                  }}
                >
                  <Mail size={18} />
                </div>
                <input
                  id="email-input"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  style={{
                    width: "100%",
                    height: "48px",
                    paddingLeft: "44px",
                    paddingRight: "16px",
                    borderRadius: "10px",
                    border: "1px solid rgba(15, 23, 42, 0.14)",
                    background: "#ffffff",
                    fontSize: "16px",
                    color: "var(--text-primary)",
                    outline: "none",
                    boxSizing: "border-box",
                    fontFamily: "inherit",
                  }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password-input">
                รหัสผ่าน
              </label>
              <div style={{ position: "relative", width: "100%" }}>
                <div
                  style={{
                    position: "absolute",
                    left: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-muted)",
                    pointerEvents: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 3,
                  }}
                >
                  <Lock size={18} />
                </div>
                <input
                  id="password-input"
                  type="password"
                  placeholder="กรอกรหัสผ่านของคุณ"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  style={{
                    width: "100%",
                    height: "48px",
                    paddingLeft: "44px",
                    paddingRight: "16px",
                    borderRadius: "10px",
                    border: "1px solid rgba(15, 23, 42, 0.14)",
                    background: "#ffffff",
                    fontSize: "16px",
                    color: "var(--text-primary)",
                    outline: "none",
                    boxSizing: "border-box",
                    fontFamily: "inherit",
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-login-submit"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>กำลังตรวจสอบ...</span>
                </>
              ) : (
                <>
                  <span>เข้าสู่ระบบ</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Support & Contact Footer */}
          <div className="login-footer">
            <div className="support-notice">
              <Shield size={14} className="support-icon" />
              <span>หากลืมรหัสผ่านหรือต้องการเปิดบัญชีใหม่ กรุณาติดต่อสำนักงานหอพัก</span>
            </div>
            <a href="tel:027110099" className="btn-call-support">
              <PhoneCall size={14} />
              <span>โทร: 02-711-0099</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
