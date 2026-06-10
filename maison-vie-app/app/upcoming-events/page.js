"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { COUNTRY_CODES } from "../../lib/countryCodes";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const EVENTS = [
  {
    id: "bordeaux-2026",
    date: "30/05/2026",
    day: "Thứ Sáu",
    time: "19:30 – 22:30",
    tag: "Dégustation",
    title: "Đêm Rượu Vang Bordeaux 2026",
    titleFr: "Soirée Bordeaux Grand Cru 2026",
    desc: "Hành trình khám phá 6 Grand Cru Classé từ vùng Bordeaux — Médoc, Saint-Émilion, Pomerol — được tuyển chọn trực tiếp bởi Sommelier Maison Vie từ các nhà sản xuất danh tiếng nhất. Mỗi chai vang được ghép cặp với 6 món ăn Pháp tương ứng do Bếp trưởng Joel thiết kế riêng cho đêm tiệc.",
    capacity: 40,
    priceDisplay: "3.800.000 đ / người",
    includes: ["6 Grand Cru Classé Bordeaux", "6 món ăn Pháp ghép cặp", "Sách ghi chú rượu vang", "Gặp gỡ Bếp trưởng Joel sau tiệc"],
    image: "https://i.postimg.cc/xdbkdNyx/Pan-Seared-Vietnamese-Seabass-Broccoli-Green-Mango-Pickles.webp",
    status: "open",
    accentColor: "text-purple-400",
    accentBg: "bg-purple-950/30 border-purple-500/30",
  },
  {
    id: "valentine-2026",
    date: "14/06/2026",
    day: "Chủ Nhật",
    time: "18:00 – 22:00",
    tag: "Dîner Romantique",
    title: "Dîner Saint-Valentin — Tình Nhân 2026",
    titleFr: "La Nuit de l'Amour à Maison Vie",
    desc: "Một đêm thơ mộng dành riêng cho các cặp đôi: Bàn ăn trang trí hoa hồng đỏ và nến vàng, Set Menu 7 món đặc sắc mang chủ đề tình yêu, champagne khai mạc Taittinger, và biểu diễn đàn piano acoustic trực tiếp trong suốt bữa ăn.",
    capacity: 28,
    priceDisplay: "5.200.000 đ / cặp",
    includes: ["Champagne Taittinger đón khách", "Set Menu 7 món chủ đề tình yêu", "Trang trí bàn riêng hoa hồng đỏ & nến", "Đàn piano acoustic trực tiếp", "Bánh tráng miệng Soufflé theo yêu cầu"],
    image: "https://i.postimg.cc/Hxd7PsXQ/Warm-Seasonal-Souffle-Vanilla-Ice-Cream.png",
    status: "open",
    accentColor: "text-rose-400",
    accentBg: "bg-rose-950/30 border-rose-500/30",
  },
  {
    id: "gala-b2b",
    date: "02/06/2026",
    day: "Thứ Hai",
    time: "12:00 – 15:00 (Trưa) · 19:00 – 22:00 (Tối)",
    tag: "Gala B2B",
    title: "Tiệc Gala Doanh Nghiệp & Lữ Hành",
    titleFr: "Gala Corporatif — Partenaires Vietravel & B2B",
    desc: "Sự kiện kết nối doanh nghiệp dành riêng cho đại lý lữ hành cao cấp, đối tác chiến lược và doanh nghiệp FDI tại Hà Nội. Set Menu Prestige 6 món, không gian riêng biệt Tầng 2 và Phòng VIP Le Jardin, hóa đơn VAT doanh nghiệp đầy đủ.",
    capacity: 120,
    priceDisplay: "Liên hệ báo giá",
    includes: ["Không gian riêng Tầng 2 + VIP Le Jardin", "Set Menu Prestige 6 món", "Open bar rượu vang Pháp 2 giờ", "Hóa đơn VAT xuất theo doanh nghiệp", "Hỗ trợ MC song ngữ Pháp-Việt"],
    image: "https://i.postimg.cc/vZngY6zs/Vietnamese-Buffalo-Wellington-Mushroom-Duxelles-Phu-Quoc-Pepper-Jus.png",
    status: "limited",
    accentColor: "text-blue-400",
    accentBg: "bg-blue-950/30 border-blue-500/30",
  },
];

