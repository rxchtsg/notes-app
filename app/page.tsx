import { neon } from '@neondatabase/serverless';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

async function addNote(formData: FormData) {
  'use server';
  const text = formData.get('text') as string;
  if (!text) return;
  const sql = neon(process.env.DATABASE_URL!);
  await sql`INSERT INTO notes (text) VALUES (${text})`;
  revalidatePath('/');
}

export default async function Home() {
  const sql = neon(process.env.DATABASE_URL!);
  const notes = await sql`SELECT * FROM notes ORDER BY created_at DESC`;

  return (
    <main style={{ maxWidth: 600, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: 32, marginBottom: 20 }}>My Notes</h1>
      <form action={addNote}>
        <input
          name="text"
          placeholder="Write a note"
          style={{ padding: 8, width: '70%', border: '1px solid #888', borderRadius: 6 }}
        />
        <button type="submit" style={{ padding: 8, marginLeft: 8, border: '1px solid #888', borderRadius: 6 }}>
          Add
        </button>
      </form>
      <ul style={{ marginTop: 20 }}>
        {notes.map((note: any) => (
          <li key={note.id} style={{ padding: '6px 0' }}>{note.text}</li>
        ))}
      </ul>
    </main>
  );
}