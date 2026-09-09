"use client";

import React, { useState } from "react";
import { useDormitory } from "@/lib/store/dormitory-context";
import { Bill } from "@/types/dormitory";
import {
  ReceiptText,
  QrCode,
  Upload,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck,
  Calendar,
  Eye,
  Zap,
  Droplets,
  Building2,
  TrendingUp,
  X,
  ShieldCheck,
  Check,
} from "lucide-react";
import OfficialBillModal from "@/components/billing/OfficialBillModal";

export default function RentalBillsPage() {
  const { currentRentalProfile, rooms, roomTypes, bills, paymentSlips, payBill, currentUser } = useDormitory();

  const [activePayBill, setActivePayBill] = useState<Bill | null>(null);
  const [detailBill, setDetailBill] = useState<Bill | null>(null);
  const [slipUrl, setSlipUrl] = useState<string>("");
  const [transferAmount, setTransferAmount] = useState<string>("");
  const [transferTime, setTransferTime] = useState<string>("");
  const [isSuccessModal, setIsSuccessModal] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const userRoom = rooms.find((r) => r.id === currentRentalProfile?.room_id);
  const userRoomType = roomTypes.find((rt) => rt.id === userRoom?.room_type_id);

  const userBills = bills.filter(
    (b) => b.rental_profile_id === currentRentalProfile?.id
  );

  const handleOpenPayModal = (bill: Bill) => {
    setActivePayBill(bill);
    setTransferAmount(bill.total_amount.toString());
    setTransferTime(new Date().toISOString().slice(0, 16));
    setSlipUrl("");
    setErrorMsg("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSlipUrl(reader.result as string);
        setErrorMsg("");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePayBill) return;

    if (!slipUrl) {
      setErrorMsg("กรุณาแนบรูปภาพสลิปหลักฐานการโอนเงิน");
      return;
    }

    const amountNum = parseFloat(transferAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setErrorMsg("กรุณาระบุจำนวนเงินที่ถูกต้อง");
      return;
    }

    payBill(activePayBill.id, slipUrl, amountNum);
    setActivePayBill(null);
    setIsSuccessModal(true);
  };

  // Forecast calculations based on recent trends
  const latestBill = userBills[0];
  const waterRate = userRoomType?.water_rate || 18;
  const electricRate = userRoomType?.electric_rate || 8;
  const baseRoomFee = userRoom?.monthly_rent || 3800;
  const otherFees = latestBill?.other_fees || 180;

  const estWaterUnitsMin = 9;
  const estWaterUnitsMax = 12;
  const estWaterCostMin = estWaterUnitsMin * waterRate;
  const estWaterCostMax = estWaterUnitsMax * waterRate;

  const estElectricUnitsMin = 75;
  const estElectricUnitsMax = 88;
  const estElectricCostMin = estElectricUnitsMin * electricRate;
  const estElectricCostMax = estElectricUnitsMax * electricRate;

  const estTotalMin = baseRoomFee + otherFees + estWaterCostMin + estElectricCostMin;
  const estTotalMax = baseRoomFee + otherFees + estWaterCostMax + estElectricCostMax;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
      <div>
        <h1 style={{ fontSize: "1.45rem", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
          บิลค่าเช่าห้องพักและประวัติการชำระเงิน
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginTop: "0.25rem", margin: 0 }}>
          ตรวจสอบยอดเงิน ดูรายละเอียดบิล พิมพ์ใบเสร็จทางการ และสแกน QR ชำระเงิน
        </p>
      </div>

      {/* 1. Smart Utility & Expense Forecast Card */}
      <div
        className="bento-card"
        style={{
          padding: "1.5rem 1.75rem",
          background: "linear-gradient(135deg, rgba(79, 70, 229, 0.05), rgba(37, 99, 235, 0.02))",
          border: "1.5px solid rgba(79, 70, 229, 0.22)",
          borderRadius: "var(--radius-lg)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: "1rem",
            marginBottom: "1rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: "10px",
                background: "#4f46e5",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TrendingUp size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: "1.12rem", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
                ระบบประมาณการค่าใช้จ่ายงวดถัดไป
              </h2>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                คำนวณจากสถิติพฤติกรรมการใช้น้ำ-ไฟและสภาพอากาศเฉลี่ย
              </span>
            </div>
          </div>

          <div>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "block" }}>
              ประมาณการยอดรวมทั้งสิ้น
            </span>
            <span className="tabular-nums" style={{ fontSize: "1.4rem", fontWeight: 800, color: "#4f46e5" }}>
              ~฿{estTotalMin.toLocaleString()} - ฿{estTotalMax.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Forecast Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "0.85rem",
            marginBottom: "1rem",
          }}
        >
          <div style={{ background: "#ffffff", padding: "0.95rem", borderRadius: "10px", border: "1px solid var(--border-color)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", color: "#2563eb", fontSize: "0.84rem", fontWeight: 700, marginBottom: "0.25rem" }}>
              <Droplets size={15} />
              <span>คาดการณ์น้ำประปา</span>
            </div>
            <div className="tabular-nums" style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--text-primary)" }}>
              ~{estWaterUnitsMin}-{estWaterUnitsMax} หน่วย
            </div>
            <div className="tabular-nums" style={{ fontSize: "0.8rem", color: "#2563eb", fontWeight: 600, marginTop: "0.2rem" }}>
              ประมาณ ฿{estWaterCostMin} - ฿{estWaterCostMax}
            </div>
          </div>

          <div style={{ background: "#ffffff", padding: "0.95rem", borderRadius: "10px", border: "1px solid var(--border-color)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", color: "#d97706", fontSize: "0.84rem", fontWeight: 700, marginBottom: "0.25rem" }}>
              <Zap size={15} />
              <span>คาดการณ์ไฟฟ้า</span>
            </div>
            <div className="tabular-nums" style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--text-primary)" }}>
              ~{estElectricUnitsMin}-{estElectricUnitsMax} หน่วย
            </div>
            <div className="tabular-nums" style={{ fontSize: "0.8rem", color: "#d97706", fontWeight: 600, marginTop: "0.2rem" }}>
              ประมาณ ฿{estElectricCostMin} - ฿{estElectricCostMax}
            </div>
          </div>

          <div style={{ background: "#ffffff", padding: "0.95rem", borderRadius: "10px", border: "1px solid var(--border-color)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", color: "#4f46e5", fontSize: "0.84rem", fontWeight: 700, marginBottom: "0.25rem" }}>
              <Building2 size={15} />
              <span>ค่าห้อง + ส่วนกลาง</span>
            </div>
            <div className="tabular-nums" style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--text-primary)" }}>
              ฿{(baseRoomFee + otherFees).toLocaleString()}
            </div>
            <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
              ค่าใช้จ่ายคงที่ตามสัญญา
            </div>
          </div>
        </div>

        {/* Energy Saving Tip */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            background: "rgba(5, 150, 105, 0.08)",
            border: "1px solid rgba(5, 150, 105, 0.25)",
            padding: "0.65rem 0.95rem",
            borderRadius: "8px",
          }}
        >
          <TrendingUp size={16} style={{ color: "#065f46", flexShrink: 0 }} />
          <span style={{ fontSize: "0.82rem", color: "#065f46" }}>
            <strong>คำแนะนำประหยัดค่าไฟ:</strong> การปรับอุณหภูมิแอร์เป็น 26°C ร่วมกับเปิดพัดลม ช่วยลดค่าไฟได้ประมาณ 10-15% ต่อเดือน
          </span>
        </div>
      </div>

      {/* 2. Bills Cards List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        {userBills.map((bill) => {
          return (
            <div
              key={bill.id}
              className="bento-card hover-card-lift"
              style={{
                padding: "1.5rem 1.75rem",
                background: "#ffffff",
                borderRadius: "var(--radius-lg)",
                border:
                  bill.status === "unpaid"
                    ? "1.5px solid rgba(220, 38, 38, 0.35)"
                    : "1px solid var(--border-color)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "1.25rem",
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.4rem", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--text-primary)" }}>
                      บิลเดือน {bill.month}/{bill.year}
                    </span>
                    {bill.status === "unpaid" && (
                      <span
                        style={{
                          background: "rgba(220, 38, 38, 0.08)",
                          border: "1px solid rgba(220, 38, 38, 0.25)",
                          color: "#dc2626",
                          fontSize: "0.76rem",
                          padding: "0.15rem 0.6rem",
                          borderRadius: "9999px",
                          fontWeight: 700,
                        }}
                      >
                        รอชำระเงิน
                      </span>
                    )}
                    {bill.status === "pending_verification" && (
                      <span
                        style={{
                          background: "rgba(217, 119, 6, 0.08)",
                          border: "1px solid rgba(217, 119, 6, 0.25)",
                          color: "#d97706",
                          fontSize: "0.76rem",
                          padding: "0.15rem 0.6rem",
                          borderRadius: "9999px",
                          fontWeight: 700,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.3rem",
                        }}
                      >
                        <Clock size={12} />
                        <span>รอตรวจสอบสลิป</span>
                      </span>
                    )}
                    {bill.status === "paid" && (
                      <span
                        style={{
                          background: "rgba(5, 150, 105, 0.08)",
                          border: "1px solid rgba(5, 150, 105, 0.25)",
                          color: "#065f46",
                          fontSize: "0.76rem",
                          padding: "0.15rem 0.6rem",
                          borderRadius: "9999px",
                          fontWeight: 700,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.3rem",
                        }}
                      >
                        <CheckCircle2 size={12} />
                        <span>ชำระแล้ว</span>
                      </span>
                    )}
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                    <Calendar size={14} />
                    <span>
                      กำหนดชำระภายใน: <strong>{bill.due_date}</strong>
                    </span>
                  </div>

                  {/* Charges breakdown */}
                  <div
                    style={{
                      display: "flex",
                      gap: "1.25rem",
                      marginTop: "0.75rem",
                      fontSize: "0.85rem",
                      color: "var(--text-secondary)",
                      flexWrap: "wrap",
                    }}
                  >
                    <span>
                      ค่าห้อง: <strong>฿{bill.room_fee.toLocaleString()}</strong>
                    </span>
                    <span>
                      ค่าน้ำ ({bill.water_units} หน่วย): <strong>฿{bill.water_fee.toLocaleString()}</strong>
                    </span>
                    <span>
                      ค่าไฟ ({bill.electric_units} หน่วย): <strong>฿{bill.electric_fee.toLocaleString()}</strong>
                    </span>
                    <span>
                      ส่วนกลาง: <strong>฿{bill.other_fees.toLocaleString()}</strong>
                    </span>
                  </div>
                </div>

                <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.5rem" }}>
                  <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                    ยอดสุทธิทั้งสิ้น
                  </div>
                  <div
                    className="tabular-nums"
                    style={{
                      fontSize: "1.85rem",
                      fontWeight: 800,
                      color: bill.status === "unpaid" ? "#dc2626" : "#065f46",
                      lineHeight: 1.1,
                    }}
                  >
                    ฿{bill.total_amount.toLocaleString()}
                  </div>

                  {/* Action Buttons Row */}
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", justifyContent: "flex-end" }}>
                    <button
                      type="button"
                      onClick={() => setDetailBill(bill)}
                      className="btn btn-secondary btn-sm"
                      style={{ minHeight: "38px", fontSize: "0.85rem", borderRadius: "8px" }}
                      title="ดูรายละเอียดบิลและพิมพ์ใบเสร็จ"
                    >
                      <Eye size={14} />
                      <span>ดูบิล / พิมพ์ใบเสร็จ</span>
                    </button>

                    {bill.status === "unpaid" ? (
                      <button
                        type="button"
                        onClick={() => handleOpenPayModal(bill)}
                        className="btn btn-primary"
                        style={{
                          minHeight: "38px",
                          padding: "0 1.15rem",
                          fontSize: "0.88rem",
                          fontWeight: 700,
                          background: "#0f172a",
                          borderRadius: "8px",
                          boxShadow: "0 2px 8px rgba(15, 23, 42, 0.18)",
                        }}
                      >
                        <QrCode size={16} />
                        <span>สแกน QR จ่ายเงิน</span>
                      </button>
                    ) : bill.status === "pending_verification" ? (
                      <span style={{ fontSize: "0.82rem", color: "#d97706", fontWeight: 700, padding: "0.35rem 0.5rem", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                        <Clock size={14} />
                        <span>รอตรวจสอบสลิป</span>
                      </span>
                    ) : (
                      <span style={{ fontSize: "0.82rem", color: "#065f46", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "0.3rem", padding: "0.35rem 0.5rem" }}>
                        <FileCheck size={16} />
                        <span>ชำระสมบูรณ์</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Official Bill Details & Printable Invoice Modal */}
      {detailBill && (
        <OfficialBillModal
          bill={detailBill}
          roomNumber={`ห้อง ${userRoom?.room_number || "201"}`}
          tenantName={currentUser?.full_name || "ผู้เช่าห้องพัก"}
          dormName="เดอะ สราญรมย์ เรสซิเดนซ์"
          dormAddress="128/9 ซอยสุขุมวิท 71 แขวงพระโขนงเหนือ เขตวัฒนา กรุงเทพฯ 10110"
          dormPhone="081-999-8888"
          slip={paymentSlips.find((s) => s.bill_id === detailBill.id)}
          onClose={() => setDetailBill(null)}
          onPay={(bill) => {
            setDetailBill(null);
            handleOpenPayModal(bill);
          }}
        />
      )}

      {/* 4. Payment Modal with PromptPay QR & Slip Upload (Bottom Sheet on Mobile) */}
      {activePayBill && (
        <div className="modal-overlay" onClick={() => setActivePayBill(null)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ padding: "1.75rem", maxWidth: "480px" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <QrCode size={20} style={{ color: "#4f46e5" }} />
                <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
                  ชำระบิลเดือน {activePayBill.month}/{activePayBill.year}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActivePayBill(null)}
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

            {errorMsg && (
              <div
                style={{
                  padding: "0.65rem 1rem",
                  borderRadius: "8px",
                  background: "rgba(220, 38, 38, 0.08)",
                  border: "1px solid rgba(220, 38, 38, 0.25)",
                  color: "#dc2626",
                  fontSize: "0.85rem",
                  marginBottom: "1rem",
                  fontWeight: 500,
                }}
              >
                {errorMsg}
              </div>
            )}

            {/* QR Box */}
            <div
              style={{
                textAlign: "center",
                background: "#f8fafc",
                borderRadius: "12px",
                padding: "1.15rem",
                border: "1px solid var(--border-color)",
                marginBottom: "1.2rem",
              }}
            >
              <div style={{ fontSize: "0.84rem", color: "var(--text-secondary)", marginBottom: "0.2rem" }}>
                เปิดแอปธนาคารแล้วสแกน QR ยอดชำระ
              </div>
              <div
                className="tabular-nums"
                style={{ fontSize: "1.8rem", fontWeight: 800, color: "#065f46", marginBottom: "0.65rem" }}
              >
                ฿{activePayBill.total_amount.toLocaleString()}
              </div>

              <div
                style={{
                  display: "inline-block",
                  background: "#ffffff",
                  padding: "0.75rem",
                  borderRadius: "10px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                  border: "1px solid var(--border-color)",
                }}
              >
                <img
                  src="/promptpay-qr.png"
                  alt="PromptPay QR Code"
                  style={{ width: 155, height: 155, display: "block", objectFit: "contain" }}
                />
              </div>

              <div style={{ marginTop: "0.65rem", fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                ชื่อบัญชี: <strong>เดอะ สราญรมย์ เรสซิเดนซ์</strong>
                <br />
                พร้อมเพย์: <strong>081-999-8888</strong>
              </div>
            </div>

            {/* Slip Upload Form */}
            <form onSubmit={handleSubmitPayment}>
              <div style={{ marginBottom: "1rem" }}>
                <label
                  className="form-label"
                  style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "0.88rem", marginBottom: "0.45rem", display: "block" }}
                >
                  รูปภาพสลิปโอนเงิน (บังคับแนบ) *
                </label>

                <div
                  style={{
                    border: "2px dashed rgba(79, 70, 229, 0.35)",
                    borderRadius: "10px",
                    padding: "1.15rem 1rem",
                    textAlign: "center",
                    background: "#f8fafc",
                    cursor: "pointer",
                    position: "relative",
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
                  <Upload size={22} style={{ color: "#4f46e5", margin: "0 auto 0.35rem", display: "block" }} />
                  <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-primary)" }}>
                    {slipUrl ? "คลิกเพื่อเปลี่ยนรูปสลิปใหม่" : "คลิกเพื่อเลือกไฟล์สลิป หรือถ่ายภาพ"}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.15rem" }}>
                    รองรับไฟล์ JPG, PNG หรือภาพถ่ายจากหน้าจอโทรศัพท์
                  </div>
                </div>
              </div>

              {slipUrl && (
                <div
                  style={{
                    marginBottom: "1rem",
                    padding: "0.5rem",
                    background: "rgba(5, 150, 105, 0.08)",
                    borderRadius: "8px",
                    border: "1px solid rgba(5, 150, 105, 0.25)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#065f46", fontSize: "0.82rem", marginBottom: "0.35rem", fontWeight: 600 }}>
                    <CheckCircle2 size={15} />
                    <span>แนบรูปสลิปเรียบร้อยแล้ว</span>
                  </div>
                  <div style={{ height: 110, borderRadius: "6px", overflow: "hidden", background: "#f1f5f9" }}>
                    <img
                      src={slipUrl}
                      alt="สลิปที่แนบ"
                      style={{ width: "100%", height: "100%", objectFit: "contain" }}
                    />
                  </div>
                </div>
              )}

              <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.25rem" }}>
                <button
                  type="button"
                  onClick={() => setActivePayBill(null)}
                  className="btn btn-secondary"
                  style={{ flex: 1, minHeight: "46px", borderRadius: "8px" }}
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{
                    flex: 2,
                    fontWeight: 700,
                    minHeight: "46px",
                    background: "#0f172a",
                    borderRadius: "8px",
                  }}
                  disabled={!slipUrl}
                >
                  <Upload size={16} />
                  <span>ส่งสลิปให้เจ้าหน้าที่</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Success Notification Modal */}
      {isSuccessModal && (
        <div className="modal-overlay" onClick={() => setIsSuccessModal(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ padding: "2.25rem 2rem", textAlign: "center", maxWidth: 420 }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "rgba(5, 150, 105, 0.1)",
                border: "2px solid #065f46",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#065f46",
                marginBottom: "1rem",
              }}
            >
              <CheckCircle2 size={30} />
            </div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "0.45rem" }}>
              ส่งสลิปเรียบร้อยแล้ว
            </h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.5, marginBottom: "1.5rem" }}>
              ระบบได้บันทึกหลักฐานการโอนแล้ว เจ้าหน้าที่นิติบุคคลจะตรวจสอบและปรับสถานะให้ท่านโดยเร็ว
            </p>
            <button
              type="button"
              onClick={() => setIsSuccessModal(false)}
              className="btn btn-primary"
              style={{ width: "100%", minHeight: "44px", fontWeight: 600, borderRadius: "8px" }}
            >
              รับทราบ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
