"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useDormitory } from "@/lib/store/dormitory-context";
import {
  Receipt,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Droplets,
  Building,
  Filter,
  Search,
  Eye,
  Printer,
  X,
  Smartphone,
  ExternalLink,
} from "lucide-react";
import OfficialBillModal from "@/components/billing/OfficialBillModal";

export default function StaffBillsPage() {
  const { bills, rooms, roomTypes, rentalProfiles, users, paymentSlips, createBill } = useDormitory();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingBill, setViewingBill] = useState<any | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchRoom, setSearchRoom] = useState<string>("");

  // Bill form states
  const [selectedRoomId, setSelectedRoomId] = useState<string>(rooms[0]?.id || "");
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [waterPrev, setWaterPrev] = useState<number>(128);
  const [waterCurr, setWaterCurr] = useState<number>(135);
  const [electricPrev, setElectricPrev] = useState<number>(510);
  const [electricCurr, setElectricCurr] = useState<number>(575);
  const [otherFees, setOtherFees] = useState<number>(100);
  const [dueDate, setDueDate] = useState<string>(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [successMsg, setSuccessMsg] = useState<string>("");

  // Calculate units and fees
  const targetRoom = rooms.find((r) => r.id === selectedRoomId);
  const targetRoomType = roomTypes.find((rt) => rt.id === targetRoom?.room_type_id);
  const waterRate = targetRoomType?.water_rate || 18;
  const electricRate = targetRoomType?.electric_rate || 8;

  const waterUnits = Math.max(0, waterCurr - waterPrev);
  const electricUnits = Math.max(0, electricCurr - electricPrev);
  const waterFee = waterUnits * waterRate;
  const electricFee = electricUnits * electricRate;
  const roomRent = targetRoom?.monthly_rent || 4500;
  const totalAmount = roomRent + waterFee + electricFee + otherFees;

  const handleCreateBill = (e: React.FormEvent) => {
    e.preventDefault();
    createBill({
      room_id: selectedRoomId,
      month,
      year,
      water_meter_previous: waterPrev,
      water_meter_current: waterCurr,
      electric_meter_previous: electricPrev,
      electric_meter_current: electricCurr,
      other_fees: otherFees,
      due_date: dueDate,
    });

    setIsModalOpen(false);
    setSuccessMsg("ออกใบแจ้งหนี้ประจำเดือนเรียบร้อยแล้ว ผู้เช่าสามารถดูบิลและชำระเงินได้ทันที");
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const filteredBills = bills.filter((b) => {
    const r = rooms.find((item) => item.id === b.room_id);
    const matchesStatus = filterStatus === "all" || b.status === filterStatus;
    const matchesRoom = !searchRoom || r?.room_number.includes(searchRoom);
    return matchesStatus && matchesRoom;
  });

  return (
    <div>
      <div className="bills-page-header">
        <div>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--text-primary)" }}>
            จัดการใบแจ้งหนี้ & จดมิเตอร์น้ำ-ไฟ
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem" }}>
            บันทึกเลขมิเตอร์ คำนวณยอดสุทธิ และออกบิลรายเดือนให้แต่ละห้อง
          </p>
        </div>

        <div className="bills-header-actions">
          <Link
            href="/staff/meter-reading"
            target="_blank"
            rel="noopener noreferrer"
            className="btn"
            style={{
              background: "rgba(79, 70, 229, 0.08)",
              border: "1.5px solid #4f46e5",
              color: "#4f46e5",
              fontWeight: 750,
              display: "inline-flex",
              alignItems: "center",
              gap: "0.45rem",
              padding: "0.6rem 1.1rem",
              borderRadius: "10px",
              textDecoration: "none",
            }}
          >
            <Smartphone size={17} /> โหมดเดินจดมิเตอร์บนมือถือ <ExternalLink size={14} style={{ opacity: 0.7 }} />
          </Link>

          <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
            <PlusCircle size={16} /> ออกบิลใหม่ / บันทึกมิเตอร์
          </button>
        </div>
      </div>

      {successMsg && (
        <div style={{ padding: "0.85rem 1.25rem", borderRadius: "10px", background: "rgba(5, 150, 105, 0.08)", border: "1px solid rgba(5, 150, 105, 0.3)", color: "#065f46", fontSize: "0.9rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Filter and Search Bar (Desktop Inline / Mobile Stacked) */}
      <div className="bills-filter-bar glass-card">
        <div className="bills-filter-group">
          <div className="bills-filter-label">
            <Filter size={16} style={{ color: "var(--text-muted)" }} />
            <span>สถานะบิล</span>
          </div>
          <select
            className="form-select bills-filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">ทั้งหมด ({bills.length})</option>
            <option value="unpaid">รอชำระ (Unpaid)</option>
            <option value="pending_verification">รอตรวจสลิป (Pending)</option>
            <option value="paid">ชำระแล้ว (Paid)</option>
          </select>
        </div>

        <div className="bills-search-group">
          <div className="bills-search-label">
            <Search size={16} style={{ color: "var(--text-muted)" }} />
            <span>ค้นหาห้อง</span>
          </div>
          <input
            type="text"
            className="form-input bills-search-input"
            placeholder="ค้นหาตามเลขห้อง เช่น 101..."
            value={searchRoom}
            onChange={(e) => setSearchRoom(e.target.value)}
          />
        </div>
      </div>

      {/* Desktop View: Full Table (Hidden on Mobile <= 768px) */}
      <div className="bills-table-container table-wrap glass-card">
        <table className="custom-table">
          <thead>
            <tr>
              <th>ห้องพัก</th>
              <th>งวดเดือน/ปี</th>
              <th>กำหนดชำระ</th>
              <th>ค่าห้อง</th>
              <th>มิเตอร์น้ำ (หน่วย/เงิน)</th>
              <th>มิเตอร์ไฟ (หน่วย/เงิน)</th>
              <th>ส่วนกลาง</th>
              <th>ยอดรวมสุทธิ</th>
              <th>สถานะ</th>
              <th style={{ textAlign: "center" }}>เอกสารทางการ</th>
            </tr>
          </thead>
          <tbody>
            {filteredBills.length === 0 ? (
              <tr>
                <td colSpan={10} style={{ textAlign: "center", padding: "2.5rem 1rem", color: "var(--text-muted)" }}>
                  ไม่พบรายการใบแจ้งหนี้ตามเงื่อนไขที่เลือก
                </td>
              </tr>
            ) : (
              filteredBills.map((b) => {
                const r = rooms.find((item) => item.id === b.room_id);
                const rp = rentalProfiles.find((item) => item.id === b.rental_profile_id);
                const u = users.find((item) => item.id === rp?.user_id);

                return (
                  <tr key={b.id}>
                    <td>
                      <strong style={{ color: "var(--text-primary)", fontSize: "1.05rem" }}>
                        ห้อง {r?.room_number}
                      </strong>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                        {u?.full_name || "-"}
                      </div>
                    </td>
                    <td>
                      เดือน {b.month}/{b.year}
                    </td>
                    <td>{b.due_date}</td>
                    <td>฿{b.room_fee.toLocaleString()}</td>
                    <td>
                      <div>{b.water_units} หน่วย</div>
                      <span style={{ fontSize: "0.75rem", color: "#0284c7" }}>฿{b.water_fee.toLocaleString()}</span>
                    </td>
                    <td>
                      <div>{b.electric_units} หน่วย</div>
                      <span style={{ fontSize: "0.75rem", color: "#b45309" }}>฿{b.electric_fee.toLocaleString()}</span>
                    </td>
                    <td>฿{b.other_fees.toLocaleString()}</td>
                    <td>
                      <strong style={{ color: "var(--accent-gold)", fontSize: "1.1rem" }}>
                        ฿{b.total_amount.toLocaleString()}
                      </strong>
                    </td>
                    <td>
                      {b.status === "unpaid" && (
                        <span className="badge badge-unpaid">รอชำระ</span>
                      )}
                      {b.status === "pending_verification" && (
                        <span className="badge badge-pending">รอตรวจสลิป</span>
                      )}
                      {b.status === "paid" && (
                        <span className="badge badge-paid">ชำระแล้ว</span>
                      )}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <button
                        type="button"
                        onClick={() => setViewingBill(b)}
                        className="btn btn-secondary btn-sm"
                        style={{
                          fontSize: "0.8rem",
                          padding: "0.35rem 0.65rem",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.35rem",
                          color: "#4f46e5",
                          borderColor: "rgba(79, 70, 229, 0.2)",
                        }}
                        title="ดูและพิมพ์เอกสารทางการ"
                      >
                        <Eye size={13} /> ดู/พิมพ์บิล
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile View: Cards Stream (Visible only on Mobile <= 768px) */}
      <div className="bills-cards-container">
        {filteredBills.length === 0 ? (
          <div className="glass-card" style={{ padding: "2.5rem 1rem", textAlign: "center", color: "var(--text-muted)" }}>
            ไม่พบรายการใบแจ้งหนี้ตามเงื่อนไขที่เลือก
          </div>
        ) : (
          filteredBills.map((b) => {
            const r = rooms.find((item) => item.id === b.room_id);
            const rp = rentalProfiles.find((item) => item.id === b.rental_profile_id);
            const u = users.find((item) => item.id === rp?.user_id);

            return (
              <div key={`card-${b.id}`} className="bill-mobile-card">
                <div className="bill-card-header">
                  <div>
                    <div className="bill-card-room">ห้อง {r?.room_number}</div>
                    <div className="bill-card-tenant">{u?.full_name || "ผู้เช่าห้องพัก"}</div>
                  </div>
                  <div>
                    {b.status === "unpaid" && (
                      <span className="badge badge-unpaid">รอชำระ</span>
                    )}
                    {b.status === "pending_verification" && (
                      <span className="badge badge-pending">รอตรวจสลิป</span>
                    )}
                    {b.status === "paid" && (
                      <span className="badge badge-paid">ชำระแล้ว</span>
                    )}
                  </div>
                </div>

                <div className="bill-card-grid">
                  <div className="bill-grid-item">
                    <span className="bill-grid-label">งวดประจำเดือน</span>
                    <span className="bill-grid-val">เดือน {b.month}/{b.year}</span>
                  </div>
                  <div className="bill-grid-item">
                    <span className="bill-grid-label">กำหนดชำระ</span>
                    <span className="bill-grid-val">{b.due_date}</span>
                  </div>
                  <div className="bill-grid-item">
                    <span className="bill-grid-label">ค่าเช่าห้องพัก</span>
                    <span className="bill-grid-val">฿{b.room_fee.toLocaleString()}</span>
                  </div>
                  <div className="bill-grid-item">
                    <span className="bill-grid-label">ค่าบริการส่วนกลาง</span>
                    <span className="bill-grid-val">฿{b.other_fees.toLocaleString()}</span>
                  </div>
                  <div className="bill-grid-item">
                    <span className="bill-grid-label">ค่าน้ำ ({b.water_units} หน่วย)</span>
                    <span className="bill-grid-val" style={{ color: "#0284c7" }}>
                      ฿{b.water_fee.toLocaleString()}
                    </span>
                  </div>
                  <div className="bill-grid-item">
                    <span className="bill-grid-label">ค่าไฟ ({b.electric_units} หน่วย)</span>
                    <span className="bill-grid-val" style={{ color: "#b45309" }}>
                      ฿{b.electric_fee.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="bill-card-total-row">
                  <span>ยอดรวมสุทธิ</span>
                  <span className="bill-card-total-amount">฿{b.total_amount.toLocaleString()} บาท</span>
                </div>

                <button
                  type="button"
                  onClick={() => setViewingBill(b)}
                  className="btn bill-card-view-btn"
                >
                  <Eye size={15} /> ดูและพิมพ์ใบแจ้งหนี้ทางการ
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Issue Bill Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 560, width: "100%", padding: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <Receipt size={22} style={{ color: "var(--accent-gold)" }} />
                <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text-primary)" }}>
                  ออกใบแจ้งหนี้ประจำเดือน
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ width: 40, height: 40, background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 8 }}
                aria-label="ปิดหน้าต่าง"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateBill}>
              <div className="form-grid-2col">
                <div className="form-group">
                  <label className="form-label">เลือกห้องพักที่มีผู้เช่า *</label>
                  <select
                    className="form-select"
                    value={selectedRoomId}
                    onChange={(e) => setSelectedRoomId(e.target.value)}
                    required
                  >
                    {rooms
                      .filter((r) => r.status === "occupied" || rentalProfiles.some((rp) => rp.room_id === r.id))
                      .map((r) => (
                        <option key={r.id} value={r.id}>
                          ห้อง {r.room_number} (ค่าห้อง ฿{r.monthly_rent.toLocaleString()})
                        </option>
                      ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">งวดประจำเดือน / ปี *</label>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <select
                      className="form-select"
                      value={month}
                      onChange={(e) => setMonth(parseInt(e.target.value))}
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                        <option key={m} value={m}>เดือน {m}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      className="form-input"
                      style={{ width: 100 }}
                      value={year}
                      onChange={(e) => setYear(parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </div>

              {/* Water Meter Section */}
              <div style={{ background: "rgba(59, 130, 246, 0.08)", padding: "0.85rem 1rem", borderRadius: "10px", border: "1px solid rgba(59, 130, 246, 0.2)", marginBottom: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.6rem", flexWrap: "wrap", gap: "0.3rem" }}>
                  <span style={{ color: "#2563eb", fontSize: "0.88rem", fontWeight: 750, display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <Droplets size={16} /> มิเตอร์น้ำประปา (฿{waterRate}/หน่วย)
                  </span>
                  <span style={{ color: "var(--text-primary)", fontSize: "0.85rem" }}>
                    ใช้ไป <strong>{waterUnits}</strong> หน่วย = <strong>฿{waterFee.toLocaleString()}</strong>
                  </span>
                </div>
                <div className="form-grid-2col">
                  <div>
                    <label style={{ fontSize: "0.78rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.2rem" }}>เลขมิเตอร์ครั้งก่อน</label>
                    <input
                      type="number"
                      className="form-input"
                      value={waterPrev}
                      onChange={(e) => setWaterPrev(parseFloat(e.target.value) || 0)}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.78rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.2rem" }}>เลขมิเตอร์ครั้งนี้</label>
                    <input
                      type="number"
                      className="form-input"
                      value={waterCurr}
                      onChange={(e) => setWaterCurr(parseFloat(e.target.value) || 0)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Electric Meter Section */}
              <div style={{ background: "rgba(245, 158, 11, 0.08)", padding: "0.85rem 1rem", borderRadius: "10px", border: "1px solid rgba(245, 158, 11, 0.2)", marginBottom: "1.25rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.6rem", flexWrap: "wrap", gap: "0.3rem" }}>
                  <span style={{ color: "#c2410c", fontSize: "0.88rem", fontWeight: 750, display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <Zap size={16} /> มิเตอร์ไฟฟ้า (฿{electricRate}/หน่วย)
                  </span>
                  <span style={{ color: "var(--text-primary)", fontSize: "0.85rem" }}>
                    ใช้ไป <strong>{electricUnits}</strong> หน่วย = <strong>฿{electricFee.toLocaleString()}</strong>
                  </span>
                </div>
                <div className="form-grid-2col">
                  <div>
                    <label style={{ fontSize: "0.78rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.2rem" }}>เลขมิเตอร์ครั้งก่อน</label>
                    <input
                      type="number"
                      className="form-input"
                      value={electricPrev}
                      onChange={(e) => setElectricPrev(parseFloat(e.target.value) || 0)}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.78rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.2rem" }}>เลขมิเตอร์ครั้งนี้</label>
                    <input
                      type="number"
                      className="form-input"
                      value={electricCurr}
                      onChange={(e) => setElectricCurr(parseFloat(e.target.value) || 0)}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-grid-2col" style={{ marginBottom: "1.25rem" }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">ค่าส่วนกลาง / ขยะ (บาท)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={otherFees}
                    onChange={(e) => setOtherFees(parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">วันครบกำหนดชำระ *</label>
                  <input
                    type="date"
                    className="form-input"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Total Calculation Banner */}
              <div style={{ background: "#f8fafc", padding: "1rem", borderRadius: "10px", border: "1px solid var(--border-color)", marginBottom: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "1rem", color: "var(--text-primary)", fontWeight: 700 }}>ยอดรวมทั้งสิ้นที่จะออกบิล:</span>
                <span style={{ fontSize: "1.4rem", fontWeight: 800, color: "#4f46e5" }}>
                  ฿{totalAmount.toLocaleString()}
                </span>
              </div>

              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  ยกเลิก
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>
                  ยืนยันการออกบิล
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Bill / Receipt Modal for Staff */}
      {viewingBill && (
        <OfficialBillModal
          bill={viewingBill}
          roomNumber={`ห้อง ${rooms.find((r) => r.id === viewingBill.room_id)?.room_number || "201"}`}
          tenantName={
            users.find(
              (u) =>
                u.id ===
                rentalProfiles.find((rp) => rp.id === viewingBill.rental_profile_id)?.user_id
            )?.full_name || "ผู้เช่าห้องพัก"
          }
          dormName="เดอะ สราญรมย์ เรสซิเดนซ์"
          dormAddress="128/9 ซอยสุขุมวิท 71 แขวงพระโขนงเหนือ เขตวัฒนา กรุงเทพฯ 10110"
          dormPhone="081-999-8888"
          slip={paymentSlips?.find((s) => s.bill_id === viewingBill.id)}
          onClose={() => setViewingBill(null)}
        />
      )}
    </div>
  );
}
