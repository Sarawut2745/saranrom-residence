"use client";

import React, { useState } from "react";
import { useDormitory } from "@/lib/store/dormitory-context";
import {
  Wrench,
  PlusCircle,
  Clock,
  CheckCircle2,
  Image as ImageIcon,
  MessageSquare,
  ZoomIn,
  Camera,
  X,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

export default function RentalRepairsPage() {
  const { currentRentalProfile, repairRequests, submitRepairRequest } = useDormitory();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<"ทั่วไป" | "ไฟฟ้า" | "ประปา" | "เฟอร์นิเจอร์" | "เครื่องปรับอากาศ">("ทั่วไป");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const userRepairs = repairRequests.filter(
    (r) => r.rental_profile_id === currentRentalProfile?.id
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    submitRepairRequest({
      title,
      category,
      priority,
      description,
      imageUrls: imageUrl ? [imageUrl] : [],
    });

    // Reset form
    setTitle("");
    setDescription("");
    setImageUrl("");
    setIsModalOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.45rem", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
            แจ้งซ่อมห้องพัก
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginTop: "0.25rem", margin: 0 }}>
            หากอุปกรณ์ในห้องชำรุด สามารถกดส่งคำร้องให้ทีมช่างเข้าตรวจสอบได้ที่นี่
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary"
          style={{ minHeight: "44px", padding: "0 1.25rem", fontSize: "0.9rem", fontWeight: 600, borderRadius: "8px" }}
        >
          <PlusCircle size={17} />
          <span>กดเพื่อแจ้งซ่อมใหม่</span>
        </button>
      </div>

      {/* Repair Requests List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {userRepairs.length === 0 ? (
          <div className="bento-card" style={{ padding: "3rem 1.5rem", textAlign: "center", background: "#ffffff" }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "14px",
                background: "rgba(79, 70, 229, 0.08)",
                border: "1px solid rgba(79, 70, 229, 0.2)",
                color: "#4f46e5",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1rem",
              }}
            >
              <Wrench size={26} />
            </div>
            <h3 style={{ color: "var(--text-primary)", fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.35rem" }}>
              ไม่มีประวัติการแจ้งซ่อมค้าง
            </h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", maxWidth: 360, margin: "0 auto 1.5rem", lineHeight: 1.5 }}>
              อุปกรณ์ในห้องพักของคุณอยู่ในสภาพสมบูรณ์ หากมีสิ่งใดชำรุดสามารถกดปุ่มแจ้งซ่อมได้ทันที
            </p>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="btn btn-primary"
              style={{ padding: "0.6rem 1.25rem", fontSize: "0.9rem", borderRadius: "8px" }}
            >
              <PlusCircle size={16} />
              <span>แจ้งซ่อมใหม่</span>
            </button>
          </div>
        ) : (
          userRepairs.map((req) => (
            <div
              key={req.id}
              className="bento-card hover-card-lift"
              style={{
                padding: "1.5rem 1.75rem",
                background: "#ffffff",
                borderRadius: "var(--radius-lg)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.75rem", marginBottom: "0.75rem" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem", flexWrap: "wrap" }}>
                    <span
                      style={{
                        fontSize: "0.76rem",
                        color: "#4f46e5",
                        fontWeight: 700,
                        background: "rgba(79, 70, 229, 0.08)",
                        border: "1px solid rgba(79, 70, 229, 0.2)",
                        padding: "0.15rem 0.55rem",
                        borderRadius: "6px",
                      }}
                    >
                      {req.category}
                    </span>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                      แจ้งเมื่อ: {new Date(req.created_at).toLocaleDateString("th-TH")}
                    </span>
                  </div>
                  <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
                    {req.title}
                  </h3>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  {req.status === "pending" && (
                    <span
                      style={{
                        background: "rgba(217, 119, 6, 0.08)",
                        border: "1px solid rgba(217, 119, 6, 0.25)",
                        color: "#d97706",
                        fontSize: "0.76rem",
                        padding: "0.2rem 0.65rem",
                        borderRadius: "9999px",
                        fontWeight: 700,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.35rem",
                      }}
                    >
                      <Clock size={13} />
                      <span>รอช่างรับเรื่อง</span>
                    </span>
                  )}
                  {req.status === "in_progress" && (
                    <span
                      style={{
                        background: "rgba(37, 99, 235, 0.08)",
                        border: "1px solid rgba(37, 99, 235, 0.25)",
                        color: "#2563eb",
                        fontSize: "0.76rem",
                        padding: "0.2rem 0.65rem",
                        borderRadius: "9999px",
                        fontWeight: 700,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.35rem",
                      }}
                    >
                      <Wrench size={13} />
                      <span>กำลังประสานงานช่าง</span>
                    </span>
                  )}
                  {req.status === "completed" && (
                    <span
                      style={{
                        background: "rgba(5, 150, 105, 0.08)",
                        border: "1px solid rgba(5, 150, 105, 0.25)",
                        color: "#065f46",
                        fontSize: "0.76rem",
                        padding: "0.2rem 0.65rem",
                        borderRadius: "9999px",
                        fontWeight: 700,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.35rem",
                      }}
                    >
                      <CheckCircle2 size={13} />
                      <span>ซ่อมเสร็จสิ้นแล้ว</span>
                    </span>
                  )}
                </div>
              </div>

              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.6, margin: "0 0 1rem" }}>
                {req.description}
              </p>

              {/* Photos attached */}
              {req.image_urls && req.image_urls.length > 0 && (
                <div style={{ marginBottom: "1rem" }}>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "0.4rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                    <Camera size={13} />
                    <span>รูปภาพแนบ ({req.image_urls.length} รูป - คลิกเพื่อดูภาพขยาย)</span>
                  </div>
                  <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                    {req.image_urls.map((img, i) => (
                      <div
                        key={i}
                        onClick={() => setPreviewImage(img)}
                        style={{
                          width: 140,
                          height: 95,
                          borderRadius: "8px",
                          overflow: "hidden",
                          border: "1px solid var(--border-color)",
                          cursor: "pointer",
                          position: "relative",
                          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
                          background: "#000",
                        }}
                        title="คลิกเพื่อดูรูปภาพขนาดเต็ม"
                      >
                        <img
                          src={img}
                          alt="รูปประกอบงานซ่อม"
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            background: "linear-gradient(transparent, rgba(15, 23, 42, 0.85))",
                            color: "#fff",
                            fontSize: "0.7rem",
                            padding: "0.3rem 0.5rem 0.2rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.25rem",
                          }}
                        >
                          <ZoomIn size={11} />
                          <span>ขยายรูป</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Staff Comment */}
              {req.staff_comment && req.staff_comment.trim() !== "" && req.staff_comment.trim() !== "..." && (
                <div
                  style={{
                    background: "rgba(217, 119, 6, 0.06)",
                    border: "1px solid rgba(217, 119, 6, 0.25)",
                    padding: "0.75rem 1rem",
                    borderRadius: "8px",
                    display: "flex",
                    gap: "0.65rem",
                    alignItems: "flex-start",
                  }}
                >
                  <MessageSquare size={16} style={{ color: "#d97706", flexShrink: 0, marginTop: "0.15rem" }} />
                  <div>
                    <strong style={{ color: "#b45309", fontSize: "0.82rem", display: "block" }}>
                      ข้อความจากเจ้าหน้าที่:
                    </strong>
                    <span style={{ color: "var(--text-primary)", fontSize: "0.85rem" }}>
                      {req.staff_comment}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Submit Repair Modal (Bottom Sheet on Mobile) */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ padding: "1.75rem", maxWidth: "480px" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Wrench size={20} style={{ color: "#4f46e5" }} />
                <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
                  แจ้งเรื่องซ่อมห้องพัก
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                aria-label="ปิด"
                style={{
                  background: "#f1f5f9",
                  border: "1px solid var(--border-color)",
                  color: "var(--text-secondary)",
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group" style={{ marginBottom: "1rem" }}>
                <label className="form-label" style={{ fontSize: "0.88rem", fontWeight: 700, marginBottom: "0.35rem", display: "block" }}>
                  หัวข้อปัญหา (สั้นๆ) *
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="เช่น แอร์ไม่เย็น, ก๊อกน้ำอ่างล้างหน้ารั่ว"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{ minHeight: "44px", fontSize: "16px" }}
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1rem" }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: "0.88rem", fontWeight: 700, marginBottom: "0.35rem", display: "block" }}>
                    หมวดหมู่ *
                  </label>
                  <select
                    className="form-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    style={{ minHeight: "44px", fontSize: "16px" }}
                  >
                    <option value="ทั่วไป">ทั่วไป</option>
                    <option value="เครื่องปรับอากาศ">เครื่องปรับอากาศ (แอร์)</option>
                    <option value="ประปา">น้ำประปา / ห้องน้ำ</option>
                    <option value="ไฟฟ้า">ระบบไฟฟ้า / หลอดไฟ</option>
                    <option value="เฟอร์นิเจอร์">เฟอร์นิเจอร์ / ประตู</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontSize: "0.88rem", fontWeight: 700, marginBottom: "0.35rem", display: "block" }}>
                    ความด่วน *
                  </label>
                  <select
                    className="form-select"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    style={{ minHeight: "44px", fontSize: "16px" }}
                  >
                    <option value="low">ปกติ (1-3 วัน)</option>
                    <option value="medium">ปานกลาง</option>
                    <option value="high">ด่วนมาก</option>
                  </select>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: "1rem" }}>
                <label className="form-label" style={{ fontSize: "0.88rem", fontWeight: 700, marginBottom: "0.35rem", display: "block" }}>
                  รายละเอียดปัญหา หรือเวลาที่สะดวกให้เข้าซ่อม *
                </label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder="เช่น สะดวกให้ช่างเข้าช่วงบ่าย วันเสาร์-อาทิตย์"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ fontSize: "16px", minHeight: "85px" }}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: "1.25rem" }}>
                <label className="form-label" style={{ fontSize: "0.88rem", fontWeight: 700, marginBottom: "0.35rem", display: "block" }}>
                  แนบรูปถ่ายจุดที่ชำรุด (ถ้ามี)
                </label>
                <div
                  style={{
                    border: "1.5px dashed rgba(79, 70, 229, 0.35)",
                    borderRadius: "8px",
                    padding: "0.85rem",
                    textAlign: "center",
                    background: "#f8fafc",
                    position: "relative",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{
                      position: "absolute",
                      inset: 0,
                      opacity: 0,
                      cursor: "pointer",
                      width: "100%",
                      height: "100%",
                    }}
                  />
                  <div style={{ fontSize: "0.84rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem" }}>
                    <Camera size={16} style={{ color: "#4f46e5" }} />
                    <span>{imageUrl ? "เลือกรูปภาพแล้ว (คลิกเพื่อเปลี่ยนรูป)" : "คลิกเพื่อเลือกรูปภาพ หรือถ่ายภาพ"}</span>
                  </div>
                </div>

                {imageUrl && (
                  <div style={{ marginTop: "0.5rem", height: "80px", borderRadius: "6px", overflow: "hidden", border: "1px solid var(--border-color)" }}>
                    <img src={imageUrl} alt="รูปจุดชำรุด" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                  </div>
                )}
              </div>

              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-secondary"
                  style={{ flex: 1, minHeight: "44px", borderRadius: "8px" }}
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 2, minHeight: "44px", fontWeight: 600, borderRadius: "8px" }}
                >
                  ส่งเรื่องแจ้งซ่อม
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Photo Lightbox Modal */}
      {previewImage && (
        <div
          className="modal-overlay"
          onClick={() => setPreviewImage(null)}
          style={{ zIndex: 10000, background: "rgba(15, 23, 42, 0.85)" }}
        >
          <div
            style={{
              position: "relative",
              maxWidth: "92vw",
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setPreviewImage(null)}
              style={{
                position: "absolute",
                top: "-42px",
                right: "0",
                background: "rgba(255, 255, 255, 0.2)",
                border: "none",
                color: "#ffffff",
                borderRadius: "50%",
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
              title="ปิดภาพขยาย"
            >
              <X size={20} />
            </button>
            <img
              src={previewImage}
              alt="รูปงานซ่อมขนาดใหญ่"
              style={{
                maxWidth: "100%",
                maxHeight: "85vh",
                objectFit: "contain",
                borderRadius: "12px",
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.5)",
                border: "2px solid rgba(255, 255, 255, 0.2)",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
