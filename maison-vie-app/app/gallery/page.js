"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// 🌐 Multilingual content for Gallery page
const I18N = {
  vi: {
    title: "Thư Viện Hình Ảnh",
    subtitle: "Maison Vie qua từng góc nhìn nghệ thuật",
    desc: "Khám phá không gian kiến trúc Pháp cổ điển đầy kiêu hãnh, các món ăn tinh tế chuẩn Michelin và đội ngũ nhân sự chuyên nghiệp phục vụ trọn vẹn mọi xúc cảm của Quý khách.",
    tabAll: "Tất Cả",
    tabFloors: "Không Gian Sảnh",
    tabVipRooms: "Phòng VIP Riêng Tư",
    tabCuisine: "Ẩm Thực & Đồ Uống",
    tabKitchen: "Khu Bếp Nấu",
    tabTeam: "Đội Ngũ Nhân Sự",
    close: "Đóng",
    next: "Tiếp theo",
    prev: "Trước đó",
  },
  en: {
    title: "Photo Gallery",
    subtitle: "Maison Vie through the lens of art",
    desc: "Explore our proud classical French architecture, meticulously prepared fine dining dishes, and our professional staff dedicated to elevating your dining experience.",
    tabAll: "All Photos",
    tabFloors: "Floors / Halls",
    tabVipRooms: "Private VIP Rooms",
    tabCuisine: "Cuisine & Drinks",
    tabKitchen: "Kitchen Area",
    tabTeam: "Executive Team",
    close: "Close",
    next: "Next",
    prev: "Previous",
  },
  fr: {
    title: "Galerie Photos",
    subtitle: "Maison Vie à través de l'objectif",
    desc: "Découvrez notre architecture néoclassique d'exception, nos créations gastronomiques raffinées et notre équipe dévouée à l'excellence culinaire.",
    tabAll: "Tout",
    tabFloors: "Les Salles",
    tabVipRooms: "Salons Privés",
    tabCuisine: "Gastronomie & Vins",
    tabKitchen: "Cuisine Ouverte",
    tabTeam: "Notre Équipe",
    close: "Fermer",
    next: "Suivant",
    prev: "Précédent",
  }
};

