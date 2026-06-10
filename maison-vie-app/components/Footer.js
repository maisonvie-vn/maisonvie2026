"use client";

import React from "react";

const FOOTER_I18N = {
  vi: {
    slogan: "Terroir Vietnamien bọc trong kỹ thuật Pháp cổ điển - Một điểm đến ẩm thực đẳng cấp thượng lưu.",
    hoursTitle: "Giờ Hoạt Động",
    hoursEveryday: "Mỗi ngày / Everyday: 11:00 – 14:00 & 17:30 – 22:00",
    hoursPeak: "Giờ cao điểm / Peak hours: 18:00 – 20:30 (Duyệt bàn thủ công)",
    contactTitle: "Liên Hệ",
    address: "28 Tăng Bạt Hổ, Quận Hai Bà Trưng, Hà Nội",
    hotline: "Hotline: +84 904150383",
    email: "Email: info@maisonvie.vn",
    rights: "© 2026 Maison Vie. Bảo lưu mọi quyền.",
    privacy: "Tinh hoa Ẩm thực Pháp · Bảo mật Thông tin Cá nhân theo Nghị định 13",
    journal: "Nhật ký (Blog)",
    careers: "Tuyển dụng"
  },
  en: {
    slogan: "Vietnamese Terroir wrapped in classical French technique - A destination for high-end dining.",
    hoursTitle: "Opening Hours",
    hoursEveryday: "Everyday: 11:00 – 14:00 & 17:30 – 22:00",
    hoursPeak: "Peak hours: 18:00 – 20:30 (Manual confirmation)",
    contactTitle: "Contact Us",
    address: "28 Tang Bat Ho, Hai Ba Trung District, Hanoi",
    hotline: "Hotline: +84 904150383",
    email: "Email: info@maisonvie.vn",
    rights: "© 2026 Maison Vie. All rights reserved.",
    privacy: "French Culinary Excellence · Decree 13 Personal Data Privacy Secure",
    journal: "Journal (Blog)",
    careers: "Careers"
  },
  fr: {
    slogan: "Le terroir vietnamien sublimé par les techniques françaises classiques - Une destination gastronomique d'exception.",
    hoursTitle: "Heures d'Ouverture",
    hoursEveryday: "Chaque jour: 11h00 – 14h00 & 17h30 – 22h00",
    hoursPeak: "Heures de pointe: 18h00 – 20h30 (Confirmation manuelle)",
    contactTitle: "Contactez-nous",
    address: "28 rue Tang Bat Ho, District de Hai Ba Trưng, Hanoï",
    hotline: "Hotline: +84 904150383",
    email: "E-mail: info@maisonvie.vn",
    rights: "© 2026 Maison Vie. Tous droits réservés.",
    privacy: "Excellence Culinaire Française · Données Personnelles Sécurisées (Décret 13)",
    journal: "Journal (Blog)",
    careers: "Recrutement"
  },
  ja: {
    slogan: "伝統的なフランスの技術で包まれたベトナムのテロワール - 最高峰の美食体験を。",
    hoursTitle: "営業時間",
    hoursEveryday: "毎日: 11:00 – 14:00 & 17:30 – 22:00",
    hoursPeak: "混雑時間帯: 18:00 – 20:30 (手動確認制)",
    contactTitle: "お問い合わせ",
    address: "ハノイ市ハイバーチュン区タンバットホー通り28番地",
    hotline: "ホットライン: +84 904150383",
    email: "メール: info@maisonvie.vn",
    rights: "© 2026 Maison Vie. All rights reserved.",
    privacy: "フレンチ・キュイジーヌ・エクセレンス · 政令第13号個人情報保護準拠",
    journal: "ブログ",
    careers: "採用情報"
  },
  ko: {
    slogan: "정통 프랑스 요리 기법으로 감싼 베트남의 테루아 - 고품격 미식의 목적지.",
    hoursTitle: "영업 시간",
    hoursEveryday: "매일: 11:00 – 14:00 & 17:30 – 22:00",
    hoursPeak: "혼잡 시간대: 18:00 – 20:30 (수동 예약 승인)",
    contactTitle: "문의하기",
    address: "하노이 하이바쭝구 탕밧호 28번지",
    hotline: "핫라인: +84 904150383",
    email: "이메일: info@maisonvie.vn",
    rights: "© 2026 Maison Vie. All rights reserved.",
    privacy: "프랑스 요리의 우수성 · 개인정보 보호령 제13호 준수",
    journal: "블로그",
    careers: "채용"
  },
  hk: {
    slogan: "法式經典烹調技藝融合越南本土風土 - 尊享奢華美食之旅。",
    hoursTitle: "營業時間",
    hoursEveryday: "每日: 11:00 – 14:00 & 17:30 – 22:00",
    hoursPeak: "繁忙時段: 18:00 – 20:30 (人工確認訂座)",
    contactTitle: "聯絡我們",
    address: "河內市海貝徵郡塘拔虎街28號",
    hotline: "熱線: +84 904150383",
    email: "電郵: info@maisonvie.vn",
    rights: "© 2026 Maison Vie. 版權所有。",
    privacy: "法國餐飲典範 · 個人資料私隱保障（第13號條例）",
    journal: "日誌 (網誌)",
    careers: "加入我們"
  }
};

