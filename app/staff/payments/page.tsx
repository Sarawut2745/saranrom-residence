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
  Filter,
  Search,
} from "lucide-react";

export default function StaffPaymentsPage() {
  const { paymentSlips, bills, rooms, rentalProfiles, users, verifyPaymentSlip } = useDormitory();

  const [selectedSlip, setSelectedSlip] = useState<PaymentSlip | null>(null);
  const [rejectModalSlip, setRejectModalSlip] = useState<PaymentSlip | null>(null);
  const [rejectReason, setRejectReason] = useState<string>("");
  const [feedbackMsg, setFeedbackMsg] = useState<string>("");

  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchRoom, setSearchRoom] = useState<string>("");

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

  const pendingCount = paymentSlips.filter((s) => s.status === "pending").length;
  const approvedCount = paymentSlips.filter((s) => s.status === "approved").length;
  const rejectedCount = paymentSlips.filter((s) => s.status === "rejected").length;

  const filteredSlips = paymentSlips.filter((slip) => {
    const bill = bills.find((b) => b.id === slip.bill_id);
    const room = rooms.find((r) => r.id === bill?.room_id);
    const matchesStatus = filterStatus === "all" || slip.status === filterStatus;
    const matchesRoom = !searchRoom || (room?.room_number && room.room_number.includes(searchRoom));
    return matchesStatus && matchesRoom;
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--text-primary)" }}>
            ตรวจสลิปการชำระเงิน
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

      {/* Filter and Search Bar (Desktop Inline / Mobile Stacked) */}
      <div className="payments-filter-bar glass-card">
        <div className="payments-filter-group">
          <div className="payments-filter-label">
            <Filter size={16} style={{ color: "var(--text-muted)" }} />
            <span>สถานะสลิป</span>
          </div>
          <select
            className="form-select payments-filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">ทั้งหมด ({paymentSlips.length})</option>
            <option value="pending">รอตรวจสอบ ({pendingCount})</option>
            <option value="approved">อนุมัติแล้ว ({approvedCount})</option>
            <option value="rejected">ปฏิเสธ ({rejectedCount})</option>
          </select>
        </div>

        <div className="payments-search-group">
          <div className="payments-search-label">
            <Search size={16} style={{ color: "var(--text-muted)" }} />
            <span>ค้นหาห้อง</span>
          </div>
          <input
            type="text"
            className="form-input payments-search-input"
            placeholder="ค้นหาเลขห้อง เช่น 201..."
            value={searchRoom}
            onChange={(e) => setSearchRoom(e.target.value)}
          />
        </div>
      </div>

      {/* Desktop View: Full Table (Hidden on Mobile <= 768px) */}
      <div className="payments-table-container table-wrap glass-card">
        <table className="custom-table">
          <thead>
            <tr>
              <th style={{ width: 68, whiteSpace: "nowrap" }}>รูปสลิป</th>
              <th style={{ minWidth: 150, whiteSpace: "nowrap" }}>ห้อง / ผู้เช่า</th>
              <th style={{ whiteSpace: "nowrap" }}>งวดบิล</th>
              <th style={{ whiteSpace: "nowrap" }}>ยอดในบิล</th>
              <th style={{ whiteSpace: "nowrap" }}>ยอดที่โอนจริง</th>
              <th style={{ whiteSpace: "nowrap" }}>วัน-เวลาที่โอน</th>
              <th style={{ whiteSpace: "nowrap" }}>สถานะ</th>
              <th style={{ textAlign: "right", minWidth: 140, whiteSpace: "nowrap" }}>การดำเนินการ</th>
            </tr>
          </thead>
          <tbody>
            {filteredSlips.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: "center", padding: "2.5rem 1rem", color: "var(--text-muted)" }}>
                  ไม่พบรายการสลิปตามเงื่อนไขที่เลือก
                </td>
              </tr>
            ) : (
              filteredSlips.map((slip) => {
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
                          width: 52,
                          height: 52,
                          borderRadius: "10px",
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
                      <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                        {tenantUser?.full_name || "-"}
                      </div>
                      <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                        ผู้เช่าห้อง {room?.room_number || "-"}
                      </div>
                    </td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      {bill ? `เดือน ${bill.month}/${bill.year}` : "-"}
                    </td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      <strong>฿{bill?.total_amount.toLocaleString() || 0}</strong>
                    </td>
                    <td style={{ whiteSpace: "nowrap" }}>
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
                    <td style={{ fontSize: "0.82rem", color: "var(--text-secondary)", whiteSpace: "nowrap" }}>
                      {new Date(slip.transfer_time).toLocaleString("th-TH")}
                    </td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      {slip.status === "pending" && (
                        <span className="badge badge-pending">
                          <Clock size={12} /> รอตรวจสอบ
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
                    <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                      <div style={{ display: "flex", gap: "0.4rem", justifyContent: "flex-end" }}>
                        <button
                          type="button"
                          onClick={() => setSelectedSlip(slip)}
                          className="btn btn-secondary btn-sm"
                          title="ดูรายละเอียดและเปรียบเทียบสลิป"
                        >
                          <Eye size={14} /> ตรวจสอบ
                        </button>

                        {slip.status === "pending" && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleApprove(slip.id)}
                              className="btn btn-success btn-sm"
                              title="อนุมัติสลิปนี้"
                            >
                              <CheckCircle2 size={14} /> อนุมัติ
                            </button>
                            <button
                              type="button"
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
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile View: Cards Stream (Visible only on Mobile <= 768px) */}
      <div className="payments-cards-container">
        {filteredSlips.length === 0 ? (
          <div className="glass-card" style={{ padding: "2.5rem 1rem", textAlign: "center", color: "var(--text-muted)" }}>
            ไม่พบรายการสลิปตามเงื่อนไขที่เลือก
          </div>
        ) : (
          filteredSlips.map((slip) => {
            const bill = bills.find((b) => b.id === slip.bill_id);
            const room = rooms.find((r) => r.id === bill?.room_id);
            const rental = rentalProfiles.find((rp) => rp.id === bill?.rental_profile_id);
            const tenantUser = users.find((u) => u.id === rental?.user_id);
            const isAmountMatched = bill && bill.total_amount === slip.transfer_amount;

            return (
              <div key={`payment-card-${slip.id}`} className="payment-mobile-card">
                <div className="payment-card-header">
                  <div
                    className="payment-card-thumb"
                    onClick={() => setSelectedSlip(slip)}
                    title="คลิกดูสลิปขนาดใหญ่"
                  >
                    <img src={slip.slip_image_url} alt="สลิป" />
                  </div>
                  <div className="payment-card-info">
                    <div className="payment-card-room">ห้อง {room?.room_number || "-"}</div>
                    <div className="payment-card-tenant">{tenantUser?.full_name || "ผู้เช่าห้องพัก"}</div>
                    <div className="payment-card-role">ผู้เช่าห้อง {room?.room_number || "-"}</div>
                  </div>
                  <div className="payment-card-status">
                    {slip.status === "pending" && (
                      <span className="badge badge-pending">
                        <Clock size={11} /> รอตรวจสอบ
                      </span>
                    )}
                    {slip.status === "approved" && (
                      <span className="badge badge-paid">
                        <CheckCircle2 size={11} /> อนุมัติแล้ว
                      </span>
                    )}
                    {slip.status === "rejected" && (
                      <span className="badge badge-unpaid">
                        <XCircle size={11} /> ปฏิเสธสลิป
                      </span>
                    )}
                  </div>
                </div>

                <div className="payment-card-grid">
                  <div className="payment-grid-item">
                    <span className="payment-grid-label">งวดบิล</span>
                    <span className="payment-grid-val">
                      {bill ? `เดือน ${bill.month}/${bill.year}` : "-"}
                    </span>
                  </div>
                  <div className="payment-grid-item">
                    <span className="payment-grid-label">ยอดในบิล</span>
                    <span className="payment-grid-val" style={{ color: "var(--accent-gold)" }}>
                      ฿{bill?.total_amount.toLocaleString() || 0}
                    </span>
                  </div>
                  <div className="payment-grid-item">
                    <span className="payment-grid-label">ยอดโอนจริง</span>
                    <span className="payment-grid-val" style={{ color: isAmountMatched ? "#065f46" : "#dc2626" }}>
                      ฿{slip.transfer_amount.toLocaleString()}
                      {!isAmountMatched && (
                        <span style={{ fontSize: "0.68rem", color: "#dc2626", display: "block", fontWeight: 600 }}>
                          ⚠️ ยอดไม่ตรงบิล
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="payment-grid-item">
                    <span className="payment-grid-label">วัน-เวลาที่โอน</span>
                    <span className="payment-grid-val" style={{ fontSize: "0.78rem", fontWeight: 500, color: "var(--text-secondary)" }}>
                      {new Date(slip.transfer_time).toLocaleString("th-TH")}
                    </span>
                  </div>
                </div>

                <div className="payment-card-actions">
                  <button
                    type="button"
                    onClick={() => setSelectedSlip(slip)}
                    className="payment-card-btn payment-card-btn-primary"
                  >
                    <Eye size={16} /> ตรวจสอบสลิป
                  </button>

                  {slip.status === "pending" && (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                      <button
                        type="button"
                        onClick={() => handleApprove(slip.id)}
                        className="btn btn-success"
                        style={{ height: 42, justifyContent: "center", fontSize: "0.85rem" }}
                      >
                        <CheckCircle2 size={14} /> อนุมัติทันที
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenReject(slip)}
                        className="btn btn-danger"
                        style={{ height: 42, justifyContent: "center", fontSize: "0.85rem" }}
                      >
                        <XCircle size={14} /> ปฏิเสธสลิป
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Slip Audit & Comparison Modal */}
      {selectedSlip && (
        <div className="modal-overlay" onClick={() => setSelectedSlip(null)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 680, width: "100%", padding: "1.5rem" }}
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
                    <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
                      ตรวจสอบสลิปโอนเงิน ห้อง {r?.room_number} (งวด {b?.month}/{b?.year})
                    </h3>
                    <button
                      type="button"
                      onClick={() => setSelectedSlip(null)}
                      style={{ width: 36, height: 36, background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 8 }}
                      aria-label="ปิดหน้าต่าง"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem", marginBottom: "1.5rem" }}>
                    {/* Slip Image View */}
                    <div style={{ borderRadius: "10px", overflow: "hidden", background: "#000", border: "1px solid var(--border-color)", height: 300, maxHeight: "50vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <img
                        src={selectedSlip.slip_image_url}
                        alt="สลิปหลักฐาน"
                        style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                      />
                    </div>

                    {/* Comparison Details */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.9rem" }}>
                      <div style={{ background: "#f8fafc", padding: "0.85rem", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
                        <span style={{ color: "var(--text-muted)", display: "block", fontSize: "0.75rem" }}>ผู้เช่า</span>
                        <strong style={{ color: "var(--text-primary)" }}>{u?.full_name}</strong>
                        <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>โทร {u?.phone}</div>
                      </div>

                      <div style={{ background: "rgba(255,255,255,0.03)", padding: "0.85rem", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
                        <span style={{ color: "var(--text-muted)", display: "block", fontSize: "0.75rem" }}>ยอดในบิล</span>
                        <strong style={{ color: "var(--accent-gold)", fontSize: "1.2rem" }}>
                          ฿{b?.total_amount.toLocaleString()}
                        </strong>
                      </div>

                      <div style={{ background: isMatch ? "rgba(5, 150, 105, 0.08)" : "rgba(220, 38, 38, 0.08)", padding: "0.85rem", borderRadius: "8px", border: `1px solid ${isMatch ? "rgba(5, 150, 105, 0.25)" : "rgba(220, 38, 38, 0.25)"}` }}>
                        <span style={{ color: "var(--text-muted)", display: "block", fontSize: "0.75rem" }}>ยอดโอนตามสลิป</span>
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
                    <div style={{ display: "flex", gap: "0.75rem", borderTop: "1px solid var(--border-color)", paddingTop: "1rem", flexWrap: "wrap" }}>
                      <button
                        type="button"
                        onClick={() => handleOpenReject(selectedSlip)}
                        className="btn btn-danger"
                        style={{ flex: 1, minWidth: 120 }}
                      >
                        <XCircle size={16} /> ปฏิเสธสลิปนี้
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApprove(selectedSlip.id)}
                        className="btn btn-success"
                        style={{ flex: 2, minWidth: 150 }}
                      >
                        <CheckCircle2 size={16} /> อนุมัติการชำระเงิน
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
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 500, width: "100%", padding: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
                ระบุเหตุผลในการปฏิเสธสลิป
              </h3>
              <button
                type="button"
                onClick={() => setRejectModalSlip(null)}
                style={{ width: 36, height: 36, background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 8 }}
                aria-label="ปิดหน้าต่าง"
              >
                <X size={20} />
              </button>
            </div>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "1.25rem" }}>
              ผู้เช่าจะเห็นเหตุผลนี้และสามารถส่งสลิปใหม่ได้
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

              <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.25rem" }}>
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
