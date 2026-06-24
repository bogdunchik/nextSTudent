import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabase } from '../../../lib/supabaseClient';
import { setSession } from '../../../lib/session';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
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
    const { data: newUser, error } = await supabase
      .from('users')
      .insert([
        {
          name,
          surname,
          phone,
          email: cleanEmail,
          password_hash: hash
        }
      ])
      .select('id')
      .maybeSingle();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ success: false, message: 'Email уже зарегистрирован' }, { status: 409 });
      }
      console.error('Ошибка при регистрации:', error);
      return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }

    if (!newUser) {
      return NextResponse.json({ success: false, message: 'Не удалось создать пользователя' }, { status: 500 });
    }

    await setSession(newUser.id, cleanEmail);
    return NextResponse.json({ success: true });

  } catch (err: any) {
    console.error('Критическая ошибка сервера в register:', err);
    return NextResponse.json({ success: false, message: err.message || 'Ошибка сервера' }, { status: 500 });
  }
}