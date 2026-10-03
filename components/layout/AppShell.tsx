"use client";

import React, { useState, useEffect } from "react";
import { useDormitory } from "@/lib/store/dormitory-context";
import { AlertCircle, RefreshCw } from "lucide-react";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { isLoading, dbError } = useDormitory();
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    if (dbError) {
      // บันทึกลง Console ใน Browser เท่านั้น เพื่อความปลอดภัยและไม่ให้มีข้อมูลเชิงเทคนิคปรากฏบน UI
      console.error("[Supabase Connection Error]:", dbError);
    }
  }, [dbError]);

  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 44, height: 44, border: "3px solid #0284c7", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 1rem" }} />
          <p style={{ color: "#64748b", fontSize: "0.95rem" }}>กำลังโหลดข้อมูลระบบ...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (dbError) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f1f5f9", padding: "1.5rem" }}>
        <div style={{ maxWidth: 440, width: "100%", background: "#ffffff", borderRadius: 16, padding: "2.5rem 2rem", boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)", textAlign: "center", border: "1px solid #e2e8f0" }}>
          
          <div style={{ width: 60, height: 60, borderRadius: "50%", background: "#fef2f2", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem", border: "1px solid #fee2e2" }}>
            <AlertCircle size={30} color="#dc2626" />
          </div>

          <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.5rem" }}>
            ระบบขัดข้องชั่วคราว
          </h2>
          <p style={{ color: "#64748b", fontSize: "0.92rem", lineHeight: 1.6, marginBottom: "1.75rem" }}>
            ขออภัยในความไม่สะดวก ไม่สามารถเชื่อมต่อกับระบบฐานข้อมูลได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง หรือติดต่อสำนักงานหอพัก
          </p>

          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
            <button
              onClick={() => {
                setRetrying(true);
                window.location.reload();
              }}
              disabled={retrying}
              style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.65rem 1.75rem", background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, fontSize: "0.95rem", fontWeight: 600, cursor: "pointer", transition: "all 0.2s", opacity: retrying ? 0.7 : 1 }}
            >
              <RefreshCw size={17} style={{ animation: retrying ? "spin 0.8s linear infinite" : "none" }} />
              {retrying ? "กำลังลองใหม่..." : "ลองใหม่อีกครั้ง"}
            </button>
          </div>

        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return <>{children}</>;
}
