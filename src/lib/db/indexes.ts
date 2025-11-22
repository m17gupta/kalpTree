import { getDatabase } from './mongodb';

export async function ensureIndexes() {
  const db = await getDatabase();
  await Promise.all([
    db.collection('tenants').createIndex({ slug: 1 }, { unique: true, name: 'uniq_tenants_slug' }),
    db.collection('users').createIndex({ tenantId: 1, email: 1 }, { unique: true, name: 'uniq_users_tenant_email' }),
    db.collection('users').createIndex({ tenantId: 1, role: 1 }, { name: 'users_tenant_role' }),
  ]);
}
