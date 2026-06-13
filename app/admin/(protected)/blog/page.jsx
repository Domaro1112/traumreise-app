import { listBlogAdmin } from '@/repositories/blog-cms';
import BlogListClient from '@/components/admin/blog/BlogListClient';

export const metadata = { title: 'Reiseblog – Admin' };
export const dynamic = 'force-dynamic';

export default async function AdminBlogPage() {
  const articles = await listBlogAdmin().catch(() => []);
  return <BlogListClient initialArticles={articles} />;
}
