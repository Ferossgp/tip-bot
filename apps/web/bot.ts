import 'dotenv/config'
import TelegramBot from "node-telegram-bot-api";
import SQLite from 'better-sqlite3'
import {
  getInstanceInfoSync,
} from 'litefs-js'
import { remember } from '@epic-web/remember';

const token = process.env.TELEGRAM_BOT_TOKEN;
const DATABASE_PATH = process.env.DATABASE_PATH

function createDatabase() {
  const db = new SQLite(DATABASE_PATH)

  const { currentIsPrimary } = getInstanceInfoSync()
  if (!currentIsPrimary) return db

  try {
    // TODO: create tables
    db.exec(`
			CREATE TABLE IF NOT EXISTS test (
				key TEXT PRIMARY KEY,
				value TEXT
			)
		`)
  } catch (error: unknown) {
    throw error
  }

  return db
}

export const db = remember('db', createDatabase)

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