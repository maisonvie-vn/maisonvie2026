# BÁO CÁO CẤU HÌNH HẠ TẦNG & DỰ TOÁN CHI PHÍ VẬN HÀNH
## Giai đoạn Full Option - Dự án Restaurant Operating System (Maison Vie 2026)

Tài liệu này cung cấp câu trả lời chính xác, mang tính phản biện và thực tế về mặt kỹ thuật đối với hệ thống hạ tầng đám mây (Cloud Infrastructure) và các dịch vụ tích hợp bên thứ ba cho dự án **Maison Vie**. Các dự toán được tối thiểu hóa chi phí nhưng đảm bảo hiệu năng vận hành ổn định cho một nhà hàng Fine Dining 250 chỗ ngồi giờ cao điểm.

---

## 1. HẠ TẦNG VERCEL (WEBSITE & FRONTEND GATEWAY)

### 🔴 Hiện trạng: Bản FREE (Hobby)
* **Có thể dùng ở giai đoạn phát triển không?** **CÓ.** Trong quá trình viết code, thiết kế giao diện và kiểm thử nội bộ thì bản Free là hoàn toàn đủ.
* **Có dùng được cho vận hành thực tế (Go-Live) không?** **KHÔNG THỂ.**
  * **Vi phạm điều khoản:** Vercel Hobby chỉ dành cho dự án cá nhân, phi thương mại. Việc chạy website kinh doanh, nhận booking và xử lý dòng tiền của nhà hàng trên bản Free sẽ bị Vercel quét và **khóa tài khoản ngay lập tức mà không báo trước**.
  * **Giới hạn hiệu năng (Serverless Timeout):** Bản Free giới hạn thời gian xử lý của mỗi request là 10 giây. Khi lượng khách truy cập giờ cao điểm tăng, hoặc khi API gọi sang bên thứ ba (VNPT e-Invoice, VNPAY) bị trễ, request sẽ bị timeout gây lỗi trắng màn hình hoặc mất kết nối thanh toán.

### 🟢 Cấu hình tối thiểu cho giai đoạn Full Option: Vercel PRO
* **Chi phí:** **$20/tháng/người dùng** (Chỉ cần 1 tài khoản quản trị cho nhà hàng).
* **Lý do kỹ thuật bắt buộc nâng cấp:**
  * Hợp thức hóa hoạt động thương mại của nhà hàng trên Internet.
  * Tăng giới hạn Serverless Timeout từ 10 giây lên **60 giây** (ngăn chặn hoàn toàn lỗi timeout khi gọi API VNPT/VNPAY).
  * Băng thông đạt **1 TB (1000 GB)/tháng** – thừa sức phục vụ hàng triệu lượt truy cập website, tra cứu menu, wine-list và đọc blog SEO.
  * Mở khóa tính năng **Web Analytics** và **Speed Insights** để theo dõi tốc độ load trang và hành vi đặt bàn của khách thực tế nhằm tối ưu tỷ lệ chuyển đổi.

---

## 2. CƠ SỞ DỮ LIỆU SUPABASE (DATABASE & BACKEND)

### 🔴 Hiện trạng: Bản FREE
* **Có dùng được cho vận hành thực tế không?** **TUYỆT ĐỐI KHÔNG.**
  * **Rủi ro tự động khóa (Auto-pause):** Dự án bản Free sẽ tự động bị đóng băng (pause) sau 1 tuần không có thao tác lập trình. Nếu nhà hàng nghỉ lễ hoặc ít truy cập CRM, DB sẽ tự tắt, gây tê liệt toàn bộ hệ thống POS, KDS tại nhà hàng.
  * **Giới hạn dung lượng 500 MB:** Bản Free giới hạn dữ liệu ở mức 500 MB. Dung lượng này sẽ bị lấp đầy chỉ trong vòng vài tuần khi nhà hàng chạy full option với: hình ảnh món ăn, lịch sử hàng ngàn lượt đặt bàn, hóa đơn POS hàng ngày, và đặc biệt là hệ thống ghi vết an ninh **`audit_log`** (lưu lại mọi thao tác của nhân viên).
  * **Giới hạn phần cứng (Compute resource):** Bản Free chạy trên cấu hình RAM và CPU siêu nhỏ dùng chung. Khi KDS bếp, BDS quầy bar, và 15 máy tính bảng của nhân viên sảnh đồng loạt kết nối WebSockets thời gian thực vào giờ cao điểm, DB sẽ bị nghẽn (connection pool exhaustion), gây treo POS và mất order.

### 🟢 Cấu hình tối thiểu cho giai đoạn Full Option: Supabase PRO + Compute Add-on
Để tối ưu hóa chi phí nhưng vẫn đảm bảo "độ mượt" vận hành sảnh tiệc, chúng tôi đề xuất cấu hình phân tầng như sau:

