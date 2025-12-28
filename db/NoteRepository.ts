import { SQLiteDatabase } from 'expo-sqlite';

export type Note = {
    id: string;
    title: string;
    content: string;
    folder_id?: string;
    color_hex?: string;
    is_pinned: number;
    is_archived: number;
    is_locked: number;
    is_deleted: number;
    created_at: number;
    updated_at: number;
};

export const NoteRepository = {
    async getNote(db: SQLiteDatabase, id: string): Promise<Note | null> {
        return await db.getFirstAsync<Note>('SELECT * FROM notes WHERE id = ?', id);
    },

    async createNote(db: SQLiteDatabase, note: Note) {
        await db.runAsync(
            `INSERT INTO notes (id, title, content, folder_id, color_hex, is_pinned, is_archived, is_locked, is_deleted, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            note.id,
            note.title,
            note.content,
            note.folder_id ?? null,
            note.color_hex ?? null,
            note.is_pinned,
            note.is_archived,
            note.is_locked,
            note.is_deleted,
            note.created_at,
            note.updated_at
        );
    },

    async updateNote(db: SQLiteDatabase, id: string, updates: Partial<Note>) {
        const fields = Object.keys(updates)
            .filter(key => key !== 'id') // Don't update ID
            .map(key => `${key} = ?`)
            .join(', ');

        if (!fields) return;

        const values = Object.keys(updates)
            .filter(key => key !== 'id')
            .map(key => (updates as any)[key]); // Cast to access dynamic property

        values.push(id);

        // Always update updated_at if not explicitly provided
        if (!updates.updated_at) {
            await db.runAsync(`UPDATE notes SET ${fields}, updated_at = ? WHERE id = ?`, ...values, Date.now());
        } else {
            await db.runAsync(`UPDATE notes SET ${fields} WHERE id = ?`, ...values);
        }
    },

    async deleteNote(db: SQLiteDatabase, id: string, permanent: boolean = false) {
        if (permanent) {
            await db.runAsync('DELETE FROM notes WHERE id = ?', id);
        } else {
            await db.runAsync('UPDATE notes SET is_deleted = 1, updated_at = ? WHERE id = ?', Date.now(), id);
        }
    }
};
