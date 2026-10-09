import { NextResponse } from 'next/server';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);

    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { ok: false, error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    const { email, honeypot } = body;

    // Silent discard if honeypot was populated by a bot
    if (honeypot) {
      return NextResponse.json({ ok: true });
    }

    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json(
        { ok: false, error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // =========================================================================
    // TODO: Connect and persist the subscriber email to your database or email
    // service provider here (e.g. Supabase, PostgreSQL, Resend, Mailchimp, etc.).
    // Example: await db.subscribers.create({ email: cleanEmail });
    // =========================================================================
    console.log(`[Newsletter] New subscription: ${cleanEmail}`);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[Newsletter] Internal error processing request:', err);
    return NextResponse.json(
      { ok: false, error: 'Please enter a valid email address.' },
      { status: 500 }
    );
  }
}
