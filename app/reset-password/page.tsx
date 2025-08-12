"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!email || !password || !confirmPassword) {
            setError("กรุณากรอกข้อมูลให้ครบ");
            return;
        }
        if (password !== confirmPassword) {
            setError("รหัสผ่านไม่ตรงกัน");
            return;
        }

        try {
            const res = await fetch("/api/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "เกิดข้อผิดพลาด");
            }

            router.push("/");
        } catch (err: any) {
            setError(err.message || "เกิดข้อผิดพลาด");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
            <div className="w-full max-w-md bg-white rounded-xl shadow p-6">
                <h1 className="text-2xl font-semibold mb-4">รีเซ็ตรหัสผ่าน</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1 font-medium">อีเมล</label>
                        <input
                            type="email"
                            className="w-full border rounded-lg px-3 py-2"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="กรอกอีเมล"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">รหัสผ่านใหม่</label>
                        <input
                            type="password"
                            className="w-full border rounded-lg px-3 py-2"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="กรอกรหัสผ่านใหม่"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">ยืนยันรหัสผ่านใหม่</label>
                        <input
                            type="password"
                            className="w-full border rounded-lg px-3 py-2"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="ยืนยันรหัสผ่านใหม่"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
                    >
                        รีเซ็ตรหัสผ่าน
                    </button>
                </form>
            </div>
        </div>
    );
}