"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { COUNTRY_CODES } from "../../lib/countryCodes";
import Header from "@/components/Header";

const OFFERS = [
  {
    id: "weekly",
    badge: { vi: "Ưu Đãi Tuần", en: "Weekly Special", fr: "Offre Hebdomadaire", ja: "週替わり特典", ko: "주간 특별 혜택", hk: "每週精選優惠" },
    title: { vi: "Menu d'Affaires (Thứ 2 – Thứ 6)", en: "Menu d'Affaires (Monday – Friday)", fr: "Menu d'Affaires (Lundi – Vendredi)", ja: "ビジネスランチメニュー（月曜〜金曜）", ko: "비즈니스 런치 코스 (월~금요일)", hk: "商務午市套餐 (星期一至五)" },
    desc: {
      vi: "Trải nghiệm bữa trưa fine dining với 3 món chọn lọc từ thực đơn Pháp theo mùa. Bao gồm nước khoáng và bánh mì thủ công từ lò của nhà hàng.",
      en: "Experience a fine dining business lunch with 3 curated courses from our seasonal French menu. Includes mineral water and house-baked artisanal bread.",
      fr: "Savourez un déjeuner d'affaires gastronomique en 3 services déclinés de notre carte de saison. Eau minérale et pain artisanal maison inclus.",
      ja: "季節のフランス料理メニューから厳選された3品で、洗練されたビジネスランチをご堪能ください。ミネラルウォーターと自家製ブレッドが含まれています。",
      ko: "계절별 프렌치 메뉴에서 엄선한 3코스로 품격 있는 비즈니스 점심 식사를 즐겨보세요. 미네랄 워터와 매장에서 직접 구운 수제 빵이 제공됩니다.",
      hk: "品味由法式時令菜單中精選的 3 道菜商務午宴，套餐已包含礦泉水及自家烘焙的手工麵包。"
    },
    detail: {
      vi: "Khai vị · Món chính · Tráng miệng",
      en: "Starter · Main Course · Dessert",
      fr: "Entrée · Plat · Dessert",
      ja: "前菜 ・ メインディッシュ ・ デザート",
      ko: "전채 요리 · 메인 요리 · 디저트",
      hk: "精緻前菜 · 經典主菜 · 完美甜點"
    },
    price: {
      vi: "Từ 395.000 đ / khách",
      en: "From 395,000 VND / guest",
      fr: "À partir de 395 000 VND / personne",
      ja: "395,000 VND から / 名様",
      ko: "395,000 VND 부터 / 인",
      hk: "395,000 VND 起 / 位"
    },
    image: "https://i.postimg.cc/Pqq4VyHp/Scallop-Carpaccio-Caviar-Lime.webp",
    color: "from-amber-950/40",
    highlight: false,
    validUntil: {
      vi: "Áp dụng mỗi tuần, Thứ 2 đến Thứ 6 · 11:30 – 14:30",
      en: "Available every week, Monday to Friday · 11:30 – 14:30",
      fr: "Disponible chaque semaine, du lundi au vendredi · 11h30 – 14h30",
      ja: "毎週月曜日〜金曜日 · 11:30 – 14:30",
      ko: "매주 월요일~금요일 · 11:30 – 14:30",
      hk: "每週星期一至星期五適用 · 11:30 – 14:30"
    }
  },
  {
    id: "birthday",
    badge: { vi: "Dịp Đặc Biệt", en: "Special Occasions", fr: "Occasion Spéciale", ja: "アニバーサリー", ko: "기념일 특별 혜택", hk: "特別日子禮遇" },
    title: { vi: "Tiệc Sinh Nhật Thượng Khách", en: "VIP Birthday Celebration", fr: "Célébration d'Anniversaire VIP", ja: "VIPバースデーセレブレーション", ko: "VIP 생신 축하 파티", hk: "VIP 生日盛宴" },
    desc: {
      vi: "Chương trình dành riêng cho bữa tiệc sinh nhật: Trang trí bàn ăn độc quyền với hoa tươi và nến vàng, in menu riêng theo tên khách, và miễn phí tầng bánh Soufflé sinh nhật do Bếp trưởng Joel thực hiện tại bàn.",
      en: "Exclusively designed birthday privilege: Custom golden candlelight table settings with fresh flowers, printed personalized menus, and a complimentary Birthday Soufflé tower crafted by Chef Joel table-side.",
      fr: "Une expérience d'anniversaire exclusive : Décoration de table florale et bougies dorées, menus nominatifs imprimés sur mesure, et un gâteau soufflé d'anniversaire préparé à votre table par le Chef Joël.",
      ja: "誕生日のお祝いプラン：生花とキャンドルによる特別テーブルデコレーション、主賓のお名前入りメニューの印刷、そしてテーブル席にて総料理長ジョエルが目の前で仕上げる特製スフレタワーをプレゼントいたします。",
      ko: "생신 축하만을 위해 설계된 스페셜 서비스: 생화와 황금빛 캔들로 꾸며지는 테이블 세팅, 고객 성함이 인쇄된 개별 메뉴 제공, 테이블에서 셰프 조엘이 직접 완성해 드리는 수제 생신 축하 수플레 케이크 무료 제공.",
      hk: "專為生日聚會設計的尊貴方案：以鮮花及金色蠟燭佈置專屬餐桌、印製專屬姓名菜單，並免費獲贈由總廚 Joel 於桌前親手製作的生日梳乎厘塔。"
    },
    detail: {
      vi: "Dành cho nhóm từ 4 người trở lên · Đặt trước tối thiểu 48 giờ",
      en: "For groups of 4 or more guests · Book at least 48 hours in advance",
      fr: "Pour les groupes de 4 personnes ou plus · Réservation requise 48h à l'avance",
      ja: "4名様以上のグループが対象 · 48時間前までの要予約",
      ko: "4인 이상 단체 대상 · 최소 48시간 전 사전 예약 필수",
      hk: "適用於 4 位或以上賓客 · 需提前最少 48 小時預訂"
    },
    price: {
      vi: "Liên hệ để báo giá",
      en: "Contact for Pricing",
      fr: "Nous contacter pour devis",
      ja: "お見積りはお問い合わせください",
      ko: "상담 후 맞춤 가격 제시",
      hk: "請聯絡我們以獲取報價"
    },
    image: "https://i.postimg.cc/Hxd7PsXQ/Warm-Seasonal-Souffle-Vanilla-Ice-Cream.png",
    color: "from-rose-950/40",
    highlight: true,
    validUntil: {
      vi: "Quanh năm · Đặt trước tối thiểu 48 giờ",
      en: "Year-round · Book at least 48 hours in advance",
      fr: "Toute l'année · Réservation requise 48h à l'avance",
      ja: "通年適用 · 48時間前までの要予約",
      ko: "연중 내내 적용 · 최소 48시간 전 예약",
      hk: "全年適用 · 需最少提前 48 小時預訂"
    }
  },
  {
    id: "b2b",
    badge: { vi: "B2B Lữ Hành", en: "Tour Operators", fr: "Partenaires Voyagistes", ja: "B2B旅行代理店", ko: "B2B 여행사 혜택", hk: "B2B 旅遊合作" },
    title: { vi: "Ưu Đãi Đoàn Lữ Hành", en: "Group & Tour Operator Rates", fr: "Tarif Groupes & Voyagistes", ja: "ツアーグループ特別優待", ko: "단체 관광 및 여행사 우대", hk: "旅行團團體優惠" },
    desc: {
      vi: "Dành riêng cho đại lý lữ hành và hướng dẫn viên đã ký hợp đồng hợp tác: Giảm 15% tổng giá trị Set Menu cho đoàn từ 20 người. Hóa đơn VAT xuất theo tên công ty, thanh toán công nợ cuối tháng.",
      en: "Exclusively for registered travel agencies and guides: Enjoy 15% off Set Menus for tour groups of 20 or more. Corporate VAT invoicing available, monthly billing accounts accepted.",
      fr: "Réservé aux agences et guides partenaires : Remise de 15% sur les Menus pour les groupes de 20 personnes ou plus. Facturation d'entreprise (TVA) et paiement différé en fin de mois.",
      ja: "旅行代理店・添乗員様限定：20名様以上のツアー団体のご利用で、セットメニュー tổng 額から15%オフいたします。法人用VAT領収書の発行、月末締め翌月払いの売掛清算にも対応いたします。",
      ko: "사전 협약된 여행사 및 가이드 대상: 20인 이상 단체 고객 세트 메뉴 15% 할인 제공. 법인 VAT 세금계산서 발행 및 월말 정산/외상 거래 가능.",
      hk: "專為已簽約之旅行社及導遊而設：20 位或以上團體預訂可享套餐總額 15% 優惠。可開具公司增值稅發票，支持月結付款。"
    },
    detail: {
      vi: "Đoàn từ 20 người · Đặt trước 72 giờ",
      en: "Groups of 20+ guests · Book 72 hours in advance",
      fr: "Groupes de 20+ personnes · Réservation requise 72h à l'avance",
      ja: "20名様以上の団体 · 72時間前までの要予約",
      ko: "20인 이상 단체 · 72시간 전 예약 필수",
      hk: "20 位或以上團體 · 需最少 72 小時前預訂"
    },
    price: {
      vi: "Giảm 15% Set Menu",
      en: "15% Off Set Menus",
      fr: "15% de réduction",
      ja: "セットメニュー 15%割引",
      ko: "세트 메뉴 15% 할인",
      hk: "套餐 15% 優惠"
    },
    image: "https://i.postimg.cc/vZngY6zs/Vietnamese-Buffalo-Wellington-Mushroom-Duxelles-Phu-Quoc-Pepper-Jus.png",
    color: "from-blue-950/40",
    highlight: false,
    validUntil: {
      vi: "Áp dụng quanh năm · Theo hợp đồng đã ký",
      en: "Year-round · Subject to partnership agreement",
      fr: "Toute l'année · Selon termes du contrat",
      ja: "通年適用 · パートナーシップ契約に基づく",
      ko: "연중 적용 · 서명된 파트너 계약 기준",
      hk: "全年適用 · 根據已簽定之合作協定"
    }
  },
  {
    id: "wine",
    badge: { vi: "Cuối Tuần", en: "Weekend Special", fr: "Week-end Gastronomique", ja: "週末特別プラン", ko: "주말 와인 특선", hk: "週末尊享體驗" },
    title: { vi: "Trải Nghiệm Rượu Vang Cuối Tuần", en: "Weekend Wine Pairing Experience", fr: "Dégustation de Vins — Le Week-end", ja: "週末ソムリエワインペアリング", ko: "주말 소믈리에 와인 페어링 여행", hk: "週末品酒侍酒配搭之旅" },
    desc: {
      vi: "Thứ 7 & Chủ Nhật: Thưởng thức set ghép cặp 4 món ăn với 4 ly vang được chọn lọc bởi Sommelier của Maison Vie. Mỗi chai vang đều có ghi chú đặc điểm và gợi ý ẩm thực kèm theo.",
      en: "Saturday & Sunday: Indulge in a 4-course menu thoughtfully paired with 4 premium wines selected by our Sommelier. Each wine is presented with tasting notes and pairing guidelines.",
      fr: "Samedi & Dimanche : Savourez un parcours culinaire de 4 services accordé avec 4 verres de vins de prestige sélectionnés par notre Sommelier. Notes de dégustation fournies.",
      ja: "土曜日＆日曜日限定：メゾン・ヴィの専属ソムリエが厳選した4杯のワインと、それに合わせた4品の特別ペアリングコース。各ワインには特徴テイスティングノートとペアリングの解説が添えられます。",
      ko: "토요일 & 일요일: 소믈리에가 엄선한 4종의 프리미엄 와인과 최상의 조화를 이루는 4코스 요리 제공. 각 와인별 시음 노트와 마리아주 해설지가 동封됩니다.",
      hk: "星期六及星期日限定：享用由侍酒師精心挑選的 4 杯優質佳釀，配搭 4 道精緻菜式。每款佳釀均附有品酒筆記及搭配指南。"
    },
    detail: {
      vi: "4 món · 4 ly vang tuyển chọn · Bình luận Sommelier",
      en: "4 courses · 4 selected wines · Sommelier pairing notes",
      fr: "4 plats · 4 vins d'exception · Commentaires du Sommelier",
      ja: "料理4品 · 厳選ペアリングワイン4杯 · ソムリエ解説",
      ko: "4코스 요리 · 엄선 와인 4잔 · 소믈리에 테이스팅 코멘트",
      hk: "4 道菜 · 4 杯精選佳釀 · 侍酒師品酒導賞"
    },
    price: {
      vi: "2.450.000 đ / khách",
      en: "2,450,000 VND / guest",
      fr: "2 450 000 VND / personne",
      ja: "2,450,000 VND / 名様",
      ko: "2,450,000 VND / 인",
      hk: "2,450,000 VND / 位"
    },
    image: "https://i.postimg.cc/xdbkdNyx/Pan-Seared-Vietnamese-Seabass-Broccoli-Green-Mango-Pickles.webp",
    color: "from-purple-950/40",
    highlight: false,
    validUntil: {
      vi: "Thứ 7 & Chủ Nhật · 18:00 – 21:30 · Chỉ có 20 suất/đêm",
      en: "Saturday & Sunday · 18:00 – 21:30 · Limited to 20 seats per night",
      fr: "Samedi & Dimanche · 18h00 – 21h30 · Limité à 20 couverts par soirée",
      ja: "土曜日＆日曜日 · 18:00 – 21:30 · 1日20席限定",
      ko: "토요일 & 일요일 · 18:00 – 21:30 · 하루 20석 한정 제공",
      hk: "星期六及星期日 · 18:00 – 21:30 · 每晚限量 20 位"
    }
  }
];

