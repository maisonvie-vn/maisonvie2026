import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Create transporter from env
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "465"),
  secure: process.env.SMTP_SECURE !== "false", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Helper for neoclassical gold & dark email template
const getEmailHtml = ({ type, lang = "vi", data }) => {
  const isPending = type === "booking_pending";
  const isConfirmed = type === "booking_confirmed";
  const isCancelled = type === "booking_cancelled";

  // Multi-lingual content dictionaries
  const content = {
    vi: {
      title: isPending ? "Đang Sắp Xếp Sơ Đồ Bàn Ăn" : isConfirmed ? "Xác Nhận Đặt Bàn Thành Công" : "Thông Báo Hủy Đặt Bàn",
      salutation: `Kính gửi Quý khách ${data.guestName},`,
      intro: isPending 
        ? "Maison Vie đã tiếp nhận yêu cầu đặt bàn của quý khách. Đội ngũ lễ tân đang sắp xếp sơ đồ 250 chỗ ngồi tối ưu nhất."
        : isConfirmed
        ? "Maison Vie hân hạnh xác nhận đặt bàn của quý khách đã được phê duyệt chính thức."
        : "Maison Vie rất tiếc phải thông báo rằng chúng tôi chưa thể tiếp nhận yêu cầu đặt bàn của quý khách vào thời gian này do nhà hàng đã kín chỗ.",
      detailsHeader: "Chi Tiết Đặt Bàn của Quý Khách",
      fields: {
        name: "Họ Tên",
        phone: "Số Điện Thoại",
        guests: "Số Lượng Khách",
        datetime: "Ngày & Giờ",
        notes: "Ghi Chú / Dị Ứng",
        status: "Trạng Thái"
      },
      statusText: isPending ? "Chờ duyệt (Đang xếp bàn)" : isConfirmed ? "Đã xác nhận" : "Đã hủy",
      noteDisclaimer: "Lưu ý: Theo Nghị định 13/2023/NĐ-CP, mọi dữ liệu sức khỏe và dị ứng của quý khách sẽ được mã hóa an toàn ở tầng cơ sở dữ liệu.",
      chefdialogue: "“Maison Vie là hành trình kết nối tinh hoa ẩm thực Pháp cổ điển và những nguyên liệu terroir Việt Nam đặc sắc nhất. Chúng tôi mong chờ được phục vụ quý khách.”",
      signature: "Ban Quản Trị Nhà Hàng Maison Vie",
      contactUs: "Nếu cần thay đổi thông tin đặt bàn, vui lòng liên hệ hotline hoặc gửi email trực tiếp."
    },
    en: {
      title: isPending ? "Arranging Table Seating Map" : isConfirmed ? "Reservation Officially Confirmed" : "Reservation Cancellation Notice",
      salutation: `Dear Guest ${data.guestName},`,
      intro: isPending 
        ? "Maison Vie has received your table request. Our reception team is currently arranging the optimal seating map."
        : isConfirmed
        ? "Maison Vie is delighted to confirm that your table reservation has been officially approved."
        : "Maison Vie regrets to inform you that we are unable to accept your table reservation request at this time due to full capacity.",
      detailsHeader: "Your Reservation Details",
      fields: {
        name: "Full Name",
        phone: "Phone Number",
        guests: "Guest Count",
        datetime: "Date & Time",
        notes: "Notes / Allergens",
        status: "Status"
      },
      statusText: isPending ? "Pending (Arranging seats)" : isConfirmed ? "Confirmed" : "Cancelled",
      noteDisclaimer: "Note: In accordance with Decree 13/2023/ND-CP, all health and allergen preference records are safely encrypted in our database.",
      chefdialogue: "“Maison Vie is a culinary voyage connecting the finest classic French cuisine with extraordinary Vietnamese terroir ingredients. We look forward to welcoming you.”",
      signature: "Maison Vie Management Team",
      contactUs: "If you need to amend your reservation details, please contact our hotline or reply directly."
    },
    fr: {
      title: isPending ? "Placement en Cours" : isConfirmed ? "Réservation Officiellement Confirmée" : "Avis d'Annulation de Réservation",
      salutation: `Cher(e) Client(e) ${data.guestName},`,
      intro: isPending 
        ? "Maison Vie a bien reçu votre demande de table. Notre équipe d'accueil organise actuellement le plan de table optimal."
        : isConfirmed
        ? "Maison Vie a le plaisir de confirmer que votre réservation de table a été officiellement approuvée."
        : "Maison Vie a le regret de vous informer que nous ne pouvons pas accepter votre demande de réservation pour le moment en raison d'une capacité maximale atteinte.",
      detailsHeader: "Détails de Votre Réservation",
      fields: {
        name: "Nom Complet",
        phone: "Téléphone",
        guests: "Nombre d'Invités",
        datetime: "Date & Heure",
        notes: "Notes / Allergies",
        status: "Statut"
      },
      statusText: isPending ? "En attente (Placement)" : isConfirmed ? "Confirmée" : "Annulée",
      noteDisclaimer: "Remarque: Conformément au décret 13/2023/ND-CP, toutes vos données de santé et d'allergies sont cryptées de manière sécurisée.",
      chefdialogue: "“Maison Vie est un voyage culinaire mariant la grande cuisine française classique aux exceptionnels ingrédients du terroir vietnamien. Nous avons hâte de vous recevoir.”",
      signature: "La Direction de Maison Vie",
      contactUs: "Si vous devez modifier vos informations, veuillez contacter notre hotline ou répondre à cet e-mail."
    },
    ja: {
      title: isPending ? "お席の配席調整中" : isConfirmed ? "ご予約正式確定のご案内" : "ご予約キャンセルのお知らせ",
      salutation: `${data.guestName} 様`,
      intro: isPending 
        ? "メゾン・ヴィ（Maison Vie）はお客様のご予約リクエストを受け付けました。レセプションチームが最適なお席の割り当てを行っております。"
        : isConfirmed
        ? "メゾン・ヴィは、お客様のお席のご予約が正式に承認されたことを喜んでお知らせいたします。"
        : "メゾン・ヴィは、現在満席のため、誠に残念ながら今回のご予約リクエストをお受けすることができませんでした。",
      detailsHeader: "ご予約詳細",
      fields: {
        name: "お名前",
        phone: "電話番号",
        guests: "ご利用人数",
        datetime: "日時",
        notes: "ご要望・アレルギー",
        status: "ステータス"
      },
      statusText: isPending ? "保留中（配席中）" : isConfirmed ? "確定済み" : "キャンセル",
      noteDisclaimer: "注意：ベトナム政府政令第13/2023/ND-CP号に基づき、お客様のアレルギー健康データはデータベース層で安全に暗号化されて保護されています。",
      chefdialogue: "「メゾン・ヴィは、伝統的なフランス料理の真髄とベトナムの優れたテロワール素材を融合させる美食の旅です。皆様のお越しを心よりお待ちしております。」",
      signature: "メゾン・ヴィ レストラン経営陣一同",
      contactUs: "ご予約内容の変更がございましたら、ホットラインまたは本メールへ直接ご返信ください。"
    },
    ko: {
      title: isPending ? "예약 대기 및 좌석 배정 중" : isConfirmed ? "예약 공식 확정 안내" : "예약 취소 안내",
      salutation: `${data.guestName} 고객님께,`,
      intro: isPending 
        ? "메종 비(Maison Vie)에서 고객님의 예약 요청을 접수하였습니다. 리셉션 팀에서 최적의 테이블 배정을 진행 중입니다."
        : isConfirmed
        ? "메종 비는 고객님의 테이블 예약이 공식적으로 확정되었음을 기쁘게 안내해 드립니다."
        : "메종 비는 현재 만석인 관계로 아쉽게도 이번 예약 요청을 수락해 드리지 못하게 되었음을 안내해 드립니다.",
      detailsHeader: "예약 상세 내역",
      fields: {
        name: "성함",
        phone: "전화번호",
        guests: "인원수",
        datetime: "날짜 및 시간",
        notes: "요청사항 / 알레르기",
        status: "상태"
      },
      statusText: isPending ? "대기 중 (좌석 배치 중)" : isConfirmed ? "확정됨" : "취소됨",
      noteDisclaimer: "참고: 베트남 법령 제13/2023/ND-CP호에 의거하여, 고객님의 알레르기 건강 데이터는 데이터베이스상에서 안전하게 암호화되어 관리됩니다.",
      chefdialogue: "“메종 비는 정통 프랑스 요리의 정수와 베토남의 독특한 테루아 식재료를 결합한 미식 여행입니다. 기쁜 마음으로 모시겠습니다.”",
      signature: "메종 비 레스트랑 운영팀 일동",
      contactUs: "예약 정보 변경을 원하실 경우, 핫라인으로 연락해 주시거나 본 이메일에 회신해 주시기 바랍니다."
    }
  };

  const currentContent = content[lang] || content.vi;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Maison Vie - ${currentContent.title}</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          background-color: #0B0B0B;
          color: #E5E5E5;
          font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          -webkit-font-smoothing: antialiased;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #121212;
          border: 1px solid #222222;
        }
        .header {
          padding: 40px 20px;
          text-align: center;
          background-color: #0B0B0B;
          border-bottom: 1px solid #1C1C1C;
        }
        .logo {
          font-size: 26px;
          font-family: 'Cormorant Garamond', 'Georgia', serif;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #A8884E;
          font-weight: 300;
          margin: 0;
        }
        .subtitle {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.25em;
          color: #888888;
          margin-top: 5px;
        }
        .content {
          padding: 40px 30px;
        }
        .title {
          font-size: 20px;
          font-family: 'Cormorant Garamond', 'Georgia', serif;
          color: #A8884E;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin-top: 0;
          margin-bottom: 25px;
          border-bottom: 1px solid rgba(168, 136, 78, 0.2);
          padding-bottom: 10px;
        }
        .salutation {
          font-size: 15px;
          font-weight: 500;
          color: #FFFFFF;
          margin-bottom: 15px;
        }
        .intro {
          font-size: 13px;
          line-height: 1.6;
          color: #B5B5B5;
          font-weight: 300;
          margin-bottom: 30px;
        }
        .table-details {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
          background-color: #0B0B0B;
          border: 1px solid #1C1C1C;
        }
        .table-details th, .table-details td {
          padding: 12px 15px;
          text-align: left;
          font-size: 12px;
          border-bottom: 1px solid #1C1C1C;
        }
        .table-details th {
          color: #888888;
          font-weight: 400;
          text-transform: uppercase;
          width: 35%;
        }
        .table-details td {
          color: #E5E5E5;
          font-weight: 500;
        }
        .badge {
          display: inline-block;
          padding: 2px 8px;
          font-size: 10px;
          font-weight: bold;
          text-transform: uppercase;
          border-radius: 2px;
          letter-spacing: 0.05em;
        }
        .badge-pending {
          background-color: rgba(245, 158, 11, 0.15);
          color: #F59E0B;
          border: 1px solid rgba(245, 158, 11, 0.3);
        }
        .badge-confirmed {
          background-color: rgba(16, 185, 129, 0.15);
          color: #10B981;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }
        .badge-cancelled {
          background-color: rgba(239, 68, 68, 0.15);
          color: #EF4444;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }
        .disclaimer {
          font-size: 10px;
          color: #555555;
          line-height: 1.5;
          margin-bottom: 30px;
        }
        .chef-box {
          border-left: 2px solid #A8884E;
          padding: 15px;
          margin-bottom: 30px;
          background-color: rgba(168, 136, 78, 0.03);
        }
        .chef-quote {
          font-size: 12px;
          font-style: italic;
          line-height: 1.6;
          color: #A8884E;
          margin: 0;
        }
        .signature-box {
          font-size: 12px;
          color: #888888;
          margin-top: 40px;
        }
        .footer {
          padding: 30px 20px;
          background-color: #0B0B0B;
          border-top: 1px solid #1C1C1C;
          text-align: center;
          font-size: 11px;
          color: #555555;
          line-height: 1.8;
        }
        .footer a {
          color: #A8884E;
          text-decoration: none;
        }
        .button {
          display: inline-block;
          padding: 12px 24px;
          background-color: #A8884E;
          color: #0B0B0B !important;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-size: 11px;
          font-weight: bold;
          text-decoration: none;
          margin-bottom: 30px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 class="logo">Maison Vie</h1>
          <div class="subtitle">Cuisine Française Classique</div>
        </div>
        <div class="content">
          <h2 class="title">${currentContent.title}</h2>
          <div class="salutation">${currentContent.salutation}</div>
          <p class="intro">${currentContent.intro}</p>

          <table class="table-details">
            <tr>
              <th>${currentContent.fields.name}</th>
              <td>${data.guestName}</td>
            </tr>
            <tr>
              <th>${currentContent.fields.phone}</th>
              <td>${data.guestPhone}</td>
            </tr>
            <tr>
              <th>${currentContent.fields.guests}</th>
              <td>${data.guestCount} khách</td>
            </tr>
            <tr>
              <th>${currentContent.fields.datetime}</th>
              <td>${data.bookingDate} @ ${data.bookingTime}</td>
            </tr>
            ${data.notes ? `
            <tr>
              <th>${currentContent.fields.notes}</th>
              <td>${data.notes}</td>
            </tr>` : ""}
            <tr>
              <th>${currentContent.fields.status}</th>
              <td>
                <span class="badge badge-${type.split("_")[1]}">
                  ${currentContent.statusText}
                </span>
              </td>
            </tr>
          </table>

          <div class="chef-box">
            <p class="chef-quote">${currentContent.chefdialogue}</p>
          </div>

          <div class="disclaimer">
            ${currentContent.noteDisclaimer}
          </div>

          <div class="signature-box">
            <p>${currentContent.signature}<br><strong>Maison Vie Hanoi</strong></p>
          </div>
        </div>
        <div class="footer">
          <p>Maison Vie Restaurant - Cuisine Française · Terroir Vietnamien</p>
          <p>Địa chỉ: Hà Nội, Việt Nam | Hotline: (+84) 24 3933 8888</p>
          <p>Tên miền chính thức: <a href="https://maisonvie.vn">maisonvie.vn</a> | Cổng dịch vụ: <a href="https://mv.maisonvie.vn">mv.maisonvie.vn</a></p>
          <p>Email hỗ trợ: <a href="mailto:info@maisonvie.vn">info@maisonvie.vn</a></p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Route POST /api/send-email
export async function POST(request) {
  try {
    const body = await request.json();
    const { to, subject, type, lang, data } = body;

    if (!to || !type || !data) {
      return NextResponse.json(
        { error: "Missing required parameters (to, type, data)" },
        { status: 400 }
      );
    }

    const htmlContent = getEmailHtml({ type, lang, data });

    // Send Mail Options
    const mailOptions = {
      from: process.env.EMAIL_FROM || `"Maison Vie" <info@maisonvie.vn>`,
      to,
      subject: subject || `Maison Vie - Booking Notification`,
      html: htmlContent,
    };

    // Dispatch Email Async
    const info = await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      messageId: info.messageId,
      msg: "✓ Email sent successfully via Google Workspace SMTP",
    });
  } catch (error) {
    console.error("SMTP Direct Mailer Error:", error);
    return NextResponse.json(
      { error: "Failed to dispatch email", details: error.message },
      { status: 500 }
    );
  }
}
