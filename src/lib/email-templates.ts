export function getSubscriptionWelcomeTemplate(name?: string, siteUrl: string = "https://ixraellee.com"): string {
  const recipientName = name && name.trim() ? name.trim() : "Reader";
  const displayDomain = siteUrl.replace(/^https?:\/\//, "");

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Welcome to Ixraellee Journal</title>
    <link rel="preconnect" href="https://fonts.googleapis.com"/>
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin=""/>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet"/>
    <style>
      body {
        margin: 0;
        padding: 0;
        background-color: #050505;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        color: #f1f5f9;
        -webkit-font-smoothing: antialiased;
      }
      .wrapper {
        width: 100%;
        background-color: #050505;
        padding: 40px 16px;
        box-sizing: border-box;
      }
      .container {
        max-width: 580px;
        margin: 0 auto;
        background-color: #0b0f18;
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
      }
      .header-gradient {
        background: linear-gradient(135deg, #0088CC 0%, #005588 100%);
        height: 6px;
      }
      .content {
        padding: 40px 36px;
      }
      .brand-badge {
        display: inline-block;
        padding: 6px 14px;
        background-color: rgba(0, 136, 204, 0.15);
        border: 1px solid rgba(0, 136, 204, 0.4);
        border-radius: 9999px;
        color: #00a2ff;
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        margin-bottom: 24px;
      }
      h1 {
        font-size: 26px;
        font-weight: 800;
        line-height: 1.25;
        color: #ffffff;
        margin: 0 0 16px 0;
        letter-spacing: -0.02em;
      }
      p {
        font-size: 15px;
        line-height: 1.65;
        color: #94a3b8;
        margin: 0 0 20px 0;
      }
      .highlight-box {
        background-color: rgba(255, 255, 255, 0.03);
        border-left: 3px solid #0088CC;
        padding: 16px 20px;
        border-radius: 0 8px 8px 0;
        margin: 28px 0;
      }
      .highlight-box p {
        color: #cbd5e1;
        font-size: 14px;
        font-style: italic;
        margin: 0;
      }
      .button-container {
        margin: 32px 0 28px 0;
      }
      .btn {
        display: inline-block;
        background-color: #0088CC;
        color: #ffffff !important;
        font-weight: 700;
        font-size: 14px;
        padding: 14px 28px;
        border-radius: 8px;
        text-decoration: none;
        box-shadow: 0 4px 14px rgba(0, 136, 204, 0.4);
      }
      .footer {
        border-top: 1px solid rgba(255, 255, 255, 0.08);
        padding: 24px 36px;
        background-color: #070a11;
        text-align: center;
      }
      .footer p {
        font-size: 12px;
        color: #64748b;
        margin: 0 0 8px 0;
      }
      .footer a {
        color: #0088CC;
        text-decoration: none;
      }
    </style>
  </head>
  <body>
    <div class="wrapper">
      <div class="container">
        <div class="header-gradient"></div>
        <div class="content">
          <div class="brand-badge">Ixraellee Journal</div>
          <h1>Welcome to the Community 🎉</h1>
          <p>Hi <strong>${recipientName}</strong>,</p>
          <p>Thank you for subscribing to <strong>Ixraellee Journal</strong>. You are now officially connected to receive early access to new stories, essays, field notes, and digital initiatives.</p>

          <div class="highlight-box">
            <p>&ldquo;Stories from the life we live, the work we build, and the ideas that keep moving.&rdquo;</p>
          </div>

          <p>You will be notified whenever a new story is published or when special broadcasts are released. No spam, ever.</p>

          <div class="button-container">
            <a href="${siteUrl}" class="btn">Explore Ixraellee Journal &rarr;</a>
          </div>

          <p style="margin-bottom: 0; font-size: 14px; color: #64748b;">Warm regards,<br/><strong style="color: #cbd5e1;">Ixrael Lee</strong></p>
        </div>

        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Ixraellee Journal. All rights reserved.</p>
          <p>You received this because you subscribed on <a href="${siteUrl}">${displayDomain}</a>.</p>
        </div>
      </div>
    </div>
  </body>
</html>`;
}
