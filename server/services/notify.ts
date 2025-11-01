// SHIELD v10.0 - Notification service
import axios from 'axios';

export async function sendAlert(msg: string) {
  if (!process.env.WEBHOOK_URL) {
    console.log(`📢 Alert: ${msg}`);
    return;
  }

  try {
    await axios.post(process.env.WEBHOOK_URL, { text: msg }, { timeout: 5000 });
  } catch (error) {
    console.error('Failed to send webhook notification:', error);
  }
}

export async function sendSlackAlert(text: string) {
  return sendAlert(`🔔 Synrgy Alert: ${text}`);
}

export async function sendDiscordAlert(text: string) {
  return sendAlert(`🔔 Synrgy Alert: ${text}`);
}
