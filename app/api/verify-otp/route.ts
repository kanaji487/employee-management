import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { message: "กรุณากรอกอีเมลและ OTP" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.otp || !user.otp_expiry) {
      return NextResponse.json(
        { message: "ไม่พบ OTP สำหรับบัญชีนี้" },
        { status: 404 }
      );
    }

    if (user.otp !== otp) {
      return NextResponse.json(
        { message: "OTP ไม่ถูกต้อง" },
        { status: 401 }
      );
    }

    if (user.otp_expiry < new Date()) {
      return NextResponse.json(
        { message: "OTP หมดอายุ" },
        { status: 401 }
      );
    }

    await prisma.user.update({
      where: { email },
      data: { otp: null, otp_expiry: null },
    });

    // TODO: สร้าง token/session สำหรับ login ต่อ (ถ้ามีระบบ JWT หรือ session)

    return NextResponse.json(
      { success: true, message: "เข้าสู่ระบบสำเร็จ" },
      { status: 200 }
    );
  } catch (error) {
    console.error("OTP verification error:", error);
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดภายในระบบ" },
      { status: 500 }
    );
  }
}