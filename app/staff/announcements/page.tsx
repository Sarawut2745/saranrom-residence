"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useDormitory } from "@/lib/store/dormitory-context";
import {
  Bell,
  Plus,
  Pin,
  Trash2,
  Calendar,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  Loader2,
  Search,
  X,
  User,
  Radio,
  Send,
  CheckCircle2,
  Layers,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import "./announcements.css";

interface LineStatus {
  configured: boolean;
  bot?: {
    userId: string;
    basicId: string;
    displayName: string;
    pictureUrl?: string;
  };
  quota?: {
    type: string;
    value: number;
  };
  usage?: {
    totalUsage: number;
  };
  error?: string;
}

export default function StaffAnnouncementsPage() {
  const { announcements, addAnnouncement, deleteAnnouncement, currentStaffProfile } = useDormitory();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [priority, setPriority] = useState<"normal" | "urgent">("normal");
  const [isPinned, setIsPinned] = useState(false);
  const [sendLineOnCreate, setSendLineOnCreate] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "pinned" | "urgent">("all");

  // Status & Feedback
  const [toast, setToast] = useState<{ type: "success" | "error" | "info"; msg: string } | null>(null);
  const [sendingLineId, setSendingLineId] = useState<string | null>(null);

  // LINE OA Connection state
  const [lineStatus, setLineStatus] = useState<LineStatus | null>(null);
  const [isCheckingLine, setIsCheckingLine] = useState(false);

  const fetchLineStatus = async () => {
    setIsCheckingLine(true);
    try {
      const res = await fetch("/api/line/notify");
      const data = await res.json();
      setLineStatus(data);
    } catch {
      setLineStatus({ configured: false, error: "ไม่สามารถตรวจสอบสถานะ LINE OA ได้" });
    } finally {
      setIsCheckingLine(false);
    }
  };

  useEffect(() => {
    fetchLineStatus();
  }, []);

  const showToast = (type: "success" | "error" | "info", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4500);
  };

  // Filter announcements
  const filteredAnnouncements = useMemo(() => {
    return announcements.filter((ann) => {
      // Tab filter
      if (activeTab === "pinned" && !ann.is_pinned) return false;
      if (activeTab === "urgent" && ann.priority !== "urgent") return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = ann.title?.toLowerCase().includes(q);
        const matchContent = ann.content?.toLowerCase().includes(q);
        return matchTitle || matchContent;
      }
      return true;
    });
  }, [announcements, activeTab, searchQuery]);

  const counts = useMemo(() => {
    return {
      all: announcements.length,
      pinned: announcements.filter((a) => a.is_pinned).length,
      urgent: announcements.filter((a) => a.priority === "urgent").length,
    };
  }, [announcements]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsSubmitting(true);
    try {
      const result = await addAnnouncement({
        title: title.trim(),
        content: content.trim(),
        priority,
        is_pinned: isPinned,
      });

      setTitle("");
      setContent("");
      setIsPinned(false);
      setPriority("normal");
      setIsModalOpen(false);

      if (result?.lineResult?.success) {
        showToast("success", "เผยแพร่ประกาศและส่งแจ้งเตือนเข้า LINE OA สำเร็จแล้ว");
        fetchLineStatus();
      } else if (result?.lineResult?.error) {
        showToast("info", `เผยแพร่บนหน้าเว็บสำเร็จ (LINE แจ้งเตือน: ${result.lineResult.error})`);
      } else {
        showToast("success", "เผยแพร่ประกาศบนหน้าเว็บเรียบร้อยแล้ว");
      }
    } catch (err: any) {
      showToast("error", `เกิดข้อผิดพลาด: ${err.message || "ไม่สามารถบันทึกได้"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendLineRepeat = async (ann: any) => {
    setSendingLineId(ann.id);
    try {
      const broadcastMsg = `[ประกาศจากหอพัก] ${ann.title}\n\n${ann.content}`;
      const res = await fetch("/api/line/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "broadcast", message: broadcastMsg }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        showToast("success", `ส่งแจ้งเตือนประกาศ "${ann.title}" เข้า LINE OA เรียบร้อยแล้ว`);
        fetchLineStatus();
      } else {
        showToast("error", `ส่ง LINE ไม่สำเร็จ: ${data.error || "เกิดข้อผิดพลาด"}`);
      }
    } catch (err: any) {
      showToast("error", `การเชื่อมต่อขัดข้อง: ${err.message}`);
    } finally {
      setSendingLineId(null);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("ยืนยันที่จะลบประกาศนี้ใช่หรือไม่?")) {
      deleteAnnouncement(id);
      showToast("info", "ลบประกาศเรียบร้อยแล้ว");
    }
  };

  // Calculate Quota Percentage
  const quotaTotal = lineStatus?.quota?.value || 300;
  const quotaUsed = lineStatus?.usage?.totalUsage || 0;
  const quotaPct = Math.min(100, Math.round((quotaUsed / quotaTotal) * 100));

  return (
    <div className="announcements-container">
      {/* Toast Notification */}
      {toast && (
        <div className={`toast-banner toast-${toast.type}`}>
          <div className="toast-icon">
            {toast.type === "success" && <CheckCircle2 size={18} />}
            {toast.type === "error" && <AlertTriangle size={18} />}
            {toast.type === "info" && <Bell size={18} />}
          </div>
          <div className="toast-message">{toast.msg}</div>
          <button onClick={() => setToast(null)} className="toast-close">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Page Header */}
      <header className="page-header">
        <div className="header-text-group">
          <div className="badge-pill">
            <Radio size={12} className="pulse-dot" />
            <span>ระบบบรอดแคสต์ข่าวสาร</span>
          </div>
          <h1 className="page-title">จัดการประกาศ & การแจ้งเตือน</h1>
          <p className="page-subtitle">
            โพสต์ข่าวสาร นัดหมายซ่อมบำรุง และส่ง Push Notification บรอดแคสต์เข้า LINE Official Account
          </p>
        </div>

        <button onClick={() => setIsModalOpen(true)} className="btn-create-announcement">
          <Plus size={18} />
          <span>สร้างประกาศใหม่</span>
        </button>
      </header>

      {/* 21st.dev Inspired SaaS LINE Official Account Card */}
      <section className="line-oa-banner">
        <div className="line-banner-content">
          {/* Brand & Bot identity */}
          <div className="line-identity">
            <div className="line-badge-logo">
              <span>LINE</span>
            </div>
            <div className="line-meta">
              <div className="line-title-row">
                <h2 className="line-bot-name">
                  {lineStatus?.bot?.displayName || "The Saranrom Center"}
                </h2>
                <span className={`status-chip ${lineStatus?.configured ? "chip-connected" : "chip-warning"}`}>
                  <span className="status-dot" />
                  {lineStatus?.configured ? "Messaging API เชื่อมต่อแล้ว" : "ยังไม่ได้ตั้งค่า"}
                </span>
              </div>
              <div className="line-handle-row">
                <span className="line-handle">{lineStatus?.bot?.basicId || "@594vkfpm"}</span>
                <span className="divider">•</span>
                <span className="line-desc">บรอดแคสต์ส่งถึงผู้เช่าทุกคนที่ติดตาม LINE OA</span>
              </div>
            </div>
          </div>

          {/* Quota Progress Bar */}
          <div className="line-quota-section">
            <div className="quota-header">
              <span className="quota-label">โควต้าส่งข้อความประจำเดือน</span>
              <span className="quota-numbers">
                <strong>{quotaUsed}</strong> / {quotaTotal} ข้อความ
              </span>
            </div>
            <div className="quota-track">
              <div className="quota-fill" style={{ width: `${Math.max(5, quotaPct)}%` }} />
            </div>
          </div>

          {/* Actions */}
          <div className="line-actions">
            <button
              onClick={fetchLineStatus}
              disabled={isCheckingLine}
              className="line-btn-secondary"
              title="ตรวจสอบสถานะและโควต้าล่าสุด"
            >
              <RefreshCw size={14} className={isCheckingLine ? "animate-spin" : ""} />
              <span>รีเฟรชโควต้า</span>
            </button>
            <a
              href="https://lin.ee/ryw8d3c"
              target="_blank"
              rel="noopener noreferrer"
              className="line-btn-primary"
            >
              <ExternalLink size={14} />
              <span>เปิด LINE OA</span>
            </a>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <div className="control-bar">
        {/* Segmented Filter Pills */}
        <div className="filter-tabs">
          <button
            onClick={() => setActiveTab("all")}
            className={`filter-pill ${activeTab === "all" ? "pill-active" : ""}`}
          >
            <Layers size={14} />
            <span>ทั้งหมด</span>
            <span className="pill-count">{counts.all}</span>
          </button>
          <button
            onClick={() => setActiveTab("pinned")}
            className={`filter-pill ${activeTab === "pinned" ? "pill-active" : ""}`}
          >
            <Pin size={14} />
            <span>ปักหมุด</span>
            <span className="pill-count">{counts.pinned}</span>
          </button>
          <button
            onClick={() => setActiveTab("urgent")}
            className={`filter-pill ${activeTab === "urgent" ? "pill-active" : ""}`}
          >
            <AlertTriangle size={14} />
            <span>ข่าวด่วน</span>
            <span className="pill-count">{counts.urgent}</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="search-box">
          <Search size={15} className="search-icon" />
          <input
            type="text"
            placeholder="ค้นหาตามหัวข้อ หรือเนื้อหา..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="search-clear">
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Announcements Feed */}
      {filteredAnnouncements.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon-wrap">
            <Bell size={28} />
          </div>
          <h3 className="empty-title">ไม่พบประกาศที่ตรงกับเงื่อนไข</h3>
          <p className="empty-subtitle">
            {searchQuery
              ? `ไม่มีประกาศที่มีคำว่า "${searchQuery}"`
              : "ยังไม่มีรายการประกาศในหมวดหมู่นี้ คุณสามารถสร้างประกาศใหม่ได้ตลอดเวลา"}
          </p>
          {(searchQuery || activeTab !== "all") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveTab("all");
              }}
              className="btn-reset-filters"
            >
              ล้างการค้นหา
            </button>
          )}
        </div>
      ) : (
        <div className="announcements-feed">
          {filteredAnnouncements.map((ann) => (
            <article key={ann.id} className={`announcement-card ${ann.priority === "urgent" ? "card-urgent" : ""}`}>
              {/* Card Header */}
              <div className="card-header">
                <div className="card-tags-and-title">
                  <div className="tags-row">
                    {ann.is_pinned && (
                      <span className="tag-badge tag-pinned">
                        <Pin size={12} />
                        <span>ปักหมุดเด่น</span>
                      </span>
                    )}
                    {ann.priority === "urgent" ? (
                      <span className="tag-badge tag-urgent">
                        <AlertTriangle size={12} />
                        <span>ข่าวด่วนมาก</span>
                      </span>
                    ) : (
                      <span className="tag-badge tag-normal">
                        <Bell size={12} />
                        <span>ทั่วไป</span>
                      </span>
                    )}
                  </div>
                  <h3 className="announcement-title">{ann.title}</h3>
                </div>

                {/* Card Top Actions */}
                <div className="card-actions">
                  <button
                    onClick={() => handleSendLineRepeat(ann)}
                    disabled={sendingLineId === ann.id}
                    className="btn-action-line"
                    title="ส่งแจ้งเตือนซ้ำเข้า LINE OA ของผู้เช่าทุกคน"
                  >
                    {sendingLineId === ann.id ? (
                      <>
                        <Loader2 size={13} className="animate-spin" />
                        <span>กำลังส่ง...</span>
                      </>
                    ) : (
                      <>
                        <Send size={13} />
                        <span>ส่ง LINE อีกครั้ง</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(ann.id)}
                    className="btn-action-delete"
                    title="ลบประกาศนี้"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              {/* Card Content Body */}
              <div className="card-body">
                <p className="card-text">{ann.content}</p>
              </div>

              {/* Card Meta Footer */}
              <footer className="card-footer">
                <div className="author-meta">
                  <div className="author-avatar">
                    <User size={13} />
                  </div>
                  <span className="author-name">{ann.author_name || "เจ้าหน้าที่นิติบุคคล"}</span>
                </div>
                <div className="date-meta">
                  <Calendar size={13} />
                  <span>
                    {new Date(ann.created_at).toLocaleDateString("th-TH", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })} น.
                  </span>
                </div>
              </footer>
            </article>
          ))}
        </div>
      )}

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <header className="dialog-header">
              <div className="dialog-title-group">
                <div className="dialog-icon-badge">
                  <Bell size={20} />
                </div>
                <div>
                  <h3 className="dialog-title">สร้างประกาศใหม่</h3>
                  <p className="dialog-subtitle">
                    เผยแพร่ข้อมูล ข่าวสาร หรือแจ้งเตือนผู้เช่าห้องพัก
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="dialog-close-btn"
                onClick={() => setIsModalOpen(false)}
                title="ปิด"
              >
                <X size={20} />
              </button>
            </header>

            <form onSubmit={handleCreate} className="dialog-form">
              <div className="form-fields">
                {/* Title */}
                <div className="form-field">
                  <label className="field-label" htmlFor="ann-title">
                    หัวข้อประกาศ <span className="required">*</span>
                  </label>
                  <input
                    id="ann-title"
                    type="text"
                    className="field-input"
                    placeholder="เช่น แจ้งกำหนดการล้างแอร์ประจำปี 2568"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                {/* Priority Selection */}
                <div className="form-field">
                  <label className="field-label">ระดับความสำคัญ</label>
                  <div className="priority-options">
                    <label
                      className={`priority-option ${priority === "normal" ? "selected normal" : ""}`}
                    >
                      <input
                        type="radio"
                        name="priority"
                        value="normal"
                        checked={priority === "normal"}
                        onChange={() => setPriority("normal")}
                      />
                      <div className="priority-content">
                        <span className="priority-name">ทั่วไป (Normal)</span>
                        <span className="priority-desc">
                          ข่าวสาร ข้อมูลทั่วไป ไม่มีผลกระทบเร่งด่วน
                        </span>
                      </div>
                    </label>

                    <label
                      className={`priority-option ${priority === "urgent" ? "selected urgent" : ""}`}
                    >
                      <input
                        type="radio"
                        name="priority"
                        value="urgent"
                        checked={priority === "urgent"}
                        onChange={() => setPriority("urgent")}
                      />
                      <div className="priority-content">
                        <span className="priority-name">ด่วนมาก (Urgent)</span>
                        <span className="priority-desc">
                          ตัดน้ำ ตัดไฟ ปรับปรุงฉุกเฉิน เน้นสีกรอบแดง
                        </span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Pinned Checkbox */}
                <div className="form-field">
                  <label className="checkbox-control">
                    <input
                      type="checkbox"
                      checked={isPinned}
                      onChange={(e) => setIsPinned(e.target.checked)}
                    />
                    <span className="checkbox-indicator"></span>
                    <span className="checkbox-label">
                      <strong>ปักหมุดประกาศนี้ไว้บนสุดเสมอ (Pin to top)</strong>
                      <span className="checkbox-desc">
                        ประกาศจะแสดงอยู่บนสุดของรายการและแดชบอร์ดผู้เช่า
                      </span>
                    </span>
                  </label>
                </div>

                {/* LINE OA Broadcast Toggle */}
                <div className="form-field">
                  <label className="checkbox-control line-broadcast-control">
                    <input
                      type="checkbox"
                      checked={sendLineOnCreate}
                      onChange={(e) => setSendLineOnCreate(e.target.checked)}
                    />
                    <span className="checkbox-indicator line-check"></span>
                    <span className="checkbox-label">
                      <strong>
                        บรอดแคสต์ส่งเข้า LINE OA ผู้เช่าทันที (@594vkfpm)
                      </strong>
                      <span className="checkbox-desc">
                        ส่ง Push Message เตือนผู้เช่าทุกคนที่ติดตาม LINE Official
                      </span>
                    </span>
                  </label>
                </div>

                {/* Content */}
                <div className="form-field">
                  <label className="field-label" htmlFor="ann-content">
                    เนื้อหาประกาศ <span className="required">*</span>
                  </label>
                  <textarea
                    id="ann-content"
                    className="field-textarea"
                    rows={5}
                    placeholder="ระบุรายละเอียดของประกาศ เช่น วันและเวลาที่นัดหมาย คำแนะนำสำหรับผู้เช่า..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                  />
                </div>
              </div>

              <footer className="dialog-footer">
                <button
                  type="button"
                  className="dialog-btn-cancel"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="dialog-btn-submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="spin-icon" />
                      <span>กำลังเผยแพร่...</span>
                    </>
                  ) : (
                    <span>เผยแพร่ประกาศทันที</span>
                  )}
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