const SIGNATURE_DISHES = [
  {
    name: {
      vi: "Cá Vược Việt Nam Áp Chảo & Dưa Xoài Xanh",
      en: "Pan-Seared Vietnamese Seabass with Mango Pickles",
      fr: "Bar du Vietnam Poêlé, Condiment Mangue Verte",
      ja: "スズキのポワレとグリーンマンゴーピクルス",
      ko: "베트남식 농어 áp chảo & 망고 피클",
      hk: "香煎越南海鱸魚配青芒果漬"
    },
    cat: { vi: "Món Tiêu Biểu", en: "Signature", fr: "Signature", ja: "シグネチャー", ko: "시그니처", hk: "招牌菜式" },
    image: "https://i.postimg.cc/xdbkdNyx/Pan-Seared-Vietnamese-Seabass-Broccoli-Green-Mango-Pickles.webp",
    pairing: {
      vi: "Vang trắng Pascal Jolivet « Attitude » Sauvignon Blanc",
      en: "Pascal Jolivet « Attitude » Sauvignon Blanc",
      fr: "Pascal Jolivet « Attitude » Sauvignon Blanc",
      ja: "パスカル・ジョリヴェ « アティテュード » ソーヴィニヨン・ブラン",
      ko: "파스칼 졸리베 « 아티튜드 » 소비뇽 블랑",
      hk: "Pascal Jolivet « Attitude » Sauvignon Blanc"
    }
  },
  {
    name: {
      vi: "Wellington Thịt Trâu Việt Nam",
      en: "Vietnamese Buffalo Wellington",
      fr: "Wellington de Buffle du Vietnam",
      ja: "ベトナム水牛のウェリントン",
      ko: "베트남식 버팔로 웰링턴",
      hk: "越南水牛威靈頓"
    },
    cat: { vi: "Món Tiêu Biểu", en: "Signature", fr: "Signature", ja: "シグネチャー", ko: "시그니처", hk: "招牌菜式" },
    image: "https://i.postimg.cc/vZngY6zs/Vietnamese-Buffalo-Wellington-Mushroom-Duxelles-Phu-Quoc-Pepper-Jus.png",
    pairing: {
      vi: "Vang đỏ Château Haut-Rocher Saint-Émilion Grand Cru",
      en: "Château Haut-Rocher Saint-Émilion Grand Cru",
      fr: "Château Haut-Rocher Saint-Émilion Grand Cru",
      ja: "シャトー・オー・ロシェ サンテミリオン グラン・クリュ",
      ko: "샤토 오 로셰 생테밀리옹 그랑 크뤼",
      hk: "Château Haut-Rocher Saint-Émilion Grand Cru"
    }
  },
  {
    name: {
      vi: "Bò Wagyu MBS 6–7 Sốt Vani Đậu Phộng",
      en: "Wagyu Beef MBS 6–7 with Peanut-Vanilla Jus",
      fr: "Bœuf Wagyu MBS 6–7, Jus Cacahuète et Vanille",
      ja: "和牛ステーキ MBS 6–7 ピーナッツバニラソース",
      ko: "와규 스테이크 MBS 6–7 피넛 바닐라 소스",
      hk: "和牛 MBS 6–7 配花生雲霓拿醬汁"
    },
    cat: { vi: "Món Chính", en: "Main Course", fr: "Plat Principal", ja: "メインディッシュ", ko: "메인 요리", hk: "精選主菜" },
    image: "https://i.postimg.cc/pTFK3162/Pan-Seared-Wagyu-MBS6-Peanut-Vanilla-Jus-Artichoke-Puree.webp",
    pairing: {
      vi: "Vang đỏ Château Lynch-Bages Pauillac Grand Cru Classé",
      en: "Château Lynch-Bages Pauillac Grand Cru Classé",
      fr: "Château Lynch-Bages Pauillac Grand Cru Classé",
      ja: "シャトー・ランシュ・バージュ ポイヤック グラン・クリュ",
      ko: "샤토 랭슈 바쥬 뽀이약 그랑 크뤼",
      hk: "Château Lynch-Bages Pauillac Grand Cru Classé"
    }
  },
  {
    name: {
      vi: "Gan Ngỗng Áp Chảo & Sốt Trái Cây",
      en: "Seared Foie Gras with Seasonal Fruit",
      fr: "Foie Gras Poêlé aux Fruits de Saison",
      ja: "フォアグラのポワレ 季節のフルーツ添え",
      ko: "푸아그라 áp chảo & 계절 과일",
      hk: "香煎鵝肝配時令水果"
    },
    cat: { vi: "Khai Vị Nóng", en: "Hot Starter", fr: "Entrée Chaude", ja: "温前菜", ko: "온전식", hk: "精緻熱前菜" },
    image: "https://i.postimg.cc/HW2v9ySJ/Seared-Foie-Gras-Seasonal-Fruit-Reduced-Jus.png",
    pairing: {
      vi: "Vang ngọt Château d'Yquem Sauternes Premier Cru Supérieur",
      en: "Château d'Yquem Sauternes Premier Cru Supérieur",
      fr: "Château d'Yquem Sauternes Premier Cru Supérieur",
      ja: "シャトー・ディケム ソーテルヌ プルミエ・クリュ・シュペリュール",
      ko: "샤토 디켐 소테른 프레미에 크뤼 쉬페리외르",
      hk: "Château d'Yquem Sauternes Premier Cru Supérieur"
    }
  }
];

