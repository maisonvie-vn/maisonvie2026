"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { Suspense } from "react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function VerifyContent() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") || "/crm";
  const method = params.get("method") || "totp"; // totp | email

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [factorId, setFactorId] = useState(null);
  const [challengeId, setChallengeId] = useState(null);
  const inputRefs = useRef([]);

  useEffect(() => {
    initChallenge();
  }, []);

  const initChallenge = async () => {
    try {
      // Lấy danh sách factors đã đăng ký
      const { data: factors } = await supabase.auth.mfa.listFactors();
      
      const totpFactor = factors?.totp?.[0];
      const emailFactor = factors?.email?.[0];
      const activeFactor = method === "totp" ? totpFactor : (emailFactor || totpFactor);

      if (!activeFactor) {
        setErrorMsg("Chưa thiết lập xác thực 2 lớp. Liên hệ Admin.");
        return;
      }

      setFactorId(activeFactor.id);

      // Tạo challenge
      const { data: challengeData, error } = await supabase.auth.mfa.challenge({
        factorId: activeFactor.id,
      });

      if (error) throw error;
      setChallengeId(challengeData.id);
    } catch (e) {
      setErrorMsg("Không thể khởi tạo xác thực. Vui lòng đăng nhập lại.");
    }
  };

  const handleOtpInput = (index, value) => {
    // Chỉ nhận số
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    // Auto-focus next
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
    // Auto-submit khi đủ 6 số
    if (index === 5 && value) {
      const code = [...newOtp.slice(0, 5), value].join("");
      if (code.length === 6) verifyOtp(code);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      verifyOtp(pasted);
    }
    e.preventDefault();
  };

  const verifyOtp = async (code) => {
    if (!factorId || !challengeId) {
      setErrorMsg("Lỗi xác thực. Vui lòng thử lại.");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    const { data, error } = await supabase.auth.mfa.verify({
      factorId,
      challengeId,
      code: code || otp.join(""),
    });

    if (error) {
      setStatus("error");
      setErrorMsg(
        error.message.includes("Invalid")
          ? "Mã xác thực không đúng. Vui lòng thử lại."
          : "Lỗi xác thực. Vui lòng đăng nhập lại."
      );
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      return;
    }

    setStatus("success");
    router.push(redirect);
  };

  const isTotp = method === "totp";

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:80px_80px]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(197,165,90,0.04)_0%,transparent_70%)]" />

      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-14 h-14 border border-gold-500/20 bg-gold-500/5 mb-6">
            <span className="text-gold-500 text-2xl">{isTotp ? "🔐" : "📧"}</span>
          </div>
          <h1 className="text-2xl font-light tracking-[0.2em] text-stone-100 uppercase font-serif mb-1">
            Xác Thực 2 Lớp
          </h1>
          <p className="text-[10px] uppercase tracking-[0.3em] text-stone-600">
            {isTotp
              ? "Nhập mã từ Authenticator App"
              : "Nhập mã đã gửi về email của bạn"}
          </p>
        </div>

        <div className="bg-[#111111] border border-white/5 shadow-2xl p-8 md:p-10">
          {/* Instruction */}
          <div className="mb-8 text-center">
            <p className="text-stone-400 text-[13px] leading-relaxed">
              {isTotp
                ? "Mở Google Authenticator hoặc Authy và nhập mã 6 số hiện tại."
                : "Kiểm tra hộp thư email và nhập mã xác thực 6 số."}
            </p>
          </div>

          {errorMsg && (
            <div className="mb-6 px-4 py-3 bg-red-950/40 border border-red-500/20 text-red-400 text-[12px] leading-relaxed text-center">
              {errorMsg}
            </div>
          )}

          {status === "success" ? (
            <div className="text-center py-6">
              <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center text-xl mx-auto mb-4">
                ✓
              </div>
              <p className="text-emerald-400 text-sm">Xác thực thành công · Đang chuyển hướng...</p>
            </div>
          ) : (
            <>
              {/* 6-digit OTP input */}
              <div className="flex gap-3 justify-center mb-8" onPaste={handlePaste}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => (inputRefs.current[i] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpInput(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    className="w-12 h-14 text-center text-xl font-semibold text-gold-400 bg-black/60 border border-white/10 focus:border-gold-500/60 focus:outline-none focus:bg-gold-500/5 transition-all font-mono tracking-widest"
                  />
                ))}
              </div>

              <button
                onClick={() => verifyOtp(null)}
                disabled={otp.join("").length < 6 || status === "loading"}
                className="w-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-[11px] uppercase tracking-[0.3em] py-4 hover:bg-gold-500/20 hover:border-gold-500/50 transition-all disabled:opacity-30 disabled:cursor-not-allowed font-semibold"
              >
                {status === "loading" ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-3 h-3 border border-gold-500/50 border-t-gold-500 rounded-full animate-spin" />
                    Đang xác thực...
                  </span>
                ) : "Xác nhận"}
              </button>

              <button
                onClick={() => router.push("/crm/login")}
                className="w-full mt-3 text-[10px] uppercase tracking-widest text-stone-600 hover:text-stone-400 py-2 transition-all"
              >
                ← Quay lại đăng nhập
              </button>
            </>
          )}

          <div className="mt-6 pt-6 border-t border-white/5">
            <p className="text-[10px] text-stone-700 text-center leading-relaxed">
              Mã xác thực có hiệu lực trong 30 giây (TOTP) hoặc 10 phút (Email)<br />
              Không chia sẻ mã này với bất kỳ ai
            </p>
          </div>
        </div>

        <p className="text-center text-[9px] text-stone-700 mt-6 tracking-wider uppercase">
          Maison Vie OS v2.6.0 · Secured by Supabase Auth
        </p>
      </div>
    </div>
  );
}

export default function CrmVerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#080808] flex items-center justify-center text-gold-500 text-sm tracking-widest uppercase">
        Đang tải...
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}