const GALLERY_MOMENTS = [
  { src: "https://i.postimg.cc/CKgbq4PL/Anh-Truoc.webp", label: "Mặt tiền biệt thự", span: "col-span-2 row-span-2" },
  { src: "https://i.postimg.cc/HxPJB02F/Tang-1.webp", label: "Sảnh chính Tầng 1", span: "" },
  { src: "https://i.postimg.cc/3NskHKzK/VIP-1.webp", label: "Phòng VIP Salon Privé", span: "" },
  { src: "https://i.postimg.cc/cLNhNYqM/Vip-2.webp", label: "Le Jardin", span: "" },
  { src: "https://i.postimg.cc/qR7hsD8d/Bep.webp", label: "Gian bếp mở", span: "" },
];

const normalizePhone = (code, phone) => {
  let cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("0")) {
    cleaned = cleaned.substring(1);
  }
  return code + cleaned;
};

function UpcomingEventsContent() {
  const router = useRouter();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [regForm, setRegForm] = useState({ name: "", phone: "", countryCode: "+84", email: "", guests: 2, notes: "" });
  const [regStatus, setRegStatus] = useState("idle");
  const [notifyEmail, setNotifyEmail] = useState("");
  const [notifyStatus, setNotifyStatus] = useState("idle");
  const [lang, setLang] = useState("vi");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlLang = new URLSearchParams(window.location.search).get("lang") || "vi";
      setLang(urlLang);
    }
  }, []);

  const handleRegInput = (e) => {
    const { name, value } = e.target;
    setRegForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegStatus("loading");
    try {
      const event = EVENTS.find((ev) => ev.id === selectedEvent);
      const fullPhone = normalizePhone(regForm.countryCode, regForm.phone);

      const { data: customerData } = await supabase
        .from("customers")
        .select("id")
        .eq("phone", fullPhone)
        .maybeSingle();

      let customerId = customerData?.id;
      if (!customerId) {
        const { data: newCust } = await supabase
          .from("customers")
          .insert({
            full_name: regForm.name,
            phone: fullPhone,
            email: regForm.email || null,
            vip_level: 1,
            consent_at: new Date().toISOString(),
          })
          .select("id")
          .single();
        customerId = newCust?.id;
      }

      await supabase.from("reservations").insert({
        customer_id: customerId,
        guest_name: regForm.name,
        guest_phone: fullPhone,
        guest_email: regForm.email || null,
        guest_count: parseInt(regForm.guests),
        booking_date: event?.date?.split("/").reverse().join("-") || new Date().toISOString().split("T")[0],
        booking_time: "19:00:00",
        notes: `[SỰ KIỆN: ${event?.title}] ${regForm.notes}`,
        language: "vi",
        status: "pending",
      });

      if (regForm.email) {
        await fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: regForm.email,
            subject: `Maison Vie - Xác nhận đăng ký: ${event?.title}`,
            type: "booking_pending",
            lang: "vi",
            data: { guestName: regForm.name, guestPhone: fullPhone, guestCount: regForm.guests, bookingDate: event?.date, bookingTime: "19:00" },
          }),
        });
      }

      setRegStatus("success");
      setRegForm({ name: "", phone: "", countryCode: "+84", email: "", guests: 2, notes: "" });
    } catch (err) {
      console.error(err);
      setRegStatus("error");
    }
  };

  const handleNotify = (e) => {
    e.preventDefault();
    setNotifyStatus("success");
    setTimeout(() => setNotifyStatus("idle"), 3000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-dark-500 font-sans">

      {/* HEADER */}
      <Header lang={lang} setLang={setLang} />

      {/* HERO */}
      <section className="relative py-28 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-dark-300 to-dark-500" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(197,165,90,0.02)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(197,165,90,0.02)_1px,_transparent_1px)] bg-[size:60px_60px] pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <span className="text-[10px] uppercase tracking-[0.45em] text-gold-500 font-semibold mb-6 block">
            Les Événements à Venir · Maison Vie 2026
          </span>
          <h1 className="text-5xl md:text-7xl font-light tracking-tight text-stone-100 font-luxury mb-6">
            Sự Kiện <span className="text-gold-500 italic">Sắp Tới</span>
          </h1>
          <div className="w-16 h-[1px] bg-gold-500 mx-auto mb-8" />
          <p className="text-stone-300 font-light text-lg max-w-2xl mx-auto leading-relaxed">
            Những đêm ẩm thực đặc biệt, tối rượu vang văn hóa và tiệc gala doanh nghiệp được tổ chức tại biệt thự Maison Vie — nơi mỗi sự kiện là một tác phẩm nghệ thuật được dàn dựng hoàn hảo.
          </p>
        </div>
      </section>

      {/* EVENTS LIST */}
      <section className="py-20 bg-dark-400 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[10px] uppercase tracking-[0.35em] text-gold-500 font-semibold block mb-4">Agenda</span>
            <h2 className="text-4xl font-light text-stone-100 font-luxury">Lịch Sự Kiện Tháng 5–6 / 2026</h2>
          </div>

          <div className="space-y-8">
            {EVENTS.map((event) => (
              <div
                key={event.id}
                className={`group relative overflow-hidden border transition-premium flex flex-col lg:flex-row ${
                  selectedEvent === event.id
                    ? "border-gold-500/50 shadow-[0_0_30px_rgba(197,165,90,0.12)]"
                    : "border-white/5 hover:border-gold-500/20"
                }`}
              >
                {/* Image */}
                <div className="relative w-full lg:w-80 h-56 lg:h-auto overflow-hidden shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-dark-400 z-10 hidden lg:block" />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-500 to-transparent z-10 lg:hidden" />
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" loading="lazy" />
                  <div className="absolute top-4 left-4 z-20">
                    <span className="text-[9px] uppercase tracking-[0.3em] font-bold text-dark-500 bg-gold-500 px-3 py-1.5">
                      {event.tag}
                    </span>
                  </div>
                  {event.status === "limited" && (
                    <div className="absolute top-4 right-4 z-20">
                      <span className="text-[9px] uppercase tracking-wider font-bold text-amber-400 border border-amber-500/50 bg-black/60 px-2 py-1 animate-pulse">
                        ⚠ Chỗ Có Hạn
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 p-8 bg-dark-400 flex flex-col justify-between">
                  <div>
                    {/* Date badge */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`text-center px-4 py-2 border ${event.accentBg} rounded`}>
                        <div className={`text-2xl font-bold font-luxury ${event.accentColor}`}>
                          {event.date.split("/")[0]}
                        </div>
                        <div className="text-[9px] uppercase tracking-wider text-stone-500">
                          tháng {event.date.split("/")[1]}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase tracking-widest text-stone-500">{event.day}</div>
                        <div className="text-sm text-stone-300 font-light">{event.time}</div>
                        <div className="text-[10px] text-stone-500 mt-1">Tối đa {event.capacity} khách</div>
                      </div>
                    </div>

                    <h3 className="text-2xl font-light text-stone-100 font-luxury mb-1">{event.title}</h3>
                    <p className="text-[11px] italic text-gold-500/70 mb-4 font-light">{event.titleFr}</p>
                    <p className="text-stone-300 text-sm font-light leading-relaxed mb-6">{event.desc}</p>

                    {/* Includes */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
                      {event.includes.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-stone-400">
                          <span className="text-gold-500/70 text-[10px]">✦</span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <div>
                      <span className="text-xl font-semibold text-gold-500 font-luxury">{event.priceDisplay}</span>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedEvent(event.id);
                        setRegStatus("idle");
                        document.getElementById("register-section")?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="text-[11px] uppercase tracking-widest font-semibold bg-gold-500 text-dark-500 px-6 py-3 hover:bg-gold-400 transition-premium"
                    >
                      Đăng Ký Tham Dự
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY — ATMOSPHERE */}
      <section className="py-20 bg-dark-500">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-[10px] uppercase tracking-[0.35em] text-gold-500 font-semibold block mb-4">L'Atmosphère</span>
            <h2 className="text-3xl font-light text-stone-100 font-luxury">Không Gian Tổ Chức Sự Kiện</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-2 gap-3 h-96">
            {GALLERY_MOMENTS.map((img, idx) => (
              <div key={idx} className={`relative overflow-hidden group ${img.span}`}>
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-premium z-10" />
                <img src={img.src} alt={img.label} className="w-full h-full object-cover group-hover:scale-106 transition-all duration-700" loading="lazy" />
                <div className="absolute bottom-3 left-3 z-20">
                  <span className="text-[10px] font-light text-stone-200 italic">{img.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REGISTER FORM */}
      <section id="register-section" className="py-24 bg-dark-400 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-[10px] uppercase tracking-[0.35em] text-gold-500 font-semibold block mb-4">Inscription</span>
            <h2 className="text-4xl font-light text-stone-100 font-luxury mb-4">
              {selectedEvent
                ? <span>Đăng Ký — <span className="text-gold-500">{EVENTS.find(e => e.id === selectedEvent)?.title}</span></span>
                : "Đăng Ký Tham Dự Sự Kiện"}
            </h2>
            {!selectedEvent && (
              <p className="text-stone-500 text-sm">Chọn một sự kiện ở trên hoặc điền thông tin để chúng tôi tư vấn.</p>
            )}
          </div>

          <div className="glassmorphism p-8 border border-gold-500/10 shadow-2xl">
            {regStatus === "success" ? (
              <div className="text-center py-12 animate-fade-in">
                <div className="w-14 h-14 bg-gold-500/20 text-gold-500 rounded-full flex items-center justify-center text-2xl mx-auto mb-6">✓</div>
                <h3 className="text-2xl font-light text-gold-500 font-luxury mb-4">Đăng Ký Thành Công</h3>
                <p className="text-stone-300 leading-relaxed max-w-md mx-auto text-sm">
                  Cảm ơn bạn đã quan tâm đến sự kiện của Maison Vie. Lễ tân sẽ liên hệ xác nhận và hướng dẫn thanh toán trong vòng 24 giờ.
                </p>
                <button onClick={() => { setRegStatus("idle"); setSelectedEvent(null); }}
                  className="mt-8 text-[11px] uppercase tracking-widest font-semibold border border-gold-500/30 text-gold-300 px-6 py-3 hover:bg-gold-500/10 transition-premium">
                  Đăng ký sự kiện khác
                </button>
              </div>
            ) : (
              <form onSubmit={handleRegister} className="space-y-6">
                {/* Event selector */}
                <div className="flex flex-col">
                  <label className="text-[10px] uppercase tracking-widest text-stone-400 mb-2 font-semibold">Sự Kiện Muốn Tham Dự *</label>
                  <select
                    value={selectedEvent || ""}
                    onChange={(e) => setSelectedEvent(e.target.value)}
                    required
                    className="bg-black/40 border border-white/10 text-stone-200 px-4 py-3 focus:outline-none focus:border-gold-500 transition-premium text-sm"
                  >
                    <option value="" disabled>— Chọn sự kiện —</option>
                    {EVENTS.map((ev) => (
                      <option key={ev.id} value={ev.id}>{ev.date} — {ev.title}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col">
                    <label className="text-[10px] uppercase tracking-widest text-stone-400 mb-2 font-semibold">Họ và Tên *</label>
                    <input type="text" name="name" required value={regForm.name} onChange={handleRegInput}
                      className="bg-black/40 border border-white/10 text-stone-200 px-4 py-3 focus:outline-none focus:border-gold-500 transition-premium text-sm" />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] uppercase tracking-widest text-stone-400 mb-2 font-semibold">Số Điện Thoại *</label>
                    <div className="flex bg-black/40 border border-white/10 focus-within:border-gold-500 transition-premium rounded overflow-hidden">
                      <select
                        name="countryCode"
                        value={regForm.countryCode}
                        onChange={handleRegInput}
                        className="bg-black border-r border-white/10 text-stone-200 px-3 py-3 focus:outline-none cursor-pointer text-sm font-sans max-w-[120px]"
                      >
                        {COUNTRY_CODES.map((c, idx) => (
                          <option key={idx} value={c.code} className="bg-dark-500">
                            {c.flag} {c.code}
                          </option>
                        ))}
                      </select>
                      <input 
                        type="tel" 
                        name="phone"
                        required
                        placeholder="776 998 899"
                        value={regForm.phone}
                        onChange={handleRegInput}
                        className="bg-transparent text-stone-200 px-4 py-3 focus:outline-none flex-1 text-sm font-sans w-full"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] uppercase tracking-widest text-stone-400 mb-2 font-semibold">Email</label>
                    <input type="email" name="email" value={regForm.email} onChange={handleRegInput}
                      className="bg-black/40 border border-white/10 text-stone-200 px-4 py-3 focus:outline-none focus:border-gold-500 transition-premium text-sm" />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] uppercase tracking-widest text-stone-400 mb-2 font-semibold">Số Người Tham Dự *</label>
                    <input type="number" name="guests" required min="1" value={regForm.guests} onChange={handleRegInput}
                      className="bg-black/40 border border-white/10 text-stone-200 px-4 py-3 focus:outline-none focus:border-gold-500 transition-premium text-sm" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <label className="text-[10px] uppercase tracking-widest text-stone-400 mb-2 font-semibold">Yêu Cầu Đặc Biệt / Dị Ứng</label>
                  <textarea name="notes" rows="3" value={regForm.notes} onChange={handleRegInput}
                    placeholder="Dị ứng thực phẩm, yêu cầu chỗ ngồi, hóa đơn doanh nghiệp..."
                    className="bg-black/40 border border-white/10 text-stone-200 px-4 py-3 focus:outline-none focus:border-gold-500 transition-premium text-sm resize-none" />
                </div>
                {regStatus === "error" && (
                  <div className="p-4 bg-red-950/30 border border-red-500/30 text-red-300 text-sm rounded text-center">
                    Lỗi kết nối. Vui lòng thử lại hoặc gọi: +84 904150383.
                  </div>
                )}
                <button type="submit" disabled={regStatus === "loading"}
                  className="w-full text-[12px] uppercase tracking-widest font-semibold bg-gold-500 text-dark-500 py-4 hover:bg-gold-400 shadow-[0_0_15px_rgba(197,165,90,0.15)] disabled:opacity-50 transition-premium">
                  {regStatus === "loading" ? "Đang gửi..." : "Xác Nhận Đăng Ký Tham Dự"}
                </button>
              </form>
            )}
          </div>

          {/* Notify future events */}
          <div className="mt-10 p-6 border border-white/5 bg-dark-400 text-center">
            <h4 className="text-stone-300 font-light text-sm mb-1">Nhận thông báo sự kiện sắp tới</h4>
            <p className="text-stone-500 text-xs mb-4 font-light">Đăng ký email để nhận lịch sự kiện độc quyền trước khi mở bán.</p>
            {notifyStatus === "success" ? (
              <p className="text-gold-500 text-sm font-semibold animate-fade-in">✓ Đã đăng ký thành công!</p>
            ) : (
              <form onSubmit={handleNotify} className="flex gap-3 max-w-sm mx-auto">
                <input type="email" required value={notifyEmail} onChange={(e) => setNotifyEmail(e.target.value)}
                  placeholder="email@domain.com"
                  className="flex-1 bg-black/40 border border-white/10 text-stone-200 px-4 py-2.5 focus:outline-none focus:border-gold-500 transition-premium text-sm" />
                <button type="submit" className="text-[11px] uppercase tracking-widest font-semibold bg-gold-500/90 text-dark-500 px-4 py-2.5 hover:bg-gold-500 transition-premium">
                  Đăng ký
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

export default function UpcomingEventsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-dark-500 text-gold-500 tracking-widest text-sm uppercase font-semibold">
        Loading...
      </div>
    }>
      <UpcomingEventsContent />
    </Suspense>
  );
}
