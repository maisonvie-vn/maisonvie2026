"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { QRCodeSVG } from "qrcode.react";
import { Suspense } from "react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function SetupTotpContent() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") || "/crm";

  const [step, setStep] = useState("loading"); // loading | qr | verify | done
  const [factorId, setFactorId] = useState(null);
  const [qrUri, setQrUri] = useState("");
  const [secret, setSecret] = useState("");
  const [code, setCode] = useState("");
  const [challengeId, setChallengeId] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    enrollTotp();
  }, []);

  const enrollTotp = async () => {
    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: "totp",
      friendlyName: "Maison Vie CRM",
    });

    if (error) {
      setErrorMsg("Không thể thiết lập TOTP: " + error.message);
      setStep("error");
      return;
    }

    setFactorId(data.id);
    setQrUri(data.totp.qr_code);
    setSecret(data.totp.secret);
    setStep("qr");
  };

  const startVerify = async () => {
    const { data, error } = await supabase.auth.mfa.challenge({ factorId });
    if (error) { setErrorMsg(error.message); return; }
    setChallengeId(data.id);
    setStep("verify");
  };

  const verifyAndFinish = async () => {
    if (!code || code.length < 6) return;
    setErrorMsg("");

    const { error } = await supabase.auth.mfa.verify({ factorId, challengeId, code });
    if (error) {
      setErrorMsg("Mã không đúng. Hãy kiểm tra lại Authenticator App.");
      return;
    }

    setStep("done");
    setTimeout(() => router.push(redirect), 1500);
  };

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:80px_80px]" />

      <div className="relative w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 border border-gold-500/20 bg-gold-500/5 mb-6">
            <span className="text-gold-500 text-2xl">🛡</span>
          </div>
          <h1 className="text-2xl font-light tracking-[0.2em] text-stone-100 uppercase font-serif mb-1">
            Thiết Lập Bảo Mật
          </h1>
          <p className="text-[10px] uppercase tracking-[0.3em] text-stone-600">
            Xác thực 2 lớp · Authenticator App
          </p>
        </div>

        <div className="bg-[#111111] border border-white/5 shadow-2xl p-8 md:p-10">

          {step === "loading" && (
            <div className="text-center py-8">
              <div className="w-6 h-6 border border-gold-500/50 border-t-gold-500 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-stone-500 text-sm">Đang tạo mã QR...</p>
            </div>
          )}

          {step === "qr" && (
            <>
              <p className="text-stone-300 text-[13px] leading-relaxed mb-6 text-center">
                Mở <strong className="text-gold-400">Google Authenticator</strong> hoặc <strong className="text-gold-400">Authy</strong>, 
                chọn <em>"Thêm tài khoản"</em> rồi quét mã QR bên dưới:
              </p>

              <div className="flex justify-center mb-6">
                <div className="p-4 bg-white inline-block">
                  <QRCodeSVG value={qrUri} size={180} />
                </div>
              </div>

              <div className="mb-6 bg-black/40 border border-white/5 p-4">
                <p className="text-[10px] uppercase tracking-widest text-stone-600 mb-1">Nhập tay nếu không quét được:</p>
                <p className="text-gold-400 font-mono text-sm tracking-widest break-all">{secret}</p>
              </div>

              <button
                onClick={startVerify}
                className="w-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-[11px] uppercase tracking-[0.3em] py-4 hover:bg-gold-500/20 transition-all font-semibold"
              >
                Đã quét xong → Tiếp tục
              </button>
            </>
          )}

          {step === "verify" && (
            <>
              <p className="text-stone-300 text-[13px] text-center mb-6">
                Nhập mã 6 số từ Authenticator App để xác nhận:
              </p>

              {errorMsg && (
                <div className="mb-4 px-4 py-3 bg-red-950/40 border border-red-500/20 text-red-400 text-[12px] text-center">
                  {errorMsg}
                </div>
              )}

              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                className="w-full text-center text-3xl font-mono tracking-[0.5em] text-gold-400 bg-black/60 border border-white/10 focus:border-gold-500/60 focus:outline-none py-4 mb-5 transition-all"
                placeholder="000000"
                autoFocus
              />

              <button
                onClick={verifyAndFinish}
                disabled={code.length < 6}
                className="w-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-[11px] uppercase tracking-[0.3em] py-4 hover:bg-gold-500/20 transition-all font-semibold disabled:opacity-30"
              >
                Xác nhận & Kích hoạt
              </button>
            </>
          )}

          {step === "done" && (
            <div className="text-center py-8">
              <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">✓</div>
              <p className="text-emerald-400 font-semibold mb-2">Xác thực 2 lớp đã được kích hoạt!</p>
              <p className="text-stone-500 text-sm">Đang chuyển vào CRM...</p>
            </div>
          )}

          {step === "error" && (
            <div className="text-center py-6">
              <p className="text-red-400 text-sm mb-4">{errorMsg}</p>
              <button onClick={() => router.push("/crm/login")} className="text-gold-500 text-sm underline">
                Quay lại đăng nhập
              </button>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-white/5">
            <p className="text-[10px] text-stone-700 text-center leading-relaxed">
              Lưu mã recovery ở nơi an toàn · Không chia sẻ mã QR này<br />
              Yêu cầu thiết lập 1 lần duy nhất
            </p>
          </div>
        </div>

        <p className="text-center text-[9px] text-stone-700 mt-6 tracking-wider uppercase">
          Maison Vie OS · Protected by TOTP 2FA
        </p>
      </div>
    </div>
  );
}

export default function SetupTotpPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#080808] flex items-center justify-center text-gold-500 text-sm tracking-widest uppercase">
        Đang tải...
      </div>
    }>
      <SetupTotpContent />
    </Suspense>
  );
}
