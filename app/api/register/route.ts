import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import db, { initDb } from '../../../lib/db';
import { setSession } from '../../../lib/session';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export async function POST(req: NextRequest) {
  await initDb();
  const body = await req.json();
  const { name = '', surname = '', phone = '', email = '', password = '' } = body;
  const cleanEmail = email.toLowerCase().trim();

  if (!name || !surname || !phone || !cleanEmail || !password)
    return NextResponse.json({ success: false, message: 'вы не все заполнили' }, { status: 400 });
  if (!emailRegex.test(cleanEmail))
    return NextResponse.json({ success: false, message: 'Некорректный email' }, { status: 400 });
  if (password.length < 8)
    return NextResponse.json({ success: false, message: 'Пароль — минимум 8 символов' }, { status: 400 });
  const hash = await bcrypt.hash(password, 12);

  try {
    const [result]: any = await db.query(
      'INSERT INTO users (name, surname, phone, email, password_hash) VALUES (?,?,?,?,?)',
      [name, surname, phone, cleanEmail, hash]
    );
    await setSession(result.insertId, cleanEmail);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    if (err.code === 'ER_DUP_ENTRY')
      return NextResponse.json({ success: false, message: 'Email уже зарегистрирован' }, { status: 409 });
    return NextResponse.json({ success: false, message: 'Ошибка сервера' }, { status: 500 });
  }

}
