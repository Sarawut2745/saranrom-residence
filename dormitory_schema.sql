-- ====================================================================
-- สเปคระบบจัดการหอพักรายเดือน (Dormitory Management System Schema)
-- สำหรับรันใน Supabase SQL Editor (PostgreSQL)
-- ====================================================================

-- 1. ล้างตารางเดิม (ถ้ามี) แบบเรียงลำดับการลบตาม Foreign Keys
DROP TABLE IF EXISTS payment_slip CASCADE;
DROP TABLE IF EXISTS bill CASCADE;
DROP TABLE IF EXISTS contract CASCADE;
DROP TABLE IF EXISTS repair_request CASCADE;
DROP TABLE IF EXISTS announcement CASCADE;
DROP TABLE IF EXISTS site_content CASCADE;
DROP TABLE IF EXISTS rental_profile CASCADE;
DROP TABLE IF EXISTS room CASCADE;
DROP TABLE IF EXISTS room_type CASCADE;
DROP TABLE IF EXISTS staff_profile CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- เปิดใช้งาน UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ====================================================================
-- 2. สร้างตารางหลัก (10 ตาราง)
-- ====================================================================

-- 2.1 ตารางผู้ใช้งานระบบ (users)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_uid UUID UNIQUE, -- เชื่อมกับ auth.users(id) ของ Supabase
    role VARCHAR(20) NOT NULL CHECK (role IN ('rental', 'staff')),
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL DEFAULT '123456', -- รหัสผ่านสำหรับล็อกอิน
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.2 ตารางข้อมูลเจ้าหน้าที่/นิติบุคคล (staff_profile)
-- เจ้าของหอพัก (Owner) คือ staff ที่มี is_owner = true
CREATE TABLE staff_profile (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    is_owner BOOLEAN NOT NULL DEFAULT false,
    position VARCHAR(100) DEFAULT 'เจ้าหน้าที่นิติบุคคล',
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.3 ตารางประเภทห้องพัก (room_type) - Masterdata จัดการโดย Owner
CREATE TABLE room_type (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    base_price NUMERIC(10, 2) NOT NULL,
    water_rate NUMERIC(10, 2) NOT NULL DEFAULT 18.00, -- ค่าน้ำต่อหน่วย (บาท)
    electric_rate NUMERIC(10, 2) NOT NULL DEFAULT 8.00, -- ค่าไฟต่อหน่วย (บาท)
    amenities JSONB DEFAULT '[]'::jsonb,
    image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.4 ตารางห้องพัก (room)
CREATE TABLE room (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_number VARCHAR(20) UNIQUE NOT NULL,
    room_type_id UUID NOT NULL REFERENCES room_type(id) ON DELETE RESTRICT,
    floor INT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'maintenance')),
    monthly_rent NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.5 ตารางข้อมูลผู้เช่า (rental_profile)
-- กติกา: 1 ห้องเช่าได้โดย 1 บัญชีผู้เช่าเท่านั้น (room_id เป็น UNIQUE)
CREATE TABLE rental_profile (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    room_id UUID UNIQUE REFERENCES room(id) ON DELETE SET NULL,
    id_card_number VARCHAR(30),
    emergency_contact VARCHAR(100),
    emergency_phone VARCHAR(50),
    line_user_id VARCHAR(100),
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.6 ตารางสัญญาเช่า (contract)
-- แยก move_in, move_out และเงินประกัน ออกจากข้อมูลห้อง
CREATE TABLE contract (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rental_profile_id UUID NOT NULL REFERENCES rental_profile(id) ON DELETE CASCADE,
    room_id UUID NOT NULL REFERENCES room(id) ON DELETE RESTRICT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    move_in_date DATE NOT NULL,
    move_out_date DATE,
    deposit_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('draft', 'active', 'terminated', 'expired')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.7 ตารางใบแจ้งหนี้/บิล (bill)
CREATE TABLE bill (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID NOT NULL REFERENCES room(id) ON DELETE RESTRICT,
    rental_profile_id UUID NOT NULL REFERENCES rental_profile(id) ON DELETE CASCADE,
    month INT NOT NULL CHECK (month BETWEEN 1 AND 12),
    year INT NOT NULL,
    room_fee NUMERIC(10, 2) NOT NULL,
    water_meter_previous NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    water_meter_current NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    water_units NUMERIC(10, 2) GENERATED ALWAYS AS (water_meter_current - water_meter_previous) STORED,
    water_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    electric_meter_previous NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    electric_meter_current NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    electric_units NUMERIC(10, 2) GENERATED ALWAYS AS (electric_meter_current - electric_meter_previous) STORED,
    electric_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    other_fees NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    total_amount NUMERIC(10, 2) NOT NULL,
    due_date DATE NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'unpaid' CHECK (status IN ('unpaid', 'pending_verification', 'paid', 'overdue')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.8 ตารางสลิปการชำระเงิน (payment_slip)
-- กติกา: ชำระผ่าน QR PromptPay แล้วต้องแนบสลิปให้เจ้าหน้าที่ตรวจเสมอ
CREATE TABLE payment_slip (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bill_id UUID UNIQUE NOT NULL REFERENCES bill(id) ON DELETE CASCADE,
    slip_image_url TEXT NOT NULL,
    transfer_amount NUMERIC(10, 2) NOT NULL,
    transfer_time TIMESTAMPTZ NOT NULL DEFAULT now(),
    verified_by UUID REFERENCES staff_profile(id) ON DELETE SET NULL,
    verified_at TIMESTAMPTZ,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    rejection_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.9 ตารางคำร้องแจ้งซ่อม (repair_request)
CREATE TABLE repair_request (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rental_profile_id UUID NOT NULL REFERENCES rental_profile(id) ON DELETE CASCADE,
    room_id UUID NOT NULL REFERENCES room(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT 'ทั่วไป', -- ไฟฟ้า, ประปา, เฟอร์นิเจอร์, เครื่องปรับอากาศ, ทั่วไป
    image_urls JSONB DEFAULT '[]'::jsonb,
    priority VARCHAR(20) NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
    staff_comment TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.10 ตารางประกาศข่าวสาร (announcement)
CREATE TABLE announcement (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    priority VARCHAR(20) NOT NULL DEFAULT 'normal' CHECK (priority IN ('normal', 'urgent')),
    is_pinned BOOLEAN NOT NULL DEFAULT false,
    created_by UUID REFERENCES staff_profile(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.11 ตารางเนื้อหาหน้าแรกแบบ Generic (site_content)
-- ออกแบบให้ Staff สามารถปรับแต่งข้อความ/รูปภาพหน้าแรกได้ทุกส่วน
CREATE TABLE site_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_key VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    subtitle TEXT,
    content_json JSONB DEFAULT '{}'::jsonb,
    image_url TEXT,
    order_index INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    updated_by UUID REFERENCES staff_profile(id) ON DELETE SET NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ====================================================================
-- 3. การสร้าง Indexes เพื่อประสิทธิภาพ
-- ====================================================================
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_staff_is_owner ON staff_profile(is_owner);
CREATE INDEX idx_room_status ON room(status);
CREATE INDEX idx_room_floor ON room(floor);
CREATE INDEX idx_rental_room ON rental_profile(room_id);
CREATE INDEX idx_bill_room ON bill(room_id);
CREATE INDEX idx_bill_status ON bill(status);
CREATE INDEX idx_bill_month_year ON bill(year, month);
CREATE INDEX idx_payment_slip_status ON payment_slip(status);
CREATE INDEX idx_repair_request_status ON repair_request(status);
CREATE INDEX idx_repair_request_rental ON repair_request(rental_profile_id);
CREATE INDEX idx_announcement_pinned ON announcement(is_pinned, created_at DESC);

-- ====================================================================
-- 4. Initial Seed Data (ข้อมูลเริ่มต้นระบบ)
-- ====================================================================

-- 4.1 ประเภทห้องพัก
INSERT INTO room_type (id, name, description, base_price, water_rate, electric_rate, amenities, image_url) VALUES
('11111111-1111-1111-1111-111111111101', 'Studio Standard', 'ห้องสตูดิโอขนาด 28 ตร.ม. ตกแต่งครบพร้อมเข้าอยู่ เตียง 5 ฟุต แอร์ ทีวี ตู้เย็น โต๊ะทำงาน ระเบียงส่วนตัว', 4500.00, 18.00, 8.00, '["เครื่องปรับอากาศ", "เครื่องทำน้ำอุ่น", "เตียง 5 ฟุต", "ตู้เสื้อผ้าบิวท์อิน", "ระเบียงส่วนตัว", "High Speed Wi-Fi"]'::jsonb, 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80'),
('11111111-1111-1111-1111-111111111102', 'Deluxe Corner Room', 'ห้องมุมขนาด 35 ตร.ม. วิวเปิดโล่ง แสงธรรมชาติ 2 ทิศทาง พร้อมโซฟาพักผ่อน และพื้นที่แต่งตัวแยกเป็นสัดส่วน', 5500.00, 18.00, 8.00, '["เครื่องปรับอากาศ Inverter", "เครื่องทำน้ำอุ่น", "เตียง 6 ฟุต King Size", "โซฟารับแขก", "สมาร์ททีวี 43 นิ้ว", "ตู้เย็น 2 ประตู", "ไมโครเวฟ"]'::jsonb, 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80'),
('11111111-1111-1111-1111-111111111103', '1-Bedroom Executive Suite', 'ห้องชุด 1 ห้องนอน 1 ห้องนั่งเล่น ขนาด 45 ตร.ม. พร้อมมุมครัว มินิบาร์ เหมาะสำหรับการพักผ่อนระดับพรีเมียม', 7500.00, 18.00, 8.00, '["แอร์ 2 เครื่อง", "เครื่องซักผ้าในห้อง", "เตียง King Size พรีเมียม", "เคาน์เตอร์ครัวและอ่างล้างจาน", "สมาร์ททีวี 55 นิ้ว", "Digital Door Lock"]'::jsonb, 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80');

-- 4.2 ข้อมูลห้องพัก (ชั้น 2 ถึง 4)
INSERT INTO room (id, room_number, room_type_id, floor, status, monthly_rent) VALUES
('22222222-2222-2222-2222-222222222201', '201', '11111111-1111-1111-1111-111111111101', 2, 'occupied', 4500.00),
('22222222-2222-2222-2222-222222222202', '202', '11111111-1111-1111-1111-111111111101', 2, 'available', 4500.00),
('22222222-2222-2222-2222-222222222203', '203', '11111111-1111-1111-1111-111111111102', 2, 'available', 5500.00),
('22222222-2222-2222-2222-222222222204', '301', '11111111-1111-1111-1111-111111111101', 3, 'occupied', 4500.00),
('22222222-2222-2222-2222-222222222205', '302', '11111111-1111-1111-1111-111111111102', 3, 'maintenance', 5500.00),
('22222222-2222-2222-2222-222222222206', '401', '11111111-1111-1111-1111-111111111103', 4, 'available', 7500.00);

-- 4.3 ผู้ใช้งานและโปรไฟล์
-- Owner (เจ้าของหอพัก)
INSERT INTO users (id, role, full_name, phone, email, password_hash) VALUES
('33333333-3333-3333-3333-333333333301', 'staff', 'สมศักดิ์ วาณิชย์กิจ (เจ้าของหอพัก)', '081-999-8888', 'owner@dormitory.com', 'owner1234');
INSERT INTO staff_profile (id, user_id, is_owner, position, notes) VALUES
('44444444-4444-4444-4444-444444444401', '33333333-3333-3333-3333-333333333301', true, 'เจ้าของกิจการ (Owner)', 'ผู้ดูแลสูงสุดของหอพัก');

-- Staff (นิติบุคคล)
INSERT INTO users (id, role, full_name, phone, email, password_hash) VALUES
('33333333-3333-3333-3333-333333333302', 'staff', 'นิตยา ดูแลสุข (นิติบุคคล)', '082-123-4567', 'staff@dormitory.com', 'staff1234');
INSERT INTO staff_profile (id, user_id, is_owner, position, notes) VALUES
('44444444-4444-4444-4444-444444444402', '33333333-3333-3333-3333-333333333302', false, 'ผู้จัดการนิติบุคคล', 'ประจำการเวลา 08:30 - 18:00 น.');

-- Rental 1 (ผู้เช่าห้อง 201)
INSERT INTO users (id, role, full_name, phone, email, password_hash) VALUES
('33333333-3333-3333-3333-333333333303', 'rental', 'ชญานนท์ รักสงบ (ผู้เช่าห้อง 201)', '089-765-4321', 'tenant201@gmail.com', 'tenant1234');
INSERT INTO rental_profile (id, user_id, room_id, id_card_number, emergency_contact, emergency_phone, status) VALUES
('55555555-5555-5555-5555-555555555501', '33333333-3333-3333-3333-333333333303', '22222222-2222-2222-2222-222222222201', '1100500123456', 'มารดา (คุณสายใจ)', '081-222-3344', 'active');

-- Contract สำหรับห้อง 201
INSERT INTO contract (id, rental_profile_id, room_id, start_date, end_date, move_in_date, deposit_amount, status) VALUES
('66666666-6666-6666-6666-666666666601', '55555555-5555-5555-5555-555555555501', '22222222-2222-2222-2222-222222222201', '2026-01-01', '2026-12-31', '2026-01-05', 9000.00, 'active');

-- 4.4 บิลและสลิปตัวอย่าง
-- บิลห้อง 201 เดือนปัจจุบัน (รอชำระ)
INSERT INTO bill (id, room_id, rental_profile_id, month, year, room_fee, water_meter_previous, water_meter_current, water_fee, electric_meter_previous, electric_meter_current, electric_fee, other_fees, total_amount, due_date, status) VALUES
('77777777-7777-7777-7777-777777777701', '22222222-2222-2222-2222-222222222201', '55555555-5555-5555-5555-555555555501', 9, 2026, 4500.00, 120.00, 128.00, 144.00, 450.00, 510.00, 480.00, 100.00, 5224.00, '2026-09-15', 'unpaid');

-- 4.5 ตัวอย่างคำร้องแจ้งซ่อม
INSERT INTO repair_request (id, rental_profile_id, room_id, title, description, category, priority, status, staff_comment) VALUES
('88888888-8888-8888-8888-888888888801', '55555555-5555-5555-5555-555555555501', '22222222-2222-2222-2222-222222222201', 'แอร์ห้องนอนไม่ค่อยเย็น มีเสียงดังผิดปกติ', 'เปิดทิ้งไว้ 30 นาทีแล้วห้องยังไม่เย็น และมีเสียงพัดลมดังกุกกักเป็นระยะ', 'เครื่องปรับอากาศ', 'high', 'in_progress', 'นัดช่างแอร์เข้าตรวจสอบวันพฤหัสบดีนี้เวลา 13:00 น.');

-- 4.6 ตัวอย่างประกาศ
INSERT INTO announcement (id, title, content, priority, is_pinned, created_by) VALUES
('99999999-9999-9999-9999-999999999901', 'แจ้งกำหนดการล้างถังพักน้ำประจำปี 2026', 'หอพักจะดำเนินการล้างทำความสะอาดถังพักน้ำในวันอาทิตย์ที่ 20 กันยายน 2569 เวลา 09:00 - 15:00 น. ในช่วงเวลาดังกล่าวอาจมีน้ำประปาไหลอ่อน ขออภัยในความไม่สะดวก', 'urgent', true, '44444444-4444-4444-4444-444444444402'),
('99999999-9999-9999-9999-999999999902', 'ช่องทางการแจ้งบิลและชำระเงินผ่านระบบออนไลน์', 'ระบบจัดการหอพักเปิดให้บริการชำระเงินผ่าน QR PromptPay และส่งสลิปผ่านหน้าเว็บได้ตลอด 24 ชั่วโมง สะดวก รวดเร็ว และมีประวัติย้อนหลัง', 'normal', false, '44444444-4444-4444-4444-444444444401');

-- 4.7 ข้อมูลหน้าแรก (site_content)
INSERT INTO site_content (id, section_key, title, subtitle, content_json, image_url, order_index, is_active) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'hero', 'เดอะ สราญรมย์ เรสซิเดนซ์ (The Saranrom Residence)', 'หอพักและอพาร์ตเมนต์รายเดือนสไตล์โมเดิร์น ยกระดับการใช้ชีวิตที่เงียบสงบ สะดวกสบาย ใจกลางเมือง', '{"badge": "เปิดจองห้องพักว่างชั้น 2 และชั้น 4", "cta_text": "ดูห้องพักว่าง", "cta_link": "#rooms", "contact_phone": "081-999-8888"}'::jsonb, 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80', 1, true),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'amenities', 'สิ่งอำนวยความสะดวกครบครัน', 'ออกแบบมาเพื่อตอบโจทย์ทุกไลฟ์สไตล์การอยู่อาศัยที่ลงตัว ปลอดภัย และอบอุ่น', '{"items": [{"title": "ระบบรักษาความปลอดภัย 24 ชม.", "desc": "กล้องวงจรปิด CCTV ทุกชั้น พร้อมระบบเข้า-ออกด้วยคีย์การ์ดและ Digital Door Lock"}, {"title": "High-Speed Fiber Wi-Fi", "desc": "อินเทอร์เน็ตความเร็วสูงแยก access point ทุกชั้น รองรับการ Work from home"}, {"title": "ที่จอดรถยนต์และจักรยานยนต์", "desc": "พื้นที่จอดรถในร่มกว้างขวาง ปลอดภัย พร้อมจุดชาร์จ EV"}, {"title": "บริการเครื่องซักผ้าและตู้น้ำ", "desc": "โซนซักผ้าหยอดเหรียญและตู้น้ำดื่มระบบ RO สะอาด มาตรฐานทุกวัน"}]}'::jsonb, NULL, 2, true),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 'contact', 'ที่ตั้งและการเดินทาง', 'ทำเลศักยภาพ ใกล้รถไฟฟ้า มหาวิทยาลัย และศูนย์การค้าชั้นนำ', '{"address": "128/9 ซอยสุขุมวิท 71 แขวงพระโขนงเหนือ เขตวัฒนา กรุงเทพฯ 10110", "tel": "081-999-8888, 082-123-4567", "line": "@saranrom_dorm", "office_hours": "08:30 - 18:00 น. ทุกวัน"}'::jsonb, 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80', 3, true);