const ALBUM_DATA = [
  // 1. Không gian sảnh (Floors)
  {
    id: "floor-1",
    category: "floors",
    src: "https://i.postimg.cc/HxPJB02F/Tang-1.webp",
    labelVi: "Sảnh Chính Điện Tầng 1",
    labelEn: "Main Dining Hall - 1st Floor",
    labelFr: "Grande Salle - 1er Étage",
    descVi: "Không gian ẩm thực rộng mở ngập tràn ánh sáng và những chi tiết phào chỉ tân cổ điển Pháp tinh tế.",
    descEn: "Open dining space filled with light and exquisite French neoclassical cornices.",
    descFr: "Espace lumineux orné de corniches néoclassiques françaises raffinées."
  },
  {
    id: "floor-2",
    category: "floors",
    src: "https://i.postimg.cc/CKgbq4PL/Anh-Truoc.webp",
    labelVi: "Ban công & Mặt tiền Tầng 2",
    labelEn: "Balcony & Facade - 2nd Floor",
    labelFr: "Balcon & Façade - 2ème Étage",
    descVi: "Điểm nhìn lãng mạn hướng thẳng ra phố cổ Tăng Bạt Hổ đầy cây xanh thơ mộng.",
    descEn: "Romantic viewing spot overlooking the green Tang Bat Ho street.",
    descFr: "Vue romantique sur la rue verdoyante de Tang Bat Ho."
  },
  {
    id: "floor-3",
    category: "floors",
    src: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&q=80&w=1200",
    labelVi: "Sảnh tiệc lớn Tầng 3",
    labelEn: "Grand Banquet Hall - 3rd Floor",
    labelFr: "Grande Salle de Banquet - 3ème Étage",
    descVi: "Không gian tiệc sang trọng đáp ứng quy mô đón tiếp lên tới 250 chỗ ngồi cùng trang thiết bị hiện đại.",
    descEn: "Luxury banquet space catering up to 250 seats with modern facilities.",
    descFr: "Espace événementiel prestigieux pouvant accueillir jusqu'à 250 convives."
  },

  // 2. Phòng VIP riêng tư (VIP Rooms)
  {
    id: "vip-1",
    category: "vip_rooms",
    src: "https://i.postimg.cc/3NskHKzK/VIP-1.webp",
    labelVi: "Phòng VIP 1 (Salon Privé)",
    labelEn: "Private Room 1 - Salon Privé",
    labelFr: "Salon Privé 1",
    descVi: "Không gian kín tiếp khách chính trị gia hoặc ký kết hợp tác thương mại quan trọng bậc nhất.",
    descEn: "Closed space for politicians or high-profile commercial signing ceremonies.",
    descFr: "Espace feutré idéal cho những cuộc gặp gỡ cấp cao hoặc ký kết thương mại."
  },
  {
    id: "vip-2",
    category: "vip_rooms",
    src: "https://i.postimg.cc/cLNhNYqM/Vip-2.webp",
    labelVi: "Phòng VIP 2 (Le Jardin)",
    labelEn: "Private Room 2 - Le Jardin",
    labelFr: "Salon Privé 2 - Le Jardin",
    descVi: "Không gian vườn kính lãng mạn kết hợp cùng thảm thực vật nhiệt đới xanh mướt.",
    descEn: "Romantic glasshouse dining paired with lush tropical flora.",
    descFr: "Véranda romantique bordée d'une végétation tropicale luxuriante."
  },
  {
    id: "vip-3",
    category: "vip_rooms",
    src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1200",
    labelVi: "Phòng VIP 3 (Salon d'Émeraude)",
    labelEn: "Private Room 3 - Emerald Salon",
    labelFr: "Salon Privé 3 - Salon d'Émeraude",
    descVi: "Tông màu xanh ngọc lục bảo hoàng gia mang tới nguồn năng lượng quý phái thịnh vượng.",
    descEn: "Royal emerald green tones delivering noble and prosperous vibes.",
    descFr: "Nuances vert émeraude royales apportant une atmosphère noble et chaleureuse."
  },
  {
    id: "vip-4",
    category: "vip_rooms",
    src: "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&q=80&w=1200",
    labelVi: "Phòng VIP 4 (Salon d'Or)",
    labelEn: "Private Room 4 - Golden Salon",
    labelFr: "Salon Privé 4 - Salon d'Or",
    descVi: "Ánh sáng vàng kim và hệ thống ly pha lê Riedel Vinum chuẩn mực thưởng rượu vang.",
    descEn: "Golden warm lighting and Riedel Vinum crystal glasses for perfect wine sessions.",
    descFr: "Lumières dorées et verres en cristal Riedel Vinum pour une dégustation idéale."
  },

  // 3. Ẩm thực & Đồ uống (Cuisine & Drinks)
  {
    id: "dish-1",
    category: "cuisine_drinks",
    src: "https://i.postimg.cc/Pqq4VyHp/Scallop-Carpaccio-Caviar-Lime.webp",
    labelVi: "Scallop Carpaccio & Caviar",
    labelEn: "Scallop Carpaccio & Caviar",
    labelFr: "Carpaccio de Saint-Jacques au Caviar",
    descVi: "Sò điệp Nhật thái lát mỏng kết hợp cùng chanh ngón tay và trứng cá tầm đen quý hiếm.",
    descEn: "Thinly sliced Japanese scallops paired with finger lime and rare black sturgeon caviar.",
    descFr: "Saint-Jacques japonaises émincées, citron caviar et caviar noir prestigieux."
  },
  {
    id: "dish-2",
    category: "cuisine_drinks",
    src: "https://i.postimg.cc/Hxd7PsXQ/Warm-Seasonal-Souffle-Vanilla-Ice-Cream.png",
    labelVi: "Warm Seasonal Soufflé",
    labelEn: "Warm Seasonal Soufflé",
    labelFr: "Soufflé Chaud de Saison",
    descVi: "Bánh Soufflé nướng nở phồng hoàn hảo ăn kèm kem tươi Vani Madagascar lạnh.",
    descEn: "Perfectly puffed baked Soufflé served with cold Madagascar vanilla ice cream.",
    descFr: "Soufflé chaud parfaitement gonflé, accompagné de glace vanille Bourbon."
  },
  {
    id: "dish-3",
    category: "cuisine_drinks",
    src: "https://i.postimg.cc/vZngY6zs/Vietnamese-Buffalo-Wellington-Mushroom-Duxelles-Phu-Quoc-Pepper-Jus.png",
    labelVi: "Vietnamese Buffalo Wellington",
    labelEn: "Vietnamese Buffalo Wellington",
    labelFr: "Wellington de Buffle du Vietnam",
    descVi: "Thịt thăn trâu nội địa bọc trong lớp nấm Duxelles thơm lừng và bột ngàn lớp Pháp giòn rụm.",
    descEn: "Local buffalo tenderloin wrapped in rich mushroom Duxelles and golden crispy puff pastry.",
    descFr: "Filet de buffle local rôti sous croûte feuilletée et duxelles de champignons."
  },
  {
    id: "dish-4",
    category: "cuisine_drinks",
    src: "https://i.postimg.cc/pTFK3162/Pan-Seared-Wagyu-MBS6-Peanut-Vanilla-Jus-Artichoke-Puree.webp",
    labelVi: "Pan-Seared Wagyu MBS 6-7",
    labelEn: "Pan-Seared Wagyu Beef MBS 6-7",
    labelFr: "Pavé de Bœuf Wagyu MBS 6-7",
    descVi: "Thịt bò Wagyu vân mỡ tuyệt hảo áp chảo, ăn kèm xốt lạc vani độc bản và cụ khoai sọ nghiền mịn.",
    descEn: "Beautifully marbled Wagyu beef seared, served with peanut-vanilla jus and smooth artichoke puree.",
    descFr: "Bœuf Wagyu marbré saisi, jus vanille-arachide et purée d'artichauts crémeuse."
  },
  {
    id: "dish-5",
    category: "cuisine_drinks",
    src: "https://i.postimg.cc/HW2v9ySJ/Seared-Foie-Gras-Seasonal-Fruit-Reduced-Jus.png",
    labelVi: "Seared Foie Gras Classic",
    labelEn: "Pan-Seared French Foie Gras",
    labelFr: "Foie Gras Poêlé Tradition",
    descVi: "Gan ngỗng Pháp béo ngậy áp chảo ăn kèm sốt balsamic trái sung ngọt và bánh brioche nướng bơ.",
    descEn: "Rich French foie gras seared, served with fig balsamic reduction and buttery brioche.",
    descFr: "Foie gras de canard poêlé, réduction balsamique aux figues et brioche dorée."
  },
  {
    id: "drink-1",
    category: "cuisine_drinks",
    src: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=1200",
    labelVi: "Decanter Rượu Vang Grand Cru",
    labelEn: "Grand Cru Wine Decanter Service",
    labelFr: "Service Décantation Grand Cru",
    descVi: "Sommelier thực hiện thở vang trong bình decanter pha lê Riedel trước khi phục vụ.",
    descEn: "Sommelier decanting a fine Grand Cru wine in a Riedel crystal decanter.",
    descFr: "Le sommelier décante un grand cru dans une carafe en cristal Riedel."
  },

  // 4. Khu bếp nấu (Kitchen)
  {
    id: "kitchen-1",
    category: "kitchen",
    src: "https://i.postimg.cc/qR7hsD8d/Bep.webp",
    labelVi: "Gian Bếp Mở L'Art Culinaire",
    labelEn: "L'Art Culinaire Open Kitchen",
    labelFr: "Cuisine Ouverte L'Art Culinaire",
    descVi: "Nơi Bếp trưởng Joel thổi hồn nghệ thuật vào từng công thức ẩm thực độc bản.",
    descEn: "Where Executive Chef Joel infuses culinary art into custom recipes.",
    descFr: "Le théâtre culinaire où le Chef Joël conçoit ses recettes d'exception."
  },
  {
    id: "kitchen-2",
    category: "kitchen",
    src: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=1200",
    labelVi: "Dây Chuyền Chế Biến Nhiệt Độ Thấp",
    labelEn: "Sous-Vide Cook Stations",
    labelFr: "Ligne de Cuisson Sous-Vide",
    descVi: "Các thiết bị nấu chậm sous-vide hiện đại kiểm soát độ chín thịt hoàn hảo đến từng 0.1°C.",
    descEn: "Modern sous-vide slow-cook devices controlling perfect meat doneness within 0.1°C.",
    descFr: "Dispositifs modernes sous-vide contrôlant la cuisson de la viande à 0.1°C près."
  },

  // 5. Đội ngũ nhân sự (Team)
  {
    id: "team-1",
    category: "team",
    src: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=1200",
    labelVi: "Bếp Trưởng Joel & Đội Ngũ Bếp",
    labelEn: "Executive Chef Joel & Kitchen Crew",
    labelFr: "Chef Exécutif Joël & Brigade",
    descVi: "Tập hợp những đầu bếp tài năng luôn cống hiến hết mình cho chất lượng món ăn.",
    descEn: "A gathering of talented chefs committed to outstanding plate execution.",
    descFr: "Une brigade talentueuse dédiée à l'excellence culinaire constante."
  },
  {
    id: "team-2",
    category: "team",
    src: "https://images.unsplash.com/photo-1581579438747-1dc8d1e0ca96?auto=format&fit=crop&q=80&w=1200",
    labelVi: "Dịch Vụ Chuyên Gia Wine Sommelier",
    labelEn: "Wine Sommelier Table Service",
    labelFr: "Service par notre Chef Sommelier",
    descVi: "Hướng dẫn ghép cặp rượu vang Pháp/Ý giúp nâng tầm khẩu vị món ăn trọn vẹn.",
    descEn: "Table-side wine pairing guide to elevate tasting sensations.",
    descFr: "Conseils accords mets-vins pour sublimer les saveurs de chaque plat."
  },
  {
    id: "team-3",
    category: "team",
    src: "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&q=80&w=1200",
    labelVi: "Đội ngũ Lễ Tân FOH Chuyên Nghiệp",
    labelEn: "Front of House Reception Team",
    labelFr: "Équipe d'Accueil & Maître d'",
    descVi: "Chào đón quý khách bằng nụ cười thân thiện cùng tác phong phục vụ chuẩn mực quý tộc Pháp.",
    descEn: "Welcoming guests with warm smiles and elite French dining etiquette.",
    descFr: "Un accueil prestigieux suivant les règles de l'art de la table française."
  }
];

