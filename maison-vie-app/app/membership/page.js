"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { COUNTRY_CODES } from "../../lib/countryCodes";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const I18N = {
  vi: {
    title: "Thành Viên VIP & Đặc Quyền",
    subtitle: "Maison Vie Private Club — Nơi khởi nguồn của những đặc quyền thượng lưu",
    desc: "Chào mừng quý khách đến với chương trình hội viên riêng tư của Maison Vie. Được thiết kế dành riêng cho những thực khách sành ẩm thực nhất, mang đến hành trình trải nghiệm được cá nhân hóa tuyệt đối.",
    silverTitle: "Thẻ Bạc · Silver Privilege",
    silverReq: "Chi tiêu tích lũy từ 10.000.000 đ",
    silverB1: "Tích lũy điểm thưởng 5% cho mỗi hóa đơn dùng bữa.",
    silverB2: "Tặng bánh tráng miệng Soufflé sinh nhật đặc biệt chế biến tại bàn bởi Bếp trưởng.",
    silverB3: "Ưu tiên xếp bàn trống trong ngày khi đặt chỗ trước 2 tiếng.",
    goldTitle: "Thẻ Vàng · Gold Elite",
    goldReq: "Chi tiêu tích lũy từ 50.000.000 đ",
    goldB1: "Tất cả quyền lợi Thẻ Bạc với tỷ lệ tích lũy điểm thưởng tăng lên 8%.",
    goldB2: "Miễn phí đặt các Phòng VIP riêng tư như Salon Privé hoặc Le Jardin.",
    goldB3: "Nhận lời mời tham dự các sự kiện thử rượu vang kín (Private Wine Tasting) cùng chuyên gia.",
    goldB4: "Ưu tiên giữ chỗ sảnh chính trong các ngày lễ lớn (Valentine, Giáng Sinh, Tết).",
    platTitle: "Confidential Platinum",
    platReq: "Thư mời tuyệt mật riêng tư từ Ban Giám Đốc",
    platB1: "Quyền lợi bảo mật thông tin tối đa theo Nghị định 13 với cơ chế mã hóa riêng biệt.",
    platB2: "Lối đi riêng tư bảo mật (Backdoor Entrance) không tiếp xúc đám đông.",
    platB3: "Tặng riêng tủ bảo quản rượu vang cá nhân mã hóa đặt tại hầm rượu chính.",
    platB4: "Quản gia ẩm thực riêng (Dedicated Butler) chăm sóc mọi chi tiết nhỏ nhất trong bữa tiệc.",
    platB5: "Thiết kế thực đơn cá nhân hóa trọn vẹn theo khẩu vị và chỉ định sức khỏe của cá nhân.",
    formTitle: "Đăng Ký Hội Viên Private Club",
    formSubtitle: "Mở khóa những đặc quyền ẩm thực tối thượng ngay hôm nay",
    labelName: "Họ và Tên",
    labelPhone: "Số Điện Thoại",
    labelEmail: "Địa Chỉ Email",
    labelAllergen: "Sở thích ăn uống / Chất dị ứng cần tránh (Nếu có)",
    labelConsent: "Tôi đồng ý cung cấp thông tin cá nhân và cho phép Maison Vie xử lý bảo mật phục vụ trải nghiệm ẩm thực VIP theo đúng Nghị định 13/2023/NĐ-CP.",
    btnSubmit: "Gửi Yêu Cầu Kích Hoạt Hội Viên",
    loading: "Đang xử lý thông tin hội viên...",
    successTitle: "Chào mừng hội viên mới!",
    successMsg: "Maison Vie xin chân thành cảm ơn quý khách. Hồ sơ hội viên VIP của quý khách đã được tạo thành công và gửi thông tin xác nhận qua email/SMS. Lễ tân sẽ sớm liên hệ trực tiếp.",
    successUpdateMsg: "Cảm ơn quý khách đã cập nhật hồ sơ hội viên VIP thành công. Thông tin thay đổi đã được ghi nhận trên cơ sở dữ liệu an toàn của chúng tôi.",
    errorTitle: "Đăng ký thất bại",
    errorMsg: "Hệ thống gặp sự cố kết nối. Vui lòng liên hệ Hotline +84 904150383 để được hỗ trợ trực tiếp.",
    mustConsent: "Vui lòng đồng ý với các điều khoản bảo mật dữ liệu Nghị định 13 để tiếp tục.",
  },
  en: {
    title: "VIP Membership & Privileges",
    subtitle: "Maison Vie Private Club — Where elite culinary journeys begin",
    desc: "Welcome to the exclusive circle of Maison Vie. Tailored for the most discerning gourmands, our membership offers a pathway to unprecedented personalized experiences and absolute discretion.",
    silverTitle: "Silver Privilege",
    silverReq: "Accumulated spent from 10,000,000 VND",
    silverB1: "Earn 5% reward points on every dining invoice.",
    silverB2: "Complimentary Chef's signature Birthday Soufflé prepared table-side.",
    silverB3: "Priority seating for same-day bookings made 2 hours in advance.",
    goldTitle: "Gold Elite",
    goldReq: "Accumulated spent from 50,000,000 VND",
    goldB1: "All Silver benefits with reward points accumulation increased to 8%.",
    goldB2: "Complimentary room booking for Private VIP rooms (Salon Privé, Le Jardin).",
    goldB3: "Exclusive invitations to Private Wine Tastings with top sommeliers.",
    goldB4: "Priority booking during major holidays (Valentine, Christmas, NYE).",
    platTitle: "Confidential Platinum",
    platReq: "By invitation only from the Board of Directors",
    platB1: "Absolute confidentiality under Decree 13 with specialized encryption.",
    platB2: "Private Backdoor Entrance to bypass main public dining halls.",
    platB3: "Personalized, encrypted wine cellar cabinet for your private collection.",
    platB4: "A Dedicated butler to look after every detail of your dining sessions.",
    platB5: "Tailor-made menus designed exclusively around your dietary needs.",
    formTitle: "Private Club Membership Registration",
    formSubtitle: "Unlock ultimate dining privileges starting today",
    labelName: "Full Name",
    labelPhone: "Phone Number",
    labelEmail: "Email Address",
    labelAllergen: "Dietary Preferences / Allergens to avoid (If any)",
    labelConsent: "I agree to provide my personal details and authorize Maison Vie to securely process my data for VIP culinary experiences in accordance with Decree 13/2023/NĐ-CP.",
    btnSubmit: "Submit Activation Request",
    loading: "Activating VIP membership...",
    successTitle: "Welcome to the Private Club!",
    successMsg: "Thank you. Your VIP membership profile has been created successfully. A confirmation message has been sent. Our coordinator will contact you shortly.",
    successUpdateMsg: "Thank you. Your VIP membership profile has been updated successfully on our secure database.",
    errorTitle: "Registration Failed",
    errorMsg: "Database connection failed. Please try again or call our hotline: +84 904150383.",
    mustConsent: "You must accept the privacy terms under Decree 13 to proceed.",
    mustConsent: "Please check the Decree 13 consent box to continue.",
  }
};

