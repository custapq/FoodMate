🍽️ Foodmate

Foodmate เป็นเว็บแอปพลิเคชันที่ช่วยแนะนำอาหารตามเงื่อนไขของผู้ใช้ โดยคำนวณข้อมูลทางโภชนาการและติดตามการบริโภคของผู้ใช้ เพื่อช่วยให้พวกเขาควบคุมสุขภาพได้ดีขึ้น

✨ Features

- ผู้ใช้สามารถป้อนข้อมูลส่วนตัวเพื่อใช้คำนวณทางโภชนาการ

- ค้นหาและเลือกอาหารจากหมวดหมู่ต่างๆ เช่น อาหารหลัก, ของทอด, ขนมหวาน และเครื่องดื่ม

- ระบบติดตามประวัติการบริโภค (รายวัน, รายสัปดาห์, รายเดือน)

- ระบบค้นหาอาหารตามชื่อและตัวกรองหมวดหมู่

- แสดงปริมาณสารอาหารที่บริโภคและที่ต้องการในแต่ละวัน

- แนะนำอาหารที่เหมาะสมกับผู้ใช้โดยใช้ FoodTag

🔨 Tech Stack

- Framework: Next.js

- Database: PostgreSQL (Prisma ORM)

- Authentication: NextAuth.js

- CSS Framework: Tailwind CSS

💻 Installation

1. Clone the repository
```
git clone https://github.com/custapq/foodmate.git
cd foodmate
```

1. Install dependencies
```
npm install
```
1. Set up environment variables

สร้างไฟล์ .env และกำหนดค่าต่อไปนี้:
```
DATABASE_URL=postgresql://your-db-url
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```
4. Run database migration
```
npx prisma migrate dev
```
5. Start the development server
```
npm run dev
```
Usage

เปิดเว็บแอปพลิเคชันที่ http://localhost:3000

- ลงทะเบียนหรือเข้าสู่ระบบ

- ป้อนข้อมูลส่วนตัวเพื่อเริ่มติดตามโภชนาการ

- ค้นหาและเลือกอาหารที่ต้องการ

- ดูข้อมูลแนะนำและติดตามการบริโภคของคุณ

Future Development

- เพิ่มการรองรับ AI ในการวิเคราะห์พฤติกรรมการกิน

- รองรับการแนะนำอาหารตามเงื่อนไขสุขภาพเฉพาะ

- พัฒนาแอปมือถือสำหรับ iOS และ Android