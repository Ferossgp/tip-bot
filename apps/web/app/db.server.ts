import { remember } from '@epic-web/remember'
import { getInstanceInfoSync } from './litefs.server'
import SQLite from 'better-sqlite3'

const DATABASE_PATH = process.env.DATABASE_PATH

function createDatabase() {
  const db = new SQLite(DATABASE_PATH)

  const { currentIsPrimary } = getInstanceInfoSync()
  if (!currentIsPrimary) return db

  try {
    // TODO: create tables
    db.exec(`PRAGMA journal_mode = WAL`)
    db.exec(`
			CREATE TABLE IF NOT EXISTS users (
				user_id TEXT PRIMARY KEY,
				world_id TEXT,
        verified BOOLEAN
			)
		`)
  } catch (error: unknown) {
    throw error
  }

  return db
}

export const db = remember('db', createDatabase)