function MembershipContent() {
  const searchParams = useSearchParams();
  const lang = searchParams.get("lang") || "vi";
  const t = I18N[lang] || I18N.vi;

  const [allergens, setAllergens] = useState([]);
  const [selectedAllergens, setSelectedAllergens] = useState([]);
  const [activeTier, setActiveTier] = useState(1); // Default to Gold Elite
  
  const [form, setForm] = useState({
    name: "",
    phone: "",
    countryCode: "+84",
    email: "",
    consent: false
  });
  const [status, setStatus] = useState("idle"); // idle, loading, success, success_update, error
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch allergens to allow accurate profile tagging
  useEffect(() => {
    async function loadAllergens() {
      try {
        const { data, error } = await supabase
          .from("allergen_categories")
          .select("id, code, name");
        if (!error && data) {
          setAllergens(data);
        }
      } catch (err) {
        console.error("Allergen categories load error:", err);
      }
    }
    loadAllergens();
  }, []);

  const handleInput = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleAllergenCheck = (id) => {
    setSelectedAllergens((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const normalizePhone = (code, phone) => {
    let cleaned = phone.replace(/\D/g, "");
    if (cleaned.startsWith("0")) {
      cleaned = cleaned.substring(1);
    }
    return code + cleaned;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.consent) {
      alert(t.mustConsent);
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const fullPhone = normalizePhone(form.countryCode, form.phone);

      // Check if customer exists
      const { data: customerExists, error: searchErr } = await supabase
        .from("customers")
        .select("id")
        .eq("phone", fullPhone)
        .maybeSingle();

      if (searchErr) throw searchErr;

      if (customerExists) {
        // Update customer profile
        const { error: updateErr } = await supabase
          .from("customers")
          .update({
            full_name: form.name,
            email: form.email || null,
            allergen_pref: selectedAllergens,
            consent_at: new Date().toISOString()
          })
          .eq("id", customerExists.id);

        if (updateErr) throw updateErr;
        setStatus("success_update");
      } else {
        // Create new customer profile
        const { error: insertErr } = await supabase
          .from("customers")
          .insert({
            full_name: form.name,
            phone: fullPhone,
            email: form.email || null,
            vip_level: activeTier === 2 ? 3 : activeTier === 1 ? 2 : 1, // Silver=1, Gold=2, Plat=3
            allergen_pref: selectedAllergens,
            consent_at: new Date().toISOString()
          });

        if (insertErr) throw insertErr;
        setStatus("success");
      }

      // Reset form
      setForm({
        name: "",
        phone: "",
        countryCode: "+84",
        email: "",
        consent: false
      });
      setSelectedAllergens([]);
    } catch (err) {
      console.error("VIP signup error:", err);
      setStatus("error");
      setErrorMessage(err.message || "");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-dark-500 font-sans selection:bg-gold-500 selection:text-dark-500">
      
      {/* HEADER */}
      <Header lang={lang} />

      {/* HERO SECTION */}
      <section className="relative py-28 text-center overflow-hidden bg-dark-400 border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-dark-300 via-dark-500 to-black opacity-80" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(197,165,90,0.02)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(197,165,90,0.02)_1px,_transparent_1px)] bg-[size:80px_80px] pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <span className="text-[10px] uppercase tracking-[0.45em] text-gold-500 font-semibold mb-6 block animate-fade-in">
            Maison Vie Private Club · L'Exclusivité
          </span>
          <h1 className="text-5xl md:text-7xl font-light tracking-tight text-stone-100 font-luxury mb-6 animate-fade-in">
            {t.title}
          </h1>
          <div className="w-16 h-[1px] bg-gold-500 mx-auto mb-8" />
          <p className="text-stone-300 font-light text-lg max-w-3xl mx-auto leading-relaxed">
            {t.desc}
          </p>
        </div>
      </section>

      {/* VIP CARD SLIDER / TIER GRID */}
      <section className="py-24 bg-dark-500">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* SILVER TIER CARD */}
            <div 
              onClick={() => setActiveTier(0)}
              className={`glassmorphism p-8 border rounded-lg flex flex-col text-left transition-all duration-500 cursor-pointer relative overflow-hidden ${
                activeTier === 0 
                  ? "border-amber-500/50 shadow-[0_0_30px_rgba(217,119,6,0.15)] scale-[1.02]" 
                  : "border-white/5 hover:border-amber-500/25 opacity-70 hover:opacity-90"
              }`}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-bl-full flex items-center justify-center font-luxury font-bold text-amber-500 text-3xl opacity-30">
                S
              </div>
              <span className="text-amber-500 uppercase tracking-widest text-[10px] font-bold block mb-1">VIP Level 1</span>
              <h3 className="text-2xl font-light font-luxury text-stone-100 mb-2">{t.silverTitle}</h3>
              <p className="text-[10px] uppercase tracking-wider text-stone-500 mb-6 border-b border-white/5 pb-4">
                {t.silverReq}
              </p>
              <ul className="space-y-4 text-xs font-light text-stone-300 flex-1">
                <li className="flex gap-2">
                  <span className="text-amber-500">✦</span>
                  <span>{t.silverB1}</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-500">✦</span>
                  <span>{t.silverB2}</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-500">✦</span>
                  <span>{t.silverB3}</span>
                </li>
              </ul>
            </div>

            {/* GOLD TIER CARD */}
            <div 
              onClick={() => setActiveTier(1)}
              className={`glassmorphism p-8 border rounded-lg flex flex-col text-left transition-all duration-500 cursor-pointer relative overflow-hidden ${
                activeTier === 1 
                  ? "border-gold-500 shadow-[0_0_35px_rgba(197,165,90,0.25)] scale-[1.03]" 
                  : "border-white/5 hover:border-gold-500/30 opacity-70 hover:opacity-90"
              }`}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gold-500/10 rounded-bl-full flex items-center justify-center font-luxury font-bold text-gold-500 text-3xl">
                G
              </div>
              <span className="text-gold-500 uppercase tracking-widest text-[10px] font-bold block mb-1">VIP Level 2</span>
              <h3 className="text-2xl font-light font-luxury text-stone-100 mb-2">{t.goldTitle}</h3>
              <p className="text-[10px] uppercase tracking-wider text-stone-500 mb-6 border-b border-white/5 pb-4">
                {t.goldReq}
              </p>
              <ul className="space-y-4 text-xs font-light text-stone-300 flex-1">
                <li className="flex gap-2">
                  <span className="text-gold-500">✦</span>
                  <span>{t.goldB1}</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-gold-500">✦</span>
                  <span>{t.goldB2}</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-gold-500">✦</span>
                  <span>{t.goldB3}</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-gold-500">✦</span>
                  <span>{t.goldB4}</span>
                </li>
              </ul>
            </div>

            {/* PLATINUM TIER CARD */}
            <div 
              onClick={() => setActiveTier(2)}
              className={`glassmorphism p-8 border rounded-lg flex flex-col text-left transition-all duration-500 cursor-pointer relative overflow-hidden ${
                activeTier === 2 
                  ? "border-rose-500/50 shadow-[0_0_30px_rgba(244,63,94,0.15)] scale-[1.02]" 
                  : "border-white/5 hover:border-rose-500/25 opacity-70 hover:opacity-90"
              }`}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-bl-full flex items-center justify-center font-luxury font-bold text-rose-500 text-3xl opacity-30">
                P
              </div>
              <span className="text-rose-400 uppercase tracking-widest text-[10px] font-bold block mb-1">VIP Level 3</span>
              <h3 className="text-2xl font-light font-luxury text-stone-100 mb-2">{t.platTitle}</h3>
              <p className="text-[10px] uppercase tracking-wider text-stone-500 mb-6 border-b border-white/5 pb-4">
                {t.platReq}
              </p>
              <ul className="space-y-4 text-xs font-light text-stone-300 flex-1">
                <li className="flex gap-2">
                  <span className="text-rose-400">✦</span>
                  <span>{t.platB1}</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-rose-400">✦</span>
                  <span>{t.platB2}</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-rose-400">✦</span>
                  <span>{t.platB3}</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-rose-400">✦</span>
                  <span>{t.platB4}</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-rose-400">✦</span>
                  <span>{t.platB5}</span>
                </li>
              </ul>
            </div>

          </div>

        </div>
      </section>

      {/* MEMBERSHIP REGISTRATION FORM */}
      <section className="py-24 bg-dark-400 border-t border-white/5 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-dark-300 via-dark-500 to-black opacity-95" />
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-[10px] uppercase tracking-[0.35em] text-gold-500 font-semibold mb-3 block">
              Maison Vie VIP Club
            </span>
            <h2 className="text-4xl md:text-5xl font-light tracking-tight text-stone-100 font-luxury">
              {t.formTitle}
            </h2>
            <p className="text-stone-400 text-sm font-light mt-4">
              {t.formSubtitle}
            </p>
          </div>

          <div className="glassmorphism p-8 md:p-12 border border-white/5 rounded-lg shadow-2xl">
            {status === "success" || status === "success_update" ? (
              <div className="text-center py-10 animate-fade-in">
                <div className="w-16 h-16 rounded-full border-2 border-gold-500 text-gold-500 flex items-center justify-center text-3xl mx-auto mb-6">
                  ✓
                </div>
                <h3 className="text-2xl font-light font-luxury text-gold-500 mb-4">{t.successTitle}</h3>
                <p className="text-stone-300 font-light max-w-md mx-auto leading-relaxed">
                  {status === "success" ? t.successMsg : t.successUpdateMsg}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 text-left">
                
                {status === "error" && (
                  <div className="bg-red-950/20 border border-red-500/50 p-4 rounded text-xs text-red-200">
                    <strong>{t.errorTitle}</strong>: {errorMessage || t.errorMsg}
                  </div>
                )}

                {/* Name */}
                <div className="flex flex-col">
                  <label className="text-[10px] uppercase tracking-wider text-stone-400 mb-2 font-semibold">
                    {t.labelName} *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={form.name}
                    onChange={handleInput}
                    className="bg-black/40 border border-white/5 focus:border-gold-500/50 px-4 py-3 rounded text-sm text-stone-200 outline-none transition-premium"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Phone */}
                  <div className="flex flex-col">
                    <label className="text-[10px] uppercase tracking-wider text-stone-400 mb-2 font-semibold">
                      {t.labelPhone} *
                    </label>
                    <div className="flex">
                      <select
                        name="countryCode"
                        value={form.countryCode}
                        onChange={handleInput}
                        className="bg-black/50 border border-white/5 border-r-0 px-3 py-3 rounded-l text-xs text-stone-400 focus:outline-none"
                      >
                        {COUNTRY_CODES.map((c) => (
                          <option key={c.code} value={c.dial_code} className="bg-dark-400 text-stone-300">
                            {c.code} ({c.dial_code})
                          </option>
                        ))}
                      </select>
                      <input
                        type="tel"
                        name="phone"
                        required
                        placeholder="09xx xxx xxx"
                        value={form.phone}
                        onChange={handleInput}
                        className="bg-black/40 border border-white/5 flex-1 px-4 py-3 rounded-r text-sm text-stone-200 outline-none focus:border-gold-500/50 transition-premium"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex flex-col">
                    <label className="text-[10px] uppercase tracking-wider text-stone-400 mb-2 font-semibold">
                      {t.labelEmail}
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="vip@maisonvie.vn"
                      value={form.email}
                      onChange={handleInput}
                      className="bg-black/40 border border-white/5 focus:border-gold-500/50 px-4 py-3 rounded text-sm text-stone-200 outline-none transition-premium"
                    />
                  </div>
                </div>

                {/* Allergen Preferences */}
                {allergens.length > 0 && (
                  <div className="flex flex-col">
                    <label className="text-[10px] uppercase tracking-wider text-stone-400 mb-3 font-semibold">
                      {t.labelAllergen}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-black/20 border border-white/5 rounded">
                      {allergens.map((alg) => {
                        const isChecked = selectedAllergens.includes(alg.id);
                        const transName = alg.name[lang] || alg.name.vi;
                        return (
                          <label key={alg.id} className="flex items-center space-x-2.5 text-xs text-stone-300 cursor-pointer hover:text-gold-500 transition-premium">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleAllergenCheck(alg.id)}
                              className="accent-gold-500 w-4 h-4 cursor-pointer"
                            />
                            <span>{transName}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Consent Checkbox */}
                <div className="flex items-start space-x-3 pt-2">
                  <input
                    type="checkbox"
                    id="consent"
                    name="consent"
                    required
                    checked={form.consent}
                    onChange={handleInput}
                    className="accent-gold-500 w-5 h-5 cursor-pointer mt-0.5 shrink-0"
                  />
                  <label htmlFor="consent" className="text-xs text-stone-400 leading-relaxed cursor-pointer hover:text-stone-300 transition-premium">
                    {t.labelConsent}
                  </label>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full text-center text-[12px] uppercase tracking-widest font-semibold bg-gold-500 text-dark-500 py-4 hover:bg-gold-400 hover:scale-[1.01] transition-premium shadow-[0_0_15px_rgba(197,165,90,0.15)] cursor-pointer disabled:opacity-55"
                >
                  {status === "loading" ? t.loading : t.btnSubmit}
                </button>

              </form>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer lang={lang} />

    </div>
  );
}

export default function MembershipPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-dark-500 text-gold-500 tracking-widest text-sm uppercase">
        Loading...
      </div>
    }>
      <MembershipContent />
    </Suspense>
  );
}
