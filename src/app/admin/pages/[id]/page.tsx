import { cookies, headers } from 'next/headers';

export default async function PageDetail({ params }: { params: { id: string } }) {
  const cookie = cookies().toString();
  const h = headers();
  const host = h.get('x-forwarded-host') ?? h.get('host');
  const proto = h.get('x-forwarded-proto') ?? 'http';
  const baseUrl = `${proto}://${host}`;
  const res = await fetch(`${baseUrl}/api/pages/${params.id}`, { cache: 'no-store', headers: { cookie } });
  if (!res.ok) return <div className="text-sm text-red-600">Not found</div>;
  const { item } = await res.json();
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-medium">Edit Page</h2>
      <div>
        <div className="text-sm text-muted-foreground">Slug</div>
        <div>/{item.slug}</div>
      </div>
      <div>
        <div className="text-sm text-muted-foreground">Title</div>
        <div>{item.title}</div>
      </div>
      <div>
        <div className="text-sm text-muted-foreground">Status</div>
        <div>{item.status}</div>
      </div>
    </div>
  );
}
