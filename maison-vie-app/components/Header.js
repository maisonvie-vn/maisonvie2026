"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

// 🌐 Header specific translations
const NAV_I18N = {
  vi: {
    home: "Trang Chủ",
    menu: "Thực Đơn",
    alacarte: "À La Carte",
    setmenu: "Set Menu",
    drinks: "Đồ Uống",
    wine: "Hầm Rượu",
    privileges: "Đặc Quyền & Sự Kiện",
    offers: "Ưu Đãi",
    events: "Sự Kiện",
    partners: "Đối Tác",
    membership: "Thành Viên VIP",
    gallery: "Thư Viện Ảnh",
    chef: "Bếp Trưởng",
    contact: "Liên Hệ",
    booking: "Đặt Bàn Ngay",
    selectLang: "Ngôn ngữ",
  },
  en: {
    home: "Home",
    menu: "Menu",
    alacarte: "À La Carte",
    setmenu: "Set Menu",
    drinks: "Beverage List",
    wine: "Wine List",
    privileges: "Privileges & Events",
    offers: "Offers",
    events: "Events",
    partners: "Partners",
    membership: "Membership",
    gallery: "Gallery",
    chef: "Executive Chef",
    contact: "Contact",
    booking: "Book Now",
    selectLang: "Language",
  },
  fr: {
    home: "Accueil",
    menu: "Carte",
    alacarte: "À La Carte",
    setmenu: "Set Menu",
    drinks: "Carte des Boissons",
    wine: "Carte des Vins",
    privileges: "Privilèges & Événements",
    offers: "Offres",
    events: "Événements",
    partners: "Partenaires",
    membership: "Membres VIP",
    gallery: "Galerie",
    chef: "Chef de Cuisine",
    contact: "Contact",
    booking: "Réserver",
    selectLang: "Langue",
  },
  ja: {
    home: "ホーム",
    menu: "メニュー",
    alacarte: "アラカルト",
    setmenu: "セットメニュー",
    drinks: "ドリンク",
    wine: "ワインリスト",
    privileges: "特別プラン＆イベント",
    offers: "特別プラン",
    events: "イベント",
    partners: "パートナー",
    membership: "VIP会員",
    gallery: "ギャラリー",
    chef: "総料理長",
    contact: "お問い合わせ",
    booking: "オンライン予約",
    selectLang: "言語",
  },
  ko: {
    home: "홈",
    menu: "메뉴",
    alacarte: "단품 메뉴",
    setmenu: "코스 메뉴",
    drinks: "음료",
    wine: "와인 목록",
    privileges: "특전 & 이벤트",
    offers: "특별 혜택",
    events: "이벤트",
    partners: "파트너",
    membership: "VIP 멤버십",
    gallery: "갤러리",
    chef: "총주방장",
    contact: "문의하기",
    booking: "예약하기",
    selectLang: "언어",
  },
  hk: {
    home: "主頁",
    menu: "精選菜單",
    alacarte: "單點菜單",
    setmenu: "宴 club 套餐",
    drinks: "飲料",
    wine: "特藏酒窖",
    privileges: "尊貴禮遇 & 活動",
    offers: "餐飲優惠",
    events: "最新活動",
    partners: "合作夥伴",
    membership: "尊貴會員",
    gallery: "相片藝廊",
    chef: "行政總廚",
    contact: "聯絡我們",
    booking: "尊貴訂座",
    selectLang: "語言",
  }
};

