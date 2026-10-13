import nodemailer, { type Transporter } from "nodemailer";

const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
const smtpPort = parseInt(process.env.SMTP_PORT || "587", 10);
const smtpUser = process.env.SMTP_USER || "founder@ztoitech.com";
const smtpPass = process.env.SMTP_PASS || "hdtamaqpmfwhyghg";

let transporter: Transporter | null = null;

export function getMailTransporter(): Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });
  }
  return transporter;
}

export async function sendSubscriptionWelcomeEmail(toEmail: string) {
  const mailer = getMailTransporter();

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Blickwinkle</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
    }
    .wrapper {
      width: 100%;
      background-color: #f8fafc;
      padding: 30px 15px;
    }
    .container {
      max-width: 580px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0,0,0,0.06);
      border: 1px solid #e2e8f0;
    }
    .header {
      background: linear-gradient(135deg, #0071BC 0%, #005691 50%, #39B54A 100%);
      padding: 36px 30px;
      text-align: center;
      color: #ffffff;
    }
    .logo-badge {
      display: inline-block;
      font-size: 22px;
      font-weight: 900;
      letter-spacing: -0.5px;
      color: #ffffff;
      text-transform: uppercase;
      margin-bottom: 6px;
    }
    .header-sub {
      font-size: 13px;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: #bbf7d0;
      font-weight: 700;
      margin: 0;
    }
    .content {
      padding: 36px 32px;
    }
    h1 {
      font-size: 22px;
      font-weight: 800;
      color: #0f172a;
      margin-top: 0;
      margin-bottom: 16px;
    }
    p {
      font-size: 15px;
      line-height: 1.6;
      color: #475569;
      margin-top: 0;
      margin-bottom: 16px;
    }
    .highlight-box {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-radius: 14px;
      padding: 18px 20px;
      margin: 24px 0;
    }
    .highlight-box h3 {
      margin: 0 0 10px 0;
      font-size: 15px;
      font-weight: 700;
      color: #166534;
    }
    .highlight-list {
      margin: 0;
      padding-left: 18px;
      font-size: 13.5px;
      color: #15803d;
      line-height: 1.6;
    }
    .btn-container {
      text-align: center;
      margin: 30px 0 16px;
    }
    .btn {
      display: inline-block;
      padding: 14px 32px;
      background: linear-gradient(135deg, #0071BC 0%, #39B54A 100%);
      color: #ffffff !important;
      text-decoration: none;
      font-size: 14px;
      font-weight: 700;
      border-radius: 9999px;
      box-shadow: 0 4px 14px rgba(0, 113, 188, 0.35);
    }
    .footer {
      background: #0f172a;
      padding: 24px 30px;
      text-align: center;
      color: #94a3b8;
      font-size: 12px;
      line-height: 1.6;
    }
    .footer a {
      color: #38bdf8;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <div class="logo-badge">BLICKWINKLE</div>
        <div class="header-sub">Digital Innovation &amp; Learning</div>
      </div>
      <div class="content">
        <h1>You're Subscribed! 🎉</h1>
        <p>Hello,</p>
        <p>
          Thank you for joining the <strong>Blickwinkle</strong> mailing list. We are thrilled to welcome you to our community of digital entrepreneurs, innovators, and career builders.
        </p>
        <p>
          You will now receive our hand-crafted updates delivered directly to <strong>${toEmail}</strong>:
        </p>

        <div class="highlight-box">
          <h3>What to expect in your inbox:</h3>
          <ul class="highlight-list">
            <li><strong>Weekly Digital Growth Blueprints:</strong> SEO strategies, paid ad tips &amp; content virality hacks.</li>
            <li><strong>Engineering &amp; AI Breakthroughs:</strong> Custom software, automation architectures, and tech trends.</li>
            <li><strong>Career Masterclasses &amp; Discounts:</strong> First-access discounts on IELTS, PTE, Medical Coding, and placement programs.</li>
            <li><strong>Zero spam policy:</strong> Only high-value insights, unsubscribe anytime with one click.</li>
          </ul>
        </div>

        <div class="btn-container">
          <a href="https://blickwinkle.com" class="btn" target="_blank">Explore Blickwinkle</a>
        </div>

        <p style="font-size: 13px; color: #64748b; text-align: center; margin-bottom: 0;">
          Have questions or want to partner with us? Simply reply directly to this email.
        </p>
      </div>

      <div class="footer">
        <p style="margin: 0 0 6px 0; color: #cbd5e1; font-weight: 600;">Blickwinkle Digital Innovation &amp; Academy</p>
        <p style="margin: 0 0 10px 0;">Chennai, Tamil Nadu, India</p>
        <p style="margin: 0; font-size: 11px; color: #64748b;">
          &copy; ${new Date().getFullYear()} Blickwinkle. All rights reserved. You received this email because you subscribed on our website.
        </p>
      </div>
    </div>
  </div>
</body>
</html>
  `;

  return await mailer.sendMail({
    from: `"Blickwinkle" <${smtpUser}>`,
    to: toEmail,
    subject: "🎉 Welcome to Blickwinkle! You're Subscribed",
    html,
  });
}

export async function sendBroadcastMail({
  recipients,
  subject,
  message,
}: {
  recipients: string[];
  subject: string;
  message: string;
}) {
  const mailer = getMailTransporter();

  const formattedHtml = `
<!DOCTYPE html>
<html>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; padding: 25px; margin: 0; color: #0f172a;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden;">
    <div style="background: linear-gradient(135deg, #0071BC, #39B54A); padding: 25px; text-align: center; color: white;">
      <h2 style="margin: 0; font-size: 20px; font-weight: 800; letter-spacing: 1px;">BLICKWINKLE</h2>
      <p style="margin: 4px 0 0; font-size: 12px; color: #bbf7d0; text-transform: uppercase;">Announcement</p>
    </div>
    <div style="padding: 30px; font-size: 15px; line-height: 1.7; color: #334155;">
      ${message.replace(/\n/g, "<br/>")}
    </div>
    <div style="background: #f1f5f9; padding: 18px; text-align: center; font-size: 11px; color: #64748b;">
      Sent from Blickwinkle Admin Panel &bull; Chennai, India
    </div>
  </div>
</body>
</html>
  `;

  // Send individually or BCC to maintain recipient privacy
  const promises = recipients.map((email) =>
    mailer.sendMail({
      from: `"Blickwinkle" <${smtpUser}>`,
      to: email,
      subject,
      html: formattedHtml,
    })
  );

  return Promise.allSettled(promises);
}
