import { notFound } from 'next/navigation';
import { getBlogAdmin } from '@/repositories/blog-cms';
import BlogEditorClient from '@/components/admin/blog/BlogEditorClient';

export const metadata = { title: 'Artikel bearbeiten – Admin' };
export const dynamic = 'force-dynamic';

export default async function EditBlogArticlePage({ params }) {
  const { id } = await params;
  let article = null;
  try {
    article = await getBlogAdmin(id);
  } catch {
    notFound();
  }
  if (!article) notFound();
  return <BlogEditorClient isNew={false} initialData={article} />;
}