* **Gói Base: Supabase PRO ($25/tháng)**
  * *Những gì có sẵn:* Không bao giờ bị tự động khóa dự án. Có sẵn 8 GB dung lượng lưu trữ (tự động scale-up lên đến hàng trăm GB với giá chỉ $0.125/GB). Có sẵn 50 GB băng thông truyền tải dữ liệu hàng tháng.
* **Gói nâng cấp phần cứng bắt buộc (Compute Add-on): Small Instance ($10/tháng)**
  * *Lý do kỹ thuật:* Bản Pro mặc định vẫn dùng chip CPU chia sẻ. Để KDS/BDS không bị trễ 1-2 giây khi đầu bếp/bartender bấm món, chúng tôi bắt buộc phải thuê gói **Small Dedicated Compute**. Gói này cấp riêng RAM 2GB và vi xử lý độc lập cho database của Maison Vie, triệt tiêu hoàn toàn rủi ro gián đoạn WebSockets.
* **Tổng chi phí Supabase tối thiểu:** **$35/tháng** (Pro $25 + Compute $10).

---

## 3. CÁC CẤU HÌNH TRỰC THUỘC BÊN THỨ BA (FULL OPTION)

Khi hoàn thành toàn bộ bản Full Option, hệ thống cần tích hợp các dịch vụ vệ tinh sau. Dưới đây là cấu hình tối thiểu và cơ chế hoạt động thực tế:

### 3.1. Dịch vụ gửi Email tự động (Resend)
* **Mục tiêu:** Gửi email xác nhận đặt bàn, nhắc lịch cọc, hóa đơn điện tử cho khách.
* **Cấu hình tối thiểu:** **Gói Free hoặc Gói Starter ($20/tháng)**.
  * *Khuyên dùng:* Giai đoạn đầu dùng gói Free (gửi tối đa 3,000 email/tháng, 100 email/ngày). Khi lượng khách đông vượt hạn mức, nâng cấp lên gói **Starter ($20/tháng)** để gửi 50,000 email/tháng.
  * *Yêu cầu kỹ thuật:* Bắt buộc cấu hình bản ghi DNS xác thực tên miền riêng `@booking.maisonvie.vn` để tránh tuyệt đối việc email rơi vào hộp thư Spam của khách.

### 3.2. Lưu trữ & Phát Video đào tạo SOP (Cloudflare Stream)
* **Mục tiêu:** Lưu trữ video huấn luyện nhân viên (SOP) tuyệt mật của nhà hàng, chống tải trộm và chống leak ra ngoài.
* **Phản biện giải pháp cũ:** Dùng YouTube Unlisted là hoàn toàn không bảo mật vì bất kỳ ai có link đều xem và chia sẻ được.
* **Cấu hình tối thiểu: Cloudflare Stream (Pay-as-you-go - Trả theo lượng dùng)**
  * *Cơ chế giá cực rẻ:* Chỉ **$5/tháng** cho mỗi 1000 phút video lưu trữ. Chi phí lượt xem chỉ **$1 cho mỗi 1000 phút xem**.
  * *Yêu cầu kỹ thuật:* Bật tính năng **Domain Restriction** (chỉ cho phép phát video khi được nhúng trên trang CRM nội bộ) và **Signed URLs** (URL hết hạn sau 10 phút) để bảo vệ 100% tài sản trí tuệ của nhà hàng.

### 3.3. Dịch vụ SMS Brandname (Để gửi mã OTP và Waitlist khẩn cấp)
* **Mục tiêu:** Gửi mã OTP xác nhận voucher trị giá cao (chống gian lận thu ngân) và báo tin nhắn thương hiệu khi khách được khớp bàn từ danh sách chờ (Waitlist).
* **Nhà cung cấp đề xuất tại VN:** eSMS.vn hoặc VietGuys.
* **Dự toán chi phí:**
  * Lệ phí đăng ký tên thương hiệu "MAISON VIE" với các nhà mạng (Viettel, Vina, Mobi): ~500,000 - 1,000,000 VNĐ (trả một lần duy nhất).
  * Chi phí trên mỗi tin nhắn gửi đi: ~500 - 800 VNĐ/SMS.

### 3.4. Cổng thanh toán đặt cọc chống No-show (VNPAY & PAYOO)
* **Cấu hình:** **Không mất chi phí duy trì hàng tháng.**
* **Cơ chế thu phí:** Trừ trực tiếp theo tỷ lệ phần trăm trên mỗi giao dịch thành công (Commission-based).
  * *VNPAY:* ~1.5% - 2.5% giá trị giao dịch.
  * *PAYOO:* ~1.8% - 2.2% giá trị giao dịch.
