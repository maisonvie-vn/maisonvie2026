import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'info@maisonvie.vn',
    pass: 'zfezqifvmbolcquq',
  },
});

const now = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });

const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:Georgia,serif;background:#0B0B0B;color:#E5E5E5;padding:40px;margin:0">
  <div style="max-width:500px;margin:0 auto;background:#121212;border:1px solid #222;padding:40px">
    <h1 style="color:#A8884E;letter-spacing:.15em;font-size:22px;font-weight:300">MAISON VIE</h1>
    <p style="color:#888;font-size:10px;text-transform:uppercase;letter-spacing:.2em">Test Email — SMTP Verification</p>
    <hr style="border:none;border-top:1px solid #222;margin:20px 0">
    <p style="color:#E5E5E5">Email tu dong tu he thong dat ban da hoat dong binh thuong.</p>
    <p style="color:#888;font-size:13px">App Password duoc thiet lap thanh cong luc: ${now}</p>
    <p style="color:#555;font-size:11px">Email nay duoc gui tu dong de xac nhan cau hinh SMTP Google Workspace.</p>
  </div>
</body>
</html>`;

try {
  const info = await transporter.sendMail({
    from: '"Maison Vie Restaurant" <info@maisonvie.vn>',
    to: 'info@maisonvie.vn',
    subject: '[TEST] Maison Vie — He thong email da hoat dong',
    html,
  });
  console.log('SENT OK — MessageId:', info.messageId);
  console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
} catch (err) {
  console.log('SEND FAIL:', err.message);
}
