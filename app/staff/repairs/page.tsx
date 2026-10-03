"use client";

import React, { useState } from "react";
import { useDormitory } from "@/lib/store/dormitory-context";
import { RepairRequest, RepairStatus } from "@/types/dormitory";
import {
  Wrench,
  Clock,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  Building,
  User,
  Filter,
  Camera,
  ZoomIn,
  X,
} from "lucide-react";

export default function StaffRepairsPage() {
  const { repairRequests, rooms, rentalProfiles, users, updateRepairStatus } = useDormitory();

  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [activeEditReq, setActiveEditReq] = useState<RepairRequest | null>(null);
  const [newStatus, setNewStatus] = useState<RepairStatus>("in_progress");
  const [staffComment, setStaffComment] = useState<string>("");
  const [toastMsg, setToastMsg] = useState<string>("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleOpenEdit = (req: RepairRequest) => {
    setActiveEditReq(req);
    setNewStatus(req.status);
    setStaffComment(req.staff_comment || "");
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeEditReq) return;

    updateRepairStatus(activeEditReq.id, newStatus, staffComment);
    setActiveEditReq(null);
    setToastMsg("อัปเดตสถานะงานซ่อมและบันทึกข้อความเรียบร้อยแล้ว ผู้เช่าจะเห็นข้อมูลอัปเดตทันที");
    setTimeout(() => setToastMsg(""), 3500);
  };

  const filteredRequests =
    filterStatus === "all"
      ? repairRequests
      : repairRequests.filter((r) => r.status === filterStatus);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--text-primary)" }}>
            งานแจ้งซ่อม
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem" }}>
            รับเรื่องแจ้งซ่อม นัดหมายช่าง และอัปเดตความคืบหน้าให้ผู้เช่าทราบ
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Filter size={16} style={{ color: "var(--text-muted)" }} />
          <select
            className="form-select"
            style={{ width: "auto", fontSize: "0.85rem", padding: "0.4rem 0.8rem" }}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">ทั้งหมด ({repairRequests.length})</option>
            <option value="pending">รอรับเรื่อง</option>
            <option value="in_progress">กำลังซ่อม</option>
            <option value="completed">เสร็จแล้ว</option>
          </select>
        </div>
      </div>

      {toastMsg && (
        <div style={{ padding: "0.85rem 1.25rem", borderRadius: "10px", background: "rgba(5, 150, 105, 0.08)", border: "1px solid rgba(5, 150, 105, 0.3)", color: "#065f46", fontSize: "0.9rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Desktop View: Repairs Table (Hidden on Mobile <= 768px) */}
      <div className="repairs-table-container table-wrap glass-card" style={{ marginBottom: "1.5rem" }}>
        <table className="custom-table">
          <thead>
            <tr>
              <th style={{ whiteSpace: "nowrap" }}>ห้องพัก</th>
              <th style={{ whiteSpace: "nowrap" }}>ผู้แจ้งซ่อม</th>
              <th style={{ minWidth: 220, whiteSpace: "nowrap" }}>เรื่องที่แจ้งซ่อม</th>
              <th style={{ whiteSpace: "nowrap" }}>หมวดหมู่</th>
              <th style={{ whiteSpace: "nowrap" }}>ระดับความเร่งด่วน</th>
              <th style={{ whiteSpace: "nowrap" }}>วันที่แจ้ง</th>
              <th style={{ whiteSpace: "nowrap" }}>สถานะ</th>
              <th style={{ textAlign: "right", whiteSpace: "nowrap" }}>การดำเนินการ</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: "center", padding: "2.5rem 1rem", color: "var(--text-muted)" }}>
                  ไม่พบรายการแจ้งซ่อมตามเงื่อนไขที่เลือก
                </td>
              </tr>
            ) : (
              filteredRequests.map((req) => {
                const room = rooms.find((r) => r.id === req.room_id);
                const rental = rentalProfiles.find((rp) => rp.id === req.rental_profile_id);
                const tenantUser = users.find((u) => u.id === rental?.user_id);

                return (
                  <tr key={req.id}>
                    <td>
                      <strong style={{ color: "var(--accent-gold)", fontSize: "1.05rem" }}>
                        ห้อง {room?.room_number || "-"}
                      </strong>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                        {tenantUser?.full_name || "-"}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                        โทร {tenantUser?.phone || "-"}
                      </div>
                    </td>
                    <td>
                      <strong style={{ color: "var(--text-primary)", display: "block" }}>
                        {req.title}
                      </strong>
                      <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", maxWidth: 260, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {req.description}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: "0.85rem" }}>{req.category}</span>
                    </td>
                    <td>
                      {req.priority === "high" && <span className="badge badge-urgent">ด่วนมาก</span>}
                      {req.priority === "medium" && <span className="badge badge-maintenance">ปานกลาง</span>}
                      {req.priority === "low" && <span className="badge" style={{ background: "rgba(255,255,255,0.05)" }}>ทั่วไป</span>}
                    </td>
                    <td style={{ fontSize: "0.82rem", color: "var(--text-secondary)", whiteSpace: "nowrap" }}>
                      {new Date(req.created_at).toLocaleDateString("th-TH")}
                    </td>
                    <td>
                      {req.status === "pending" && (
                        <span className="badge badge-pending">
                          <Clock size={12} /> รอรับเรื่อง
                        </span>
                      )}
                      {req.status === "in_progress" && (
                        <span className="badge badge-occupied">
                          <Wrench size={12} /> ประสานงานช่าง
                        </span>
                      )}
                      {req.status === "completed" && (
                        <span className="badge badge-paid">
                          <CheckCircle2 size={12} /> ซ่อมเสร็จแล้ว
                        </span>
                      )}
                    </td>
                    <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                      <button
                        onClick={() => handleOpenEdit(req)}
                        className="btn btn-secondary btn-sm"
                        title="อัปเดตสถานะงานแจ้งซ่อม"
                      >
                        <Wrench size={14} /> จัดการงานซ่อม
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile View: Repairs Cards Stream (Visible only on Mobile <= 768px) */}
      <div className="repairs-cards-container">
        {filteredRequests.map((req) => {
          const room = rooms.find((r) => r.id === req.room_id);
          const rental = rentalProfiles.find((rp) => rp.id === req.rental_profile_id);
          const tenantUser = users.find((u) => u.id === rental?.user_id);

          return (
            <div key={req.id} className="glass-card" style={{ padding: "1.25rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.75rem", marginBottom: "0.85rem" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.2rem", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--accent-gold)" }}>
                      ห้อง {room?.room_number || "ไม่ระบุ"}
                    </span>
                    <span style={{ color: "var(--text-muted)" }}>•</span>
                    <span style={{ fontSize: "0.82rem", color: "var(--text-primary)" }}>
                      {tenantUser?.full_name || "-"}
                    </span>
                    <span style={{ color: "var(--text-muted)" }}>•</span>
                    <span style={{ fontSize: "0.76rem", color: "var(--text-secondary)" }}>
                      {new Date(req.created_at).toLocaleDateString("th-TH")}
                    </span>
                  </div>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
                    {req.title}
                  </h3>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  {req.priority === "high" && <span className="badge badge-urgent">ด่วนมาก</span>}
                  {req.priority === "medium" && <span className="badge badge-maintenance">ปานกลาง</span>}
                  {req.priority === "low" && <span className="badge" style={{ background: "rgba(255,255,255,0.05)" }}>ทั่วไป</span>}

                  {req.status === "pending" && (
                    <span className="badge badge-pending">
                      <Clock size={12} /> รอรับเรื่อง
                    </span>
                  )}
                  {req.status === "in_progress" && (
                    <span className="badge badge-occupied">
                      <Wrench size={12} /> กำลังซ่อม
                    </span>
                  )}
                  {req.status === "completed" && (
                    <span className="badge badge-paid">
                      <CheckCircle2 size={12} /> เสร็จแล้ว
                    </span>
                  )}
                </div>
              </div>

              <div style={{ background: "rgba(255,255,255,0.02)", padding: "0.85rem", borderRadius: "8px", marginBottom: "0.85rem" }}>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.25rem" }}>
                  หมวดหมู่: {req.category}
                </div>
                <p style={{ color: "var(--text-primary)", fontSize: "0.88rem", lineHeight: 1.5, margin: 0 }}>
                  {req.description}
                </p>
              </div>

              {req.image_urls && req.image_urls.length > 0 && (
                <div style={{ marginBottom: "1rem" }}>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "0.4rem", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <Camera size={13} /> รูปภาพ ({req.image_urls.length} รูป - แตะเพื่อขยาย)
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.65rem" }}>
                    {req.image_urls.map((img, i) => (
                      <div
                        key={i}
                        onClick={() => setPreviewImage(img)}
                        style={{
                          width: 120,
                          height: 85,
                          borderRadius: "8px",
                          overflow: "hidden",
                          border: "1px solid var(--border-color)",
                          cursor: "pointer",
                          position: "relative",
                          background: "#000",
                        }}
                      >
                        <img
                          src={img}
                          alt="รูปงานซ่อม"
                          style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.95 }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            background: "linear-gradient(transparent, rgba(15, 23, 42, 0.8))",
                            color: "#fff",
                            fontSize: "0.68rem",
                            padding: "0.3rem 0.4rem 0.2rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.2rem",
                          }}
                        >
                          <ZoomIn size={11} /> ขยายรูป
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {req.staff_comment && req.staff_comment.trim() !== "" && req.staff_comment.trim() !== "..." && (
                <div style={{ background: "rgba(245, 158, 11, 0.08)", padding: "0.75rem 0.85rem", borderRadius: "8px", border: "1px solid rgba(245, 158, 11, 0.2)", marginBottom: "0.85rem" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--accent-gold)", fontWeight: 600, display: "block" }}>
                    บันทึกจากเจ้าหน้าที่หอพัก:
                  </span>
                  <span style={{ fontSize: "0.85rem", color: "var(--text-primary)" }}>
                    {req.staff_comment}
                  </span>
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => handleOpenEdit(req)}
                  className="btn btn-primary"
                  style={{ width: "100%", height: 44, justifyContent: "center", fontSize: "0.88rem" }}
                >
                  <Wrench size={14} /> อัปเดตสถานะงาน / บันทึกนัดช่าง
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Modal */}
      {activeEditReq && (
        <div className="modal-overlay" onClick={() => setActiveEditReq(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
                อัปเดตงานแจ้งซ่อม: {activeEditReq.title}
              </h3>
              <button
                onClick={() => setActiveEditReq(null)}
                style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", display: "flex", alignItems: "center" }}
              >
                <X size={20} />
              </button>
            </div>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "1.25rem" }}>
              ปรับสถานะความคืบหน้าและบันทึกวันเวลานัดหมายช่าง
            </p>

            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">สถานะการดำเนินการ *</label>
                <select
                  className="form-select"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as RepairStatus)}
                >
                  <option value="pending">รอรับเรื่อง (Pending)</option>
                  <option value="in_progress">กำลังประสานงาน / ช่างเข้าดู (In Progress)</option>
                  <option value="completed">ซ่อมแซมเสร็จสิ้นแล้ว (Completed)</option>
                  <option value="cancelled">ยกเลิกคำร้อง (Cancelled)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">บันทึกของเจ้าหน้าที่นิติ / วันเวลานัดหมาย *</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder="เช่น นัดช่างแอร์เข้าตรวจเช็ควันศุกร์นี้ เวลา 14:00 น., เปลี่ยนซีลยางก๊อกน้ำเรียบร้อยแล้ว"
                  value={staffComment}
                  onChange={(e) => setStaffComment(e.target.value)}
                  required
                ></textarea>
              </div>

              <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
                <button
                  type="button"
                  onClick={() => setActiveEditReq(null)}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  ยกเลิก
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>
                  บันทึกการอัปเดต
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
                fontSize: "1.2rem",
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
