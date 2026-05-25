"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

const OFFERS = [
  {
    id: "weekly",
    badge: "Ưu Đãi Tuần",
    badgeFr: "Offre Hebdomadaire",
    title: "Set Menu Thứ 2 – Thứ 6",
    titleFr: "Menu du Jour — Lundi au Vendredi",
    desc: "Trải nghiệm bữa trưa fine dining với 3 món chọn lọc từ thực đơn Pháp theo mùa. Bao gồm nước khoáng và bánh mì thủ công từ lò của nhà hàng.",
    detail: "Khai vị · Món chính · Tráng miệng",
    price: "890.000 đ / người",
    image: "https://i.postimg.cc/Pqq4VyHp/Scallop-Carpaccio-Caviar-Lime.webp",
    color: "from-amber-950/40",
    highlight: false,
    validUntil: "Áp dụng mỗi tuần, Thứ 2 đến Thứ 6 · 11:30 – 14:30",
  },
  {
    id: "birthday",
    badge: "Dịp Đặc Biệt",
    badgeFr: "Occasion Spéciale",
    title: "Tiệc Sinh Nhật Thượng Khách",
    titleFr: "Célébration d'Anniversaire VIP",
    desc: "Chương trình dành riêng cho bữa tiệc sinh nhật: Trang trí bàn ăn độc quyền với hoa tươi và nến vàng, in menu riêng theo tên khách, và miễn phí tầng bánh Soufflé sinh nhật do Bếp trưởng Joel thực hiện tại bàn.",
    detail: "Dành cho nhóm từ 4 người trở lên · Đặt trước tối thiểu 48 giờ",
    price: "Liên hệ để báo giá",
    image: "https://i.postimg.cc/Hxd7PsXQ/Warm-Seasonal-Souffle-Vanilla-Ice-Cream.png",
    color: "from-rose-950/40",
    highlight: true,
    validUntil: "Quanh năm · Đặt trước tối thiểu 48 giờ",
  },
  {
    id: "b2b",
    badge: "B2B Lữ Hành",
    badgeFr: "Partenaires Voyagistes",
    title: "Ưu Đãi Đoàn Lữ Hành",
    titleFr: "Tarif Groupes & Voyagistes",
    desc: "Dành riêng cho đại lý lữ hành và hướng dẫn viên đã ký hợp đồng hợp tác: Giảm 15% tổng giá trị Set Menu cho đoàn từ 20 người. Hóa đơn VAT xuất theo tên công ty, thanh toán công nợ cuối tháng.",
    detail: "Đoàn từ 20 người · Đặt trước 72 giờ",
    price: "Giảm 15% Set Menu",
    image: "https://i.postimg.cc/vZngY6zs/Vietnamese-Buffalo-Wellington-Mushroom-Duxelles-Phu-Quoc-Pepper-Jus.png",
    color: "from-blue-950/40",
    highlight: false,
    validUntil: "Áp dụng quanh năm · Theo hợp đồng đã ký",
  },
  {
    id: "wine",
    badge: "Cuối Tuần",
    badgeFr: "Week-end Gastronomique",
    title: "Trải Nghiệm Rượu Vang Cuối Tuần",
    titleFr: "Dégustation de Vins — Le Week-end",
    desc: "Thứ 7 & Chủ Nhật: Thưởng thức set ghép cặp 4 món ăn với 4 ly vang được chọn lọc bởi Sommelier của Maison Vie. Mỗi chai vang đều có ghi chú đặc điểm và gợi ý ẩm thực kèm theo.",
    detail: "4 món · 4 ly vang tuyển chọn · Bình luận Sommelier",
    price: "2.450.000 đ / người",
    image: "https://i.postimg.cc/xdbkdNyx/Pan-Seared-Vietnamese-Seabass-Broccoli-Green-Mango-Pickles.webp",
    color: "from-purple-950/40",
    highlight: false,
    validUntil: "Thứ 7 & Chủ Nhật · 18:00 – 21:30 · Chỉ có 20 suất/đêm",
  },
];

