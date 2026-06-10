"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// 🌐 Multilingual interface for Drinks Page
const I18N = {
  vi: {
    title: "Danh Mục Đồ Uống",
    subtitle: "Sự kết hợp tinh tế giữa nghệ thuật pha chế Pháp và hương vị bản địa",
    next: "Tiếp theo",
    back: "Quay lại",
    empty: "Không tìm thấy đồ uống nào trong danh mục này.",
    categories: {
      aperitifs: "Apéritifs",
      mixed_aperitifs: "Mixed Apéritifs",
      signature_cocktails: "Signature Cocktails",
      classic_cocktails: "Cocktails Cổ Điển",
      wine_by_glass: "Rượu Vang Ly",
      mocktails: "Mocktails",
      fresh_juices: "Nước Ép Tươi",
      beers: "Bia",
      waters_softs: "Nước Khoáng & Nước Ngọt",
      spirits: "Rượu Mạnh",
      cognacs: "Cognac & Armagnac",
      liqueurs: "Rượu Mùi & Tiêu Vị",
      coffee_tea: "Cà Phê & Trà"
    }
  },
  en: {
    title: "Beverage List",
    subtitle: "An exquisite blend of French mixology and local Vietnamese flavors",
    next: "Next",
    back: "Back",
    empty: "No beverages found in this category.",
    categories: {
      aperitifs: "Apéritifs",
      mixed_aperitifs: "Mixed Apéritifs",
      signature_cocktails: "Signature Cocktails",
      classic_cocktails: "Classic Cocktails",
      wine_by_glass: "Wines by the Glass",
      mocktails: "Mocktails",
      fresh_juices: "Fresh Juices",
      beers: "Beers",
      waters_softs: "Waters & Soft Drinks",
      spirits: "Spirits",
      cognacs: "Cognac & Armagnac",
      liqueurs: "Liqueurs & Digestifs",
      coffee_tea: "Coffee & Tea"
    }
  },
  fr: {
    title: "La Carte des Boissons",
    subtitle: "L'art de la mixologie française marié aux arômes vietnamiens",
    next: "Suivant",
    back: "Précédent",
    empty: "Aucune boisson disponible dans cette catégorie.",
    categories: {
      aperitifs: "Apéritifs",
      mixed_aperitifs: "Apéritifs Mixtes",
      signature_cocktails: "Cocktails Signatures",
      classic_cocktails: "Cocktails Classiques",
      wine_by_glass: "Vins au Verre",
      mocktails: "Mocktails",
      fresh_juices: "Jus de Fruits Frais",
      beers: "Bières",
      waters_softs: "Eaux & Softs",
      spirits: "Spiritueux",
      cognacs: "Cognac & Armagnac",
      liqueurs: "Liqueurs & Digestifs",
      coffee_tea: "Cafés & Thés"
    }
  },
  ja: {
    title: "ドリンクメニュー",
    subtitle: "フランスのミクソロジーとベトナム現地のフレーバーの調和",
    next: "次へ",
    back: "戻る",
    empty: "このカテゴリーのドリンクは現在ございません。",
    categories: {
      aperitifs: "アペリティフ",
      mixed_aperitifs: "ミックス・アペリティフ",
      signature_cocktails: "シグネチャー・カクテル",
      classic_cocktails: "クラシック・カクテル",
      wine_by_glass: "グラスワイン",
      mocktails: "モクテル",
      fresh_juices: "フレッシュジュース",
      beers: "ビール",
      waters_softs: "ミネラルウォーター ＆ ソフト",
      spirits: "スピリッツ",
      cognacs: "コニャック ＆ アルマニャック",
      liqueurs: "リキュール ＆ 食後酒",
      coffee_tea: "コーヒー ＆ ティー"
    }
  },
  ko: {
    title: "음료 메뉴",
    subtitle: "프랑스 믹솔로지 기법과 베트남 고유 향미의 정교한 조합",
    next: "다음",
    back: "이전",
    empty: "이 카테고리에 제공되는 음료가 없습니다.",
    categories: {
      aperitifs: "아페리티프 (식전주)",
      mixed_aperitifs: "믹스 식전주",
      signature_cocktails: "시그니처 칵테일",
      classic_cocktails: "클래식 칵테일",
      wine_by_glass: "글라스 와인",
      mocktails: "목테일",
      fresh_juices: "생과일 주스",
      beers: "맥주",
      waters_softs: "생수 및 소프트 드링크",
      spirits: "스피릿 (양주)",
      cognacs: "코냑 & 아르마냑",
      liqueurs: "리큐어 & 디제스티프",
      coffee_tea: "커피 & 차"
    }
  },
  hk: {
    title: "飲品及酒水清單",
    subtitle: "法式調酒藝術與越南本土風味的優雅融合",
    next: "下一頁",
    back: "上一頁",
    empty: "此類別目前暫無飲品提供。",
    categories: {
      aperitifs: "餐前開胃酒",
      mixed_aperitifs: "特調開胃酒",
      signature_cocktails: "招牌雞尾酒",
      classic_cocktails: "經典雞尾酒",
      wine_by_glass: "杯裝佳釀",
      mocktails: "無酒精雞尾酒",
      fresh_juices: "鮮榨果汁",
      beers: "精選啤酒",
      waters_softs: "礦泉水及汽水",
      spirits: "精選烈酒",
      cognacs: "干邑及雅文邑",
      liqueurs: "利口酒及餐後酒",
      coffee_tea: "精選咖啡及茗茶"
    }
  }
};

const CATEGORIES_KEYS = [
  "aperitifs",
  "mixed_aperitifs",
  "signature_cocktails",
  "classic_cocktails",
  "wine_by_glass",
  "mocktails",
  "fresh_juices",
  "beers",
  "waters_softs",
  "spirits",
  "cognacs",
  "liqueurs",
  "coffee_tea"
];

