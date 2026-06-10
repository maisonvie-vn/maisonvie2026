"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// 🌐 Multilingual content for Contact page
const I18N = {
  vi: {
    title: "Liên Hệ Với Chúng Tôi",
    subtitle: "Maison Vie luôn sẵn sàng lắng nghe và đón tiếp Quý khách",
    desc: "Mọi yêu cầu tổ chức tiệc đoàn, phản hồi chất lượng dịch vụ hoặc liên kết đối tác, vui lòng điền form dưới đây hoặc liên hệ trực tiếp qua hotline của chúng tôi.",
    cardAddressTitle: "Địa chỉ nhà hàng",
    cardAddress: "28 Tăng Bạt Hổ, Quận Hai Bà Trưng, Hà Nội",
    cardPhoneTitle: "Điện thoại đặt bàn",
    cardEmailTitle: "Địa chỉ email",
    cardHoursTitle: "Giờ hoạt động",
    cardHours: "Trưa: 11:00 – 14:00 | Tối: 17:30 – 22:00",
    formTitle: "Gửi Tin Nhắn Cho Maison Vie",
    formSubtitle: "Vui lòng để lại lời nhắn, bộ phận chăm sóc khách hàng sẽ liên hệ sớm nhất",
    labelName: "Họ và Tên",
    labelPhone: "Số Điện Thoại",
    labelEmail: "Địa Chỉ Email",
    labelMessage: "Nội Dung Lời Nhắn",
    btnSubmit: "Gửi Lời Nhắn Ngay",
    submitting: "Đang gửi đi...",
    successTitle: "Đã gửi tin nhắn!",
    successMsg: "Maison Vie đã tiếp nhận thông tin từ Quý khách. Chúng tôi sẽ phản hồi lại thông qua email hoặc số điện thoại trong thời gian ngắn nhất.",
    errorTitle: "Lỗi hệ thống",
    errorMsg: "Không thể gửi tin nhắn tại thời điểm này. Vui lòng thử lại hoặc gọi Hotline hỗ trợ: 0989 091 383.",
    mapTitle: "Bản Đồ Chỉ Đường Đến Biệt Thự Maison Vie",
  },
  en: {
    title: "Contact Us",
    subtitle: "Maison Vie is always delighted to hear from you",
    desc: "For corporate dining events, private celebrations, or partnership inquiries, please complete the form below or contact our hospitality hotlines directly.",
    cardAddressTitle: "Our Location",
    cardAddress: "28 Tang Bat Ho, Hai Ba Trung District, Hanoi, Vietnam",
    cardPhoneTitle: "Reservations Hotline",
    cardEmailTitle: "Email Contacts",
    cardHoursTitle: "Opening Hours",
    cardHours: "Lunch: 11:00 – 14:00 | Dinner: 17:30 – 22:00",
    formTitle: "Send Us a Message",
    formSubtitle: "Leave your inquiry below and our guest experience manager will contact you",
    labelName: "Full Name",
    labelPhone: "Phone Number",
    labelEmail: "Email Address",
    labelMessage: "Your Inquiry / Message",
    btnSubmit: "Submit Message",
    submitting: "Sending...",
    successTitle: "Message Sent!",
    successMsg: "Maison Vie has received your message. Our hospitality team will get back to you via email or phone shortly.",
    errorTitle: "System Error",
    errorMsg: "Failed to send message. Please try again or call our concierge line: 0989 091 383.",
    mapTitle: "Find Us - Maison Vie Neoclassical Villa",
  },
  fr: {
    title: "Contactez-Nous",
    subtitle: "La Maison Vie est toujours à votre écoute",
    desc: "Pour vos banquets d'affaires, réceptions privées ou propositions de partenariats, veuillez remplir le formulaire ci-dessous hoặc contacter directement notre service client.",
    cardAddressTitle: "Notre Adresse",
    cardAddress: "28 Tang Bat Ho, District de Hai Ba Trung, Hanoï, Vietnam",
    cardPhoneTitle: "Ligne de Réservations",
    cardEmailTitle: "Contacts E-mail",
    cardHoursTitle: "Heures d'Ouverture",
    cardHours: "Midi: 11:00 – 14:00 | Soir: 17:30 – 22:00",
    formTitle: "Laissez-nous un Message",
    formSubtitle: "Notre responsable de l'expérience client vous répondra dans les plus brefs délais",
    labelName: "Nom Complet",
    labelPhone: "Téléphone",
    labelEmail: "Adresse E-mail",
    labelMessage: "Votre Message / Demande",
    btnSubmit: "Envoyer le Message",
    submitting: "Envoi en cours...",
    successTitle: "Message Envoyé!",
    successMsg: "Maison Vie a bien reçu votre message. Notre équipe d'accueil vous répondra rapidement par e-mail ou téléphone.",
    errorTitle: "Erreur de Connexion",
    errorMsg: "Impossible d'envoyer votre message. Veuillez réessayer ou composer le 0989 091 383.",
    mapTitle: "Plan d'Accès - Villa Maison Vie Hanoï",
  }
};

function ContactContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const lang = searchParams.get("lang") || "vi";
  const t = I18N[lang] || I18N.vi;

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: ""
  });
  const [status, setStatus] = useState("idle"); // idle, loading, success, error

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      // Re-use api/send-email endpoint by formatting contact inquiry as data fields
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: "info@maisonvie.vn", // Send to restaurant email inbox
          subject: `[LIÊN HỆ KHÁCH HÀNG] - ${formData.name}`,
          type: "booking_pending", // template formatting matches perfectly
          lang: lang,
          data: {
            guestName: formData.name,
            guestPhone: formData.phone,
            guestCount: 1,
            bookingDate: new Date().toLocaleDateString("vi-VN"),
            bookingTime: new Date().toLocaleTimeString("vi-VN"),
            notes: `[TIN NHẮN KHÁCH HÀNG LIÊN HỆ]\n\nEmail: ${formData.email}\n\nNội dung:\n${formData.message}`
          }
        })
      });

      if (!res.ok) throw new Error("Mail dispatch error");
      setStatus("success");
      setFormData({
        name: "",
        phone: "",
        email: "",
        message: ""
      });
    } catch (err) {
      console.error("Contact Form Submit Error:", err);
      setStatus("error");
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
            Nous Contacter · Maison Vie
          </span>
          <h1 className="text-5xl md:text-7xl font-light tracking-tight text-stone-100 font-luxury mb-6 animate-fade-in">
            {t.title}
          </h1>
          <div className="w-16 h-[1px] bg-gold-500 mx-auto mb-8" />
          <p className="text-stone-300 font-light text-lg max-w-3xl mx-auto leading-relaxed">
            {t.subtitle}
          </p>
        </div>
      </section>

      {/* CONTACT INFORMATION CARDS */}
      <section className="py-20 bg-dark-500">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Card Address */}
            <div className="glassmorphism p-8 border border-white/5 hover:border-gold-500/20 transition-premium text-left gold-border-glow">
              <div className="text-3xl text-gold-500 mb-4">📍</div>
              <h3 className="text-base font-semibold text-stone-200 font-luxury uppercase tracking-wider mb-3">
                {t.cardAddressTitle}
              </h3>
              <p className="text-stone-400 text-sm font-light leading-relaxed">
                {t.cardAddress}
              </p>
            </div>

            {/* Card Phone */}
            <div className="glassmorphism p-8 border border-white/5 hover:border-gold-500/20 transition-premium text-left gold-border-glow">
              <div className="text-3xl text-gold-500 mb-4">📞</div>
              <h3 className="text-base font-semibold text-stone-200 font-luxury uppercase tracking-wider mb-3">
                {t.cardPhoneTitle}
              </h3>
              <div className="space-y-1.5 text-stone-400 text-sm font-light">
                <p>concierge: <span className="text-stone-300 font-medium font-luxury">0989 091 383</span></p>
                <p>Office: <span className="text-stone-300 font-medium">024 3933 8888</span></p>
              </div>
            </div>

            {/* Card Email */}
            <div className="glassmorphism p-8 border border-white/5 hover:border-gold-500/20 transition-premium text-left gold-border-glow">
              <div className="text-3xl text-gold-500 mb-4">✉️</div>
              <h3 className="text-base font-semibold text-stone-200 font-luxury uppercase tracking-wider mb-3">
                {t.cardEmailTitle}
              </h3>
              <div className="space-y-1.5 text-stone-400 text-sm font-light">
                <p>Support: <span className="text-stone-300 font-medium">info@maisonvie.vn</span></p>
                <p>Corporate: <span className="text-stone-300 font-medium">bds@maisonvie.vn</span></p>
              </div>
            </div>

            {/* Card Opening Hours */}
            <div className="glassmorphism p-8 border border-white/5 hover:border-gold-500/20 transition-premium text-left gold-border-glow">
              <div className="text-3xl text-gold-500 mb-4">🕰️</div>
              <h3 className="text-base font-semibold text-stone-200 font-luxury uppercase tracking-wider mb-3">
                {t.cardHoursTitle}
              </h3>
              <p className="text-stone-400 text-sm font-light leading-relaxed">
                {t.cardHours}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* MAP & INQUIRY FORM */}
      <section className="py-20 bg-dark-500 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left: Styled Google Map Embed (5 cols) */}
          <div className="lg:col-span-6 flex flex-col gap-6 text-left w-full h-full">
            <h3 className="text-xl font-light font-luxury text-gold-500 uppercase tracking-widest">
              {t.mapTitle}
            </h3>
            
            <div className="w-full aspect-[4/3] rounded-lg overflow-hidden gold-border-glow relative glassmorphism">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.37246587425!2d105.8569853!3d21.0177726!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab213327cb7b%3A0xe510b1062635952d!2zMjggVGFuZyBCYXQgSG8sIEhhaSBCYSBUcnVuZywgSGFub2ksIFZpZXRuYW0!5e0!3m2!1sen!2s!4v1700000000000" 
                width="100%" 
                height="100%" 
                style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) contrast(120%)" }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Right: Custom message form (6 cols) */}
          <div className="lg:col-span-6 flex flex-col text-left w-full">
            <div className="glassmorphism p-8 md:p-12 border border-white/5 rounded-lg shadow-2xl">
              
              {status === "success" ? (
                <div className="text-center py-12 animate-fade-in">
                  <div className="w-16 h-16 rounded-full border-2 border-gold-500 text-gold-500 flex items-center justify-center text-3xl mx-auto mb-6">
                    ✓
                  </div>
                  <h3 className="text-2xl font-light font-luxury text-gold-500 mb-4">{t.successTitle}</h3>
                  <p className="text-stone-300 font-light leading-relaxed">
                    {t.successMsg}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-light font-luxury text-stone-100 mb-2">
                      {t.formTitle}
                    </h3>
                    <p className="text-stone-400 text-xs font-light">
                      {t.formSubtitle}
                    </p>
                  </div>

                  {status === "error" && (
                    <div className="p-4 bg-red-950/20 border border-red-500/50 text-red-200 text-xs rounded">
                      <strong>{t.errorTitle}</strong>: {t.errorMsg}
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
                      value={formData.name}
                      onChange={handleInputChange}
                      className="bg-black/40 border border-white/5 focus:border-gold-500/50 px-4 py-3 rounded text-sm text-stone-200 outline-none transition-premium"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Phone */}
                    <div className="flex flex-col">
                      <label className="text-[10px] uppercase tracking-wider text-stone-400 mb-2 font-semibold">
                        {t.labelPhone} *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="bg-black/40 border border-white/5 focus:border-gold-500/50 px-4 py-3 rounded text-sm text-stone-200 outline-none transition-premium"
                      />
                    </div>

                    {/* Email */}
                    <div className="flex flex-col">
                      <label className="text-[10px] uppercase tracking-wider text-stone-400 mb-2 font-semibold">
                        {t.labelEmail} *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="bg-black/40 border border-white/5 focus:border-gold-500/50 px-4 py-3 rounded text-sm text-stone-200 outline-none transition-premium"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div className="flex flex-col">
                    <label className="text-[10px] uppercase tracking-wider text-stone-400 mb-2 font-semibold">
                      {t.labelMessage} *
                    </label>
                    <textarea
                      name="message"
                      rows="4"
                      required
                      value={formData.message}
                      onChange={handleInputChange}
                      className="bg-black/40 border border-white/5 focus:border-gold-500/50 px-4 py-3 rounded text-sm text-stone-200 outline-none transition-premium resize-none"
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full text-center text-[12px] uppercase tracking-widest font-semibold bg-gold-500 text-dark-500 py-4 hover:bg-gold-400 hover:scale-[1.01] transition-premium shadow-[0_0_15px_rgba(197,165,90,0.15)] cursor-pointer disabled:opacity-55"
                  >
                    {status === "loading" ? t.submitting : t.btnSubmit}
                  </button>

                  <p className="text-[9px] text-stone-500 text-center font-light leading-relaxed">
                    Theo Nghị định 13/2023/NĐ-CP, mọi dữ liệu gửi qua biểu mẫu sẽ được bảo vệ mã hóa nghiêm ngặt trên máy chủ của nhà hàng.
                  </p>
                </form>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <Footer lang={lang} />

    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-dark-500 text-gold-500 tracking-widest text-sm uppercase">
        Loading...
      </div>
    }>
      <ContactContent />
    </Suspense>
  );
}