const I18N = {
  vi: {
    heroBadge: "Les Offres Exclusives · Maison Vie 2026",
    heroTitle: "Ưu Đãi & Trải Nghiệm",
    heroDesc: "Những chương trình ưu đãi được thiết kế riêng — từ bữa trưa fine dining hàng tuần đến trải nghiệm ghép cặp rượu vang độc quyền cuối tuần cùng Sommelier của Maison Vie.",
    sectionBadge: "Les Privilèges",
    sectionTitle: "Chương Trình Ưu Đãi Hiện Hành",
    signaturesBadge: "Les Signatures",
    signaturesTitle: "Món Ăn Tiêu Biểu",
    signaturesDesc: "Thoáng nhìn về thực đơn của chúng tôi — mỗi đĩa ăn được chế tác từ nguyên liệu cao cấp theo kỹ thuật Pháp cổ điển, ghép cặp bởi Sommelier.",
    btnAllMenu: "Xem Toàn Bộ Thực Đơn",
    bookingBadge: "Réservation",
    bookingTitle: "Đặt Bàn Thưởng Thức Ưu Đãi",
    bookingTitleWithOffer: "Đặt Bàn Ưu Đãi",
    bookingDesc: "Điền thông tin để chúng tôi sắp xếp trải nghiệm hoàn hảo nhất cho bạn.",
    selectedOffer: "Ưu đãi đã chọn",
    successTitle: "Yêu Cầu Đặt Bàn Đã Tiếp Nhận",
    successMsg: "Maison Vie đã nhận được yêu cầu đặt bàn của bạn. Lễ tân sẽ liên hệ xác nhận chính thức qua email/điện thoại trong ít phút.",
    btnHome: "Về Trang Chủ",
    btnBookAnother: "Đặt Tiếp Bàn Khác",
    errorMsg: "Không thể kết nối. Vui lòng thử lại hoặc gọi hotline: 0989 091 383.",
    labelName: "Họ và Tên *",
    labelPhone: "Số Điện Thoại *",
    labelEmail: "Email",
    labelGuests: "Số Khách *",
    labelDate: "Ngày Dùng Bữa *",
    labelTime: "Giờ Đến *",
    labelSpecialRequest: "Yêu Cầu Đặc Biệt",
    btnSubmit: "Gửi Yêu Cầu Giữ Chỗ",
    btnSubmitLoading: "Đang xử lý...",
    placeholderSpecialRequest: "Dịp sinh nhật, kỷ niệm, setup hoa tươi, phòng VIP...",
    placeholderTime: "Chọn giờ đón tiếp",
    btnReserveNow: "Đặt Ngay",
    validTag: "✦ Nổi Bật",
  },
  en: {
    heroBadge: "Les Offres Exclusives · Maison Vie 2026",
    heroTitle: "Offers & Experiences",
    heroDesc: "Curated dining packages tailored to your preferences — from our signature weekday business lunches to exclusive weekend wine pairing journeys with our Sommelier.",
    sectionBadge: "Les Privilèges",
    sectionTitle: "Current Dining Offers",
    signaturesBadge: "Les Signatures",
    signaturesTitle: "Signature Creations",
    signaturesDesc: "A glimpse into our culinary repertoire — each dish crafted with classic French precision, elevated by local terroir and paired by our Sommelier.",
    btnAllMenu: "View Full Menu",
    bookingBadge: "Reservation",
    bookingTitle: "Book Special Offer Table",
    bookingTitleWithOffer: "Book Special Offer",
    bookingDesc: "Please provide your details so we can arrange the perfect experience for you.",
    selectedOffer: "Selected Offer",
    successTitle: "Reservation Requested",
    successMsg: "Maison Vie has received your table reservation request. Our receptionist will contact you via email or phone to confirm shortly.",
    btnHome: "Go to Homepage",
    btnBookAnother: "Book Another Table",
    errorMsg: "Failed to submit request. Please try again or call our hotline: 0989 091 383.",
    labelName: "Full Name *",
    labelPhone: "Phone Number *",
    labelEmail: "Email Address",
    labelGuests: "Number of Guests *",
    labelDate: "Dining Date *",
    labelTime: "Arrival Time *",
    labelSpecialRequest: "Special Requests",
    btnSubmit: "Submit Reservation Request",
    btnSubmitLoading: "Processing...",
    placeholderSpecialRequest: "Birthday, anniversary, flower setup, VIP room...",
    placeholderTime: "Select arrival time",
    btnReserveNow: "Book Now",
    validTag: "✦ Featured",
  },
  fr: {
    heroBadge: "Les Offres Exclusives · Maison Vie 2026",
    heroTitle: "Offres & Expériences",
    heroDesc: "Découvrez nos formules d'exception façonnées pour vous — de notre incontournable menu d'affaires en semaine aux accords mets-vins prestigieux du week-end.",
    sectionBadge: "Les Privilèges",
    sectionTitle: "Nos Formules du Moment",
    signaturesBadge: "Les Signatures",
    signaturesTitle: "Créations Signatures",
    signaturesDesc: "Un aperçu de notre univers culinaire — des assiettes pensées selon la tradition française, sublimées par le terroir local et accordées par notre Sommelier.",
    btnAllMenu: "Découvrir la Carte",
    bookingBadge: "Réservation",
    bookingTitle: "Demande de Réservation Formule",
    bookingTitleWithOffer: "Demande de Réservation",
    bookingDesc: "Veuillez renseigner vos détails afin que nous puissions préparer votre table d'exception.",
    selectedOffer: "Formule sélectionnée",
    successTitle: "Demande Envoyée avec Succès",
    successMsg: "Maison Vie a bien reçu votre demande de réservation. Notre hôtesse prendra contact avec vous très rapidement par e-mail ou téléphone pour confirmation.",
    btnHome: "Retour à l'accueil",
    btnBookAnother: "Réserver une autre table",
    errorMsg: "Impossible d'envoyer votre demande. Veuillez réessayer ou composer le 0989 091 383.",
    labelName: "Nom Complet *",
    labelPhone: "Numéro de Téléphone *",
    labelEmail: "Adresse E-mail",
    labelGuests: "Nombre de Couverts *",
    labelDate: "Date du Repas *",
    labelTime: "Heure d'Arrivée *",
    labelSpecialRequest: "Demandes Particulières",
    btnSubmit: "Envoyer la Demande",
    btnSubmitLoading: "Envoi en cours...",
    placeholderSpecialRequest: "Anniversaire, demande spéciale, salon privé, fleurs...",
    placeholderTime: "Choisir l'heure d'arrivée",
    btnReserveNow: "Réserver",
    validTag: "✦ En Vedette",
  },
  ja: {
    heroBadge: "Les Offres Exclusives · Maison Vie 2026",
    heroTitle: "特別プラン＆体験",
    heroDesc: "平日限定のビジネスランチから、専属ソムリエ厳選の週末ワインペアリングジャーニーまで、メゾン・ヴィがご提案する特別メニュー。",
    sectionBadge: "Les Privilèges",
    sectionTitle: "現在提供中の特別プラン",
    signaturesBadge: "Les Signatures",
    signaturesTitle: "シグネチャーディッシュ",
    signaturesDesc: "メゾン・ヴィの美食の世界 — 伝統的なフランス料理の技術、厳選された地元食材、ソムリエ厳選のワインとのハーモニー。",
    btnAllMenu: "すべてのメニューを見る",
    bookingBadge: "ご予約",
    bookingTitle: "特別プランのご予約",
    bookingTitleWithOffer: "特別プランをご予約",
    bookingDesc: "極上の美食体験をご用意するため、詳細をご記入ください。",
    selectedOffer: "選択したプラン",
    successTitle: "ご予約申請完了",
    successMsg: "特別プランのご予約申請を受け付けました。スタッフより確認のご連絡を差し上げます。",
    btnHome: "ホームページに戻る",
    btnBookAnother: "別のテーブルを予約",
    errorMsg: "リクエストの送信に失敗しました。もう一度お試しいただくか、お電話にてご連絡ください: 0989 091 383。",
    labelName: "お名前 *",
    labelPhone: "電話番号 *",
    labelEmail: "メールアドレス",
    labelGuests: "ご利用人数 *",
    labelDate: "ご来店日 *",
    labelTime: "ご来店時間 *",
    labelSpecialRequest: "ご要望",
    btnSubmit: "予約リクエストを送信する",
    btnSubmitLoading: "送信中...",
    placeholderSpecialRequest: "誕生日、記念日、フラワー装飾、VIPルーム...",
    placeholderTime: "ご来店時間を選択",
    btnReserveNow: "予約する",
    validTag: "✦ おすすめ",
  },
  ko: {
    heroBadge: "Les Offres Exclusives · Maison Vie 2026",
    heroTitle: "특별 혜택 & 다이닝 팩",
    heroDesc: "주중 시그니처 비즈니스 런치부터 소믈리에와 함께하는 주말 프렌치 와인 페어링 여행까지, 메종 비가 선보이는 특별 다이닝 패키지.",
    sectionBadge: "Les Privilèges",
    sectionTitle: "현재 제공 중인 특별 혜택",
    signaturesBadge: "Les Signatures",
    signaturesTitle: "대표 메뉴 구성",
    signaturesDesc: "프렌치 퀴진 기법과 신선한 베트남 현지 식재료의 어우러짐 — 소믈리에가 추천하는 최적의 와인 마리아주와 함께 선보입니다.",
    btnAllMenu: "전체 메뉴 보기",
    bookingBadge: "예약하기",
    bookingTitle: "특별 프로모션 예약",
    bookingTitleWithOffer: "특별 프로모션 예약",
    bookingDesc: "완벽한 다이닝 경험을 제공할 수 있도록 아래 정보를 입력해 주세요.",
    selectedOffer: "선택한 프로모션",
    successTitle: "예약 신청 완료",
    successMsg: "특별 프로모션 예약 신청이 접수되었습니다. 리셉션 팀에서 이메일 또는 전화로 곧 연락드리겠습니다.",
    btnHome: "홈페이지로 돌아가기",
    btnBookAnother: "다른 테이블 예약",
    errorMsg: "신청 전송에 실패했습니다. 다시 시도하시거나 핫라인으로 연락해 주십시오: 0989 091 383.",
    labelName: "성함 *",
    labelPhone: "전화번호 *",
    labelEmail: "이메일 주소",
    labelGuests: "방문 인원 *",
    labelDate: "예약 날짜 *",
    labelTime: "예약 시간 *",
    labelSpecialRequest: "특별 요청사항",
    btnSubmit: "예약 신청하기",
    btnSubmitLoading: "처리 중...",
    placeholderSpecialRequest: "생일, 기념일, 꽃 장식, VIP룸 예약 등...",
    placeholderTime: "예약 시간을 선택해 주세요",
    btnReserveNow: "예약하기",
    validTag: "✦ 추천",
  },
  hk: {
    heroBadge: "Les Offres Exclusives · Maison Vie 2026",
    heroTitle: "餐飲優惠 & 精緻體驗",
    heroDesc: "為您精心打造的專屬餐飲體驗——從星期一至五的商務午宴，到週末由侍酒師帶領的獨家佳釀配搭之旅。",
    sectionBadge: "Les Privilèges",
    sectionTitle: "最新餐飲推廣",
    signaturesBadge: "Les Signatures",
    signaturesTitle: "經典招牌美餐",
    signaturesDesc: "探索我們的精緻廚藝——每道菜式均以法國傳統手法精心炮製，完美展現本土優質食材的獨特風味，並由侍酒師推薦餐酒。",
    btnAllMenu: "查看完整菜單",
    bookingBadge: "尊貴訂座",
    bookingTitle: "預訂特惠餐飲體驗",
    bookingTitleWithOffer: "預訂特惠體驗",
    bookingDesc: "請填寫以下資訊，以便我們為您規劃完美的用餐體驗。",
    selectedOffer: "已選優惠方案",
    successTitle: "訂座申請已提交",
    successMsg: "您的特惠體驗預訂申請已收到，我們的服務人員會儘快與您聯繫確認。",
    btnHome: "返回首頁",
    btnBookAnother: "預訂其他桌子",
    errorMsg: "提交申請時發生錯誤。請重試或撥打熱線：0989 091 383。",
    labelName: "姓名 *",
    labelPhone: "聯絡電話 *",
    labelEmail: "電子郵件",
    labelGuests: "貴賓人數 *",
    labelDate: "用餐日期 *",
    labelTime: "抵達時間 *",
    labelSpecialRequest: "特別要求",
    btnSubmit: "提交訂座申請",
    btnSubmitLoading: "正在傳送...",
    placeholderSpecialRequest: "生日慶祝、紀念日、鮮花佈置、VIP包廂...",
    placeholderTime: "請選擇抵達時間",
    btnReserveNow: "立即預訂",
    validTag: "✦ 焦點推介",
  }
};

