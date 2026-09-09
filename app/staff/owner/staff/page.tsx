"use client";

import React, { useState } from "react";
import { useDormitory } from "@/lib/store/dormitory-context";
import {
  UserPlus,
  ShieldCheck,
  Trash2,
  Crown,
  Lock,
  Mail,
  Phone,
  CheckCircle2,
  X,
} from "lucide-react";

export default function OwnerStaffManagementPage() {
  const { isOwner, users, staffProfiles, createStaff, deleteStaff } = useDormitory();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("staff1234");
  const [position, setPosition] = useState("เจ้าหน้าที่นิติบุคคลประจำตึก");
  const [isNewStaffOwner, setIsNewStaffOwner] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  if (!isOwner) {
    return (
      <div className="glass-card" style={{ padding: "3rem", textAlign: "center" }}>
        <Lock size={48} style={{ color: "#dc2626", marginBottom: "1rem" }} />
        <h2 style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.5rem" }}>
          สงวนสิทธิ์เฉพาะเจ้าของหอพัก (Owner Only)
        </h2>
        <p style={{ color: "var(--text-secondary)" }}>
          คุณไม่มีสิทธิ์เข้าถึงหน้านี้ กรุณาเข้าสู่ระบบด้วยบัญชีเจ้าของหอพัก (Owner)
        </p>
      </div>
    );
  }

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) return;

    createStaff({
      full_name: fullName,
      phone,
      email,
      password,
      position,
      is_owner: isNewStaffOwner,
    });

    setFullName("");
    setPhone("");
    setEmail("");
    setPassword("staff1234");
    setPosition("เจ้าหน้าที่นิติบุคคลประจำตึก");
    setIsNewStaffOwner(false);
    setIsModalOpen(false);
    setToastMsg(`เพิ่มบัญชีพนักงานนิติบุคคลใหม่สำเร็จ ผู้ใช้สามารถล็อกอินด้วยอีเมล "${email}" และรหัสผ่าน "${password}" ได้ทันที`);
    setTimeout(() => setToastMsg(""), 5000);
  };

  const handleDelete = (userId: string, name: string) => {
    if (confirm(`ยืนยันที่จะลบบัญชีพนักงาน "${name}" หรือไม่?`)) {
      deleteStaff(userId);
      setToastMsg("ลบบัญชีพนักงานเรียบร้อยแล้ว");
      setTimeout(() => setToastMsg(""), 3500);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.2rem" }}>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--text-primary)" }}>
              จัดการบัญชีเจ้าหน้าที่นิติบุคคล (Staff Accounts)
            </h2>
            <span className="badge badge-owner">
              <Crown size={12} /> สิทธิ์เฉพาะเจ้าของหอพัก (Owner Only)
            </span>
          </div>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem" }}>
            สร้าง ลบ และกำหนดตำแหน่งการทำงานของเจ้าหน้าที่นิติบุคคล
          </p>
        </div>

        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
          <UserPlus size={16} /> เพิ่มบัญชี Staff ใหม่
        </button>
      </div>

      {toastMsg && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.85rem 1.25rem", borderRadius: "10px", background: "rgba(5, 150, 105, 0.08)", border: "1px solid rgba(5, 150, 105, 0.25)", color: "#065f46", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
          <CheckCircle2 size={18} style={{ color: "#065f46", flexShrink: 0 }} />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Staff Table */}
      <div className="table-wrap glass-card">
        <table className="custom-table">
          <thead>
            <tr>
              <th>ชื่อ-นามสกุล</th>
              <th>ตำแหน่งงาน</th>
              <th>เบอร์โทรศัพท์</th>
              <th>อีเมล</th>
              <th>ระดับสิทธิ์</th>
              <th style={{ textAlign: "right" }}>การดำเนินการ</th>
            </tr>
          </thead>
          <tbody>
            {staffProfiles.map((sp) => {
              const u = users.find((item) => item.id === sp.user_id);
              if (!u) return null;

              return (
                <tr key={sp.id}>
                  <td>
                    <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                      {u.full_name}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      สร้างเมื่อ: {new Date(u.created_at).toLocaleDateString("th-TH")}
                    </div>
                  </td>
                  <td>{sp.position}</td>
                  <td>{u.phone || "-"}</td>
                  <td>{u.email}</td>
                  <td>
                    {sp.is_owner ? (
                      <span className="badge badge-owner">
                        <Crown size={12} /> เจ้าของหอพัก (Owner)
                      </span>
                    ) : (
                      <span className="badge badge-maintenance">
                        <ShieldCheck size={12} /> เจ้าหน้าที่นิติบุคคล (Staff)
                      </span>
                    )}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    {!sp.is_owner ? (
                      <button
                        onClick={() => handleDelete(u.id, u.full_name)}
                        className="btn btn-danger btn-sm"
                        title="ลบบัญชีนี้"
                      >
                        <Trash2 size={14} /> ลบบัญชี
                      </button>
                    ) : (
                      <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                        บัญชีหลัก
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Create Staff Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
                เพิ่มบัญชีเจ้าหน้าที่ใหม่
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: "4px" }}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "1.25rem" }}>
              กรอกข้อมูลเพื่อสร้างบัญชีเข้าใช้งานระบบนิติบุคคล
            </p>

            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label className="form-label">ชื่อ-นามสกุล *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="เช่น คุณสมศรี พิทักษ์ธรรม"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  style={{ fontSize: "16px" }}
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className="form-group">
                  <label className="form-label">เบอร์โทรศัพท์ *</label>
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="08x-xxx-xxxx"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{ fontSize: "16px" }}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">อีเมลสำหรับล็อกอิน *</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="staff@dormitory.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ fontSize: "16px" }}
                    required
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className="form-group">
                  <label className="form-label">รหัสผ่านเริ่มต้น *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="กำหนดรหัสผ่าน เช่น staff1234"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ fontSize: "16px" }}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">ตำแหน่ง / หน้าที่รับผิดชอบ *</label>
                <input
                  type="text"
                  className="form-input"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  style={{ fontSize: "16px" }}
                  required
                />
              </div>

              <div className="form-group">
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", color: "var(--text-primary)", fontSize: "0.9rem" }}>
                  <input
                    type="checkbox"
                    checked={isNewStaffOwner}
                    onChange={(e) => setIsNewStaffOwner(e.target.checked)}
                    style={{ width: 18, height: 18 }}
                  />
                  <span>มอบสิทธิ์เจ้าของหอพัก (Owner Flag: is_owner = true)</span>
                </label>
              </div>

              <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  ยกเลิก
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>
                  สร้างบัญชี Staff ทันที
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
