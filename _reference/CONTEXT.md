# Project Context — Skyblue Asset Register

## ข้อมูลลูกค้า
- **บริษัท:** Skyblue Construction Co., Ltd.
- **ประเภทธุรกิจ:** รับเหมาก่อสร้างภาครัฐ
- **ผู้ใช้งานหลัก:** ทีมบัญชี / admin
- **เป้าหมาย:** ทำระบบทะเบียนทรัพย์สินก่อน integrate เข้า ERP ใหญ่

## Files ใน _reference/

### templates/
| ไฟล์ | ใช้ทำอะไร |
|------|-----------|
| `SkyBlue_v3_Final.xlsx` | Template หลัก — ดูโครงสร้างข้อมูลเดิม |
| `SkyBlue_Accounting_v2.xlsx` | Template บัญชี — ดู field ที่ทีมบัญชีใช้ |
| `SkyBlue_Engineer_Data_Template.xlsx` | ข้อมูลช่าง / งานปัจจุบัน |
| `SKB_FlowAccount_Template_2568.xlsx` | ใช้กับ FlowAccount — ดู format |

### docs/
| ไฟล์ | ใช้ทำอะไร |
|------|-----------|
| `📖_คู่มือกรอก_Template_บังซิ.pdf` | วิธีกรอกข้อมูลเดิม (สำหรับทำ UX) |
| `📖_คู่มือบัญชี_คุณยะ_SkyBlue.pdf` | ขั้นตอนบัญชีของทีม |
| `SkyBlue_Enterprise_System.pdf` | Spec ระบบ Enterprise ที่วางแผนไว้ |
| `BOQ.pdf` | Bill of Quantities — reference สำหรับ asset categories |

## Asset Code Convention

```
SKB - {CATEGORY} - {NUMBER}

Categories:
  VEH = Vehicle    (ยานพาหนะ)
  MCH = Machinery  (เครื่องจักร)
  EQP = Equipment  (อุปกรณ์)
  FRN = Furniture  (ครุภัณฑ์)
  LND = Land       (ที่ดิน)
  BLD = Building   (สิ่งปลูกสร้าง)
  ITC = IT         (คอมพิวเตอร์)
  OTH = Other      (อื่นๆ)

Examples:
  SKB-VEH-001 = รถแบคโฮ Komatsu
  SKB-LND-001 = ที่ดินสำนักงาน
  SKB-ITC-001 = คอมพิวเตอร์แผนกบัญชี
```

## Location Options (ไซต์งานที่รู้)
- สำนักงานใหญ่
- Betong Site
- (เพิ่มเติมตาม project จริง)

## Status
| Code | Label | ความหมาย |
|------|-------|----------|
| active | 🟢 ใช้งานอยู่ | ใช้งานปกติ |
| repair | 🟡 ซ่อมบำรุง | อยู่ระหว่างซ่อม |
| inactive | 🔴 เลิกใช้งาน | ไม่ใช้แล้ว / ขายทิ้ง |

## Depreciation (ค่าเสื่อมราคา)
ใช้วิธี Straight-Line:
```
ค่าเสื่อมต่อปี = (ราคาซื้อ - มูลค่าซาก) / อายุการใช้งาน
มูลค่าตามบัญชี = ราคาซื้อ - (ค่าเสื่อม × จำนวนปีที่ผ่านมา)
```

## Tech Stack
- **Frontend:** Next.js 15 + TypeScript + Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Storage:** Supabase Storage (bucket: `asset-files`)
- **Forms:** react-hook-form + zod validation
- **State:** TanStack Query (server state)
- **Icons:** lucide-react
- **Date:** date-fns

## Next Steps (Development Order)
1. [ ] Setup Supabase project → get credentials → fill `.env.local`
2. [ ] Run SQL migration (`supabase/migrations/001_create_assets_table.sql`)
3. [ ] Create Supabase Storage bucket (`asset-files`, public)
4. [ ] Implement Asset List page (`/assets`)
5. [ ] Implement Step Form (`/assets/new`)
6. [ ] Implement Asset Detail page (`/assets/[id]`)
7. [ ] Implement Edit + Delete
8. [ ] Add file upload (Supabase Storage)
9. [ ] Polish UI + HelpPanel content
10. [ ] Test with real data
