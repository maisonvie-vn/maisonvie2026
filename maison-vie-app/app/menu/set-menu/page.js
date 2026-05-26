"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import { COUNTRY_CODES } from "../../../lib/countryCodes";
import Header from "@/components/Header";

// 🌐 Multilingual content for Set Menu page
const I18N = {
  vi: {
    title: "Thực Đơn Set Menu",
    subtitle: "Nghệ thuật ẩm thực Pháp cổ điển kết hợp tinh hoa bản địa",
    desc: "Khám phá các set ăn đặc sắc được thiết kế tỉ mỉ bởi Bếp trưởng Joel, kể câu chuyện hài hòa giữa kỹ nghệ ẩm thực Haute Gastronomie Pháp và nguyên liệu thổ nhưỡng quý hiếm của Việt Nam.",
    filterAllergensTitle: "Bộ lọc Dị Ứng Thông Minh",
    filterAllergensDesc: "Chọn các chất gây dị ứng bạn cần tránh. Hệ thống sẽ tự động đánh dấu cảnh báo các món ăn có chứa chất đó.",
    allergenWarning: "Có chứa chất dị ứng đã chọn",
    winePairingTitle: "Gợi ý kết hợp rượu vang",
    btnReserveSet: "Đăng ký Set Menu này",
    bookingTitle: "Đặt Bàn Thưởng Thức Set Menu",
    bookingSubtitle: "Trải nghiệm ẩm thực hoàn hảo của bạn đã sẵn sàng",
    labelName: "Họ và Tên",
    labelPhone: "Số Điện Thoại",
    labelEmail: "Địa Chỉ Email",
    labelGuests: "Số Lượng Khách",
    labelDate: "Ngày Dùng Bữa",
    labelTime: "Giờ Đón Tiếp",
    labelNotes: "Yêu cầu đặc biệt (Phòng VIP, trang trí hoa tươi...)",
    labelSelectedMenu: "Set Menu Đã Chọn",
    btnSubmit: "Gửi Yêu Cầu Giữ Chỗ",
    successTitle: "Đặt bàn thành công",
    successMsg: "Yêu cầu đặt Set Menu của quý khách đã được ghi nhận. Bộ phận lễ tân sẽ liên hệ lại xác nhận sớm nhất.",
    errorTitle: "Lỗi kết nối",
    errorMsg: "Đã có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại hoặc gọi Hotline: 0989 091 383.",
    courseTitle: "Chi tiết các món ăn",
    allergenLabel: "Dị ứng cần tránh",
    priceByServices: "Giá theo số món chọn",
    winePairingPackage: "Gói kết hợp rượu vang",
    vatDisclaimer: "* Giá chưa bao gồm 5% phí phục vụ & 10% thuế VAT",
    veganNotice: "* Có thể chuẩn bị món thuần chay với yêu cầu trước 24h",
    perGuest: " / khách (Dine-in)",
    suggestedJourneys: "Hành Trình Gợi Ý",
    cellarSuggestions: "Gợi ý từ bộ sưu tập hầm rượu",
    chooseOne: "— Lựa chọn một trong các món sau —",
    or: "hoặc",
    vatDisclaimerLong: "Tất cả giá hiển thị bằng VND. 5% phí phục vụ và 10% thuế VAT chưa bao gồm.",
    noteTable: "Menu phục vụ cho toàn bàn.",
    noteCookingTime: "Soufflé: 12 phút nướng · Wellington Trâu: 25 phút — vui lòng gọi món ngay từ đầu bữa ăn.",
    notesTitle: "Lưu ý cho thực khách",
    notesAllergiesTitle: "Dị ứng & Hạn chế",
    notesAllergiesDesc: "Vui lòng thông báo cho chúng tôi về bất kỳ dị ứng hoặc hạn chế ăn uống nào khi đặt bàn.",
    notesDietsTitle: "Chế độ ăn đặc biệt",
    notesDietsDesc: "Không chứa gluten, không lactose, chay/halal/kosher: có thể thích ứng nếu báo trước 24 giờ. Phụ nữ mang thai: vui lòng báo với phục vụ.",
    notesOriginTitle: "Nguồn gốc nguyên liệu",
    notesOriginDesc: "Sò điệp Hokkaido · Cá tuyết đen Alaska · Caviar Sturia (Aquitaine) · Bơ Échiré AOP · Cá vược & Tôm Nha Trang · Vani Madagascar/Phú Quốc · Rau củ & Thảo mộc Đà Lạt · Thịt trâu Việt Nam · Tiêu đen Phú Quốc.",
    bookingPrefix: "Đăng ký Set Menu: "
  },
  en: {
    title: "Tasting Set Menus",
    subtitle: "Classic French Gastronomy meets Vietnamese Terroir",
    desc: "Embark on an exquisite culinary journey curated by Executive Chef Joel, harmonizing the grand techniques of French Haute Cuisine with rare, handpicked Vietnamese ingredients.",
    filterAllergensTitle: "Smart Allergen Filter",
    filterAllergensDesc: "Select dietary restrictions or allergens to avoid. The system will automatically flag items containing them.",
    allergenWarning: "Contains selected allergen",
    winePairingTitle: "Sommelier Wine Pairing suggestions",
    btnReserveSet: "Reserve this Set Menu",
    bookingTitle: "Book Your Tasting Experience",
    bookingSubtitle: "An exceptional gastronomic journey awaits you",
    labelName: "Full Name",
    labelPhone: "Phone Number",
    labelEmail: "Email Address",
    labelGuests: "Number of Guests",
    labelDate: "Dining Date",
    labelTime: "Arrival Time",
    labelNotes: "Special requests (VIP room, decorations, billing...)",
    labelSelectedMenu: "Selected Set Menu",
    btnSubmit: "Submit Reservation Request",
    successTitle: "Reservation Requested",
    successMsg: "Your Set Menu reservation has been received. Our receptionist will contact you shortly to confirm.",
    errorTitle: "Network Error",
    errorMsg: "Failed to submit request. Please try again or call our hotline: 0989 091 383.",
    courseTitle: "Course by Course",
    allergenLabel: "Allergens to avoid",
    priceByServices: "Price by number of services",
    winePairingPackage: "Sommelier Wine Pairing",
    vatDisclaimer: "* 5% service charge & 10% VAT not included",
    veganNotice: "* Vegan option available with 24h notice",
    perGuest: " / guest (Dine-in)",
    suggestedJourneys: "Suggested Journeys",
    cellarSuggestions: "Suggestions from our Cellar",
    chooseOne: "— choose one option —",
    or: "or",
    vatDisclaimerLong: "All prices are in VND. 5% service charge and 10% VAT not included.",
    noteTable: "Menu served for the entire table.",
    noteCookingTime: "Soufflé: 12 min cooking time · Buffalo Wellington: 25 min — to be ordered at the start of the meal.",
    notesTitle: "Notes for our Guests",
    notesAllergiesTitle: "Allergies & Restrictions",
    notesAllergiesDesc: "Please notify us of any allergy or dietary restriction at the time of reservation.",
    notesDietsTitle: "Special Diets",
    notesDietsDesc: "Gluten-free, lactose-free, halal, kosher: adaptations possible with 24-hour notice. Pregnant guests: please notify the service.",
    notesOriginTitle: "Origin of Produce",
    notesOriginDesc: "Hokkaido Scallops · Alaska Black Cod · Sturia Caviar (Aquitaine) · Échiré AOP Butter · Nha Trang Seabass & Shrimp · Madagascar/Phú Quốc Vanilla · Đà Lạt Vegetables & Herbs · Vietnamese Water Buffalo · Phú Quốc Black Pepper.",
    bookingPrefix: "Set Menu Reservation: "
  },
  fr: {
    title: "Les Menus Dégustation",
    subtitle: "La Haute Gastronomie Française au Cœur du Terroir Vietnamien",
    desc: "Découvrez des compositions exclusives imaginées par le Chef Exécutif Joël, mêlant le prestige culinaire français aux trésors d'exception de la terre vietnamienne.",
    filterAllergensTitle: "Filtre Intelligent d'Allergènes",
    filterAllergensDesc: "Cochez vos restrictions ou allergènes. Le système identifiera automatiquement les plats concernés.",
    allergenWarning: "Contient l'allergène sélectionné",
    winePairingTitle: "Accords Mets & Vins recommandés",
    btnReserveSet: "Réserver ce Menu",
    bookingTitle: "Demande de Réservation Table",
    bookingSubtitle: "Une table d'exception vous attend pour un moment inoubliable",
    labelName: "Nom Complet",
    labelPhone: "Numéro de Téléphone",
    labelEmail: "Adresse E-mail",
    labelGuests: "Nombre de Couverts",
    labelDate: "Date du Repas",
    labelTime: "Heure d'Arrivée",
    labelNotes: "Demandes particulières (Salon privé, bougies, fleurs...)",
    labelSelectedMenu: "Menu Sélectionné",
    btnSubmit: "Envoyer la Demande",
    successTitle: "Demande Envoyée",
    successMsg: "Votre demande de réservation de Menu a bien été reçue. Notre hôtesse vous contactera sous peu.",
    errorTitle: "Erreur de Connexion",
    errorMsg: "Impossible d'envoyer votre demande. Veuillez réessayer ou composer le 0989 091 383.",
    courseTitle: "Détail du Menu",
    allergenLabel: "Allergènes à éviter",
    priceByServices: "Prix par nombre de services",
    winePairingPackage: "Accord Mets-Vins",
    vatDisclaimer: "* Service 5% & TVA 10% non inclus",
    veganNotice: "* Option végane disponible avec préavis 24h",
    perGuest: " / personne (Dine-in)",
    suggestedJourneys: "Parcours Suggérés",
    cellarSuggestions: "Suggestions de notre cave",
    chooseOne: "— au choix —",
    or: "ou",
    vatDisclaimerLong: "Tous les prix sont en VND. Service 5% et TVA 10% non inclus.",
    noteTable: "Menu servi pour l'ensemble de la table.",
    noteCookingTime: "Soufflé : 12 min de cuisson · Wellington de Buffle : 25 min — à commander dès le début du repas.",
    notesTitle: "Notes pour nos Convives",
    notesAllergiesTitle: "Allergies & Restrictions",
    notesAllergiesDesc: "Merci de signaler toute allergie ou restriction au moment de la réservation.",
    notesDietsTitle: "Régimes Spéciaux",
    notesDietsDesc: "Sans gluten, sans lactose, halal, casher : adaptations possibles avec préavis de 24 heures. Femmes enceintes : signalez-le au service.",
    notesOriginTitle: "Provenance des Produits",
    notesOriginDesc: "Saint-Jacques de Hokkaido · Cabillaud noir d'Alaska · Caviar Sturia (Aquitaine) · Beurre AOP d'Échiré · Bar et crevettes de Nha Trang · Vanille de Madagascar/Phú Quốc · Légumes & herbes de Đà Lạt · Buffle d'eau du Vietnam · Poivre noir de Phú Quốc.",
    bookingPrefix: "Inscription Set Menu : "
  },
  ja: {
    title: "セットメニュー",
    subtitle: "フランス古典料理 of classic French gastronomy meets native fine selection",
    desc: "エグゼクティブシェフのジョエルが細部にまでこだわり設計した特製セットメニュー。フランスの高度な美食技術と、ベトナムの希少で厳選された食材が調和する美食の旅をお楽しみください。",
    filterAllergensTitle: "スマート・アレルギー・フィルター",
    filterAllergensDesc: "避けるべきアレルゲンを選択してください。システムが該当するアレルゲンを含む料理を自動的に警告表示します。",
    allergenWarning: "選択したアレルゲンを含みます",
    winePairingTitle: "ソムリエ推奨ワインペアリング",
    btnReserveSet: "このセットメニューを予約する",
    bookingTitle: "セットメニューのご予約",
    bookingSubtitle: "極上の美食体験をご用意いたします",
    labelName: "お名前",
    labelPhone: "電話番号",
    labelEmail: "メールアドレス",
    labelGuests: "ご利用人数",
    labelDate: "ご来店日",
    labelTime: "ご来店時間",
    labelNotes: "ご要望（VIPルーム、装飾、アレルギー等）",
    labelSelectedMenu: "選択されたセットメニュー",
    btnSubmit: "予約リクエストを送信する",
    successTitle: "ご予約申請完了",
    successMsg: "セットメニューのご予約申請を受け付けました。スタッフより確認のご連絡を差し上げます。",
    errorTitle: "通信エラー",
    errorMsg: "リクエストの送信に失敗しました。もう一度お試しいただくか、お電話にてご連絡ください: 0989 091 383。",
    courseTitle: "メニュー詳細",
    allergenLabel: "避けるアレルゲン",
    priceByServices: "コース数に応じた料金",
    winePairingPackage: "ソムリエ・ワインペアリング",
    vatDisclaimer: "* 表示価格には5%のサービス料と10%のVATは含まれておりません。",
    veganNotice: "* 24時間前までの要予約でヴィーガン対応メニューをご用意できます。",
    perGuest: " / 名様 (店内飲食)",
    suggestedJourneys: "おすすめコース構成",
    cellarSuggestions: "当店のワインセラーからのご提案",
    chooseOne: "— 下記より1品お選びください —",
    or: "または",
    vatDisclaimerLong: "表示価格はすべてベトナムドン（VND）です。5%のサービス料と10%のVATは含まれておりません。",
    noteTable: "コースメニューはテーブル全員分でのご注文を承ります。",
    noteCookingTime: "スフレ：焼き上がりまで12分 ・ 水牛ウェリントン：焼き上がりまで25分 — お食事の最初にご注文ください。",
    notesTitle: "お客様へのご案内",
    notesAllergiesTitle: "アレルギーと食事制限",
    notesAllergiesDesc: "アレルギーや食事制限がございましたら、ご予約時にスタッフまでお申し付けください。",
    notesDietsTitle: "特別なお食事",
    notesDietsDesc: "グルテンフリー、ラクトースフリー、ハラール、コーシャ：24時間前までの要予約で対応可能です。ご妊娠中の方はスタッフにお知らせください。",
    notesOriginTitle: "食材の産地",
    notesOriginDesc: "北海道産ホタテ ・ アラスカ産ギンダラ ・ アキテーヌ産ストゥリア・キャビア ・ エシレAOPバター ・ ニャチャン産スズキ＆海老 ・ マダガスカル／フーコック産バニラ ・ ダラット産野菜＆ハーブ ・ ベトナム産水牛 ・ フーコック産黒胡椒",
    bookingPrefix: "セットメニュー予約："
  },
  ko: {
    title: "코스 메뉴",
    subtitle: "클래식 프랑스 요리 기법과 베트남 로컬 식재료의 조화",
    desc: "총주방장 조엘이 세심하게 설계한 스페셜 코스 메뉴. 프랑스 고품격 요리 기술과 베트남의 귀하고 신선한 식재료가 조화를 이루는 미식 여정을 발견해 보세요.",
    filterAllergensTitle: "스마트 알레르기 필터",
    filterAllergensDesc: "피해야 할 알레르기 유발 물질을 선택해 주세요. 해당 성분이 포함된 메뉴에 자동으로 경고 표시가 나타납니다.",
    allergenWarning: "선택한 알레르기 성분 포함",
    winePairingTitle: "소믈리에 와인 페어링 추천",
    btnReserveSet: "이 코스 메뉴 예약하기",
    bookingTitle: "코스 메뉴 예약",
    bookingSubtitle: "완벽한 미식 경험이 준비되어 있습니다",
    labelName: "성함",
    labelPhone: "전화번호",
    labelEmail: "이메일 주소",
    labelGuests: "방문 인원",
    labelDate: "예약 날짜",
    labelTime: "예약 시간",
    labelNotes: "특별 요청사항 (VIP룸, 꽃 장식, 알레르기 등)",
    labelSelectedMenu: "선택한 코스 메뉴",
    btnSubmit: "예약 신청하기",
    successTitle: "예약 접수 완료",
    successMsg: "코스 메뉴 예약 신청이 접수되었습니다. 리셉션에서 확인 후 곧 연락드리겠습니다.",
    errorTitle: "연결 오류",
    errorMsg: "신청 전송에 실패했습니다. 다시 시도하시거나 핫라인으로 연락해 주십시오: 0989 091 383.",
    courseTitle: "메뉴 상세 정보",
    allergenLabel: "주의해야 할 알레르기",
    priceByServices: "코스 수에 따른 가격",
    winePairingPackage: "소믈리에 와인 페어링",
    vatDisclaimer: "* 표시 가격에는 5% 서비스 요금 및 10% 부가가치세(VAT)가 포함되어 있지 않습니다.",
    veganNotice: "* 24시간 전 사전 요청 시 비건 코스로 준비 가능합니다.",
    perGuest: " / 인 (매장 식사)",
    suggestedJourneys: "추천 코스 구성",
    cellarSuggestions: "와인 셀러 추천 리스트",
    chooseOne: "— 다음 중 한 가지를 선택해 주세요 —",
    or: "또는",
    vatDisclaimerLong: "모든 가격은 베트남 동(VND) 기준이며, 5% 서비스 요금과 10% 부가가치세(VAT)는 불포함입니다.",
    noteTable: "코스 메뉴는 테이블 전원 주문 시에만 제공됩니다.",
    noteCookingTime: "수플레: 조리 시간 12분 · 버팔로 웰링턴: 조리 시간 25분 — 식사 시작 시 미리 주문해 주시기 바랍니다.",
    notesTitle: "고객 안내 사항",
    notesAllergiesTitle: "알레르기 및 식사 제한",
    notesAllergiesDesc: "알레르기나 특이 식습관이 있으신 경우 예약 시 미리 말씀해 주시기 바랍니다.",
    notesDietsTitle: "특별 식단",
    notesDietsDesc: "글루텐 프리, 락토오스 프리, 할랄, 코셔: 24시간 전 사전 요청 시 조율 가능합니다. 임산부 고객님께서는 서비스 직원에게 미리 말씀해 주십시오.",
    notesOriginTitle: "식재료 원산지",
    notesOriginDesc: "홋카이도 관자 · 알래스카 은대구 · 아키텐 스투리아 캐비아 · 에시레 AOP 버터 · 냐짱 농어 & 새우 · 마다가스카르/푸꾸옥 바닐라 · 달랏 채소 & 허브 · 베트남 수박 및 버팔로 · 푸꾸옥 흑후추",
    bookingPrefix: "코스 메뉴 예약: "
  },
  hk: {
    title: "宴會套餐",
    subtitle: "經典法式烹飪工藝與越南本土食材的精妙結合",
    desc: "由行政總廚 Joël 悉心設計的特色套餐，為您呈獻法國高級餐飲技術與越南珍稀食材和諧交融的非凡美饌之旅。",
    filterAllergensTitle: "智能過敏原篩選",
    filterAllergensDesc: "請選擇您需要避免的過敏原。系統會自動標記並警告包含該成分的菜品。",
    allergenWarning: "含有已選過敏原",
    winePairingTitle: "侍酒師推薦餐酒搭配",
    btnReserveSet: "預訂此套餐",
    bookingTitle: "預訂套餐美饌體驗",
    bookingSubtitle: "我們已為您準備好非凡的餐飲體驗",
    labelName: "姓名",
    labelPhone: "電話號碼",
    labelEmail: "電子郵件",
    labelGuests: "用餐人數",
    labelDate: "用餐日期",
    labelTime: "抵達時間",
    labelNotes: "特別要求（VIP包廂、花卉佈置、特定過敏等）",
    labelSelectedMenu: "已選套餐",
    btnSubmit: "提交訂座申請",
    successTitle: "訂座申請已提交",
    successMsg: "您的套餐預訂申請已收到，我們的服務人員會儘快與您聯繫確認。",
    errorTitle: "連接失敗",
    errorMsg: "提交申請時發生錯誤。請重試或撥打熱線：0989 091 383。",
    courseTitle: "套餐菜品詳情",
    allergenLabel: "避免過敏原",
    priceByServices: "按菜式數量收費",
    winePairingPackage: "侍酒師推薦配酒",
    vatDisclaimer: "* 價格未包含5%服務費及10%增值稅（VAT）",
    veganNotice: "* 提前24小時預約可提供純素食選項",
    perGuest: " / 位 (堂食)",
    suggestedJourneys: "推薦搭配方案",
    cellarSuggestions: "酒窖精選推薦",
    chooseOne: "— 請從以下菜品中任選其一 —",
    or: "或",
    vatDisclaimerLong: "所有價格均以越南盾（VND）計算。5%服務費及10%增值稅（VAT）另計。",
    noteTable: "套餐需全桌同點。",
    noteCookingTime: "梳乎厘：需時12分鐘烘焙 · 水牛威靈頓：需時25分鐘烘焙 — 請於用餐開始時下單。",
    notesTitle: "賓客須知",
    notesAllergiesTitle: "過敏及飲食限制",
    notesAllergiesDesc: "如有任何食物過敏或飲食限制，請於訂座時告知我們。",
    notesDietsTitle: "特別膳食",
    notesDietsDesc: "無麩質、無乳糖、清真、猶太潔食：提前24小時通知可作調整。孕婦顧客請告知服務人員。",
    notesOriginTitle: "食材原產地",
    notesOriginDesc: "北海道帆立貝 · 阿拉斯加黑鱈魚 · 阿基坦 Sturia 魚子醬 · Échiré AOP 牛油 · 芽莊海鱸魚及海蝦 · 馬達加斯加/富國島雲霓拿 · 大叻時令蔬菜及香草 · 越南本土水牛肉 · 富國島黑胡椒",
    bookingPrefix: "預訂套餐："
  }
};

