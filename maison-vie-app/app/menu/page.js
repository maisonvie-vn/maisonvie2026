"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import Header from "@/components/Header";

const I18N = {
  vi: {
    menuTitle: "Thực Đơn Tinh Hoa",
    menuSubtitle: "Sự thăng hoa của kỹ nghệ Pháp và nguồn nguyên liệu Việt",
    categoryAll: "Tất Cả",
    categoryAppetizer: "Khai Vị Lạnh",
    categorySoup: "Khai Vị Nóng",
    categoryMain: "Món Chính",
    categoryDessert: "Món Tráng Miệng",
    priceLabel: "Giá",
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
    categoryAppetizer: "Cold Starters",
    categorySoup: "Hot Starters",
    categoryMain: "Main Courses",
    categoryDessert: "Desserts",
    priceLabel: "Price",
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
    categoryAppetizer: "Entrées Froides",
    categorySoup: "Entrées Chaudes",
    categoryMain: "Plats Principaux",
    categoryDessert: "Desserts",
    priceLabel: "Tarif",
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
    categoryAppetizer: "冷前菜",
    categorySoup: "温前菜",
    categoryMain: "メインディッシュ",
    categoryDessert: "デザート",
    priceLabel: "価格",
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
    categoryAppetizer: "냉전식",
    categorySoup: "온전식",
    categoryMain: "메인 요리",
    categoryDessert: "디저트",
    priceLabel: "가격",
    allergensTitle: "알레르기 유발 물질:",
    btnReserve: "예약하기",
    btnBack: "홈으로 돌아가기",
    loading: "메뉴를 불러오는 중...",
    empty: "이 카테고리에 제공되는 요리가 없습니다."
  },
  hk: {
    menuTitle: "精選美食菜單",
    menuSubtitle: "法國廚藝與越南本土食材的精妙交融",
    categoryAll: "全部",
    categoryAppetizer: "冷前菜",
    categorySoup: "熱前菜",
    categoryMain: "主菜系列",
    categoryDessert: "完美甜點",
    priceLabel: "價格",
    allergensTitle: "所含過敏原資訊:",
    btnReserve: "立即預訂席位",
    btnBack: "返回主頁",
    loading: "正在載入菜單...",
    empty: "此類別目前暫無菜單提供。"
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
    const k = Math.round(value / 1000);
    return new Intl.NumberFormat('vi-VN').format(k);
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
      <Header lang={lang} />

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

      <section className="py-20 flex-1">
        <div className="max-w-5xl mx-auto px-6">
          
          {loading ? (
            <div className="text-center py-20 animate-fade-in text-gold-500 text-sm tracking-widest font-semibold uppercase">
              {t.loading}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-20 text-stone-500 text-sm italic">
              {t.empty}
            </div>          ) : (
            <div className="divide-y divide-white/5 border border-white/5 rounded-sm">
              {filteredItems.map((item) => {
                const frenchName = item.name?.fr;
                const displayName = getTranslatedValue(item.name);
                const displayDesc = getTranslatedValue(item.description);
                const allergenList = item.menu_item_allergens
                  ?.map(a => getTranslatedValue(a.allergen_categories?.name, a.allergen_categories?.code))
                  .filter(Boolean) || [];

                return (
                  <div
                    key={item.id}
                    className="group flex items-start justify-between gap-8 px-8 py-6 hover:bg-white/[0.02] transition-colors duration-200"
                  >
                    {/* Left: name + description + allergens */}
                    <div className="flex-1 min-w-0">
                      {/* French subtitle */}
                      {frenchName && (
                        <p className="text-[14px] font-bold text-stone-100 tracking-wider mb-1 font-sans">
                          {frenchName}
                          {item.seasonal_flag && (
                            <span className="not-italic ml-3 text-[8px] uppercase tracking-widest text-gold-400/50 border border-gold-500/15 px-1.5 py-0.5">
                              Saison
                            </span>
                          )}
                        </p>
                      )}

                      {/* Main name */}
                      <h3 className="text-[17px] italic font-light text-stone-100 font-luxury tracking-wide leading-snug mb-2 group-hover:text-gold-200 transition-colors duration-200">
                        {displayName}
                      </h3>

                      {/* Description — single language */}
                      {displayDesc && (
                        <p className="text-[14.5px] text-gold-500/70 font-sans font-light leading-relaxed mb-3 max-w-lg">
                          {displayDesc}
                        </p>
                      )}

                      {/* Allergens — inline, discreet */}
                      {allergenList.length > 0 && (
                        <p className="text-[13px] text-stone-100 font-sans tracking-wide">
                          <span className="font-bold text-gold-500">Dị Ứng:</span>{' '}
                          {allergenList.join(' · ')}
                        </p>
                      )}
                    </div>

                    {/* Right: price */}
                    <div className="shrink-0 text-right pt-1">
                      <span className="text-[20.5px] font-light text-gold-500 font-luxury tracking-wide tabular-nums">
                        {formatPrice(item.price_dine_in)}
                      </span>
                    </div>
                  </div>
                );
              })}
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
        <p>© 2026 Maison Vie. All rights reserved. French Culinary Excellence.</p>
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
