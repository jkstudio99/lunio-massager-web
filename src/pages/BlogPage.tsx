import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, ArrowRight } from 'lucide-react';

const posts = [
  {
    id: '1',
    title: '辦公室族必讀：5 個緩解眼部疲勞的有效方法',
    excerpt: '長時間盯著電腦螢幕，眼睛容易乾澀、疲勞。本文將介紹五個經科學驗證的方法，幫助您有效舒緩眼部不適...',
    image: 'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=600&h=400&fit=crop',
    category: '健康知識',
    date: '2026-03-18',
    readTime: '5 分鐘',
  },
  {
    id: '2',
    title: '為什麼你需要一台頸肩按摩器？醫師告訴你',
    excerpt: '頸肩僵硬是現代人最常見的困擾之一。專業醫師解析頸肩痠痛的成因，以及為什麼定期按摩能有效改善...',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&h=400&fit=crop',
    category: '產品指南',
    date: '2026-03-14',
    readTime: '7 分鐘',
  },
  {
    id: '3',
    title: '按摩器選購指南：如何挑選最適合你的按摩器？',
    excerpt: '市面上按摩器百百種，到底該如何選擇？這篇完整指南將幫助您了解不同類型按摩器的特點與適用情境...',
    image: 'https://images.unsplash.com/photo-1519824145371-296894a0daa9?w=600&h=400&fit=crop',
    category: '產品指南',
    date: '2026-03-10',
    readTime: '8 分鐘',
  },
  {
    id: '4',
    title: '居家舒壓全攻略：打造屬於你的放鬆角落',
    excerpt: '忙碌的一天結束後，如何在家中快速切換到放鬆模式？我們整理了從環境佈置到按摩技巧的完整指南...',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbec6d?w=600&h=400&fit=crop',
    category: '生活風格',
    date: '2026-03-06',
    readTime: '6 分鐘',
  },
  {
    id: '5',
    title: '足底按摩的驚人好處：不只是放鬆這麼簡單',
    excerpt: '足底按摩在中醫中有著悠久的歷史。現代研究也證實，足底按摩除了放鬆之外，還能帶來多項健康益處...',
    image: 'https://images.unsplash.com/photo-1562832135-14a35d25edef?w=600&h=400&fit=crop',
    category: '健康知識',
    date: '2026-03-02',
    readTime: '5 分鐘',
  },
  {
    id: '6',
    title: '送禮首選：為家人挑選健康科技好禮',
    excerpt: '還在煩惱送什麼禮物給家人？健康科技產品已成為最受歡迎的禮物選項之一。我們精選幾款最適合送禮的按摩器...',
    image: 'https://images.unsplash.com/photo-1556760544-74068565f05c?w=600&h=400&fit=crop',
    category: '生活風格',
    date: '2026-02-26',
    readTime: '4 分鐘',
  },
];

export default function BlogPage() {
  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <div className="bg-surface">
      {/* Hero */}
      <section className="bg-surface-alt">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-8 py-12 lg:py-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl lg:text-4xl font-bold text-primary mb-2">文章專區</h1>
            <p className="text-muted">健康知識、產品指南與生活風格</p>
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
                <Clock size={12} /> {featured.readTime}
              </span>
            </div>
            <Link
              to="#"
              className="inline-flex items-center gap-2 text-sm font-semibold text-crocus hover:text-crocus-hover transition-colors"
            >
              閱讀更多 <ArrowRight size={16} />
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
                  <Clock size={11} /> {post.readTime}
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}