const SIGNATURE_DISHES = [
  {
    name: "Atlantic Sea Bass & Champagne Caviar",
    nameFr: "Loup de Mer Rôti, Émulsion Champagne au Caviar",
    cat: "Signature",
    image: "https://i.postimg.cc/xdbkdNyx/Pan-Seared-Vietnamese-Seabass-Broccoli-Green-Mango-Pickles.webp",
    pairing: "Domaine Leflaive Puligny-Montrachet",
  },
  {
    name: "Vietnamese Buffalo Wellington",
    nameFr: "Wellington de Buffle du Vietnam",
    cat: "Signature",
    image: "https://i.postimg.cc/vZngY6zs/Vietnamese-Buffalo-Wellington-Mushroom-Duxelles-Phu-Quoc-Pepper-Jus.png",
    pairing: "Château Haut-Rocher Saint-Émilion Grand Cru",
  },
  {
    name: "Wagyu Beef MBS 6–7",
    nameFr: "Bœuf Wagyu MBS 6–7",
    cat: "Main Course",
    image: "https://i.postimg.cc/pTFK3162/Pan-Seared-Wagyu-MBS6-Peanut-Vanilla-Jus-Artichoke-Puree.webp",
    pairing: "Château Lynch-Bages Pauillac Grand Cru Classé",
  },
  {
    name: "Seared Foie Gras",
    nameFr: "Foie Gras Poêlé",
    cat: "Hot Starter",
    image: "https://i.postimg.cc/HW2v9ySJ/Seared-Foie-Gras-Seasonal-Fruit-Reduced-Jus.png",
    pairing: "Château d'Yquem Sauternes Premier Cru Supérieur",
  },
];

