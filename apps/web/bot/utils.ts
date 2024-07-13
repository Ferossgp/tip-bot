import SQLite from "better-sqlite3";
import TelegramBot from "node-telegram-bot-api";

export interface KarmaResponse {
  userId: number;
  groupId: number;
  userName: string;
  firstName: string;
  givenApes: number;
  apesBalance: number;
  givenNouns: number;
  nounsBalance: number;
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

    const balance = token === "apes" ? "apesBalance" : "nounsBalance";
    const given = token === "apes" ? "givenApes" : "givenNouns";

    const updateUserKarma = db.prepare(`
        INSERT INTO Karma (userId, groupId, userName, firstName,  ${balance})
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(userId, groupId)
        DO UPDATE SET
          userName = excluded.userName,
          firstName = excluded.firstName,
          ${balance} = ${balance} - excluded.apesBalance,
          ${given} = ${given} + excluded.apesBalance
        RETURNING *
      `);

    const updateReceiverKarma = db.prepare(`
        INSERT INTO Karma (userId, groupId, userName, firstName, ${balance}, history)
        VALUES (?, ?, ?, ?, ?, ?)
        ON CONFLICT(userId, groupId)
        DO UPDATE SET
          userName = excluded.userName,
          firstName = excluded.firstName,
          ${balance} = ${balance} + excluded.apesBalance,
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
      msg.chat.id,
      sender.username,
      sender.first_name,
      incValue
    );

    const receiverData = updateReceiverKarma.get(
      receiver.id,
      msg.chat.id,
      receiver.username,
      receiver.first_name,
      incValue,
      historyUpdate,
      incValue,
      sender.id
    );

    console.log(receiverData);

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
  userId: number,
  groupId: number
): Promise<KarmaResponse | null> => {
  try {
    const stmt = db.prepare(`
        SELECT *
        FROM Karma
        WHERE userId = ? AND groupId = ?
      `);

    const userKarma: KarmaResponse | undefined = stmt.get(userId, groupId);

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
  msg: TelegramBot.Message
): Promise<void> => {
  const sender = msg.from;
  const receiver = msg.reply_to_message?.from;

  if (!sender || !receiver) {
    throw new Error("Sender or receiver information is missing.");
  }

  const stmt = db.prepare(`
        INSERT INTO Karma (userId, groupId, firstName, userName)
        VALUES (?, ?, ?, ?)
      `);
  stmt.run(sender.id, msg.chat.id, sender.first_name, sender.username);
  stmt.run(receiver.id, msg.chat.id, receiver.first_name, receiver.username);

  return;
};

export const getTopAPE = async (
  db: SQLite.Database,
  groupId: number,
  asc = false
): Promise<KarmaResponse[] | null> => {
  try {
    const sortOrder = asc ? "ASC" : "DESC";

    const stmt = db.prepare(`
      SELECT *
      FROM Karma
      WHERE groupId = ?
      ORDER BY apesBalance ${sortOrder}
      LIMIT 10
    `);

    const topKarmaUsers: KarmaResponse[] = stmt.all(groupId);

    return topKarmaUsers;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getTopNouns = async (
  db: SQLite.Database,
  groupId: number,
  asc = false
): Promise<KarmaResponse[] | null> => {
  try {
    const sortOrder = asc ? "ASC" : "DESC";

    const stmt = db.prepare(`
        SELECT *
        FROM Karma
        WHERE groupId = ?
        ORDER BY nounsBalance ${sortOrder}
        LIMIT 10
      `);

    const topKarmaUsers: KarmaResponse[] = stmt.all(groupId);

    return topKarmaUsers;
  } catch (error) {
    console.error(error);
    return null;
  }
};
