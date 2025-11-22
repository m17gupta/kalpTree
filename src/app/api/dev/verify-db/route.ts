import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db/mongodb';
import { ensureIndexes } from '@/lib/db/indexes';

export async function GET() {
  try {
    await ensureIndexes();
    const db = await getDatabase();
    const tenants = await db.collection('tenants').find().limit(5).toArray();
    const users = await db.collection('users').find().limit(5).toArray();
    return NextResponse.json({ ok: true, counts: { tenants: tenants.length, users: users.length } });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message }, { status: 500 });
  }
}
