import SQLite from "better-sqlite3";
import TelegramBot from "node-telegram-bot-api";

export interface KarmaResponse {
  userId: number;
  groupId: number;
  userName: string;
  firstName: string;
  tokenId: string;
  balance: number;
  givenToken: number;
  history: string;
}

export async function updateBalance(
  db: SQLite.Database,
  msg: TelegramBot.Message,
  incValue: number,
  token: string
) {
  try {
    const sender = msg.from;
    const receiver = msg.reply_to_message?.from;

    if (!sender || !receiver) {
      throw new Error("Sender or receiver information is missing.");
    }

    const updateUserKarma = db.prepare(`
        INSERT INTO Karma (userId, userName, firstName, tokenId, balance)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(userId, tokenId)
        DO UPDATE SET
         userName = excluded.userName,
          firstName = excluded.firstName,
          balance = balance - excluded.balance,
          givenToken = givenToken + excluded.balance
        RETURNING *
      `);

    const updateReceiverKarma = db.prepare(`
        INSERT INTO Karma (userId, userName, firstName, tokenId, balance, history)
        VALUES (?, ?, ?, ?, ?, ?)
        ON CONFLICT(userId, tokenId)
        DO UPDATE SET
        userName = excluded.userName,
          firstName = excluded.firstName,
          balance = balance + excluded.balance,
          history = json_insert(history, '$[' || json_array_length(history) || ']', 
          json('{"timestamp": ' || strftime('%s', 'now') || ',
           "balanceChange": ' || ? || ',
           "from": ' || ? || '
           }'))
        RETURNING *
      `);

    const historyUpdate = JSON.stringify([
      { timestamp: Date.now(), balanceChange: incValue },
    ]);

    const senderData = updateUserKarma.get(
      sender.id,
      sender.username,
      sender.first_name,
      token,
      incValue
    );

    const receiverData = updateReceiverKarma.get(
      receiver.id,
      receiver.username,
      receiver.first_name,
      token,
      incValue,
      historyUpdate,
      incValue,
      sender.id
    );

    return {
      respSender: senderData,
      respReceiver: receiverData,
    };
  } catch (error: unknown) {
    console.error(error);
  }
}

export const getUserKarma = async (
  db: SQLite.Database,
  userId: number
): Promise<KarmaResponse[] | undefined> => {
  try {
    const stmt = db.prepare(`
        SELECT *
        FROM Karma
        WHERE userId = ?
      `);

    const userKarma = stmt.all(userId) as KarmaResponse[] | undefined

    if (!userKarma) {
      return undefined;
    }

    return userKarma;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

export const claimKarma = async (
  db: SQLite.Database,
  userId: number,
  tokenId: string
): Promise<void> => {
  const stmt = db.prepare(`
        UPDATE Karma
        SET balance = 0
        WHERE userId = ? and tokenId = ?
      `);

  stmt.run(userId, tokenId);
}

export const getUserBalance = async (
  db: SQLite.Database,
  userId: number,
  tokenId: string
): Promise<KarmaResponse | null> => {
  try {
    const stmt = db.prepare(`
        SELECT *
        FROM Karma
        WHERE userId = ? and tokenId = ?
      `);

    const userKarma = stmt.get(userId, tokenId) as KarmaResponse | undefined;

    if (!userKarma) {
      return null;
    }

    return userKarma;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const insertUsers = async (
  db: SQLite.Database,
  msg: TelegramBot.Message,
  tokenId: string
): Promise<void> => {
  const sender = msg.from;
  const receiver = msg.reply_to_message?.from;

  if (!sender || !receiver) {
    throw new Error("Sender or receiver information is missing.");
  }

  const stmt = db.prepare(`
        INSERT INTO Karma (userId, tokenId, firstName, userName)
        VALUES (?, ?, ?, ?)
      `);
  stmt.run(sender.id, tokenId, sender.first_name, sender.username);
  stmt.run(receiver.id, tokenId, receiver.first_name, receiver.username);

  return;
};

export const getTop = async (
  db: SQLite.Database,
  token: string
): Promise<KarmaResponse[] | null> => {
  try {
    const sortOrder = "DESC";

    const stmt = db.prepare(`
        SELECT *
        FROM Karma
        WHERE tokenId = ?
        ORDER BY balance ${sortOrder}
        LIMIT 10
      `);

    const topKarmaUsers = stmt.all(token) as KarmaResponse[];

    return topKarmaUsers;
  } catch (error) {
    console.error(error);
    return null;
  }
};
