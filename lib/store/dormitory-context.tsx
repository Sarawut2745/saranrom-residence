"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { createClient } from "@/client";
import {
  User,
  StaffProfile,
  RentalProfile,
  RoomType,
  Room,
  Contract,
  Bill,
  PaymentSlip,
  RepairRequest,
  Announcement,
  SiteContent,
  RoomStatus,
  RepairStatus,
} from "@/types/dormitory";

interface CreateTenantData {
  full_name: string;
  phone: string;
  email: string;
  password?: string;
  id_card_number: string;
  emergency_contact: string;
  emergency_phone?: string;
  room_id: string;
  start_date: string;
  end_date: string;
  move_in_date: string;
  deposit_amount: number;
}

interface DormitoryContextType {
  users: User[];
  staffProfiles: StaffProfile[];
  rentalProfiles: RentalProfile[];
  roomTypes: RoomType[];
  rooms: Room[];
  contracts: Contract[];
  bills: Bill[];
  paymentSlips: PaymentSlip[];
  repairRequests: RepairRequest[];
  announcements: Announcement[];
  siteContent: SiteContent[];
  isLoading: boolean;
  dbError: string | null;

  currentUser: User | null;
  currentStaffProfile: StaffProfile | null;
  currentRentalProfile: RentalProfile | null;
  isOwner: boolean;
  isAuthenticated: boolean;

  login: (email: string, password: string) => { success: boolean; error?: string; user?: User };
  logout: () => void;
  switchUser: (userId: string) => void;

  payBill: (billId: string, slipImageUrl: string, transferAmount: number) => void;
  submitRepairRequest: (data: {
    title: string;
    description: string;
    category: "ทั่วไป" | "ไฟฟ้า" | "ประปา" | "เฟอร์นิเจอร์" | "เครื่องปรับอากาศ";
    priority: "low" | "medium" | "high";
    imageUrls?: string[];
  }) => void;

  verifyPaymentSlip: (slipId: string, status: "approved" | "rejected", rejectionReason?: string) => void;
  createBill: (data: {
    room_id: string;
    month: number;
    year: number;
    water_meter_previous: number;
    water_meter_current: number;
    electric_meter_previous: number;
    electric_meter_current: number;
    other_fees: number;
    due_date: string;
  }) => void;
  updateRepairStatus: (repairId: string, status: RepairStatus, staffComment?: string) => void;
  updateRoomStatus: (roomId: string, status: RoomStatus) => void;
  createTenantWithContract: (data: CreateTenantData) => Promise<{ success: boolean; error?: string }>;
  addAnnouncement: (data: {
    title: string;
    content: string;
    priority: "normal" | "urgent";
    is_pinned: boolean;
  }) => Promise<{ success: boolean; error?: string; lineResult?: any }>;
  deleteAnnouncement: (id: string) => void;
  updateSiteContent: (sectionKey: string, updates: Partial<SiteContent>) => void;
  resetTenantPassword: (userId: string) => Promise<{ success: boolean; tempPassword: string }>;

  createStaff: (data: { full_name: string; phone: string; email: string; password?: string; position: string; is_owner?: boolean }) => void;
  deleteStaff: (userId: string) => void;
  createRoomType: (data: Omit<RoomType, "id">) => void;
  updateRoomType: (id: string, data: Partial<RoomType>) => void;
  createRoom: (data: Omit<Room, "id">) => void;
  linkTenantLine: (rentalProfileId: string, lineUserId: string) => Promise<{ success: boolean; error?: string }>;
  unlinkTenantLine: (rentalProfileId: string) => Promise<{ success: boolean; error?: string }>;
}

const DormitoryContext = createContext<DormitoryContextType | null>(null);