const ALLERGEN_CODES = [
  { code: "GLUTEN", name: "Gluten", nameVi: "Gluten", nameFr: "Gluten", nameJa: "グルテン", nameKo: "글루텐", nameHk: "麩質" },
  { code: "MILK", name: "Lactose / Dairy", nameVi: "Sữa & Bơ", nameFr: "Produits laitiers", nameJa: "乳製品 / ラクトース", nameKo: "유제품 / 유당", nameHk: "乳糖 / 乳製品" },
  { code: "EGGS", name: "Eggs", nameVi: "Trứng", nameFr: "Œufs", nameJa: "卵", nameKo: "계란", nameHk: "雞蛋" },
  { code: "FISH", name: "Fish", nameVi: "Cá", nameFr: "Poisson", nameJa: "魚", nameKo: "생선", nameHk: "魚類" },
  { code: "CRUSTACEANS", name: "Shellfish / Crustaceans", nameVi: "Giáp xác (Tôm/Cua)", nameFr: "Crustacés", nameJa: "甲殻類（エビ・カニ）", nameKo: "갑각류 (새우/게)", nameHk: "甲殼類 (蝦/蟹)" },
  { code: "MOLLUSCS", name: "Molluscs", nameVi: "Thân mềm (Sò, Ốc)", nameFr: "Mollusques", nameJa: "軟体動物（貝・タコ・イカ）", nameKo: "연체동물 (조개/낙지)", nameHk: "軟體動物 (貝類/軟體)" },
  { code: "NUTS", name: "Nuts", nameVi: "Hạt cứng", nameFr: "Fruits à coque", nameJa: "ナッツ類", nameKo: "견과류", nameHk: "堅果" },
  { code: "PEANUTS", name: "Peanuts", nameVi: "Đậu phộng", nameFr: "Arachides", nameJa: "落花生（ピーナッツ）", nameKo: "땅콩", nameHk: "花生" },
  { code: "SOYA", name: "Soybeans", nameVi: "Đậu nành", nameFr: "Soja", nameJa: "大豆", nameKo: "대두", nameHk: "大豆" },
  { code: "SULPHITES", name: "Sulphites (Wine)", nameVi: "Sulphites", nameFr: "Sulfites", nameJa: "亜硫酸塩（ワイン等）", nameKo: "아황산염 (와인)", nameHk: "亞硫酸鹽 (葡萄酒)" },
];