export default function Footer({ lang = "vi" }) {
  const t = FOOTER_I18N[lang] || FOOTER_I18N.vi;

  return (
    <footer className="bg-dark-400 border-t border-white/5 py-16 text-stone-400 text-sm mt-auto">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
        
        {/* Column 1: Brand & Ministry of Industry and Trade Badge */}
        <div className="flex flex-col items-center md:items-start">
          <span className="text-xl font-semibold tracking-wider text-gold-500 font-luxury uppercase">Maison Vie</span>
          <span className="text-[9px] uppercase tracking-[0.25em] text-stone-500 font-sans mt-0.5 mb-4">Haute Cuisine</span>
          <p className="text-stone-500 text-xs font-light leading-relaxed max-w-xs mb-6">
            "{t.slogan}"
          </p>
          
          {/* Bộ Công Thương Trust Badge */}
          <a 
            href="http://online.gov.vn/Home/WebDetails/24314?AspxAutoDetectCookieSupport=1" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity duration-300 block"
          >
            <img 
              src="https://www.maisonvie.vn/wp-content/uploads/2020/03/logoSaleNoti-300x114.png" 
              alt="Đã Đăng Ký Bộ Công Thương" 
              className="h-[45px] w-auto object-contain brightness-95 contrast-105" 
            />
          </a>
        </div>

        {/* Column 2: Opening Hours */}
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-widest text-stone-200 font-semibold mb-4">{t.hoursTitle}</span>
          <div className="space-y-3 text-xs font-light text-stone-400">
            <p className="leading-relaxed">{t.hoursEveryday}</p>
            <p className="text-gold-500/80 leading-relaxed">{t.hoursPeak}</p>
          </div>
        </div>

        {/* Column 3: Contact Details */}
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-widest text-stone-200 font-semibold mb-4">{t.contactTitle}</span>
          <div className="space-y-2 text-xs font-light text-stone-400">
            <p className="leading-relaxed">{t.address}</p>
            <p className="text-stone-300 font-semibold">{t.hotline}</p>
            <p>{t.email}</p>
          </div>
        </div>

      </div>

      {/* Bottom Footer Row */}
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-600 font-light">
        <p>{t.rights}</p>
        <div className="flex space-x-6 my-4 sm:my-0">
          <a href={`/blog?lang=${lang}`} className="hover:text-gold-500 transition-premium">{t.journal}</a>
          <a href={`/careers?lang=${lang}`} className="hover:text-gold-500 transition-premium">{t.careers}</a>
        </div>
        <p>{t.privacy}</p>
      </div>
    </footer>
  );
}
