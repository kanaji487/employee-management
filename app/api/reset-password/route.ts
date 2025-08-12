import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";

async function updateUserPasswordByEmail(email: string, hashedPassword: string) {
  const updatedUser = await prisma.user.update({
    where: { email },
    data: { password: hashedPassword },
  });
  return updatedUser ? true : false;
}

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "กรุณากรอกอีเมลและรหัสผ่าน" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const updated = await updateUserPasswordByEmail(email, hashedPassword);
    if (!updated) {
      return NextResponse.json(
        { message: "ไม่พบผู้ใช้นี้ หรืออัปเดตไม่สำเร็จ" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "รีเซ็ตรหัสผ่านสำเร็จ" });
  } catch (error) {
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดภายในระบบ" },
      { status: 500 }
    );
  }
}