const DISHES = {
  carpaccio_thon: {
    name: {
      fr: "Carpaccio de Thon de Nha Trang — Yuzu, Kumquat, Sel marin de Bà Rịa",
      vi: "Carpaccio cá ngừ Nha Trang — yuzu, tắc, muối biển Bà Rịa",
      en: "Nha Trang tuna carpaccio — yuzu, kumquat, Bà Rịa sea salt"
    },
    allergens: ["FISH", "SULPHITES"],
    note: {
      vi: "Có chứa nguyên liệu thô",
      en: "Contains raw ingredients",
      fr: "Contient des ingrédients crus",
      ja: "生食材を含みます",
      ko: "날것 또는 익히지 않은 식재료 포함",
      hk: "含有生食原材料"
    },
    wine: "Pascal Jolivet « Attitude » Sauvignon Blanc · Loire"
  },
  tartare_saint_jacques: {
    name: {
      fr: "Tartare de Saint-Jacques au Caviar d'Aquitaine",
      vi: "Tartare sò điệp Hokkaido — caviar Aquitaine",
      en: "Hokkaido scallop tartare — French Aquitaine caviar"
    },
    allergens: ["MOLLUSCS", "FISH", "MILK", "SULPHITES"],
    note: {
      vi: "Có chứa nguyên liệu thô",
      en: "Contains raw ingredients",
      fr: "Contient des ingrédients crus",
      ja: "生食材を含みます",
      ko: "날것 또는 익히지 않은 식재료 포함",
      hk: "含有生食原材料"
    },
    wine: "Champagne Taittinger Brut Réserve · Champagne"
  },
  expression_vegetale: {
    name: {
      fr: "Expression Végétale de Đà Lạt — Avocat Hass, Émulsion d'Herbes",
      vi: "Rau củ Đà Lạt theo mùa — bơ Hass — nhũ tương thảo mộc",
      en: "Đà Lạt seasonal vegetables — Hass avocado — herb emulsion"
    },
    allergens: ["MILK"],
    note: {
      vi: "Món chay · Có thể chuẩn bị thuần chay · Có thể chuẩn bị không gluten",
      en: "Vegetarian · Vegan available · Gluten-free available",
      fr: "Végétarien · Option végane disponible · Option sans gluten disponible",
      ja: "ベジタリアン · ヴィーガン対応可 · グルテンフリー対応可",
      ko: "채식 · 비건 요청 가능 · 글루텐 프리 요청 가능",
      hk: "素食 · 可提供純素食 · 可提供無麩質選項"
    },
    wine: "M. Chapoutier « Belleruche » Côtes du Rhône Blanc · Rhône"
  },
  bisque_crevettes: {
    name: {
      fr: "Bisque de Crevettes de Nha Trang — Crème légère au Cognac",
      vi: "Súp bisque tôm Nha Trang — kem Cognac nhẹ",
      en: "Nha Trang shrimp bisque — light Cognac cream"
    },
    allergens: ["CRUSTACEANS", "MILK", "SULPHITES"],
    wine: "Concha y Toro « Marqués de Casa Concha » Chardonnay · Limarí"
  },
  veloute_champignons: {
    name: {
      fr: "Velouté de Champignons de Tam Đảo — Infusion de sous-bois",
      vi: "Súp nấm rừng Tam Đảo — hương rừng tinh tế",
      en: "Tam Đảo wild mushroom velouté — forest aromas"
    },
    allergens: ["MILK"],
    note: {
      vi: "Món chay · Có thể chuẩn bị không gluten",
      en: "Vegetarian · Gluten-free available",
      fr: "Végétarien · Option sans gluten disponible",
      ja: "ベジタリアン · グルテンフリー対応可",
      ko: "채식 · 글루텐 프리 요청 가능",
      hk: "素食 · 可提供無麩質選項"
    },
    wine: "Louis Latour Bourgogne Pinot Noir · Bourgogne"
  },
  cabillaud_miso: {
    name: {
      fr: "Cabillaud Noir Mariné au Miso — Beurre noisette, Légumes verts",
      vi: "Cá tuyết đen ướp miso — bơ nâu — rau xanh theo mùa",
      en: "Miso-marinated black cod — brown butter — seasonal greens"
    },
    allergens: ["FISH", "SOYA", "MILK", "SULPHITES"],
    wine: "Louis Latour Pouilly-Fuissé · Mâconnais"
  },
  bar_poele: {
    name: {
      fr: "Bar du Vietnam Poêlé — Beurre blanc, Note d'agrumes",
      vi: "Cá vược Việt Nam áp chảo — beurre blanc — điểm chua thanh",
      en: "Pan-seared Vietnamese seabass — beurre blanc — citrus note"
    },
    allergens: ["FISH", "MILK", "SULPHITES"],
    wine: "Pascal Jolivet « Attitude » Sauvignon Blanc · Loire"
  },
  langoustine_rotie: {
    name: {
      fr: "Langoustine Rôtie — Beurre noisette, Cuisson précise",
      vi: "Tôm hùm baby áp chảo — bơ nâu — kiểm soát nhiệt chính xác",
      en: "Roasted langoustine — brown butter — precise cuisson"
    },
    allergens: ["CRUSTACEANS", "MILK", "SULPHITES"],
    supplement_key: "supp_premium",
    wine: "Champagne Taittinger Brut Réserve · Champagne"
  },
  sorbet_fruits: {
    name: {
      fr: "Sorbet de Fruits Vietnamiens de Saison — Herbes fraîches",
      vi: "Sorbet trái cây Việt Nam theo mùa — thảo mộc tươi",
      en: "Seasonal Vietnamese fruit sorbet — fresh herbs"
    },
    allergens: [],
    note: {
      vi: "Thuần chay · Không chứa gluten",
      en: "Vegan · Gluten-free",
      fr: "Végane · Sans gluten",
      ja: "ヴィーガン · グルテンフリー",
      ko: "비건 · 글루텐 프리",
      hk: "純素食 · 無麩質"
    },
    wine: "Pierre Larousse Sparkling Brut · Vin de France"
  },
  magret_canard: {
    name: {
      fr: "Magret de Canard du Vietnam — Compote de Prunes de Sapa, Jus au Madère",
      vi: "Lườn vịt Việt Nam — mứt mận Sapa — sốt Madère",
      en: "Vietnamese duck breast — Sapa plum compote — Madeira jus"
    },
    allergens: ["SULPHITES"],
    note: {
      vi: "Có thể chuẩn bị không gluten",
      en: "Gluten-free available",
      fr: "Option sans gluten disponible",
      ja: "グルテンフリー対応可",
      ko: "글루텐 프리 요청 가능",
      hk: "可提供無麩質選項"
    },
    wine: "Louis Latour Bourgogne Pinot Noir · Bourgogne"
  },
  carre_agneau: {
    name: {
      fr: "Carré d'Agneau aux Herbes Vietnamiennes — Lentilles du Puy, Céleri-rave",
      vi: "Sườn cừu nướng vỏ thảo mộc Việt — đậu Le Puy — củ cần tây",
      en: "Herb-crusted lamb rack — Le Puy lentils — celeriac"
    },
    allergens: ["MILK", "SULPHITES"],
    note: {
      vi: "Có thể chuẩn bị không gluten",
      en: "Gluten-free available",
      fr: "Option sans gluten disponible",
      ja: "グルテンフリー対応可",
      ko: "글루텐 프리 요청 가능",
      hk: "可提供無麩質選項"
    },
    supplement_key: "supp_agneau",
    wine: "M. Chapoutier « Les Meysonniers » Crozes-Hermitage · Rhône"
  },
  wellington_buffle: {
    name: {
      fr: "Wellington de Buffle du Vietnam — Duxelles, Jus au poivre Phú Quốc",
      vi: "Wellington thịt trâu Việt Nam — sốt tiêu Phú Quốc",
      en: "Vietnamese buffalo Wellington — mushroom duxelles — Phú Quốc pepper jus"
    },
    allergens: ["GLUTEN", "MILK", "EGGS", "SULPHITES"],
    wine: "Château Haut-Rocher Saint-Émilion Grand Cru · Bordeaux"
  },
  boeuf_wagyu: {
    name: {
      fr: "Bœuf Wagyu MBS 6–7 — Topinambour, Betterave Chioggia",
      vi: "Bò Wagyu MBS 6–7 — atisô Jerusalem — củ dền Chioggia",
      en: "Wagyu beef MBS 6–7 — Jerusalem artichoke — Chioggia beetroot"
    },
    allergens: ["MILK", "SULPHITES"],
    note: {
      vi: "Có thể chuẩn bị không gluten",
      en: "Gluten-free available",
      fr: "Option sans gluten disponible",
      ja: "グルテンフリー対応可",
      ko: "글루텐 프리 요청 가능",
      hk: "可提供無麩質選項"
    },
    supplement_key: "supp_wagyu",
    wine: "Mouton Cadet Réserve Pauillac · Pauillac"
  },
  fromages_affinés: {
    name: {
      fr: "Sélection de Fromages Français Affinés — Trois choix du jour",
      vi: "Tuyển chọn phô mai Pháp ủ chín — ba loại trong ngày",
      en: "Selection of mature French cheeses — three of the day"
    },
    allergens: ["MILK", "SULPHITES"],
    note: {
      vi: "Có thể chứa: hạt cứng (trang trí)",
      en: "May contain: tree nuts (garnish)",
      fr: "Peut contenir : fruits à coque (garniture)",
      ja: "一部にナッツ類を含む場合があります（トッピング）",
      ko: "견과류가 포함될 수 있음 (고명)",
      hk: "可能含有堅果（裝飾）"
    },
    wine: "Mouton Cadet Sauternes · Sauternes"
  },
  souffle_chaud: {
    name: {
      fr: "Soufflé Chaud du Moment — Glace Vanille de Phú Quốc",
      vi: "Soufflé nóng theo mùa — kem vani Phú Quốc",
      en: "Warm seasonal soufflé — Phú Quốc vanilla ice cream"
    },
    allergens: ["GLUTEN", "MILK", "EGGS"],
    wine: "Mouton Cadet Sauternes 37,5 cl · Sauternes"
  },
  chocolat_vietnam: {
    name: {
      fr: "Chocolat du Vietnam — Contraste d'Agrumes",
      vi: "Sô-cô-la Việt Nam — đối vị cam chanh",
      en: "Vietnamese chocolate — citrus contrast"
    },
    allergens: ["MILK", "EGGS"],
    note: {
      vi: "Có thể chứa: hạt cứng, đậu nành (sô-cô-la)",
      en: "May contain: tree nuts, soy (chocolate)",
      fr: "Peut contenir : fruits à coque, soja (chocolat)",
      ja: "一部にナッツ類・大豆を含む場合があります（チョコレート部分）",
      ko: "견과류 및 대두가 포함될 수 있음 (초콜릿)",
      hk: "可能含有堅果及大豆（朱古力）"
    },
    wine: "Talò Primitivo di Manduria « San Marzano » · Puglia"
  },
  creme_brulee: {
    name: {
      fr: "Crème Brûlée à la Vanille de Phú Quốc — Caramel croustillant",
      vi: "Crème brûlée vani Phú Quốc — lớp caramel giòn",
      en: "Phú Quốc vanilla crème brûlée — crisp caramel"
    },
    allergens: ["MILK", "EGGS"],
    wine: "Mouton Cadet Sauternes · Sauternes"
  },
  risotto_truffe: {
    name: {
      fr: "Risotto à la Truffe et Champignons de Tam Đảo — Beurre Échiré, Parmesan affiné 24 mois",
      vi: "Risotto nấm cục và nấm rừng Tam Đảo — bơ Échiré — parmesan ủ 24 tháng",
      en: "Truffle risotto with Tam Đảo wild mushrooms — Échiré butter — 24-month Parmesan"
    },
    allergens: ["MILK", "SULPHITES"],
    note: {
      vi: "Món chay · Có thể chuẩn bị không gluten",
      en: "Vegetarian · Gluten-free available",
      fr: "Végétarien · Option sans gluten disponible",
      ja: "ベジタリアン · グルテンフリー対応可",
      ko: "채식 · 글루텐 프리 요청 가능",
      hk: "素食 · 可提供無麩質選項"
    },
    wine: "Louis Latour Bourgogne Pinot Noir · Bourgogne"
  }
};

