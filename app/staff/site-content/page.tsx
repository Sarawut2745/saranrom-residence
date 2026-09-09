"use client";

import React, { useState } from "react";
import { useDormitory } from "@/lib/store/dormitory-context";
import { SiteContent } from "@/types/dormitory";
import { Globe, Save, CheckCircle2, RefreshCw, Eye } from "lucide-react";
import Link from "next/link";

export default function StaffSiteContentPage() {
  const { siteContent, updateSiteContent } = useDormitory();

  const [activeSectionKey, setActiveSectionKey] = useState<string>("hero");
  const [toastMsg, setToastMsg] = useState<string>("");

  const activeSection = siteContent.find((s) => s.section_key === activeSectionKey) || siteContent[0];

  const [title, setTitle] = useState(activeSection?.title || "");
  const [subtitle, setSubtitle] = useState(activeSection?.subtitle || "");
  const [imageUrl, setImageUrl] = useState(activeSection?.image_url || "");
  const [jsonText, setJsonText] = useState(
    JSON.stringify(activeSection?.content_json || {}, null, 2)
  );

  const handleSelectSection = (key: string) => {
    setActiveSectionKey(key);
    const target = siteContent.find((s) => s.section_key === key);
    if (target) {
      setTitle(target.title);
      setSubtitle(target.subtitle || "");
      setImageUrl(target.image_url || "");
      setJsonText(JSON.stringify(target.content_json || {}, null, 2));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsedJson = JSON.parse(jsonText);
      updateSiteContent(activeSectionKey, {
        title,
        subtitle,
        image_url: imageUrl,
        content_json: parsedJson,
      });

      setToastMsg(`บันทึกเนื้อหาส่วน "${activeSectionKey}" สำเร็จ! หน้าแรกของเว็บจะเปลี่ยนทันที`);
      setTimeout(() => setToastMsg(""), 4000);
    } catch (err: any) {
      alert("รูปแบบ Content JSON ไม่ถูกต้อง: " + err.message);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--text-primary)" }}>
            จัดการเนื้อหาหน้าแรกของเว็บไซต์ (Site Content Editor)
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem" }}>
            ปรับแต่งข้อความ รูปภาพ และข้อมูลในแต่ละส่วนแบบไดนามิก (Generic Content)
          </p>
        </div>

        <Link href="/" target="_blank" className="btn btn-secondary btn-sm">
          <Eye size={15} /> เปิดดูหน้าแรกจริง
        </Link>
      </div>

      {toastMsg && (
        <div style={{ padding: "0.85rem 1.25rem", borderRadius: "10px", background: "rgba(5, 150, 105, 0.08)", border: "1px solid rgba(5, 150, 105, 0.3)", color: "#065f46", fontSize: "0.9rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Section Picker Tabs */}
      <div style={{ display: "flex", gap: "0.6rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        {siteContent.map((sc) => (
          <button
            key={sc.section_key}
            onClick={() => handleSelectSection(sc.section_key)}
            className={`btn btn-sm ${
              activeSectionKey === sc.section_key ? "btn-primary" : "btn-secondary"
            }`}
          >
            ส่วน: {sc.section_key.toUpperCase()} ({sc.title.slice(0, 18)}...)
          </button>
        ))}
      </div>

      {/* Edit Form */}
      <div className="glass-card" style={{ padding: "2rem" }}>
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label className="form-label">หัวข้อหลักของส่วนนี้ (Title) *</label>
            <input
              type="text"
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">คำบรรยายประกอบ (Subtitle)</label>
            <textarea
              className="form-textarea"
              rows={2}
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
            ></textarea>
          </div>

          <div className="form-group">
            <label className="form-label">ลิงก์รูปภาพประกอบ (Image URL)</label>
            <input
              type="text"
              className="form-input"
              placeholder="https://images.unsplash.com/..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
            {imageUrl && (
              <div style={{ marginTop: "0.5rem", height: 120, borderRadius: "8px", overflow: "hidden", border: "1px solid var(--border-color)", width: 220 }}>
                <img src={imageUrl} alt="ตัวอย่าง" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            )}
          </div>

          <div className="form-group">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
              <label className="form-label" style={{ margin: 0 }}>
                ข้อมูลเพิ่มเติมแบบยืดหยุ่น (Content JSON / Generic Config) *
              </label>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                รองรับการปรับแต่งเนื้อหาหน้าเว็บได้ทุกฟิลด์แบบไดนามิก
              </span>
            </div>
            <textarea
              className="form-textarea"
              rows={9}
              style={{ fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.5 }}
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              required
            ></textarea>
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: "0.75rem 2rem" }}>
            <Save size={16} /> บันทึกการเปลี่ยนแปลงหน้าเว็บ
          </button>
        </form>
      </div>
    </div>
  );
}
