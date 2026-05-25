"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

const I18N = {
  vi: {
    wineTitle: "Hầm Rượu Thượng Hạng",
    wineSubtitle: "Tuyển chọn những niên vụ độc bản từ các điền trang danh giá thế giới",
    filterAll: "Tất Cả",
    filterFrance: "Pháp",
    filterItaly: "Ý",
    filterNewWorld: "Thế giới mới",
    labelGrape: "Giống nho",
    labelRegion: "Vùng nho",
    labelCountry: "Quốc gia",
    labelVintage: "Niên vụ",
    labelVolume: "Dung tích",
    priceDineIn: "Dùng tại sảnh",
    priceTakeaway: "Mang về",
    btnReserve: "Đặt bàn và chọn rượu ngay",
    btnBack: "Quay lại trang chủ",
    loading: "Đang tải danh sách rượu vang...",
    empty: "Hiện chưa có chai rượu nào trong danh mục này."
  },
  en: {
    wineTitle: "Grand Wine Cellar",
    wineSubtitle: "A curated collection of exceptional vintages from world-renowned estates",
    filterAll: "All Wines",
    filterFrance: "France",
    filterItaly: "Italy",
    filterNewWorld: "New World",
    labelGrape: "Grape Variety",
    labelRegion: "Region",
    labelCountry: "Country",
    labelVintage: "Vintage",
    labelVolume: "Volume",
    priceDineIn: "Dine-in",
    priceTakeaway: "Takeaway",
    btnReserve: "Book a table now",
    btnBack: "Back to Home",
    loading: "Loading wine list...",
    empty: "No wines available in this category."
  },
  fr: {
    wineTitle: "La Cave d'Exception",
    wineSubtitle: "Une sélection rigoureuse de millésimes rares des plus grands châteaux",
    filterAll: "Tous les Vins",
    filterFrance: "France",
    filterItaly: "Italie",
    filterNewWorld: "Nouveau Monde",
    labelGrape: "Cépage",
    labelRegion: "Région",
    labelCountry: "Pays",
    labelVintage: "Millésime",
    labelVolume: "Contenance",
    priceDineIn: "Sur Place",
    priceTakeaway: "À Emporter",
    btnReserve: "Réserver une table",
    btnBack: "Retour à l'accueil",
    loading: "Chargement de la cave...",
    empty: "Aucun vin disponible dans cette catégorie."
  },
  ja: {
    wineTitle: "グランド・ワインセラー",
    wineSubtitle: "世界の名門ワイナリーから厳選された特別限定ヴィンテージのコレクション",
    filterAll: "すべてのワイン",
    filterFrance: "フランス",
    filterItaly: "イタリア",
    filterNewWorld: "ニューワールド",
    labelGrape: "ぶどう品種",
    labelRegion: "産地",
    labelCountry: "国",
    labelVintage: "ヴィンテージ",
    labelVolume: "容量",
    priceDineIn: "店内利用",
    priceTakeaway: "テイクアウト",
    allergensTitle: "アレルゲン情報:",
    btnReserve: "今すぐご予約",
    btnBack: "ホームに戻る",
    loading: "ワインリストを読み込み中...",
    empty: "このカテゴリーのワインは現在ございません。"
  },
  ko: {
    wineTitle: "그랜드 와인 셀러",
    wineSubtitle: "세계 명문 양조장에서 엄선한 독점 빈티지 컬렉션",
    filterAll: "전체 와인",
    filterFrance: "프랑스",
    filterItaly: "이탈리아",
    filterNewWorld: "신대륙 와인",
    labelGrape: "품종",
    labelRegion: "생산 지역",
    labelCountry: "생산국",
    labelVintage: "빈티지",
    labelVolume: "용량",
    priceDineIn: "매장 식사",
    priceTakeaway: "포장",
    btnReserve: "예약하기",
    btnBack: "홈으로 돌아가기",
    loading: "와인 목록을 불러오는 중...",
    empty: "이 카테고리에 제공되는 와인이 없습니다."
  }
};

function WineContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const lang = searchParams.get("lang") || "vi";

  const [wines, setWines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");

  const t = I18N[lang] || I18N.vi;

  useEffect(() => {
    async function fetchWines() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("wines")
          .select("*")
          .eq("available", true);

        if (error) throw error;
        setWines(data || []);
      } catch (err) {
        console.error("Error loading wines:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchWines();
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

  const filteredWines = wines.filter((wine) => {
    if (activeFilter === "All") return true;
    const country = (wine.country || "").toLowerCase();
    if (activeFilter === "France") return country.includes("france") || country.includes("pháp");
    if (activeFilter === "Italy") return country.includes("italy") || country.includes("ý");
    if (activeFilter === "NewWorld") {
      return !country.includes("france") && !country.includes("pháp") && !country.includes("italy") && !country.includes("ý");
    }
    return true;
  });

  return (
    <div className="flex flex-col min-h-screen bg-dark-500 font-sans">
      
      {/* HEADER */}
      <header className="sticky top-0 z-50 glassmorphism border-b border-white/5 h-24 flex items-center justify-between px-6">
        <div className="flex items-center cursor-pointer" onClick={() => router.push(`/?lang=${lang}`)}>
          <img 
            src="https://www.maisonvie.vn/wp-content/uploads/2020/04/logo2-1-e1588240588705.png" 
            alt="Maison Vie Logo" 
            className="h-14 w-auto object-contain hover:scale-[1.03] transition-premium" 
          />
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

      {/* HERO */}
      <section className="relative py-20 text-center bg-gradient-to-b from-dark-400 to-dark-500 border-b border-white/5">
        <div className="max-w-4xl mx-auto px-6">
          <span className="text-[10px] uppercase tracking-[0.3em] text-gold-500 font-semibold mb-4 block">La Cave Royale</span>
          <h1 className="text-5xl md:text-6xl font-light tracking-tight text-gold-500 gold-text-gradient font-luxury mb-6">
            {t.wineTitle}
          </h1>
          <p className="text-stone-300 font-light text-lg max-w-xl mx-auto leading-relaxed">
            {t.wineSubtitle}
          </p>
        </div>
      </section>

      {/* FILTERS */}
      <section className="py-10 sticky top-24 z-40 bg-dark-500/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-4xl mx-auto px-6 flex flex-wrap items-center justify-center gap-3">
          {[
            { code: "All", name: t.filterAll },
            { code: "France", name: t.filterFrance },
            { code: "Italy", name: t.filterItaly },
            { code: "NewWorld", name: t.filterNewWorld }
          ].map((cat) => (
            <button
              key={cat.code}
              onClick={() => setActiveFilter(cat.code)}
              className={`text-xs uppercase tracking-widest px-6 py-3 border transition-premium rounded-full font-semibold ${
                activeFilter === cat.code 
                  ? "bg-gold-500 border-gold-500 text-dark-500 shadow-[0_0_15px_rgba(197,165,90,0.2)]" 
                  : "bg-black/20 border-white/5 text-stone-300 hover:border-gold-500/30"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* WINE LIST */}
      <section className="py-20 flex-1">
        <div className="max-w-5xl mx-auto px-6">
          
          {loading ? (
            <div className="text-center py-20 animate-fade-in text-gold-500 text-sm tracking-widest font-semibold uppercase">
              {t.loading}
            </div>
          ) : filteredWines.length === 0 ? (
            <div className="text-center py-20 text-stone-500 text-sm italic">
              {t.empty}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-12">
              {filteredWines.map((wine) => (
                <div 
                  key={wine.id} 
                  className="glassmorphism p-8 border border-white/5 hover:border-gold-500/20 transition-premium shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative overflow-hidden"
                >
                  
                  {/* Content */}
                  <div className="flex-1 text-left">
                    <h3 className="text-2xl font-light text-stone-100 font-luxury tracking-wide mb-4">
                      {getTranslatedValue(wine.name)}
                    </h3>

                    {/* Wine specs grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-light text-stone-400">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-stone-500 block mb-0.5">{t.labelGrape}</span>
                        <span className="text-stone-300 font-medium">{wine.grape_variety || "-"}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-stone-500 block mb-0.5">{t.labelRegion}</span>
                        <span className="text-stone-300 font-medium">{wine.region || "-"}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-stone-500 block mb-0.5">{t.labelCountry}</span>
                        <span className="text-stone-300 font-medium">{wine.country || "-"}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-stone-500 block mb-0.5">{t.labelVintage}</span>
                        <span className="text-gold-400 font-bold font-luxury text-sm">{wine.vintage || "-"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing and Volume */}
                  <div className="flex flex-col items-end shrink-0 w-full md:w-auto pt-6 md:pt-0 border-t md:border-t-0 md:border-l border-white/5 md:pl-8 text-right gap-3">
                    <div className="flex flex-col">
                      <span className="text-2xl font-semibold text-gold-500 font-luxury">
                        {formatPrice(wine.price_dine_in)}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider text-stone-500">
                        {t.priceDineIn} ({wine.volume || "750ml"})
                      </span>
                    </div>

                    {wine.price_takeaway > 0 && (
                      <div className="flex flex-col opacity-60">
                        <span className="text-lg font-light text-stone-300">
                          {formatPrice(wine.price_takeaway)}
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

      {/* CTA */}
      <section className="py-24 bg-dark-400 border-t border-white/5 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <span className="text-[11px] uppercase tracking-[0.3em] text-gold-500 font-semibold mb-4 block">Réservations</span>
          <h2 className="text-3xl md:text-4xl font-light tracking-tight text-stone-100 font-luxury mb-8">
            Trải nghiệm hương vị đẳng cấp thế giới
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

export default function WineList() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-dark-500 text-gold-500 tracking-widest text-sm uppercase">
        Loading...
      </div>
    }>
      <WineContent />
    </Suspense>
  );
}
