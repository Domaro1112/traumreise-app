import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Container from '@/components/layout/Container';
import SectionTitle from '@/components/ui/SectionTitle';
import Button from '@/components/ui/Button';
import BlogGrid from './BlogGrid';

export const metadata = {
  title: 'Reiseblog – Traumreise',
  description: 'Reise-Tipps, Inspirationen und Insider-Wissen von unseren Experten.',
};

export const BLOG_POSTS = [
  {
    id: 1,
    tag: 'Reiseguide',
    title: "Bali unter 1.000 € – So geht's wirklich",
    excerpt: 'Insider-Tipps für die perfekte Bali-Reise ohne Budgetsprengung. Von Ubud bis Seminyak.',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=500&q=80',
    readTime: '5 min',
    date: '12. Mai 2024',
  },
  {
    id: 2,
    tag: 'Geheimtipp',
    title: 'Santorini im September: Warum das die beste Reisezeit ist',
    excerpt: 'Weniger Touristen, günstigere Preise, traumhaftes Wetter – der perfekte Monat für Santorini.',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=500&q=80',
    readTime: '4 min',
    date: '3. April 2024',
  },
  {
    id: 3,
    tag: 'Abenteuer',
    title: 'Banff Nationalpark: Der ultimative Reiseführer',
    excerpt: 'Wanderwege, Wildlife, Seen & Hotels – alles was du für Banff wissen musst.',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=500&q=80',
    readTime: '7 min',
    date: '18. März 2024',
  },
];

export default function Reiseblog() {
  return (
    <>
      <Header />
      <main style={{ paddingTop: '72px', background: '#FFFFFF', minHeight: '100vh' }}>
        <div style={{ paddingTop: '80px', paddingBottom: '60px' }}>
          <Container>
            <SectionTitle
              label="Reiseblog"
              title="Inspiration &"
              titleHighlight="Insider-Tipps"
              subtitle="Echte Reiseerfahrungen, praktische Guides und handverlesene Empfehlungen von unseren Experten."
            />
            <BlogGrid posts={BLOG_POSTS} />
            <div style={{ textAlign: 'center', marginTop: '48px' }}>
              <p style={{ color: '#94A3B8', marginBottom: '24px', fontSize: '15px' }}>
                Weitere Artikel erscheinen bald. Newsletter abonnieren und nichts verpassen!
              </p>
              <Button href="/#newsletter" variant="secondary">
                Newsletter abonnieren →
              </Button>
            </div>
          </Container>
        </div>
      </main>
      <Footer />
    </>
  );
}
