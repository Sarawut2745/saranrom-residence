"use client";

import React, { useState } from "react";
import { useDormitory } from "@/lib/store/dormitory-context";
import { PaymentSlip } from "@/types/dormitory";
import {
  CreditCard,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  AlertTriangle,
  Receipt,
  Building,
  Calendar,
  X,
} from "lucide-react";

export default function StaffPaymentsPage() {
  const { paymentSlips, bills, rooms, rentalProfiles, users, verifyPaymentSlip } = useDormitory();

  const [selectedSlip, setSelectedSlip] = useState<PaymentSlip | null>(null);
  const [rejectModalSlip, setRejectModalSlip] = useState<PaymentSlip | null>(null);
  const [rejectReason, setRejectReason] = useState<string>("");
  const [feedbackMsg, setFeedbackMsg] = useState<string>("");

  const handleApprove = (slipId: string) => {
    verifyPaymentSlip(slipId, "approved");
    setSelectedSlip(null);
    setFeedbackMsg("อนุมัติสลิปการชำระเงินเรียบร้อยแล้ว บิลถูกเปลี่ยนสถานะเป็น 'ชำระแล้ว'");
    setTimeout(() => setFeedbackMsg(""), 4000);
  };

  const handleOpenReject = (slip: PaymentSlip) => {
    setRejectModalSlip(slip);
    setRejectReason("ยอดเงินไม่ตรงกับบิล หรือสลิปไม่ชัดเจน");
  };

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectModalSlip) return;

    verifyPaymentSlip(rejectModalSlip.id, "rejected", rejectReason);
    setRejectModalSlip(null);
    setSelectedSlip(null);
    setFeedbackMsg("ปฏิเสธสลิปเรียบร้อยแล้ว แจ้งเหตุผลให้ผู้เช่าทราบและคงสถานะบิลรอชำระ");
    setTimeout(() => setFeedbackMsg(""), 4000);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--text-primary)" }}>
            ตรวจสอบหลักฐานสลิปการโอนเงิน (Payment Slips)
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem" }}>
            ตรวจความถูกต้องของยอดเงินและเวลาโอน ก่อนอนุมัติให้บิลเปลี่ยนเป็นสถานะชำระแล้ว
          </p>
        </div>
      </div>

      {feedbackMsg && (
        <div style={{ padding: "0.85rem 1.25rem", borderRadius: "10px", background: "rgba(5, 150, 105, 0.08)", border: "1px solid rgba(5, 150, 105, 0.3)", color: "#065f46", fontSize: "0.9rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Slips Table */}
      <div className="table-wrap glass-card">
        <table className="custom-table">
          <thead>
            <tr>
              <th>รูปสลิป</th>
              <th>ห้องพัก / ผู้เช่า</th>
              <th>งวดบิล</th>
              <th>ยอดในบิล</th>
              <th>ยอดที่โอนจริง</th>
              <th>วัน-เวลาที่โอน</th>
              <th>สถานะ</th>
              <th style={{ textAlign: "right" }}>การดำเนินการ</th>
            </tr>
          </thead>
          <tbody>
            {paymentSlips.map((slip) => {
              const bill = bills.find((b) => b.id === slip.bill_id);
              const room = rooms.find((r) => r.id === bill?.room_id);
              const rental = rentalProfiles.find((rp) => rp.id === bill?.rental_profile_id);
              const tenantUser = users.find((u) => u.id === rental?.user_id);
              const isAmountMatched = bill && bill.total_amount === slip.transfer_amount;

              return (
                <tr key={slip.id}>
                  <td>
                    <div
                      onClick={() => setSelectedSlip(slip)}
                      style={{
                        width: 54,
                        height: 54,
                        borderRadius: "8px",
                        overflow: "hidden",
                        background: "#000",
                        cursor: "pointer",
                        border: "1px solid var(--border-color)",
                      }}
                      title="คลิกเพื่อดูรูปขนาดใหญ่"
                    >
                      <img
                        src={slip.slip_image_url}
                        alt="สลิป"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </div>
                  </td>
                  <td>
                    <strong style={{ color: "var(--text-primary)", fontSize: "1rem" }}>
                      ห้อง {room?.room_number || "-"}
                    </strong>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                      {tenantUser?.full_name}
                    </div>
                  </td>
                  <td>
                    {bill ? `งวด ${bill.month}/${bill.year}` : "-"}
                  </td>
                  <td>
                    <strong>฿{bill?.total_amount.toLocaleString() || 0}</strong>
                  </td>
                  <td>
                    <strong style={{ color: isAmountMatched ? "#065f46" : "#dc2626", fontSize: "1.05rem" }}>
                      ฿{slip.transfer_amount.toLocaleString()}
                    </strong>
                    {!isAmountMatched && (
                      <div style={{ fontSize: "0.72rem", color: "#dc2626", display: "flex", alignItems: "center", gap: "0.2rem", marginTop: "0.15rem" }}>
                        <AlertTriangle size={11} />
                        <span>ไม่ตรงยอดบิล</span>
                      </div>
                    )}
                  </td>
                  <td style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                    {new Date(slip.transfer_time).toLocaleString("th-TH")}
                  </td>
                  <td>
                    {slip.status === "pending" && (
                      <span className="badge badge-pending">
                        <Clock size={12} /> รอนิติอนุมัติ
                      </span>
                    )}
                    {slip.status === "approved" && (
                      <span className="badge badge-paid">
                        <CheckCircle2 size={12} /> อนุมัติแล้ว
                      </span>
                    )}
                    {slip.status === "rejected" && (
                      <span className="badge badge-unpaid">
                        <XCircle size={12} /> ปฏิเสธสลิป
                      </span>
                    )}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div style={{ display: "flex", gap: "0.4rem", justifyContent: "flex-end" }}>
                      <button
                        onClick={() => setSelectedSlip(slip)}
                        className="btn btn-secondary btn-sm"
                        title="ดูรายละเอียด"
                      >
                        <Eye size={14} /> ตรวจดู
                      </button>

                      {slip.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleApprove(slip.id)}
                            className="btn btn-success btn-sm"
                            title="อนุมัติสลิปนี้"
                          >
                            <CheckCircle2 size={14} /> อนุมัติ
                          </button>
                          <button
                            onClick={() => handleOpenReject(slip)}
                            className="btn btn-danger btn-sm"
                            title="ปฏิเสธสลิปนี้"
                          >
                            <XCircle size={14} /> ปฏิเสธ
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Slip Audit & Comparison Modal */}
      {selectedSlip && (
        <div className="modal-overlay" onClick={() => setSelectedSlip(null)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 680, padding: "2rem" }}
          >
            {(() => {
              const b = bills.find((item) => item.id === selectedSlip.bill_id);
              const r = rooms.find((item) => item.id === b?.room_id);
              const rp = rentalProfiles.find((item) => item.id === b?.rental_profile_id);
              const u = users.find((item) => item.id === rp?.user_id);
              const isMatch = b && b.total_amount === selectedSlip.transfer_amount;

              return (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.75rem" }}>
                    <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)" }}>
                      ตรวจสอบสลิปโอนเงิน ห้อง {r?.room_number} (งวด {b?.month}/{b?.year})
                    </h3>
                    <button
                      onClick={() => setSelectedSlip(null)}
                      style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", display: "flex", alignItems: "center" }}
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.5rem", marginBottom: "1.5rem" }}>
                    {/* Slip Image View */}
                    <div style={{ borderRadius: "10px", overflow: "hidden", background: "#000", border: "1px solid var(--border-color)", height: 320, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <img
                        src={selectedSlip.slip_image_url}
                        alt="สลิปหลักฐาน"
                        style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                      />
                    </div>

                    {/* Comparison Details */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", fontSize: "0.9rem" }}>
                      <div style={{ background: "#f8fafc", padding: "0.85rem", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
                        <span style={{ color: "var(--text-muted)", display: "block", fontSize: "0.78rem" }}>ผู้เช่า</span>
                        <strong style={{ color: "var(--text-primary)" }}>{u?.full_name}</strong>
                        <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>โทร {u?.phone}</div>
                      </div>

                      <div style={{ background: "rgba(255,255,255,0.03)", padding: "0.85rem", borderRadius: "8px" }}>
                        <span style={{ color: "var(--text-muted)", display: "block", fontSize: "0.78rem" }}>ยอดเงินตามใบแจ้งหนี้</span>
                        <strong style={{ color: "var(--accent-gold)", fontSize: "1.2rem" }}>
                          ฿{b?.total_amount.toLocaleString()}
                        </strong>
                      </div>

                      <div style={{ background: isMatch ? "rgba(5, 150, 105, 0.08)" : "rgba(220, 38, 38, 0.08)", padding: "0.85rem", borderRadius: "8px", border: `1px solid ${isMatch ? "rgba(5, 150, 105, 0.25)" : "rgba(220, 38, 38, 0.25)"}` }}>
                        <span style={{ color: "var(--text-muted)", display: "block", fontSize: "0.78rem" }}>ยอดโอนตามสลิป</span>
                        <strong style={{ color: isMatch ? "#065f46" : "#dc2626", fontSize: "1.2rem" }}>
                          ฿{selectedSlip.transfer_amount.toLocaleString()}
                        </strong>
                        <div style={{ fontSize: "0.78rem", color: isMatch ? "#065f46" : "#dc2626", marginTop: "0.2rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.3rem" }}>
                          {isMatch ? (
                            <>
                              <CheckCircle2 size={13} />
                              <span>ยอดเงินตรงกันถูกต้อง</span>
                            </>
                          ) : (
                            <>
                              <AlertTriangle size={13} />
                              <span>ยอดเงินไม่ตรงกับบิล</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                        เวลาโอน: {new Date(selectedSlip.transfer_time).toLocaleString("th-TH")}<br />
                        สถานะปัจจุบัน: <strong>{selectedSlip.status}</strong>
                        {selectedSlip.rejection_reason && (
                          <div style={{ color: "#fb7185", marginTop: "0.3rem" }}>
                            เหตุผลที่ปฏิเสธ: {selectedSlip.rejection_reason}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {selectedSlip.status === "pending" && (
                    <div style={{ display: "flex", gap: "0.75rem", borderTop: "1px solid var(--border-color)", paddingTop: "1rem" }}>
                      <button
                        onClick={() => handleOpenReject(selectedSlip)}
                        className="btn btn-danger"
                        style={{ flex: 1 }}
                      >
                        <XCircle size={16} /> ปฏิเสธสลิปนี้
                      </button>
                      <button
                        onClick={() => handleApprove(selectedSlip.id)}
                        className="btn btn-success"
                        style={{ flex: 2 }}
                      >
                        <CheckCircle2 size={16} /> อนุมัติการชำระเงิน (ปรับสถานะเป็น Paid)
                      </button>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Reject Reason Modal */}
      {rejectModalSlip && (
        <div className="modal-overlay" onClick={() => setRejectModalSlip(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
                ระบุเหตุผลในการปฏิเสธสลิป
              </h3>
              <button
                onClick={() => setRejectModalSlip(null)}
                style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", display: "flex", alignItems: "center" }}
              >
                <X size={20} />
              </button>
            </div>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "1.25rem" }}>
              ผู้เช่าจะได้รับแจ้งเหตุผลนี้ในระบบเพื่อให้อัปโหลดสลิปใหม่
            </p>

            <form onSubmit={handleConfirmReject}>
              <div className="form-group">
                <label className="form-label">เหตุผลที่ปฏิเสธ *</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  required
                ></textarea>
              </div>

              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button
                  type="button"
                  onClick={() => setRejectModalSlip(null)}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  ยกเลิก
                </button>
                <button type="submit" className="btn btn-danger" style={{ flex: 2 }}>
                  ยืนยันปฏิเสธสลิป
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
