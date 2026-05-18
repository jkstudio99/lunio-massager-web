import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin, Clock, Phone, Navigation, ExternalLink, Search, ChevronDown,
} from 'lucide-react';
import { useI18n } from '@/store/i18n';
import { cn } from '@/lib/utils';

/* ── Store data ── */
interface Store {
  id: string;
  name: { 'zh-TW': string; en: string };
  type: 'flagship' | 'partner' | 'popup';
  address: { 'zh-TW': string; en: string };
  area: { 'zh-TW': string; en: string };
  phone: string;
  hours: { 'zh-TW': string; en: string };
  image: string;
  mapUrl: string;
  lat: number;
  lng: number;
  features?: string[];
}

const stores: Store[] = [
  {
    id: '1',
    name: {
      'zh-TW': 'Lunio 信義旗艦店',
      en: 'Lunio Xinyi Flagship',
    },
    type: 'flagship',
    address: {
      'zh-TW': '台北市信義區松壽路12號 2F',
      en: '2F, No. 12, Songshou Rd, Xinyi District, Taipei',
    },
    area: { 'zh-TW': '台北', en: 'Taipei' },
    phone: '02-2723-8899',
    hours: { 'zh-TW': '週一至週日 11:00 - 21:30', en: 'Mon–Sun 11:00 AM – 9:30 PM' },
    image: '/media/products/calf/20260304-lunio33523.jpg',
    mapUrl: 'https://maps.google.com/?q=25.0360,121.5675',
    lat: 25.036,
    lng: 121.5675,
    features: ['full-lineup', 'trial', 'gift-wrap'],
  },
  {
    id: '2',
    name: {
      'zh-TW': 'Lunio 中山概念店',
      en: 'Lunio Zhongshan Concept',
    },
    type: 'flagship',
    address: {
      'zh-TW': '台北市中山區南京西路14號 1F',
      en: '1F, No. 14, Nanjing W. Rd, Zhongshan District, Taipei',
    },
    area: { 'zh-TW': '台北', en: 'Taipei' },
    phone: '02-2531-6677',
    hours: { 'zh-TW': '週一至週日 11:00 - 21:00', en: 'Mon–Sun 11:00 AM – 9:00 PM' },
    image: '/media/products/boot/20260304-lunio34100.jpg',
    mapUrl: 'https://maps.google.com/?q=25.0527,121.5230',
    lat: 25.0527,
    lng: 121.523,
    features: ['full-lineup', 'trial'],
  },
  {
    id: '3',
    name: {
      'zh-TW': 'Lunio 台中新光店',
      en: 'Lunio Taichung Shin Kong',
    },
    type: 'partner',
    address: {
      'zh-TW': '台中市西屯區台灣大道三段301號 B1',
      en: 'B1, No. 301, Taiwan Blvd Sec 3, Xitun District, Taichung',
    },
    area: { 'zh-TW': '台中', en: 'Taichung' },
    phone: '04-2255-3388',
    hours: { 'zh-TW': '週一至週五 11:00 - 22:00 / 週末 10:30 - 22:00', en: 'Mon–Fri 11 AM – 10 PM / Sat–Sun 10:30 AM – 10 PM' },
    image: '/media/products/neck/20260304-lunio34215.jpg',
    mapUrl: 'https://maps.google.com/?q=24.1627,120.6393',
    lat: 24.1627,
    lng: 120.6393,
    features: ['trial'],
  },
  {
    id: '4',
    name: {
      'zh-TW': 'Lunio 高雄漢神店',
      en: 'Lunio Kaohsiung Hanshin',
    },
    type: 'partner',
    address: {
      'zh-TW': '高雄市前金區成功一路266-1號 4F',
      en: '4F, No. 266-1, Chenggong 1st Rd, Qianjin District, Kaohsiung',
    },
    area: { 'zh-TW': '高雄', en: 'Kaohsiung' },
    phone: '07-215-7799',
    hours: { 'zh-TW': '週一至週日 11:00 - 22:00', en: 'Mon–Sun 11:00 AM – 10:00 PM' },
    image: '/media/products/calf/20260304-lunio35224.jpg',
    mapUrl: 'https://maps.google.com/?q=22.6273,120.2972',
    lat: 22.6273,
    lng: 120.2972,
    features: ['trial', 'gift-wrap'],
  },
  {
    id: '5',
    name: {
      'zh-TW': 'WeWork x Lunio 快閃體驗',
      en: 'WeWork x Lunio Pop-up',
    },
    type: 'popup',
    address: {
      'zh-TW': '台北市大安區敦化南路二段99號 T-One 大樓',
      en: 'T-One Building, No. 99, Dunhua S. Rd Sec 2, Da\'an District, Taipei',
    },
    area: { 'zh-TW': '台北', en: 'Taipei' },
    phone: '02-2700-1234',
    hours: { 'zh-TW': '週一至週五 10:00 - 18:00 (限期至 2026/06/30)', en: 'Mon–Fri 10 AM – 6 PM (Until Jun 30, 2026)' },
    image: '/media/products/boot/20260304-lunio34249.jpg',
    mapUrl: 'https://maps.google.com/?q=25.0264,121.5497',
    lat: 25.0264,
    lng: 121.5497,
    features: ['trial', 'full-lineup'],
  },
];

