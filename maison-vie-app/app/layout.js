import { Cormorant_Garamond, Outfit } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "Maison Vie - Cuisine Française Classique · Terroir Vietnamien",
  description: "Nhà hàng Pháp cổ điển tinh hoa giữa lòng Hà Nội. Khám phá thực đơn ẩm thực Pháp thượng hạng kết hợp hương vị bản địa độc đáo, không gian Tân cổ điển và dịch vụ đẳng cấp.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="vi"
      className={`${cormorant.variable} ${outfit.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-dark-500 text-stone-200 font-sans">
        {children}
      </body>
    </html>
  );
}
