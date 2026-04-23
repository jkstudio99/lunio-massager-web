import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, ArrowRight } from 'lucide-react';

import { useI18n } from '@/store/i18n';

export default function BlogPage() {
  const { t } = useI18n();

  const postsWithImages = t.blog.posts.map((post, index) => ({
    ...post,
    image: [
      'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1519824145371-296894a0daa9?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1540555700478-4be289fbec6d?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1562832135-14a35d25edef?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1556760544-74068565f05c?w=600&h=400&fit=crop',
    ][index],
    date: ['2026-03-18', '2026-03-14', '2026-03-10', '2026-03-06', '2026-03-02', '2026-02-26'][index],
  }));

  const featured = postsWithImages[0];
  const rest = postsWithImages.slice(1);

  return (
    <div className="bg-surface">
      {/* Hero */}
      <section className="bg-surface-alt">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-8 py-12 lg:py-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl lg:text-4xl font-bold text-primary mb-2">{t.blog.title}</h1>
            <p className="text-muted">{t.blog.subtitle}</p>
          </motion.div>
        </div>
      </section>

      <div className="mx-auto max-w-[1280px] px-6 lg:px-8 py-12 lg:py-16">
        {/* Featured */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid lg:grid-cols-2 gap-8 mb-16"
        >
          <div className="rounded-2xl overflow-hidden aspect-[3/2]">
            <img src={featured.image} alt={featured.title} className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col justify-center">
            <span className="inline-block text-xs font-semibold text-crocus mb-3">{featured.category}</span>
            <h2 className="text-2xl lg:text-3xl font-bold text-primary mb-4 leading-tight">
              {featured.title}
            </h2>
            <p className="text-sm text-secondary leading-relaxed mb-6">{featured.excerpt}</p>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-xs text-muted">{featured.date}</span>
              <span className="flex items-center gap-1 text-xs text-muted">
                <Clock size={12} /> {featured.readTime} {t.blog.minutes}
              </span>
            </div>
            <Link
              to="#"
              className="inline-flex items-center gap-2 text-sm font-semibold text-crocus hover:text-crocus-hover transition-colors"
            >
              {t.blog.readMore} <ArrowRight size={16} />
            </Link>
          </div>
        </motion.article>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {rest.map((post, i) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group"
            >
              <div className="rounded-xl overflow-hidden aspect-[3/2] mb-4">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <span className="text-xs font-semibold text-crocus">{post.category}</span>
              <h3 className="text-base font-semibold text-primary mt-2 mb-2 group-hover:text-crocus transition-colors line-clamp-2">
                <Link to="#">{post.title}</Link>
              </h3>
              <p className="text-xs text-secondary/60 line-clamp-2 mb-3">{post.excerpt}</p>
              <div className="flex items-center gap-3 text-xs text-muted">
                <span>{post.date}</span>
                <span className="flex items-center gap-1">
                  <Clock size={11} /> {post.readTime} {t.blog.minutes}
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}

