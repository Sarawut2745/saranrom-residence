"use client";

import React, { useState } from "react";
import { useDormitory } from "@/lib/store/dormitory-context";
import { RoomType } from "@/types/dormitory";
import {
  Layers,
  PlusCircle,
  Edit,
  Crown,
  Lock,
  Droplets,
  Zap,
  CheckCircle2,
  X,
} from "lucide-react";

export default function OwnerRoomTypesPage() {
  const { isOwner, roomTypes, createRoomType, updateRoomType } = useDormitory();

  const [editingType, setEditingType] = useState<RoomType | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState(4500);
  const [waterRate, setWaterRate] = useState(18);
  const [electricRate, setElectricRate] = useState(8);
  const [amenitiesStr, setAmenitiesStr] = useState("แอร์, เครื่องทำน้ำอุ่น, เตียง, ตู้เสื้อผ้า, Wi-Fi");
  const [imageUrl, setImageUrl] = useState("");
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

  const handleOpenAdd = () => {
    setName("");
    setDescription("");
    setBasePrice(4500);
    setWaterRate(18);
    setElectricRate(8);
    setAmenitiesStr("เครื่องปรับอากาศ, เครื่องทำน้ำอุ่น, เตียง 5 ฟุต, Wi-Fi");
    setImageUrl("https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80");
    setIsAddOpen(true);
  };

  const handleOpenEdit = (rt: RoomType) => {
    setEditingType(rt);
    setName(rt.name);
    setDescription(rt.description);
    setBasePrice(rt.base_price);
    setWaterRate(rt.water_rate);
    setElectricRate(rt.electric_rate);
    setAmenitiesStr(rt.amenities.join(", "));
    setImageUrl(rt.image_url || "");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amenitiesArr = amenitiesStr
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (editingType) {
      updateRoomType(editingType.id, {
        name,
        description,
        base_price: basePrice,
        water_rate: waterRate,
        electric_rate: electricRate,
        amenities: amenitiesArr,
        image_url: imageUrl,
      });
      setEditingType(null);
      setToastMsg(`อัปเดตข้อมูลประเภทห้อง "${name}" เรียบร้อยแล้ว`);
    } else {
      createRoomType({
        name,
        description,
        base_price: basePrice,
        water_rate: waterRate,
        electric_rate: electricRate,
        amenities: amenitiesArr,
        image_url: imageUrl,
      });
      setIsAddOpen(false);
      setToastMsg(`สร้างประเภทห้องใหม่ "${name}" สำเร็จ`);
    }

    setTimeout(() => setToastMsg(""), 3500);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.2rem" }}>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--text-primary)" }}>
              จัดการประเภทห้อง & อัตราค่าน้ำไฟ (Masterdata Room Types)
            </h2>
            <span className="badge badge-owner">
              <Crown size={12} /> สิทธิ์เฉพาะเจ้าของหอพัก (Owner Only)
            </span>
          </div>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem" }}>
            กำหนดราคาเช่าฐาน อัตราค่าน้ำ-ค่าไฟต่อหน่วย และสิ่งอำนวยความสะดวกในห้อง
          </p>
        </div>

        <button onClick={handleOpenAdd} className="btn btn-primary">
          <PlusCircle size={16} /> เพิ่มประเภทห้องใหม่
        </button>
      </div>

      {toastMsg && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.85rem 1.25rem", borderRadius: "10px", background: "rgba(5, 150, 105, 0.08)", border: "1px solid rgba(5, 150, 105, 0.25)", color: "#065f46", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
          <CheckCircle2 size={18} style={{ color: "#065f46", flexShrink: 0 }} />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Room Types Grid */}
      <div className="grid-responsive-3">
        {roomTypes.map((rt) => (
          <div key={rt.id} className="glass-card" style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ height: 180, width: "100%", background: "#000", position: "relative" }}>
              <img
                src={rt.image_url || "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80"}
                alt={rt.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div style={{ position: "absolute", bottom: 10, left: 10, background: "rgba(0,0,0,0.75)", padding: "0.25rem 0.75rem", borderRadius: "6px" }}>
                <strong style={{ color: "var(--accent-gold)", fontSize: "1.15rem" }}>
                  ฿{rt.base_price.toLocaleString()}
                </strong>
                <span style={{ fontSize: "0.75rem", color: "#cbd5e1" }}> / เดือน</span>
              </div>
            </div>

            <div style={{ padding: "1.5rem", flex: 1, display: "flex", flexDirection: "column" }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.4rem" }}>
                {rt.name}
              </h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", lineHeight: 1.6, marginBottom: "1rem" }}>
                {rt.description}
              </p>

              {/* Utility Rates */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", background: "#f8fafc", padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--border-color)", marginBottom: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#0284c7", fontSize: "0.85rem", fontWeight: 600 }}>
                  <Droplets size={16} />
                  <span>น้ำ <strong>฿{rt.water_rate}</strong>/หน่วย</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#b45309", fontSize: "0.85rem", fontWeight: 600 }}>
                  <Zap size={16} />
                  <span>ไฟ <strong>฿{rt.electric_rate}</strong>/หน่วย</span>
                </div>
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", display: "block", marginBottom: "0.3rem" }}>
                  สิ่งอำนวยความสะดวก:
                </span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                  {rt.amenities.map((am, i) => (
                    <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", background: "rgba(5, 150, 105, 0.08)", border: "1px solid rgba(5, 150, 105, 0.2)", padding: "0.2rem 0.55rem", borderRadius: "4px", fontSize: "0.75rem", color: "#065f46", fontWeight: 500 }}>
                      <CheckCircle2 size={12} style={{ color: "#065f46" }} />
                      <span>{am}</span>
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleOpenEdit(rt)}
                className="btn btn-secondary btn-sm"
                style={{ marginTop: "auto", width: "100%" }}
              >
                <Edit size={14} /> แก้ไขข้อมูล & อัตราค่าน้ำไฟ
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {(isAddOpen || editingType) && (
        <div className="modal-overlay" onClick={() => { setIsAddOpen(false); setEditingType(null); }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
                {editingType ? `แก้ไขประเภทห้อง: ${editingType.name}` : "สร้างประเภทห้องพักใหม่"}
              </h3>
              <button
                type="button"
                onClick={() => { setIsAddOpen(false); setEditingType(null); }}
                style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: "4px" }}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "1.25rem" }}>
              กำหนดรายละเอียด อัตราค่าเช่า และค่าน้ำไฟต่อหน่วย
            </p>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">ชื่อประเภทห้องพัก *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="เช่น Deluxe Corner Room"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ fontSize: "16px" }}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">คำบรรยายห้องพัก *</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ fontSize: "16px" }}
                  required
                ></textarea>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem" }}>
                <div className="form-group">
                  <label className="form-label">ราคาเช่าฐาน (บาท) *</label>
                  <input
                    type="number"
                    className="form-input"
                    value={basePrice}
                    onChange={(e) => setBasePrice(parseFloat(e.target.value) || 0)}
                    style={{ fontSize: "16px" }}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">ค่าน้ำ (฿/หน่วย) *</label>
                  <input
                    type="number"
                    className="form-input"
                    value={waterRate}
                    onChange={(e) => setWaterRate(parseFloat(e.target.value) || 0)}
                    style={{ fontSize: "16px" }}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">ค่าไฟ (฿/หน่วย) *</label>
                  <input
                    type="number"
                    className="form-input"
                    value={electricRate}
                    onChange={(e) => setElectricRate(parseFloat(e.target.value) || 0)}
                    style={{ fontSize: "16px" }}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">สิ่งอำนวยความสะดวก (คั่นด้วยจุลภาค ,) *</label>
                <input
                  type="text"
                  className="form-input"
                  value={amenitiesStr}
                  onChange={(e) => setAmenitiesStr(e.target.value)}
                  style={{ fontSize: "16px" }}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>ลิงก์รูปภาพตัวอย่าง (Image URL)</span>
                  {imageUrl && (
                    <button
                      type="button"
                      onClick={() => setImageUrl("")}
                      style={{ background: "none", border: "none", color: "#dc2626", fontSize: "0.75rem", cursor: "pointer" }}
                    >
                      ล้างรูปภาพ
                    </button>
                  )}
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  style={{ textOverflow: "ellipsis", fontSize: "16px" }}
                />
                {imageUrl && (
                  <div style={{ marginTop: "0.6rem", display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.5rem 0.75rem", borderRadius: "8px", background: "#f8fafc", border: "1px solid var(--border-color)" }}>
                    <img
                      src={imageUrl}
                      alt="ตัวอย่างรูปห้องพัก"
                      onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                      style={{ width: "64px", height: "48px", objectFit: "cover", borderRadius: "6px", border: "1px solid #e2e8f0", flexShrink: 0 }}
                    />
                    <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
                      ตัวอย่างการแสดงผลรูปห้องพัก
                    </div>
                  </div>
                )}
              </div>

              <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
                <button
                  type="button"
                  onClick={() => { setIsAddOpen(false); setEditingType(null); }}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  ยกเลิก
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>
                  บันทึกข้อมูลประเภทห้อง
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
