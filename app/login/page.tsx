"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useDormitory } from "@/lib/store/dormitory-context";
import {
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  UserCheck,
  PhoneCall,
  Loader2,
  Shield,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, currentUser, logout } = useDormitory();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const executeLogin = (loginEmail: string, loginPass: string) => {
    setError("");
    setIsLoading(true);
    try {
      const result = login(loginEmail, loginPass);
      if (result.success && result.user) {
        if (result.user.role === "rental") {
          router.push("/rental/dashboard");
        } else {
          router.push("/staff/dashboard");
        }
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

          {/* Already Logged In Notice */}
          {currentUser && (
            <div className="active-session-card">
              <div className="session-header">
                <UserCheck size={18} />
                <span>คุณเข้าสู่ระบบอยู่แล้ว</span>
              </div>
              <p className="session-user">
                เข้าใช้งานในชื่อ: <strong>{currentUser.full_name}</strong> ({currentUser.role === "rental" ? "ผู้เช่าห้องพัก" : "เจ้าหน้าที่"})
              </p>
              <div className="session-actions">
                <button
                  type="button"
                  onClick={() => router.push(currentUser.role === "rental" ? "/rental/dashboard" : "/staff/dashboard")}
                  className="btn-dashboard"
                >
                  ไปยังหน้าแดชบอร์ด <ArrowRight size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => logout()}
                  className="btn-logout"
                >
                  ออกจากระบบ
                </button>
              </div>
            </div>
          )}

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
              <span>หากลืมรหัสผ่านหรือต้องการเปิดบัญชีใหม่ กรุณาติดต่อสำนักงานนิติบุคคล</span>
            </div>
            <a href="tel:027110099" className="btn-call-support">
              <PhoneCall size={14} />
              <span>โทรติดต่อสำนักงาน: 02-711-0099</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
