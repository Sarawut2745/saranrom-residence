"use client";

import React, { useState } from "react";
import { useDormitory } from "@/lib/store/dormitory-context";
import { Room, RoomStatus } from "@/types/dormitory";
import {
  DoorOpen,
  PlusCircle,
  Building,
  CheckCircle2,
  Users,
  Wrench,
  Filter,
  X,
} from "lucide-react";

export default function StaffRoomsPage() {
  const { rooms, roomTypes, rentalProfiles, users, updateRoomStatus, createRoom, isOwner } =
    useDormitory();

  const [selectedFloor, setSelectedFloor] = useState<string>("all");
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [newStatus, setNewStatus] = useState<RoomStatus>("available");
  const [toastMsg, setToastMsg] = useState<string>("");

  // Add room state (for Owner or Staff)
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newRoomNumber, setNewRoomNumber] = useState("");
  const [newRoomTypeId, setNewRoomTypeId] = useState(roomTypes[0]?.id || "");
  const [newFloor, setNewFloor] = useState(2);
  const [newMonthlyRent, setNewMonthlyRent] = useState(4500);

  const floors = Array.from(new Set(rooms.map((r) => r.floor))).sort((a, b) => a - b);

  const filteredRooms =
    selectedFloor === "all"
      ? rooms
      : rooms.filter((r) => r.floor.toString() === selectedFloor);

  const handleOpenStatusModal = (room: Room) => {
    setEditingRoom(room);
    setNewStatus(room.status);
  };

  const handleSaveStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRoom) return;

    updateRoomStatus(editingRoom.id, newStatus);
    setEditingRoom(null);
    setToastMsg(`อัปเดตสถานะห้อง ${editingRoom.room_number} เป็น "${newStatus}" เรียบร้อยแล้ว`);
    setTimeout(() => setToastMsg(""), 3500);
  };

  const handleAddRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomNumber.trim()) return;

    createRoom({
      room_number: newRoomNumber.trim(),
      room_type_id: newRoomTypeId,
      floor: newFloor,
      status: "available",
      monthly_rent: newMonthlyRent,
    });

    setIsAddOpen(false);
    setNewRoomNumber("");
    setToastMsg(`เพิ่มห้องพักใหม่หมายเลข ${newRoomNumber} สำเร็จ`);
    setTimeout(() => setToastMsg(""), 3500);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--text-primary)" }}>
            ผังห้องพักและจัดการสถานะ (Rooms Management)
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem" }}>
            ตรวจสอบสถานะความว่าง และปรับเปลี่ยนสถานะห้องพัก (ว่าง / มีผู้เช่า / ซ่อมบำรุง)
          </p>
        </div>

        <button onClick={() => setIsAddOpen(true)} className="btn btn-primary">
          <PlusCircle size={16} /> เพิ่มห้องพักใหม่
        </button>
      </div>

      {toastMsg && (
        <div style={{ padding: "0.85rem 1.25rem", borderRadius: "10px", background: "rgba(5, 150, 105, 0.08)", border: "1px solid rgba(5, 150, 105, 0.3)", color: "#065f46", fontSize: "0.9rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Floor Filter Pills */}
      <div style={{ display: "flex", gap: "0.6rem", marginBottom: "1.5rem", flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
          <Filter size={15} /> กรองตามชั้น:
        </span>
        <button
          onClick={() => setSelectedFloor("all")}
          className={`btn btn-sm ${selectedFloor === "all" ? "btn-primary" : "btn-secondary"}`}
        >
          ทุกชั้น ({rooms.length} ห้อง)
        </button>
        {floors.map((fl) => (
          <button
            key={fl}
            onClick={() => setSelectedFloor(fl.toString())}
            className={`btn btn-sm ${selectedFloor === fl.toString() ? "btn-primary" : "btn-secondary"}`}
          >
            ชั้น {fl} ({rooms.filter((r) => r.floor === fl).length} ห้อง)
          </button>
        ))}
      </div>

      {/* Room Grid */}
      <div className="grid-responsive-3">
        {filteredRooms.map((room) => {
          const roomType = roomTypes.find((rt) => rt.id === room.room_type_id);
          const rental = rentalProfiles.find((rp) => rp.room_id === room.id);
          const tenantUser = users.find((u) => u.id === rental?.user_id);

          return (
            <div
              key={room.id}
              className="glass-card"
              style={{
                padding: "1.5rem",
                border:
                  room.status === "available"
                    ? "1px solid rgba(16, 185, 129, 0.3)"
                    : room.status === "occupied"
                    ? "1px solid rgba(59, 130, 246, 0.3)"
                    : "1px solid rgba(245, 158, 11, 0.3)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                <div>
                  <span style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--text-primary)" }}>
                    ห้อง {room.room_number}
                  </span>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                    ชั้น {room.floor} • {roomType?.name}
                  </div>
                </div>

                <span
                  className={`badge ${
                    room.status === "available"
                      ? "badge-available"
                      : room.status === "occupied"
                      ? "badge-occupied"
                      : "badge-maintenance"
                  }`}
                >
                  <span className="badge-dot"></span>
                  {room.status === "available"
                    ? "ว่าง"
                    : room.status === "occupied"
                    ? "มีผู้เช่า"
                    : "ปิดปรับปรุง"}
                </span>
              </div>

              <div style={{ background: "rgba(255,255,255,0.02)", padding: "0.85rem", borderRadius: "8px", marginBottom: "1rem", fontSize: "0.85rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
                  <span style={{ color: "var(--text-muted)" }}>อัตราค่าเช่า:</span>
                  <strong style={{ color: "var(--accent-gold)" }}>฿{room.monthly_rent.toLocaleString()} / เดือน</strong>
                </div>

                {rental && tenantUser ? (
                  <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "0.4rem", marginTop: "0.4rem" }}>
                    <span style={{ color: "var(--text-muted)", display: "block", fontSize: "0.75rem" }}>ผู้เช่าปัจจุบัน:</span>
                    <strong style={{ color: "var(--text-primary)" }}>{tenantUser.full_name}</strong>
                    <div style={{ color: "var(--text-secondary)", fontSize: "0.75rem" }}>โทร: {tenantUser.phone}</div>
                  </div>
                ) : (
                  <div style={{ color: "var(--text-muted)", fontStyle: "italic", fontSize: "0.8rem" }}>
                    ยังไม่มีผู้เช่าผูกกับห้องนี้
                  </div>
                )}
              </div>

              <button
                onClick={() => handleOpenStatusModal(room)}
                className="btn btn-secondary btn-sm"
                style={{ width: "100%" }}
              >
                ปรับเปลี่ยนสถานะห้องพัก
              </button>
            </div>
          );
        })}
      </div>

      {/* Edit Status Modal */}
      {editingRoom && (
        <div className="modal-overlay" onClick={() => setEditingRoom(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
                ปรับสถานะห้องพัก {editingRoom.room_number}
              </h3>
              <button
                onClick={() => setEditingRoom(null)}
                style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", display: "flex", alignItems: "center" }}
              >
                <X size={20} />
              </button>
            </div>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "1.25rem" }}>
              การเปลี่ยนสถานะจะมีผลทันทีต่อการแสดงผลบนหน้าแรกของผู้เยี่ยมชม
            </p>

            <form onSubmit={handleSaveStatus}>
              <div className="form-group">
                <label className="form-label">เลือกสถานะห้องใหม่ *</label>
                <select
                  className="form-select"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as RoomStatus)}
                >
                  <option value="available">ห้องว่าง (Available) - เปิดให้เช่า</option>
                  <option value="occupied">มีผู้เช่าแล้ว (Occupied)</option>
                  <option value="maintenance">ปิดปรับปรุง / ซ่อมแซม (Maintenance)</option>
                </select>
              </div>

              <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
                <button
                  type="button"
                  onClick={() => setEditingRoom(null)}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  ยกเลิก
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>
                  บันทึกการเปลี่ยนแปลง
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Room Modal */}
      {isAddOpen && (
        <div className="modal-overlay" onClick={() => setIsAddOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
                เพิ่มห้องพักใหม่ในระบบ
              </h3>
              <button
                onClick={() => setIsAddOpen(false)}
                style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", display: "flex", alignItems: "center" }}
              >
                <X size={20} />
              </button>
            </div>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "1.25rem" }}>
              กำหนดหมายเลขห้อง ชั้น และประเภทห้องพัก
            </p>

            <form onSubmit={handleAddRoom}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className="form-group">
                  <label className="form-label">หมายเลขห้อง *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="เช่น 204, 303"
                    value={newRoomNumber}
                    onChange={(e) => setNewRoomNumber(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">ชั้น *</label>
                  <input
                    type="number"
                    className="form-input"
                    value={newFloor}
                    onChange={(e) => setNewFloor(parseInt(e.target.value) || 2)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">ประเภทห้องพัก *</label>
                <select
                  className="form-select"
                  value={newRoomTypeId}
                  onChange={(e) => {
                    setNewRoomTypeId(e.target.value);
                    const foundType = roomTypes.find((rt) => rt.id === e.target.value);
                    if (foundType) setNewMonthlyRent(foundType.base_price);
                  }}
                >
                  {roomTypes.map((rt) => (
                    <option key={rt.id} value={rt.id}>
                      {rt.name} (ราคาเริ่มต้น ฿{rt.base_price.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">ค่าเช่าต่อเดือน (บาท) *</label>
                <input
                  type="number"
                  className="form-input"
                  value={newMonthlyRent}
                  onChange={(e) => setNewMonthlyRent(parseFloat(e.target.value) || 0)}
                  required
                />
              </div>

              <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  ยกเลิก
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>
                  บันทึกห้องใหม่
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
