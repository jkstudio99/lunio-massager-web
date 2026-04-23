import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Minus, Plus, Star, Check, Truck, Shield, RefreshCw, ChevronRight } from 'lucide-react';
import { products, reviews as allReviews } from '@/data/products';
import { useCartStore } from '@/store/cart';
import { formatPrice, getDiscountPercent } from '@/lib/utils';
import ProductCard from '@/components/product/ProductCard';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const product = products.find((p) => p.slug === slug);
  const addItem = useCartStore((s) => s.addItem);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description');

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary mb-2">找不到此產品</h2>
          <Link to="/products" className="text-crocus hover:text-crocus-hover transition-colors">
            返回產品列表
          </Link>
        </div>
      </div>
    );
  }

  const productReviews = allReviews.filter((r) => r.productId === product.id);
  const relatedProducts = products.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 3);

  return (
    <div className="bg-surface">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-[1280px] px-6 lg:px-8 py-4">
        <nav className="flex items-center gap-2 text-xs text-muted">
          <Link to="/" className="hover:text-primary transition-colors">首頁</Link>
          <ChevronRight size={12} />
          <Link to="/products" className="hover:text-primary transition-colors">所有產品</Link>
          <ChevronRight size={12} />
          <span className="text-primary">{product.name}</span>
        </nav>
      </div>

      {/* Product main */}
      <div className="mx-auto max-w-[1280px] px-6 lg:px-8 pb-16">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative rounded-3xl overflow-hidden bg-surface-alt aspect-square mb-4">
              <img
                src={product.images[activeImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.comparePrice && (
                <span className="absolute top-4 left-4 px-3 py-1.5 bg-alert text-white text-xs font-bold rounded-full">
                  省 {formatPrice(product.comparePrice - product.price)}
                </span>
              )}
            </div>
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    activeImage === i ? 'border-crocus' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-center gap-2 mb-3">
              {product.isNew && (
                <span className="px-2.5 py-1 bg-brand text-white text-[10px] font-bold uppercase tracking-wider rounded-full">
                  New
                </span>
              )}
              {product.isBestSeller && (
                <span className="px-2.5 py-1 bg-crocus text-white text-[10px] font-bold uppercase tracking-wider rounded-full">
                  熱銷
                </span>
              )}
            </div>

            <h1 className="text-2xl lg:text-3xl font-bold text-primary mb-2">{product.name}</h1>
            <p className="text-sm text-muted mb-4">{product.nameEn}</p>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < Math.floor(product.rating) ? 'fill-crocus text-crocus' : 'text-light-gray'}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold">{product.rating}</span>
              <span className="text-sm text-muted">({product.reviewCount} 評價)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-primary">
                {formatPrice(product.price)}
              </span>
              {product.comparePrice && (
                <>
                  <span className="text-lg text-muted line-through">
                    {formatPrice(product.comparePrice)}
                  </span>
                  <span className="px-2 py-0.5 bg-alert/10 text-alert text-xs font-bold rounded">
                    -{getDiscountPercent(product.price, product.comparePrice)}%
                  </span>
                </>
              )}
            </div>

            <p className="text-sm text-secondary leading-relaxed mb-6">{product.shortDescription}</p>

            {/* Features */}
            <div className="space-y-2 mb-8">
              {product.features.slice(0, 4).map((f) => (
                <div key={f} className="flex items-center gap-2">
                  <Check size={16} className="text-success flex-shrink-0" />
                  <span className="text-sm text-secondary">{f}</span>
                </div>
              ))}
            </div>

            {/* Quantity + Add to cart */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-default rounded-full">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-11 h-11 flex items-center justify-center text-secondary hover:bg-surface-alt transition-colors rounded-l-full"
                >
                  <Minus size={16} />
                </button>
                <span className="w-12 text-center text-sm font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-11 h-11 flex items-center justify-center text-secondary hover:bg-surface-alt transition-colors rounded-r-full"
                >
                  <Plus size={16} />
                </button>
              </div>
              <button
                onClick={() => {
                  addItem(product, quantity);
                  setQuantity(1);
                }}
                className="flex-1 flex items-center justify-center gap-2 h-12 bg-crocus hover:bg-crocus-hover text-white font-semibold rounded-full transition-all hover:scale-[1.01]"
              >
                <ShoppingBag size={18} />
                加入購物車
              </button>
            </div>

            {/* Stock */}
            <p className="text-xs text-success mb-6 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-success rounded-full" />
              現貨供應 — 庫存 {product.stock} 件
            </p>

            {/* Trust */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-surface-alt rounded-xl">
              {[
                { icon: Truck, text: '免運配送' },
                { icon: Shield, text: '一年保固' },
                { icon: RefreshCw, text: '7天鑑賞' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="text-center">
                  <Icon size={18} className="mx-auto mb-1 text-crocus" />
                  <span className="text-[11px] text-secondary font-medium">{text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="mt-16 border-t border-default pt-8">
          <div className="flex gap-6 border-b border-default mb-8">
            {(['description', 'specs', 'reviews'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'text-primary border-crocus'
                    : 'text-muted border-transparent hover:text-primary'
                }`}
              >
                {tab === 'description' && '產品描述'}
                {tab === 'specs' && '產品規格'}
                {tab === 'reviews' && `顧客評價 (${product.reviewCount})`}
              </button>
            ))}
          </div>

          {activeTab === 'description' && (
            <div className="max-w-3xl">
              <p className="text-sm text-secondary leading-relaxed mb-6">{product.description}</p>
              <h3 className="text-lg font-semibold text-primary mb-4">產品特色</h3>
              <ul className="grid sm:grid-cols-2 gap-3">
                {product.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-secondary">
                    <Check size={16} className="text-crocus flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="max-w-xl">
              <table className="w-full">
                <tbody>
                  {Object.entries(product.specs).map(([key, val], i) => (
                    <tr key={key} className={i % 2 === 0 ? 'bg-surface-alt' : ''}>
                      <td className="px-4 py-3 text-sm font-medium text-primary w-1/3">{key}</td>
                      <td className="px-4 py-3 text-sm text-secondary">{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="max-w-2xl space-y-6">
              {productReviews.length > 0 ? (
                productReviews.map((review) => (
                  <div key={review.id} className="p-5 bg-surface-alt rounded-xl">
                    <div className="flex items-center gap-1 mb-2">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star
                          key={j}
                          size={14}
                          className={j < review.rating ? 'fill-crocus text-crocus' : 'text-light-gray'}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-secondary leading-relaxed mb-3">{review.comment}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-primary">{review.author}</span>
                        {review.verified && (
                          <span className="text-[10px] text-success font-medium bg-success/10 px-2 py-0.5 rounded">
                            已驗證購買
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-muted">{review.date}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted">目前還沒有評價</p>
              )}
            </div>
          )}
        </div>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 pt-8 border-t border-default">
            <h2 className="text-2xl font-bold text-primary mb-8">您可能也喜歡</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
