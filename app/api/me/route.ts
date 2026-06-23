import { NextResponse } from 'next/server';
import db from '../../../lib/db';
import { getSession } from '../../../lib/session';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ success: false }, { status: 401 });
    const [rows]: any = await db.query('SELECT id, name, email FROM users WHERE id=?', [session.userId]);
    if (!rows.length) return NextResponse.json({ success: false }, { status: 401 });
    return NextResponse.json({ success: true, user: rows[0] });

  } catch (error: any) {
    console.error('Ошибка в роутере ми:', error);
    return NextResponse.json({ success: false, message: 'Внутренняя ошибка сервера' }, { status: 500 });
  }
}