const SET_MENUS = [
  {
    id: "degustation",
    title: {
      vi: "Menu Dégustation",
      en: "Menu Dégustation",
      fr: "Menu Dégustation",
      ja: "デギュスタシオン・メニュー",
      ko: "테이스팅 코스 (Dégustation)",
      hk: "品味嘗鮮套餐 (Dégustation)"
    },
    subtitle: {
      vi: "Tự chọn từ 3 đến 7 món",
      en: "3 to 7 courses of your choice",
      fr: "3 à 7 services au choix",
      ja: "3品から7品まで選べるカスタムコース",
      ko: "3가지에서 7가지 요리 선택 가능",
      hk: "自選 3 至 7 道菜品"
    },
    desc: {
      vi: "Hãy tự thiết kế hành trình ẩm thực của Quý khách từ 3 đến 7 món.",
      en: "Compose your gastronomic journey from 3 to 7 services.",
      fr: "Composez votre voyage gastronomique de 3 à 7 services.",
      ja: "お客様のお好みに合わせて、3品から7品の美食の旅を自由に組み立てられます。",
      ko: "고객님의 취향에 맞춰 3가지에서 7가지 요리로 나만의 미식 코스를 구성해 보세요.",
      hk: "根據您的喜好，自由組合 3 至 7 道菜品的專屬美饌體驗。"
    },
    price_info: {
      vi: "Từ 2.400.000 đ",
      en: "From 2,400,000 VND",
      fr: "À partir de 2 400 000 VND",
      ja: "2,400,000 VND から",
      ko: "2,400,000 VND 부터",
      hk: "2,400,000 VND 起"
    },
    color: "from-amber-900/30 border-amber-500/20",
    is_choice_based: true,
    courses: [
      {
        number: "I",
        type: {
          vi: "Entrée Froide (Khai vị Lạnh)",
          en: "Cold Starter",
          fr: "Entrée Froide",
          ja: "コールドスターター（冷前菜）",
          ko: "콜드 스타터 (차가운 전채요리)",
          hk: "精緻冷前菜"
        },
        has_options: true,
        options: [
          { option_title: { vi: "Lựa chọn Biển", en: "Ocean Option", fr: "Option Mer", ja: "海の恵み", ko: "시푸드 선택", hk: "海鮮選擇" }, ...DISHES.carpaccio_thon },
          { option_title: { vi: "Lựa chọn Biển Premium", en: "Premium Ocean Option", fr: "Option Mer Premium", ja: "極上の海の恵み", ko: "프리미엄 시푸드 선택", hk: "特級海鮮選擇" }, ...DISHES.tartare_saint_jacques },
          { option_title: { vi: "Lựa chọn Thực vật", en: "Vegetable Option", fr: "Option Végétale", ja: "大地の恵み（野菜）", ko: "베지터블 선택", hk: "蔬食選擇" }, ...DISHES.expression_vegetale }
        ]
      },
      {
        number: "II",
        type: {
          vi: "Soupe / Entrée Chaude (Súp / Khai vị Nóng)",
          en: "Soup / Hot Starter",
          fr: "Soupe / Entrée Chaude",
          ja: "スープ / ホットスターター（温前菜）",
          ko: "스프 / 핫 스타터 (따뜻한 전채요리)",
          hk: "湯品 / 精緻熱前菜"
        },
        has_options: true,
        options: [
          { option_title: { vi: "Lựa chọn Biển", en: "Ocean Option", fr: "Option Mer", ja: "海の恵み", ko: "시푸드 선택", hk: "海鮮選擇" }, ...DISHES.bisque_crevettes },
          { option_title: { vi: "Lựa chọn Thực vật", en: "Vegetable Option", fr: "Option Végétale", ja: "大地の恵み（野菜）", ko: "베지터블 선택", hk: "蔬食選擇" }, ...DISHES.veloute_champignons }
        ]
      },
      {
        number: "III",
        type: {
          vi: "Poisson (Cá)",
          en: "Fish",
          fr: "Poisson",
          ja: "シーフード（魚料理）",
          ko: "생선 요리",
          hk: "精選海鮮 (魚類)"
        },
        has_options: true,
        options: [
          { option_title: { vi: "Lựa chọn Ký thác", en: "Signature Option", fr: "Option Signature", ja: "シグネチャー", ko: "시그니처 선택", hk: "招牌選擇" }, ...DISHES.cabillaud_miso },
          { option_title: { vi: "Lựa chọn Cổ điển", en: "Classic Option", fr: "Option Classique", ja: "クラシック", ko: "클래식 선택", hk: "經典選擇" }, ...DISHES.bar_poele },
          { option_title: { vi: "Lựa chọn Thượng hạng", en: "Premium Option", fr: "Option Premium", ja: "プレミアム", ko: "프리미엄 선택", hk: "特級選擇" }, ...DISHES.langoustine_rotie }
        ]
      },
      {
        number: "IV",
        type: {
          vi: "Intermezzo (Chuyển vị)",
          en: "Intermezzo",
          fr: "Intermezzo",
          ja: "お口直し（ソルベ）",
          ko: "입가심 (셔벗)",
          hk: "過渡小點 (雪葩)"
        },
        has_options: false,
        ...DISHES.sorbet_fruits
      },
      {
        number: "V",
        type: {
          vi: "Viande (Thịt)",
          en: "Meat",
          fr: "Viande",
          ja: "メイン（肉料理）",
          ko: "육류 요리 (메인)",
          hk: "精選肉類 (主菜)"
        },
        has_options: true,
        options: [
          { option_title: { vi: "Lựa chọn Gia cầm", en: "Poultry Option", fr: "Option Volaille", ja: "家禽（鴨）", ko: "가금류 선택", hk: "禽類選擇" }, ...DISHES.magret_canard },
          { option_title: { vi: "Lựa chọn Thịt cừu", en: "Lamb Option", fr: "Option Agneau", ja: "ラム肉（羊）", ko: "양고기 선택", hk: "羊肉選擇" }, ...DISHES.carre_agneau },
          { option_title: { vi: "Lựa chọn Ký thác", en: "Signature Option", fr: "Option Signature", ja: "シグネチャー", ko: "시그니처 선택", hk: "招牌選擇" }, ...DISHES.wellington_buffle },
          { option_title: { vi: "Lựa chọn Wagyu", en: "Wagyu Option", fr: "Option Wagyu", ja: "和牛（Wagyu）", ko: "와규 선택", hk: "和牛選擇" }, ...DISHES.boeuf_wagyu }
        ]
      },
      {
        number: "VI",
        type: {
          vi: "Fromages (Phô Mai)",
          en: "Cheeses",
          fr: "Fromages",
          ja: "熟成チーズセレクション",
          ko: "치즈 플레이트",
          hk: "精選熟成芝士"
        },
        has_options: false,
        ...DISHES.fromages_affinés
      },
      {
        number: "VII",
        type: {
          vi: "Dessert (Tráng Miệng)",
          en: "Dessert",
          fr: "Dessert",
          ja: "デザート（甘味）",
          ko: "디저트",
          hk: "精美甜點"
        },
        has_options: true,
        options: [
          { option_title: { vi: "Lựa chọn Soufflé", en: "Soufflé Option", fr: "Option Soufflé", ja: "スフレ", ko: "수플레 선택", hk: "梳乎厘選擇" }, ...DISHES.souffle_chaud },
          { option_title: { vi: "Lựa chọn Sô-cô-la", en: "Chocolate Option", fr: "Option Chocolat", ja: "チョコレート", ko: "초콜릿 선택", hk: "朱古力選擇" }, ...DISHES.chocolat_vietnam },
          { option_title: { vi: "Lựa chọn Vani", en: "Vanilla Option", fr: "Option Vanille", ja: "ヴァニラ", ko: "바닐라 선택", hk: "雲霓拿選擇" }, ...DISHES.creme_brulee }
        ]
      }
    ]
  },
  {
    id: "signature",
    title: {
      vi: "Menu Signature du Chef",
      en: "Chef's Signature Menu",
      fr: "Menu Signature du Chef",
      ja: "シェフ・シグネチャー・メニュー",
      ko: "셰프 시그니처 코스",
      hk: "主廚招牌套餐"
    },
    subtitle: {
      vi: "Hành trình Ký thác · 5 món",
      en: "The Chef's Journey · 5 Courses",
      fr: "Le voyage du chef · 5 services",
      ja: "シェフの特別ジャーニー・5品",
      ko: "셰프의 특별한 여정 · 5코스",
      hk: "主廚專屬美饌之旅 · 5道菜"
    },
    desc: {
      vi: "Hành trình ẩm thực đặc sắc được thiết kế bởi Bếp trưởng — không cần chọn món, không phụ thu.",
      en: "The chef's journey — no choices, no supplements.",
      fr: "Le voyage du chef — sans choix, sans suppléments.",
      ja: "総料理長が選び抜いた至高のフルコース。料理の選択や追加料金なしで、完成された調和をご堪能いただけます。",
      ko: "총주방장이 엄선한 최고의 고정 코스. 요리 선택이나 추가 요금 없이 완벽한 조화를 선사합니다.",
      hk: "由行政總廚傾力打造的完整套餐——無需選擇，無額外附加費，呈獻最完美的味道搭配。"
    },
    price_info: {
      vi: "4.200.000 đ",
      en: "4,200,000 VND",
      fr: "4 200 000 VND",
      ja: "4,200,000 VND",
      ko: "4,200,000 VND",
      hk: "4,200,000 VND"
    },
    color: "from-gold-900/30 border-gold-500/30",
    is_choice_based: false,
    courses: [
      {
        number: "I",
        type: {
          vi: "Entrée Froide (Khai vị Lạnh)",
          en: "Cold Starter",
          fr: "Entrée Froide",
          ja: "コールドスターター（冷前菜）",
          ko: "콜드 스타터 (차가운 전채요리)",
          hk: "精緻冷前菜"
        },
        has_options: false,
        ...DISHES.carpaccio_thon
      },
      {
        number: "II",
        type: {
          vi: "Soupe (Súp)",
          en: "Soup",
          fr: "Soupe",
          ja: "本日のスープ",
          ko: "스프",
          hk: "精選湯品"
        },
        has_options: false,
        ...DISHES.veloute_champignons
      },
      {
        number: "III",
        type: {
          vi: "Poisson Signature (Cá Signature)",
          en: "Signature Fish",
          fr: "Poisson Signature",
          ja: "シェフ特製魚料理",
          ko: "셰프 시그니처 생선 요리",
          hk: "招牌海鮮 (魚類)"
        },
        has_options: false,
        ...DISHES.cabillaud_miso
      },
      {
        number: "IV",
        type: {
          vi: "Viande Signature (Thịt Signature)",
          en: "Signature Meat",
          fr: "Viande Signature",
          ja: "シェフ特製肉料理",
          ko: "셰프 시그니처 육류 요리",
          hk: "招牌肉類 (主菜)"
        },
        has_options: false,
        ...DISHES.wellington_buffle
      },
      {
        number: "V",
        type: {
          vi: "Dessert (Tráng Miệng)",
          en: "Dessert",
          fr: "Dessert",
          ja: "デザート（甘味）",
          ko: "디저트",
          hk: "精美甜點"
        },
        has_options: false,
        ...DISHES.chocolat_vietnam
      }
    ]
  },
  {
    id: "vegetarian",
    title: {
      vi: "Menu Végétarien",
      en: "Vegetarian Menu",
      fr: "Menu Végétarien",
      ja: "ベジタリアン・メニュー",
      ko: "채식 코스 (Vegetarian)",
      hk: "素食套餐"
    },
    subtitle: {
      vi: "Thực đơn chay 2 đến 4 món",
      en: "Vegetarian menu of 2 to 4 courses",
      fr: "Menu végétarien de 2 à 4 services",
      ja: "2品から4品の選べるベジタリアンコース",
      ko: "2가지에서 4가지 요리 선택 채식 코스",
      hk: "自選 2 至 4 道精緻素食"
    },
    desc: {
      vi: "Tôn vinh nông sản Đà Lạt — Tự chọn 2 đến 4 món chay.",
      en: "Tribute to Đà Lạt — Choose 2 to 4 vegetarian courses.",
      fr: "Hommage aux maraîchers de Đà Lạt — 2 à 4 services au choix.",
      ja: "ダラットの豊かな大自然の恵みに敬意を表して。2品から4品の美味しいベジタリアンディッシュをお選びいただけます。",
      ko: "달랏의 청정 대자연이 키워낸 농산물에 보내는 헌사. 2가지에서 4가지의 채식 요리를 직접 선택하실 수 있습니다.",
      hk: "致敬大叻優質農產之作——可自選 2 至 4 道精緻素食品味體驗。"
    },
    price_info: {
      vi: "Từ 1.600.000 đ",
      en: "From 1,600,000 VND",
      fr: "À partir de 1 600 000 VND",
      ja: "1,600,000 VND から",
      ko: "1,600,000 VND 부터",
      hk: "1,600,000 VND 起"
    },
    color: "from-rose-950/30 border-rose-500/25",
    is_choice_based: false,
    courses: [
      {
        number: "I",
        type: {
          vi: "Entrée Froide (Khai vị Lạnh)",
          en: "Cold Starter",
          fr: "Entrée Froide",
          ja: "コールドスターター（冷前菜）",
          ko: "콜드 스타터 (차가운 전채요리)",
          hk: "精緻冷前菜"
        },
        has_options: false,
        ...DISHES.expression_vegetale
      },
      {
        number: "II",
        type: {
          vi: "Soupe (Súp)",
          en: "Soup",
          fr: "Soupe",
          ja: "本日のスープ",
          ko: "스프",
          hk: "精選湯品"
        },
        has_options: false,
        ...DISHES.veloute_champignons
      },
      {
        number: "III",
        type: {
          vi: "Plat Signature (Món Chính Signature)",
          en: "Signature Main",
          fr: "Plat Signature",
          ja: "シグネチャーメインディッシュ",
          ko: "시그니처 메인 요리",
          hk: "招牌主菜"
        },
        has_options: false,
        ...DISHES.risotto_truffe
      },
      {
        number: "IV",
        type: {
          vi: "Dessert (Tráng Miệng)",
          en: "Dessert",
          fr: "Dessert",
          ja: "デザート（甘味）",
          ko: "디저트",
          hk: "精美甜點"
        },
        has_options: false,
        ...DISHES.souffle_chaud
      }
    ]
  }
];

