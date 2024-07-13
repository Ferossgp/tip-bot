import 'dotenv/config'
import TelegramBot from "node-telegram-bot-api";

const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
  throw new Error('TELEGRAM_BOT_TOKEN must be provided!');
}

const bot = new TelegramBot(token, { polling: true });

bot.on("message", async (msg) => {
  if (!msg.text || msg.text.startsWith("/")) return;

  await bot
    .sendMessage(msg.chat.id, `pong`)
    .catch((error) => console.log(error));
});