export default function Header({ lang = "vi", setLang }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  
  // Mobile accordion state
  const [mobileMenuExpanded, setMobileMenuExpanded] = useState(false);
  const [mobilePrivExpanded, setMobilePrivExpanded] = useState(false);

  const t = NAV_I18N[lang] || NAV_I18N.vi;

  const handleLangChange = (newLang) => {
    if (setLang) {
      setLang(newLang);
    }
    localStorage.setItem("maison_vie_lang", newLang);
    
    // Create new search parameters and navigate to current path with updated query
    const params = new URLSearchParams(searchParams.toString());
    params.set("lang", newLang);
    router.push(`${pathname}?${params.toString()}`);
    setLangDropdownOpen(false);
  };

  const handleNavigation = (path, isAnchor = false) => {
    setMobileMenuOpen(false);
    
    const params = new URLSearchParams(searchParams.toString());
    params.set("lang", lang);
    const queryString = params.toString();

    if (isAnchor) {
      if (pathname === "/" || pathname === "") {
        const element = document.getElementById(path.replace("#", ""));
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        router.push(`/?${queryString}${path}`);
      }
    } else {
      router.push(`${path}?${queryString}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 glassmorphism border-b border-white/5 transition-premium">
      <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
        
        {/* LOGO */}
        <div className="flex items-center cursor-pointer" onClick={() => handleNavigation("/")}>
          <img 
            src="https://www.maisonvie.vn/wp-content/uploads/2020/04/logo2-1-e1588240588705.png" 
            alt="Maison Vie Logo" 
            className="h-14 w-auto object-contain hover:scale-[1.03] transition-premium" 
          />
        </div>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden md:flex items-center space-x-8 text-[12px] uppercase tracking-widest font-semibold text-stone-300">
          
          {/* Trang Chủ */}
          <button 
            onClick={() => handleNavigation("/")} 
            className={`hover:text-gold-500 transition-premium cursor-pointer ${pathname === "/" ? "text-gold-500 font-bold" : ""}`}
          >
            {t.home}
          </button>

          {/* Dropdown 1: Thực Đơn */}
          <div className="relative group py-4">
            <button className="flex items-center space-x-1 hover:text-gold-500 transition-premium cursor-pointer">
              <span>{t.menu}</span>
              <span className="text-[7px] text-gold-500/70 group-hover:rotate-180 transition-transform duration-300">▼</span>
            </button>
            
            {/* Dropdown panel */}
            <div className="absolute left-1/2 -translate-x-1/2 mt-1 w-48 glassmorphism border border-white/10 rounded shadow-2xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
              <button
                onClick={() => handleNavigation("/menu")}
                className={`w-full text-left px-5 py-3 text-[11px] uppercase tracking-wider block hover:bg-white/5 hover:text-gold-500 hover:pl-6 transition-all duration-300 ${pathname === "/menu" ? "text-gold-500 font-bold bg-gold-500/10" : "text-stone-300"}`}
              >
                {t.alacarte}
              </button>
              <button
                onClick={() => handleNavigation("/menu/set-menu")}
                className={`w-full text-left px-5 py-3 text-[11px] uppercase tracking-wider block hover:bg-white/5 hover:text-gold-500 hover:pl-6 transition-all duration-300 ${pathname === "/menu/set-menu" ? "text-gold-500 font-bold bg-gold-500/10" : "text-stone-300"}`}
              >
                {t.setmenu}
              </button>
              <button
                onClick={() => handleNavigation("/menu/drinks")}
                className={`w-full text-left px-5 py-3 text-[11px] uppercase tracking-wider block hover:bg-white/5 hover:text-gold-500 hover:pl-6 transition-all duration-300 ${pathname === "/menu/drinks" ? "text-gold-500 font-bold bg-gold-500/10" : "text-stone-300"}`}
              >
                {t.drinks}
              </button>
            </div>
          </div>

          {/* Hầm Rượu */}
          <button 
            onClick={() => handleNavigation("/wine-list")} 
            className={`hover:text-gold-500 transition-premium cursor-pointer ${pathname === "/wine-list" ? "text-gold-500 font-bold" : ""}`}
          >
            {t.wine}
          </button>

          {/* Dropdown 2: Đặc Quyền & Sự Kiện */}
          <div className="relative group py-4">
            <button className="flex items-center space-x-1 hover:text-gold-500 transition-premium cursor-pointer">
              <span>{t.privileges}</span>
              <span className="text-[7px] text-gold-500/70 group-hover:rotate-180 transition-transform duration-300">▼</span>
            </button>
            
            {/* Dropdown panel */}
            <div className="absolute left-1/2 -translate-x-1/2 mt-1 w-56 glassmorphism border border-white/10 rounded shadow-2xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
              <button
                onClick={() => handleNavigation("/offers")}
                className={`w-full text-left px-5 py-3 text-[11px] uppercase tracking-wider block hover:bg-white/5 hover:text-gold-500 hover:pl-6 transition-all duration-300 ${pathname === "/offers" ? "text-gold-500 font-bold bg-gold-500/10" : "text-stone-300"}`}
              >
                {t.offers}
              </button>
              <button
                onClick={() => handleNavigation("/upcoming-events")}
                className={`w-full text-left px-5 py-3 text-[11px] uppercase tracking-wider block hover:bg-white/5 hover:text-gold-500 hover:pl-6 transition-all duration-300 ${pathname === "/upcoming-events" ? "text-gold-500 font-bold bg-gold-500/10" : "text-stone-300"}`}
              >
                {t.events}
              </button>
              <button
                onClick={() => handleNavigation("/partners")}
                className={`w-full text-left px-5 py-3 text-[11px] uppercase tracking-wider block hover:bg-white/5 hover:text-gold-500 hover:pl-6 transition-all duration-300 ${pathname === "/partners" ? "text-gold-500 font-bold bg-gold-500/10" : "text-stone-300"}`}
              >
                {t.partners}
              </button>
              <button
                onClick={() => handleNavigation("/membership")}
                className={`w-full text-left px-5 py-3 text-[11px] uppercase tracking-wider block hover:bg-white/5 hover:text-gold-500 hover:pl-6 transition-all duration-300 ${pathname === "/membership" ? "text-gold-500 font-bold bg-gold-500/10" : "text-stone-300"}`}
              >
                {t.membership}
              </button>
              <button
                onClick={() => handleNavigation("/gallery")}
                className={`w-full text-left px-5 py-3 text-[11px] uppercase tracking-wider block hover:bg-white/5 hover:text-gold-500 hover:pl-6 transition-all duration-300 ${pathname === "/gallery" ? "text-gold-500 font-bold bg-gold-500/10" : "text-stone-300"}`}
              >
                {t.gallery}
              </button>
            </div>
          </div>

          {/* Bếp Trưởng */}
          <button 
            onClick={() => handleNavigation("#chef", true)} 
            className="hover:text-gold-500 transition-premium cursor-pointer"
          >
            {t.chef}
          </button>

          {/* Liên Hệ */}
          <button 
            onClick={() => handleNavigation("/contact")} 
            className={`hover:text-gold-500 transition-premium cursor-pointer ${pathname === "/contact" ? "text-gold-500 font-bold" : ""}`}
          >
            {t.contact}
          </button>
        </nav>

        {/* LANG SELECTOR & BOOKING CTA */}
        <div className="hidden md:flex items-center space-x-6">
          
          {/* Custom Interactive Language Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center space-x-2 text-[12px] font-semibold text-stone-300 uppercase tracking-widest px-3 py-2 rounded border border-white/10 hover:border-gold-500/30 transition-premium cursor-pointer"
            >
              <span>🌐 {lang}</span>
              <span className="text-[8px] text-gold-500">▼</span>
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 glassmorphism rounded shadow-2xl border border-white/10 overflow-hidden z-50 animate-fade-in">
                {Object.keys(NAV_I18N).map((l) => (
                  <button
                    key={l}
                    onClick={() => handleLangChange(l)}
                    className={`w-full text-left px-4 py-2.5 text-[11px] uppercase tracking-wider transition-premium block cursor-pointer ${
                      lang === l ? "bg-gold-500/20 text-gold-500 font-bold" : "text-stone-300 hover:bg-white/5 hover:text-stone-100"
                    }`}
                  >
                    {l === "vi" ? "Tiếng Việt" : 
                     l === "en" ? "English" : 
                     l === "fr" ? "Français" : 
                     l === "ja" ? "日本語" : 
                     l === "ko" ? "한국어" : "繁體中文 (香港)"}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Premium CTA Button */}
          <button 
            onClick={() => handleNavigation("#booking", true)}
            className="text-[12px] uppercase tracking-widest font-semibold bg-gold-500 text-dark-500 px-6 py-3.5 hover:bg-gold-400 hover:scale-[1.02] shadow-[0_0_15px_rgba(197,165,90,0.2)] transition-premium cursor-pointer"
          >
            {t.booking}
          </button>
        </div>

        {/* MOBILE HAMBURGER BUTTON */}
        <div className="md:hidden flex items-center space-x-4">
          {/* Lang code label */}
          <button 
            onClick={() => handleLangChange(lang === "vi" ? "en" : lang === "en" ? "fr" : "vi")}
            className="text-[11px] font-bold text-gold-500 border border-gold-500/30 px-2 py-1 rounded"
          >
            🌐 {lang.toUpperCase()}
          </button>
          
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-stone-200 hover:text-gold-500 focus:outline-none cursor-pointer"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* MOBILE MENU DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/5 bg-dark-400/98 backdrop-blur-lg absolute top-24 left-0 w-full z-40 max-h-[85vh] overflow-y-auto animate-fade-in shadow-2xl">
          <div className="px-6 py-8 flex flex-col space-y-6 text-stone-300 text-sm font-semibold uppercase tracking-widest">
            
            {/* Trang Chủ */}
            <button 
              onClick={() => handleNavigation("/")} 
              className={`text-left pb-2 border-b border-white/5 hover:text-gold-500 transition-premium ${pathname === "/" ? "text-gold-500" : ""}`}
            >
              {t.home}
            </button>

            {/* Collapsible: Thực Đơn */}
            <div className="flex flex-col border-b border-white/5 pb-2">
              <button 
                onClick={() => setMobileMenuExpanded(!mobileMenuExpanded)}
                className="flex items-center justify-between text-left hover:text-gold-500 transition-premium"
              >
                <span>{t.menu}</span>
                <span>{mobileMenuExpanded ? "▲" : "▼"}</span>
              </button>
              
              {mobileMenuExpanded && (
                <div className="pl-4 pt-4 flex flex-col space-y-4 text-xs tracking-wider normal-case font-medium text-stone-400">
                  <button 
                    onClick={() => handleNavigation("/menu")} 
                    className={`text-left py-1 hover:text-gold-500 ${pathname === "/menu" ? "text-gold-500 font-bold" : ""}`}
                  >
                    ✦ {t.alacarte}
                  </button>
                  <button 
                    onClick={() => handleNavigation("/menu/set-menu")} 
                    className={`text-left py-1 hover:text-gold-500 ${pathname === "/menu/set-menu" ? "text-gold-500 font-bold" : ""}`}
                  >
                    ✦ {t.setmenu}
                  </button>
                  <button 
                    onClick={() => handleNavigation("/menu/drinks")} 
                    className={`text-left py-1 hover:text-gold-500 ${pathname === "/menu/drinks" ? "text-gold-500 font-bold" : ""}`}
                  >
                    ✦ {t.drinks}
                  </button>
                </div>
              )}
            </div>

            {/* Hầm Rượu */}
            <button 
              onClick={() => handleNavigation("/wine-list")} 
              className={`text-left pb-2 border-b border-white/5 hover:text-gold-500 transition-premium ${pathname === "/wine-list" ? "text-gold-500" : ""}`}
            >
              {t.wine}
            </button>

            {/* Collapsible: Đặc Quyền & Sự Kiện */}
            <div className="flex flex-col border-b border-white/5 pb-2">
              <button 
                onClick={() => setMobilePrivExpanded(!mobilePrivExpanded)}
                className="flex items-center justify-between text-left hover:text-gold-500 transition-premium"
              >
                <span>{t.privileges}</span>
                <span>{mobilePrivExpanded ? "▲" : "▼"}</span>
              </button>
              
              {mobilePrivExpanded && (
                <div className="pl-4 pt-4 flex flex-col space-y-4 text-xs tracking-wider normal-case font-medium text-stone-400">
                  <button 
                    onClick={() => handleNavigation("/offers")} 
                    className={`text-left py-1 hover:text-gold-500 ${pathname === "/offers" ? "text-gold-500 font-bold" : ""}`}
                  >
                    ✦ {t.offers}
                  </button>
                  <button 
                    onClick={() => handleNavigation("/upcoming-events")} 
                    className={`text-left py-1 hover:text-gold-500 ${pathname === "/upcoming-events" ? "text-gold-500 font-bold" : ""}`}
                  >
                    ✦ {t.events}
                  </button>
                  <button 
                    onClick={() => handleNavigation("/partners")} 
                    className={`text-left py-1 hover:text-gold-500 ${pathname === "/partners" ? "text-gold-500 font-bold" : ""}`}
                  >
                    ✦ {t.partners}
                  </button>
                  <button 
                    onClick={() => handleNavigation("/membership")} 
                    className={`text-left py-1 hover:text-gold-500 ${pathname === "/membership" ? "text-gold-500 font-bold" : ""}`}
                  >
                    ✦ {t.membership}
                  </button>
                  <button 
                    onClick={() => handleNavigation("/gallery")} 
                    className={`text-left py-1 hover:text-gold-500 ${pathname === "/gallery" ? "text-gold-500 font-bold" : ""}`}
                  >
                    ✦ {t.gallery}
                  </button>
                </div>
              )}
            </div>

            {/* Bếp Trưởng */}
            <button 
              onClick={() => handleNavigation("#chef", true)} 
              className="text-left pb-2 border-b border-white/5 hover:text-gold-500 transition-premium"
            >
              {t.chef}
            </button>

            {/* Liên Hệ */}
            <button 
              onClick={() => handleNavigation("/contact")} 
              className={`text-left pb-2 border-b border-white/5 hover:text-gold-500 transition-premium ${pathname === "/contact" ? "text-gold-500" : ""}`}
            >
              {t.contact}
            </button>

            {/* Multi-language Selector (Inline on Mobile) */}
            <div className="flex flex-col space-y-2 border-b border-white/5 pb-4">
              <span className="text-stone-500 text-[10px] uppercase tracking-wider">{t.selectLang}</span>
              <div className="grid grid-cols-3 gap-2">
                {Object.keys(NAV_I18N).map((l) => (
                  <button
                    key={l}
                    onClick={() => handleLangChange(l)}
                    className={`px-2 py-2 text-[10px] text-center border rounded transition-premium ${
                      lang === l ? "border-gold-500 bg-gold-500/10 text-gold-500 font-bold" : "border-white/5 text-stone-400"
                    }`}
                  >
                    {l === "vi" ? "VI" : 
                     l === "en" ? "EN" : 
                     l === "fr" ? "FR" : 
                     l === "ja" ? "JA" : 
                     l === "ko" ? "KO" : "HK"}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <button 
              onClick={() => handleNavigation("#booking", true)}
              className="w-full text-center text-[12px] uppercase tracking-widest font-semibold bg-gold-500 text-dark-500 py-4 hover:bg-gold-400 transition-premium shadow-[0_0_15px_rgba(197,165,90,0.2)]"
            >
              {t.booking}
            </button>

          </div>
        </div>
      )}
    </header>
  );
}