// ---------- Mappers ----------
function mapUser(row: any): User {
  return {
    id: row.id,
    auth_uid: row.auth_uid,
    role: row.role,
    full_name: row.full_name,
    phone: row.phone || "",
    email: row.email,
    password: row.password_hash,
    avatar_url: row.avatar_url,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}
function mapStaffProfile(row: any): StaffProfile {
  return { id: row.id, user_id: row.user_id, is_owner: row.is_owner, position: row.position || "เจ้าหน้าที่นิติบุคคล", notes: row.notes };
}
function mapRoomType(row: any): RoomType {
  return { id: row.id, name: row.name, description: row.description || "", base_price: Number(row.base_price), water_rate: Number(row.water_rate), electric_rate: Number(row.electric_rate), amenities: Array.isArray(row.amenities) ? row.amenities : [], image_url: row.image_url };
}
function mapRoom(row: any): Room {
  return { id: row.id, room_number: row.room_number, room_type_id: row.room_type_id, floor: row.floor, status: row.status, monthly_rent: Number(row.monthly_rent) };
}
function mapRentalProfile(row: any): RentalProfile {
  return { id: row.id, user_id: row.user_id, room_id: row.room_id, id_card_number: row.id_card_number || "", emergency_contact: row.emergency_contact || "", emergency_phone: row.emergency_phone, line_user_id: row.line_user_id || null, status: row.status };
}
function mapContract(row: any): Contract {
  return { id: row.id, rental_profile_id: row.rental_profile_id, room_id: row.room_id, start_date: row.start_date, end_date: row.end_date, move_in_date: row.move_in_date, move_out_date: row.move_out_date, deposit_amount: Number(row.deposit_amount), status: row.status };
}
function mapBill(row: any): Bill {
  return { id: row.id, room_id: row.room_id, rental_profile_id: row.rental_profile_id, month: row.month, year: row.year, room_fee: Number(row.room_fee), water_meter_previous: Number(row.water_meter_previous), water_meter_current: Number(row.water_meter_current), water_units: Number(row.water_units), water_fee: Number(row.water_fee), electric_meter_previous: Number(row.electric_meter_previous), electric_meter_current: Number(row.electric_meter_current), electric_units: Number(row.electric_units), electric_fee: Number(row.electric_fee), other_fees: Number(row.other_fees), total_amount: Number(row.total_amount), due_date: row.due_date, status: row.status, created_at: row.created_at };
}
function mapPaymentSlip(row: any): PaymentSlip {
  return { id: row.id, bill_id: row.bill_id, slip_image_url: row.slip_image_url, transfer_amount: Number(row.transfer_amount), transfer_time: row.transfer_time, verified_by: row.verified_by, verified_at: row.verified_at, status: row.status, rejection_reason: row.rejection_reason, created_at: row.created_at };
}
function mapRepairRequest(row: any): RepairRequest {
  return { id: row.id, rental_profile_id: row.rental_profile_id, room_id: row.room_id, title: row.title, description: row.description, category: row.category, image_urls: Array.isArray(row.image_urls) ? row.image_urls : [], priority: row.priority, status: row.status, staff_comment: row.staff_comment, created_at: row.created_at, updated_at: row.updated_at };
}
function mapAnnouncement(row: any): Announcement {
  return { id: row.id, title: row.title, content: row.content, priority: row.priority, is_pinned: row.is_pinned, created_by: row.created_by, created_at: row.created_at, updated_at: row.updated_at };
}
function mapSiteContent(row: any): SiteContent {
  return { id: row.id, section_key: row.section_key, title: row.title, subtitle: row.subtitle, content_json: row.content_json || {}, image_url: row.image_url, order_index: row.order_index, is_active: row.is_active };
}
// ---------- End Mappers ----------

const SESSION_KEY = "dormitory_session_user_id";

export const DormitoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [staffProfiles, setStaffProfiles] = useState<StaffProfile[]>([]);
  const [rentalProfiles, setRentalProfiles] = useState<RentalProfile[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [paymentSlips, setPaymentSlips] = useState<PaymentSlip[]>([]);
  const [repairRequests, setRepairRequests] = useState<RepairRequest[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [siteContent, setSiteContent] = useState<SiteContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dbError, setDbError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [activeConfig, setActiveConfig] = useState<{ url: string; key: string } | null>(null);

  const getSupabase = useCallback(() => {
    if (activeConfig) {
      return createClient(activeConfig.url, activeConfig.key);
    }
    return createClient();
  }, [activeConfig]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);
      if (saved) setCurrentUserId(saved);
    } catch (e) {
      console.warn("Storage read error", e);
    }
  }, []);

  useEffect(() => {
    try {
      if (currentUserId) {
        localStorage.setItem(SESSION_KEY, currentUserId);
        sessionStorage.setItem(SESSION_KEY, currentUserId);
      } else {
        localStorage.removeItem(SESSION_KEY);
        sessionStorage.removeItem(SESSION_KEY);
      }
    } catch (e) {
      console.warn("Storage write error", e);
    }
  }, [currentUserId]);

  const loadFromSupabase = useCallback(async () => {
    setIsLoading(true);
    setDbError(null);

    try {
      // 1. Live status check from /api/db-status (reads .env.local dynamically on the server)
      const statusRes = await fetch("/api/db-status", { cache: "no-store" });
      const statusData = await statusRes.json();

      if (!statusRes.ok || !statusData.connected) {
        setDbError(statusData.error || "ไม่สามารถเชื่อมต่อฐานข้อมูลได้");
        setIsLoading(false);
        return;
      }

      setActiveConfig({ url: statusData.supabaseUrl, key: statusData.supabaseKey });
      const supabase = createClient(statusData.supabaseUrl, statusData.supabaseKey);

      const [
        { data: usersData, error: usersError },
        { data: staffData, error: staffError },
        { data: rentalData },
        { data: roomTypesData },
        { data: roomsData },
        { data: contractsData },
        { data: billsData },
        { data: slipsData },
        { data: repairsData },
        { data: announcementsData },
        { data: siteData },
      ] = await Promise.all([
        supabase.from("users").select("*").order("created_at", { ascending: true }),
        supabase.from("staff_profile").select("*"),
        supabase.from("rental_profile").select("*"),
        supabase.from("room_type").select("*").order("base_price", { ascending: true }),
        supabase.from("room").select("*").order("room_number", { ascending: true }),
        supabase.from("contract").select("*"),
        supabase.from("bill").select("*").order("created_at", { ascending: false }),
        supabase.from("payment_slip").select("*").order("created_at", { ascending: false }),
        supabase.from("repair_request").select("*").order("created_at", { ascending: false }),
        supabase.from("announcement").select("*").order("created_at", { ascending: false }),
        supabase.from("site_content").select("*").order("order_index", { ascending: true }),
      ]);

      if (usersError || staffError) {
        const msg = usersError?.message || staffError?.message || "ไม่สามารถเชื่อมต่อฐานข้อมูลได้";
        setDbError(`เกิดข้อผิดพลาดจาก Supabase: ${msg}`);
        setIsLoading(false);
        return;
      }

      setUsers(usersData?.map(mapUser) ?? []);
      setStaffProfiles(staffData?.map(mapStaffProfile) ?? []);
      setRentalProfiles(rentalData?.map(mapRentalProfile) ?? []);
      setRoomTypes(roomTypesData?.map(mapRoomType) ?? []);
      setRooms(roomsData?.map(mapRoom) ?? []);
      setContracts(contractsData?.map(mapContract) ?? []);
      setBills(billsData?.map(mapBill) ?? []);
      setPaymentSlips(slipsData?.map(mapPaymentSlip) ?? []);
      setRepairRequests(repairsData?.map(mapRepairRequest) ?? []);
      setAnnouncements(announcementsData?.map(mapAnnouncement) ?? []);
      setSiteContent(siteData?.map(mapSiteContent) ?? []);

    } catch (err: any) {
      setDbError(`ไม่สามารถเชื่อมต่อฐานข้อมูลได้: ${err?.message || "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { loadFromSupabase(); }, [loadFromSupabase]);

  const currentUser = users.find((u) => u.id === currentUserId) || null;
  const currentStaffProfile = currentUser ? staffProfiles.find((sp) => sp.user_id === currentUser.id) || null : null;
  const currentRentalProfile = currentUser ? rentalProfiles.find((rp) => rp.user_id === currentUser.id) || null : null;
  const isOwner = !!currentStaffProfile?.is_owner;
  const isAuthenticated = !!currentUser;

  const login = (email: string, pass: string) => {
    const user = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!user) return { success: false, error: "ไม่พบบัญชีผู้ใช้งานที่ระบุ กรุณาติดต่อฝ่ายนิติบุคคล" };
    if ((user.password) !== pass) return { success: false, error: "รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง" };
    try {
      localStorage.setItem(SESSION_KEY, user.id);
      sessionStorage.setItem(SESSION_KEY, user.id);
    } catch (e) {}
    setCurrentUserId(user.id);
    return { success: true, user };
  };

  const logout = () => {
    try {
      localStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem(SESSION_KEY);
    } catch (e) {}
    setCurrentUserId("");
  };

  const switchUser = (userId: string) => {
    try {
      localStorage.setItem(SESSION_KEY, userId);
      sessionStorage.setItem(SESSION_KEY, userId);
    } catch (e) {}
    setCurrentUserId(userId);
  };

  const payBill = async (billId: string, slipImageUrl: string, transferAmount: number) => {
    const supabase = getSupabase();
    const tempSlip: PaymentSlip = { id: `tmp-${Date.now()}`, bill_id: billId, slip_image_url: slipImageUrl, transfer_amount: transferAmount, transfer_time: new Date().toISOString(), status: "pending", created_at: new Date().toISOString() };
    setPaymentSlips((prev) => [tempSlip, ...prev]);
    setBills((prev) => prev.map((b) => (b.id === billId ? { ...b, status: "pending_verification" } : b)));

    const { data: inserted } = await supabase.from("payment_slip").insert({ bill_id: billId, slip_image_url: slipImageUrl, transfer_amount: transferAmount, transfer_time: new Date().toISOString(), status: "pending" }).select().single();
    if (inserted) setPaymentSlips((prev) => prev.map((s) => (s.id === tempSlip.id ? mapPaymentSlip(inserted) : s)));
    await supabase.from("bill").update({ status: "pending_verification" }).eq("id", billId);
  };

  const verifyPaymentSlip = async (slipId: string, status: "approved" | "rejected", rejectionReason?: string) => {
    const supabase = getSupabase();
    const slip = paymentSlips.find((s) => s.id === slipId);
    if (!slip) return;
    const now = new Date().toISOString();
    setPaymentSlips((prev) => prev.map((s) => s.id === slipId ? { ...s, status, rejection_reason: rejectionReason, verified_by: currentStaffProfile?.id, verified_at: now } : s));
    setBills((prev) => prev.map((b) => b.id === slip.bill_id ? { ...b, status: status === "approved" ? "paid" : "unpaid" } : b));
    await supabase.from("payment_slip").update({ status, rejection_reason: rejectionReason || null, verified_by: currentStaffProfile?.id || null, verified_at: now }).eq("id", slipId);
    await supabase.from("bill").update({ status: status === "approved" ? "paid" : "unpaid" }).eq("id", slip.bill_id);

    // LINE Notification Trigger
    const bill = bills.find((b) => b.id === slip.bill_id);
    if (bill) {
      const rental = rentalProfiles.find((rp) => rp.id === bill.rental_profile_id);
      if (rental?.line_user_id) {
        const msg = status === "approved"
          ? `[หอพัก] แจ้งเตือน: ยอดชำระเงินบิลเดือน ${bill.month}/${bill.year} จำนวน ${bill.total_amount.toLocaleString()} บาท ได้รับการอนุมัติเรียบร้อยแล้ว ขอบคุณค่ะ`
          : `[หอพัก] แจ้งเตือน: สลิปการชำระเงินบิลเดือน ${bill.month}/${bill.year} ไม่ผ่านการอนุมัติ (${rejectionReason || "กรุณาติดต่อฝ่ายนิติบุคคล"})`;
        fetch("/api/line/notify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "push", line_user_id: rental.line_user_id, message: msg }),
        }).catch((e) => console.error("LINE notify slip error", e));
      }
    }
  };

  const submitRepairRequest = async (data: { title: string; description: string; category: "ทั่วไป" | "ไฟฟ้า" | "ประปา" | "เฟอร์นิเจอร์" | "เครื่องปรับอากาศ"; priority: "low" | "medium" | "high"; imageUrls?: string[] }) => {
    if (!currentRentalProfile) return;
    const supabase = getSupabase();
    const tempId = `tmp-${Date.now()}`;
    const newReq: RepairRequest = { id: tempId, rental_profile_id: currentRentalProfile.id, room_id: currentRentalProfile.room_id || "", title: data.title, description: data.description, category: data.category, image_urls: data.imageUrls || [], priority: data.priority, status: "pending", created_at: new Date().toISOString() };
    setRepairRequests((prev) => [newReq, ...prev]);
    const { data: inserted } = await supabase.from("repair_request").insert({ rental_profile_id: currentRentalProfile.id, room_id: currentRentalProfile.room_id, title: data.title, description: data.description, category: data.category, image_urls: data.imageUrls || [], priority: data.priority, status: "pending" }).select().single();
    if (inserted) setRepairRequests((prev) => prev.map((r) => (r.id === tempId ? mapRepairRequest(inserted) : r)));
  };

  const updateRepairStatus = async (repairId: string, status: RepairStatus, staffComment?: string) => {
    const supabase = getSupabase();
    const now = new Date().toISOString();
    setRepairRequests((prev) => prev.map((r) => r.id === repairId ? { ...r, status, staff_comment: staffComment !== undefined ? staffComment : r.staff_comment, updated_at: now } : r));
    await supabase.from("repair_request").update({ status, staff_comment: staffComment || null, updated_at: now }).eq("id", repairId);

    // LINE Notification Trigger
    const req = repairRequests.find((r) => r.id === repairId);
    if (req) {
      const rental = rentalProfiles.find((rp) => rp.id === req.rental_profile_id);
      if (rental?.line_user_id) {
        const statusMap: Record<string, string> = {
          pending: "รอดำเนินการ",
          in_progress: "กำลังดำเนินการ / ช่างเข้าตรวจสอบ",
          completed: "ซ่อมบำรุงเสร็จสิ้นเรียบร้อยแล้ว",
          cancelled: "ยกเลิกรายการแจ้งซ่อม",
        };
        const statusLabel = statusMap[status] || status;
        let msg = `[หอพัก แจ้งซ่อม] อัปเดตสถานะ: "${req.title}"\nสถานะ: ${statusLabel}`;
        if (staffComment) msg += `\nหมายเหตุจากนิติ: ${staffComment}`;

        fetch("/api/line/notify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "push", line_user_id: rental.line_user_id, message: msg }),
        }).catch((e) => console.error("LINE notify repair error", e));
      }
    }
  };

  const createBill = async (data: { room_id: string; month: number; year: number; water_meter_previous: number; water_meter_current: number; electric_meter_previous: number; electric_meter_current: number; other_fees: number; due_date: string }) => {
    const supabase = getSupabase();
    const targetRoom = rooms.find((r) => r.id === data.room_id);
    const targetRental = rentalProfiles.find((rp) => rp.room_id === data.room_id);
    if (!targetRoom || !targetRental) return;
    const targetRoomType = roomTypes.find((rt) => rt.id === targetRoom.room_type_id);
    const waterRate = targetRoomType?.water_rate || 18;
    const electricRate = targetRoomType?.electric_rate || 8;
    const waterUnits = Math.max(0, data.water_meter_current - data.water_meter_previous);
    const electricUnits = Math.max(0, data.electric_meter_current - data.electric_meter_previous);
    const waterFee = waterUnits * waterRate;
    const electricFee = electricUnits * electricRate;
    const totalAmount = targetRoom.monthly_rent + waterFee + electricFee + data.other_fees;
    const tempId = `tmp-${Date.now()}`;
    const newBill: Bill = { id: tempId, room_id: data.room_id, rental_profile_id: targetRental.id, month: data.month, year: data.year, room_fee: targetRoom.monthly_rent, water_meter_previous: data.water_meter_previous, water_meter_current: data.water_meter_current, water_units: waterUnits, water_fee: waterFee, electric_meter_previous: data.electric_meter_previous, electric_meter_current: data.electric_meter_current, electric_units: electricUnits, electric_fee: electricFee, other_fees: data.other_fees, total_amount: totalAmount, due_date: data.due_date, status: "unpaid", created_at: new Date().toISOString() };
    setBills((prev) => [newBill, ...prev]);
    const { data: inserted } = await supabase.from("bill").insert({ room_id: data.room_id, rental_profile_id: targetRental.id, month: data.month, year: data.year, room_fee: targetRoom.monthly_rent, water_meter_previous: data.water_meter_previous, water_meter_current: data.water_meter_current, water_fee: waterFee, electric_meter_previous: data.electric_meter_previous, electric_meter_current: data.electric_meter_current, electric_fee: electricFee, other_fees: data.other_fees, total_amount: totalAmount, due_date: data.due_date, status: "unpaid" }).select().single();
    if (inserted) setBills((prev) => prev.map((b) => (b.id === tempId ? mapBill(inserted) : b)));
  };

  const updateRoomStatus = async (roomId: string, status: RoomStatus) => {
    const supabase = getSupabase();
    setRooms((prev) => prev.map((r) => (r.id === roomId ? { ...r, status } : r)));
    await supabase.from("room").update({ status }).eq("id", roomId);
  };

  const createTenantWithContract = async (data: CreateTenantData): Promise<{ success: boolean; error?: string }> => {
    const supabase = getSupabase();
    if (users.find((u) => u.email.toLowerCase() === data.email.trim().toLowerCase())) return { success: false, error: "อีเมลนี้มีผู้ใช้งานในระบบแล้ว" };
    const targetRoom = rooms.find((r) => r.id === data.room_id);
    if (!targetRoom) return { success: false, error: "ไม่พบข้อมูลห้องพักที่เลือก" };
    if (targetRoom.status === "occupied") return { success: false, error: "ห้องพักนี้มีผู้เช่าอยู่แล้ว" };
    try {
      const { data: newUser, error: userError } = await supabase.from("users").insert({ role: "rental", full_name: data.full_name, phone: data.phone, email: data.email.trim().toLowerCase(), password_hash: data.password || "tenant1234" }).select().single();
      if (userError || !newUser) return { success: false, error: userError?.message || "ไม่สามารถสร้างบัญชีผู้ใช้ได้" };
      const { data: newProfile, error: profileError } = await supabase.from("rental_profile").insert({ user_id: newUser.id, room_id: data.room_id, id_card_number: data.id_card_number, emergency_contact: data.emergency_contact, emergency_phone: data.emergency_phone || null, status: "active" }).select().single();
      if (profileError || !newProfile) return { success: false, error: "ไม่สามารถสร้างข้อมูลผู้เช่าได้" };
      await supabase.from("contract").insert({ rental_profile_id: newProfile.id, room_id: data.room_id, start_date: data.start_date, end_date: data.end_date, move_in_date: data.move_in_date, deposit_amount: data.deposit_amount, status: "active" });
      await supabase.from("room").update({ status: "occupied" }).eq("id", data.room_id);
      setUsers((prev) => [...prev, mapUser(newUser)]);
      setRentalProfiles((prev) => [...prev, mapRentalProfile(newProfile)]);
      setRooms((prev) => prev.map((r) => (r.id === data.room_id ? { ...r, status: "occupied" } : r)));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "เกิดข้อผิดพลาด" };
    }
  };

  const addAnnouncement = async (data: { title: string; content: string; priority: "normal" | "urgent"; is_pinned: boolean }) => {
    const supabase = getSupabase();
    const tempId = `tmp-${Date.now()}`;
    const newAnn: Announcement = { id: tempId, title: data.title, content: data.content, priority: data.priority, is_pinned: data.is_pinned, created_by: currentStaffProfile?.id, created_at: new Date().toISOString() };
    setAnnouncements((prev) => [newAnn, ...prev]);
    const { data: inserted, error: insertErr } = await supabase.from("announcement").insert({ title: data.title, content: data.content, priority: data.priority, is_pinned: data.is_pinned, created_by: currentStaffProfile?.id || null }).select().single();
    if (inserted) setAnnouncements((prev) => prev.map((a) => (a.id === tempId ? mapAnnouncement(inserted) : a)));

    // LINE Broadcast Trigger
    const broadcastMsg = `[ประกาศจากหอพัก] ${data.title}\n\n${data.content}`;
    let lineResult: any = null;
    try {
      const res = await fetch("/api/line/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "broadcast", message: broadcastMsg }),
      });
      lineResult = await res.json();
    } catch (e: any) {
      console.error("LINE broadcast announcement error", e);
      lineResult = { success: false, error: e.message };
    }

    return { success: !insertErr, lineResult };
  };

  const deleteAnnouncement = async (id: string) => {
    const supabase = getSupabase();
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    await supabase.from("announcement").delete().eq("id", id);
  };

  const updateSiteContent = async (sectionKey: string, updates: Partial<SiteContent>) => {
    const supabase = getSupabase();
    setSiteContent((prev) => prev.map((sc) => (sc.section_key === sectionKey ? { ...sc, ...updates } : sc)));
    await supabase.from("site_content").update({ title: updates.title, subtitle: updates.subtitle, content_json: updates.content_json, image_url: updates.image_url, is_active: updates.is_active, updated_by: currentStaffProfile?.id || null, updated_at: new Date().toISOString() }).eq("section_key", sectionKey);
  };

  const resetTenantPassword = async (userId: string): Promise<{ success: boolean; tempPassword: string }> => {
    const supabase = getSupabase();
    const tempPassword = `Pass@${Math.floor(100000 + Math.random() * 900000)}`;
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, password: tempPassword } : u)));
    await supabase.from("users").update({ password_hash: tempPassword }).eq("id", userId);
    return { success: true, tempPassword };
  };

  const createStaff = async (data: { full_name: string; phone: string; email: string; password?: string; position: string; is_owner?: boolean }) => {
    const supabase = getSupabase();
    const { data: newUser } = await supabase.from("users").insert({ role: "staff", full_name: data.full_name, phone: data.phone, email: data.email.trim().toLowerCase(), password_hash: data.password || "staff1234" }).select().single();
    if (!newUser) return;
    const { data: newProfile } = await supabase.from("staff_profile").insert({ user_id: newUser.id, is_owner: !!data.is_owner, position: data.position, notes: "สร้างโดยเจ้าของหอพัก" }).select().single();
    setUsers((prev) => [...prev, mapUser(newUser)]);
    if (newProfile) setStaffProfiles((prev) => [...prev, mapStaffProfile(newProfile)]);
  };

  const deleteStaff = async (userId: string) => {
    const supabase = getSupabase();
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    setStaffProfiles((prev) => prev.filter((sp) => sp.user_id !== userId));
    await supabase.from("users").delete().eq("id", userId);
  };

  const createRoomType = async (data: Omit<RoomType, "id">) => {
    const supabase = getSupabase();
    const tempId = `tmp-${Date.now()}`;
    setRoomTypes((prev) => [...prev, { id: tempId, ...data }]);
    const { data: inserted } = await supabase.from("room_type").insert({ name: data.name, description: data.description, base_price: data.base_price, water_rate: data.water_rate, electric_rate: data.electric_rate, amenities: data.amenities, image_url: data.image_url || null }).select().single();
    if (inserted) setRoomTypes((prev) => prev.map((rt) => (rt.id === tempId ? mapRoomType(inserted) : rt)));
  };

  const updateRoomType = async (id: string, data: Partial<RoomType>) => {
    const supabase = getSupabase();
    setRoomTypes((prev) => prev.map((rt) => (rt.id === id ? { ...rt, ...data } : rt)));
    await supabase.from("room_type").update({ name: data.name, description: data.description, base_price: data.base_price, water_rate: data.water_rate, electric_rate: data.electric_rate, amenities: data.amenities, image_url: data.image_url }).eq("id", id);
  };

  const createRoom = async (data: Omit<Room, "id">) => {
    const supabase = getSupabase();
    const tempId = `tmp-${Date.now()}`;
    setRooms((prev) => [...prev, { id: tempId, ...data }]);
    const { data: inserted } = await supabase.from("room").insert({ room_number: data.room_number, room_type_id: data.room_type_id, floor: data.floor, status: data.status, monthly_rent: data.monthly_rent }).select().single();
    if (inserted) setRooms((prev) => prev.map((r) => (r.id === tempId ? mapRoom(inserted) : r)));
  };

  const linkTenantLine = async (rentalProfileId: string, lineUserId: string): Promise<{ success: boolean; error?: string }> => {
    const supabase = getSupabase();
    try {
      setRentalProfiles((prev) => prev.map((rp) => rp.id === rentalProfileId ? { ...rp, line_user_id: lineUserId } : rp));
      await supabase.from("rental_profile").update({ line_user_id: lineUserId }).eq("id", rentalProfileId);
      return { success: true };
    } catch (err: any) {
      console.error("linkTenantLine error:", err);
      return { success: false, error: err.message };
    }
  };

  const unlinkTenantLine = async (rentalProfileId: string): Promise<{ success: boolean; error?: string }> => {
    const supabase = getSupabase();
    try {
      setRentalProfiles((prev) => prev.map((rp) => rp.id === rentalProfileId ? { ...rp, line_user_id: null } : rp));
      await supabase.from("rental_profile").update({ line_user_id: null }).eq("id", rentalProfileId);
      return { success: true };
    } catch (err: any) {
      console.error("unlinkTenantLine error:", err);
      return { success: false, error: err.message };
    }
  };

  return (
    <DormitoryContext.Provider value={{ users, staffProfiles, rentalProfiles, roomTypes, rooms, contracts, bills, paymentSlips, repairRequests, announcements, siteContent, isLoading, dbError, currentUser, currentStaffProfile, currentRentalProfile, isOwner, isAuthenticated, login, logout, switchUser, createTenantWithContract, payBill, verifyPaymentSlip, submitRepairRequest, updateRepairStatus, createBill, updateRoomStatus, addAnnouncement, deleteAnnouncement, updateSiteContent, resetTenantPassword, createStaff, deleteStaff, createRoomType, updateRoomType, createRoom, linkTenantLine, unlinkTenantLine }}>
      {children}
    </DormitoryContext.Provider>
  );
};

export const useDormitory = () => {
  const context = useContext(DormitoryContext);
  if (!context) throw new Error("useDormitory must be used within a DormitoryProvider");
  return context;
};
