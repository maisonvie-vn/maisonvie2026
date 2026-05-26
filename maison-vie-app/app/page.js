"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { supabase } from "../lib/supabase";
import { COUNTRY_CODES } from "../lib/countryCodes";
import Header from "@/components/Header";

// 🌐 MULTI-LANGUAGE DICTIONARY (VI, EN, FR, JA, KO, HK)
const I18N = {
  vi: {
    navHome: "Trang Chủ",
    navMenu: "Thực Đơn",
    navWine: "Hầm Rượu",
    navOffers: "Ưu Đãi",
    navEvents: "Sự Kiện",
    navPartners: "Đối Tác",
    navChef: "Bếp Trưởng",
    navAmbiance: "Không Gian",
    navBooking: "Đặt Bàn Ngay",
    heroTitle: "Maison Vie",
    heroSubtitle: "Cuisine Française Classique · Terroir Vietnamien",
    heroDesc: "Sự kết hợp tinh hoa giữa ẩm thực Pháp cổ điển và nguyên liệu thổ nhưỡng Việt Nam chọn lọc. Điểm đến chuẩn mực cho thực khách sành ăn tại Hà Nội.",
    btnMenu: "Khám Phá Thực Đơn",
    btnReserve: "Đặt Giữ Chỗ",
    chefTitle: "Hương Vị Từ Bếp Trưởng Joel",
    chefDesc: "Bếp trưởng Joel mang đến hơn 25 năm kinh nghiệm làm việc tại các nhà hàng Pháp danh tiếng hàng đầu tại Paris. Triết lý của ông là sự kết hợp đầy tôn kính giữa kỹ thuật nấu ăn thượng thừa của Pháp và những nốt hương vị độc bản ẩn giấu trong thảo mộc bản địa Việt Nam.",
    galleryTitle: "Không Gian Tân Cổ Điển Pháp",
    gallerySubtitle: "Nghệ thuật kiến trúc trường tồn đầy kiêu hãnh",
    roomFacade: "Mặt tiền biệt thự Maison Vie",
    roomDining: "Phòng ăn chính chính điện",
    roomVip1: "Phòng VIP 1 (Salon Privé)",
    roomVip2: "Phòng VIP 2 (Le Jardin)",
    roomKitchen: "Gian bếp mở L'Art Culinaire",
    bookingTitle: "Yêu Cầu Đặt Bàn Thượng Khách",
    bookingSubtitle: "Trải nghiệm ẩm thực hoàn hảo bắt đầu từ sự chuẩn bị chu đáo",
    labelName: "Họ và Tên",
    labelPhone: "Số Điện Thoại",
    labelEmail: "Địa Chỉ Email",
    labelGuests: "Số Lượng Khách",
    labelDate: "Ngày Dùng Bữa",
    labelTime: "Giờ Đón Tiếp",
    labelAllergens: "Chất dị ứng cần tránh (Nếu có)",
    labelNotes: "Yêu cầu đặc biệt (Setup tiệc, hoa tươi, phòng VIP...)",
    btnSubmit: "Gửi Yêu Cầu Giữ Chỗ",
    submitting: "Đang truyền dữ liệu...",
    successTitle: "Yêu Cầu Tiếp Nhận Thành Công",
    successMsg: "Maison Vie đã tiếp nhận yêu cầu và đang sắp xếp sơ đồ bàn ăn tối ưu nhất cho quý khách. Lễ tân sẽ liên hệ lại bằng email/điện thoại để xác nhận chính thức trong ít phút.",
    errTitle: "Đã Có Lỗi Xảy Ra",
    errMsg: "Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại thông tin hoặc liên hệ hotline: 0989 091 383.",
    footerHours: "Giờ Hoạt Động",
    footerContact: "Liên Hệ",
    footerAddress: "Địa chỉ: 28 Tăng Bạt Hổ, Quận Hai Bà Trưng, Hà Nội",
    allergenCelery: "Cần tây",
    allergenGluten: "Gluten (Bột mì/Lúa mạch)",
    allergenCrustaceans: "Giáp xác (Tôm/Cua)",
    allergenEggs: "Trứng",
    allergenFish: "Cá",
    allergenMilk: "Sữa & Bơ",
    allergenMolluscs: "Thân mềm (Nghêu/Sò/Ốc)",
    allergenMustard: "Mù tạt",
    allergenNuts: "Hạt cứng (Hạnh nhân/Óc chó)",
    allergenPeanuts: "Đậu phộng",
    allergenSesame: "Mè",
    allergenSoya: "Đậu nành",
    allergenSulphites: "Sulphites (Trong rượu)",
    allergenSelect: "Chọn chất dị ứng nếu có",
    allergenNone: "Không có chất dị ứng"
  },
  en: {
    navHome: "Home",
    navMenu: "Menu",
    navWine: "Wine List",
    navOffers: "Offers",
    navEvents: "Events",
    navPartners: "Partners",
    navChef: "Executive Chef",
    navAmbiance: "Ambiance",
    navBooking: "Book Now",
    heroTitle: "Maison Vie",
    heroSubtitle: "Cuisine Française Classique · Terroir Vietnamien",
    heroDesc: "A sublime integration of classic French culinary arts and selected Vietnamese terroir. The gold standard for fine dining in Hanoi.",
    btnMenu: "Explore Menu",
    btnReserve: "Make Reservation",
    chefTitle: "Mastery by Chef Joel",
    chefDesc: "Executive Chef Joel brings over 25 years of experience in prestigious French culinary establishments in Paris. His culinary vision represents a respectful marriage of grand French techniques and unique flavor profiles native to Vietnam.",
    galleryTitle: "French Neoclassical Spaces",
    gallerySubtitle: "Timeless architectural elegance at every corner",
    roomFacade: "Maison Vie Facade",
    roomDining: "Main Dining Room",
    roomVip1: "Private Room 1 (Salon Privé)",
    roomVip2: "Private Room 2 (Le Jardin)",
    roomKitchen: "L'Art Culinaire Open Kitchen",
    bookingTitle: "VIP Table Reservation",
    bookingSubtitle: "An exceptional culinary journey begins with perfect planning",
    labelName: "Full Name",
    labelPhone: "Phone Number",
    labelEmail: "Email Address",
    labelGuests: "Number of Guests",
    labelDate: "Dining Date",
    labelTime: "Arrival Time",
    labelAllergens: "Dietary Restrictions / Allergens",
    labelNotes: "Special Requests (VIP room setup, flowers, billing...)",
    btnSubmit: "Submit Reservation Request",
    submitting: "Processing...",
    successTitle: "Reservation Requested Successfully",
    successMsg: "Maison Vie has received your request and is arranging the optimal seating map. Our receptionist will contact you via email or phone for official confirmation shortly.",
    errTitle: "An Error Occurred",
    errMsg: "Failed to submit. Please check your network or call our hotline: 0989 091 383.",
    footerHours: "Opening Hours",
    footerContact: "Contact Us",
    footerAddress: "28 Tang Bat Ho, Hai Ba Trung District, Hanoi",
    allergenCelery: "Celery",
    allergenGluten: "Gluten",
    allergenCrustaceans: "Crustaceans",
    allergenEggs: "Eggs",
    allergenFish: "Fish",
    allergenMilk: "Milk & Dairy",
    allergenMolluscs: "Molluscs",
    allergenMustard: "Mustard",
    allergenNuts: "Tree Nuts",
    allergenPeanuts: "Peanuts",
    allergenSesame: "Sesame",
    allergenSoya: "Soya",
    allergenSulphites: "Sulphites",
    allergenSelect: "Select allergens if any",
    allergenNone: "No allergens"
  },
  fr: {
    navHome: "Accueil",
    navMenu: "Carte",
    navWine: "Carte des Vins",
    navOffers: "Offres",
    navEvents: "Événements",
    navPartners: "Partenaires",
    navChef: "Chef de Cuisine",
    navAmbiance: "Ambiance",
    navBooking: "Réserver",
    heroTitle: "Maison Vie",
    heroSubtitle: "Cuisine Française Classique · Terroir Vietnamien",
    heroDesc: "Une harmonie sublime entre la haute gastronomie française classique et le terroir vietnamien d'exception. Le joyau culinaire de Hanoï.",
    btnMenu: "Découvrir la Carte",
    btnReserve: "Réserver une Table",
    chefTitle: "L'Excellence du Chef Joël",
    chefDesc: "Le Chef Exécutif Joël apporte plus de 25 ans de savoir-faire acquis dans des restaurants étoilés à Paris. Sa cuisine émane d'un mariage respectueux entre les grandes techniques françaises et les saveurs délicates des herbes vietnamiennes.",
    galleryTitle: "Espaces Néoclassiques",
    gallerySubtitle: "L'élégance intemporelle de l'architecture française",
    roomFacade: "Façade de la villa Maison Vie",
    roomDining: "Salle Principale",
    roomVip1: "Salon Privé 1",
    roomVip2: "Salon Privé 2 (Le Jardin)",
    roomKitchen: "L'Art Culinaire cuisine ouverte",
    bookingTitle: "Demande de Réservation VIP",
    bookingSubtitle: "Une expérience inoubliable se prépare dans les moindres détails",
    labelName: "Nom Complet",
    labelPhone: "Numéro de Téléphone",
    labelEmail: "Adresse E-mail",
    labelGuests: "Nombre de Couverts",
    labelDate: "Date du Repas",
    labelTime: "Heure d'Arrivée",
    labelAllergens: "Restrictions alimentaires / Allergènes",
    labelNotes: "Demandes particulières (Fleurs, Salon Privé, événements...)",
    btnSubmit: "Envoyer la Demande",
    submitting: "Envoi en cours...",
    successTitle: "Demande reçue avec succès",
    successMsg: "Maison Vie a bien reçu votre demande. Notre hôtesse vous contactera très rapidement par e-mail ou téléphone pour confirmation officielle.",
    errTitle: "Une erreur est survenue",
    errMsg: "Impossible d'envoyer la demande. Veuillez réessayer ou nous contacter au 0989 091 383.",
    footerHours: "Heures d'Ouverture",
    footerContact: "Contact",
    footerAddress: "28 Tang Bat Ho, District de Hai Ba Trung, Hanoï",
    allergenCelery: "Céleri",
    allergenGluten: "Gluten",
    allergenCrustaceans: "Crustacés",
    allergenEggs: "Œufs",
    allergenFish: "Poissons",
    allergenMilk: "Lait & Produits laitiers",
    allergenMolluscs: "Mollusques",
    allergenMustard: "Moutarde",
    allergenNuts: "Fruits à coque",
    allergenPeanuts: "Arachides",
    allergenSesame: "Graines de sésame",
    allergenSoya: "Soja",
    allergenSulphites: "Sulfites",
    allergenSelect: "Sélectionner les allergènes",
    allergenNone: "Aucun allergène"
  },
  ja: {
    navHome: "ホーム",
    navMenu: "メニュー",
    navWine: "ワインリスト",
    navOffers: "特別プラン",
    navEvents: "イベント",
    navPartners: "パートナー",
    navChef: "総料理長",
    navAmbiance: "空間",
    navBooking: "オンライン予約",
    heroTitle: "メゾン・ヴィ",
    heroSubtitle: "Cuisine Française Classique · Terroir Vietnamien",
    heroDesc: "伝統的なフランス料理の技術と、厳選されたベトナムのテロワール（風土）の美しき調和。ハノイで最上級のファインダイニングをご堪能ください。",
    btnMenu: "メニューを見る",
    btnReserve: "テーブル予約",
    chefTitle: "シェフ・ジョエルのシグネチャー",
    chefDesc: "総料理長ジョエルは、パリのミシュラン星付き名店で25年以上のキャリアを積んできました。彼の哲学は、伝統的なフランス料理の技法と、ベトナム独特のハーブやスパイスの豊かな香りの融合です。",
    galleryTitle: "フレンチ・ネオクラシック空間",
    gallerySubtitle: "時を超越した壮麗なフレンチ・ヴィラの佇まい",
    roomFacade: "メゾン・ヴィ 外観",
    roomDining: "メインダイニング",
    roomVip1: "個室 1 (サロン・プリヴェ)",
    roomVip2: "個室 2 (ル・ジャルダン)",
    roomKitchen: "オープンキッチン ラー・キュリネール",
    bookingTitle: "ご予約のリクエスト",
    bookingSubtitle: "完璧な食の体験は、心のこもった準備から始まります",
    labelName: "お名前",
    labelPhone: "電話番号",
    labelEmail: "メールアドレス",
    labelGuests: "ご人数",
    labelDate: "ご来店日",
    labelTime: "ご来店時間",
    labelAllergens: "アレルギー情報 (該当するものがある場合)",
    labelNotes: "特別リクエスト (個室のご要望、サプライズ、お祝いなど)",
    btnSubmit: "予約リクエストを送信",
    submitting: "送信中...",
    successTitle: "リクエストを承りました",
    successMsg: "メゾン・ヴィにご予約リクエストをいただきありがとうございます。間もなく受付スタッフより、お電話またはメールにて正式なご案内を差し上げます。",
    errTitle: "エラーが発生しました",
    errMsg: "送信できませんでした。通信環境を確認いただくか、お急ぎの場合はお電話（0989 091 383）にてご連絡ください。",
    footerHours: "営業時間",
    footerContact: "お問い合わせ",
    footerAddress: "ハノイ市ハイバーチュン区タンバットホー28番地",
    allergenCelery: "セロリ",
    allergenGluten: "グルテン",
    allergenCrustaceans: "甲殻類 (エビ・カニ)",
    allergenEggs: "卵",
    allergenFish: "魚",
    allergenMilk: "乳製品",
    allergenMolluscs: "貝類",
    allergenMustard: "マスタード",
    allergenNuts: "ナッツ類",
    allergenPeanuts: "落花生",
    allergenSesame: "ごま",
    allergenSoya: "大豆",
    allergenSulphites: "亜硫酸塩",
    allergenSelect: "アレルギーを選択",
    allergenNone: "アレルギーなし"
  },
  ko: {
    navHome: "홈",
    navMenu: "메뉴",
    navWine: "와인 목록",
    navOffers: "특별 혜택",
    navEvents: "이벤트",
    navPartners: "파트너",
    navChef: "총주방장",
    navAmbiance: "공간",
    navBooking: "예약하기",
    heroTitle: "메종 비",
    heroSubtitle: "Cuisine Française Classique · Terroir Vietnamien",
    heroDesc: "전통 프랑스 요리 예술과 엄선된 베트남 테로아의 고결한 결합. 하노이에서 가장 권위 있는 프렌치 파인 다이닝.",
    btnMenu: "메뉴 탐색",
    btnReserve: "식사 예약",
    chefTitle: "셰프 조엘의 예술세계",
    chefDesc: "총주방장 조엘(Chef Joel)은 파리의 유서 깊은 미쉐린 스타 레스토랑에서 25년 이상 헌신해 왔습니다. 그의 요리 철학은 엄격한 정통 프랑스 퀴진 기술과 베트남 고유 식재료의 조화로운 어우러짐입니다.",
    galleryTitle: "프렌치 네오클래식 공간",
    gallerySubtitle: "시간이 멈춘 듯한 우아한 프렌치 빌라 아키텍처",
    roomFacade: "메종 비 빌라 전경",
    roomDining: "메인 다이닝 룸",
    roomVip1: "프라이빗 룸 1 (살롱 프리베)",
    roomVip2: "프라이빗 룸 2 (르 자르댕)",
    roomKitchen: "라르 퀼리네르 오픈 키친",
    bookingTitle: "VIP 귀빈 예약",
    bookingSubtitle: "완벽한 다이닝 체험은 정성스러운 사전 계획에서 시작됩니다",
    labelName: "성함",
    labelPhone: "전화번호",
    labelEmail: "이메일 주소",
    labelGuests: "고객 수",
    labelDate: "예약 일자",
    labelTime: "도착 시간",
    labelAllergens: "알레르기 정보 (해당 시 선택)",
    labelNotes: "특별 요청 사항 (VIP 개별 룸, 장식, 꽃 선물...)",
    btnSubmit: "예약 요청 제출",
    submitting: "제출 중...",
    successTitle: "예약 요청이 성공적으로 완료되었습니다",
    successMsg: "메종 비가 고객님의 예약을 성공적으로 접수하였습니다. 신속하게 리셉션 팀에서 이메일 또는 전화로 연락하여 확정해 드리겠습니다.",
    errTitle: "오류가 발생했습니다",
    errMsg: "제출에 실패했습니다. 네트워크를 확인하시거나 고객센터(0989 091 383)로 직접 연락해 주십시오.",
    footerHours: "영업 시간",
    footerContact: "고객 센터",
    footerAddress: "하노이시 하이바쭝구 탄밧호 28",
    allergenCelery: "셀러리",
    allergenGluten: "글루텐",
    allergenCrustaceans: "갑각류 (새우/게)",
    allergenEggs: "계란",
    allergenFish: "생선",
    allergenMilk: "유제품",
    allergenMolluscs: "연체동물 (조개류)",
    allergenMustard: "겨자",
    allergenNuts: "견과류",
    allergenPeanuts: "땅콩",
    allergenSesame: "참깨",
    allergenSoya: "대두",
    allergenSulphites: "이산화황",
    allergenSelect: "알레르기 선택",
    allergenNone: "알레르기 없음"
  },
  hk: {
    navHome: "主頁",
    navMenu: "精選菜單",
    navWine: "特藏酒窖",
    navOffers: "餐飲優惠",
    navEvents: "最新活動",
    navPartners: "合作夥伴",
    navChef: "行政總廚",
    navAmbiance: "優雅空間",
    navBooking: "尊貴訂座",
    heroTitle: "Maison Vie",
    heroSubtitle: "Cuisine Française Classique · Terroir Vietnamien",
    heroDesc: "經典法國烹飪工藝與精選越南本土食材的完美融合。河內法式精緻餐飲的黃金標準。",
    btnMenu: "探索菜單",
    btnReserve: "立即訂座",
    chefTitle: "總廚 Joel 的廚藝美學",
    chefDesc: "行政總廚 Joel 擁有超過25年在巴黎頂級法式餐廳工作的豐富經驗。他的烹飪哲學是以精湛的法國傳統廚藝，完美喚醒越南本土香草與食材的獨特風味。",
    galleryTitle: "法式新古典空間",
    gallerySubtitle: "處處流露著永恆與高貴的法式別墅風情",
    roomFacade: "Maison Vie 別墅外觀",
    roomDining: "主用餐大堂",
    roomVip1: "貴賓專區 1 (Salon Privé)",
    roomVip2: "貴賓專區 2 (Le Jardin)",
    roomKitchen: "L'Art Culinaire 開放式廚房",
    bookingTitle: "尊貴席位訂座申請",
    bookingSubtitle: "非凡的餐飲體驗，始於無微不至的貼心準備",
    labelName: "貴賓姓名",
    labelPhone: "聯絡電話",
    labelEmail: "電子郵件",
    labelGuests: "貴賓人數",
    labelDate: "用餐日期",
    labelTime: "抵達時間",
    labelAllergens: "需要避開的過敏原 (如有)",
    labelNotes: "特別要求 (如：VIP房佈置、鮮花、特定賬單等)",
    btnSubmit: "提交訂座申請",
    submitting: "正在傳送...",
    successTitle: "申請已成功受理",
    successMsg: "Maison Vie 已收到您的訂座申請，正為您規劃最佳的席位安排。我們的接待專員將盡快透過電話或電郵與您聯絡以作確認。",
    errTitle: "發生錯誤",
    errMsg: "無法提交申請。請檢查您的網絡，或直接致電熱線：0989 091 383 聯絡我們。",
    footerHours: "營業時間",
    footerContact: "聯絡我們",
    footerAddress: "河內市二征夫人郡 Tang Bat Ho 街 28 號",
    allergenCelery: "芹菜",
    allergenGluten: "麩質",
    allergenCrustaceans: "甲殼類動物 (蝦、蟹)",
    allergenEggs: "雞蛋",
    allergenFish: "魚類",
    allergenMilk: "奶類及乳製品",
    allergenMolluscs: "軟體動物 (貝類)",
    allergenMustard: "芥末",
    allergenNuts: "堅果",
    allergenPeanuts: "花生",
    allergenSesame: "芝麻",
    allergenSoya: "大豆",
    allergenSulphites: "亞硫酸鹽",
    allergenSelect: "選擇過敏原 (如有)",
    allergenNone: "無過敏原"
  }
};

