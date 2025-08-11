"use client"

import React, { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

const page = () => {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setMessage("กรุณากรอก OTP ให้ครบ 6 หลัก");
      return;
    }
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("ยืนยัน OTP สำเร็จ! กำลังเข้าสู่ระบบ...");
        router.push("/dashboard");
      } else {
        setMessage(data.message || "OTP ไม่ถูกต้อง");
      }
    } catch {
      setMessage("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 to-purple-600 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
          กรุณากรอก OTP
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            inputMode="numeric"
            value={otp}
            onChange={handleChange}
            placeholder="กรอกรหัส OTP 6 หลัก"
            className="w-full border border-gray-300 rounded-md px-4 py-3 text-xl text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "กำลังตรวจสอบ..." : "ยืนยัน OTP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default page