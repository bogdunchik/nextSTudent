import { cookies } from 'next/headers';

const SESSION_KEY = 'session_user_id';
const SESSION_EMAIL = 'session_user_email';

export async function getSession() {
    const cookieStore = await cookies();
    const userId = cookieStore.get(SESSION_KEY)?.value;
    const userEmail = cookieStore.get(SESSION_EMAIL)?.value;
    if (!userId) return null;
    return { userId: Number(userId), userEmail };
}

export async function setSession(userId: number, email: string) {
    const cookieStore = await cookies();
    cookieStore.set(SESSION_KEY, String(userId), {
        httpOnly: true,
        secure: false,
        maxAge: 60 * 60 * 24,
        path: '/',
    });
    cookieStore.set(SESSION_EMAIL, email, {
        httpOnly: true,
        secure: false,
        maxAge: 60 * 60 * 24,
        path: '/',
    });
}

export async function clearSession() {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_KEY);
    cookieStore.delete(SESSION_EMAIL);
}