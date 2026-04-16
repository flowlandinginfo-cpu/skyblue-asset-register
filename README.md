# 🏗️ Skyblue Asset Register

ระบบทะเบียนทรัพย์สินภายใน — Skyblue Construction Co., Ltd.
Internal asset management app for accounting/admin team.

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Setup environment
cp .env.example .env.local
# แก้ไข .env.local ใส่ Supabase credentials

# 3. Run database migration
# ไปที่ Supabase Dashboard → SQL Editor → paste supabase/migrations/001_create_assets_table.sql

# 4. Start dev server
npm run dev
```

เปิด [http://localhost:3000](http://localhost:3000) ในเบราว์เซอร์

---

## Project Structure

```
src/
├── app/
│   ├── assets/          # Asset pages
│   │   ├── page.tsx     # List (หน้าหลัก)
│   │   ├── new/         # Create
│   │   └── [id]/        # Detail + Edit
│   └── api/assets/      # API routes
├── components/
│   ├── assets/          # Asset-specific components
│   ├── forms/           # Step form components
│   ├── ui/              # Reusable UI (Button, Input, etc.)
│   └── layout/          # Header, HelpPanel
├── lib/
│   ├── supabase/        # Supabase clients
│   ├── hooks/           # Custom React hooks
│   └── utils/           # Formatters, validators
└── types/
    └── asset.ts         # All TypeScript types

supabase/
└── migrations/
    └── 001_create_assets_table.sql

_reference/              # ข้อมูล reference จาก client
├── templates/           # Excel templates เดิม
├── docs/                # คู่มือและเอกสาร
└── CONTEXT.md           # Context ของ project
```

---

## Features

- ✅ Asset List with Search & Filter
- ✅ Step Form (4 steps): Basic → Financial → Usage → Attachments
- ✅ Asset Detail page
- ✅ Edit & Delete (soft delete)
- ✅ File attachments (images + PDFs via Supabase Storage)
- ✅ Built-in training / help panel on every screen
- ✅ Thai-first UI

---

## Supabase Setup

1. ไปที่ [supabase.com](https://supabase.com) → สร้าง project ใหม่
2. ไปที่ **SQL Editor** → paste ไฟล์ `supabase/migrations/001_create_assets_table.sql`
3. ไปที่ **Storage** → สร้าง bucket ชื่อ `asset-files` (Public)
4. ไปที่ **Project Settings → API** → copy `URL` และ `anon key`
5. ใส่ใน `.env.local`

---

## Asset Code Format

```
SKB-{CATEGORY}-{NUMBER}

SKB-VEH-001  →  รถแบคโฮ Komatsu
SKB-MCH-001  →  เครื่องจักร
SKB-ITC-001  →  คอมพิวเตอร์
```

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | Supabase (PostgreSQL) |
| Storage | Supabase Storage |
| Forms | react-hook-form + zod |
| State | TanStack Query |
| Icons | lucide-react |

---

## Development Notes

- ข้อมูล reference อยู่ใน `_reference/CONTEXT.md`
- Soft delete: assets ที่ลบจะมี `deleted_at` ไม่ใช่ลบจริง
- Thai locale: ใช้ `Noto Sans Thai` font
- ดู types ทั้งหมดที่ `src/types/asset.ts`