export default function OffersPage() {
  const router = useRouter();
  const [activeOffer, setActiveOffer] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    name: "", phone: "", email: "", guests: 2, date: "", time: "19:00", notes: ""
  });
  const [submitStatus, setSubmitStatus] = useState("idle");
  const [timeDropdownOpen, setTimeDropdownOpen] = useState(false);
  const [lang, setLang] = useState("vi");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlLang = new URLSearchParams(window.location.search).get("lang") || "vi";
      setLang(urlLang);
    }
  }, []);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setBookingForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus("loading");
    try {
      const { data: customerData } = await supabase
        .from("customers")
        .select("id")
        .eq("phone", bookingForm.phone)
        .maybeSingle();

      let customerId = customerData?.id;

      if (!customerId) {
        const { data: newCust } = await supabase
          .from("customers")
          .insert({
            full_name: bookingForm.name,
            phone: bookingForm.phone,
            email: bookingForm.email || null,
            vip_level: 1,
            consent_at: new Date().toISOString(),
          })
          .select("id")
          .single();
        customerId = newCust?.id;
      }

      await supabase.from("reservations").insert({
        customer_id: customerId,
        guest_name: bookingForm.name,
        guest_phone: bookingForm.phone,
        guest_email: bookingForm.email || null,
        guest_count: parseInt(bookingForm.guests),
        booking_date: bookingForm.date,
        booking_time: bookingForm.time + ":00",
        notes: `[OFFER: ${activeOffer || "Khuyến mãi chung"}] ${bookingForm.notes}`,
        language: "vi",
        status: "pending",
      });

      if (bookingForm.email) {
        await fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: bookingForm.email,
            subject: "Maison Vie - Xác nhận yêu cầu đặt bàn ưu đãi",
            type: "booking_pending",
            lang: "vi",
            data: { ...bookingForm },
          }),
        });
      }

      setSubmitStatus("success");
      setBookingForm({ name: "", phone: "", email: "", guests: 2, date: "", time: "19:00", notes: "" });
    } catch (err) {
      console.error(err);
      setSubmitStatus("error");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-dark-500 font-sans">

      {/* HEADER */}
      <header className="sticky top-0 z-50 glassmorphism border-b border-white/5 h-24 flex items-center justify-between px-6 max-w-full">
        <div className="flex items-center cursor-pointer" onClick={() => router.push(lang ? `/?lang=${lang}` : "/")}>
          <img
            src="https://www.maisonvie.vn/wp-content/uploads/2020/04/logo2-1-e1588240588705.png"
            alt="Maison Vie Logo"
            className="h-14 w-auto object-contain hover:scale-[1.03] transition-premium"
          />
        </div>
        <nav className="hidden md:flex items-center space-x-8 text-[12px] uppercase tracking-widest font-semibold text-stone-400">
          <a href={lang ? `/?lang=${lang}` : "/"} className="hover:text-gold-500 transition-premium">Trang Chủ</a>
          <a href={lang ? `/menu?lang=${lang}` : "/menu"} className="hover:text-gold-500 transition-premium">Thực Đơn</a>
          <a href={lang ? `/wine-list?lang=${lang}` : "/wine-list"} className="hover:text-gold-500 transition-premium">Hầm Rượu</a>
          <a href={lang ? `/upcoming-events?lang=${lang}` : "/upcoming-events"} className="hover:text-gold-500 transition-premium">Sự Kiện</a>
          <span className="text-gold-500 border-b border-gold-500 pb-0.5">Ưu Đãi</span>
        </nav>
        <a
          href="#booking-section"
          className="hidden lg:block text-[11px] uppercase tracking-widest font-semibold bg-gold-500 text-dark-500 px-5 py-3 hover:bg-gold-400 transition-premium shadow-[0_0_12px_rgba(197,165,90,0.2)]"
        >
          Đặt Bàn Ngay
        </a>
      </header>

      {/* HERO */}
      <section className="relative py-28 text-center overflow-hidden bg-dark-400 border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-dark-300 via-dark-500 to-black opacity-80" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(197,165,90,0.03)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(197,165,90,0.03)_1px,_transparent_1px)] bg-[size:80px_80px] pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <span className="text-[10px] uppercase tracking-[0.45em] text-gold-500 font-semibold mb-6 block animate-fade-in">
            Les Offres Exclusives · Maison Vie 2026
          </span>
          <h1 className="text-5xl md:text-7xl font-light tracking-tight text-stone-100 font-luxury mb-6 animate-fade-in">
            Ưu Đãi & <span className="text-gold-500 italic">Trải Nghiệm</span>
          </h1>
          <div className="w-16 h-[1px] bg-gold-500 mx-auto mb-8" />
          <p className="text-stone-300 font-light text-lg max-w-2xl mx-auto leading-relaxed">
            Những chương trình ưu đãi được thiết kế riêng — từ bữa trưa fine dining hàng tuần đến trải nghiệm ghép cặp rượu vang độc quyền cuối tuần cùng Sommelier của Maison Vie.
          </p>
        </div>
      </section>

      {/* OFFERS GRID */}
      <section className="py-24 bg-dark-500">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[10px] uppercase tracking-[0.35em] text-gold-500 font-semibold block mb-4">Les Privilèges</span>
            <h2 className="text-4xl font-light text-stone-100 font-luxury">Chương Trình Ưu Đãi Hiện Hành</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {OFFERS.map((offer) => (
              <div
                key={offer.id}
                className={`relative overflow-hidden group border transition-premium shadow-2xl flex flex-col ${
                  offer.highlight
                    ? "border-gold-500/40 shadow-[0_0_30px_rgba(197,165,90,0.1)]"
                    : "border-white/5 hover:border-gold-500/20"
                }`}
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-t ${offer.color} to-transparent z-10`} />
                  <img
                    src={offer.image}
                    alt={offer.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                    <span className="text-[9px] uppercase tracking-[0.3em] font-bold text-dark-500 bg-gold-500 px-3 py-1.5">
                      {offer.badge}
                    </span>
                    {offer.highlight && (
                      <span className="text-[9px] uppercase tracking-wider font-bold text-gold-400 border border-gold-500/50 bg-black/60 px-2 py-1">
                        ✦ Nổi Bật
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 bg-dark-400 flex flex-col flex-1">
                  <div className="mb-1">
                    <span className="text-[9px] uppercase tracking-[0.25em] text-gold-500/70 italic font-light">{offer.badgeFr}</span>
                  </div>
                  <h3 className="text-2xl font-light text-stone-100 font-luxury mb-1">{offer.title}</h3>
                  <p className="text-[11px] text-stone-500 italic mb-4 font-light">{offer.titleFr}</p>
                  <p className="text-stone-300 text-sm font-light leading-relaxed mb-4 flex-1">{offer.desc}</p>
                  <div className="text-[10px] uppercase tracking-wider text-stone-500 mb-6 pb-6 border-b border-white/5">
                    {offer.detail}
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xl font-semibold text-gold-500 font-luxury">{offer.price}</span>
                      <p className="text-[10px] text-stone-500 mt-1">{offer.validUntil}</p>
                    </div>
                    <button
                      onClick={() => {
                        setActiveOffer(offer.title);
                        document.getElementById("booking-section")?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="text-[11px] uppercase tracking-widest font-semibold bg-gold-500 text-dark-500 px-5 py-3 hover:bg-gold-400 transition-premium shadow-[0_0_10px_rgba(197,165,90,0.15)]"
                    >
                      Đặt Ngay
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SIGNATURE DISHES TEASER */}
      <section className="py-24 bg-dark-400 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[10px] uppercase tracking-[0.35em] text-gold-500 font-semibold block mb-4">Les Signatures</span>
            <h2 className="text-4xl font-light text-stone-100 font-luxury mb-4">Món Ăn Tiêu Biểu</h2>
            <p className="text-stone-400 font-light max-w-xl mx-auto text-sm leading-relaxed">
              Thoáng nhìn về thực đơn của chúng tôi — mỗi đĩa ăn được chế tác từ nguyên liệu cao cấp theo kỹ thuật Pháp cổ điển, ghép cặp bởi Sommelier.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {SIGNATURE_DISHES.map((dish, idx) => (
              <div key={idx} className="group relative overflow-hidden border border-white/5 hover:border-gold-500/25 transition-premium">
                <div className="relative h-56 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-500 via-transparent to-transparent z-10" />
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-full h-full object-cover group-hover:scale-106 transition-all duration-700"
                    loading="lazy"
                  />
                  <div className="absolute bottom-4 left-4 z-20">
                    <span className="text-[8px] uppercase tracking-[0.2em] text-gold-500 font-bold block mb-1">{dish.cat}</span>
                    <h4 className="text-sm font-light text-stone-100 font-luxury leading-tight">{dish.name}</h4>
                  </div>
                </div>
                <div className="p-4 bg-dark-300 text-left">
                  <p className="text-[10px] italic text-stone-500 font-light mb-2">{dish.nameFr}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] uppercase tracking-wider text-gold-500/70">Wine Pairing</span>
                  </div>
                  <p className="text-[10px] text-stone-400 italic mt-0.5">{dish.pairing}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <a
              href="/menu"
              className="text-[12px] uppercase tracking-widest font-semibold border border-gold-500/30 text-gold-300 px-8 py-4 hover:bg-gold-500/10 transition-premium inline-block"
            >
              Xem Toàn Bộ Thực Đơn
            </a>
          </div>
        </div>
      </section>

      {/* BOOKING SECTION */}
      <section id="booking-section" className="py-24 bg-dark-500 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-[10px] uppercase tracking-[0.35em] text-gold-500 font-semibold block mb-4">Réservation</span>
            <h2 className="text-4xl font-light text-stone-100 font-luxury mb-4">
              Đặt Bàn {activeOffer ? <span className="text-gold-500">— {activeOffer}</span> : "Thưởng Thức Ưu Đãi"}
            </h2>
            <p className="text-stone-400 font-light text-sm">
              Điền thông tin để chúng tôi sắp xếp trải nghiệm hoàn hảo nhất cho bạn.
            </p>
            {activeOffer && (
              <div className="mt-4 inline-flex items-center gap-2 text-[11px] uppercase tracking-wider text-gold-400 border border-gold-500/30 bg-gold-500/5 px-4 py-2">
                ✦ Ưu đãi đã chọn: {activeOffer}
                <button onClick={() => setActiveOffer(null)} className="text-stone-500 hover:text-red-400 ml-2">✕</button>
              </div>
            )}
          </div>

          <div className="glassmorphism p-8 border border-gold-500/10 shadow-2xl">
            {submitStatus === "success" ? (
              <div className="text-center py-12 animate-fade-in">
                <div className="w-14 h-14 bg-gold-500/20 text-gold-500 rounded-full flex items-center justify-center text-2xl mx-auto mb-6">✓</div>
                <h3 className="text-2xl font-light text-gold-500 font-luxury mb-4">Yêu Cầu Đã Tiếp Nhận</h3>
                <p className="text-stone-300 leading-relaxed max-w-md mx-auto text-sm">
                  Maison Vie đã nhận được yêu cầu đặt bàn của bạn. Lễ tân sẽ liên hệ xác nhận chính thức qua email/điện thoại trong ít phút.
                </p>
                <button
                  onClick={() => setSubmitStatus("idle")}
                  className="mt-8 text-[11px] uppercase tracking-widest font-semibold border border-gold-500/30 text-gold-300 px-6 py-3 hover:bg-gold-500/10 transition-premium"
                >
                  Đặt thêm bàn khác
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {submitStatus === "error" && (
                  <div className="p-4 bg-red-950/30 border border-red-500/30 text-red-300 text-sm rounded text-center">
                    Không thể kết nối. Vui lòng thử lại hoặc gọi hotline: 0989 091 383.
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col">
                    <label className="text-[10px] uppercase tracking-widest text-stone-400 mb-2 font-semibold">Họ và Tên *</label>
                    <input type="text" name="name" required value={bookingForm.name} onChange={handleInput}
                      className="bg-black/40 border border-white/10 text-stone-200 px-4 py-3 focus:outline-none focus:border-gold-500 transition-premium text-sm" />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] uppercase tracking-widest text-stone-400 mb-2 font-semibold">Số Điện Thoại *</label>
                    <input type="tel" name="phone" required value={bookingForm.phone} onChange={handleInput}
                      className="bg-black/40 border border-white/10 text-stone-200 px-4 py-3 focus:outline-none focus:border-gold-500 transition-premium text-sm" />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] uppercase tracking-widest text-stone-400 mb-2 font-semibold">Email</label>
                    <input type="email" name="email" value={bookingForm.email} onChange={handleInput}
                      className="bg-black/40 border border-white/10 text-stone-200 px-4 py-3 focus:outline-none focus:border-gold-500 transition-premium text-sm" />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] uppercase tracking-widest text-stone-400 mb-2 font-semibold">Số Khách *</label>
                    <input type="number" name="guests" required min="1" value={bookingForm.guests} onChange={handleInput}
                      className="bg-black/40 border border-white/10 text-stone-200 px-4 py-3 focus:outline-none focus:border-gold-500 transition-premium text-sm" />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] uppercase tracking-widest text-stone-400 mb-2 font-semibold">Ngày Dùng Bữa *</label>
                    <input type="date" name="date" required value={bookingForm.date} onChange={handleInput}
                      className="bg-black/40 border border-white/10 text-stone-200 px-4 py-3 focus:outline-none focus:border-gold-500 transition-premium text-sm" />
                  </div>
                  <div className="flex flex-col relative">
                    <label className="text-[10px] uppercase tracking-widest text-stone-400 mb-2 font-semibold">Giờ Đến *</label>
                    <button
                      type="button"
                      onClick={() => setTimeDropdownOpen(!timeDropdownOpen)}
                      className="w-full flex items-center justify-between bg-black/40 border border-gold-500/40 text-stone-200 px-4 py-3 focus:outline-none focus:border-gold-500 hover:border-gold-500/80 transition-premium text-sm text-left font-luxury cursor-pointer"
                    >
                      <span>
                        {bookingForm.time || "Chọn giờ đón tiếp"}
                      </span>
                      <span className="text-[10px] text-gold-500 ml-2 transition-transform duration-300" style={{ transform: timeDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                        ▼
                      </span>
                    </button>

                    {timeDropdownOpen && (
                      <>
                        <div 
                          className="fixed inset-0 z-40" 
                          onClick={() => setTimeDropdownOpen(false)}
                        />
                        <div className="absolute left-0 right-0 mt-1 top-full z-50 bg-[#0b0c10] max-h-64 overflow-y-auto border border-gold-500 shadow-2xl rounded animate-fade-in font-sans">
                          {/* Option for title/placeholder */}
                          <button
                            type="button"
                            onClick={() => {
                              setBookingForm((prev) => ({ ...prev, time: "" }));
                              setTimeDropdownOpen(false);
                            }}
                            className="w-full text-left px-6 py-3 text-stone-500 text-sm hover:bg-white/5 border-b border-white/5 font-luxury"
                          >
                            Chọn giờ đón tiếp
                          </button>

                          {/* Lunch Section */}
                          <div className="px-6 py-2.5 text-gold-500 text-xs font-bold bg-black/60 font-luxury uppercase tracking-wider">
                            Lunch (10:00 – 14:00)
                          </div>
                          <div className="flex flex-col">
                            {["10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00"].map((slot) => (
                              <button
                                key={slot}
                                type="button"
                                onClick={() => {
                                  setBookingForm((prev) => ({ ...prev, time: slot }));
                                  setTimeDropdownOpen(false);
                                }}
                                className={`w-full text-left px-8 py-2.5 text-sm transition-premium font-luxury ${
                                  bookingForm.time === slot
                                    ? "bg-gold-500/20 text-gold-400 font-bold"
                                    : "text-stone-300 hover:bg-white/5"
                                }`}
                              >
                                {slot}
                              </button>
                            ))}
                          </div>

                          {/* Dinner Section */}
                          <div className="px-6 py-2.5 text-gold-500 text-xs font-bold bg-black/60 font-luxury uppercase tracking-wider mt-1">
                            Dinner (17:00 – 22:00)
                          </div>
                          <div className="flex flex-col">
                            {["17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00"].map((slot) => (
                              <button
                                key={slot}
                                type="button"
                                onClick={() => {
                                  setBookingForm((prev) => ({ ...prev, time: slot }));
                                  setTimeDropdownOpen(false);
                                }}
                                className={`w-full text-left px-8 py-2.5 text-sm transition-premium font-luxury ${
                                  bookingForm.time === slot
                                    ? "bg-gold-500/20 text-gold-400 font-bold"
                                    : "text-stone-300 hover:bg-white/5"
                                }`}
                              >
                                {slot}
                              </button>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex flex-col">
                  <label className="text-[10px] uppercase tracking-widest text-stone-400 mb-2 font-semibold">Yêu Cầu Đặc Biệt</label>
                  <textarea name="notes" rows="3" value={bookingForm.notes} onChange={handleInput}
                    placeholder="Dịp sinh nhật, kỷ niệm, setup hoa tươi, phòng VIP..."
                    className="bg-black/40 border border-white/10 text-stone-200 px-4 py-3 focus:outline-none focus:border-gold-500 transition-premium text-sm resize-none" />
                </div>
                <button
                  type="submit"
                  disabled={submitStatus === "loading"}
                  className="w-full text-[12px] uppercase tracking-widest font-semibold bg-gold-500 text-dark-500 py-4 hover:bg-gold-400 shadow-[0_0_15px_rgba(197,165,90,0.15)] disabled:opacity-50 transition-premium"
                >
                  {submitStatus === "loading" ? "Đang xử lý..." : "Gửi Yêu Cầu Giữ Chỗ"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black border-t border-white/5 py-10 text-center">
        <div className="max-w-7xl mx-auto px-6">
          <span className="text-lg font-semibold tracking-wider text-gold-500 font-luxury uppercase block mb-1">Maison Vie</span>
          <span className="text-[9px] uppercase tracking-[0.25em] text-stone-500 block mb-6">Cuisine Française Classique · Terroir Vietnamien</span>
          <p className="text-stone-500 text-xs">28 Tăng Bạt Hổ, Hai Bà Trưng, Hà Nội · +84 989 091 383 · info@maisonvie.vn</p>
          <p className="text-stone-700 text-[10px] mt-4">© 2026 Maison Vie. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}
