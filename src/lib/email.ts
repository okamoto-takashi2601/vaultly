import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type SendUnlockEmailParams = {
  to: string[];
  capsuleTitle: string;
  capsuleId: string;
  authorName: string;
};

function unlockEmailHtml({
  capsuleTitle,
  capsuleUrl,
  authorName,
}: {
  capsuleTitle: string;
  capsuleUrl: string;
  authorName: string;
}) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#1a1b2e;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#1a1b2e;padding:40px 20px">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#22233a;border-radius:16px;overflow:hidden;border:1px solid rgba(255,255,255,0.08)">
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#22233a 0%,#1a1b2e 100%);padding:40px 40px 32px;text-align:center;border-bottom:1px solid rgba(217,183,110,0.2)">
            <div style="display:inline-flex;align-items:center;gap:10px;margin-bottom:16px">
              <div style="width:32px;height:32px;background:#d9b76e;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:16px">🔓</div>
              <span style="color:#f5f2eb;font-size:20px;font-weight:700;letter-spacing:-0.5px">Laterloom</span>
            </div>
            <div style="width:64px;height:64px;background:rgba(217,183,110,0.1);border:2px solid rgba(217,183,110,0.3);border-radius:50%;margin:0 auto 16px;display:flex;align-items:center;justify-content:center;font-size:28px;line-height:64px;text-align:center">🔓</div>
            <h1 style="margin:0;color:#f5f2eb;font-size:24px;font-weight:700;letter-spacing:-0.5px">A time capsule just opened</h1>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:32px 40px">
            <p style="margin:0 0 8px;color:#8b8aa0;font-size:14px">From</p>
            <p style="margin:0 0 24px;color:#f5f2eb;font-size:16px;font-weight:600">${authorName}</p>
            <p style="margin:0 0 8px;color:#8b8aa0;font-size:14px">Capsule</p>
            <p style="margin:0 0 32px;color:#f5f2eb;font-size:18px;font-weight:700">${capsuleTitle}</p>
            <p style="margin:0 0 24px;color:#8b8aa0;font-size:14px;line-height:1.6">
              The time has come. A memory sealed in the past is now ready for you to open.
            </p>
            <div style="text-align:center">
              <a href="${capsuleUrl}" style="display:inline-block;background:#d9b76e;color:#1a1b2e;font-size:15px;font-weight:700;padding:14px 32px;border-radius:10px;text-decoration:none;letter-spacing:-0.2px">Open your capsule →</a>
            </div>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="padding:24px 40px;border-top:1px solid rgba(255,255,255,0.06);text-align:center">
            <p style="margin:0;color:#8b8aa0;font-size:12px">Laterloom · Seal today. Open tomorrow.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function sendUnlockEmail({
  to,
  capsuleTitle,
  capsuleId,
  authorName,
}: SendUnlockEmailParams) {
  const capsuleUrl = `${process.env.NEXT_PUBLIC_APP_URL}/capsules/${capsuleId}`;

  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to,
    subject: `🔓 "${capsuleTitle}" has unlocked`,
    html: unlockEmailHtml({ capsuleTitle, capsuleUrl, authorName }),
  });

  if (error) throw new Error(`Resend error: ${error.message}`);
  return data;
}
