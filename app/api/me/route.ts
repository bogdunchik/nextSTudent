import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabaseClient';
import { getSession } from '../../../lib/session';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ success: false }, { status: 401 });

    const { data: user, error } = await supabase
      .from('users')
      .select('id, name, email')
      .eq('id', session.userId)
      .maybeSingle();

    if (error || !user) return NextResponse.json({ success: false }, { status: 401 });
    return NextResponse.json({ success: true, user });

  } catch (error: any) {
    console.error('Ошибка в роутере ми:', error);
    return NextResponse.json({ success: false, message: 'Внутренняя ошибка сервера' }, { status: 500 });
  }
}