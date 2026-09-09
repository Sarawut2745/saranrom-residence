# เดอะ สราญรมย์ เรสซิเดนซ์ (The Saranrom Residence)
## ระบบบริหารจัดการหอพักและอพาร์ตเมนต์รายเดือนครบวงจร (Dormitory Management System)

เว็บแอปพลิเคชันสำหรับบริหารจัดการหอพักและห้องพักรายเดือน พัฒนาด้วย Next.js (App Router), TypeScript และ Supabase รองรับการทำงาน 3 กลุ่มผู้ใช้งานหลัก: ผู้เช่า (Rental), นิติบุคคล (Staff) และเจ้าของกิจการ (Owner) พร้อมระบบออกบิล ค่าน้ำ-ค่าไฟ ตรวจสอบสลิป แจ้งซ่อม และศูนย์คู่มือการใช้งานแบบอินเทอร์แอคทีฟ

---

## สารบัญ
1. คุณสมบัติเด่นของระบบ
2. เทคโนโลยีที่ใช้ (Tech Stack)
3. ความต้องการของระบบ (Prerequisites)
4. ขั้นตอนการติดตั้งและเริ่มต้นใช้งาน (Installation)
5. การตั้งค่าตัวแปรสภาพแวดล้อม (Environment Variables)
6. การติดตั้งฐานข้อมูล (Database Setup)
7. บัญชีผู้ใช้ทดสอบระบบ (Default Test Accounts)
8. โครงสร้างเส้นทางและการใช้งาน (Routes & Usage)
9. คู่มือการใช้งานระบบ (User Manuals)
10. โครงสร้างโปรเจกต์ (Project Structure)

---

## 1. คุณสมบัติเด่นของระบบ

### 1.1 พอร์ทัลผู้เช่า (Rental Portal - `/rental`)
- ตรวจสอบยอดบิลค่าเช่าประจำเดือน รายละเอียดค่าน้ำ ค่าไฟ และค่าบริการส่วนกลาง
- ชำระเงินผ่าน QR Code PromptPay พร้อมระบบอัปโหลดสลิปยืนยันการโอนเงิน
- ระบบส่งคำร้องแจ้งซ่อมห้องพัก ติดตามสถานะงานซ่อม และการนัดหมายช่าง
- ติดตามประกาศ ข่าวสาร และมาตรการสำคัญจากนิติบุคคล
- ตรวจสอบประวัติการใช้มิเตอร์น้ำ-ไฟย้อนหลัง
- ดูสัญญาเช่า เงินประกัน และข้อมูลห้องพัก

### 1.2 พอร์ทัลนิติบุคคล (Staff Portal - `/staff`)
- แดชบอร์ดภาพรวม: ยอดเงินรอตรวจสอบ, คำร้องแจ้งซ่อมคงค้าง, อัตราห้องว่าง
- ระบบผังห้องพัก (Room Grid): จัดการสถานะห้อง (ว่าง, มีผู้เช่า, ปิดปรับปรุง) และข้อมูลผู้เช่า
- ระบบจดมิเตอร์น้ำ-ไฟ: บันทึกเลขมิเตอร์ คำนวณหน่วยที่ใช้ และคำนวณค่าน้ำ-ไฟอัตโนมัติ
- ระบบออกบิลและตรวจสอบสลิป: ตรวจสอบหลักฐานการโอนเงินและอนุมัติบิล
- ระบบจัดการงานแจ้งซ่อม: รับเรื่อง มอบหมายช่าง บันทึกการแก้ไข และปิดงาน
- ระบบจัดการประกาศ: เผยแพร่ข่าวสาร ปักหมุดประกาศด่วน และแจ้งเตือนผู้เช่า

### 1.3 พอร์ทัลเจ้าของกิจการ (Owner Portal - เข้าใช้งานผ่าน `/staff` ด้วยสิทธิ์ Owner)
- รายงานและสถิติการเงิน: รายได้รวม, อัตราการเก็บเงินสำเร็จ, ยอดค้างชำระ
- วิเคราะห์อัตราการเข้าพัก (Occupancy Rate) และห้องพักแยกตามประเภท/ชั้น
- บันทึกประวัติการดำเนินงานของระบบ (Audit Logs)
- ตรวจสอบภาพรวมและรายชื่อเจ้าหน้าที่นิติบุคคล