function GalleryContent() {
  const searchParams = useSearchParams();
  const lang = searchParams.get("lang") || "vi";
  const t = I18N[lang] || I18N.vi;

  const [activeCategory, setActiveCategory] = useState("all");
  const [lightboxIndex, setLightboxIndex] = useState(null); // null means closed

  // Filter photos based on category tab
  const filteredPhotos = ALBUM_DATA.filter((photo) => {
    if (activeCategory === "all") return true;
    return photo.category === activeCategory;
  });

  const getTranslatedLabel = (photo) => {
    if (lang === "en") return photo.labelEn;
    if (lang === "fr") return photo.labelFr;
    return photo.labelVi;
  };

  const getTranslatedDesc = (photo) => {
    if (lang === "en") return photo.descEn;
    if (lang === "fr") return photo.descFr;
    return photo.descVi;
  };

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIndex === null) return;
      if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "Escape") {
        setLightboxIndex(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, filteredPhotos]);

  const handleNext = () => {
    setLightboxIndex((prevIndex) => {
      if (prevIndex === null) return null;
      return (prevIndex + 1) % filteredPhotos.length;
    });
  };

  const handlePrev = () => {
    setLightboxIndex((prevIndex) => {
      if (prevIndex === null) return null;
      return (prevIndex - 1 + filteredPhotos.length) % filteredPhotos.length;
    });
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
            L'Atmosphère Splendide · Maison Vie
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

      {/* CATEGORIES / TABS */}
      <section className="py-10 sticky top-24 z-40 bg-dark-500/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 flex flex-wrap items-center justify-center gap-3">
          {[
            { code: "all", label: t.tabAll },
            { code: "floors", label: t.tabFloors },
            { code: "vip_rooms", label: t.tabVipRooms },
            { code: "cuisine_drinks", label: t.tabCuisine },
            { code: "kitchen", label: t.tabKitchen },
            { code: "team", label: t.tabTeam }
          ].map((tab) => (
            <button
              key={tab.code}
              onClick={() => {
                setActiveCategory(tab.code);
                setLightboxIndex(null);
              }}
              className={`text-[10px] uppercase tracking-widest px-5 py-3 border transition-premium rounded-full font-semibold cursor-pointer ${
                activeCategory === tab.code 
                  ? "bg-gold-500 border-gold-500 text-dark-500 shadow-[0_0_15px_rgba(197,165,90,0.2)]" 
                  : "bg-black/20 border-white/5 text-stone-300 hover:border-gold-500/30"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* PHOTO MASONRY GRID */}
      <section className="py-20 flex-1">
        <div className="max-w-7xl mx-auto px-6">
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {filteredPhotos.map((photo, index) => {
              const currentCategoryName = 
                photo.category === "floors" ? t.tabFloors :
                photo.category === "vip_rooms" ? t.tabVipRooms :
                photo.category === "cuisine_drinks" ? t.tabCuisine :
                photo.category === "kitchen" ? t.tabKitchen : t.tabTeam;

              return (
                <div
                  key={photo.id}
                  onClick={() => setLightboxIndex(index)}
                  className="break-inside-avoid glassmorphism p-4 border border-white/5 hover:border-gold-500/30 transition-premium group relative cursor-pointer rounded overflow-hidden gold-border-glow shadow-md flex flex-col"
                >
                  {/* Photo container */}
                  <div className="relative w-full overflow-hidden rounded bg-dark-400">
                    <img
                      src={photo.src}
                      alt={getTranslatedLabel(photo)}
                      className="w-full h-auto object-cover group-hover:scale-[1.03] transition-all duration-700 block"
                      loading="lazy"
                    />
                    
                    {/* Hover gold overlay */}
                    <div className="absolute inset-0 bg-gold-950/20 opacity-0 group-hover:opacity-100 transition-premium duration-500 pointer-events-none" />
                  </div>

                  {/* Caption */}
                  <div className="pt-4 text-left">
                    <span className="text-[9px] uppercase tracking-widest text-gold-500 font-bold">
                      {currentCategoryName}
                    </span>
                    <h3 className="text-lg font-light text-stone-200 font-luxury tracking-wide mt-1 group-hover:text-gold-400 transition-premium">
                      {getTranslatedLabel(photo)}
                    </h3>
                    <p className="text-stone-400 text-xs font-light mt-2 leading-relaxed">
                      {getTranslatedDesc(photo)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FULL SCREEN LIGHTBOX MODAL */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center animate-fade-in">
          
          {/* Close button */}
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-6 right-6 text-stone-400 hover:text-gold-400 text-3xl font-light cursor-pointer transition-premium focus:outline-none"
            title={t.close}
          >
            ✕
          </button>

          {/* Navigation Controls */}
          <button
            onClick={handlePrev}
            className="absolute left-4 md:left-8 text-stone-400 hover:text-gold-400 text-4xl md:text-5xl font-light cursor-pointer transition-premium focus:outline-none select-none"
            title={t.prev}
          >
            ‹
          </button>

          <button
            onClick={handleNext}
            className="absolute right-4 md:right-8 text-stone-400 hover:text-gold-400 text-4xl md:text-5xl font-light cursor-pointer transition-premium focus:outline-none select-none"
            title={t.next}
          >
            ›
          </button>

          {/* Large image and details */}
          <div className="max-w-4xl max-h-[80vh] px-6 flex flex-col items-center justify-center">
            <img
              src={filteredPhotos[lightboxIndex].src}
              alt={getTranslatedLabel(filteredPhotos[lightboxIndex])}
              className="max-w-full max-h-[70vh] object-contain gold-border-glow rounded shadow-2xl animate-fade-in"
            />
            
            <div className="mt-6 text-center max-w-xl">
              <span className="text-[9px] uppercase tracking-widest text-gold-500 font-bold">
                {filteredPhotos[lightboxIndex].category === "floors" ? t.tabFloors :
                 filteredPhotos[lightboxIndex].category === "vip_rooms" ? t.tabVipRooms :
                 filteredPhotos[lightboxIndex].category === "cuisine_drinks" ? t.tabCuisine :
                 filteredPhotos[lightboxIndex].category === "kitchen" ? t.tabKitchen : t.tabTeam}
              </span>
              <h2 className="text-2xl font-light text-stone-100 font-luxury tracking-wide mt-1">
                {getTranslatedLabel(filteredPhotos[lightboxIndex])}
              </h2>
              <p className="text-stone-400 text-xs font-light mt-2 leading-relaxed">
                {getTranslatedDesc(filteredPhotos[lightboxIndex])}
              </p>
            </div>
          </div>

          {/* Counter index indicator */}
          <div className="absolute bottom-6 text-[10px] uppercase tracking-widest text-stone-500 font-semibold select-none">
            {lightboxIndex + 1} / {filteredPhotos.length}
          </div>

        </div>
      )}

      {/* FOOTER */}
      <Footer lang={lang} />

    </div>
  );
}

export default function GalleryPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-dark-500 text-gold-500 tracking-widest text-sm uppercase">
        Loading...
      </div>
    }>
      <GalleryContent />
    </Suspense>
  );
}
