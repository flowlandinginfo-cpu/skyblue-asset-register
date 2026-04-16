# Deploy Skyblue Asset Register ขึ้น Vercel

คู่มือ Deploy แบบรวดเร็ว — ใช้เวลาประมาณ 5–10 นาที

---

## ตัวเลือกที่ 1: Deploy ผ่าน Vercel Dashboard (แนะนำสำหรับมือใหม่)

### ขั้นตอน

**1. Push โค้ดขึ้น GitHub**

ถ้ายังไม่มี Git repo:

```bash
cd "/Users/piyananc/Library/CloudStorage/OneDrive-Personal/Side Hustles/FlowLanding/Client/Abu Company/SKB-Asset-Register-App"
git init
git add .
git commit -m "Initial commit: Skyblue Asset Register"
```

ไปที่ https://github.com/new → สร้าง repo ใหม่ เช่น `skyblue-asset-register` (**ตั้งเป็น Private**)

แล้วรัน:

```bash
git remote add origin https://github.com/<USERNAME>/skyblue-asset-register.git
git branch -M main
git push -u origin main
```

**2. เข้า Vercel**

- ไปที่ https://vercel.com/new
- Login ด้วย GitHub
- กด **Import** repo `skyblue-asset-register`

**3. ตั้งค่า Environment Variables**

ใน Vercel → Configure Project → Environment Variables:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://wiqgnsmodkdayvtorwfb.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | (คัดลอกจาก `.env.local`) |
| `NEXT_PUBLIC_APP_NAME` | `Skyblue Asset Register` |
| `NEXT_PUBLIC_COMPANY_NAME` | `Skyblue Construction Co., Ltd.` |
| `NEXT_PUBLIC_STORAGE_BUCKET` | `asset-files` |

**4. กด Deploy**

Vercel จะ build + deploy อัตโนมัติ (ประมาณ 2–3 นาที)

เสร็จแล้วจะได้ URL เช่น `https://skyblue-asset-register.vercel.app`

---

## ตัวเลือกที่ 2: Deploy ผ่าน CLI (เร็วกว่า ถ้าใช้ Terminal คล่อง)

```bash
# ติดตั้ง Vercel CLI
npm i -g vercel

# เข้า folder project
cd "/Users/piyananc/Library/CloudStorage/OneDrive-Personal/Side Hustles/FlowLanding/Client/Abu Company/SKB-Asset-Register-App"

# Login + Deploy
vercel login
vercel --prod
```

ตอบคำถามตามนี้:
- Set up and deploy? → **Y**
- Which scope? → เลือก account ของคุณ
- Link to existing project? → **N**
- Project name → `skyblue-asset-register`
- Directory → `.` (กด Enter)
- Override settings? → **N**

หลัง deploy ครั้งแรก ไปเพิ่ม Environment Variables ที่ Vercel Dashboard (ดูตาราง Section 3 ด้านบน) แล้วรัน `vercel --prod` อีกครั้ง

---

## การ Update หลัง Deploy

**ถ้าใช้ GitHub flow:**
```bash
git add .
git commit -m "Update: ..."
git push
```
→ Vercel จะ auto-deploy ให้ทันที

**ถ้าใช้ CLI:**
```bash
vercel --prod
```

---

## หมายเหตุสำคัญ

⚠️ **เรื่อง Security** — ตอนนี้ RLS ของ Supabase เป็น `allow all` (ใครเข้า URL ก็ใช้ได้)

**ก่อนให้คนอื่นใช้งานจริง** ควรเพิ่ม:

1. **Basic Auth ที่ Vercel** (ง่ายสุด) — Settings → Deployment Protection → Password Protection
2. **หรือ Supabase Auth** (เหมาะระยะยาว) — เพิ่มระบบ login เช่น Email + Password หรือ Google OAuth

---

## ตรวจสอบหลัง Deploy

- [ ] เปิด URL ที่ Vercel ให้มา เห็นหน้ารายการสินทรัพย์
- [ ] เห็น 2 รายการ seed data (รถแบคโฮ + Toyota Hilux)
- [ ] กด "+ เพิ่มสินทรัพย์" ทดลองสร้างรายการใหม่
- [ ] อัปโหลดรูปภาพใน Step 4 ดูว่าขึ้นรูปถูก
- [ ] ลองแก้ไข + ลบรายการ