const DEFAULT_PRICES = {
  degustation: {
    services_3: 2400000,
    services_4: 3000000,
    services_5: 3600000,
    services_6: 4200000,
    services_7: 4800000,
    pairing_3_4: 1400000,
    pairing_5: 2200000,
    pairing_6_7: 3000000,
    supp_premium: 250000,
    supp_agneau: 200000,
    supp_wagyu: 650000
  },
  signature: {
    price: 4200000
  },
  vegetarian: {
    services_2: 1600000,
    services_3: 2200000,
    services_4: 2800000
  }
};

function SetMenuContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const lang = searchParams.get("lang") || "vi";
  const t = I18N[lang] || I18N.vi;

  const [selectedAllergens, setSelectedAllergens] = useState([]);
  const [dbWines, setDbWines] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState("degustation");
  const [prices, setPrices] = useState(DEFAULT_PRICES);
  
  // Booking Form State
  const [bookingForm, setBookingForm] = useState({
    name: "",
    phone: "",
    countryCode: "+84",
    email: "",
    guests: 2,
    date: "",
    time: "19:00",
    notes: ""
  });
  const [submitStatus, setSubmitStatus] = useState("idle"); // idle, loading, success, error

  // Fetch prices dynamically from database (Supabase)
  useEffect(() => {
    async function fetchPrices() {
      try {
        const { data, error } = await supabase
          .from("menu_items")
          .select("*")
          .eq("category", "Set Menu Price");

        if (!error && data && data.length > 0) {
          const newPrices = JSON.parse(JSON.stringify(DEFAULT_PRICES));
          data.forEach(item => {
            const key = item.name?.en || item.name;
            if (key.startsWith("degustation_")) {
              const subKey = key.replace("degustation_", "");
              newPrices.degustation[subKey] = Number(item.price_dine_in);
            } else if (key === "signature_price") {
              newPrices.signature.price = Number(item.price_dine_in);
            } else if (key.startsWith("vegetarian_")) {
              const subKey = key.replace("vegetarian_", "");
              newPrices.vegetarian[subKey] = Number(item.price_dine_in);
            }
          });
          setPrices(newPrices);
        }
      } catch (err) {
        console.warn("Failed to fetch set menu prices from database, using defaults:", err);
      }
    }
    fetchPrices();
  }, []);

  // Fetch wines for dynamic recommendations
  useEffect(() => {
    async function fetchWines() {
      try {
        const { data, error } = await supabase
          .from("wines")
          .select("*")
          .eq("available", true)
          .limit(5);
        if (!error && data) {
          setDbWines(data);
        }
      } catch (err) {
        console.error("Error loading wines:", err);
      }
    }
    fetchWines();
  }, []);

  // Sync default booking form notes with selected menu & language
  useEffect(() => {
    const isDefault = !bookingForm.notes || [
      "Đăng ký Set Menu:",
      "Set Menu Reservation:",
      "Inscription Set Menu :",
      "セットメニュー予約：",
      "코스 메뉴 예약:",
      "預訂套餐："
    ].some(pref => bookingForm.notes.startsWith(pref));

    if (isDefault) {
      const chosenMenuObj = SET_MENUS.find(m => m.id === selectedMenu);
      const chosenMenuTitle = chosenMenuObj ? (chosenMenuObj.title[lang] || chosenMenuObj.title.vi) : "";
      const prefix = t.bookingPrefix || "Đăng ký Set Menu: ";
      setBookingForm(prev => ({
        ...prev,
        notes: `${prefix}${chosenMenuTitle}`
      }));
    }
  }, [selectedMenu, lang, t.bookingPrefix]);

  const handleAllergenToggle = (code) => {
    setSelectedAllergens((prev) =>
      prev.includes(code) ? prev.filter((item) => item !== code) : [...prev, code]
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingForm((prev) => ({ ...prev, [name]: value }));
  };

  const normalizePhone = (code, phone) => {
    let cleaned = phone.replace(/\D/g, "");
    if (cleaned.startsWith("0")) {
      cleaned = cleaned.substring(1);
    }
    return code + cleaned;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus("loading");
    try {
      const fullPhone = normalizePhone(bookingForm.countryCode, bookingForm.phone);

      // 1. Insert or get Customer
      const { data: customerData } = await supabase
        .from("customers")
        .select("id")
        .eq("phone", fullPhone)
        .maybeSingle();

      let customerId = customerData?.id;

      if (!customerId) {
        const { data: newCust, error: custErr } = await supabase
          .from("customers")
          .insert({
            full_name: bookingForm.name,
            phone: fullPhone,
            email: bookingForm.email || null,
            vip_level: 1,
            consent_at: new Date().toISOString()
          })
          .select("id")
          .single();

        if (custErr) throw custErr;
        customerId = newCust?.id;
      }

      // 2. Insert reservation
      const chosenMenuObj = SET_MENUS.find(m => m.id === selectedMenu);
      const chosenMenuTitle = chosenMenuObj ? (chosenMenuObj.title[lang] || chosenMenuObj.title.vi) : selectedMenu;
      
      const { error: resErr } = await supabase
        .from("reservations")
        .insert({
          customer_id: customerId,
          guest_name: bookingForm.name,
          guest_phone: fullPhone,
          guest_email: bookingForm.email || null,
          guest_count: parseInt(bookingForm.guests),
          booking_date: bookingForm.date,
          booking_time: bookingForm.time + ":00",
          notes: `[SET MENU: ${chosenMenuTitle}] ${bookingForm.notes}`,
          language: lang,
          status: "pending"
        });

      if (resErr) throw resErr;

      // 3. Send email confirmation if email provided
      if (bookingForm.email) {
        try {
          await fetch("/api/send-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              to: bookingForm.email,
              subject: lang === "vi" ? `Maison Vie - Xác nhận yêu cầu đặt Set Menu ${chosenMenuTitle}` : `Maison Vie - Set Menu Booking Request: ${chosenMenuTitle}`,
              type: "booking_pending",
              lang: lang,
              data: {
                guestName: bookingForm.name,
                guestPhone: fullPhone,
                guestCount: bookingForm.guests,
                bookingDate: bookingForm.date,
                bookingTime: bookingForm.time,
                notes: `Set Menu: ${chosenMenuTitle}. ${bookingForm.notes}`
              }
            })
          });
        } catch (mailErr) {
          console.error("Email sending failed:", mailErr);
        }
      }

      setSubmitStatus("success");
      setBookingForm({
        name: "",
        phone: "",
        countryCode: "+84",
        email: "",
        guests: 2,
        date: "",
        time: "19:00",
        notes: ""
      });
    } catch (err) {
      console.error("Booking Error:", err);
      setSubmitStatus("error");
    }
  };

  const checkCourseAllergen = (courseAllergens) => {
    return courseAllergens.some((all) => selectedAllergens.includes(all));
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" })
      .format(val)
      .replace("₫", "đ");
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
            Les Menus Spéciaux · Maison Vie 2026
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

      {/* ALLERGEN FILTER PANEL */}
      <section className="py-12 bg-dark-500 border-b border-white/5">
        <div className="max-w-5xl mx-auto px-6">
          <div className="glassmorphism p-6 md:p-8 border border-white/5 rounded-lg flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/3 text-left">
              <h3 className="text-xl font-light font-luxury text-gold-500 mb-2 flex items-center gap-2">
                <span>🛡️</span> {t.filterAllergensTitle}
              </h3>
              <p className="text-stone-400 text-xs font-light leading-relaxed">
                {t.filterAllergensDesc}
              </p>
            </div>
            <div className="md:w-2/3 flex flex-wrap gap-2.5 justify-start">
              {ALLERGEN_CODES.map((all) => {
                const isSelected = selectedAllergens.includes(all.code);
                return (
                  <button
                    key={all.code}
                    onClick={() => handleAllergenToggle(all.code)}
                    className={`text-[10px] uppercase tracking-wider px-3.5 py-2 border transition-premium rounded-full font-semibold cursor-pointer ${
                      isSelected
                        ? "bg-red-950 border-red-500 text-red-200 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                        : "bg-black/20 border-white/5 text-stone-300 hover:border-gold-500/30"
                    }`}
                  >
                    {lang === "vi" ? all.nameVi : lang === "fr" ? all.nameFr : lang === "ja" ? all.nameJa : lang === "ko" ? all.nameKo : lang === "hk" ? all.nameHk : all.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE COURSE PRESENTATION */}
      <section className="py-24 bg-dark-500">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* TABS FOR MENUS */}
          <div className="flex justify-center gap-4 mb-16 border-b border-white/5 pb-6">
            {SET_MENUS.map((menu) => (
              <button
                key={menu.id}
                onClick={() => {
                  setSelectedMenu(menu.id);
                }}
                className={`text-sm md:text-lg uppercase tracking-widest px-6 py-4 border-b-2 transition-premium font-semibold cursor-pointer ${
                  selectedMenu === menu.id
                    ? "border-gold-500 text-gold-500"
                    : "border-transparent text-stone-400 hover:text-stone-200"
                }`}
              >
                {menu.title[lang] || menu.title.vi}
              </button>
            ))}
          </div>

          {/* CHOSEN MENU DETAILS */}
          {SET_MENUS.map((menu) => {
            if (menu.id !== selectedMenu) return null;
            return (
              <div key={menu.id} className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start animate-fade-in text-left">
                
                {/* Left: Info card & Wine pairings */}
                <div className="lg:col-span-5 flex flex-col gap-8">
                  <div className={`glassmorphism border p-8 rounded-lg bg-gradient-to-br ${menu.color} text-left relative overflow-hidden`}>
                    <span className="text-[10px] uppercase tracking-[0.3em] text-gold-500 font-bold mb-2 block">
                      {menu.subtitle[lang] || menu.subtitle.vi}
                    </span>
                    <h2 className="text-4xl font-light font-luxury text-stone-100 mb-4">
                      {menu.title[lang] || menu.title.vi}
                    </h2>
                    <p className="text-stone-300 text-sm font-light leading-relaxed mb-6">
                      {menu.desc[lang] || menu.desc.vi}
                    </p>
                    
                    <div className="flex flex-col gap-2">
                      {menu.id === "degustation" ? (
                        <div className="space-y-2 mt-4">
                          <span className="text-[10px] text-stone-500 uppercase tracking-widest block border-b border-white/5 pb-2 font-semibold">
                            {t.priceByServices}
                          </span>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm font-light">
                            <div className="text-stone-300">3 services</div>
                            <div className="text-gold-500 font-bold text-right">{formatCurrency(prices.degustation.services_3)}</div>
                            <div className="text-stone-300">4 services</div>
                            <div className="text-gold-500 font-bold text-right">{formatCurrency(prices.degustation.services_4)}</div>
                            <div className="text-stone-300">5 services</div>
                            <div className="text-gold-500 font-bold text-right">{formatCurrency(prices.degustation.services_5)}</div>
                            <div className="text-stone-300">6 services</div>
                            <div className="text-gold-500 font-bold text-right">{formatCurrency(prices.degustation.services_6)}</div>
                            <div className="text-stone-300">7 services</div>
                            <div className="text-gold-500 font-bold text-right">{formatCurrency(prices.degustation.services_7)}</div>
                          </div>
                          
                          <span className="text-[10px] text-stone-500 uppercase tracking-widest block border-b border-white/5 pt-4 pb-2 font-semibold">
                            {t.winePairingPackage}
                          </span>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs font-light text-stone-400">
                            <div>3-4 services</div>
                            <div className="text-stone-200 text-right">{formatCurrency(prices.degustation.pairing_3_4)}</div>
                            <div>5 services</div>
                            <div className="text-stone-200 text-right">{formatCurrency(prices.degustation.pairing_5)}</div>
                            <div>6-7 services</div>
                            <div className="text-stone-200 text-right">{formatCurrency(prices.degustation.pairing_6_7)}</div>
                          </div>
                          
                          <div className="text-[10px] text-stone-500 italic mt-3 font-sans border-t border-white/5 pt-2">
                            {t.vatDisclaimer}
                          </div>
                        </div>
                      ) : menu.id === "vegetarian" ? (
                        <div className="space-y-2 mt-4">
                          <span className="text-[10px] text-stone-500 uppercase tracking-widest block border-b border-white/5 pb-2 font-semibold">
                            {t.priceByServices}
                          </span>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm font-light">
                            <div className="text-stone-300">2 services</div>
                            <div className="text-gold-500 font-bold text-right">{formatCurrency(prices.vegetarian.services_2)}</div>
                            <div className="text-stone-300">3 services</div>
                            <div className="text-gold-500 font-bold text-right">{formatCurrency(prices.vegetarian.services_3)}</div>
                            <div className="text-stone-300">4 services</div>
                            <div className="text-gold-500 font-bold text-right">{formatCurrency(prices.vegetarian.services_4)}</div>
                          </div>
                          
                          <div className="text-[10px] text-stone-500 italic mt-3 font-sans border-t border-white/5 pt-2 space-y-1">
                            <div>
                              {t.vatDisclaimer}
                            </div>
                            <div>
                              {t.veganNotice}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-1 mt-4">
                          <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold font-luxury text-gold-500">
                              {formatCurrency(prices.signature.price)}
                            </span>
                            <span className="text-[10px] text-stone-500 uppercase tracking-widest">
                              {t.perGuest}
                            </span>
                          </div>
                          <div className="text-[10px] text-stone-500 italic mt-1 font-sans border-t border-white/5 pt-2">
                            {t.vatDisclaimer}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Suggested Journeys (only for Dégustation) */}
                  {menu.id === "degustation" && (
                    <div className="glassmorphism border border-white/5 p-8 rounded-lg text-left">
                      <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-gold-500 mb-4">
                        🧭 {t.suggestedJourneys}
                      </h3>
                      <div className="space-y-4 text-xs font-light text-stone-300">
                        <div>
                          <strong className="text-gold-500 block mb-1">3 services</strong>
                          <span className="italic text-stone-400">Entrée Froide → Poisson ou Viande → Dessert</span>
                        </div>
                        <div className="border-t border-white/5 pt-3">
                          <strong className="text-gold-500 block mb-1">4 services</strong>
                          <span className="italic text-stone-400">Entrée Froide → Soupe → Plat principal → Dessert</span>
                        </div>
                        <div className="border-t border-white/5 pt-3">
                          <strong className="text-gold-500 block mb-1">5 services</strong>
                          <span className="italic text-stone-400">Entrée Froide → Soupe → Poisson → Viande → Dessert</span>
                        </div>
                        <div className="border-t border-white/5 pt-3">
                          <strong className="text-gold-500 block mb-1">6 services</strong>
                          <span className="italic text-stone-400">Entrée Froide → Soupe → Poisson → Intermezzo → Viande → Dessert</span>
                        </div>
                        <div className="border-t border-white/5 pt-3">
                          <strong className="text-gold-500 block mb-1">7 services</strong>
                          <span className="italic text-stone-400">Entrée Froide → Soupe → Poisson → Intermezzo → Viande → Fromages → Dessert</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Database recommended wines if loaded */}
                  {dbWines.length > 0 && (
                    <div className="glassmorphism border border-white/5 p-8 rounded-lg text-left">
                      <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-gold-500 mb-4">
                        🍷 {t.cellarSuggestions}
                      </h3>
                      <div className="flex flex-col gap-3">
                        {dbWines.map((wine) => (
                          <div key={wine.id} className="flex justify-between items-center text-xs">
                            <span className="text-stone-300 font-light truncate max-w-[200px]">
                              {wine.name[lang] || wine.name.vi || wine.name.en}
                            </span>
                            <span className="text-gold-500 font-bold">
                              {formatCurrency(wine.price_dine_in)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right: Course-by-course list */}
                <div className="lg:col-span-7 flex flex-col gap-6 text-left">
                  <h3 className="text-lg uppercase tracking-widest font-semibold text-stone-200 mb-2">
                    {t.courseTitle}
                  </h3>
                  
                  <div className="flex flex-col gap-8">
                    {menu.courses.map((course, idx) => {
                      return (
                        <div key={idx} className="border-b border-white/5 pb-8 last:border-b-0 last:pb-0">
                          {/* Course Header */}
                          <div className="flex items-baseline gap-3 mb-4">
                            <span className="text-xl font-light font-luxury text-gold-500">{course.number}</span>
                            <h4 className="text-lg font-light text-stone-200 tracking-wide uppercase font-luxury">
                              {course.type[lang] || course.type.vi}
                            </h4>
                          </div>
                          
                          {/* Course Description / Option Note */}
                          {course.has_options ? (
                            <div className="text-[10px] text-stone-500 uppercase tracking-widest mb-4 italic">
                              {t.chooseOne}
                            </div>
                          ) : null}

                          {/* Render Option Items */}
                          {course.has_options ? (
                            <div className="flex flex-col gap-4">
                              {course.options.map((opt, oIdx) => {
                                const containsAllergen = checkCourseAllergen(opt.allergens);
                                const supplementVal = opt.supplement_key ? prices.degustation[opt.supplement_key] : 0;
                                
                                return (
                                  <React.Fragment key={oIdx}>
                                    {oIdx > 0 && (
                                      <div className="flex items-center justify-center my-2">
                                        <div className="h-[1px] bg-white/5 w-1/4" />
                                        <span className="text-[10px] text-stone-600 uppercase tracking-widest px-4">
                                          {t.or}
                                        </span>
                                        <div className="h-[1px] bg-white/5 w-1/4" />
                                      </div>
                                    )}
                                    <div
                                      className={`glassmorphism border p-6 rounded-md transition-premium flex flex-col justify-between gap-4 ${
                                        containsAllergen ? "border-red-500/20 bg-red-950/5" : "border-white/5 hover:border-gold-500/10"
                                      }`}
                                    >
                                      <div className="flex-1">
                                        <div className="flex justify-between items-baseline gap-2 mb-2">
                                          <span className="text-[9px] uppercase tracking-widest text-gold-500 font-bold">
                                            {opt.option_title[lang] || opt.option_title.vi}
                                          </span>
                                          {supplementVal > 0 && (
                                            <span className="text-[10px] text-gold-500 font-semibold uppercase tracking-wider bg-gold-950/50 border border-gold-500/20 px-2 py-0.5 rounded">
                                              +{formatCurrency(supplementVal)}
                                            </span>
                                          )}
                                        </div>
                                        
                                        <h4 className="text-lg font-light text-stone-100 font-luxury tracking-wide">
                                          {opt.name.fr}
                                        </h4>
                                        <p className="text-stone-300 text-sm font-light mt-1 font-sans italic">
                                          {opt.name.vi}
                                        </p>
                                        <p className="text-stone-400 text-xs font-light mt-0.5 font-sans italic">
                                          {opt.name.en}
                                        </p>
                                        
                                        {/* Allergen details if any */}
                                        {opt.note && (
                                          <p className="text-stone-500 text-[12.5px] font-light mt-2 italic">
                                            {opt.note[lang] || opt.note.vi}
                                          </p>
                                        )}

                                        {/* Wine Pairing */}
                                        {opt.wine && (
                                          <p className="text-gold-500/80 text-sm italic mt-3 flex items-center gap-1.5 font-serif">
                                            <span>🍷</span> {opt.wine}
                                          </p>
                                        )}
                                      </div>

                                      {/* Allergen alert badges */}
                                      {opt.allergens && opt.allergens.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-2 shrink-0">
                                          {opt.allergens.map((alg) => {
                                            const matched = selectedAllergens.includes(alg);
                                            return (
                                              <span
                                                key={alg}
                                                className={`text-[9.5px] tracking-wider uppercase px-2 py-0.5 border rounded ${
                                                  matched
                                                    ? "bg-red-500 border-red-500 text-white font-bold animate-pulse"
                                                    : "bg-black/30 border-white/5 text-stone-500"
                                                }`}
                                              >
                                                {alg}
                                              </span>
                                            );
                                          })}
                                        </div>
                                      )}
                                    </div>
                                  </React.Fragment>
                                );
                              })}
                            </div>
                          ) : (
                            /* Non-choice course */
                            <div
                              className={`glassmorphism border p-6 rounded-md transition-premium flex flex-col justify-between gap-4 border-white/5 hover:border-gold-500/10`}
                            >
                              <div className="flex-1">
                                <h4 className="text-lg font-light text-stone-100 font-luxury tracking-wide font-serif">
                                  {course.name.fr}
                                </h4>
                                <p className="text-stone-300 text-sm font-light mt-1 font-sans italic">
                                  {course.name.vi}
                                </p>
                                <p className="text-stone-400 text-xs font-light mt-0.5 font-sans italic">
                                  {course.name.en}
                                </p>
                                
                                {course.note && (
                                  <p className="text-stone-500 text-[12.5px] font-light mt-2 italic font-sans">
                                    {course.note[lang] || course.note.vi}
                                  </p>
                                )}

                                {course.wine && (
                                  <p className="text-gold-500/80 text-sm italic mt-3 flex items-center gap-1.5 font-serif">
                                    <span>🍷</span> {course.wine}
                                  </p>
                                )}
                              </div>

                              {course.allergens && course.allergens.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2 shrink-0">
                                  {course.allergens.map((alg) => {
                                    const matched = selectedAllergens.includes(alg);
                                    return (
                                      <span
                                        key={alg}
                                        className={`text-[9.5px] tracking-wider uppercase px-2 py-0.5 border rounded ${
                                          matched
                                            ? "bg-red-500 border-red-500 text-white font-bold animate-pulse"
                                            : "bg-black/30 border-white/5 text-stone-500"
                                        }`}
                                      >
                                        {alg}
                                      </span>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Add original notes from markdown at the end of courses */}
                  <div className="mt-8 p-6 border-t border-white/5 text-xs text-stone-400 space-y-2 italic font-light font-sans">
                    <p className="text-center font-serif text-gold-500 text-base mb-4">❦</p>
                    <p>• {t.noteTable}</p>
                    <p>• {t.noteCookingTime}</p>
                  </div>

                  <div className="mt-6">
                    <a
                      href="#booking-section"
                      className="inline-block text-[12px] uppercase tracking-widest font-semibold bg-gold-500 text-dark-500 px-8 py-4.5 hover:bg-gold-400 hover:scale-[1.02] shadow-[0_0_20px_rgba(197,165,90,0.2)] transition-premium"
                    >
                      {t.btnReserveSet}
                    </a>
                  </div>
                </div>

              </div>
            );
          })}

        </div>
      </section>

      {/* GUEST NOTES SECTION */}
      <section className="py-20 bg-dark-500 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="text-[10px] uppercase tracking-[0.4em] text-gold-500 font-semibold mb-6 block font-luxury">
            {t.notesTitle}
          </span>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left mt-10">
            <div>
              <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-stone-200 mb-4 font-sans">
                {t.notesAllergiesTitle}
              </h4>
              <p className="text-stone-400 text-xs font-light leading-relaxed italic font-sans">
                {t.notesAllergiesDesc}
              </p>
            </div>
            
            <div>
              <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-stone-200 mb-4 font-sans">
                {t.notesDietsTitle}
              </h4>
              <p className="text-stone-400 text-xs font-light leading-relaxed italic font-sans">
                {t.notesDietsDesc}
              </p>
            </div>
            
            <div>
              <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-stone-200 mb-4 font-sans">
                {t.notesOriginTitle}
              </h4>
              <p className="text-stone-400 text-[11px] font-light leading-relaxed italic font-sans">
                {t.notesOriginDesc}
              </p>
            </div>
          </div>
          
          <div className="mt-16 pt-8 border-t border-white/5 text-center text-xs text-stone-500 italic font-light font-sans space-y-1">
            <p>
              {t.vatDisclaimerLong}
            </p>
            <p className="tracking-widest uppercase text-[10px] text-gold-500/80 mt-2 font-semibold font-sans">
              Maison Vie · Hà Nội · Édition 2026
            </p>
          </div>
        </div>
      </section>

      {/* RESERVATION FORM FOR SET MENU */}
      <section id="booking-section" className="py-28 bg-dark-400 border-t border-white/5 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-dark-300 via-dark-500 to-black opacity-90" />
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-[10px] uppercase tracking-[0.35em] text-gold-500 font-semibold mb-3 block">
              Reservations
            </span>
            <h2 className="text-4xl md:text-5xl font-light tracking-tight text-stone-100 font-luxury">
              {t.bookingTitle}
            </h2>
            <p className="text-stone-400 text-sm font-light mt-4">
              {t.bookingSubtitle}
            </p>
          </div>

          <div className="glassmorphism p-8 md:p-12 border border-white/5 rounded-lg shadow-2xl">
            {submitStatus === "success" ? (
              <div className="text-center py-10 animate-fade-in">
                <div className="w-16 h-16 rounded-full border-2 border-gold-500 text-gold-500 flex items-center justify-center text-3xl mx-auto mb-6">
                  ✓
                </div>
                <h3 className="text-2xl font-light font-luxury text-gold-500 mb-4">{t.successTitle}</h3>
                <p className="text-stone-300 font-light max-w-md mx-auto leading-relaxed">
                  {t.successMsg}
                </p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-6 text-left">
                
                {submitStatus === "error" && (
                  <div className="bg-red-950/20 border border-red-500/50 p-4 rounded text-xs text-red-200">
                    <strong>{t.errorTitle}</strong>: {t.errorMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="flex flex-col">
                    <label className="text-[10px] uppercase tracking-wider text-stone-400 mb-2 font-semibold">
                      {t.labelName} *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={bookingForm.name}
                      onChange={handleInputChange}
                      className="bg-black/40 border border-white/5 focus:border-gold-500/50 px-4 py-3 rounded text-sm text-stone-200 outline-none transition-premium"
                    />
                  </div>

                  {/* Phone */}
                  <div className="flex flex-col">
                    <label className="text-[10px] uppercase tracking-wider text-stone-400 mb-2 font-semibold">
                      {t.labelPhone} *
                    </label>
                    <div className="flex">
                      <select
                        name="countryCode"
                        value={bookingForm.countryCode}
                        onChange={handleInputChange}
                        className="bg-black/50 border border-white/5 border-r-0 px-3 py-3 rounded-l text-xs text-stone-400 focus:outline-none"
                      >
                        {COUNTRY_CODES.map((c) => (
                          <option key={c.code} value={c.dial_code} className="bg-dark-400 text-stone-300">
                            {c.code} ({c.dial_code})
                          </option>
                        ))}
                      </select>
                      <input
                        type="tel"
                        name="phone"
                        required
                        placeholder="09xx xxx xxx"
                        value={bookingForm.phone}
                        onChange={handleInputChange}
                        className="bg-black/40 border border-white/5 flex-1 px-4 py-3 rounded-r text-sm text-stone-200 outline-none focus:border-gold-500/50 transition-premium"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Email */}
                  <div className="flex flex-col">
                    <label className="text-[10px] uppercase tracking-wider text-stone-400 mb-2 font-semibold">
                      {t.labelEmail}
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="info@maisonvie.vn"
                      value={bookingForm.email}
                      onChange={handleInputChange}
                      className="bg-black/40 border border-white/5 focus:border-gold-500/50 px-4 py-3 rounded text-sm text-stone-200 outline-none transition-premium"
                    />
                  </div>

                  {/* Guests */}
                  <div className="flex flex-col">
                    <label className="text-[10px] uppercase tracking-wider text-stone-400 mb-2 font-semibold">
                      {t.labelGuests} *
                    </label>
                    <input
                      type="number"
                      name="guests"
                      min="1"
                      max="100"
                      required
                      value={bookingForm.guests}
                      onChange={handleInputChange}
                      className="bg-black/40 border border-white/5 focus:border-gold-500/50 px-4 py-3 rounded text-sm text-stone-200 outline-none transition-premium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Date */}
                  <div className="flex flex-col">
                    <label className="text-[10px] uppercase tracking-wider text-stone-400 mb-2 font-semibold">
                      {t.labelDate} *
                    </label>
                    <input
                      type="date"
                      name="date"
                      required
                      value={bookingForm.date}
                      onChange={handleInputChange}
                      className="bg-black/40 border border-white/5 focus:border-gold-500/50 px-4 py-3 rounded text-sm text-stone-200 outline-none transition-premium"
                    />
                  </div>

                  {/* Selected Menu */}
                  <div className="flex flex-col">
                    <label className="text-[10px] uppercase tracking-wider text-stone-400 mb-2 font-semibold">
                      {t.labelSelectedMenu}
                    </label>
                    <select
                      name="selectedMenu"
                      value={selectedMenu}
                      onChange={(e) => setSelectedMenu(e.target.value)}
                      className="bg-black/40 border border-white/5 focus:border-gold-500/50 px-4 py-3 rounded text-sm text-stone-200 outline-none transition-premium"
                    >
                      {SET_MENUS.map((menu) => (
                        <option key={menu.id} value={menu.id} className="bg-dark-400 text-stone-300">
                          {menu.title[lang] || menu.title.vi}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Time */}
                  <div className="flex flex-col">
                    <label className="text-[10px] uppercase tracking-wider text-stone-400 mb-2 font-semibold">
                      {t.labelTime} *
                    </label>
                    <select
                      name="time"
                      value={bookingForm.time}
                      onChange={handleInputChange}
                      className="bg-black/40 border border-white/5 focus:border-gold-500/50 px-4 py-3 rounded text-sm text-stone-200 outline-none transition-premium"
                    >
                      {["11:30", "12:00", "12:30", "13:00", "13:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00"].map((timeStr) => (
                        <option key={timeStr} value={timeStr} className="bg-dark-400 text-stone-300">
                          {timeStr}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Allergen indicator info */}
                  {selectedAllergens.length > 0 && (
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-wider text-red-400 mb-2 font-semibold">
                        ⚠️ {t.allergenLabel}
                      </span>
                      <div className="bg-red-950/10 border border-red-500/10 p-3 rounded text-xs text-stone-400 truncate">
                        {selectedAllergens.join(", ")}
                      </div>
                    </div>
                  )}
                </div>

                {/* Notes */}
                <div className="flex flex-col">
                  <label className="text-[10px] uppercase tracking-wider text-stone-400 mb-2 font-semibold">
                    {t.labelNotes}
                  </label>
                  <textarea
                    name="notes"
                    rows="3"
                    value={bookingForm.notes}
                    onChange={handleInputChange}
                    className="bg-black/40 border border-white/5 focus:border-gold-500/50 px-4 py-3 rounded text-sm text-stone-200 outline-none transition-premium resize-none"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={submitStatus === "loading"}
                  className="w-full text-center text-[12px] uppercase tracking-widest font-semibold bg-gold-500 text-dark-500 py-4 hover:bg-gold-400 hover:scale-[1.01] transition-premium shadow-[0_0_15px_rgba(197,165,90,0.15)] cursor-pointer disabled:opacity-55"
                >
                  {submitStatus === "loading" ? "Processing..." : t.btnSubmit}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black py-8 text-center text-xs text-stone-600 border-t border-white/5">
        <p>© 2026 Maison Vie. All rights reserved. French Culinary Excellence.</p>
      </footer>

    </div>
  );
}

export default function SetMenuPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-dark-500 text-gold-500 tracking-widest text-sm uppercase">
        Loading...
      </div>
    }>
      <SetMenuContent />
    </Suspense>
  );
}
