"use client";

import { useRouter } from "next/navigation";

export default function CrmUnauthorizedPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center px-4 relative">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:80px_80px]" />
      <div className="relative text-center max-w-md">
        <div className="inline-flex items-center justify-center w-16 h-16 border border-red-500/20 bg-red-500/5 mb-8">
          <span className="text-3xl">🚫</span>
        </div>
        <h1 className="text-2xl font-light tracking-[0.15em] text-stone-100 uppercase font-serif mb-3">
          Không có quyền truy cập
        </h1>
        <p className="text-[11px] uppercase tracking-[0.3em] text-stone-600 mb-6">
          403 · Access Unauthorized
        </p>
        <p className="text-stone-400 text-sm leading-relaxed mb-8">
          Tài khoản của bạn không có quyền truy cập vào khu vực này.<br />
          Liên hệ Admin để được cấp quyền phù hợp.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => router.back()}
            className="text-[11px] uppercase tracking-widest text-stone-500 hover:text-stone-300 border border-white/5 px-5 py-2.5 hover:border-white/10 transition-all"
          >
            ← Quay lại
          </button>
          <button
            onClick={() => router.push("/crm")}
            className="text-[11px] uppercase tracking-widest text-gold-400 border border-gold-500/20 bg-gold-500/5 px-5 py-2.5 hover:bg-gold-500/10 transition-all"
          >
            Dashboard CRM
          </button>
        </div>
      </div>
    </div>
  );
}