const normalizePhone = (code, phone) => {
  let cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("0")) {
    cleaned = cleaned.substring(1);
  }
  return code + cleaned;
};

function OffersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lang = searchParams.get("lang") || "vi";
  const t = I18N[lang] || I18N.vi;

  const [offersList, setOffersList] = useState(OFFERS);
  const [activeOffer, setActiveOffer] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    name: "", phone: "", countryCode: "+84", email: "", guests: 2, date: "", time: "19:00", notes: ""
  });
  const [submitStatus, setSubmitStatus] = useState("idle");
  const [timeDropdownOpen, setTimeDropdownOpen] = useState(false);

  // Fetch prices dynamically from database (Supabase)
  useEffect(() => {
    async function fetchPrices() {
      try {
        const { data, error } = await supabase
          .from("menu_items")
          .select("*")
          .eq("category", "Set Menu Price");

        if (!error && data && data.length > 0) {
           const dbBusinessLunch = data.find(item => {
            const key = item.name?.en || item.name;
            return key === "business_lunch_services_2";
          });

          if (dbBusinessLunch) {
            const priceVal = Number(dbBusinessLunch.price_dine_in);
            
            const formatPrice = (val, locale) => {
              if (locale === "vi") {
                const formatted = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" })
                  .format(val)
                  .replace("₫", "đ");
                return `Từ ${formatted} / khách`;
              }
              if (locale === "fr") return `À partir de ${new Intl.NumberFormat("fr-FR").format(val)} VND / personne`;
              if (locale === "en") return `From ${new Intl.NumberFormat("en-US").format(val)} VND / guest`;
              if (locale === "ja") return `${new Intl.NumberFormat("ja-JP").format(val)} VND から / 名様`;
              if (locale === "ko") return `${new Intl.NumberFormat("ko-KR").format(val)} VND 부터 / 인`;
              if (locale === "hk") return `${new Intl.NumberFormat("zh-HK").format(val)} VND 起 / 位`;
              return `Từ ${new Intl.NumberFormat("vi-VN").format(val)} đ`;
            };

            setOffersList(prev => prev.map(off => {
              if (off.id === "weekly") {
                return {
                  ...off,
                  price: {
                    vi: formatPrice(priceVal, "vi"),
                    en: formatPrice(priceVal, "en"),
                    fr: formatPrice(priceVal, "fr"),
                    ja: formatPrice(priceVal, "ja"),
                    ko: formatPrice(priceVal, "ko"),
                    hk: formatPrice(priceVal, "hk")
                  }
                };
              }
              return off;
            }));
          }
        }
      } catch (err) {
        console.warn("Failed to fetch set menu prices from database, using defaults:", err);
      }
    }
    fetchPrices();
  }, []);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setBookingForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus("loading");
    try {
      const fullPhone = normalizePhone(bookingForm.countryCode, bookingForm.phone);

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
            full_name: bookingForm.name,
            phone: fullPhone,
            email: bookingForm.email || null,
            vip_level: 1,
            consent_at: new Date().toISOString(),
          })
          .select("id")
          .single();
        customerId = newCust?.id;
      }

      const offerTitle = activeOffer ? activeOffer : "Khuyến mãi chung / General Offer";

      await supabase.from("reservations").insert({
        customer_id: customerId,
        guest_name: bookingForm.name,
        guest_phone: fullPhone,
        guest_email: bookingForm.email || null,
        guest_count: parseInt(bookingForm.guests),
        booking_date: bookingForm.date,
        booking_time: bookingForm.time + ":00",
        notes: `[OFFER: ${offerTitle}] ${bookingForm.notes}`,
        language: lang,
        status: "pending",
      });

      if (bookingForm.email) {
        let subjectStr = "";
        if (lang === "vi") {
          subjectStr = `Maison Vie - Xác nhận yêu cầu đặt bàn ưu đãi: ${offerTitle}`;
        } else if (lang === "fr") {
          subjectStr = `Maison Vie - Confirmation de demande de réservation formule: ${offerTitle}`;
        } else {
          subjectStr = `Maison Vie - Table reservation request for: ${offerTitle}`;
        }

        try {
          await fetch("/api/send-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              to: bookingForm.email,
              subject: subjectStr,
              type: "booking_pending",
              lang: lang,
              data: { ...bookingForm, phone: fullPhone },
            }),
          });
        } catch (mailErr) {
          console.error("Email sending failed:", mailErr);
        }
      }

      setSubmitStatus("success");
      setBookingForm({ name: "", phone: "", countryCode: "+84", email: "", guests: 2, date: "", time: "19:00", notes: "" });
    } catch (err) {
      console.error(err);
      setSubmitStatus("error");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-dark-500 font-sans selection:bg-gold-500 selection:text-dark-500">

      {/* HEADER */}
      <Header lang={lang} />

      {/* HERO */}
      <section className="relative py-28 text-center overflow-hidden bg-dark-400 border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-dark-300 via-dark-500 to-black opacity-80" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(197,165,90,0.03)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(197,165,90,0.03)_1px,_transparent_1px)] bg-[size:80px_80px] pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <span className="text-[10px] uppercase tracking-[0.45em] text-gold-500 font-semibold mb-6 block animate-fade-in">
            {t.heroBadge}
          </span>
          <h1 className="text-5xl md:text-7xl font-light tracking-tight text-stone-100 font-luxury mb-6 animate-fade-in">
            {lang === "vi" ? (
              <>Ưu Đãi & <span className="text-gold-500 italic">Trải Nghiệm</span></>
            ) : lang === "fr" ? (
              <>Offres & <span className="text-gold-500 italic">Expériences</span></>
            ) : (
              <>Offers & <span className="text-gold-500 italic">Experiences</span></>
            )}
          </h1>
          <div className="w-16 h-[1px] bg-gold-500 mx-auto mb-8" />
          <p className="text-stone-300 font-light text-lg max-w-2xl mx-auto leading-relaxed">
            {t.heroDesc}
          </p>
        </div>
      </section>

      {/* OFFERS GRID */}
      <section className="py-24 bg-dark-500">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[10px] uppercase tracking-[0.35em] text-gold-500 font-semibold block mb-4">
              {t.sectionBadge}
            </span>
            <h2 className="text-4xl font-light text-stone-100 font-luxury">
              {t.sectionTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
            {offersList.map((offer) => {
              const displayBadge = offer.badge[lang] || offer.badge.vi;
              const displayTitle = offer.title[lang] || offer.title.vi;
              const displayDesc = offer.desc[lang] || offer.desc.vi;
              const displayDetail = offer.detail[lang] || offer.detail.vi;
              const displayPrice = offer.price[lang] || offer.price.vi;
              const displayValid = offer.validUntil[lang] || offer.validUntil.vi;

              return (
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
                      alt={displayTitle}
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                      loading="lazy"
                    />
                    <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                      <span className="text-[9px] uppercase tracking-[0.3em] font-bold text-dark-500 bg-gold-500 px-3 py-1.5">
                        {displayBadge}
                      </span>
                      {offer.highlight && (
                        <span className="text-[9px] uppercase tracking-wider font-bold text-gold-400 border border-gold-500/50 bg-black/60 px-2 py-1">
                          {t.validTag}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8 bg-dark-400 flex flex-col flex-1 text-left">
                    <div className="mb-1">
                      <span className="text-[9px] uppercase tracking-[0.25em] text-gold-500/70 italic font-light">
                        {offer.badge.fr}
                      </span>
                    </div>
                    <h3 className="text-2xl font-light text-stone-100 font-luxury mb-1">
                      {displayTitle}
                    </h3>
                    {lang !== "fr" && (
                      <p className="text-[11px] text-stone-500 italic mb-4 font-light">
                        {offer.title.fr}
                      </p>
                    )}
                    <p className="text-stone-300 text-sm font-light leading-relaxed mb-4 flex-1">
                      {displayDesc}
                    </p>
                    <div className="text-[10px] uppercase tracking-wider text-stone-500 mb-6 pb-6 border-b border-white/5 font-semibold">
                      {displayDetail}
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xl font-semibold text-gold-500 font-luxury">
                          {displayPrice}
                        </span>
                        <p className="text-[10px] text-stone-500 mt-1">
                          {displayValid}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setActiveOffer(displayTitle);
                          document.getElementById("booking-section")?.scrollIntoView({ behavior: "smooth" });
                        }}
                        className="text-[11px] uppercase tracking-widest font-semibold bg-gold-500 text-dark-500 px-5 py-3 hover:bg-gold-400 transition-premium shadow-[0_0_10px_rgba(197,165,90,0.15)] cursor-pointer"
                      >
                        {t.btnReserveNow}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SIGNATURE DISHES TEASER */}
      <section className="py-24 bg-dark-400 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[10px] uppercase tracking-[0.35em] text-gold-500 font-semibold block mb-4">
              {t.signaturesBadge}
            </span>
            <h2 className="text-4xl font-light text-stone-100 font-luxury mb-4">
              {t.signaturesTitle}
            </h2>
            <p className="text-stone-400 font-light max-w-xl mx-auto text-sm leading-relaxed">
              {t.signaturesDesc}
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-fade-in">
            {SIGNATURE_DISHES.map((dish, idx) => {
              const displayDishName = dish.name[lang] || dish.name.en;
              const displayCat = dish.cat[lang] || dish.cat.en;
              const displayPairing = dish.pairing[lang] || dish.pairing.en;

              return (
                <div key={idx} className="group relative overflow-hidden border border-white/5 hover:border-gold-500/25 transition-premium flex flex-col h-full">
                  <div className="relative h-56 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-500 via-transparent to-transparent z-10" />
                    <img
                      src={dish.image}
                      alt={displayDishName}
                      className="w-full h-full object-cover group-hover:scale-106 transition-all duration-700"
                      loading="lazy"
                    />
                    <div className="absolute bottom-4 left-4 z-20 text-left">
                      <span className="text-[8px] uppercase tracking-[0.2em] text-gold-500 font-bold block mb-1">
                        {displayCat}
                      </span>
                      <h4 className="text-sm font-light text-stone-100 font-luxury leading-tight">
                        {displayDishName}
                      </h4>
                    </div>
                  </div>
                  <div className="p-4 bg-dark-300 text-left flex-1 flex flex-col justify-between">
                    <p className="text-[10px] italic text-stone-500 font-light mb-2">
                      {dish.name.fr}
                    </p>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[8px] uppercase tracking-wider text-gold-500/70 font-semibold">Wine Pairing</span>
                      </div>
                      <p className="text-[10px] text-stone-400 italic mt-0.5">
                        {displayPairing}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="text-center mt-12">
            <a
              href={`/menu?lang=${lang}`}
              className="text-[12px] uppercase tracking-widest font-semibold border border-gold-500/30 text-gold-300 px-8 py-4 hover:bg-gold-500/10 transition-premium inline-block cursor-pointer"
            >
              {t.btnAllMenu}
            </a>
          </div>
        </div>
      </section>

      {/* BOOKING SECTION */}
      <section id="booking-section" className="py-24 bg-dark-500 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-[10px] uppercase tracking-[0.35em] text-gold-500 font-semibold block mb-4">
              {t.bookingBadge}
            </span>
            <h2 className="text-4xl font-light text-stone-100 font-luxury mb-4">
              {activeOffer ? (
                <>{t.bookingTitleWithOffer} <span className="text-gold-500">— {activeOffer}</span></>
              ) : (
                t.bookingTitle
              )}
            </h2>
            <p className="text-stone-400 font-light text-sm">
              {t.bookingDesc}
            </p>
            {activeOffer && (
              <div className="mt-4 inline-flex items-center gap-2 text-[11px] uppercase tracking-wider text-gold-400 border border-gold-500/30 bg-gold-500/5 px-4 py-2">
                ✦ {t.selectedOffer}: {activeOffer}
                <button onClick={() => setActiveOffer(null)} className="text-stone-500 hover:text-red-400 ml-2 cursor-pointer">✕</button>
              </div>
            )}
          </div>

          <div className="glassmorphism p-8 border border-gold-500/10 shadow-2xl">
            {submitStatus === "success" ? (
              <div className="text-center py-12 animate-fade-in text-left">
                <div className="w-14 h-14 bg-gold-500/20 text-gold-500 rounded-full flex items-center justify-center text-2xl mx-auto mb-6">✓</div>
                <h3 className="text-2xl font-light text-gold-500 font-luxury mb-4 text-center">
                  {t.successTitle}
                </h3>
                <p className="text-stone-300 leading-relaxed max-w-md mx-auto text-sm text-center">
                  {t.successMsg}
                </p>
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <a
                    href={`/?lang=${lang}`}
                    className="text-[11px] uppercase tracking-widest font-semibold border border-gold-500/30 text-gold-300 px-6 py-3 hover:bg-gold-500/10 transition-premium text-center min-w-[165px] cursor-pointer"
                  >
                    {t.btnHome}
                  </a>
                  <button
                    onClick={() => setSubmitStatus("idle")}
                    className="text-[11px] uppercase tracking-widest font-semibold bg-gold-500/10 border border-gold-500/40 text-gold-400 px-6 py-3 hover:bg-gold-500/20 transition-premium text-center min-w-[165px] cursor-pointer"
                  >
                    {t.btnBookAnother}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 text-left">
                {submitStatus === "error" && (
                  <div className="p-4 bg-red-950/30 border border-red-500/30 text-red-300 text-sm rounded text-center">
                    {t.errorMsg}
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col">
                    <label className="text-[10px] uppercase tracking-widest text-stone-400 mb-2 font-semibold">
                      {t.labelName}
                    </label>
                    <input type="text" name="name" required value={bookingForm.name} onChange={handleInput}
                      className="bg-black/40 border border-white/10 text-stone-200 px-4 py-3 focus:outline-none focus:border-gold-500 transition-premium text-sm" />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] uppercase tracking-widest text-stone-400 mb-2 font-semibold">
                      {t.labelPhone}
                    </label>
                    <div className="flex bg-black/40 border border-white/10 focus-within:border-gold-500 transition-premium rounded overflow-hidden">
                      <select
                        name="countryCode"
                        value={bookingForm.countryCode}
                        onChange={handleInput}
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
                        value={bookingForm.phone}
                        onChange={handleInput}
                        className="bg-transparent text-stone-200 px-4 py-3 focus:outline-none flex-1 text-sm font-sans w-full border-none"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] uppercase tracking-widest text-stone-400 mb-2 font-semibold">
                      {t.labelEmail}
                    </label>
                    <input type="email" name="email" value={bookingForm.email} onChange={handleInput}
                      className="bg-black/40 border border-white/10 text-stone-200 px-4 py-3 focus:outline-none focus:border-gold-500 transition-premium text-sm" />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] uppercase tracking-widest text-stone-400 mb-2 font-semibold">
                      {t.labelGuests}
                    </label>
                    <input type="number" name="guests" required min="1" value={bookingForm.guests} onChange={handleInput}
                      className="bg-black/40 border border-white/10 text-stone-200 px-4 py-3 focus:outline-none focus:border-gold-500 transition-premium text-sm" />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] uppercase tracking-widest text-stone-400 mb-2 font-semibold">
                      {t.labelDate}
                    </label>
                    <input type="date" name="date" required value={bookingForm.date} onChange={handleInput}
                      className="bg-black/40 border border-white/10 text-stone-200 px-4 py-3 focus:outline-none focus:border-gold-500 transition-premium text-sm" />
                  </div>
                  <div className="flex flex-col relative">
                    <label className="text-[10px] uppercase tracking-widest text-stone-400 mb-2 font-semibold">
                      {t.labelTime}
                    </label>
                    <button
                      type="button"
                      onClick={() => setTimeDropdownOpen(!timeDropdownOpen)}
                      className="w-full flex items-center justify-between bg-black/40 border border-gold-500/40 text-stone-200 px-4 py-3 focus:outline-none focus:border-gold-500 hover:border-gold-500/80 transition-premium text-sm text-left font-luxury cursor-pointer"
                    >
                      <span className={bookingForm.time ? "text-lg font-semibold text-gold-400 font-luxury" : "text-sm text-stone-500 font-luxury"}>
                        {bookingForm.time || t.placeholderTime}
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
                            className="w-full text-left px-6 py-3 text-stone-500 text-sm hover:text-base hover:text-stone-300 hover:bg-white/5 border-b border-white/5 transition-premium font-luxury"
                          >
                            {t.placeholderTime}
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
                                className={`w-full text-left px-8 py-3.5 text-lg hover:text-xl hover:text-gold-300 transition-premium font-luxury ${
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
                                className={`w-full text-left px-8 py-3.5 text-lg hover:text-xl hover:text-gold-300 transition-premium font-luxury ${
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
                  <label className="text-[10px] uppercase tracking-widest text-stone-400 mb-2 font-semibold">
                    {t.labelSpecialRequest}
                  </label>
                  <textarea name="notes" rows="3" value={bookingForm.notes} onChange={handleInput}
                    placeholder={t.placeholderSpecialRequest}
                    className="bg-black/40 border border-white/10 text-stone-200 px-4 py-3 focus:outline-none focus:border-gold-500 transition-premium text-sm resize-none" />
                </div>
                <button
                  type="submit"
                  disabled={submitStatus === "loading"}
                  className="w-full text-[12px] uppercase tracking-widest font-semibold bg-gold-500 text-dark-500 py-4 hover:bg-gold-400 shadow-[0_0_15px_rgba(197,165,90,0.15)] disabled:opacity-50 transition-premium cursor-pointer"
                >
                  {submitStatus === "loading" ? t.btnSubmitLoading : t.btnSubmit}
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

export default function OffersPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-dark-500 text-gold-500 tracking-widest text-sm uppercase font-semibold">
        Loading...
      </div>
    }>
      <OffersContent />
    </Suspense>
  );
}
