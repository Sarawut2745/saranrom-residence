"use client";

import React from "react";
import { Bill, PaymentSlip } from "@/types/dormitory";
import { Printer, X, CheckCircle2, Clock, QrCode } from "lucide-react";

interface OfficialBillModalProps {
  bill: Bill;
  roomNumber?: string;
  tenantName?: string;
  dormName?: string;
  dormAddress?: string;
  dormPhone?: string;
  slip?: PaymentSlip;
  onClose: () => void;
  onPay?: (bill: Bill) => void;
}

const THAI_MONTHS_SHORT = [
  "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
  "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
];

const THAI_MONTHS_FULL = [
  "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
  "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
];

function formatThaiDateString(dateStr?: string): string {
  if (!dateStr) return "-";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = String(d.getDate()).padStart(2, "0");
    const month = THAI_MONTHS_SHORT[d.getMonth()];
    const year = d.getFullYear() + 543;
    return `${day} ${month} ${year}`;
  } catch {
    return dateStr;
  }
}

export default function OfficialBillModal({
  bill,
  roomNumber = "201",
  tenantName = "ผู้เช่าห้องพัก",
  dormName = "เดอะ สราญรมย์ เรสซิเดนซ์",
  dormAddress = "128/9 ซอยสุขุมวิท 71 แขวงพระโขนงเหนือ เขตวัฒนา กรุงเทพฯ 10110",
  dormPhone = "081-999-8888",
  slip,
  onClose,
  onPay,
}: OfficialBillModalProps) {
  const isPaid = bill.status === "paid";

  const invoiceNo = `INV-${bill.year}-${String(bill.month).padStart(2, "0")}-${bill.id.slice(-4).toUpperCase()}`;
  const receiptNo = `REC-${bill.year}-${String(bill.month).padStart(2, "0")}-${bill.id.slice(-4).toUpperCase()}`;

  const issueDateFormatted = `01 ${THAI_MONTHS_SHORT[bill.month - 1]} ${bill.year + 543}`;
  const dueDateFormatted = formatThaiDateString(bill.due_date);
  const paidDateFormatted = slip?.created_at
    ? formatThaiDateString(slip.created_at)
    : `${String(new Date().getDate()).padStart(2, "0")} ${THAI_MONTHS_SHORT[bill.month - 1]} ${bill.year + 543}`;

  const formattedTotal = bill.total_amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  // Direct In-Place Print: Triggers native browser print immediately without opening any new tab!
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "840px",
          width: "95%",
          padding: "20px",
          background: "transparent",
          boxShadow: "none",
          border: "none",
        }}
      >
        {/* Top Control Bar (Hidden on print) */}
        <div
          className="no-print"
          style={{
            background: "#ffffff",
            padding: "12px 18px",
            borderRadius: "10px",
            border: "1px solid #e2e8f0",
            marginBottom: "16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          }}
        >
          {/* Document Status */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {isPaid ? (
              <span className="status-badge status-paid" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                <CheckCircle2 size={13} /> ใบเสร็จรับเงิน (ชำระสมบูรณ์)
              </span>
            ) : bill.status === "pending_verification" ? (
              <span className="status-badge status-pending" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                <Clock size={13} /> ใบแจ้งหนี้ (รอตรวจสอบยอด)
              </span>
            ) : (
              <span className="status-badge status-unpaid" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                <Clock size={13} /> ใบแจ้งหนี้ (รอชำระเงิน)
              </span>
            )}
            <span style={{ fontSize: "13px", color: "#64748b", fontWeight: 600 }}>
              {roomNumber} • ประจำเดือน {bill.month}/{bill.year}
            </span>
          </div>

          {/* Action Buttons: Print Directly (NO NEW TAB) & Close */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              onClick={handlePrint}
              type="button"
              className="btn btn-primary btn-sm"
              style={{
                background: "#0f172a",
                color: "#ffffff",
                height: "36px",
                padding: "0 16px",
                fontSize: "13.5px",
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                cursor: "pointer",
                borderRadius: "6px",
                border: "none",
              }}
              title="พิมพ์เอกสารออกเครื่องพิมพ์หรือบันทึก PDF ทันที"
            >
              <Printer size={15} /> พิมพ์เอกสาร / บันทึก PDF
            </button>

            <button
              onClick={onClose}
              type="button"
              style={{
                height: "36px",
                padding: "0 12px",
                background: "#f1f5f9",
                border: "1px solid #cbd5e1",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: 600,
                color: "#475569",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <X size={16} /> ปิด
            </button>
          </div>
        </div>

        {/* ==================== ตัวเอกสารทางการ (Official Document Sheet) ==================== */}
        <div
          className="doc doc-print"
          style={{
            background: "#ffffff",
            borderRadius: "8px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            padding: "36px 44px",
            border: "1px solid #e2e8f0",
          }}
        >
          {isPaid ? (
            /* ใบเสร็จรับเงิน (Official Receipt) */
            <div className="doc-receipt">
              <div className="doc-head">
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <img
                    src="/logo-icon.png"
                    alt="The Saranrom Emblem"
                    style={{ width: 52, height: 52, objectFit: "contain", borderRadius: 10, flexShrink: 0 }}
                  />
                  <div>
                    <p className="dorm-name">{dormName}</p>
                    <p className="dorm-sub">
                      {dormAddress}
                      <br />
                      โทร. {dormPhone}
                    </p>
                  </div>
                </div>
                <div className="doc-title">
                  <h2>ใบเสร็จรับเงิน</h2>
                  <div className="no">เลขที่ {receiptNo}</div>
                  <span className="status-badge status-paid">ชำระแล้ว</span>
                </div>
              </div>

              <div className="info-grid">
                <div>
                  <span className="label">ผู้เช่า:</span>{" "}
                  <span className="value">{tenantName}</span>
                </div>
                <div>
                  <span className="label">อ้างอิงใบแจ้งหนี้:</span>{" "}
                  <span className="value">{invoiceNo}</span>
                </div>
                <div>
                  <span className="label">ห้องเลขที่:</span>{" "}
                  <span className="value">{roomNumber}</span>
                </div>
                <div>
                  <span className="label">วันที่รับชำระ:</span>{" "}
                  <span className="value">{paidDateFormatted}</span>
                </div>
              </div>

              <table className="items">
                <thead>
                  <tr>
                    <th>รายการ</th>
                    <th>จำนวนเงิน (บาท)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>ค่าห้องพัก ประจำเดือน{THAI_MONTHS_FULL[bill.month - 1]} {bill.year + 543}</td>
                    <td>{bill.room_fee.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  </tr>
                  <tr>
                    <td>ค่าน้ำประปา ({bill.water_units} หน่วย)</td>
                    <td>{bill.water_fee.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  </tr>
                  <tr>
                    <td>ค่าไฟฟ้า ({bill.electric_units} หน่วย)</td>
                    <td>{bill.electric_fee.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  </tr>
                  {bill.other_fees > 0 && (
                    <tr>
                      <td>ค่าส่วนกลางและบริการ</td>
                      <td>{bill.other_fees.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    </tr>
                  )}
                </tbody>
              </table>

              <div className="totals">
                <table>
                  <tbody>
                    <tr className="grand">
                      <td>รับชำระเงินทั้งสิ้น</td>
                      <td>{formattedTotal} บาท</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="receipt-info">
                <div className="row">
                  <span>วิธีชำระเงิน</span>
                  <span>สแกน QR PromptPay + แนบหลักฐาน</span>
                </div>
                <div className="row">
                  <span>ตรวจสอบหลักฐานโดย</span>
                  <span>นิติบุคคล ({slip ? "จนท. ตรวจสอบแล้ว" : "เดอะ สราญรมย์ เรสซิเดนซ์"})</span>
                </div>
                <div className="row">
                  <span>วันที่ตรวจสอบ/อนุมัติ</span>
                  <span>{paidDateFormatted} 14:32 น.</span>
                </div>
              </div>

              <div className="sign-row">
                <div className="sign-box">
                  <div className="sign-line">ผู้ชำระเงิน</div>
                </div>
                <div className="sign-box">
                  <div className="sign-line">ผู้รับเงิน / เจ้าหน้าที่</div>
                </div>
              </div>

              <p className="footer-note">
                ใบเสร็จนี้ออกจากระบบหลังจากเจ้าหน้าที่ตรวจสอบหลักฐานการชำระเงินเรียบร้อยแล้ว
              </p>
            </div>
          ) : (
            /* ใบแจ้งหนี้ (Official Invoice) */
            <div className="doc-invoice">
              <div className="doc-head">
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <img
                    src="/logo-icon.png"
                    alt="The Saranrom Emblem"
                    style={{ width: 52, height: 52, objectFit: "contain", borderRadius: 10, flexShrink: 0 }}
                  />
                  <div>
                    <p className="dorm-name">{dormName}</p>
                    <p className="dorm-sub">
                      {dormAddress}
                      <br />
                      โทร. {dormPhone}
                    </p>
                  </div>
                </div>
                <div className="doc-title">
                  <h2>ใบแจ้งหนี้</h2>
                  <div className="no">เลขที่ {invoiceNo}</div>
                  <span className={`status-badge ${bill.status === "pending_verification" ? "status-pending" : "status-unpaid"}`}>
                    {bill.status === "pending_verification" ? "รอตรวจสอบ" : "ค้างชำระ"}
                  </span>
                </div>
              </div>

              <div className="info-grid">
                <div>
                  <span className="label">ผู้เช่า:</span>{" "}
                  <span className="value">{tenantName}</span>
                </div>
                <div>
                  <span className="label">วันที่ออกเอกสาร:</span>{" "}
                  <span className="value">{issueDateFormatted}</span>
                </div>
                <div>
                  <span className="label">ห้องเลขที่:</span>{" "}
                  <span className="value">{roomNumber}</span>
                </div>
                <div>
                  <span className="label">กำหนดชำระ:</span>{" "}
                  <span className="value">{dueDateFormatted}</span>
                </div>
              </div>

              <table className="items">
                <thead>
                  <tr>
                    <th>รายการ</th>
                    <th>จำนวนเงิน (บาท)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>ค่าห้องพัก ประจำเดือน{THAI_MONTHS_FULL[bill.month - 1]} {bill.year + 543}</td>
                    <td>{bill.room_fee.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  </tr>
                  <tr>
                    <td>ค่าน้ำประปา ({bill.water_units} หน่วย)</td>
                    <td>{bill.water_fee.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  </tr>
                  <tr>
                    <td>ค่าไฟฟ้า ({bill.electric_units} หน่วย)</td>
                    <td>{bill.electric_fee.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  </tr>
                  {bill.other_fees > 0 && (
                    <tr>
                      <td>ค่าส่วนกลางและบริการ</td>
                      <td>{bill.other_fees.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    </tr>
                  )}
                </tbody>
              </table>

              <div className="totals">
                <table>
                  <tbody>
                    <tr>
                      <td>รวมเป็นเงิน</td>
                      <td>{formattedTotal}</td>
                    </tr>
                    <tr className="grand">
                      <td>ยอดชำระทั้งสิ้น</td>
                      <td>{formattedTotal} บาท</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="pay-box">
                <div className="qr-placeholder">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=PROMPTPAY|${dormPhone.replace(/[^0-9]/g, "") || "0819998888"}|${bill.total_amount}`}
                    alt="QR PromptPay"
                    style={{ width: "86px", height: "86px", objectFit: "contain", display: "block" }}
                  />
                </div>
                <div className="note">
                  1. สแกน QR เพื่อชำระเงินผ่านแอปธนาคาร
                  <br />
                  2. หลังโอนเงินแล้ว ต้อง<strong>แนบหลักฐานการชำระเงิน (สลิป)</strong> เข้าระบบทุกครั้ง
                  <br />
                  3. เจ้าหน้าที่จะตรวจสอบและออกใบเสร็จให้หลังยืนยันยอดแล้ว
                </div>
              </div>

              {onPay && bill.status === "unpaid" && (
                <div className="no-print" style={{ textAlign: "right", marginTop: "16px" }}>
                  <button
                    type="button"
                    onClick={() => onPay(bill)}
                    className="btn btn-primary"
                    style={{ background: "#059669", height: "42px", padding: "0 24px", fontSize: "14px", fontWeight: 700 }}
                  >
                    <QrCode size={16} /> สแกนชำระเงินและแนบสลิปทันที
                  </button>
                </div>
              )}

              <p className="footer-note">เอกสารนี้ออกโดยระบบอัตโนมัติ ไม่ต้องประทับตราหรือลงนาม</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
