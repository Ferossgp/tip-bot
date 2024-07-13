/* eslint-disable no-useless-catch */
import "dotenv/config";
import TelegramBot, { Message } from "node-telegram-bot-api";
import SQLite from "better-sqlite3";
import { getInstanceInfoSync } from "litefs-js";
import { remember } from "@epic-web/remember";
import {
  getTopAPE,
  getTopNouns,
  getUserKarma,
  insertUsers,
  updateBalance,
} from "./bot/utils";

const token = process.env.TELEGRAM_BOT_TOKEN;
const DATABASE_PATH = process.env.DATABASE_PATH;
const DEFAULT_BALANCE = 5;

function createDatabase() {
  const db = new SQLite(DATABASE_PATH);

  const { currentIsPrimary } = getInstanceInfoSync();
  if (!currentIsPrimary) return db;

  try {
    // TODO: create tables
    db.exec(`
			CREATE TABLE IF NOT EXISTS test (
				key TEXT PRIMARY KEY,
				value TEXT
			)
		`);
  } catch (error: unknown) {
    throw error;
  }

  db.exec(`
    CREATE TABLE IF NOT EXISTS Karma (
  userId INTEGER,
  userName TEXT,
  firstName TEXT,
  groupId INTEGER,
  givenApes INTEGER DEFAULT 0,
  apesBalance INTEGER DEFAULT ${DEFAULT_BALANCE},
  givenNouns INTEGER DEFAULT 0,
  nounsBalance INTEGER DEFAULT ${DEFAULT_BALANCE},
  history TEXT DEFAULT '[]',
  UNIQUE(userId, groupId)
);
    `);

  return db;
}

export const db = remember("db", createDatabase);

if (!token) {
  throw new Error("TELEGRAM_BOT_TOKEN must be provided!");
}

const bot = new TelegramBot(token, { polling: true });

bot.on("message", async (msg) => {
  if (!msg.text || msg.text.startsWith("/")) return;

  if (msg.reply_to_message && msg.text.includes("$")) {
    if (msg.reply_to_message?.from?.id === msg.from?.id) return;

    const text = msg.text.toLowerCase();
    const apesToken = text.match(/\$ape/i)?.[0];
    const nounsToken = text.match(/\$nouns/i)?.[0];
    const amount = Number(text.match(/\d+/)?.[0]);
    const token = apesToken ? "apes" : "nouns";

    if ((apesToken && amount) || (nounsToken && amount)) {
      const sender = await getUserKarma(db, msg.from?.id, msg.chat.id);
      if (sender === null) await insertUsers(db, msg);

      if (
        (sender && token === "apes" && sender?.apesBalance < amount) ||
        (sender === null && DEFAULT_BALANCE < amount)
      ) {
        bot
          .sendMessage(
            msg.chat.id,
            `You don't have enough $APE to give ${amount} to ${msg?.reply_to_message?.from?.first_name}`
          )
          .catch(console.log);
        return;
      }

      if (
        (sender && token === "nouns" && sender?.nounsBalance < amount) ||
        (sender === null && DEFAULT_BALANCE < amount)
      ) {
        bot
          .sendMessage(
            msg.chat.id,
            `You don't have enough $NOUNS to give ${amount} to ${msg?.reply_to_message?.from?.first_name}`
          )
          .catch(console.log);
        return;
      }

      // Update the user's karma score
      const resp = await updateBalance(db, msg, amount, token);
      if (!resp) return;

      if (apesToken) {
        return bot
          .sendMessage(
            msg.chat.id,
            `${msg?.reply_to_message?.from?.first_name} has now ${resp?.respReceiver?.apesBalance} of $APE`
          )
          .catch(console.log);
      }

      if (nounsToken) {
        return bot
          .sendMessage(
            msg.chat.id,
            `${msg?.reply_to_message?.from?.first_name} has now ${resp?.respReceiver?.nounsBalance} of $NOUNS`
          )
          .catch(console.log);
      }
    }
  }
});

bot.onText(/^\/me/, async (msg) => {
  try {
    // Find the karma document for the user in the current group
    // const karma = await Karma.findOne({ userId: msg.from.id, groupId: msg.chat.id });

    if (!msg.from?.id) {
      bot.sendMessage(msg.chat.id, "Your balance is 0").catch(console.log);
      return;
    }

    const karma = await getUserKarma(db, msg.from?.id, msg.chat.id);

    if (!karma) {
      bot.sendMessage(msg.chat.id, "Your balance is 0").catch(console.log);
      return;
    }

    // Send a message with the user's karma score
    bot
      .sendMessage(
        msg.chat.id,
        `Hi ${
          msg?.from?.username ? `@${msg.from.username}` : msg?.from?.first_name
        } your balance is:

🐒 $APE: ${karma.apesBalance}
🐒 Given $APE: ${karma.givenApes}

🦄 $NOUNS: ${karma.nounsBalance}
🦄 Given $NOUNS: ${karma.givenNouns}
`
      )
      .catch(console.log);
  } catch (error) {
    console.log(error);
  }
});

bot.onText(/^\/topApes/, async (msg) => {
  // Get the top 10 users with the most karma in the current group
  const topKarmaUsers = await getTopAPE(db, msg.chat.id);
  if (!topKarmaUsers) return;

  let message = "Top 10 $APE users:\n";

  // Construct a message with the top karma users and their scores
  topKarmaUsers.forEach((user, index) => {
    message += `${index + 1}. ${user.firstName || user.userName} has ${
      user.apesBalance
    } of $APE\n`;
  });

  // Send the message with the top karma users
  bot.sendMessage(msg.chat.id, message).catch((error) => console.log(error));
});

bot.onText(/^\/topNouns/, async (msg) => {
  // Get the top 10 users with the most karma in the current group
  const topKarmaUsers = await getTopNouns(db, msg.chat.id);
  if (!topKarmaUsers) return;

  let message = "Top 10 $APE users:\n";

  // Construct a message with the top karma users and their scores
  topKarmaUsers.forEach((user, index) => {
    message += `${index + 1}. ${user.firstName || user.userName} has ${
      user.apesBalance
    } of $NOUNS\n`;
  });

  // Send the message with the top karma users
  bot.sendMessage(msg.chat.id, message).catch((error) => console.log(error));
});
