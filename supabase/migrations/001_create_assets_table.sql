-- ============================================================
-- Skyblue Asset Register — Database Schema
-- Migration: 001_create_assets_table
-- ============================================================

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ============================================================
-- ENUM types
-- ============================================================
create type asset_status as enum ('active', 'repair', 'inactive');

create type asset_category as enum (
  'vehicle',
  'machinery',
  'equipment',
  'furniture',
  'land',
  'building',
  'it',
  'other'
);

create type asset_file_type as enum ('image', 'pdf', 'document');

-- ============================================================
-- TABLE: assets
-- ============================================================
create table assets (
  id                  uuid primary key default uuid_generate_v4(),

  -- Identification
  asset_code          text not null unique,           -- SKB-VEH-001
  asset_name          text not null,                 -- ชื่อสินทรัพย์
  asset_category      asset_category not null,
  short_description   text,

  -- Quantity
  quantity            integer not null default 1,
  unit                text not null default 'ชิ้น',   -- ชิ้น/คัน/ตัว/ไร่

  -- Financial
  purchase_date       date,
  purchase_cost       numeric(15, 2),                -- ราคาซื้อ THB
  salvage_value       numeric(15, 2),                -- มูลค่าซาก
  useful_life_years   integer,                       -- อายุการใช้งาน (ปี)
  depreciable         boolean not null default true, -- คิดค่าเสื่อม?

  -- Usage
  status              asset_status not null default 'active',
  location            text,                          -- ไซต์งาน / สถานที่
  custodian           text,                          -- ผู้รับผิดชอบ
  vendor_name         text,                          -- ผู้ขาย
  reference_no        text,                          -- เลขที่เอกสาร
  reference_asset_no  text,                          -- ทะเบียนรถ / Serial / โฉนด

  -- Notes
  note                text,

  -- File
  main_image_url      text,                          -- URL รูปหลัก

  -- Soft delete & Timestamps
  deleted_at          timestamptz,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- ============================================================
-- TABLE: asset_files (attachments)
-- ============================================================
create table asset_files (
  id          uuid primary key default uuid_generate_v4(),
  asset_id    uuid not null references assets(id) on delete cascade,
  file_url    text not null,
  file_name   text not null,
  file_type   asset_file_type not null default 'image',
  file_size   bigint,          -- bytes
  is_main     boolean not null default false,
  created_at  timestamptz not null default now()
);

-- ============================================================
-- INDEXES
-- ============================================================
create index idx_assets_category  on assets(asset_category);
create index idx_assets_status    on assets(status);
create index idx_assets_location  on assets(location);
create index idx_assets_deleted   on assets(deleted_at);
create index idx_assets_code      on assets(asset_code);
create index idx_asset_files_asset on asset_files(asset_id);

-- Full-text search index
create index idx_assets_search on assets
  using gin(to_tsvector('simple', asset_name || ' ' || coalesce(asset_code, '')));

-- ============================================================
-- FUNCTION: auto-update updated_at
-- ============================================================
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger assets_updated_at
  before update on assets
  for each row execute function update_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- (ปรับเพิ่มเติมเมื่อเพิ่ม Auth ภายหลัง)
-- ============================================================
alter table assets     enable row level security;
alter table asset_files enable row level security;

-- Allow all for now (เพิ่ม policy จริงเมื่อ integrate Auth)
create policy "Allow all assets" on assets
  for all using (true) with check (true);

create policy "Allow all asset_files" on asset_files
  for all using (true) with check (true);

-- ============================================================
-- STORAGE: asset-files bucket
-- สร้างใน Supabase Dashboard → Storage → New bucket
-- Name: asset-files
-- Public: true
-- ============================================================

-- ============================================================
-- SEED DATA (ตัวอย่างสินทรัพย์)
-- ============================================================
insert into assets (
  asset_code, asset_name, asset_category, short_description,
  quantity, unit, purchase_date, purchase_cost, salvage_value,
  useful_life_years, depreciable, status, location,
  custodian, reference_asset_no
) values
(
  'SKB-VEH-001',
  'รถแบคโฮ Komatsu PC200',
  'machinery',
  'รถขุดดินขนาดกลาง สำหรับงานก่อสร้าง',
  1, 'คัน',
  '2024-01-15',
  1200000, 120000, 10, true,
  'active', 'Betong Site',
  'นายช่าง A', 'กข-1234'
),
(
  'SKB-VEH-002',
  'รถกระบะ Toyota Hilux',
  'vehicle',
  'รถกระบะสำหรับขนส่งวัสดุ',
  1, 'คัน',
  '2023-06-01',
  850000, 200000, 5, true,
  'active', 'สำนักงานใหญ่',
  'นายช่าง B', 'ขค-5678'
);
