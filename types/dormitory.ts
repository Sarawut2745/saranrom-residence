export type UserRole = "rental" | "staff";

export interface User {
  id: string;
  auth_uid?: string;
  role: UserRole;
  full_name: string;
  phone: string;
  email: string;
  password?: string;
  avatar_url?: string;
  created_at: string;
  updated_at?: string;
}

export interface StaffProfile {
  id: string;
  user_id: string;
  is_owner: boolean;
  position: string;
  notes?: string;
  user?: User;
}

export interface RoomType {
  id: string;
  name: string;
  description: string;
  base_price: number;
  water_rate: number;
  electric_rate: number;
  amenities: string[];
  image_url?: string;
}

export type RoomStatus = "available" | "occupied" | "maintenance";

export interface Room {
  id: string;
  room_number: string;
  room_type_id: string;
  floor: number;
  status: RoomStatus;
  monthly_rent: number;
  room_type?: RoomType;
  current_tenant?: RentalProfile;
}

export interface RentalProfile {
  id: string;
  user_id: string;
  room_id?: string;
  id_card_number: string;
  emergency_contact: string;
  emergency_phone?: string;
  line_user_id?: string | null;
  status: "active" | "inactive";
  user?: User;
  room?: Room;
}

export interface Contract {
  id: string;
  rental_profile_id: string;
  room_id: string;
  start_date: string;
  end_date: string;
  move_in_date: string;
  move_out_date?: string;
  deposit_amount: number;
  status: "draft" | "active" | "terminated" | "expired";
}

export type BillStatus = "unpaid" | "pending_verification" | "paid" | "overdue";

export interface Bill {
  id: string;
  room_id: string;
  rental_profile_id: string;
  month: number;
  year: number;
  room_fee: number;
  water_meter_previous: number;
  water_meter_current: number;
  water_units: number;
  water_fee: number;
  electric_meter_previous: number;
  electric_meter_current: number;
  electric_units: number;
  electric_fee: number;
  other_fees: number;
  total_amount: number;
  due_date: string;
  status: BillStatus;
  created_at: string;
  room?: Room;
  rental_profile?: RentalProfile;
  payment_slip?: PaymentSlip;
}

export type SlipStatus = "pending" | "approved" | "rejected";

export interface PaymentSlip {
  id: string;
  bill_id: string;
  slip_image_url: string;
  transfer_amount: number;
  transfer_time: string;
  verified_by?: string;
  verified_at?: string;
  status: SlipStatus;
  rejection_reason?: string;
  created_at: string;
}

export type RepairPriority = "low" | "medium" | "high";
export type RepairStatus = "pending" | "in_progress" | "completed" | "cancelled";

export interface RepairRequest {
  id: string;
  rental_profile_id: string;
  room_id: string;
  title: string;
  description: string;
  category: "ทั่วไป" | "ไฟฟ้า" | "ประปา" | "เฟอร์นิเจอร์" | "เครื่องปรับอากาศ";
  image_urls: string[];
  priority: RepairPriority;
  status: RepairStatus;
  staff_comment?: string;
  created_at: string;
  updated_at?: string;
  room?: Room;
  rental?: RentalProfile;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: "normal" | "urgent";
  is_pinned: boolean;
  created_by?: string;
  created_at: string;
  updated_at?: string;
  author_name?: string;
}

export interface SiteContent {
  id: string;
  section_key: string;
  title: string;
  subtitle?: string;
  content_json: Record<string, any>;
  image_url?: string;
  order_index: number;
  is_active: boolean;
}
