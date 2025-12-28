import * as SQLite from 'expo-sqlite';

export const DATABASE_NAME = 'simplenotes.db';

export async function migrateDbIfNeeded(db: SQLite.SQLiteDatabase) {
    const DATABASE_VERSION = 1;
    // await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`); // Basic versioning handling could be added

    await db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;
    
    CREATE TABLE IF NOT EXISTS folders (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT UNIQUE NOT NULL,
      idx INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS notes (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT,
      content TEXT,
      folder_id TEXT,
      color_hex TEXT,
      is_pinned INTEGER DEFAULT 0,
      is_archived INTEGER DEFAULT 0,
      is_locked INTEGER DEFAULT 0,
      is_deleted INTEGER DEFAULT 0,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      FOREIGN KEY (folder_id) REFERENCES folders (id)
    );

    CREATE TABLE IF NOT EXISTS tags (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT UNIQUE NOT NULL,
      color_hex TEXT
    );
    
    CREATE TABLE IF NOT EXISTS note_tags (
      note_id TEXT NOT NULL,
      tag_id TEXT NOT NULL,
      PRIMARY KEY (note_id, tag_id),
      FOREIGN KEY (note_id) REFERENCES notes (id) ON DELETE CASCADE,
      FOREIGN KEY (tag_id) REFERENCES tags (id) ON DELETE CASCADE
    );
  `);

    // Seed default folders
    const result = await db.getAllAsync('SELECT count(*) as count FROM folders');
    if (result[0] && (result[0] as any).count === 0) {
        await db.runAsync('INSERT INTO folders (id, name, idx) VALUES(?, ?, ?)', 'work', 'Work', 0);
        await db.runAsync('INSERT INTO folders (id, name, idx) VALUES(?, ?, ?)', 'personal', 'Personal', 1);
        await db.runAsync('INSERT INTO folders (id, name, idx) VALUES(?, ?, ?)', 'ideas', 'Ideas', 2);
    }
}