const DRINKS_DATA = [
  {
    category: "aperitifs",
    items: [
      {
        name: "Campari",
        desc: {
          en: "Italian bitter aperitif",
          vi: "Rượu khai vị đắng của Ý",
          fr: "Apéritif amer italien",
          ja: "イタリアン・ビター・アペリティフ",
          ko: "이탈리아 식전 서양 배 맛 비터",
          hk: "意大利比特開胃酒"
        }
      },
      {
        name: "Ricard",
        desc: {
          en: "Pastis from Marseille — anise, fennel",
          vi: "Rượu thảo mộc Pastis từ Marseille — hương hồi, thì là",
          fr: "Pastis de Marseille — anis, fenouil",
          ja: "マルセイユ産パスティス — アニス、フェンネル",
          ko: "마르세유식 파스띠스 — 아니스, 펜넬 향",
          hk: "馬賽迴香酒 — 伴大茴香及茴香"
        }
      },
      {
        name: "Porto",
        desc: {
          en: "Aged Portuguese fortified wine — nuts, caramel",
          vi: "Rượu vang cường hóa ủ lâu năm từ Bồ Đào Nha — hương hạt, caramel",
          fr: "Vin fortifié portugais vieilli — notes de noix et caramel",
          ja: "ポルトガル産熟成ポートワイン — ナッツ、キャラメル",
          ko: "포르투갈산 숙성 주정강화 와인 — 견과류, 캐러멜 향",
          hk: "波特酒 — 熟成葡萄牙加烈酒，伴堅果及焦糖香"
        }
      },
      {
        name: "Martini (Rosso / Bianco / Dry)",
        desc: {
          en: "Classic Italian vermouth, choice of three expressions",
          vi: "Rượu vermouth Ý cổ điển, lựa chọn một trong ba loại",
          fr: "Vermouth italien classique, trois expressions au choix",
          ja: "クラシック・イタリアン・ベルモット（赤・白・ドライ）",
          ko: "이탈리아 클래식 버무스 (로소, 비안코, 드라이 중 선택)",
          hk: "馬天尼（紅、白、乾） — 經典意大利苦艾酒"
        }
      }
    ]
  },
  {
    category: "mixed_aperitifs",
    items: [
      {
        name: "Campari Soda or Orange",
        desc: {
          en: "Campari with sparkling water or orange juice, orange peel",
          vi: "Campari pha soda hoặc nước cam tươi, vỏ cam",
          fr: "Campari avec eau gazeuse ou jus d'orange, zeste d'orange",
          ja: "カンパリ・ソーダ または カンパリ・オレンジ（オレンジピール添え）",
          ko: "캄파리 소다 또는 오렌지 (오렌지 필)",
          hk: "金巴利蘇打或柳橙汁 — 伴金巴利、氣泡水、橙皮/柳橙汁"
        }
      },
      {
        name: "Whisky & Soda",
        desc: {
          en: "Whisky, sparkling water, lemon",
          vi: "Rượu whisky pha nước soda và chanh",
          fr: "Whisky, eau gazeuse, citron",
          ja: "ウイスキー＆ソーダ（ハイボール）",
          ko: "위스키 앤 소다",
          hk: "威士忌蘇打 — 威士忌伴蘇打水"
        }
      },
      {
        name: "Gin Tonic",
        desc: {
          en: "Golden gin, premium tonic, fresh lime",
          vi: "Rượu gin cao cấp pha nước tonic và chanh tươi",
          fr: "Gin, tonic premium, citron vert",
          ja: "ジントニック — プレミアムトニック、ライム",
          ko: "진 토닉 — 진, 토닉워터, 라임",
          hk: "金湯力 — 金酒伴湯力水及青檸"
        }
      },
      {
        name: "Kir Royal",
        desc: {
          en: "Crème de cassis topped with sparkling wine",
          vi: "Rượu mùi lý chua đen Crème de cassis pha rượu vang sủi",
          fr: "Crème de cassis et vin mousseux",
          ja: "キール・ロワイヤル — カシスリキュール, スパークリングワイン",
          ko: "키르 로얄 — 크렘 드 카시스, 스파클링 와인",
          hk: "皇家基爾 — 黑加侖子利口酒伴氣泡酒"
        }
      }
    ]
  },
  {
    category: "signature_cocktails",
    items: [
      {
        name: "Le Tây Hồ",
        desc: {
          en: "Gin, Saint-Germain elderflower liqueur, lotus seed syrup, fresh lime, sparkling wine",
          vi: "Rượu Gin, rượu mùi hoa cơm cháy Saint-Germain, si rô hạt sen, chanh tươi, rượu sủi tăm",
          fr: "Gin, liqueur de sureau Saint-Germain, sirop de graines de lotus, citron vert, vin pétillant",
          ja: "ジン、サンジェルマン・エルダーフラワー、蓮の実シロップ、ライム、スパークリングワイン",
          ko: "진, 생제르맹 엘더플라워, 연꽃씨 시럽, 라임, 스파클링 와인",
          hk: "西湖之戀 — 金酒、聖日耳曼接骨木花利口酒、蓮子糖漿、青檸及氣泡酒"
        }
      },
      {
        name: "Jardin de Đà Lạt",
        desc: {
          en: "Gin, fresh perilla leaf, cucumber, lime, house-made Đà Lạt celery cordial",
          vi: "Rượu Gin, lá tía tô tươi, dưa chuột, chanh, nước cốt cần tây Đà Lạt tự chế",
          fr: "Gin, feuilles de périlla fraîches, concombre, citron vert, cordial de céleri de Đà Lạt maison",
          ja: "ジン、大葉（しそ）、きゅうり、ライム、自家製大叻セロリ・コーディアル",
          ko: "진, 생깻잎, 오이, 라임, 자체 제조 달랏 셀러리 코디얼",
          hk: "大叻花園 — 金酒、紫蘇葉、青瓜、青檸及大叻芹菜甜汁"
        }
      },
      {
        name: "Kumquat 75",
        desc: {
          en: "Cognac, fresh kumquat, lemon juice, topped with sparkling wine",
          vi: "Rượu Cognac, quả tắc tươi, nước cốt chanh, phủ rượu vang sủi",
          fr: "Cognac, kumquat frais, jus de citron, complété au vin pétillant",
          ja: "コニャック、フレッシュ金柑、レモン、スパークリングワイン",
          ko: "코냑, 신선한 금귤, 레몬, 스파클링 와인 탑",
          hk: "金桔 75 — 干邑、鮮金桔、檸檬汁及氣泡酒"
        }
      },
      {
        name: "Nuit de Hà Nội",
        desc: {
          en: "Bourbon, Buôn Ma Thuột espresso, sugar syrup, orange peel",
          vi: "Rượu Bourbon, cà phê espresso Buôn Ma Thuột, si rô đường, vỏ cam",
          fr: "Bourbon, café Buôn Ma Thuột, sirop de sucre, zeste d'orange",
          ja: "バーボン、バンメートォト産エスプレッソ、シュガーシロップ、オレンジピール",
          ko: "버번 위스키, 분마툿 에스프레소, 슈가 시럽, 오렌지 필",
          hk: "河內之夜 — 波本威士忌、波羅芬/邦美蜀咖啡、糖漿及橙皮"
        }
      }
    ]
  },
  {
    category: "classic_cocktails",
    items: [
      {
        name: "Margarita",
        desc: {
          en: "Tequila, triple sec, fresh lime juice",
          vi: "Tequila, rượu cam triple sec, nước chanh tươi",
          fr: "Tequila, triple sec, jus de citron vert",
          ja: "テキーラ、トリプルセック、フレッシュライム",
          ko: "데킬라, 트리플 섹, 라임 주스",
          hk: "瑪格麗特 — 龍舌蘭、橙皮酒、鮮青檸汁"
        }
      },
      {
        name: "Whisky Sour",
        desc: {
          en: "Bourbon, fresh lemon, simple syrup, egg white (optional)",
          vi: "Bourbon, chanh tươi, si rô đường, lòng trắng trứng (tùy chọn)",
          fr: "Bourbon, citron frais, sirop, blanc d'œuf (optionnel)",
          ja: "バーボン、レモン、シロップ、卵白（オプション）",
          ko: "버번, 레몬, 시럽, 계란 흰자 (선택)",
          hk: "威士忌酸 — 波本威士忌、檸檬、糖漿、蛋白（可選）"
        }
      },
      {
        name: "Daiquiri",
        desc: {
          en: "White rum, fresh lime juice, sugar",
          vi: "Rượu rum trắng, nước chanh tươi, đường",
          fr: "Rhum blanc, jus de citron vert frais, sucre",
          ja: "ホワイトラム、ライム、シュガー",
          ko: "화이트 럼, 라임 주스, 설탕",
          hk: "黛克瑞 — 白朗姆酒、青檸、糖"
        }
      },
      {
        name: "Singapore Sling",
        desc: {
          en: "Gin, cherry brandy, Bénédictine, pineapple juice, lime",
          vi: "Gin, rượu mùi anh đào cherry brandy, rượu thảo mộc Bénédictine, nước dứa, chanh",
          fr: "Gin, brandy de cerise, Bénédictine, jus d'ananas, citron vert",
          ja: "ジン、チェリーブランデー、ベネディクティン、パイナップル、ライム",
          ko: "진, 체리 브랜디, 베네딕틴, 파인애플 주스, 라임",
          hk: "新加坡司令 — 金酒、櫻桃白蘭地、廊酒、菠蘿汁、青檸"
        }
      },
      {
        name: "Long Island Iced Tea",
        desc: {
          en: "Five-spirit blend (Gin, Vodka, Rum, Tequila, Triple Sec), lemon, cola",
          vi: "Sự kết hợp của 5 loại rượu mạnh (Gin, Vodka, Rum, Tequila, Triple Sec), chanh, cola",
          fr: "Mélange de cinq alcools (Gin, Vodka, Rhum, Tequila, Triple Sec), citron, cola",
          ja: "5種のスピリッツ（ジン、ウォッカ、ラム、テキーラ、トリプルセック）、レモン、コーラ",
          ko: "5가지 스피릿 블렌드 (진, 보드카, 럼, 데킬라, 트리플 섹), 레몬, 콜라",
          hk: "長島冰茶 — 五款烈酒混合, 檸檬, 可樂"
        }
      },
      {
        name: "Black Russian",
        desc: {
          en: "Vodka, premium coffee liqueur",
          vi: "Vodka, rượu mùi cà phê cao cấp",
          fr: "Vodka, liqueur de café premium",
          ja: "ウォッカ、コーヒーリキュール",
          ko: "보드카, 커피 리큐어",
          hk: "黑色俄羅斯 — 伏特加、咖啡利口酒"
        }
      },
      {
        name: "Tequila Sunrise",
        desc: {
          en: "Tequila, fresh orange juice, grenadine syrup",
          vi: "Tequila, nước cam tươi, si rô grenadine (lựu)",
          fr: "Tequila, jus d'orange frais, sirop de grenadine",
          ja: "テキーラ、オレンジジュース、グレナデンシロップ",
          ko: "데킬라, 오렌지 주스, 그레나딘 시럽",
          hk: "龍舌蘭日出 — 龍舌蘭、鮮柳橙汁、紅石榴糖漿"
        }
      },
      {
        name: "Tom Collins",
        desc: {
          en: "Gin, fresh lemon, sugar, soda water",
          vi: "Gin, chanh tươi, đường, nước soda",
          fr: "Gin, citron frais, sucre, eau gazeuse",
          ja: "ジントニック — プレミアムトニック、ライム",
          ko: "진, 레몬, 설탕, 탄산수",
          hk: "湯姆科林斯 — 金酒, 檸檬, 糖, 蘇打水"
        }
      },
      {
        name: "Piña Colada",
        desc: {
          en: "White rum, coconut cream, fresh pineapple juice",
          vi: "Rượu rum trắng, cốt dừa béo, nước dứa tươi",
          fr: "Rhum blanc, crème de coco, jus d'ananas frais",
          ja: "ホワイトラム、ココナッツクリーム、パイナップル",
          ko: "화이트 럼, 코코넛 크림, 파인애플 주스",
          hk: "椰林飄香 — 白朗姆酒、椰漿、菠蘿汁"
        }
      },
      {
        name: "Sangria",
        desc: {
          en: "Red wine, brandy, citrus fruits, seasonal fruits",
          vi: "Rượu vang đỏ, rượu brandy, trái cây họ cam chanh, hoa quả theo mùa",
          fr: "Vin rouge, brandy, agrumes, fruits de saison",
          ja: "赤ワイン、ブランデー、シトラス、季節のフルーツ",
          ko: "레드 와인, 브랜디, 시트러스, 계절 과일",
          hk: "桑格利亞汽酒 — 紅酒、白蘭地、柑橘及時令水果"
        }
      }
    ]
  },
  {
    category: "wine_by_glass",
    items: [
      {
        name: "Pierre Larousse Sparkling Brut",
        desc: {
          en: "Chardonnay · Sparkling — Vin de France — France",
          vi: "Nho Chardonnay · Vang sủi — Vin de France — Pháp",
          fr: "Chardonnay · Pétillant — Vin de France — France",
          ja: "シャルドネ · スパークリング — ヴァン・ド・フランス — フランス",
          ko: "샤르도네 · 스파클링 — 뱅 드 프랑스 — 프랑스",
          hk: "莎當妮 · 氣泡酒 — 法國朗格多克"
        }
      },
      {
        name: "Concha y Toro « Frontera » Sauvignon Blanc",
        desc: {
          en: "Sauvignon Blanc · White wine — D.O. Valle Central — Chile",
          vi: "Nho Sauvignon Blanc · Vang trắng — D.O. Valle Central — Chile",
          fr: "Sauvignon Blanc · Vin blanc — D.O. Valle Central — Chili",
          ja: "ソーヴィニヨン・ブラン · 白ワイン — D.O. セントラル・ヴァレー — チリ",
          ko: "소비뇽 블랑 · 화이트 와인 — D.O. 센트럴 밸리 — 칠레",
          hk: "長相思 · 白葡萄酒 — 智利中央山谷"
        }
      },
      {
        name: "Château Baratet Sauvignon Blanc",
        desc: {
          en: "Sauvignon Blanc · White wine — Bordeaux AOC — France",
          vi: "Nho Sauvignon Blanc · Vang trắng — Bordeaux AOC — Pháp",
          fr: "Sauvignon Blanc · Vin blanc — Bordeaux AOC — France",
          ja: "ソーヴィニヨン・ブラン · 白ワイン — ボルドー AOC — フランス",
          ko: "소비뇽 블랑 · 화이트 와인 — 보르도 AOC — 프랑스",
          hk: "長相思 · 白葡萄酒 — 法國波爾多"
        }
      },
      {
        name: "Dufouleur Père & Fils Pinot Noir Rosé",
        desc: {
          en: "Pinot Noir · Rosé — Vin de France — France",
          vi: "Nho Pinot Noir · Vang hồng — Vin de France — Pháp",
          fr: "Pinot Noir · Rosé — Vin de France — France",
          ja: "ピノ・ノワール · ロゼワイン — ヴァン・ド・フランス — フランス",
          ko: "피노 누아 · 로제 와인 — 뱅 드 프랑스 — 프랑스",
          hk: "黑皮諾 · 桃紅葡萄酒 — 法國布根地"
        }
      },
      {
        name: "Concha y Toro « Frontera » Cabernet Sauvignon",
        desc: {
          en: "Cabernet Sauvignon · Red wine — Vin de France — France",
          vi: "Nho Cabernet Sauvignon · Vang đỏ — Vin de France — Pháp",
          fr: "Cabernet Sauvignon · Vin rouge — Vin de France — France",
          ja: "カベルネ・ソーヴィニヨン · 赤ワイン — ヴァン・ド・フランス — フランス",
          ko: "카베르네 소비뇽 · 레드 와인 — 뱅 드 프랑스 — 프랑스",
          hk: "赤霞珠 · 紅葡萄酒 — 法國"
        }
      },
      {
        name: "Château Baratet Cabernet Sauvignon",
        desc: {
          en: "Cabernet Sauvignon · Red wine — Bordeaux Supérieur AOC — France",
          vi: "Nho Cabernet Sauvignon · Vang đỏ — Bordeaux Supérieur AOC — Pháp",
          fr: "Cabernet Sauvignon · Vin rouge — Bordeaux Supérieur AOC — France",
          ja: "カベルネ・ソーヴィニヨン · 赤ワイン — ボルドー・シュペリュール AOC — フランス",
          ko: "카베르네 소비뇽 · 레드 와인 — 보르도 슈페리외르 AOC — 프랑스",
          hk: "赤霞珠 · 紅葡萄酒 — 法國優等波爾多"
        }
      },
      {
        name: "Dalat Wine Export White",
        desc: {
          en: "Mixed grape · Lâm Đồng — Vietnam",
          vi: "Nho phối trộn · Lâm Đồng — Việt Nam",
          fr: "Assemblage de cépages · Lâm Đồng — Vietnam",
          ja: "ブレンド種 · ラムドン省 — ベトナム",
          ko: "블렌디드 품종 · 람동성 — 베트남",
          hk: "調配白葡萄酒 · 林同省 — 越南"
        }
      },
      {
        name: "Dalat Wine Export Red",
        desc: {
          en: "Mixed grape · Lâm Đồng — Vietnam",
          vi: "Nho phối trộn · Lâm Đồng — Việt Nam",
          fr: "Assemblage de cépages · Lâm Đồng — Vietnam",
          ja: "ブレンド種 · ラムドン省 — ベトナム",
          ko: "블렌디드 품종 · 람동성 — 베트남",
          hk: "調配紅葡萄酒 · 林同省 — 越南"
        }
      }
    ]
  },
  {
    category: "mocktails",
    items: [
      {
        name: "Virgin Mojito",
        desc: {
          en: "Fresh mint, lime, sugar, soda water",
          vi: "Bạc hà tươi, chanh, đường, nước soda",
          fr: "Menthe fraîche, citron vert, sucre, eau gazeuse",
          ja: "フレッシュミント、ライム、シュガー、ソーダ",
          ko: "생민트, 라임, 설탕, 탄산수",
          hk: "純莫希托 — 薄荷、青檸、糖、蘇打水"
        }
      },
      {
        name: "Mango Mojito",
        desc: {
          en: "Fresh mango, mint, lime, soda water",
          vi: "Xoài tươi, bạc hà, chanh, nước soda",
          fr: "Mangue fraîche, menthe, citron vert, eau gazeuse",
          ja: "フレッシュマンゴー、ミント、ライム、ソーダ",
          ko: "생망고, 민트, 라임, 탄산수",
          hk: "芒果莫希托 — 鮮芒果、薄荷、青檸、蘇打水"
        }
      },
      {
        name: "Pineapple Cooler",
        desc: {
          en: "Pineapple, lime, ginger, soda water",
          vi: "Dứa, chanh, gừng, nước soda",
          fr: "Ananas, citron vert, gingembre, eau gazeuse",
          ja: "パイナップル、ライム、ジンジャー、ソーダ",
          ko: "파인애플, 라임, 생강, 탄산수",
          hk: "菠蘿清凉飲 — 菠蘿、青檸、生薑、蘇打水"
        }
      },
      {
        name: "Sunset Citrus Cooler",
        desc: {
          en: "Orange, grapefruit, passion fruit juices",
          vi: "Nước cam, nước bưởi, nước chanh leo",
          fr: "Jus d'orange, pamplemousse, fruits de la passion",
          ja: "オレンジ、グレープフルーツ、パッションフルーツのミックス",
          ko: "오렌지, 자몽, 패션프루트 주스 믹스",
          hk: "日落柑橘特飲 — 柳橙汁、葡萄柚汁、百香果汁"
        }
      },
      {
        name: "Watermelon Cooler",
        desc: {
          en: "Watermelon juice, fresh basil, lime",
          vi: "Nước ép dưa hấu, húng tây tươi, chanh",
          fr: "Jus de pastèque, basilic frais, citron vert",
          ja: "スイカ、フレッシュバジル、ライム",
          ko: "수박 주스, 생바질, 라임",
          hk: "西瓜清凉飲 — 西瓜汁、鮮羅勒、青檸"
        }
      },
      {
        name: "Cucumber Lime Cooler",
        desc: {
          en: "Cucumber, lime, mint, tonic water",
          vi: "Dưa chuột, chanh, bạc hà, nước tonic",
          fr: "Concombre, citron vert, menthe, eau tonic",
          ja: "きゅうり、ライム、ミント、トニックウォーター",
          ko: "오이, 라임, 민트, 토닉워터",
          hk: "青瓜青檸特飲 — 青瓜、青檸、薄荷、湯力水"
        }
      }
    ]
  },
  {
    category: "fresh_juices",
    items: [
      {
        name: "Orange / Mango / Pomelo / Pineapple",
        desc: {
          en: "100% Freshly squeezed local juices",
          vi: "Cam / Xoài / Bưởi / Dứa ép nguyên chất",
          fr: "Jus pressés 100% frais : Orange / Mangue / Pamplemousse / Ananas",
          ja: "オレンジ / マンゴー / グレープフルーツ / パイナップル（果汁100%生搾り）",
          ko: "오렌지 / 망고 / 자몽 / 파인애플 (100% 생과일 착즙)",
          hk: "橙汁 / 芒果汁 / 西柚汁 / 菠蘿汁（100%鮮榨）"
        }
      },
      {
        name: "Lemon / Watermelon / Passion Fruit",
        desc: {
          en: "Freshly prepared juices",
          vi: "Chanh tươi / Dưa hấu / Chanh leo nguyên chất",
          fr: "Jus frais : Citron / Pastèque / Fruits de la passion",
          ja: "レモン / スイカ / パッションフルーツ",
          ko: "레몬 / 수박 / 패션프루트",
          hk: "檸檬汁 / 西瓜汁 / 百香果汁"
        }
      }
    ]
  },
  {
    category: "beers",
    items: [
      {
        name: "Sapporo Draught",
        desc: {
          en: "Japanese premium draught beer (Glass 33cl)",
          vi: "Bia tươi Sapporo Nhật Bản (Ly 33cl)",
          fr: "Bière pression premium japonaise (Verre 33cl)",
          ja: "サッポロ生ビール (グラス 33cl)",
          ko: "삿포로 생맥주 (33cl)",
          hk: "朝日生啤酒 (杯裝 330毫升)"
        }
      },
      {
        name: "Leffe Blond",
        desc: {
          en: "Belgian Abbey Ale (Bottle 33cl)",
          vi: "Bia thầy tu Bỉ Leffe Blond (Chai 33cl)",
          fr: "Bière d'abbaye belge (Bouteille 33cl)",
          ja: "レフ・ブロンド — ベルギー修道院ビール (ボトル 33cl)",
          ko: "레프 블론드 — 벨기에 수도원 맥주 (병 33cl)",
          hk: "時代啤酒 — 比利時修道院艾爾啤酒 (瓶裝 330毫升)"
        }
      },
      {
        name: "Heineken / Tiger",
        desc: {
          en: "Premium European & Asian lagers (Bottle 33cl)",
          vi: "Bia Heineken hoặc Tiger nhập khẩu/địa phương (Chai 33cl)",
          fr: "Bières blondes premium Heineken ou Tiger (Bouteille 33cl)",
          ja: "ハイネケン / タイガー (ボトル 33cl)",
          ko: "하이네켄 / 타이거 (병 33cl)",
          hk: "喜力 / 虎牌啤酒 (瓶裝 330毫升)"
        }
      },
      {
        name: "Hanoi / Saigon / 333",
        desc: {
          en: "Traditional Vietnamese beers (Can/Bottle 33cl)",
          vi: "Bia Hà Nội / Bia Sài Gòn / Bia 333 truyền thống (Chai/Lon 33cl)",
          fr: "Bières vietnamiennes traditionnelles (Canette/Bouteille 33cl)",
          ja: "ハノイビール / サイゴンビール / 333ビール (缶/ボトル 33cl)",
          ko: "하노이 / 사이공 / 333 베트남 전통 맥주 (캔/병 33cl)",
          hk: "河內啤酒 / 西貢啤酒 / 333啤酒 (罐裝/瓶裝 330毫升)"
        }
      }
    ]
  },
  {
    category: "waters_softs",
    items: [
      {
        name: "Maison Vie Alkaline Ionized Water",
        desc: {
          en: "Purified health water (Vietnam · 0.5L)",
          vi: "Nước kiềm tốt cho sức khỏe Maison Vie (Việt Nam · 0.5L)",
          fr: "Eau alcaline ionisée Maison Vie (Vietnam · 0.5L)",
          ja: "メゾン・ヴィ アルカリイオン水 (ベトナム · 0.5L)",
          ko: "메종 비 알칼리 이온수 (베트남 · 0.5L)",
          hk: "Maison Vie 鹼性離子水 (越南 · 500毫升)"
        }
      },
      {
        name: "La Vie Mineral Water",
        desc: {
          en: "Natural mineral water (Vietnam · 1.5L)",
          vi: "Nước khoáng thiên nhiên La Vie (Việt Nam · 1.5L)",
          fr: "Eau minérale naturelle La Vie (Vietnam · 1.5L)",
          ja: "ラ・ヴィ ミネラルウォーター (ベトナム · 1.5L)",
          ko: "라 비 미네랄 워터 (베트남 · 1.5L)",
          hk: "La Vie 礦泉水 (越南 · 1.5公升)"
        }
      },
      {
        name: "Evian",
        desc: {
          en: "French natural spring water (France · 0.5L)",
          vi: "Nước khoáng thiên nhiên nhập khẩu Pháp Evian (Pháp · 0.5L)",
          fr: "Eau de source naturelle des Alpes (France · 0.5L)",
          ja: "エビアン ナチュラルミネラルウォーター (フランス · 0.5L)",
          ko: "에비앙 천연 광천수 (프랑스 · 0.5L)",
          hk: "依雲礦泉水 (法國 · 500毫升)"
        }
      },
      {
        name: "Perrier",
        desc: {
          en: "Naturally carbonated sparkling spring water (France · 0.25L)",
          vi: "Nước khoáng sủi tăm Perrier tự nhiên (Pháp · 0.25L)",
          fr: "Eau minérale gazeuse naturelle (France · 0.25L)",
          ja: "ペリエ スパークリングウォーター (フランス · 0.25L)",
          ko: "페리에 탄산수 (프랑스 · 0.25L)",
          hk: "巴黎水氣泡礦泉水 (法國 · 250毫升)"
        }
      },
      {
        name: "S. Pellegrino",
        desc: {
          en: "Premium sparkling natural mineral water (Italy · 0.5L)",
          vi: "Nước khoáng sủi tăm cao cấp S. Pellegrino (Ý · 0.5L)",
          fr: "Eau gazeuse premium (Italie · 0.5L)",
          ja: "サンペレグリノ スパークリングウォーター (イタリア · 0.5L)",
          ko: "산펠레그리노 탄산 미네랄 워터 (이탈리아 · 0.5L)",
          hk: "聖培露氣泡礦泉水 (意大利 · 500毫升)"
        }
      },
      {
        name: "Soft Drinks (Coca-Cola / Diet Coke / Sprite / Fanta / Tonic / Soda Water)",
        desc: {
          en: "Choice of carbonated soft drinks (Vietnam · 0.33L)",
          vi: "Lựa chọn các loại nước ngọt có ga (Việt Nam · 0.33L)",
          fr: "Sélection de sodas et boissons gazeuses (Vietnam · 0.33L)",
          ja: "各種ソフトドリンク (コカコーラ, ダイエットコーク, スプライト, ファンタ, トニック, ソーダ)",
          ko: "탄산음료 선택 (코카콜라, 다이어트 콜라, 스프라이트, 환타, 토닉워터, 탄산수)",
          hk: "汽水選擇 (可口可樂、健怡可樂、雪碧、芬達、湯力水、蘇打水)"
        }
      }
    ]
  },
  {
    category: "spirits",
    items: [
      {
        name: "Gordon's Gin",
        desc: {
          en: "Classic London Dry Gin",
          vi: "Rượu Gin khô London Dry Gin truyền thống",
          fr: "Gin sec classique style londonien",
          ja: "ゴードン・ロンドンドライジン",
          ko: "고든스 런던 드라이 진",
          hk: "哥頓金酒 — 經典倫敦乾金酒"
        }
      },
      {
        name: "Russian Vodka",
        desc: {
          en: "Pure traditional grain vodka",
          vi: "Rượu Vodka ngũ cốc tinh khiết truyền thống",
          fr: "Vodka de grain traditionnelle pure",
          ja: "ロシア・ウォッカ",
          ko: "러시안 보드카",
          hk: "俄羅斯伏特加 — 純淨傳統穀物伏特加"
        }
      },
      {
        name: "Bacardi White Rum",
        desc: {
          en: "Smooth white rum ideal for mixing",
          vi: "Rượu Rum trắng Bacardi êm dịu chuyên pha chế",
          fr: "Rhum blanc doux idéal pour cocktails",
          ja: "バカルディ・ホワイト・ラム",
          ko: "바카디 화이트 럼",
          hk: "百加得白朗姆酒"
        }
      },
      {
        name: "Chivas Regal (12 Years)",
        desc: {
          en: "Premium blended Scotch whisky",
          vi: "Rượu Whisky Scotch pha trộn cao cấp",
          fr: "Whisky écossais d'assemblage premium",
          ja: "シーバスリーガル 12年 (スコッチウイスキー)",
          ko: "시바스 리갈 12년 (스코치 위스키)",
          hk: "芝華士 12年蘇格蘭調和威士忌"
        }
      },
      {
        name: "Johnnie Walker Red Label",
        desc: {
          en: "Blended Scotch whisky known for boldness",
          vi: "Rượu Whisky Scotch pha trộn đậm đà đặc trưng",
          fr: "Whisky écossais d'assemblage robuste",
          ja: "ジョニーウォーカー レッドラベル",
          ko: "조니워커 레드 라벨",
          hk: "尊尼獲加紅牌蘇格蘭威士忌"
        }
      }
    ]
  },
  {
    category: "cognacs",
    items: [
      {
        name: "Hennessy V.S.O.P",
        desc: {
          en: "Cognac V.S.O.P — France",
          vi: "Rượu Cognac V.S.O.P thượng hạng — Pháp",
          fr: "Cognac V.S.O.P — France",
          ja: "ヘネシー V.S.O.P — フランス",
          ko: "헤네시 V.S.O.P — 프랑스",
          hk: "軒尼詩 V.S.O.P 干邑 — 法國"
        }
      },
      {
        name: "Rémy Martin V.S.O.P",
        desc: {
          en: "Cognac V.S.O.P — Fine Champagne — France",
          vi: "Rượu Cognac V.S.O.P chưng cất Fine Champagne — Pháp",
          fr: "Cognac V.S.O.P — Fine Champagne — France",
          ja: "レミーマルタン V.S.O.P — フランス",
          ko: "레미 마틴 V.S.O.P — 프랑스",
          hk: "人頭馬 V.S.O.P 特優香檳干邑 — 法國"
        }
      },
      {
        name: "Hennessy X.O",
        desc: {
          en: "Prestige aged Cognac X.O — France",
          vi: "Rượu Cognac lâu năm đẳng cấp Hennessy X.O — Pháp",
          fr: "Cognac de prestige X.O — France",
          ja: "ヘネシー X.O — フランス",
          ko: "헤네시 X.O — 프랑스",
          hk: "軒尼詩 X.O 特級干邑 — 法國"
        }
      },
      {
        name: "Armagnac (House Selection)",
        desc: {
          en: "Distilled wine from the Gascony region",
          vi: "Rượu mạnh Armagnac chọn lọc từ vùng Gascony",
          fr: "Sélection maison d'Armagnac de Gascogne",
          ja: "アルマニャック (ハウス・セレクション)",
          ko: "아르마냑 (하우스 셀렉션)",
          hk: "雅文邑白蘭地 (精選推薦)"
        }
      },
      {
        name: "Framboise (Eaux-de-Vie)",
        desc: {
          en: "Alsatian raspberry fruit brandy, crystalline & pure",
          vi: "Rượu chưng cất quả mâm xôi vùng Alsace, tinh khiết & trong suốt",
          fr: "Eau-de-vie de framboise d'Alsace, cristalline & pure",
          ja: "フランボワーズ (オー・ド・ヴィー) — アルザス産木いちご白蘭地",
          ko: "프랑부아즈 (오드비) — 알자스 라즈베리 브랜디",
          hk: "覆盆子水果白蘭地 — 法國阿爾薩斯，純淨芬芳"
        }
      },
      {
        name: "Poire William (Eaux-de-Vie)",
        desc: {
          en: "Alsatian pear fruit brandy, floral & precise",
          vi: "Rượu chưng cất quả lê vùng Alsace, hương hoa cỏ thanh tao",
          fr: "Eau-de-vie de poire William d'Alsace, florale & précise",
          ja: "ポワール・ウィリアム (オー・ド・ヴィー) — アルザス産洋梨白蘭地",
          ko: "푸아르 윌리엄 (오드비) — 알자스 서양배 브랜디",
          hk: "威廉梨水果白蘭地 — 法國阿爾薩斯，芳香細膩"
        }
      }
    ]
  },
  {
    category: "liqueurs",
    items: [
      {
        name: "Cointreau",
        desc: {
          en: "French sweet & bitter orange liqueur",
          vi: "Rượu mùi vỏ cam ngọt và đắng từ Pháp",
          fr: "Liqueur d'écorces d'oranges douces et amères",
          ja: "コアントロー — フランス産オレンジリキュール",
          ko: "코인트루 — 프랑스산 오렌지 리큐어",
          hk: "君度橙酒 — 法國甜橙與苦橙皮利口酒"
        }
      },
      {
        name: "Grand Marnier",
        desc: {
          en: "Cognac-based orange liqueur",
          vi: "Rượu mùi cam hảo hạng chưng cất trên nền Cognac",
          fr: "Liqueur de Cognac et d'orange",
          ja: "グランマニエ — コニャックベース・オレンジリキュール",
          ko: "그랑 마니에르 — 코냑 베이스 오렌지 리큐어",
          hk: "柑曼怡 — 干邑白蘭地調配橙皮利口酒"
        }
      },
      {
        name: "Bailey's Original",
        desc: {
          en: "Irish cream and whiskey liqueur",
          vi: "Rượu mùi kem sữa và whiskey từ Ireland",
          fr: "Crème de liqueur irlandaise au whiskey",
          ja: "ベイリーズ・original・アイリッシュクリーム",
          ko: "베일리스 오리지널 아이리시 크림",
          hk: "百利甜酒 — 愛爾蘭威士忌與鮮奶油利口酒"
        }
      }
    ]
  },
  {
    category: "coffee_tea",
    items: [
      {
        name: "Espresso (Single / Double)",
        desc: {
          en: "Freshly brewed Italian style coffee",
          vi: "Cà phê Espresso pha máy kiểu Ý (Nóng/Đá)",
          fr: "Café court d'inspiration italienne (Simple / Double)",
          ja: "エスプレッソ (シングル / ダブル)",
          ko: "에스프레소 (싱글 / 더블)",
          hk: "特濃咖啡 (單份 / 雙份)"
        }
      },
      {
        name: "Americano / Latte / Cappuccino",
        desc: {
          en: "Classic espresso and milk beverages",
          vi: "Cà phê Americano hầm ấm, Latte hoặc Cappuccino thơm béo",
          fr: "Boissons classiques à base d'espresso et de lait",
          ja: "アメリカーノ / カフェラテ / カプチーノ",
          ko: "아메리카노 / 카페라떼 / 카푸치노",
          hk: "美式咖啡 / 拿鐵 / 卡布奇諾"
        }
      },
      {
        name: "Vietnamese Coffee (Hot / Iced)",
        desc: {
          en: "Traditional drip coffee with condensed milk or fresh milk",
          vi: "Cà phê phin truyền thống dùng kèm sữa đặc hoặc sữa tươi",
          fr: "Café vietnamien traditionnel au lait concentré ou lait frais",
          ja: "ベトナムコーヒー（練乳入り 或者 牛乳入り、温/冷）",
          ko: "베트남 정통 연유 커피 또는 블랙 커피 (온/냉)",
          hk: "傳統越南咖啡 (熱 / 冰，可選配煉奶或鮮奶)"
        }
      },
      {
        name: "Oolong Tea",
        desc: {
          en: "Premium brewed Oolong tea served in a teapot",
          vi: "Trà Ô Long cao cấp hảo hạng phục vụ theo ấm",
          fr: "Thé Oolong de qualité supérieure servi en théière",
          ja: "高級烏龍茶（烏龍茶ポット）",
          ko: "프리미엄 우롱차 (포트 서비스)",
          hk: "頂級烏龍茶 (整壺)"
        }
      },
      {
        name: "Earl Grey Tea",
        desc: {
          en: "Classic black tea scented with oil of bergamot",
          vi: "Trà Bá Tước truyền thống dậy hương cam bergamot",
          fr: "Thé noir classique parfumé à la bergamote",
          ja: "アールグレイ ティー",
          ko: "얼 그레이 홍차",
          hk: "伯爵紅茶"
        }
      },
      {
        name: "Vietnamese Tea / Vietnamese Ice Tea",
        desc: {
          en: "Traditional green tea served hot or cold",
          vi: "Trà mạn thơm ấm hoặc trà đá thanh mát",
          fr: "Thé vert traditionnel servi chaud ou glacé",
          ja: "ベトナム伝統緑茶（温/冷）",
          ko: "베트남 녹차 / 베트남 아이스 티",
          hk: "越南綠茶 / 越南冰茶"
        }
      },
      {
        name: "Lipton Tea / Ice Lipton Tea",
        desc: {
          en: "Classic black tea served hot or iced with lemon",
          vi: "Trà túi lọc Lipton dùng kèm chanh tươi nóng hoặc đá",
          fr: "Thé Lipton classique chaud ou glacé",
          ja: "リプトンティー (温/冷)",
          ko: "립톤 홍차 (온/냉)",
          hk: "立頓紅茶 / 立頓冰茶"
        }
      }
    ]
  }
];

function DrinksContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const lang = searchParams.get("lang") || "vi";
  
  // Default to first category 'aperitifs' instead of 'all'
  const [activeCategory, setActiveCategory] = useState("aperitifs");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const t = I18N[lang] || I18N.vi;

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getTranslatedValue = (jsonbField, fallback = "") => {
    if (!jsonbField) return fallback;
    return jsonbField[lang] || jsonbField["vi"] || jsonbField["en"] || fallback;
  };

  // Find index of current category to handle pagination
  const currentIndex = CATEGORIES_KEYS.indexOf(activeCategory);
  const prevCategory = currentIndex > 0 ? CATEGORIES_KEYS[currentIndex - 1] : null;
  const nextCategory = currentIndex < CATEGORIES_KEYS.length - 1 ? CATEGORIES_KEYS[currentIndex + 1] : null;

  // Filter drinks for current active category
  const activeGroup = DRINKS_DATA.find((group) => group.category === activeCategory);

  return (
    <div className="flex flex-col min-h-screen bg-dark-500 font-sans text-stone-300">
      
      {/* HEADER / NAVIGATION */}
      <Header lang={lang} />

      {/* HERO / INTRO */}
      <section className="relative py-20 text-center bg-gradient-to-b from-dark-400 to-dark-500 border-b border-white/5">
        <div className="max-w-4xl mx-auto px-6">
          <span className="text-[10px] uppercase tracking-[0.3em] text-gold-500 font-semibold mb-4 block">La Carte des Boissons</span>
          <h1 className="text-4xl md:text-5xl font-light tracking-tight text-gold-500 gold-text-gradient font-luxury mb-6">
            {t.title}
          </h1>
          <p className="text-stone-300 font-light text-md max-w-xl mx-auto leading-relaxed">
            {t.subtitle}
          </p>
        </div>
      </section>

      {/* STICKY FILTER DROPDOWN AREA */}
      <section className="py-8 sticky top-24 z-40 bg-dark-500/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-md mx-auto px-6" ref={dropdownRef}>
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full flex items-center justify-between text-[12px] uppercase tracking-widest px-6 py-4 border border-gold-500/20 bg-dark-400 text-gold-500 font-semibold rounded-sm hover:border-gold-500/40 hover:bg-dark-300 transition-premium cursor-pointer"
            >
              <span>{t.categories[activeCategory]}</span>
              <span className={`text-[8px] text-gold-500/70 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>
            
            {dropdownOpen && (
              <div className="absolute left-0 right-0 mt-2 max-h-80 overflow-y-auto glassmorphism rounded-sm border border-white/10 shadow-[0_15px_30px_rgba(0,0,0,0.5)] z-50 animate-fade-in divide-y divide-white/5">
                {CATEGORIES_KEYS.map((catKey) => (
                  <button
                    key={catKey}
                    onClick={() => {
                      setActiveCategory(catKey);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-5 py-3.5 text-[11px] uppercase tracking-wider transition-premium block cursor-pointer ${
                      activeCategory === catKey 
                        ? "bg-gold-500/10 text-gold-500 font-bold border-l-2 border-gold-500" 
                        : "text-stone-300 hover:bg-white/5 hover:text-stone-100"
                    }`}
                  >
                    {t.categories[catKey]}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* DRINKS LISTING */}
      <section className="py-16 flex-1">
        <div className="max-w-4xl mx-auto px-6">
          {!activeGroup ? (
            <div className="text-center py-20 text-stone-500 text-sm italic">
              {t.empty}
            </div>
          ) : (
            <div className="space-y-10">
              
              {/* Category title in main content */}
              <div className="text-center mb-12">
                <span className="text-[10px] uppercase tracking-[0.2em] text-gold-500/60 block mb-2">Category</span>
                <h2 className="text-2xl md:text-3xl font-light tracking-widest font-luxury text-gold-500 gold-text-gradient uppercase">
                  {t.categories[activeCategory]}
                </h2>
                <div className="w-16 h-[1px] bg-gold-500/30 mx-auto mt-4"></div>
              </div>

              {/* Drinks Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8">
                {activeGroup.items.map((drink, index) => {
                  const displayDesc = getTranslatedValue(drink.desc);
                  return (
                    <div 
                      key={index} 
                      className="group flex flex-col justify-center py-4 border-b border-white/[0.03] hover:border-gold-500/10 transition-colors duration-200"
                    >
                      <div className="flex items-baseline justify-between">
                        <h3 className="text-[16px] font-medium text-stone-100 group-hover:text-gold-300 transition-colors duration-200">
                          {drink.name}
                        </h3>
                      </div>
                      {displayDesc && (
                        <p className="text-[13.5px] text-stone-400 font-light mt-1.5 leading-relaxed">
                          {displayDesc}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* BOTTOM NAVIGATION (PREV / NEXT) */}
              <div className="flex items-center justify-between pt-12 border-t border-white/5 mt-16">
                {prevCategory ? (
                  <button
                    onClick={() => {
                      setActiveCategory(prevCategory);
                      window.scrollTo({ top: 300, behavior: 'smooth' });
                    }}
                    className="flex items-center space-x-2 text-[11px] uppercase tracking-widest text-stone-400 hover:text-gold-500 border border-white/5 hover:border-gold-500/30 bg-black/10 px-5 py-3 transition-premium rounded-sm cursor-pointer"
                  >
                    <span>←</span>
                    <span>{t.categories[prevCategory]}</span>
                  </button>
                ) : (
                  <div className="w-20" /> // Spacer
                )}

                {nextCategory ? (
                  <button
                    onClick={() => {
                      setActiveCategory(nextCategory);
                      window.scrollTo({ top: 300, behavior: 'smooth' });
                    }}
                    className="flex items-center space-x-2 text-[11px] uppercase tracking-widest text-stone-400 hover:text-gold-500 border border-white/5 hover:border-gold-500/30 bg-black/10 px-5 py-3 transition-premium rounded-sm cursor-pointer"
                  >
                    <span>{t.categories[nextCategory]}</span>
                    <span>→</span>
                  </button>
                ) : (
                  <div className="w-20" /> // Spacer
                )}
              </div>

            </div>
          )}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 bg-dark-400 border-t border-white/5 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <span className="text-[11px] uppercase tracking-[0.3em] text-gold-500 font-semibold mb-4 block">Réservations</span>
          <h2 className="text-3xl md:text-4xl font-light tracking-tight text-stone-100 font-luxury mb-8">
            Trải nghiệm ẩm thực Pháp tinh hoa
          </h2>
          <button 
            onClick={() => router.push(`/?lang=${lang}#booking`)}
            className="text-[13px] uppercase tracking-widest font-semibold bg-gold-500 text-dark-500 px-8 py-4.5 hover:bg-gold-400 shadow-[0_0_15px_rgba(197,165,90,0.15)] transition-premium cursor-pointer"
          >
            {t.btnReserve}
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <Footer lang={lang} />

    </div>
  );
}

export default function Drinks() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-dark-500 text-gold-500 tracking-widest text-sm uppercase">
        Loading...
      </div>
    }>
      <DrinksContent />
    </Suspense>
  );
}
