"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

const I18N = {
  vi: {
    menuTitle: "Thực Đơn Tinh Hoa",
    menuSubtitle: "Sự thăng hoa của kỹ nghệ Pháp và nguồn nguyên liệu Việt",
    categoryAll: "Tất Cả",
    categoryAppetizer: "Món Khai Vị",
    categorySoup: "Súp Kinh Điển",
    categoryMain: "Món Chính",
    categoryDessert: "Món Tráng Miệng",
    priceDineIn: "Dùng tại sảnh",
    priceTakeaway: "Mang về",
    allergensTitle: "Cảnh báo chất dị ứng (EU Standard):",
    btnReserve: "Đặt bàn thưởng thức ngay",
    btnBack: "Quay lại trang chủ",
    loading: "Đang tải thực đơn...",
    empty: "Hiện chưa có món ăn nào trong danh mục này."
  },
  en: {
    menuTitle: "Signature Menu",
    menuSubtitle: "The sublime marriage of French arts and Vietnamese ingredients",
    categoryAll: "All",
    categoryAppetizer: "Appetizers",
    categorySoup: "Soups",
    categoryMain: "Main Courses",
    categoryDessert: "Desserts",
    priceDineIn: "Dine-in",
    priceTakeaway: "Takeaway",
    allergensTitle: "Contains Allergen(s):",
    btnReserve: "Book a table now",
    btnBack: "Back to Home",
    loading: "Loading menu...",
    empty: "No items available in this category."
  },
  fr: {
    menuTitle: "La Carte Gastronomique",
    menuSubtitle: "L'harmonie entre le savoir-faire français et le terroir vietnamien",
    categoryAll: "Tout",
    categoryAppetizer: "Entrées",
    categorySoup: "Soupes",
    categoryMain: "Plats Principaux",
    categoryDessert: "Desserts",
    priceDineIn: "Sur Place",
    priceTakeaway: "À Emporter",
    allergensTitle: "Allergène(s) présent(s):",
    btnReserve: "Réserver une table",
    btnBack: "Retour à l'accueil",
    loading: "Chargement de la carte...",
    empty: "Aucun plat disponible dans cette catégorie."
  },
  ja: {
    menuTitle: "美食メニュー",
    menuSubtitle: "フランスの技術とベトナムの厳選食材の融合",
    categoryAll: "すべて",
    categoryAppetizer: "前菜",
    categorySoup: "スープ",
    categoryMain: "メインディッシュ",
    categoryDessert: "デザート",
    priceDineIn: "店内利用",
    priceTakeaway: "テイクアウト",
    allergensTitle: "アレルゲン情報:",
    btnReserve: "今すぐご予約",
    btnBack: "ホームに戻る",
    loading: "メニューを読み込み中...",
    empty: "このカテゴリーのメニューは現在ございません。"
  },
  ko: {
    menuTitle: "시그니처 메뉴",
    menuSubtitle: "프랑스의 전통 기술과 베트남 천연 식재료의 조화",
    categoryAll: "전체",
    categoryAppetizer: "에피타이저",
    categorySoup: "수프",
    categoryMain: "메인 요리",
    categoryDessert: "디저트",
    priceDineIn: "매장 식사",
    priceTakeaway: "포장",
    allergensTitle: "알레르기 유발 물질:",
    btnReserve: "예약하기",
    btnBack: "홈으로 돌아가기",
    loading: "메뉴를 불러오는 중...",
    empty: "이 카테고리에 제공되는 요리가 없습니다."
  }
};

function MenuContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const lang = searchParams.get("lang") || "vi";
  
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  const t = I18N[lang] || I18N.vi;

  useEffect(() => {
    async function fetchMenu() {
      setLoading(true);
      try {
        // Fetch menu items with their related allergens joined
        const { data, error } = await supabase
          .from("menu_items")
          .select(`
            *,
            menu_item_allergens (
              allergen_categories (
                code,
                name
              )
            )
          `)
          .eq("is_active", true);

        if (error) throw error;
        setItems(data || []);
      } catch (err) {
        console.error("Error loading menu:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchMenu();
  }, []);

  const formatPrice = (value) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" })
      .format(value)
      .replace("₫", "đ");
  };

  const getTranslatedValue = (jsonbField, fallback = "") => {
    if (!jsonbField) return fallback;
    return jsonbField[lang] || jsonbField["vi"] || jsonbField["en"] || fallback;
  };

  const mapCategory = (dbCategory) => {
    // Normalizing DB categories to standard codes
    const cat = dbCategory.toLowerCase();
    if (cat.includes("appetizer") || cat.includes("khai vị")) return "Appetizer";
    if (cat.includes("soup") || cat.includes("súp")) return "Soup";
    if (cat.includes("main") || cat.includes("chính")) return "Main Course";
    if (cat.includes("dessert") || cat.includes("tráng miệng")) return "Dessert";
    return "Side dish";
  };

  // Filter items
  const filteredItems = items.filter((item) => {
    if (activeCategory === "All") return true;
    return mapCategory(item.category) === activeCategory;
  });

  return (
    <div className="flex flex-col min-h-screen bg-dark-500 font-sans">
      
      {/* HEADER / NAVIGATION */}
      <header className="sticky top-0 z-50 glassmorphism border-b border-white/5 h-24 flex items-center justify-between px-6">
        <div className="flex flex-col cursor-pointer" onClick={() => router.push(`/?lang=${lang}`)}>
          <span className="text-xl font-semibold tracking-wider text-gold-500 font-luxury uppercase">Maison Vie</span>
          <span className="text-[9px] uppercase tracking-[0.25em] text-stone-400 font-sans -mt-1">Haute Cuisine</span>
        </div>

        <div className="flex items-space-x-4">
          <button 
            onClick={() => router.push(`/?lang=${lang}`)}
            className="text-[12px] uppercase tracking-widest font-semibold border border-white/10 text-stone-300 px-4 py-2.5 hover:border-gold-500/30 transition-premium"
          >
            {t.btnBack}
          </button>
        </div>
      </header>

      {/* HERO / INTRO */}
      <section className="relative py-20 text-center bg-gradient-to-b from-dark-400 to-dark-500 border-b border-white/5">
        <div className="max-w-4xl mx-auto px-6">
          <span className="text-[10px] uppercase tracking-[0.3em] text-gold-500 font-semibold mb-4 block">Gastronomie d'Exception</span>
          <h1 className="text-5xl md:text-6xl font-light tracking-tight text-gold-500 gold-text-gradient font-luxury mb-6">
            {t.menuTitle}
          </h1>
          <p className="text-stone-300 font-light text-lg max-w-xl mx-auto leading-relaxed">
            {t.menuSubtitle}
          </p>
        </div>
      </section>

      {/* FILTER TABS */}
      <section className="py-10 sticky top-24 z-40 bg-dark-500/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-4xl mx-auto px-6 flex flex-wrap items-center justify-center gap-3">
          {[
            { code: "All", name: t.categoryAll },
            { code: "Appetizer", name: t.categoryAppetizer },
            { code: "Soup", name: t.categorySoup },
            { code: "Main Course", name: t.categoryMain },
            { code: "Dessert", name: t.categoryDessert }
          ].map((cat) => (
            <button
              key={cat.code}
              onClick={() => setActiveCategory(cat.code)}
              className={`text-xs uppercase tracking-widest px-6 py-3 border transition-premium rounded-full font-semibold ${
                activeCategory === cat.code 
                  ? "bg-gold-500 border-gold-500 text-dark-500 shadow-[0_0_15px_rgba(197,165,90,0.2)]" 
                  : "bg-black/20 border-white/5 text-stone-300 hover:border-gold-500/30"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* MENU LIST SECTION */}
      <section className="py-20 flex-1">
        <div className="max-w-5xl mx-auto px-6">
          
          {loading ? (
            <div className="text-center py-20 animate-fade-in text-gold-500 text-sm tracking-widest font-semibold uppercase">
              {t.loading}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-20 text-stone-500 text-sm italic">
              {t.empty}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-12">
              {filteredItems.map((item) => (
                <div 
                  key={item.id} 
                  className="glassmorphism p-8 border border-white/5 hover:border-gold-500/20 transition-premium shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative overflow-hidden"
                >
                  
                  {/* Left: Content */}
                  <div className="flex-1 text-left">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-2xl font-light text-stone-100 font-luxury tracking-wide">
                        {getTranslatedValue(item.name)}
                      </h3>
                      {item.seasonal_flag && (
                        <span className="text-[9px] uppercase tracking-widest bg-gold-500/20 text-gold-400 border border-gold-500/30 px-2 py-0.5 font-bold">
                          Seasonal
                        </span>
                      )}
                    </div>
                    
                    <p className="text-stone-400 text-sm font-light leading-relaxed mb-4 max-w-2xl">
                      {getTranslatedValue(item.description)}
                    </p>

                    {/* Allergens Warn */}
                    {item.menu_item_allergens && item.menu_item_allergens.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2 mt-4">
                        <span className="text-[10px] uppercase tracking-wider text-gold-500 font-semibold">
                          {t.allergensTitle}
                        </span>
                        {item.menu_item_allergens.map((allergenObj, idx) => {
                          const allergen = allergenObj.allergen_categories;
                          return (
                            <span 
                              key={idx}
                              className="text-[10px] bg-red-950/20 border border-red-500/20 text-red-400 px-2 py-0.5 rounded"
                            >
                              {getTranslatedValue(allergen.name, allergen.code)}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Right: Pricing */}
                  <div className="flex flex-col items-end shrink-0 w-full md:w-auto pt-6 md:pt-0 border-t md:border-t-0 md:border-l border-white/5 md:pl-8 text-right gap-3">
                    <div className="flex flex-col">
                      <span className="text-2xl font-semibold text-gold-500 font-luxury">
                        {formatPrice(item.price_dine_in)}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider text-stone-500">
                        {t.priceDineIn}
                      </span>
                    </div>

                    {item.price_takeaway > 0 && (
                      <div className="flex flex-col opacity-60">
                        <span className="text-lg font-light text-stone-300">
                          {formatPrice(item.price_takeaway)}
                        </span>
                        <span className="text-[9px] uppercase tracking-wider text-stone-500">
                          {t.priceTakeaway}
                        </span>
                      </div>
                    )}
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 bg-dark-400 border-t border-white/5 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <span className="text-[11px] uppercase tracking-[0.3em] text-gold-500 font-semibold mb-4 block">Réservations</span>
          <h2 className="text-3xl md:text-4xl font-light tracking-tight text-stone-100 font-luxury mb-8">
            Trải nghiệm ẩm thực Pháp tinh hoa
          </h2>
          <button 
            onClick={() => router.push(`/?lang=${lang}#booking`)}
            className="text-[13px] uppercase tracking-widest font-semibold bg-gold-500 text-dark-500 px-8 py-4.5 hover:bg-gold-400 shadow-[0_0_15px_rgba(197,165,90,0.15)] transition-premium"
          >
            {t.btnReserve}
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black py-8 text-center text-xs text-stone-600 border-t border-white/5">
        <p>© 2026 Maison Vie. All rights reserved. Michelin Culinary Standard.</p>
      </footer>

    </div>
  );
}

export default function Menu() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-dark-500 text-gold-500 tracking-widest text-sm uppercase">
        Loading...
      </div>
    }>
      <MenuContent />
    </Suspense>
  );
}