const ALLERGEN_CODES = [
  { code: "CELERY", i18nKey: "allergenCelery" },
  { code: "GLUTEN", i18nKey: "allergenGluten" },
  { code: "CRUSTACEANS", i18nKey: "allergenCrustaceans" },
  { code: "EGGS", i18nKey: "allergenEggs" },
  { code: "FISH", i18nKey: "allergenFish" },
  { code: "MILK", i18nKey: "allergenMilk" },
  { code: "MOLLUSCS", i18nKey: "allergenMolluscs" },
  { code: "MUSTARD", i18nKey: "allergenMustard" },
  { code: "NUTS", i18nKey: "allergenNuts" },
  { code: "PEANUTS", i18nKey: "allergenPeanuts" },
  { code: "SESAME", i18nKey: "allergenSesame" },
  { code: "SOYA", i18nKey: "allergenSoya" },
  { code: "SULPHITES", i18nKey: "allergenSulphites" }
];


const normalizePhone = (code, phone) => {
  let cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("0")) {
    cleaned = cleaned.substring(1);
  }
  return code + cleaned;
};

function HomeContent() {
  const [lang, setLang] = useState("vi");
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [allergensOpen, setAllergensOpen] = useState(false);
  const [timeDropdownOpen, setTimeDropdownOpen] = useState(false);
  
  // 🌐 AUTOMATIC LANGUAGE DETECTION
  useEffect(() => {
    // 1. Check URL parameters
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get("lang");
    if (urlLang && I18N[urlLang]) {
      setLang(urlLang);
      localStorage.setItem("maison_vie_lang", urlLang);
      return;
    }

    // 2. Check localStorage
    const storedLang = localStorage.getItem("maison_vie_lang");
    if (storedLang && I18N[storedLang]) {
      setLang(storedLang);
      return;
    }

    // 3. Detect using Timezone
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz) {
        if (tz.includes("Tokyo") || tz.includes("Osaka") || tz.includes("Sapporo")) {
          setLang("ja");
          return;
        }
        if (tz.includes("Seoul") || tz.includes("Pyongyang")) {
          setLang("ko");
          return;
        }
        if (tz.includes("Paris") || tz.includes("Brussels") || tz.includes("Luxembourg") || tz.includes("Monaco") || tz.includes("Geneva") || tz.includes("Zurich")) {
          setLang("fr");
          return;
        }
        if (tz.includes("Hong_Kong") || tz.includes("Macau")) {
          setLang("hk");
          return;
        }
        if (tz.includes("Ho_Chi_Minh") || tz.includes("Saigon") || tz.includes("Hanoi")) {
          setLang("vi");
          return;
        }
      }
    } catch (e) {
      console.error("Timezone-based language detection error:", e);
    }

    // 4. Fallback to navigator languages
    const navigatorLang = navigator.language || (navigator.languages && navigator.languages[0]);
    if (navigatorLang) {
      const primaryLang = navigatorLang.split("-")[0].toLowerCase();
      if (I18N[primaryLang]) {
        setLang(primaryLang);
      } else if (navigatorLang.toLowerCase().includes("hk") || navigatorLang.toLowerCase().includes("tw")) {
        setLang("hk");
      } else {
        setLang("en"); // Default fallback
      }
    }
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    countryCode: "+84",
    email: "",
    guests: 2,
    date: "",
    time: "19:00",
    notes: "",
    allergens: []
  });
  
  const [status, setStatus] = useState("idle"); // idle, loading, success, error
  const t = I18N[lang] || I18N.vi;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAllergenToggle = (code) => {
    setFormData((prev) => {
      const exists = prev.allergens.includes(code);
      const updated = exists 
        ? prev.allergens.filter((a) => a !== code) 
        : [...prev.allergens, code];
      return { ...prev, allergens: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    try {
      // 1. Check or Insert Customer (Consent date recorded as per Decree 13)
      let customerId = null;
      
      const fullPhone = normalizePhone(formData.countryCode, formData.phone);

      const { data: customerData, error: custFindError } = await supabase
        .from("customers")
        .select("id")
        .eq("phone", fullPhone)
        .maybeSingle();

      if (custFindError) throw custFindError;

      if (customerData) {
        customerId = customerData.id;
      } else {
        const { data: newCust, error: custInsertError } = await supabase
          .from("customers")
          .insert({
            full_name: formData.name,
            phone: fullPhone,
            email: formData.email || null,
            vip_level: 1,
            consent_at: new Date().toISOString()
          })
          .select("id")
          .single();

        if (custInsertError) throw custInsertError;
        customerId = newCust.id;
      }

      // 2. Insert Reservation into reservations table (Peak hours requires manual approval)
      const { error: resError } = await supabase
        .from("reservations")
        .insert({
          customer_id: customerId,
          guest_name: formData.name,
          guest_phone: fullPhone,
          guest_email: formData.email || null,
          guest_count: parseInt(formData.guests),
          booking_date: formData.date,
          booking_time: formData.time + ":00",
          notes: formData.notes || null,
          language: lang,
          status: "pending" // requires manual review for optimal 250 seats configuration
        });

      if (resError) throw resError;

      // Send pending email if customer email is provided
      if (formData.email) {
        try {
          await fetch("/api/send-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              to: formData.email,
              subject: lang === "vi" ? "Maison Vie - Yêu cầu đặt bàn đang được sắp xếp" : "Maison Vie - Table reservation request in progress",
              type: "booking_pending",
              lang: lang,
              data: {
                guestName: formData.name,
                guestPhone: fullPhone,
                guestCount: formData.guests,
                bookingDate: formData.date,
                bookingTime: formData.time,
                notes: formData.notes
              }
            })
          });
        } catch (mailErr) {
          console.error("Failed to send booking pending email:", mailErr);
        }
      }

      setStatus("success");
      setFormData({
        name: "",
        phone: "",
        countryCode: "+84",
        email: "",
        guests: 2,
        date: "",
        time: "19:00",
        notes: "",
        allergens: []
      });
    } catch (error) {
      console.error("Booking Error:", error);
      setStatus("error");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-dark-500 font-sans selection:bg-gold-500 selection:text-dark-500">
      
      {/* 🏛️ HEADER / NAVIGATION */}
      <Header lang={lang} setLang={setLang} />

      {/* 🌌 HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden py-24">
        {/* Background Dark Overlay */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-dark-400 via-dark-500 to-black" />
        
        {/* Fine Art Neoclassical Grid lines overlay */}
        <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(255,255,255,0.015)_1px,_transparent_1px)] bg-[size:100px_100px] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center">
          <span className="text-[11px] uppercase tracking-[0.4em] text-gold-500 font-semibold mb-6 animate-fade-in">
            {t.heroSubtitle}
          </span>
          <h1 className="text-6xl md:text-8xl font-medium tracking-tight mb-8 text-gold-500 gold-text-gradient font-luxury animate-fade-in">
            {t.heroTitle}
          </h1>
          <p className="max-w-2xl text-stone-300 text-lg md:text-xl font-light leading-relaxed mb-12 animate-fade-in">
            {t.heroDesc}
          </p>

          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 animate-fade-in">
            <a 
              href="#booking"
              className="text-[13px] uppercase tracking-widest font-semibold bg-gold-500 text-dark-500 px-8 py-4.5 hover:bg-gold-400 shadow-[0_0_20px_rgba(197,165,90,0.25)] transition-premium"
            >
              {t.btnReserve}
            </a>
            <a 
              href={`/menu?lang=${lang}`}
              className="text-[13px] uppercase tracking-widest font-semibold border border-gold-500/30 text-gold-300 px-8 py-4.5 hover:bg-gold-500/10 transition-premium"
            >
              {t.btnMenu}
            </a>
          </div>
        </div>
      </section>

      {/* 👨‍🍳 EXECUTIVE CHEF SECTION */}
      <section id="chef" className="py-32 bg-dark-400 border-y border-white/5 relative">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Chef Image with Premium Gold Border */}
          <div className="relative w-full aspect-[4/5] max-w-md mx-auto gold-border-glow overflow-hidden">
            {/* Elegant luxury visual placeholder */}
            <div className="absolute inset-0 bg-gradient-to-t from-dark-500 via-transparent to-transparent z-10" />
            <div className="absolute inset-0 bg-dark-200 flex flex-col items-center justify-center p-8 text-center">
              <span className="text-gold-500 font-luxury text-4xl mb-4 italic">Chef Joel</span>
              <span className="text-stone-400 text-xs tracking-[0.2em] uppercase">25+ Ans D'Expérience Haute Gastronomie</span>
              <div className="w-12 h-[1px] bg-gold-500/30 my-6" />
              <p className="text-stone-500 text-xs font-light max-w-xs leading-relaxed italic">
                \"La gastronomie est un art qui unit les techniques séculaires aux joyaux de la terre.\"
              </p>
            </div>
          </div>

          {/* Chef Description */}
          <div className="flex flex-col text-left">
            <span className="text-[11px] uppercase tracking-[0.3em] text-gold-500 font-semibold mb-4">L'Artiste Culinaire</span>
            <h2 className="text-4xl md:text-5xl font-light tracking-tight text-stone-100 mb-8 font-luxury">
              {t.chefTitle}
            </h2>
            <div className="w-16 h-[2px] bg-gold-500 mb-8" />
            <p className="text-stone-300 text-lg font-light leading-relaxed mb-8">
              {t.chefDesc}
            </p>
            <div className="flex items-center space-x-6">
              <div className="w-12 h-12 rounded-full border border-gold-500/20 flex items-center justify-center text-gold-500 font-luxury italic text-xl">
                J
              </div>
              <div>
                <h4 className="text-stone-200 font-semibold">Chef Joel</h4>
                <p className="text-stone-500 text-xs tracking-wider uppercase">Bếp Trưởng Điều Hành · Executive Chef</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 🏛️ GALLERY / AMBIANCE SECTION */}
      <section id="ambiance" className="py-32 bg-dark-500 relative">
        <div className="max-w-7xl mx-auto px-6 text-center mb-20">
          <span className="text-[11px] uppercase tracking-[0.3em] text-gold-500 font-semibold mb-4 block">Les Salles Splendides</span>
          <h2 className="text-4xl md:text-5xl font-light tracking-tight text-stone-100 font-luxury mb-4">
            {t.galleryTitle}
          </h2>
          <p className="text-stone-400 font-light max-w-xl mx-auto">
            {t.gallerySubtitle}
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {[
            { title: t.roomFacade, size: "col-span-1", label: "Maison Vie in front" },
            { title: t.roomDining, size: "col-span-1", label: "Dining Room" },
            { title: t.roomVip1, size: "col-span-1", label: "Private Room 1" },
            { title: t.roomVip2, size: "col-span-1", label: "Private Room 2" },
            { title: t.roomKitchen, size: "col-span-1 md:col-span-2 lg:col-span-3", label: "Kitchen" }
          ].map((room, idx) => (
            <div 
              key={idx} 
              className={`relative overflow-hidden gold-border-glow group aspect-[16/10] ${room.size} bg-dark-300 flex flex-col items-center justify-center p-6 text-center`}
              data-label={room.label}
            >
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-premium z-10" />
              <div className="relative z-20 flex flex-col items-center justify-center h-full">
                <span className="text-[10px] uppercase tracking-[0.2em] text-gold-500 font-semibold mb-2">Space 0{idx + 1}</span>
                <h3 className="text-xl md:text-2xl font-light text-stone-100 font-luxury group-hover:text-gold-300 transition-premium">
                  {room.title}
                </h3>
              </div>
            </div>
          ))}

        </div>
      </section>

      {/* 📅 RESERVATION / BOOKING SECTION */}
      <section id="booking" className="py-32 bg-dark-400 border-t border-white/5 relative">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[11px] uppercase tracking-[0.3em] text-gold-500 font-semibold mb-4 block">Réservations Thượng Khách</span>
            <h2 className="text-4xl md:text-5xl font-light tracking-tight text-stone-100 font-luxury mb-4">
              {t.bookingTitle}
            </h2>
            <p className="text-stone-400 font-light">
              {t.bookingSubtitle}
            </p>
          </div>

          {/* Booking Form Card */}
          <div className="glassmorphism p-8 md:p-12 border border-gold-500/10 shadow-2xl relative">
            
            {status === "success" ? (
              <div className="text-center py-12 animate-fade-in">
                <div className="w-16 h-16 bg-gold-500/20 text-gold-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
                  ✓
                </div>
                <h3 className="text-2xl font-light text-gold-500 font-luxury mb-4">{t.successTitle}</h3>
                <p className="text-stone-300 leading-relaxed max-w-md mx-auto">{t.successMsg}</p>
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <a
                    href="/"
                    className="text-[12px] uppercase tracking-widest font-semibold border border-gold-500/30 text-gold-300 px-6 py-3 hover:bg-gold-500/10 transition-premium text-center min-w-[165px]"
                  >
                    {lang === "en" ? "Go to Homepage" :
                     lang === "fr" ? "Retour à l'accueil" :
                     lang === "ja" ? "ホームページに戻る" :
                     lang === "ko" ? "홈페이지로 돌아가기" :
                     lang === "hk" ? "返回首頁" : "Về Trang Chủ"}
                  </a>
                  <button
                    onClick={() => setStatus("idle")}
                    className="text-[12px] uppercase tracking-widest font-semibold bg-gold-500/10 border border-gold-500/40 text-gold-400 px-6 py-3 hover:bg-gold-500/20 transition-premium text-center min-w-[165px]"
                  >
                    {lang === "en" ? "Book Another Table" :
                     lang === "fr" ? "Réserver une autre table" :
                     lang === "ja" ? "別のテーブルを予約" :
                     lang === "ko" ? "다른 테이블 예약" :
                     lang === "hk" ? "預訂其他桌子" : "Đặt Tiếp Bàn Khác"}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* Status Indicator */}
                {status === "error" && (
                  <div className="p-4 bg-red-950/30 border border-red-500/30 text-red-300 text-sm rounded text-center animate-fade-in">
                    <strong>{t.errTitle}:</strong> {t.errMsg}
                  </div>
                )}

                {/* Main Inputs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  <div className="flex flex-col text-left">
                    <label className="text-[11px] uppercase tracking-widest text-stone-400 mb-2 font-semibold">{t.labelName} *</label>
                    <input 
                      type="text" 
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="bg-black/40 border border-white/10 text-stone-200 px-4 py-3 focus:outline-none focus:border-gold-500 transition-premium text-sm"
                    />
                  </div>

                  <div className="flex flex-col text-left">
                    <label className="text-[11px] uppercase tracking-widest text-stone-400 mb-2 font-semibold">{t.labelPhone} *</label>
                    <div className="flex bg-black/40 border border-white/10 focus-within:border-gold-500 transition-premium rounded overflow-hidden">
                      <select
                        name="countryCode"
                        value={formData.countryCode}
                        onChange={handleInputChange}
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
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="bg-transparent text-stone-200 px-4 py-3 focus:outline-none flex-1 text-sm font-sans w-full"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col text-left">
                    <label className="text-[11px] uppercase tracking-widest text-stone-400 mb-2 font-semibold">{t.labelEmail}</label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="bg-black/40 border border-white/10 text-stone-200 px-4 py-3 focus:outline-none focus:border-gold-500 transition-premium text-sm"
                    />
                  </div>

                  <div className="flex flex-col text-left">
                    <label className="text-[11px] uppercase tracking-widest text-stone-400 mb-2 font-semibold">{t.labelGuests} *</label>
                    <input 
                      type="number" 
                      name="guests"
                      required
                      min="1"
                      value={formData.guests}
                      onChange={handleInputChange}
                      className="bg-black/40 border border-white/10 text-stone-200 px-4 py-3 focus:outline-none focus:border-gold-500 transition-premium text-sm"
                    />
                  </div>

                  <div className="flex flex-col text-left">
                    <label className="text-[11px] uppercase tracking-widest text-stone-400 mb-2 font-semibold">{t.labelDate} *</label>
                    <input 
                      type="date" 
                      name="date"
                      required
                      value={formData.date}
                      onChange={handleInputChange}
                      className="bg-black/40 border border-white/10 text-stone-200 px-4 py-3 focus:outline-none focus:border-gold-500 transition-premium text-sm"
                    />
                  </div>

                  <div className="flex flex-col text-left relative">
                    <label className="text-[11px] uppercase tracking-widest text-stone-400 mb-2 font-semibold">{t.labelTime} *</label>
                    <button
                      type="button"
                      onClick={() => setTimeDropdownOpen(!timeDropdownOpen)}
                      className="w-full flex items-center justify-between bg-black/40 border border-gold-500/40 text-stone-200 px-4 py-3 focus:outline-none focus:border-gold-500 hover:border-gold-500/80 transition-premium text-sm text-left font-luxury cursor-pointer"
                    >
                      <span className={formData.time ? "text-lg font-semibold text-gold-400 font-luxury" : "text-sm text-stone-500 font-luxury"}>
                        {formData.time || (lang === "vi" ? "Chọn giờ đón tiếp" : "Select a time")}
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
                              setFormData((prev) => ({ ...prev, time: "" }));
                              setTimeDropdownOpen(false);
                            }}
                            className="w-full text-left px-6 py-3 text-stone-500 text-sm hover:text-base hover:text-stone-300 hover:bg-white/5 border-b border-white/5 transition-premium font-luxury"
                          >
                            {lang === "vi" ? "Chọn giờ đón tiếp" : "Select a time"}
                          </button>

                          {/* Lunch Section */}
                          <div className="px-6 py-2.5 text-gold-500 text-xs font-bold bg-black/60 font-luxury uppercase tracking-wider">
                            {lang === "vi" ? "Lunch (10:00 – 14:00)" : "Lunch (10:00–14:00)"}
                          </div>
                          <div className="flex flex-col">
                            {["10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00"].map((slot) => (
                              <button
                                key={slot}
                                type="button"
                                onClick={() => {
                                  setFormData((prev) => ({ ...prev, time: slot }));
                                  setTimeDropdownOpen(false);
                                }}
                                className={`w-full text-left px-8 py-3.5 text-lg hover:text-xl hover:text-gold-300 transition-premium font-luxury ${
                                  formData.time === slot
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
                            {lang === "vi" ? "Dinner (17:00 – 22:00)" : "Dinner (17:00–22:00)"}
                          </div>
                          <div className="flex flex-col">
                            {["17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00"].map((slot) => (
                              <button
                                key={slot}
                                type="button"
                                onClick={() => {
                                  setFormData((prev) => ({ ...prev, time: slot }));
                                  setTimeDropdownOpen(false);
                                }}
                                className={`w-full text-left px-8 py-3.5 text-lg hover:text-xl hover:text-gold-300 transition-premium font-luxury ${
                                  formData.time === slot
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

                {/* 14 Allergens EU Selector Dropdown */}
                <div className="flex flex-col text-left relative">
                  <label className="text-[11px] uppercase tracking-widest text-stone-400 mb-2 font-semibold">
                    {t.labelAllergens}
                  </label>
                  
                  {/* Select button looking trigger */}
                  <button
                    type="button"
                    onClick={() => setAllergensOpen(!allergensOpen)}
                    className="w-full flex items-center justify-between bg-black/40 border border-white/10 text-stone-200 px-4 py-3 focus:outline-none focus:border-gold-500 hover:border-white/20 transition-premium text-sm text-left"
                  >
                    <span className="truncate">
                      {formData.allergens.length === 0
                        ? t.allergenNone
                        : formData.allergens
                            .map((code) => {
                              const found = ALLERGEN_CODES.find((a) => a.code === code);
                              return found ? t[found.i18nKey] : code;
                            })
                            .join(", ")}
                    </span>
                    <span className="text-[10px] text-gold-500 ml-2 transition-transform duration-300" style={{ transform: allergensOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                      ▼
                    </span>
                  </button>

                  {/* Dropdown panel */}
                  {allergensOpen && (
                    <>
                      {/* Invisible backdrop to close the dropdown when clicking outside */}
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setAllergensOpen(false)}
                      />
                      
                      <div className="absolute left-0 right-0 mt-1 top-full z-50 glassmorphism max-h-64 overflow-y-auto p-4 border border-gold-500/20 shadow-2xl rounded animate-fade-in grid grid-cols-2 gap-2">
                        {ALLERGEN_CODES.map((item) => {
                          const isActive = formData.allergens.includes(item.code);
                          return (
                            <button
                              key={item.code}
                              type="button"
                              onClick={() => handleAllergenToggle(item.code)}
                              className={`text-[11px] hover:text-[13px] text-left px-3 py-2 border transition-premium rounded flex items-center space-x-2 ${
                                isActive 
                                  ? "bg-gold-500/10 border-gold-500/40 text-gold-400 font-semibold" 
                                  : "bg-black/40 border-white/5 text-stone-400 hover:border-gold-500/20 hover:text-stone-200"
                              }`}
                            >
                              <span className={`w-3.5 h-3.5 border rounded flex items-center justify-center text-[9px] ${
                                isActive ? "border-gold-500 bg-gold-500 text-dark-500" : "border-white/20"
                              }`}>
                                {isActive && "✓"}
                              </span>
                              <span className="truncate">{t[item.i18nKey] || item.code}</span>
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>

                {/* Special Notes (Notes) */}
                <div className="flex flex-col text-left">
                  <label className="text-[11px] uppercase tracking-widest text-stone-400 mb-2 font-semibold">{t.labelNotes}</label>
                  <textarea 
                    name="notes"
                    rows="3"
                    value={formData.notes}
                    onChange={handleInputChange}
                    className="bg-black/40 border border-white/10 text-stone-200 px-4 py-3 focus:outline-none focus:border-gold-500 transition-premium text-sm resize-none"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full text-[13px] uppercase tracking-widest font-semibold bg-gold-500 text-dark-500 py-4 hover:bg-gold-400 shadow-[0_0_15px_rgba(197,165,90,0.15)] disabled:opacity-50 transition-premium"
                >
                  {status === "loading" ? t.submitting : t.btnSubmit}
                </button>

              </form>
            )}

          </div>
        </div>
      </section>

      {/* 🏛️ FOOTER */}
      <footer className="bg-black border-t border-white/5 py-16 text-stone-400 text-sm">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
          
          {/* Logo & Slogan */}
          <div className="flex flex-col">
            <span className="text-xl font-semibold tracking-wider text-gold-500 font-luxury uppercase">Maison Vie</span>
            <span className="text-[9px] uppercase tracking-[0.25em] text-stone-500 font-sans mt-0.5 mb-6">Haute Cuisine</span>
            <p className="text-stone-500 text-xs font-light leading-relaxed max-w-xs">
              \"Terroir Vietnamien bọc trong kỹ thuật Pháp cổ điển - Một điểm đến ẩm thực đẳng cấp thượng lưu.\"
            </p>
          </div>

          {/* Opening Hours */}
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-widest text-stone-200 font-semibold mb-4">{t.footerHours}</span>
            <div className="space-y-2 text-xs font-light">
              <p>Mỗi ngày / Everyday: 11:00 – 14:00 & 17:30 – 22:00</p>
              <p>Giờ cao điểm / Peak hours: 18:00 – 20:30 (Duyệt bàn thủ công)</p>
            </div>
          </div>

          {/* Contact Details */}
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-widest text-stone-200 font-semibold mb-4">{t.footerContact}</span>
            <div className="space-y-2 text-xs font-light">
              <p>{t.footerAddress}</p>
              <p>Hotline: 0989 091 383</p>
              <p>Email: info@maisonvie.vn</p>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-600 font-light">
          <p>© 2026 Maison Vie. All rights reserved.</p>
          <div className="flex space-x-6 my-4 sm:my-0">
            <a href={`/blog?lang=${lang}`} className="hover:text-gold-500 transition-premium">Journal (Blog)</a>
            <a href={`/careers?lang=${lang}`} className="hover:text-gold-500 transition-premium">Careers (Tuyển Dụng)</a>
          </div>
          <p>French Culinary Excellence · Decree 13 Personal Data Privacy Secure</p>
        </div>
      </footer>

    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-dark-500 text-gold-500 tracking-widest text-sm uppercase font-semibold">
        Loading...
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