const areas = ['all', '台北', '台中', '高雄'] as const;
const areasEn: Record<string, string> = { all: 'All', '台北': 'Taipei', '台中': 'Taichung', '高雄': 'Kaohsiung' };

const typeBadge: Record<Store['type'], { label: Record<string, string>; color: string }> = {
  flagship: {
    label: { 'zh-TW': '旗艦店', en: 'Flagship' },
    color: 'bg-crocus/10 text-crocus',
  },
  partner: {
    label: { 'zh-TW': '百貨專櫃', en: 'Department' },
    color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20',
  },
  popup: {
    label: { 'zh-TW': '快閃店', en: 'Pop-up' },
    color: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20',
  },
};

const featureLabels: Record<string, Record<string, string>> = {
  'full-lineup': { 'zh-TW': '全系列展示', en: 'Full Lineup' },
  trial: { 'zh-TW': '免費體驗', en: 'Free Trial' },
  'gift-wrap': { 'zh-TW': '禮物包裝', en: 'Gift Wrap' },
};

export default function StorePage() {
  const { locale } = useI18n();
  const [searchQuery, setSearchQuery] = useState('');
  const [areaFilter, setAreaFilter] = useState<string>('all');
  const [selectedStore, setSelectedStore] = useState<string | null>(null);

  const filtered = stores.filter((s) => {
    const matchArea = areaFilter === 'all' || s.area['zh-TW'] === areaFilter;
    const matchSearch = !searchQuery ||
      s.name[locale].toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.address[locale].toLowerCase().includes(searchQuery.toLowerCase());
    return matchArea && matchSearch;
  });

  return (
    <div className="bg-surface min-h-screen">
      {/* Hero */}
      <section className="relative bg-brand overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand via-brand-light to-crocus/30 opacity-90" />
        <div className="relative mx-auto max-w-[1280px] px-6 lg:px-8 py-16 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <p className="text-[11px] font-medium tracking-[0.3em] uppercase text-crocus-soft mb-3">
              Store Locator
            </p>
            <h1 className="text-3xl lg:text-5xl font-bold text-white tracking-[-0.03em] mb-4">
              {locale === 'zh-TW' ? '尋找附近門市' : 'Find a Store Near You'}
            </h1>
            <p className="text-white/60 max-w-lg mx-auto text-sm sm:text-base">
              {locale === 'zh-TW'
                ? '歡迎蒞臨 Lunio 門市體驗全系列按摩產品，專人為您服務'
                : 'Visit a Lunio store to experience our full range of massage products in person'}
            </p>

            {/* Search bar */}
            <div className="mt-8 max-w-md mx-auto">
              <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={locale === 'zh-TW' ? '搜尋門市名稱或地址...' : 'Search store name or address...'}
                  className="w-full h-12 pl-11 pr-4 bg-surface border border-default rounded-full text-primary text-sm focus:outline-none focus:ring-2 focus:ring-crocus/30 shadow-lg"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="mx-auto max-w-[1280px] px-6 lg:px-8 py-10 lg:py-16">
        {/* Area filter */}
        <div className="flex items-center gap-2 mb-8 flex-wrap">
          <MapPin size={16} className="text-crocus" />
          {areas.map((area) => (
            <button
              key={area}
              onClick={() => setAreaFilter(area)}
              className={cn(
                'px-4 py-2 rounded-full text-xs font-semibold transition-all',
                areaFilter === area
                  ? 'bg-crocus text-white'
                  : 'bg-surface-alt text-secondary hover:bg-light-gray'
              )}
            >
              {locale === 'zh-TW' ? (area === 'all' ? '全部地區' : area) : areasEn[area]}
            </button>
          ))}
          <span className="text-xs text-muted ml-2">
            {filtered.length} {locale === 'zh-TW' ? '間門市' : 'stores'}
          </span>
        </div>

        {/* Store list */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filtered.map((store, i) => {
            const badge = typeBadge[store.type];
            const isExpanded = selectedStore === store.id;

            return (
              <motion.div
                key={store.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className={cn(
                  'group rounded-2xl border overflow-hidden transition-all duration-300',
                  isExpanded ? 'border-crocus/40 shadow-lg' : 'border-default hover:shadow-md'
                )}
              >
                {/* Image + badge */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={store.image}
                    alt={store.name[locale]}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                  {/* Type badge */}
                  <span className={cn(
                    'absolute top-4 left-4 px-3 py-1 rounded-full text-[11px] font-semibold',
                    badge.color
                  )}>
                    {badge.label[locale]}
                  </span>

                  {/* Store name overlay */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-lg font-bold text-white">{store.name[locale]}</h3>
                  </div>
                </div>

                {/* Info */}
                <div className="p-5">
                  {/* Address */}
                  <div className="flex items-start gap-3 mb-3">
                    <MapPin size={16} className="text-crocus mt-0.5 shrink-0" />
                    <p className="text-sm text-secondary leading-relaxed">{store.address[locale]}</p>
                  </div>

                  {/* Hours */}
                  <div className="flex items-start gap-3 mb-3">
                    <Clock size={16} className="text-crocus mt-0.5 shrink-0" />
                    <p className="text-sm text-secondary">{store.hours[locale]}</p>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-3 mb-4">
                    <Phone size={16} className="text-crocus mt-0.5 shrink-0" />
                    <a href={`tel:${store.phone}`} className="text-sm text-secondary hover:text-crocus transition-colors">
                      {store.phone}
                    </a>
                  </div>

                  {/* Features */}
                  {store.features && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {store.features.map((f) => (
                        <span
                          key={f}
                          className="px-2.5 py-1 rounded-full bg-surface-alt text-[11px] font-medium text-secondary"
                        >
                          {featureLabels[f]?.[locale] || f}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t border-default">
                    <a
                      href={store.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 h-10 bg-crocus hover:bg-crocus-hover text-white text-sm font-semibold rounded-xl transition-colors"
                    >
                      <Navigation size={14} />
                      {locale === 'zh-TW' ? '導航前往' : 'Get Directions'}
                    </a>
                    <button
                      onClick={() => setSelectedStore(isExpanded ? null : store.id)}
                      className="flex items-center justify-center gap-1.5 h-10 px-4 border border-default rounded-xl text-sm font-medium text-secondary hover:text-primary hover:bg-surface-alt transition-colors"
                    >
                      <ExternalLink size={14} />
                      {locale === 'zh-TW' ? '詳情' : 'Details'}
                      <ChevronDown size={12} className={cn('transition-transform', isExpanded && 'rotate-180')} />
                    </button>
                  </div>

                  {/* Expanded details */}
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 mt-4 border-t border-default">
                        {/* Embedded map */}
                        <div className="rounded-xl overflow-hidden h-48 bg-surface-alt">
                          <iframe
                            title={store.name[locale]}
                            src={`https://maps.google.com/maps?q=${store.lat},${store.lng}&z=16&output=embed`}
                            className="w-full h-full border-0"
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                          />
                        </div>
                        <p className="text-xs text-muted mt-3 text-center">
                          {locale === 'zh-TW'
                            ? '點擊「導航前往」可在 Google Maps 中查看完整路線'
                            : 'Tap "Get Directions" to view full route in Google Maps'}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="text-center py-20">
            <MapPin size={48} className="mx-auto mb-4 text-muted" />
            <p className="text-lg font-semibold text-primary mb-2">
              {locale === 'zh-TW' ? '找不到符合的門市' : 'No stores found'}
            </p>
            <p className="text-sm text-muted">
              {locale === 'zh-TW' ? '請嘗試其他地區或搜尋條件' : 'Try a different area or search term'}
            </p>
          </div>
        )}

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center p-10 rounded-3xl bg-surface-alt"
        >
          <h2 className="text-2xl font-bold text-primary mb-3">
            {locale === 'zh-TW' ? '想成為 Lunio 經銷夥伴？' : 'Interested in Partnering?'}
          </h2>
          <p className="text-sm text-secondary max-w-lg mx-auto mb-6">
            {locale === 'zh-TW'
              ? '歡迎各大百貨、健身房、養生館洽談合作，讓更多人體驗 Lunio 的放鬆科技'
              : 'We welcome partnerships with department stores, gyms, and wellness centers to bring Lunio to more people'}
          </p>
          <a
            href="mailto:partner@lunio.com.tw"
            className="inline-flex items-center gap-2 px-8 py-3 bg-crocus hover:bg-crocus-hover text-white font-semibold rounded-full transition-colors"
          >
            {locale === 'zh-TW' ? '聯絡我們' : 'Contact Us'}
          </a>
        </motion.div>
      </div>
    </div>
  );
}
