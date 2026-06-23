import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import db, { initDb } from '../../../lib/db';
import { setSession } from '../../../lib/session';

const MAX_ATTEMPTS = 3;
const BLOCK_MINUTES = 15;
const ipAttempts = new Map<string, { count: number; resetAt: number }>();

function checkIpLimit(ip: string): boolean {
  const now = Date.now();
  const record = ipAttempts.get(ip);
  if (!record || now > record.resetAt) {
    ipAttempts.set(ip, { count: 1, resetAt: now + 15 * 60 * 1000 });
    return true;
  }
  if (record.count >= 10) return false;
  record.count++;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    await initDb();
    const ip = req.headers.get('x-forwarded-for') ?? 'unknown';
    if (!checkIpLimit(ip)) {
      return NextResponse.json(
        { success: false, message: 'Слишком много попыток. Попробуйте позже' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const email = (body.email ?? '').toLowerCase().trim();
    const password = body.password ?? '';

    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'Заполните все поля' }, { status: 400 });
    }
    const [rows]: any = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (!rows.length) {
      return NextResponse.json({ success: false, message: 'Неверный email или пароль' }, { status: 401 });
    }

    const user = rows[0];
    const now = new Date();
    if (user.blocking_time && new Date(user.blocking_time) > now) {
      const remainingTimeMs = new Date(user.blocking_time).getTime() - now.getTime();
      const mins = Math.ceil(remainingTimeMs / 60000);

      return NextResponse.json(
        { success: false, message: `Аккаунт временно заблокирован. Повторите через ${mins} мин.` },
        { status: 423 }
      );
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      const attempts = user.login_attempts + 1;

      if (attempts >= MAX_ATTEMPTS) {
        const lockTime = new Date();
        lockTime.setMinutes(lockTime.getMinutes() + BLOCK_MINUTES);
        await db.query(
          'UPDATE users SET login_attempts = ?, blocking_time = ? WHERE id = ?',
          [attempts, lockTime, user.id]
        );

        return NextResponse.json(
          { success: false, message: `Вы ввели неверный пароль ${MAX_ATTEMPTS} раза. Аккаунт заблокирован на ${BLOCK_MINUTES} минут.` },
          { status: 423 }
        );
      }
      await db.query('UPDATE users SET login_attempts = ? WHERE id = ?', [attempts, user.id]);

      return NextResponse.json(
        { success: false, message: `Неверный пароль. Осталось попыток: ${MAX_ATTEMPTS - attempts}` },
        { status: 401 }
      );
    }
    await db.query('UPDATE users SET login_attempts = 0, blocking_time = NULL WHERE id = ?', [user.id]);

    await setSession(user.id, user.email);
    return NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email }
    });

  } catch (error: any) {
    console.error('Ошибка в роутере авторизации:', error);
    return NextResponse.json({ success: false, message: 'Внутренняя ошибка сервера' }, { status: 500 });
  }
}