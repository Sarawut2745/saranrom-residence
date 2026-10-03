"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDormitory } from "@/lib/store/dormitory-context";
import "./meter-reading.css";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Droplets,
  Zap,
  Check,
  AlertTriangle,
  Receipt,
  Layers,
  Sparkles,
  CheckCircle2,
  Calendar,
  X,
  Loader2,
  Send,
  Building,
  User,
  HelpCircle,
  Download,
  Smartphone,
} from "lucide-react";

interface RoomReadingDraft {
  waterCurr: string;
  electricCurr: string;
  otherFees: number;
  isRecorded: boolean;
}

export default function MeterReadingPage() {
  const router = useRouter();
  const {
    currentUser,
    currentStaffProfile,
    isLoading,
    rooms,
    roomTypes,
    rentalProfiles,
    users,
    bills,
    batchCreateBills,
  } = useDormitory();

  // Redirect if not staff
  useEffect(() => {
    if (!isLoading) {
      if (!currentUser) {
        router.replace("/login");
      } else if (currentUser.role !== "staff" && !currentStaffProfile) {
        router.replace("/rental/dashboard");
      }
    }
  }, [isLoading, currentUser, currentStaffProfile, router]);

  // Billing Period
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState<number>(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(currentDate.getFullYear());

  // UI Mode & Filters
  const [activeMode, setActiveMode] = useState<"focus" | "list">("focus");
  const [selectedFloor, setSelectedFloor] = useState<string>("all");
  const [currentFocusIndex, setCurrentFocusIndex] = useState<number>(0);

  // Batch bill review modal
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [dueDate, setDueDate] = useState<string>(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState<string>("");

  // Storage key for local drafts
  const storageKey = `meter_draft_${selectedYear}_${selectedMonth}`;

  // PWA install state
  const [isStandalone, setIsStandalone] = useState(false);
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const standalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone === true;
      setIsStandalone(standalone);

      const handleBeforeInstall = (e: any) => {
        e.preventDefault();
        setDeferredPrompt(e);
      };

      window.addEventListener("beforeinstallprompt", handleBeforeInstall);
      return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    }
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === "accepted") {
        setDeferredPrompt(null);
        setShowInstallGuide(false);
      }
    } else {
      setShowInstallGuide(true);
    }
  };

  // Local draft readings map: { [roomId]: RoomReadingDraft }
  const [readings, setReadings] = useState<Record<string, RoomReadingDraft>>({});

  // Sort rooms naturally by floor and room number (e.g. 201, 202, ..., 506)
  const sortedRooms = useMemo(() => {
    return [...rooms].sort((a, b) => {
      if (a.floor !== b.floor) return a.floor - b.floor;
      return a.room_number.localeCompare(b.room_number, undefined, { numeric: true });
    });
  }, [rooms]);

  // Available floors list
  const availableFloors = useMemo(() => {
    const floors = Array.from(new Set(rooms.map((r) => r.floor))).sort((a, b) => a - b);
    return floors;
  }, [rooms]);

  // Filtered rooms based on selected floor
  const filteredRooms = useMemo(() => {
    if (selectedFloor === "all") return sortedRooms;
    return sortedRooms.filter((r) => r.floor.toString() === selectedFloor);
  }, [sortedRooms, selectedFloor]);

  // Helper to get previous meter readings for a room
  const getPreviousReadings = (roomId: string) => {
    // Find latest bill prior to this month/year
    const pastBills = bills.filter(
      (b) =>
        b.room_id === roomId &&
        (b.year < selectedYear || (b.year === selectedYear && b.month < selectedMonth))
    );
    pastBills.sort((a, b) => b.year - a.year || b.month - a.month);
    const lastBill = pastBills[0];

    // Defaults based on room number if no past bill exists
    const fallbackWater = 120;
    const fallbackElectric = 450;

    return {
      waterPrev: lastBill ? lastBill.water_meter_current : fallbackWater,
      electricPrev: lastBill ? lastBill.electric_meter_current : fallbackElectric,
    };
  };

  // Helper to check if a bill already exists for this room in current month/year
  const getExistingBill = (roomId: string) => {
    return bills.find((b) => b.room_id === roomId && b.month === selectedMonth && b.year === selectedYear);
  };

  // Load drafts on mount or when period changes
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setReadings(JSON.parse(saved));
      } else {
        setReadings({});
      }
    } catch {
      setReadings({});
    }
  }, [storageKey]);

  // Save drafts whenever readings change
  const updateReading = (roomId: string, updates: Partial<RoomReadingDraft>) => {
    setReadings((prev) => {
      const current = prev[roomId] || {
        waterCurr: "",
        electricCurr: "",
        otherFees: 100,
        isRecorded: false,
      };
      const updated = { ...prev, [roomId]: { ...current, ...updates } };
      try {
        localStorage.setItem(storageKey, JSON.stringify(updated));
      } catch (e) {
        console.warn("Could not save to localStorage", e);
      }
      return updated;
    });
  };

  // Current focus room
  const currentRoom = filteredRooms[currentFocusIndex] || filteredRooms[0];
  const currentRoomType = roomTypes.find((rt) => rt.id === currentRoom?.room_type_id);
  const currentRental = rentalProfiles.find((rp) => rp.room_id === currentRoom?.id && rp.status === "active") || rentalProfiles.find((rp) => rp.room_id === currentRoom?.id);
  const currentTenantUser = currentRental ? users.find((u) => u.id === currentRental.user_id) : null;

  const currentPrev = currentRoom ? getPreviousReadings(currentRoom.id) : { waterPrev: 0, electricPrev: 0 };
  const currentReading = currentRoom ? readings[currentRoom.id] || { waterCurr: "", electricCurr: "", otherFees: 100, isRecorded: false } : null;
  const currentExistingBill = currentRoom ? getExistingBill(currentRoom.id) : null;

  // Calculate live numbers for current focus room
  const waterRate = currentRoomType?.water_rate || 18;
  const electricRate = currentRoomType?.electric_rate || 8;

  const currentWaterVal = currentExistingBill ? currentExistingBill.water_meter_current : (currentReading?.waterCurr !== "" ? Number(currentReading?.waterCurr) : NaN);
  const currentElectricVal = currentExistingBill ? currentExistingBill.electric_meter_current : (currentReading?.electricCurr !== "" ? Number(currentReading?.electricCurr) : NaN);

  const waterUnits = !isNaN(currentWaterVal) ? Math.max(0, currentWaterVal - currentPrev.waterPrev) : 0;
  const electricUnits = !isNaN(currentElectricVal) ? Math.max(0, currentElectricVal - currentPrev.electricPrev) : 0;
  const waterFee = waterUnits * waterRate;
  const electricFee = electricUnits * electricRate;
  const roomRent = currentRoom?.monthly_rent || 4500;
  const otherFees = currentReading?.otherFees ?? 100;
  const totalEstimate = roomRent + waterFee + electricFee + otherFees;

  // Anomalies
  const isWaterLower = !isNaN(currentWaterVal) && currentWaterVal < currentPrev.waterPrev;
  const isElectricLower = !isNaN(currentElectricVal) && currentElectricVal < currentPrev.electricPrev;

  // Stats
  const stats = useMemo(() => {
    let recordedCount = 0;
    let totalEligible = 0;

    for (const room of sortedRooms) {
      const hasTenant = rentalProfiles.some((rp) => rp.room_id === room.id);
      if (hasTenant) {
        totalEligible++;
        const hasBill = bills.some((b) => b.room_id === room.id && b.month === selectedMonth && b.year === selectedYear);
        const hasDraft = readings[room.id]?.isRecorded && readings[room.id]?.waterCurr && readings[room.id]?.electricCurr;
        if (hasBill || hasDraft) {
          recordedCount++;
        }
      }
    }

    const percentage = totalEligible > 0 ? Math.round((recordedCount / totalEligible) * 100) : 0;
    return { recordedCount, totalEligible, percentage };
  }, [sortedRooms, rentalProfiles, bills, selectedMonth, selectedYear, readings]);

  // Navigate in focus mode
  const handleSaveAndNext = () => {
    if (!currentRoom) return;

    // Mark current room as recorded
    updateReading(currentRoom.id, { isRecorded: true });

    // Move to next room
    if (currentFocusIndex < filteredRooms.length - 1) {
      setCurrentFocusIndex(currentFocusIndex + 1);
    } else {
      setSuccessToast("จดมิเตอร์ครบทุกห้องในชั้นนี้เรียบร้อยแล้ว!");
      setTimeout(() => setSuccessToast(""), 3500);
    }
  };

  const handlePrev = () => {
    if (currentFocusIndex > 0) {
      setCurrentFocusIndex(currentFocusIndex - 1);
    }
  };

  // Prepare list of unbilled recorded rooms for batch generation
  const pendingBillRooms = useMemo(() => {
    return sortedRooms.filter((r) => {
      const hasTenant = rentalProfiles.some((rp) => rp.room_id === r.id);
      if (!hasTenant) return false;
      const alreadyBilled = bills.some((b) => b.room_id === r.id && b.month === selectedMonth && b.year === selectedYear);
      if (alreadyBilled) return false;
      const reading = readings[r.id];
      return reading && reading.waterCurr !== "" && reading.electricCurr !== "";
    });
  }, [sortedRooms, rentalProfiles, bills, selectedMonth, selectedYear, readings]);

  // Handle batch bill generation
  const handleConfirmBatchBills = async () => {
    if (pendingBillRooms.length === 0) return;
    setIsSubmitting(true);

    const payload = pendingBillRooms.map((room) => {
      const prev = getPreviousReadings(room.id);
      const draft = readings[room.id];
      return {
        room_id: room.id,
        month: selectedMonth,
        year: selectedYear,
        water_meter_previous: prev.waterPrev,
        water_meter_current: Number(draft.waterCurr),
        electric_meter_previous: prev.electricPrev,
        electric_meter_current: Number(draft.electricCurr),
        other_fees: draft.otherFees || 100,
        due_date: dueDate,
      };
    });

    const result = await batchCreateBills(payload);
    setIsSubmitting(false);
    setIsReviewOpen(false);

    if (result.success) {
      setSuccessToast(`ออกใบแจ้งหนี้สำเร็จ ${result.count} ห้องเรียบร้อยแล้ว! ผู้เช่าสามารถดูบิลได้ทันที`);
      setTimeout(() => setSuccessToast(""), 5000);
    }
  };

  if (isLoading || !currentUser) {
    return (
      <div className="mr-container" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Loader2 size={36} className="animate-spin" style={{ color: "#4f46e5" }} />
      </div>
    );
  }

  const handleBack = () => {
    if (typeof window !== "undefined" && window.opener && !window.opener.closed) {
      window.close();
    } else {
      router.push("/staff/bills");
    }
  };

  return (
    <div className="mr-container">
      {/* Toast notification */}
      {successToast && (
        <div
          style={{
            position: "fixed",
            top: "1.25rem",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#065f46",
            color: "#ffffff",
            padding: "0.75rem 1.25rem",
            borderRadius: "12px",
            zIndex: 200,
            fontSize: "0.88rem",
            fontWeight: 700,
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            maxWidth: "90vw",
            textAlign: "center",
          }}
        >
          <CheckCircle2 size={18} />
          <span>{successToast}</span>
        </div>
      )}

      {/* Sticky Header */}
      <header className="mr-header">
        <div className="mr-header-top">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <button type="button" onClick={handleBack} className="mr-back-btn">
              <ArrowLeft size={16} />
              <span>กลับหน้ารายการบิล</span>
            </button>
            {!isStandalone && (
              <button
                type="button"
                onClick={handleInstallClick}
                className="mr-install-pill"
                title="ติดตั้งเป็นแอปบนมือถือ"
              >
                <Smartphone size={13} />
                <span>ติดตั้งเป็นแอป</span>
              </button>
            )}
          </div>
          <div className="mr-title-area">
            <h1 className="mr-title">
              <Zap size={19} style={{ color: "#d97706" }} />
              จดมิเตอร์น้ำ-ไฟ
            </h1>
            <div className="mr-period-pill">
              <Calendar size={12} />
              <span>
                รอบเดือน: {selectedMonth}/{selectedYear}
              </span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mr-progress-card">
          <div className="mr-progress-info">
            <span>ความคืบหน้าการจดมิเตอร์</span>
            <span style={{ color: stats.percentage === 100 ? "#059669" : "#4f46e5" }}>
              {stats.recordedCount} / {stats.totalEligible} ห้อง ({stats.percentage}%)
            </span>
          </div>
          <div className="mr-progress-track">
            <div className="mr-progress-fill" style={{ width: `${stats.percentage}%` }} />
          </div>
        </div>

        {/* Floor selector pills */}
        <div className="mr-floor-pills">
          <button
            onClick={() => {
              setSelectedFloor("all");
              setCurrentFocusIndex(0);
            }}
            className={`mr-floor-pill ${selectedFloor === "all" ? "active" : ""}`}
          >
            <span>ทุกชั้น</span>
            <span className="mr-floor-badge">{sortedRooms.length}</span>
          </button>
          {availableFloors.map((floor) => {
            const count = sortedRooms.filter((r) => r.floor === floor).length;
            return (
              <button
                key={floor}
                onClick={() => {
                  setSelectedFloor(floor.toString());
                  setCurrentFocusIndex(0);
                }}
                className={`mr-floor-pill ${selectedFloor === floor.toString() ? "active" : ""}`}
              >
                <span>ชั้น {floor}</span>
                <span className="mr-floor-badge">{count}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Mode Switcher Tabs */}
      <div className="mr-mode-tabs">
        <button
          type="button"
          onClick={() => setActiveMode("focus")}
          className={`mr-mode-tab ${activeMode === "focus" ? "active" : ""}`}
        >
          <Building size={16} />
          <span>โหมดเดินจดทีละห้อง</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveMode("list")}
          className={`mr-mode-tab ${activeMode === "list" ? "active" : ""}`}
        >
          <Layers size={16} />
          <span>โหมดภาพรวมทั้งชั้น</span>
        </button>
      </div>

      {/* ============================================================ */}
      {/* MODE 1: FOCUS WALK MODE (Single-handed Door-to-Door UI)        */}
      {/* ============================================================ */}
      {activeMode === "focus" && currentRoom && (
        <div>
          {/* Progress Indicator for current floor */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "0.82rem",
              color: "var(--text-secondary)",
              marginBottom: "0.65rem",
              padding: "0 0.25rem",
            }}
          >
            <span>
              ห้องที่ {currentFocusIndex + 1} จาก {filteredRooms.length} ห้อง
            </span>
            {currentExistingBill ? (
              <span style={{ color: "#059669", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                <CheckCircle2 size={14} /> ออกบิลเดือนนี้แล้ว
              </span>
            ) : currentReading?.isRecorded ? (
              <span style={{ color: "#4f46e5", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                <Check size={14} /> จดแล้ว
              </span>
            ) : (
              <span style={{ color: "#d97706", fontWeight: 600 }}>ยังไม่ได้จด</span>
            )}
          </div>

          <div className="mr-focus-card">
            {/* Room Title & Tenant Info */}
            <div className="mr-focus-header">
              <div className="mr-room-title">
                <span className="mr-room-number">{currentRoom.room_number}</span>
                <span className="mr-room-floor">
                  (ชั้น {currentRoom.floor} • {currentRoomType?.name || "ห้องพัก"})
                </span>
              </div>
              <div className="mr-room-tenant-badge">
                {currentTenantUser ? (
                  <>
                    <span className="mr-tenant-name">
                      <User size={12} style={{ display: "inline", marginRight: "4px" }} />
                      {currentTenantUser.full_name}
                    </span>
                    <span className="mr-room-rent">ค่าเช่า ฿{currentRoom.monthly_rent.toLocaleString()}/ด.</span>
                  </>
                ) : (
                  <span
                    style={{
                      background: "#f1f5f9",
                      color: "#64748b",
                      padding: "0.25rem 0.6rem",
                      borderRadius: "6px",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                    }}
                  >
                    ห้องว่าง
                  </span>
                )}
              </div>
            </div>

            {/* WATER METER SECTION */}
            <div className="mr-meter-box mr-meter-water">
              <div className="mr-meter-header">
                <div className="mr-meter-label">
                  <Droplets size={18} />
                  <span>มิเตอร์น้ำประปา</span>
                </div>
                <div className="mr-prev-tag">
                  ครั้งก่อน: <strong>{currentPrev.waterPrev}</strong>
                </div>
              </div>

              <div className="mr-meter-input-row">
                <div className="mr-meter-input-wrapper">
                  <span className="mr-meter-unit-label">เลขมิเตอร์:</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    pattern="[0-9]*"
                    placeholder={currentPrev.waterPrev.toString()}
                    value={currentExistingBill ? currentExistingBill.water_meter_current : currentReading?.waterCurr || ""}
                    disabled={!!currentExistingBill}
                    onChange={(e) => updateReading(currentRoom.id, { waterCurr: e.target.value })}
                    className="mr-meter-input"
                  />
                </div>
              </div>

              {/* Water calculation display */}
              <div className="mr-meter-calc">
                <span className="mr-meter-calc-units">
                  ใช้ไป: <strong>{waterUnits}</strong> หน่วย (@{waterRate} บ.)
                </span>
                <span className="mr-meter-calc-cost">รวม: ฿{waterFee.toLocaleString()}</span>
              </div>

              {/* Warning if lower */}
              {isWaterLower && (
                <div className="mr-warning-banner">
                  <AlertTriangle size={15} />
                  <span>เลขที่กรอก ({currentWaterVal}) น้อยกว่าเลขครั้งก่อน ({currentPrev.waterPrev})</span>
                </div>
              )}
            </div>

            {/* ELECTRIC METER SECTION */}
            <div className="mr-meter-box mr-meter-electric">
              <div className="mr-meter-header">
                <div className="mr-meter-label">
                  <Zap size={18} />
                  <span>มิเตอร์ไฟฟ้า</span>
                </div>
                <div className="mr-prev-tag">
                  ครั้งก่อน: <strong>{currentPrev.electricPrev}</strong>
                </div>
              </div>

              <div className="mr-meter-input-row">
                <div className="mr-meter-input-wrapper">
                  <span className="mr-meter-unit-label">เลขมิเตอร์:</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    pattern="[0-9]*"
                    placeholder={currentPrev.electricPrev.toString()}
                    value={currentExistingBill ? currentExistingBill.electric_meter_current : currentReading?.electricCurr || ""}
                    disabled={!!currentExistingBill}
                    onChange={(e) => updateReading(currentRoom.id, { electricCurr: e.target.value })}
                    className="mr-meter-input"
                  />
                </div>
              </div>

              {/* Electric calculation display */}
              <div className="mr-meter-calc">
                <span className="mr-meter-calc-units">
                  ใช้ไป: <strong>{electricUnits}</strong> หน่วย (@{electricRate} บ.)
                </span>
                <span className="mr-meter-calc-cost">รวม: ฿{electricFee.toLocaleString()}</span>
              </div>

              {/* Warning if lower */}
              {isElectricLower && (
                <div className="mr-warning-banner">
                  <AlertTriangle size={15} />
                  <span>เลขที่กรอก ({currentElectricVal}) น้อยกว่าเลขครั้งก่อน ({currentPrev.electricPrev})</span>
                </div>
              )}
            </div>

            {/* Total summary estimate for this room */}
            <div
              style={{
                background: "#f8fafc",
                borderRadius: "12px",
                padding: "0.85rem 1rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "0.85rem",
              }}
            >
              <div>
                <span style={{ fontSize: "0.78rem", color: "#64748b", fontWeight: 600 }}>ยอดรวมโดยประมาณ</span>
                <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                  (ค่าห้อง {roomRent} + น้ำ {waterFee} + ไฟ {electricFee} + ส่วนกลาง {otherFees})
                </div>
              </div>
              <div style={{ fontSize: "1.35rem", fontWeight: 850, color: "#0f172a" }}>
                ฿{totalEstimate.toLocaleString()}
              </div>
            </div>

            {/* Focus Navigation Controls */}
            <div className="mr-focus-nav">
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentFocusIndex === 0}
                className="mr-btn-prev"
              >
                <ChevronLeft size={18} />
                <span>ก่อนหน้า</span>
              </button>

              <button
                type="button"
                onClick={handleSaveAndNext}
                className="mr-btn-next"
              >
                <span>บันทึก & ห้องถัดไป</span>
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODE 2: LIST MODE (Overview of all rooms on the floor)        */}
      {/* ============================================================ */}
      {activeMode === "list" && (
        <div className="mr-list-container">
          {filteredRooms.map((room) => {
            const rType = roomTypes.find((rt) => rt.id === room.room_type_id);
            const rental = rentalProfiles.find((rp) => rp.room_id === room.id && rp.status === "active") || rentalProfiles.find((rp) => rp.room_id === room.id);
            const tenant = rental ? users.find((u) => u.id === rental.user_id) : null;
            const prev = getPreviousReadings(room.id);
            const draft = readings[room.id] || { waterCurr: "", electricCurr: "", otherFees: 100, isRecorded: false };
            const existing = getExistingBill(room.id);

            const isRecorded = !!existing || (draft.waterCurr !== "" && draft.electricCurr !== "");

            return (
              <div
                key={room.id}
                className={`mr-list-card ${isRecorded ? "recorded" : "pending"}`}
              >
                <div className="mr-list-card-header">
                  <div>
                    <strong style={{ fontSize: "1.25rem", color: "#0f172a" }}>
                      ห้อง {room.room_number}
                    </strong>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginLeft: "0.5rem" }}>
                      (ชั้น {room.floor})
                    </span>
                    <div style={{ fontSize: "0.82rem", color: "#475569", marginTop: "0.15rem" }}>
                      {tenant ? tenant.full_name : <span style={{ color: "#94a3b8" }}>ห้องว่าง</span>}
                    </div>
                  </div>

                  <div>
                    {existing ? (
                      <span className="badge badge-paid" style={{ fontSize: "0.75rem" }}>
                        ออกบิลแล้ว
                      </span>
                    ) : isRecorded ? (
                      <span className="badge badge-confirmed" style={{ fontSize: "0.75rem" }}>
                        จดแล้ว
                      </span>
                    ) : (
                      <span className="badge badge-pending" style={{ fontSize: "0.75rem" }}>
                        ยังไม่จด
                      </span>
                    )}
                  </div>
                </div>

                <div className="mr-list-inputs-grid">
                  {/* Water */}
                  <div className="mr-list-input-cell">
                    <label>
                      <Droplets size={12} style={{ color: "#0284c7", display: "inline" }} /> น้ำ (ก่อน: {prev.waterPrev})
                    </label>
                    <input
                      type="number"
                      inputMode="decimal"
                      pattern="[0-9]*"
                      placeholder={prev.waterPrev.toString()}
                      value={existing ? existing.water_meter_current : draft.waterCurr}
                      disabled={!!existing}
                      onChange={(e) =>
                        updateReading(room.id, { waterCurr: e.target.value, isRecorded: true })
                      }
                    />
                  </div>

                  {/* Electricity */}
                  <div className="mr-list-input-cell">
                    <label>
                      <Zap size={12} style={{ color: "#d97706", display: "inline" }} /> ไฟ (ก่อน: {prev.electricPrev})
                    </label>
                    <input
                      type="number"
                      inputMode="decimal"
                      pattern="[0-9]*"
                      placeholder={prev.electricPrev.toString()}
                      value={existing ? existing.electric_meter_current : draft.electricCurr}
                      disabled={!!existing}
                      onChange={(e) =>
                        updateReading(room.id, { electricCurr: e.target.value, isRecorded: true })
                      }
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ============================================================ */}
      {/* STICKY BOTTOM BAR (Ready to Generate Bills)                   */}
      {/* ============================================================ */}
      <div className="mr-bottom-bar">
        <div className="mr-bottom-inner">
          <div className="mr-bottom-stats">
            <span className="mr-bottom-stats-title">พร้อมออกบิล</span>
            <span className="mr-bottom-stats-value">{pendingBillRooms.length} ห้อง</span>
          </div>

          <button
            type="button"
            disabled={pendingBillRooms.length === 0}
            onClick={() => setIsReviewOpen(true)}
            className="mr-btn-generate-all"
          >
            <Receipt size={17} />
            <span>ตรวจทาน & ออกบิล</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* BATCH REVIEW & CONFIRMATION MODAL                            */}
      {/* ============================================================ */}
      {isReviewOpen && (
        <div className="mr-modal-overlay" onClick={() => setIsReviewOpen(false)}>
          <div className="mr-modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1rem",
              }}
            >
              <div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 800, margin: 0, color: "#0f172a" }}>
                  สรุปการออกบิลประจำเดือน
                </h3>
                <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", margin: 0 }}>
                  รอบบิล: เดือน {selectedMonth}/{selectedYear} ({pendingBillRooms.length} ห้อง)
                </p>
              </div>
              <button
                onClick={() => setIsReviewOpen(false)}
                style={{
                  background: "#f1f5f9",
                  border: "none",
                  borderRadius: "50%",
                  width: 32,
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Due date picker */}
            <div style={{ marginBottom: "1.25rem", background: "#f8fafc", padding: "0.85rem", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#334155", marginBottom: "0.35rem" }}>
                กำหนดชำระเงินภายในวันที่ (Due Date):
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                style={{
                  width: "100%",
                  height: "42px",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  padding: "0 0.75rem",
                  fontSize: "0.92rem",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Room Breakdown List */}
            <div style={{ maxHeight: "300px", overflowY: "auto", marginBottom: "1.25rem" }}>
              {pendingBillRooms.map((room) => {
                const prev = getPreviousReadings(room.id);
                const draft = readings[room.id];
                const rType = roomTypes.find((rt) => rt.id === room.room_type_id);
                const wRate = rType?.water_rate || 18;
                const eRate = rType?.electric_rate || 8;

                const wUnits = Math.max(0, Number(draft.waterCurr) - prev.waterPrev);
                const eUnits = Math.max(0, Number(draft.electricCurr) - prev.electricPrev);
                const total = room.monthly_rent + wUnits * wRate + eUnits * eRate + (draft.otherFees || 100);

                return (
                  <div
                    key={room.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "0.65rem 0",
                      borderBottom: "1px solid #f1f5f9",
                      fontSize: "0.86rem",
                    }}
                  >
                    <div>
                      <strong style={{ color: "#0f172a" }}>ห้อง {room.room_number}</strong>
                      <div style={{ fontSize: "0.76rem", color: "#64748b" }}>
                        น้ำ {wUnits} หน่วย • ไฟ {eUnits} หน่วย
                      </div>
                    </div>
                    <div style={{ fontWeight: 800, color: "#0f172a" }}>
                      ฿{total.toLocaleString()}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Submit CTA */}
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleConfirmBatchBills}
              style={{
                width: "100%",
                height: "50px",
                borderRadius: "12px",
                background: "#4f46e5",
                color: "#ffffff",
                fontSize: "1rem",
                fontWeight: 750,
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                boxShadow: "0 4px 14px rgba(79, 70, 229, 0.35)",
              }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>กำลังออกใบแจ้งหนี้...</span>
                </>
              ) : (
                <>
                  <Send size={16} />
                  <span>ยืนยันออกใบแจ้งหนี้ ({pendingBillRooms.length} ห้อง)</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* PWA INSTALL GUIDE MODAL                                      */}
      {/* ============================================================ */}
      {showInstallGuide && (
        <div className="mr-modal-overlay" onClick={() => setShowInstallGuide(false)}>
          <div className="mr-modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(79, 70, 229, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#4f46e5" }}>
                  <Smartphone size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 800, margin: 0, color: "#0f172a" }}>
                    วิธีติดตั้งแอปบนหน้าจอมือถือ
                  </h3>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", margin: 0 }}>
                    เปิดเต็มจอ 100% ไร้แถบเบราว์เซอร์กวนใจ
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowInstallGuide(false)}
                style={{
                  background: "#f1f5f9",
                  border: "none",
                  borderRadius: "50%",
                  width: 32,
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* iOS Safari Guide */}
            <div className="mr-install-card">
              <div className="mr-install-platform-title">
                <span>🍎 สำหรับ iPhone / iPad (Safari)</span>
              </div>
              <div className="mr-install-step">
                <span className="mr-step-badge">1</span>
                <span>แตะปุ่ม <strong>แชร์ (Share)</strong> ที่แถบด้านล่างของ Safari</span>
              </div>
              <div className="mr-install-step">
                <span className="mr-step-badge">2</span>
                <span>เลื่อนลงมาแล้วเลือก <strong>"เพิ่มไปยังหน้าจอโฮม" (Add to Home Screen)</strong></span>
              </div>
              <div className="mr-install-step">
                <span className="mr-step-badge">3</span>
                <span>แตะ <strong>"เพิ่ม" (Add)</strong> จะได้ไอคอนแอปบนหน้าจอมือถือทันที!</span>
              </div>
            </div>

            {/* Android Chrome Guide */}
            <div className="mr-install-card">
              <div className="mr-install-platform-title">
                <span>🤖 สำหรับ Android (Google Chrome)</span>
              </div>
              <div className="mr-install-step">
                <span className="mr-step-badge">1</span>
                <span>แตะปุ่ม <strong>จุดสามจุด (⋮)</strong> ที่มุมขวาบนของเบราว์เซอร์</span>
              </div>
              <div className="mr-install-step">
                <span className="mr-step-badge">2</span>
                <span>เลือก <strong>"ติดตั้งแอป" (Install App)</strong> หรือ <strong>"เพิ่มลงในหน้าจอหลัก"</strong></span>
              </div>
              <div className="mr-install-step">
                <span className="mr-step-badge">3</span>
                <span>กดยืนยันติดตั้ง ไอคอนแอปจะไปอยู่ที่หน้าจอโฮมทันที</span>
              </div>
            </div>

            {deferredPrompt && (
              <button
                type="button"
                onClick={handleInstallClick}
                style={{
                  width: "100%",
                  height: "48px",
                  borderRadius: "12px",
                  background: "#4f46e5",
                  color: "#ffffff",
                  fontSize: "0.95rem",
                  fontWeight: 750,
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  marginTop: "0.75rem",
                }}
              >
                <Download size={17} />
                <span>กดเพื่อติดตั้งแอปทันที</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowInstallGuide(false)}
              style={{
                width: "100%",
                height: "42px",
                borderRadius: "10px",
                background: "#f1f5f9",
                color: "#475569",
                fontSize: "0.9rem",
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
                marginTop: "0.65rem",
              }}
            >
              เข้าใจแล้ว
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
