import { readFileSync } from 'fs';
import { MongoClient, ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';

function loadEnvDotLocal() {
  try {
    const raw = readFileSync(new URL('../.env.local', import.meta.url)).toString();
    for (const line of raw.split(/\r?\n/)) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (m) {
        const key = m[1];
        let val = m[2];
        if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
        if (!process.env[key]) process.env[key] = val;
      }
    }
  } catch (e) {
    // ignore if not present
  }
}

async function main() {
  loadEnvDotLocal();
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB || 'kalpdee';
  if (!uri) throw new Error('Missing MONGODB_URI');

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);

  const tenants = db.collection('tenants');
  const users = db.collection('users');

  const now = new Date();
  const existingTenant = await tenants.findOne({ slug: 'demo' });
  let tenantId;
  if (existingTenant) {
    tenantId = existingTenant._id;
  } else {
    const t = {
      slug: 'demo',
      name: 'Demo Tenant',
      email: 'owner@demo.local',
      customDomainVerified: false,
      plan: 'trial',
      subscriptionStatus: 'active',
      branding: { primaryColor: '#3b82f6', secondaryColor: '#f4e04f' },
      paymentGateways: {},
      features: { websiteEnabled: true, ecommerceEnabled: true, blogEnabled: true, invoicesEnabled: true },
      settings: { locale: 'en-US', currency: 'USD', timezone: 'UTC' },
      status: 'active',
      createdAt: now,
      updatedAt: now,
    };
    const r = await tenants.insertOne(t);
    tenantId = r.insertedId;
  }

  const email = 'admin@demo.local';
  const password = 'Password123!';
  const existingUser = await users.findOne({ tenantId: new ObjectId(tenantId), email });
  if (!existingUser) {
    const passwordHash = await bcrypt.hash(password, 10);
    await users.insertOne({
      tenantId: new ObjectId(tenantId),
      email,
      passwordHash,
      name: 'Demo Admin',
      role: 'owner',
      status: 'active',
      createdAt: now,
      updatedAt: now,
    });
  }

  console.log('Seed complete. Login with:');
  console.log('tenant: demo');
  console.log('email: admin@demo.local');
  console.log('password: Password123!');

  await client.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
