"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const PARTNERS_TRAVEL = [
  {
    name: "Vietravel",
    category: "Đại Lý Lữ Hành Cao Cấp",
    categoryFr: "Agence de Voyages Premium",
    logo: null,
    initial: "VT",
    desc: "Đối tác lữ hành chiến lược hàng đầu. Chương trình hoa hồng và ưu đãi đoàn độc quyền cho các tuyến tour Hà Nội cao cấp.",
    detail: "Hoa hồng 15% · Công nợ cuối tháng · Hóa đơn VAT",
  },
  {
    name: "Buffalo Tours",
    category: "Luxury Inbound Tour",
    categoryFr: "Tour Réceptif de Luxe",
    logo: null,
    initial: "BT",
    desc: "Chuyên khai thác đoàn khách quốc tế (Pháp, Bỉ, Nhật) theo hướng slow travel & culinary experience. Đối tác F&B ưu tiên tại Hà Nội.",
    detail: "Fine dining packages · Group menus · English/French briefing",
  },
  {
    name: "Asia Pacific Travel",
    category: "MICE & Corporate",
    categoryFr: "Tourisme d'Affaires & MICE",
    logo: null,
    initial: "AP",
    desc: "Đối tác tổ chức hội nghị, incentive trip và tiệc gala doanh nghiệp FDI. Hỗ trợ catering cho sự kiện từ 50–250 người.",
    detail: "Event catering · MICE groups · VAT invoice per company",
  },
];

const PARTNERS_SUPPLIERS = [
  {
    name: "Metro Cash & Carry",
    category: "Nhà Cung Cấp Thực Phẩm",
    categoryFr: "Fournisseur Alimentaire",
    initial: "MC",
    desc: "Nhà cung cấp nguyên liệu cao cấp: bò Wagyu Nhật, cá hồi Na Uy, bơ AOP Pháp, phô mai Comté và Brie hàng tuần.",
  },
  {
    name: "Sommelier Club VN",
    category: "Nhà Cung Cấp Rượu Vang",
    categoryFr: "Importateur de Vins",
    initial: "SC",
    desc: "Nhập khẩu và phân phối độc quyền rượu vang Pháp cao cấp: Bordeaux Grand Cru, Champagne, Bourgogne Premier Cru.",
  },
  {
    name: "Đà Lạt Farm",
    category: "Nông Sản Hữu Cơ",
    categoryFr: "Producteur Biologique",
    initial: "DF",
    desc: "Cung cấp nấm truffle nội địa, rau củ hữu cơ cao nguyên, cà phê Arabica Đà Lạt và các loại thảo mộc tươi cho bếp mỗi ngày.",
  },
];

const PARTNERS_BRAND = [
  {
    name: "Moët & Chandon",
    category: "Champagne Chính Thức",
    categoryFr: "Champagne Officiel",
    initial: "MH",
    desc: "Nhà tài trợ Champagne chính thức cho các sự kiện và buổi đón khách VIP của Maison Vie.",
  },
  {
    name: "Riedel Crystal",
    category: "Bộ Ly Pha Lê",
    categoryFr: "Verrerie de Prestige",
    initial: "RI",
    desc: "Cung cấp bộ ly pha lê Riedel Vinum và Veritas toàn bộ cho hệ thống sảnh ăn 250 chỗ và các phòng VIP.",
  },
  {
    name: "Alliance Française Hà Nội",
    category: "Đối Tác Văn Hóa",
    categoryFr: "Partenaire Culturel",
    initial: "AF",
    desc: "Đối tác trao đổi văn hóa Pháp-Việt, đồng tổ chức các đêm văn học, âm nhạc và thưởng thức ẩm thực theo chủ đề Pháp ngữ.",
  },
];

const PARTNER_BENEFITS = [
  {
    icon: "💳",
    title: "Hoa Hồng Minh Bạch",
    desc: "Công thức chiết khấu cố định theo hợp đồng, thanh toán tự động cuối tháng. Không thương lượng từng đơn.",
  },
  {
    icon: "📄",
    title: "Hóa Đơn VAT Doanh Nghiệp",
    desc: "Xuất hóa đơn VAT điện tử VNPT theo tên công ty cho mọi đơn B2B. Tách hóa đơn đa chiều theo yêu cầu.",
  },
  {
    icon: "🍷",
    title: "Giữ Chỗ Ưu Tiên",
    desc: "Đối tác có quyền giữ chỗ sảnh Tầng 2 và Phòng VIP Le Jardin theo lịch độc quyền trước khi mở bán đại trà.",
  },
  {
    icon: "👨‍🍳",
    title: "Cá Nhân Hóa Thực Đơn",
    desc: "Bếp trưởng Joel thiết kế Set Menu theo chủ đề, ngôn ngữ và khẩu vị riêng của từng đoàn khách theo yêu cầu hợp đồng.",
  },
];

