"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Suspense } from "react";

function LoginContent() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") || "/crm";
  const errorParam = params.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | error
  const [errorMsg, setErrorMsg] = useState(
    errorParam === "no_role" ? "Tài khoản chưa được cấp quyền CRM." : ""
  );

  const handleLogin = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setStatus("error");
      setErrorMsg(
        error.message.includes("Invalid login")
          ? "Email hoặc mật khẩu không đúng. Vui lòng thử lại."
          : error.message
      );
      return;
    }

    // Kiểm tra trạng thái MFA sau khi đăng nhập
    if (data?.session) {
      try {
        // Lấy danh sách factors của user
        const { data: factorsData, error: factorsError } = await supabase.auth.mfa.listFactors();
        if (factorsError) throw factorsError;
        
        const totpFactor = factorsData?.totp?.[0];

        if (totpFactor && totpFactor.status === "verified") {
          // Đã có TOTP verified → cần nhập mã xác thực
          router.push(`/crm/verify?redirect=${encodeURIComponent(redirect)}`);
        } else {
          // Chưa có TOTP (hoặc unverified) → setup TOTP (cho mọi role)
          router.push(`/crm/setup-totp?redirect=${encodeURIComponent(redirect)}`);
        }
      } catch (e) {
        console.error("MFA checking error:", e);
        setStatus("error");
        setErrorMsg("Lỗi xác thực 2 lớp: " + e.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Ambient background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:80px_80px]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(197,165,90,0.04)_0%,transparent_70%)]" />

      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-14 h-14 border border-gold-500/20 bg-gold-500/5 mb-6">
            <span className="text-gold-500 text-xl">⚜</span>
          </div>
          <h1 className="text-2xl font-light tracking-[0.2em] text-stone-100 uppercase font-serif mb-1">
            Maison Vie OS
          </h1>
          <p className="text-[10px] uppercase tracking-[0.35em] text-stone-600">
            Restaurant Management System
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-[#111111] border border-white/5 shadow-2xl p-8 md:p-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-[1px] flex-1 bg-white/5" />
            <span className="text-[9px] uppercase tracking-[0.3em] text-stone-600">Xác thực hệ thống</span>
            <div className="h-[1px] flex-1 bg-white/5" />
          </div>

          {errorMsg && (
            <div className="mb-6 px-4 py-3 bg-red-950/40 border border-red-500/20 text-red-400 text-[12px] leading-relaxed">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.25em] text-stone-500 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full bg-black/60 border border-white/8 text-stone-200 px-4 py-3 text-sm focus:outline-none focus:border-gold-500/50 transition-all placeholder-stone-700"
                placeholder="email@maisonvie.vn"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-[0.25em] text-stone-500 mb-2">
                Mật khẩu
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full bg-black/60 border border-white/8 text-stone-200 px-4 py-3 text-sm focus:outline-none focus:border-gold-500/50 transition-all placeholder-stone-700"
                placeholder="••••••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full mt-2 bg-gold-500/10 border border-gold-500/30 text-gold-400 text-[11px] uppercase tracking-[0.3em] py-4 hover:bg-gold-500/20 hover:border-gold-500/50 transition-all disabled:opacity-40 disabled:cursor-not-allowed font-semibold"
            >
              {status === "loading" ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-3 h-3 border border-gold-500/50 border-t-gold-500 rounded-full animate-spin" />
                  Đang xác thực...
                </span>
              ) : "Đăng nhập"}
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-8 pt-6 border-t border-white/5">
            <p className="text-[10px] text-stone-700 text-center leading-relaxed">
              Hệ thống nội bộ · Yêu cầu xác thực 2 lớp<br />
              Mọi phiên đăng nhập đều được ghi nhật ký
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[9px] text-stone-700 mt-6 tracking-wider uppercase">
          Maison Vie OS v2.6.0 · Fine Dining Operating Standard
        </p>
      </div>
    </div>
  );
}

export default function CrmLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#080808] flex items-center justify-center text-gold-500 text-sm tracking-widest uppercase">
        Đang tải...
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
