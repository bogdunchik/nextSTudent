import { NextResponse } from 'next/server';
import db, { initDb } from '../../../lib/db';

export async function GET() {
  await initDb();
  const [rows] = await db.query('SELECT id, name, description, price FROM products ORDER BY id');
  return NextResponse.json({ success: true, products: rows });
}