export default function PartnersPage() {
  const router = useRouter();
  const [form, setForm] = useState({ company: "", name: "", email: "", phone: "", partnerType: "", message: "" });
  const [status, setStatus] = useState("idle");

  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      if (form.email) {
        await fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: "info@maisonvie.vn",
            subject: `[ĐỐI TÁC MỚI] ${form.company} — ${form.partnerType}`,
            type: "booking_pending",
            lang: "vi",
            data: {
              guestName: `${form.name} (${form.company})`,
              guestPhone: form.phone,
              bookingDate: new Date().toLocaleDateString("vi-VN"),
              bookingTime: new Date().toLocaleTimeString("vi-VN"),
              notes: `Loại đối tác: ${form.partnerType}\n\nNội dung: ${form.message}`,
            },
          }),
        });
      }
      setStatus("success");
      setForm({ company: "", name: "", email: "", phone: "", partnerType: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  const PartnerCard = ({ partner }) => (
    <div className="group glassmorphism border border-white/5 hover:border-gold-500/25 transition-premium p-6 flex flex-col">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-14 h-14 bg-gold-500/10 border border-gold-500/20 flex items-center justify-center shrink-0">
          <span className="text-gold-500 font-luxury font-light text-lg">{partner.initial}</span>
        </div>
        <div>
          <h3 className="text-base font-semibold text-stone-100 font-luxury mb-0.5">{partner.name}</h3>
          <div className="text-[9px] uppercase tracking-[0.2em] text-gold-500/70">{partner.category}</div>
          <div className="text-[9px] italic text-stone-600 font-light">{partner.categoryFr}</div>
        </div>
      </div>
      <p className="text-stone-400 text-sm font-light leading-relaxed flex-1">{partner.desc}</p>
      {partner.detail && (
        <div className="mt-4 pt-4 border-t border-white/5">
          <p className="text-[10px] uppercase tracking-wider text-stone-500">{partner.detail}</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-dark-500 font-sans">

      {/* HEADER */}
      <header className="sticky top-0 z-50 glassmorphism border-b border-white/5 h-24 flex items-center justify-between px-6">
        <div className="flex items-center cursor-pointer" onClick={() => router.push("/")}>
          <img
            src="https://www.maisonvie.vn/wp-content/uploads/2020/04/logo2-1-e1588240588705.png"
            alt="Maison Vie Logo"
            className="h-14 w-auto object-contain hover:scale-[1.03] transition-premium"
          />
        </div>
        <nav className="hidden md:flex items-center space-x-8 text-[12px] uppercase tracking-widest font-semibold text-stone-400">
          <a href="/" className="hover:text-gold-500 transition-premium">Trang Chủ</a>
          <a href="/menu" className="hover:text-gold-500 transition-premium">Thực Đơn</a>
          <a href="/upcoming-events" className="hover:text-gold-500 transition-premium">Sự Kiện</a>
          <a href="/offers" className="hover:text-gold-500 transition-premium">Ưu Đãi</a>
          <span className="text-gold-500 border-b border-gold-500 pb-0.5">Đối Tác</span>
        </nav>
        <a href="#b2b-form" className="hidden lg:block text-[11px] uppercase tracking-widest font-semibold bg-gold-500 text-dark-500 px-5 py-3 hover:bg-gold-400 transition-premium">
          Trở Thành Đối Tác
        </a>
      </header>

      {/* HERO */}
      <section className="relative py-28 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-dark-300 to-dark-500" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(197,165,90,0.02)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(197,165,90,0.02)_1px,_transparent_1px)] bg-[size:60px_60px] pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <span className="text-[10px] uppercase tracking-[0.45em] text-gold-500 font-semibold mb-6 block">
            Nos Partenaires · Maison Vie
          </span>
          <h1 className="text-5xl md:text-7xl font-light tracking-tight text-stone-100 font-luxury mb-6">
            Hệ Sinh Thái <span className="text-gold-500 italic">Đối Tác</span>
          </h1>
          <div className="w-16 h-[1px] bg-gold-500 mx-auto mb-8" />
          <p className="text-stone-300 font-light text-lg max-w-2xl mx-auto leading-relaxed">
            Maison Vie trân trọng hợp tác cùng những đối tác chia sẻ triết lý phục vụ đỉnh cao — từ công ty lữ hành cao cấp đến nhà cung cấp nguyên liệu thượng hạng và thương hiệu quốc tế.
          </p>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="py-16 bg-dark-400 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-[10px] uppercase tracking-[0.35em] text-gold-500 font-semibold block mb-4">Avantages</span>
            <h2 className="text-3xl font-light text-stone-100 font-luxury">Quyền Lợi Đối Tác</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PARTNER_BENEFITS.map((b, idx) => (
              <div key={idx} className="text-center p-6 border border-white/5 hover:border-gold-500/20 transition-premium group">
                <div className="text-3xl mb-4 group-hover:scale-110 transition-premium inline-block">{b.icon}</div>
                <h4 className="text-sm font-semibold text-stone-100 mb-3 font-luxury">{b.title}</h4>
                <p className="text-stone-400 text-xs font-light leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRAVEL PARTNERS */}
      <section className="py-20 bg-dark-500">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <span className="text-[10px] uppercase tracking-[0.35em] text-gold-500 font-semibold block mb-3">Voyagistes</span>
            <h2 className="text-3xl font-light text-stone-100 font-luxury">Đối Tác Lữ Hành</h2>
            <p className="text-stone-400 font-light text-sm mt-2 max-w-xl">Các công ty lữ hành và đại lý inbound tin tưởng Maison Vie là điểm ẩm thực fine dining hàng đầu trong lịch trình cao cấp tại Hà Nội.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PARTNERS_TRAVEL.map((p, idx) => <PartnerCard key={idx} partner={p} />)}
          </div>
        </div>
      </section>

      {/* SUPPLIERS */}
      <section className="py-20 bg-dark-400 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <span className="text-[10px] uppercase tracking-[0.35em] text-gold-500 font-semibold block mb-3">Fournisseurs</span>
            <h2 className="text-3xl font-light text-stone-100 font-luxury">Nhà Cung Cấp Nguyên Liệu</h2>
            <p className="text-stone-400 font-light text-sm mt-2 max-w-xl">Chất lượng trên từng đĩa ăn bắt đầu từ nguồn nguyên liệu — những nhà cung cấp chia sẻ tiêu chuẩn khắt khe nhất về độ tươi ngon và xuất xứ rõ ràng.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PARTNERS_SUPPLIERS.map((p, idx) => <PartnerCard key={idx} partner={p} />)}
          </div>
        </div>
      </section>

      {/* BRAND PARTNERS */}
      <section className="py-20 bg-dark-500">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <span className="text-[10px] uppercase tracking-[0.35em] text-gold-500 font-semibold block mb-3">Marques Partenaires</span>
            <h2 className="text-3xl font-light text-stone-100 font-luxury">Đối Tác Thương Hiệu & Văn Hóa</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PARTNERS_BRAND.map((p, idx) => <PartnerCard key={idx} partner={p} />)}
          </div>
        </div>
      </section>

      {/* TESTIMONIAL STATS */}
      <section className="py-16 bg-dark-400 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { num: "12+", label: "Đối tác lữ hành", labelFr: "Agences partenaires" },
              { num: "250+", label: "Đoàn B2B/năm", labelFr: "Groupes B2B / an" },
              { num: "30+", label: "Nhà cung cấp", labelFr: "Fournisseurs" },
              { num: "98%", label: "Tỷ lệ tái hợp tác", labelFr: "Taux de fidélisation" },
            ].map((stat, idx) => (
              <div key={idx} className="group">
                <div className="text-4xl font-light text-gold-500 font-luxury mb-2 group-hover:scale-105 transition-premium inline-block">{stat.num}</div>
                <div className="text-[11px] uppercase tracking-wider text-stone-400 mb-1">{stat.label}</div>
                <div className="text-[9px] italic text-stone-600 font-light">{stat.labelFr}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* B2B CONTACT FORM */}
      <section id="b2b-form" className="py-24 bg-dark-500">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-[10px] uppercase tracking-[0.35em] text-gold-500 font-semibold block mb-4">Devenir Partenaire</span>
            <h2 className="text-4xl font-light text-stone-100 font-luxury mb-4">Đăng Ký Trở Thành Đối Tác</h2>
            <p className="text-stone-400 font-light text-sm max-w-xl mx-auto leading-relaxed">
              Điền thông tin dưới đây, đội ngũ Business Development của Maison Vie sẽ liên hệ trong vòng 24 giờ làm việc để thảo luận điều khoản hợp tác.
            </p>
          </div>

          <div className="glassmorphism p-8 border border-gold-500/10 shadow-2xl">
            {status === "success" ? (
              <div className="text-center py-12 animate-fade-in">
                <div className="w-14 h-14 bg-gold-500/20 text-gold-500 rounded-full flex items-center justify-center text-2xl mx-auto mb-6">✓</div>
                <h3 className="text-2xl font-light text-gold-500 font-luxury mb-4">Yêu Cầu Đã Gửi Thành Công</h3>
                <p className="text-stone-300 leading-relaxed max-w-md mx-auto text-sm">
                  Cảm ơn bạn đã quan tâm đến hợp tác cùng Maison Vie. Chúng tôi sẽ liên hệ trong vòng 24 giờ làm việc.
                </p>
                <button onClick={() => setStatus("idle")}
                  className="mt-8 text-[11px] uppercase tracking-widest font-semibold border border-gold-500/30 text-gold-300 px-6 py-3 hover:bg-gold-500/10 transition-premium">
                  Gửi yêu cầu khác
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col">
                    <label className="text-[10px] uppercase tracking-widest text-stone-400 mb-2 font-semibold">Tên Công Ty / Tổ Chức *</label>
                    <input type="text" name="company" required value={form.company} onChange={handleInput}
                      className="bg-black/40 border border-white/10 text-stone-200 px-4 py-3 focus:outline-none focus:border-gold-500 transition-premium text-sm" />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] uppercase tracking-widest text-stone-400 mb-2 font-semibold">Người Liên Hệ *</label>
                    <input type="text" name="name" required value={form.name} onChange={handleInput}
                      className="bg-black/40 border border-white/10 text-stone-200 px-4 py-3 focus:outline-none focus:border-gold-500 transition-premium text-sm" />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] uppercase tracking-widest text-stone-400 mb-2 font-semibold">Email Doanh Nghiệp *</label>
                    <input type="email" name="email" required value={form.email} onChange={handleInput}
                      className="bg-black/40 border border-white/10 text-stone-200 px-4 py-3 focus:outline-none focus:border-gold-500 transition-premium text-sm" />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] uppercase tracking-widest text-stone-400 mb-2 font-semibold">Số Điện Thoại *</label>
                    <input type="tel" name="phone" required value={form.phone} onChange={handleInput}
                      className="bg-black/40 border border-white/10 text-stone-200 px-4 py-3 focus:outline-none focus:border-gold-500 transition-premium text-sm" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <label className="text-[10px] uppercase tracking-widest text-stone-400 mb-2 font-semibold">Loại Đối Tác *</label>
                  <select name="partnerType" required value={form.partnerType} onChange={handleInput}
                    className="bg-black/40 border border-white/10 text-stone-200 px-4 py-3 focus:outline-none focus:border-gold-500 transition-premium text-sm">
                    <option value="" disabled>— Chọn loại hình hợp tác —</option>
                    <option value="Lữ hành / Inbound Tour">Đại lý Lữ hành / Inbound Tour</option>
                    <option value="MICE / Corporate Events">MICE / Tổ chức sự kiện doanh nghiệp</option>
                    <option value="Nhà cung cấp thực phẩm & đồ uống">Nhà cung cấp Thực phẩm & Đồ uống</option>
                    <option value="Đối tác thương hiệu & truyền thông">Đối tác Thương hiệu & Truyền thông</option>
                    <option value="Hợp tác văn hóa & giáo dục">Hợp tác Văn hóa & Giáo dục</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="text-[10px] uppercase tracking-widest text-stone-400 mb-2 font-semibold">Nội Dung Hợp Tác Mong Muốn</label>
                  <textarea name="message" rows="4" value={form.message} onChange={handleInput}
                    placeholder="Mô tả ngắn về nhu cầu hợp tác, quy mô đoàn dự kiến, tần suất..."
                    className="bg-black/40 border border-white/10 text-stone-200 px-4 py-3 focus:outline-none focus:border-gold-500 transition-premium text-sm resize-none" />
                </div>
                {status === "error" && (
                  <div className="p-4 bg-red-950/30 border border-red-500/30 text-red-300 text-sm rounded text-center">
                    Lỗi kết nối. Vui lòng email trực tiếp: info@maisonvie.vn
                  </div>
                )}
                <button type="submit" disabled={status === "loading"}
                  className="w-full text-[12px] uppercase tracking-widest font-semibold bg-gold-500 text-dark-500 py-4 hover:bg-gold-400 shadow-[0_0_15px_rgba(197,165,90,0.15)] disabled:opacity-50 transition-premium">
                  {status === "loading" ? "Đang gửi..." : "Gửi Yêu Cầu Hợp Tác"}
                </button>
              </form>
            )}
          </div>

          {/* Direct contacts */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 border border-white/5 bg-dark-400 text-center">
              <div className="text-[9px] uppercase tracking-[0.25em] text-gold-500 mb-2">B2B & Tour Groups</div>
              <div className="text-stone-300 text-sm font-light">bds@maisonvie.vn</div>
              <div className="text-stone-400 text-xs mt-1">+84 989 091 383</div>
            </div>
            <div className="p-5 border border-white/5 bg-dark-400 text-center">
              <div className="text-[9px] uppercase tracking-[0.25em] text-gold-500 mb-2">Hợp Tác Thương Hiệu</div>
              <div className="text-stone-300 text-sm font-light">info@maisonvie.vn</div>
              <div className="text-stone-400 text-xs mt-1">+84 904 150 383</div>
            </div>
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
