"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, Phone, MapPin, Mail, Clock, MessageCircle } from "lucide-react";
import { useDormitory } from "@/lib/store/dormitory-context";

export const Footer: React.FC = () => {
  const pathname = usePathname();
  const { isAuthenticated } = useDormitory();

  // ซ่อน Footer ในหน้าเดินจดมิเตอร์บนมือถือ
  if (pathname === "/staff/meter-reading") {
    return null;
  }
  return (
    <footer
      style={{
        borderTop: "1px solid var(--border-color)",
        background: "var(--bg-main)",
        marginTop: "5rem",
        padding: "4rem 0 2.5rem",
      }}
    >
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "3rem",
            marginBottom: "3.5rem",
          }}
        >
          {/* Brand Column */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", marginBottom: "1.25rem" }}>
              <img
                src="/logo-icon.png"
                alt="The Saranrom Logo"
                style={{
                  width: "44px",
                  height: "44px",
                  objectFit: "contain",
                  borderRadius: "10px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                  flexShrink: 0,
                }}
              />
              <div>
                <div style={{ fontSize: "0.98rem", fontWeight: 700, color: "#0f172a", letterSpacing: "-0.02em" }}>
                  THE SARANROM
                </div>
                <div style={{ fontSize: "0.68rem", letterSpacing: "0.02em", color: "var(--text-muted)", fontWeight: 500 }}>
                  หอพักและอพาร์ตเมนต์รายเดือน
                </div>
              </div>
            </div>

            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", lineHeight: 1.65, marginBottom: "1.25rem" }}>
              หอพักรายเดือนสไตล์โมเดิร์น เงียบสงบ ปลอดภัย สะดวกสบาย ซอยสุขุมวิท 71
            </p>


          </div>

          {/* Quick Links Column */}
          <div>
            <h4 style={{ color: "#0f172a", fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "1.25rem" }}>
              เมนูหลัก
            </h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              <li>
                <Link href="/#rooms" style={{ transition: "color 0.2s" }} onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#0f172a")} onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "var(--text-secondary)")}>
                  ห้องพัก & อัตราค่าเช่า
                </Link>
              </li>
              <li>
                <Link href="/#location" style={{ transition: "color 0.2s" }} onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#0f172a")} onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "var(--text-secondary)")}>
                  ทำเลที่ตั้ง & การเดินทาง
                </Link>
              </li>
              <li>
                <Link href="/rental/dashboard" style={{ transition: "color 0.2s" }} onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#0f172a")} onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "var(--text-secondary)")}>
                  พื้นที่ผู้เช่า (ดูบิล / ชำระเงิน / แจ้งซ่อม)
                </Link>
              </li>
              {isAuthenticated && (
                <li>
                  <Link href="/staff/dashboard" style={{ transition: "color 0.2s" }} onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#0f172a")} onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "var(--text-secondary)")}>
                    ระบบเจ้าหน้าที่
                  </Link>
                </li>
              )}
              {isAuthenticated && (
                <li>
                  <Link href="/manual" style={{ transition: "color 0.2s" }} onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#0f172a")} onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "var(--text-secondary)")}>
                    คู่มือการใช้งาน
                  </Link>
                </li>
              )}
              <li>
                <Link href="/login" style={{ transition: "color 0.2s" }} onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#0f172a")} onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "var(--text-secondary)")}>
                  เข้าสู่ระบบ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details Column */}
          <div>
            <h4 style={{ color: "#0f172a", fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "1.25rem" }}>
              ติดต่อสำนักงานหอพัก
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "0.65rem" }}>
                <MapPin size={16} style={{ color: "#4f46e5", flexShrink: 0, marginTop: "0.2rem" }} />
                <span>128/9 ซอยสุขุมวิท 71 แขวงพระโขนงเหนือ เขตวัฒนา กรุงเทพฯ 10110</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                <Phone size={16} style={{ color: "#4f46e5", flexShrink: 0 }} />
                <span>081-999-8888, 082-123-4567</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                <Clock size={16} style={{ color: "#4f46e5", flexShrink: 0 }} />
                <span>เปิดทำการทุกวัน 08:30 - 18:00 น.</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                <Mail size={16} style={{ color: "#4f46e5", flexShrink: 0 }} />
                <span>contact@saranrom-residence.com</span>
              </div>
              <div style={{ marginTop: "0.5rem" }}>
                <a
                  href={process.env.NEXT_PUBLIC_LINE_OA_URL || "https://lin.ee/ryw8d3c"}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.5rem 1rem",
                    borderRadius: "8px",
                    background: "#06c755",
                    color: "#ffffff",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    textDecoration: "none",
                    boxShadow: "0 2px 8px rgba(6, 199, 85, 0.25)",
                  }}
                >
                  <MessageCircle size={16} /> แอด LINE สอบถาม
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Subfooter */}
        <div
          style={{
            borderTop: "1px solid var(--border-color)",
            paddingTop: "1.75rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
            color: "var(--text-muted)",
            fontSize: "0.8rem",
          }}
        >
          <div>
            © {new Date().getFullYear()} The Saranrom Residence. All rights reserved.
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
            <span>หอพัก & อพาร์ตเมนต์ สุขุมวิท 71</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