### 1.4 ศูนย์รวมคู่มือการใช้งาน (Manual Hub - `/manual`)
- หน้าเว็บรวมคู่มือการใช้งานอย่างเป็นทางการ แบ่งตามบทบาท 3 เล่ม
- ภาพประกอบจริงพร้อมกรอบและหมายเลขกำกับขั้นตอนอย่างละเอียด
- ฟังก์ชันดาวน์โหลดคู่มือฉบับสมบูรณ์ในรูปแบบไฟล์ PDF ทุกเล่ม

---

## 2. เทคโนโลยีที่ใช้ (Tech Stack)

- **Frontend Framework**: Next.js 15 (App Router, Server Components & Client Components)
- **Language**: TypeScript 5
- **UI & Styling**: Vanilla CSS / Scoped CSS Modules (สไตล์โมเดิร์น ดีไซน์มินิมอลพรีเมียม ปราศจาก Emoji)
- **Icons**: Lucide React
- **Database & Backend**: Supabase (PostgreSQL, Row Level Security, Supabase SSR Auth)
- **PDF Generation & Tools**: Puppeteer Core, QRCode Generator, Canvas Confetti

---

## 3. ความต้องการของระบบ (Prerequisites)

ก่อนเริ่มติดตั้ง ตรวจสอบว่าเครื่องคอมพิวเตอร์ของคุณมีโปรแกรมดังต่อไปนี้:
- **Node.js**: เวอร์ชัน 18.18.0 ขึ้นไป (แนะนำ Node.js 20 LTS หรือ 22)
- **npm**: เวอร์ชัน 9 ขึ้นไป (หรือใช้ yarn / pnpm)
- **Git**: สำหรับโคลนและจัดการเวอร์ชันโค้ด
- **บัญชี Supabase**: สำหรับสร้างฐานข้อมูล PostgreSQL (https://supabase.com)

---

## 4. ขั้นตอนการติดตั้งและเริ่มต้นใช้งาน (Installation)

### ขั้นตอนที่ 1: โคลนโค้ดจาก GitHub
เปิด Terminal หรือ Command Prompt แล้วรันคำสั่ง:
```bash
git clone https://github.com/Sarawut2745/saranrom-residence.git
cd saranrom-residence
```

### ขั้นตอนที่ 2: ติดตั้ง Dependencies
ติดตั้งแพ็กเกจที่จำเป็นทั้งหมดของโปรเจกต์:
```bash
npm install
```

### ขั้นตอนที่ 3: กำหนดค่าตัวแปรสภาพแวดล้อม (.env.local)
คัดลอกไฟล์ตัวอย่าง `.env.example` ไปเป็น `.env.local`:
```bash
# บน Windows PowerShell
copy .env.example .env.local

# บน Linux / macOS
cp .env.example .env.local
```
จากนั้นเปิดไฟล์ `.env.local` เพื่อระบุค่าคอนฟิกของ Supabase (ดูรายละเอียดในหัวข้อถัดไป)

### ขั้นตอนที่ 4: รันระบบสำหรับทดสอบ (Development Mode)
```bash
npm run dev
```
เปิดเว็บบราวเซอร์และเข้าไปที่: `http://localhost:3000`

### ขั้นตอนที่ 5: บิลด์สำหรับใช้งานจริง (Production Build)
เมื่อต้องการทดสอบหรือขึ้นเซิร์ฟเวอร์จริง:
```bash
npm run build
npm run start
```

---

## 5. การตั้งค่าตัวแปรสภาพแวดล้อม (Environment Variables)

ไฟล์ `.env.local` สำหรับกำหนดค่าเชื่อมต่อฐานข้อมูลและบริการภายนอก:

```env
# Supabase Configuration (นำค่ามาจาก Project Settings > API ใน Supabase Dashboard)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-or-anon-key

# LINE Official Account Settings (ทางเลือก สำหรับลิงก์ติดต่อและแจ้งเตือน)
NEXT_PUBLIC_LINE_OA_URL=https://lin.ee/your-line-oa
NEXT_PUBLIC_LINE_OA_ID=@saranrom_dorm
LINE_CHANNEL_ACCESS_TOKEN=your-line-channel-access-token
LINE_CHANNEL_SECRET=your-line-channel-secret
```

---

## 6. การติดตั้งฐานข้อมูล (Database Setup)

โครงสร้างฐานข้อมูล ข้อมูลประเภทห้องพัก ห้องพัก และบัญชีทดสอบเริ่มต้น ถูกจัดเตรียมไว้ในไฟล์ `dormitory_schema.sql`:

1. เข้าสู่ระบบ Supabase Dashboard (https://supabase.com/dashboard)
2. เลือกโปรเจกต์ของคุณ แล้วไปที่เมนู **SQL Editor** ทางแถบซ้าย
3. คลิกปุ่ม **New query**
4. เปิดไฟล์ `dormitory_schema.sql` ในโฟลเดอร์โปรเจกต์ คัดลอกโค้ด SQL ทั้งหมดแล้วนำไปวางใน SQL Editor
5. กดปุ่ม **Run** เพื่อสร้างตาราง ดัชนี และข้อมูลจำลอง (Seed Data)

ตารางหลักที่ถูกสร้าง:
- `users`: ข้อมูลผู้ใช้งานระบบและบทบาท (`rental`, `staff`)
- `staff_profile`: ข้อมูลนิติบุคคลและเจ้าของ (`is_owner = true`)
- `rental_profile`: ข้อมูลผู้เช่า บัตรประชาชน และผู้ติดต่อฉุกเฉิน
- `room_type`: ข้อมูลประเภทห้อง ราคาฐาน อัตราค่าน้ำ-ไฟ และสิ่งอำนวยความสะดวก
- `room`: รายการห้องพัก ชั้น และสถานะห้อง (`available`, `occupied`, `maintenance`)
- `contract`: ข้อมูลสัญญาเช่าและเงินประกัน
- `bill`: ข้อมูลบิลค่าเช่า จดมิเตอร์น้ำ-ไฟ และสถานะชำระเงิน
- `payment_slip`: ข้อมูลสลิปโอนเงินที่รอการตรวจสอบ
- `repair_request`: ข้อมูลคำร้องแจ้งซ่อมและสถานะดำเนินการ
- `announcement`: ข้อมูลประกาศ ข่าวสาร และการปักหมุด
- `site_content`: ข้อมูลเนื้อหาและรูปภาพบนหน้าแรกสาธารณะ

---

## 7. บัญชีผู้ใช้ทดสอบระบบ (Default Test Accounts)

หลังจากรันสคริปต์ `dormitory_schema.sql` ระบบจะมีบัญชีเริ่มต้นสำหรับทดสอบครบทั้ง 3 กลุ่มผู้ใช้:

| บทบาท (Role) | อีเมล (Email) | รหัสผ่าน (Password) | รายละเอียด |
| :--- | :--- | :--- | :--- |
| **เจ้าของกิจการ (Owner)** | `owner@dormitory.com` | `owner1234` | สิทธิ์สูงสุด ดูรายงานการเงิน สถิติรายได้ ผังห้องพัก และ Audit Logs |
| **นิติบุคคล (Staff)** | `staff@dormitory.com` | `staff1234` | จัดการห้องพัก จดมิเตอร์ ตรวจสอบสลิป แจ้งซ่อม และลงประกาศ |
| **ผู้เช่า (Rental)** | `tenant201@gmail.com` | `tenant1234` | ผู้เช่าห้อง 201 ดูบิล โอนสลิป QR แจ้งซ่อม และอ่านประกาศ |

---

## 8. โครงสร้างเส้นทางและการใช้งาน (Routes & Usage)

| เส้นทาง (Route) | กลุ่มผู้ใช้งาน | หน้าที่และการทำงาน |
| :--- | :--- | :--- |
| `/` | บุคคลทั่วไป / ผู้สนใจ | หน้าหลักแนะนำโครงการ ประเภทห้องพัก สิ่งอำนวยความสะดวก ข้อมูลติดต่อ และลิงก์เข้าสู่ระบบ |
| `/login` | ผู้ใช้งานทุกกลุ่ม | หน้าจอเข้าสู่ระบบด้วยอีเมลและรหัสผ่าน ระบบจะนำทางไปยังพอร์ทัลตามบทบาทอัตโนมัติ |
| `/rental` | ผู้เช่าห้องพัก | แดชบอร์ดผู้เช่า ตรวจสอบบิล ชำระเงิน แจ้งซ่อม ติดตามสถานะ และดูประกาศ |
| `/staff` | นิติบุคคล / เจ้าของ | แดชบอร์ดจัดการหอพัก ผังห้องพัก บิลมิเตอร์ แจ้งซ่อม และรายงานสถิติสำหรับเจ้าของ |
| `/manual` | ทุกกลุ่มผู้ใช้งาน | ศูนย์รวมคู่มือการใช้งานระบบ (Manual Hub) เล่ม 1, 2 และ 3 |
| `/manual/rental` | ผู้เช่าห้องพัก | คู่มือการใช้งานออนไลน์สำหรับผู้เช่า |
| `/manual/staff` | เจ้าหน้าที่นิติบุคคล | คู่มือการใช้งานออนไลน์สำหรับนิติบุคคล |
| `/manual/owner` | เจ้าของกิจการ | คู่มือการใช้งานออนไลน์สำหรับเจ้าของ |

---

## 9. คู่มือการใช้งานระบบ (User Manuals)

ระบบมีเอกสารคู่มือการใช้งานฉบับสมบูรณ์จัดเตรียมไว้ในโฟลเดอร์ `public/manual/`:
- **เล่ม 1: คู่มือผู้เช่า (Rental Portal)**: [manual-rental.pdf](public/manual/manual-rental.pdf)
- **เล่ม 2: คู่มือนิติบุคคล (Staff Portal)**: [manual-staff.pdf](public/manual/manual-staff.pdf)
- **เล่ม 3: คู่มือเจ้าของ (Owner Portal)**: [manual-owner.pdf](public/manual/manual-owner.pdf)

สามารถเข้าอ่านผ่านเว็บได้โดยตรงที่หน้า `/manual` เมื่อรันเว็บเซิร์ฟเวอร์

---

## 10. โครงสร้างโปรเจกต์ (Project Structure)

```
saranrom-residence/
├── app/                        # Next.js App Router (หน้าเว็บและ API Routes)
│   ├── api/                    # API Endpoints (Auth, Bills, Upload ฯลฯ)
│   ├── login/                  # หน้าเข้าสู่ระบบ
│   ├── manual/                 # หน้าศูนย์คู่มือการใช้งานและคู่มือออนไลน์ 3 เล่ม
│   ├── rental/                 # หน้าพอร์ทัลผู้เช่า
│   ├── staff/                  # หน้าพอร์ทัลนิติบุคคลและเจ้าของ
│   ├── globals.css             # สไตล์หลักของระบบ
│   ├── layout.tsx              # Root Layout
│   └── page.tsx                # หน้าแรก Landing Page แนะนำโครงการ
├── components/                 # คอมโพเนนต์ที่ใช้ซ้ำ (Navbar, Modal, QR ฯลฯ)
├── public/                     # Static Assets
│   └── manual/                 # ไฟล์เอกสาร PDF คู่มือ และภาพประกอบขั้นตอน
├── utils/                      # ฟังก์ชันช่วยเหลือและ Supabase Clients
│   └── supabase/               # Browser, Server, Middleware Supabase Clients
├── dormitory_schema.sql        # สคริปต์สร้างฐานข้อมูล PostgreSQL และข้อมูลตัวอย่าง
├── middleware.ts               # Next.js Middleware ควบคุมสิทธิ์การเข้าถึงหน้าเว็บ
├── .env.example                # ตัวอย่างการตั้งค่า Environment Variables
├── .gitignore                  # กฎการละเว้นไฟล์ที่ไม่เกี่ยวข้องสำหรับ Git
├── package.json                # ข้อมูลโปรเจกต์และรายการ Dependencies
└── tsconfig.json               # การกำหนดค่า TypeScript
```

---