* **Yêu cầu thủ tục:** Chủ nhà hàng cung cấp Giấy phép Đăng ký kinh doanh hợp pháp để ký hợp đồng thương mại với VNPAY/PAYOO và nhận mã API chính thức.

### 3.5. Đồng bộ hóa hóa đơn điện tử VNPT e-Invoice
* **Cấu hình:** **Không mất phí duy trì hệ thống.** Chi phí tính theo block hóa đơn mua từ VNPT (khoảng ~300 - 500 VNĐ trên mỗi hóa đơn điện tử được xuất thành công).
* **Yêu cầu kỹ thuật bắt buộc:** Để server Supabase gọi tự động đến VNPT xuất hóa đơn không cần cắm USB Token vật lý tại quầy thu ngân, nhà hàng bắt buộc phải đăng ký gói **Chữ ký số ảo Cloud HSM của VNPT** (Chi phí khoảng 1,500,000 - 2,500,000 VNĐ/năm).

---

## IV. BẢNG TỔNG HỢP CHI PHÍ CỐ ĐỊNH & BIẾN ĐỔI (HẠ TẦNG FULL OPTION)

Dưới đây là bảng tổng hợp ngân sách vận hành tối thiểu cho hệ thống để anh trình duyệt Chủ đầu tư:

### 1. Chi phí cố định hàng tháng (Fixed Cloud Operational Cost)
| Dịch vụ | Gói cấu hình | Chi phí (USD) | Chi phí (VND quy đổi) | Vai trò hệ thống |
| :--- | :--- | :---: | :---: | :--- |
| **Vercel** | Pro Tier | $20 | ~500,000 VNĐ | Chạy Website công khai & xử lý API. |
| **Supabase** | Pro Tier | $25 | ~620,000 VNĐ | Lưu trữ Database, RLS, Auth người dùng. |
| **Supabase Compute** | Small Dedicated Add-on | $10 | ~250,000 VNĐ | RAM dedicated chống nghẽn KDS ca tối. |
| **Cloudflare Stream** | Gói lưu trữ video SOP | $5 | ~120,000 VNĐ | Lưu trữ 1000 phút video bài giảng SOP sảnh. |
| **Tổng cộng cố định** | | **$60 / tháng** | **~1,490,000 VNĐ / tháng** | |

### 2. Chi phí biến đổi theo lượng sử dụng (Pay-as-you-go & Transaction Cost)
| Dịch vụ | Gói cấu hình | Đơn giá ước tính | Cơ chế phát sinh |
| :--- | :--- | :--- | :--- |
| **Resend (Email)** | Starter (nếu vượt gói Free) | $20 / tháng | Khi gửi vượt 3,000 email/tháng. |
| **SMS Brandname** | OTP / Waitlist SMS | ~600 VNĐ / SMS | Phát sinh khi gửi tin nhắn OTP hoặc khớp Waitlist. |
| **VNPT e-Invoice** | Hóa đơn điện tử | ~400 VNĐ / hóa đơn | Phát sinh khi khách yêu cầu xuất hóa đơn đỏ VAT. |
| **VNPAY / PAYOO** | Commission cổng thanh toán | 1.8% - 2.2% / GD | Trừ trực tiếp trên số tiền đặt cọc giữ chỗ của khách. |

---

## V. ĐỀ XUẤT THỰC THI THỰC TẾ (TIẾT KIỆM NGÂN SÁCH)

Để tránh lãng phí ngân sách trong lúc xây dựng dự án, chúng tôi đề xuất quy trình nâng cấp hạ tầng khớp theo **Lộ trình 3 Làn Sóng** như sau:

1. **Từ Ngày 1 đến Ngày 75 (Giai đoạn Code & Test):** **GIỮ NGUYÊN 100% CẤU HÌNH FREE** của cả Vercel và Supabase. Mọi hoạt động viết code, dựng layout web và test luồng POS đều chạy trên môi trường sandbox miễn phí để tối ưu chi phí.
2. **Trước Go-Live Website 15 ngày (Khoảng ngày 75-80):** 
   * Nâng cấp Vercel lên gói **Pro** ($20/tháng) để đấu nối tên miền chính thức và cấu hình SSL.
   * Nâng cấp Supabase lên gói **Pro** ($25/tháng) để ngăn chặn việc tự động khóa DB.
   * *Lưu ý:* Vẫn chưa cần mua gói Compute Dedicated $10 để tiết kiệm thêm.
3. **Trước ngày Khai trương nhà hàng 5 ngày (Go-live vận hành thực tế):**
   * Mua thêm gói **Supabase Compute Add-on ($10/tháng)** để đảm bảo phần cứng chạy mượt cho toàn bộ tablet sảnh và KDS bếp.
   * Kích hoạt tài khoản thương mại VNPAY/PAYOO và Cloud HSM của VNPT.
