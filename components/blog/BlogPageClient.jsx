'use client';

import { useState, useMemo } from 'react';
import BlogHero from './BlogHero';
import FeaturedArticle from './FeaturedArticle';
import BlogGrid from './BlogGrid';

export default function BlogPageClient({ articles, categories }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const featuredArticle = useMemo(() => articles.find((a) => a.featured), [articles]);

  const filteredArticles = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return articles.filter((a) => {
      if (a.featured) return false;
      if (activeCategory !== 'all' && a.category !== activeCategory) return false;
      if (q) {
        const haystack = [a.title, a.destination, a.country, a.category, ...a.tags]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [articles, activeCategory, searchQuery]);

  return (
    <>
      <BlogHero
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      {featuredArticle && <FeaturedArticle article={featuredArticle} />}
      <BlogGrid articles={filteredArticles} activeCategory={activeCategory} />
    </>
  );
}
