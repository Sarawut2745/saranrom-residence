"use client";

import React, { useState } from "react";
import { useDormitory } from "@/lib/store/dormitory-context";
import {
  Users,
  UserPlus,
  KeyRound,
  ShieldAlert,
  CheckCircle2,
  Phone,
  Mail,
  Building,
  Calendar,
  CreditCard,
  DoorOpen,
  Lock,
  PlusCircle,
  FileText,
  X,
  AlertTriangle,
  Search,
} from "lucide-react";

export default function StaffTenantsPage() {
  const {
    rentalProfiles,
    users,
    rooms,
    contracts,
    roomTypes,
    resetTenantPassword,
    createTenantWithContract,
  } = useDormitory();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [resetResult, setResetResult] = useState<{
    tenantName: string;
    tempPass: string;
  } | null>(null);

  // Form states for creating a new tenant
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("tenant1234");
  const [idCard, setIdCard] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [moveInDate, setMoveInDate] = useState(new Date().toISOString().split("T")[0]);
  const [depositAmount, setDepositAmount] = useState(9000);

  const [formError, setFormError] = useState("");
  const [toastMsg, setToastMsg] = useState("");

  const availableRooms = rooms.filter((r) => r.status === "available");

  const handleOpenCreateModal = () => {
    setFormError("");
    setFullName("");
    setPhone("");
    setEmail("");
    setPassword("tenant1234");
    setIdCard("");
    setEmergencyContact("");
    setEmergencyPhone("");
    setStartDate(new Date().toISOString().split("T")[0]);
    setEndDate(
      new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
    );
    setMoveInDate(new Date().toISOString().split("T")[0]);

    if (availableRooms.length > 0) {
      const firstRoom = availableRooms[0];
      setSelectedRoomId(firstRoom.id);
      const rt = roomTypes.find((t) => t.id === firstRoom.room_type_id);
      setDepositAmount((rt?.base_price || 4500) * 2);
    } else {
      setSelectedRoomId("");
    }
    setIsCreateModalOpen(true);
  };

  const handleRoomChange = (roomId: string) => {
    setSelectedRoomId(roomId);
    const room = rooms.find((r) => r.id === roomId);
    if (room) {
      setDepositAmount(room.monthly_rent * 2);
    }
  };

  const handleCreateTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!fullName || !phone || !email || !selectedRoomId || !idCard || !emergencyContact) {
      setFormError("กรุณากรอกข้อมูลที่จำเป็น (*) ให้ครบถ้วน");
      return;
    }

    const res = await createTenantWithContract({
      full_name: fullName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      password: password.trim(),
      id_card_number: idCard.trim(),
      emergency_contact: emergencyContact.trim(),
      emergency_phone: emergencyPhone.trim(),
      room_id: selectedRoomId,
      start_date: startDate,
      end_date: endDate,
      move_in_date: moveInDate,
      deposit_amount: depositAmount,
    });

    if (res.success) {
      setIsCreateModalOpen(false);
      setToastMsg(`สร้างบัญชีผู้เช่าและทำสัญญาห้องสำเร็จเรียบร้อย`);
      setTimeout(() => setToastMsg(""), 4000);
    } else {
      setFormError(res.error || "เกิดข้อผิดพลาดในการสร้างบัญชี");
    }
  };

  const handleResetPassword = async (userId: string, tenantName: string) => {
    const res = await resetTenantPassword(userId);
    setResetResult({
      tenantName,
      tempPass: res.tempPassword,
    });
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--text-primary)" }}>
            จัดการบัญชีผู้เช่า & ทำสัญญาห้องพัก (Tenant Management)
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem" }}>
            เฉพาะนิติบุคคลและเจ้าของหอพักเท่านั้นที่มีสิทธิ์เพิ่มบัญชีผู้เช่าและกำหนดรหัสผ่านเข้าสู่ระบบ
          </p>
        </div>

        <button onClick={handleOpenCreateModal} className="btn btn-primary">
          <UserPlus size={16} /> + เพิ่มบัญชีผู้เช่าใหม่ & ทำสัญญา
        </button>
      </div>

      {toastMsg && (
        <div style={{ padding: "1rem 1.25rem", borderRadius: "10px", background: "rgba(5, 150, 105, 0.08)", border: "1px solid rgba(5, 150, 105, 0.3)", color: "#065f46", fontSize: "0.92rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <CheckCircle2 size={20} style={{ flexShrink: 0 }} />
          <span>{toastMsg}</span>
        </div>
      )}

      {resetResult && (
        <div
          className="glass-card"
          style={{
            padding: "1.5rem",
            marginBottom: "1.5rem",
            background: "rgba(5, 150, 105, 0.08)",
            border: "1px solid rgba(5, 150, 105, 0.3)",
            borderRadius: "12px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#065f46", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <CheckCircle2 size={18} /> รีเซ็ตรหัสผ่านให้ {resetResult.tenantName} สำเร็จ!
              </h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", margin: "0.4rem 0" }}>
                รหัสผ่านชั่วคราวใหม่คือ:
              </p>
              <div
                style={{
                  display: "inline-block",
                  padding: "0.4rem 1.25rem",
                  background: "#000",
                  borderRadius: "8px",
                  fontSize: "1.3rem",
                  fontWeight: 800,
                  color: "var(--accent-gold)",
                  letterSpacing: "0.1em",
                }}
              >
                {resetResult.tempPass}
              </div>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>
                * สามารถนำรหัสผ่านนี้แจ้งผู้เช่าเพื่อใช้เข้าสู่ระบบได้ทันที
              </p>
            </div>
            <button
              onClick={() => setResetResult(null)}
              style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", display: "flex", alignItems: "center" }}
              title="ปิด"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="glass-card" style={{ padding: "0.85rem 1.25rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.6rem" }}>
        <Search size={18} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
        <input
          type="text"
          className="form-input"
          placeholder="ค้นหาผู้เช่าตามเลขห้อง, ชื่อ-นามสกุล, เบอร์โทร หรืออีเมล..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ border: "none", background: "transparent", width: "100%", padding: "0.35rem 0", boxShadow: "none" }}
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => setSearchTerm("")}
            style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
            title="ล้างการค้นหา"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Desktop View: Tenants Table (Hidden on Mobile <= 768px) */}
      <div className="tenants-table-container table-wrap glass-card">
        <table className="custom-table">
          <thead>
            <tr>
              <th style={{ whiteSpace: "nowrap" }}>ห้องพัก</th>
              <th style={{ whiteSpace: "nowrap" }}>ชื่อ-นามสกุลผู้เช่า</th>
              <th style={{ whiteSpace: "nowrap" }}>อีเมล (ล็อกอิน)</th>
              <th style={{ whiteSpace: "nowrap" }}>เบอร์โทรศัพท์</th>
              <th style={{ whiteSpace: "nowrap" }}>เลขบัตรประชาชน</th>
              <th style={{ whiteSpace: "nowrap" }}>ผู้ติดต่อฉุกเฉิน</th>
              <th style={{ whiteSpace: "nowrap" }}>สถานะสัญญา</th>
              <th style={{ textAlign: "right", whiteSpace: "nowrap" }}>การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            {rentalProfiles
              .filter((profile) => {
                if (!searchTerm) return true;
                const u = users.find((item) => item.id === profile.user_id);
                const r = rooms.find((item) => item.id === profile.room_id);
                const term = searchTerm.toLowerCase();
                return (
                  r?.room_number.toLowerCase().includes(term) ||
                  u?.full_name.toLowerCase().includes(term) ||
                  u?.phone.toLowerCase().includes(term) ||
                  u?.email.toLowerCase().includes(term)
                );
              })
              .map((profile) => {
                const u = users.find((item) => item.id === profile.user_id);
                const r = rooms.find((item) => item.id === profile.room_id);
                const c = contracts.find((item) => item.rental_profile_id === profile.id);

                return (
                  <tr key={profile.id}>
                    <td>
                      <strong style={{ fontSize: "1.1rem", color: "var(--accent-gold)" }}>
                        ห้อง {r?.room_number || "-"}
                      </strong>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                        ชั้น {r?.floor || "-"} • ค่าเช่า ฿{r?.monthly_rent.toLocaleString()}
                      </div>
                    </td>
                    <td>
                      <strong style={{ color: "var(--text-primary)" }}>{u?.full_name}</strong>
                    </td>
                    <td>
                      <span style={{ color: "#2563eb", fontWeight: 500 }}>{u?.email}</span>
                    </td>
                    <td>{u?.phone}</td>
                    <td style={{ fontSize: "0.85rem" }}>{profile.id_card_number}</td>
                    <td>
                      <div style={{ fontSize: "0.85rem" }}>{profile.emergency_contact}</div>
                      {profile.emergency_phone && (
                        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>โทร {profile.emergency_phone}</div>
                      )}
                    </td>
                    <td>
                      <span className="badge badge-available">
                        {c?.status || "Active"}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: "0.4rem", alignItems: "center" }}>
                        <button
                          onClick={() => handleResetPassword(profile.user_id, u?.full_name || "ผู้เช่า")}
                          className="btn btn-secondary btn-sm"
                          title="กรณีผู้เช่าลืมรหัสผ่าน"
                        >
                          <KeyRound size={14} /> รีเซ็ตรหัสผ่าน
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {/* Mobile View: Tenants Cards Stream (Visible only on Mobile <= 768px) */}
      <div className="tenants-cards-container">
        {rentalProfiles
          .filter((profile) => {
            if (!searchTerm) return true;
            const u = users.find((item) => item.id === profile.user_id);
            const r = rooms.find((item) => item.id === profile.room_id);
            const term = searchTerm.toLowerCase();
            return (
              r?.room_number.toLowerCase().includes(term) ||
              u?.full_name.toLowerCase().includes(term) ||
              u?.phone.toLowerCase().includes(term) ||
              u?.email.toLowerCase().includes(term)
            );
          })
          .map((profile) => {
            const u = users.find((item) => item.id === profile.user_id);
            const r = rooms.find((item) => item.id === profile.room_id);
            const c = contracts.find((item) => item.rental_profile_id === profile.id);

            return (
              <div key={`tenant-card-${profile.id}`} className="tenant-mobile-card">
                <div className="tenant-card-header">
                  <div>
                    <div className="tenant-card-room">ห้อง {r?.room_number || "-"}</div>
                    <div className="tenant-card-sub">ชั้น {r?.floor || "-"} • ค่าเช่า ฿{r?.monthly_rent.toLocaleString()} / เดือน</div>
                  </div>
                  <span className="badge badge-available">
                    {c?.status || "Active"}
                  </span>
                </div>

                <div className="tenant-card-name-row">
                  <div className="tenant-card-name">{u?.full_name || "-"}</div>
                  <div className="tenant-card-contact-row">
                    <span style={{ color: "#2563eb", fontWeight: 500 }}>{u?.email}</span>
                    {u?.phone && (
                      <>
                        {" "}• <span style={{ color: "var(--text-primary)" }}>โทร {u.phone}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="tenant-card-grid">
                  <div className="tenant-grid-item">
                    <span className="tenant-grid-label">เลขบัตรประชาชน</span>
                    <span className="tenant-grid-val">{profile.id_card_number}</span>
                  </div>
                  <div className="tenant-grid-item">
                    <span className="tenant-grid-label">ผู้ติดต่อฉุกเฉิน</span>
                    <span className="tenant-grid-val">
                      {profile.emergency_contact}
                      {profile.emergency_phone && (
                        <span style={{ fontSize: "0.74rem", color: "var(--text-muted)", display: "block" }}>
                          โทร {profile.emergency_phone}
                        </span>
                      )}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleResetPassword(profile.user_id, u?.full_name || "ผู้เช่า")}
                  className="btn btn-secondary tenant-card-btn"
                >
                  <KeyRound size={15} /> รีเซ็ตรหัสผ่านผู้เช่า
                </button>
              </div>
            );
          })}
      </div>

      {/* Modal: Create Tenant & Assign Room */}
      {isCreateModalOpen && (
        <div className="modal-overlay" onClick={() => setIsCreateModalOpen(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ padding: "2.25rem", maxWidth: 620 }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.75rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <UserPlus size={22} style={{ color: "var(--accent-gold)" }} />
                <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)" }}>
                  เพิ่มบัญชีผู้เช่าใหม่และทำสัญญาเช่า
                </h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", display: "flex", alignItems: "center" }}
                title="ปิด"
              >
                <X size={20} />
              </button>
            </div>

            {formError && (
              <div style={{ padding: "0.75rem 1rem", borderRadius: "8px", background: "rgba(244, 63, 94, 0.15)", border: "1px solid rgba(244, 63, 94, 0.3)", color: "#fda4af", fontSize: "0.88rem", marginBottom: "1.25rem" }}>
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateTenant}>
              {/* 1. Room Selection */}
              <div style={{ background: "rgba(245, 158, 11, 0.08)", padding: "1rem", borderRadius: "10px", border: "1px solid rgba(245, 158, 11, 0.25)", marginBottom: "1.25rem" }}>
                <label className="form-label" style={{ fontWeight: 700, color: "var(--accent-gold)", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <DoorOpen size={16} /> เลือกห้องพักที่ว่างอยู่ (Room Selection) *
                </label>
                {availableRooms.length === 0 ? (
                  <div style={{ color: "#dc2626", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <AlertTriangle size={14} /> ขณะนี้ไม่มีห้องว่างเลย (กรุณาปรับสถานะห้องเป็น 'ว่าง' ในเมนูผังห้องพักก่อน)
                  </div>
                ) : (
                  <select
                    className="form-select"
                    value={selectedRoomId}
                    onChange={(e) => handleRoomChange(e.target.value)}
                    required
                  >
                    {availableRooms.map((r) => {
                      const rt = roomTypes.find((t) => t.id === r.room_type_id);
                      return (
                        <option key={r.id} value={r.id}>
                          ห้อง {r.room_number} (ชั้น {r.floor} • {rt?.name} • ฿{r.monthly_rent.toLocaleString()}/เดือน)
                        </option>
                      );
                    })}
                  </select>
                )}
              </div>

              {/* 2. Personal Information */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">ชื่อ-นามสกุลผู้เช่า *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="เช่น นายธนากร สดใส"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">เบอร์โทรศัพท์ติดต่อ *</label>
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="08x-xxx-xxxx"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* 3. Credentials */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">อีเมลสำหรับล็อกอินเข้าเว็บ *</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="tenant@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">รหัสผ่านเริ่มต้นสำหรับผู้เช่า *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="กำหนดรหัสผ่าน เช่น pass1234"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* 4. ID Card & Emergency Contact */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">เลขประจำตัวประชาชน (13 หลัก) *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="x-xxxx-xxxxx-xx-x"
                    value={idCard}
                    onChange={(e) => setIdCard(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">ผู้ติดต่อฉุกเฉิน (ชื่อ & ความสัมพันธ์) *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="เช่น คุณแม่ (สายใจ)"
                    value={emergencyContact}
                    onChange={(e) => setEmergencyContact(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* 5. Contract Dates & Deposit */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem", marginBottom: "1.5rem" }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">วันที่ย้ายเข้าพัก *</label>
                  <input
                    type="date"
                    className="form-input"
                    value={moveInDate}
                    onChange={(e) => setMoveInDate(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">วันหมดสัญญาเช่า *</label>
                  <input
                    type="date"
                    className="form-input"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">เงินประกันมัดจำ (บาท) *</label>
                  <input
                    type="number"
                    className="form-input"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 2, fontWeight: 700 }}
                  disabled={availableRooms.length === 0}
                >
                  บันทึกสร้างบัญชีผู้เช่า & ทำสัญญา
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
