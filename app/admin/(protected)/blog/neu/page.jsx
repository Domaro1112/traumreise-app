import BlogEditorClient from '@/components/admin/blog/BlogEditorClient';

export const metadata = { title: 'Neuer Artikel – Admin' };

export default function NewBlogArticlePage() {
  return <BlogEditorClient isNew initialData={null} />;
}
