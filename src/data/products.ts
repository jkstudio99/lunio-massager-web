import type {
  Category,
  LocalizedText,
  MediaAsset,
  Product,
  Review,
} from '@/types/product';

const lt = (zh: string, en: string): LocalizedText => ({
  'zh-TW': zh,
  en,
});

const media = (
  src: string,
  zhAlt: string,
  enAlt: string,
  extra: Omit<MediaAsset, 'src' | 'alt'> = {}
): MediaAsset => ({
  src,
  alt: lt(zhAlt, enAlt),
  ...extra,
});

const bootCutouts = [
  media('/media/products/boot/1.png', 'Lunio 靴型按摩器正面產品圖', 'Lunio massage boots front product render', { fit: 'contain', aspectRatio: '3 / 4' }),
  media('/media/products/boot/3.png', 'Lunio 靴型按摩器側角度產品圖', 'Lunio massage boots angled product render', { fit: 'contain', aspectRatio: '3 / 4' }),
  media('/media/products/boot/6.png', 'Lunio 靴型按摩器穿著示意產品圖', 'Lunio massage boots worn product render', { fit: 'contain', aspectRatio: '3 / 4' }),
];

const calfCutouts = [
  media('/media/products/calf/1.png', 'Lunio 小腿按摩器正面產品圖', 'Lunio calf massager front product render', { fit: 'contain', aspectRatio: '3 / 4' }),
  media('/media/products/calf/3.png', 'Lunio 小腿按摩器側角度產品圖', 'Lunio calf massager angled product render', { fit: 'contain', aspectRatio: '3 / 4' }),
  media('/media/products/calf/6.png', 'Lunio 小腿按摩器穿著示意產品圖', 'Lunio calf massager worn product render', { fit: 'contain', aspectRatio: '3 / 4' }),
];

const neckCutouts = [
  media('/media/products/neck/3.png', 'Lunio 頸肩按摩器斜角產品圖', 'Lunio neck and shoulder massager angled render', { fit: 'contain', aspectRatio: '4 / 5' }),
  media('/media/products/neck/7.png', 'Lunio 頸肩按摩器正面產品圖', 'Lunio neck and shoulder massager front render', { fit: 'contain', aspectRatio: '4 / 5' }),
  media('/media/products/neck/6.png', 'Lunio 頸肩按摩器打開結構產品圖', 'Lunio neck and shoulder massager structure render', { fit: 'contain', aspectRatio: '4 / 5' }),
  media('/media/products/neck/5.png', 'Lunio 頸肩按摩器產品細節圖', 'Lunio neck and shoulder massager staged render', { fit: 'contain', aspectRatio: '4 / 5' }),
];

export const categories: Category[] = [
  {
    id: 'boot-massager',
    name: '靴型按摩器',
    nameEn: 'Boot Massager',
    slug: 'boot-massager',
    description: '從足底延伸到小腿的全包覆舒壓體驗。',
    descriptionEn: 'A full-leg recovery ritual that wraps from foot to calf.',
    accent: '#2d274a',
    intro: lt(
      '專為長時間久站、久走與高密度日程打造，靴型包覆讓下半身在回家後立刻進入放鬆狀態。',
      'Designed for long days on your feet, the boots-style wrap brings full lower-leg relief the moment you get home.'
    ),
    heroMedia: media('/media/products/boot/20260304-lunio34100.jpg', '穿著 Lunio 靴型按摩器的品牌情境照', 'Lunio boots lifestyle campaign image', {
      aspectRatio: '4 / 5',
    }),
    sortOrder: 1,
    collectionTheme: 'boot',
    image: '/media/products/boot/20260304-lunio34100.jpg',
  },
  {
    id: 'calf-massager',
    name: '小腿按摩器',
    nameEn: 'Calf Massager',
    slug: 'calf-massager',
    description: '俐落輕量的日常小腿重置方案。',
    descriptionEn: 'A portable calf reset made for workdays, commutes, and recovery.',
    accent: '#9786f3',
    intro: lt(
      '細緻包覆小腿曲線，以更輕巧的形式把舒壓帶進辦公桌、沙發與通勤後的休息片刻。',
      'Sculpted around the calf with a lighter silhouette, this is the everyday reset for desk life and post-commute recovery.'
    ),
    heroMedia: media('/media/products/calf/20260304-lunio33422.jpg', '穿著 Lunio 小腿按摩器的辦公室情境照', 'Lunio calf massager office lifestyle image', {
      aspectRatio: '4 / 5',
    }),
    sortOrder: 2,
    collectionTheme: 'calf',
    image: '/media/products/calf/20260304-lunio33422.jpg',
  },
  {
    id: 'neck-shoulder',
    name: '頸肩按摩器',
    nameEn: 'Neck & Shoulder',
    slug: 'neck-shoulder',
    description: '把頸肩紓壓變成一個更優雅、可穿戴的日常動作。',
    descriptionEn: 'An elegant wearable ritual for neck and shoulder release.',
    accent: '#ccd5f8',
    intro: lt(
      '柔和的 Titan White 與 Crocus Purple，讓頸肩放鬆不只專業，也能與日常造型自然共存。',
      'Titan White and Crocus Purple soften the form so neck relief feels professional, wearable, and beautifully integrated into daily life.'
    ),
    heroMedia: media('/media/products/neck/20260304-lunio33559.jpg', '使用 Lunio 頸肩按摩器的閱讀情境照', 'Lunio neck and shoulder massager reading lifestyle image', {
      aspectRatio: '4 / 5',
    }),
    sortOrder: 3,
    collectionTheme: 'neck',
    image: '/media/products/neck/20260304-lunio33559.jpg',
  },
];

export const products: Product[] = [
  {
    id: '1',
    sku: 'CALF-01',
    name: 'Lunio 智能小腿按摩器',
    nameEn: 'Lunio Smart Calf Massager',
    slug: 'lunio-calf-pro-massager',
    description:
      '輕量包覆小腿線條，透過節奏氣壓、柔和溫感與可攜式設計，讓久坐、久站與運動後的疲勞，在日常場景中也能迅速被整理乾淨。它不是一台只在休息日才會打開的設備，而是可以自然進入工作與生活節奏的舒壓單品。',
    descriptionEn:
      'A lightweight calf reset designed around rhythmic compression, gentle warmth, and daily portability. It is made for long desk hours, standing schedules, and post-workout recovery without asking you to change your routine.',
    shortDescription: '輕量包覆小腿曲線，為辦公室、通勤後與運動恢復打造的日常舒壓方案。',
    shortDescriptionEn:
      'A lighter calf ritual designed for office days, commutes, and post-workout recovery.',
    price: 3680,
    comparePrice: 4280,
    category: 'calf-massager',
    stock: 42,
    rating: 4.8,
    reviewCount: 286,
    isBestSeller: true,
    heroImage: media('/media/products/calf/20260304-lunio33422.jpg', '穿著 Lunio 小腿按摩器的辦公室情境照', 'Lunio calf massager office lifestyle image', {
      aspectRatio: '4 / 5',
    }),
    heroImages: [
      media('/media/products/calf/20260304-lunio33422.jpg', '穿著 Lunio 小腿按摩器的辦公室情境照', 'Lunio calf massager office lifestyle image', {
        aspectRatio: '4 / 5',
      }),
      media('/media/products/calf/20260304-lunio33523.jpg', 'Lunio 小腿按摩器通話情境照', 'Lunio calf massager chair lifestyle image', {
        aspectRatio: '4 / 5',
      }),
      media('/media/products/calf/20260304-lunio35214.jpg', 'Lunio 小腿按摩器站立造型照', 'Lunio calf massager standing lifestyle image', {
        aspectRatio: '4 / 5',
      }),
    ],
    gallery: [
      calfCutouts[0],
      calfCutouts[1],
      calfCutouts[2],
      media('/media/products/calf/20260304-lunio35224.jpg', 'Lunio 小腿按摩器時尚情境照', 'Lunio calf massager fashion lifestyle image', {
        aspectRatio: '4 / 5',
      }),
      media('/media/products/calf/20260304-lunio35278.jpg', 'Lunio 小腿按摩器躺姿情境照', 'Lunio calf massager lounge lifestyle image', {
        aspectRatio: '4 / 5',
      }),
    ],
    cutouts: calfCutouts,
    usageScenes: [
      media('/media/products/calf/20260304-lunio33488.jpg', 'Lunio 小腿按摩器日常情境照', 'Lunio calf massager everyday use image', {
        aspectRatio: '4 / 5',
      }),
      media('/media/products/calf/20260304-lunio33523.jpg', 'Lunio 小腿按摩器辦公椅情境照', 'Lunio calf massager office chair image', {
        aspectRatio: '4 / 5',
      }),
      media('/media/products/calf/20260304-lunio35214.jpg', 'Lunio 小腿按摩器站立情境照', 'Lunio calf massager standing image', {
        aspectRatio: '4 / 5',
      }),
      media('/media/products/calf/20260304-lunio35278.jpg', 'Lunio 小腿按摩器休息情境照', 'Lunio calf massager reclined image', {
        aspectRatio: '4 / 5',
      }),
    ],
    usp: [
      {
        eyebrow: lt('Desk Reset', 'Desk Reset'),
        title: lt('俐落包覆，為久坐久站做一個快速重置', 'A precise wrap that resets desk-day fatigue fast'),
        description: lt(
          '氣壓節奏聚焦在小腿主要疲勞區域，不過度佔空間，也不需要繁瑣準備。',
          'Rhythmic compression targets the calf zones that carry most of the day, without taking over your space.'
        ),
      },
      {
        eyebrow: lt('Portable Ritual', 'Portable Ritual'),
        title: lt('輕量外型，讓舒壓自然進入生活節奏', 'A lighter silhouette that belongs in everyday routines'),
        description: lt(
          '無論是下班後的沙發、健身後的恢復，或午休前的 15 分鐘，都能快速上手。',
          'From sofa sessions to post-workout recovery, it slips naturally into the smaller moments of your day.'
        ),
      },
      {
        eyebrow: lt('Warm Release', 'Warm Release'),
        title: lt('溫感輔助，讓放鬆更完整', 'Gentle warmth completes the release'),
        description: lt(
          '在節奏氣壓之外加入柔和熱感，幫助腿部從緊繃狀態慢慢鬆開。',
          'A soft heat layer works with compression to help the calves unwind more completely.'
        ),
      },
    ],
    modes: [
      {
        name: lt('Daily Ease', 'Daily Ease'),
        description: lt('適合每天使用的平衡節奏，從輕柔包覆開始。', 'A balanced rhythm for daily unwinding with a soft opening compression.'),
      },
      {
        name: lt('Post-Workout', 'Post-Workout'),
        description: lt('加強腿部恢復感，針對運動後的緊繃與脹感。', 'A deeper recovery mode aimed at post-workout tightness and heaviness.'),
      },
      {
        name: lt('Night Reset', 'Night Reset'),
        description: lt('適合晚間收尾，讓小腿在入睡前回到更輕盈的狀態。', 'Designed as an evening reset to help the legs feel lighter before sleep.'),
      },
    ],
    faq: [
      {
        question: lt('每天都可以使用嗎？', 'Can I use it every day?'),
        answer: lt('可以，建議每次約 15 分鐘，依照自身舒適度調整強度。', 'Yes. We recommend about 15 minutes per session, adjusting the intensity to your comfort level.'),
      },
      {
        question: lt('適合在辦公室使用嗎？', 'Is it suitable for the office?'),
        answer: lt('適合，它的結構較輕巧，能在工作日中快速完成腿部放鬆。', 'Yes. Its lighter structure makes it easy to use during a workday reset.'),
      },
      {
        question: lt('是否有溫熱功能？', 'Does it include heat?'),
        answer: lt('有，內建柔和熱感，能搭配氣壓節奏一起使用。', 'Yes. It includes a gentle warming layer that works alongside the compression rhythm.'),
      },
    ],
    certifications: ['CE', 'BSMI', 'SGS', '1 Year Warranty'],
    theme: {
      accent: '#9786f3',
      accentSoft: '#ccd5f8',
      accentMute: '#f6d0d7',
      contrast: '#141414',
      surface: '#efeafd',
    },
    cta: {
      primary: lt('立即選購 Calf', 'Shop Calf'),
      secondary: lt('查看完整規格', 'View full specifications'),
      note: lt('適合辦公室、居家、健身後的日常使用。', 'Designed for office days, home unwinds, and post-workout recovery.'),
    },
    stats: [
      {
        label: lt('包覆區域', 'Coverage'),
        value: '360°',
        description: lt('聚焦小腿主要疲勞段落', 'Focused around the calf’s main fatigue zones'),
      },
      {
        label: lt('日常節奏', 'Session'),
        value: '15 min',
        description: lt('快速完成一輪舒壓', 'A quick full reset in one cycle'),
      },
      {
        label: lt('使用場景', 'Use Case'),
        value: 'Desk to Gym',
        description: lt('工作日與運動恢復皆適合', 'Built for workday recovery and post-workout use'),
      },
    ],
    detailMedia: {
      structure: calfCutouts[0],
      ergonomic: calfCutouts[2],
    },
    features: [
      '小腿包覆氣壓節奏',
      '柔和溫感輔助',
      '15 分鐘自動定時',
      '輕量攜帶設計',
    ],
    specs: {
      按摩部位: '小腿',
      按摩方式: '節奏氣壓包覆',
      模式切換: '3 種節奏模式',
      強度: '3 段強度',
      溫熱: '柔和熱感',
      使用建議: '每次約 15 分鐘',
      清潔方式: '表布可擦拭保養',
    },
    images: [],
  },
  {
    id: '2',
    sku: 'BOOT-01',
    name: 'Lunio 智能靴型按摩器',
    nameEn: 'Lunio Smart Massage Boots',
    slug: 'lunio-boot-360-massager',
    description:
      '從足底延伸到小腿的靴型包覆，把大範圍下半身疲勞一次完整整理。它保留 Lunio 的俐落外觀與品牌語言，同時把更高覆蓋率、更沉浸的放鬆感，濃縮進日常使用的 15 分鐘儀式裡。',
    descriptionEn:
      'A boots-style recovery piece that extends relief from the foot up through the calf. It keeps Lunio’s refined silhouette while delivering a more immersive lower-leg reset in a simple 15-minute ritual.',
    shortDescription: '全包覆靴型設計，讓足底、腳踝與小腿在同一輪節奏中被完整照顧。',
    shortDescriptionEn:
      'A full-wrap boots design that treats foot, ankle, and calf in one composed session.',
    price: 6980,
    comparePrice: 7980,
    category: 'boot-massager',
    stock: 28,
    rating: 4.9,
    reviewCount: 412,
    isNew: true,
    isBestSeller: true,
    heroImage: media('/media/products/boot/20260304-lunio34100.jpg', 'Lunio 靴型按摩器閱讀情境照', 'Lunio massage boots reading lifestyle image', {
      aspectRatio: '16 / 10',
    }),
    heroImages: [
      media('/media/products/boot/20260304-lunio34100.jpg', 'Lunio 靴型按摩器閱讀情境照', 'Lunio massage boots reading lifestyle image', {
        aspectRatio: '16 / 10',
      }),
      media('/media/products/boot/20260304-lunio34249.jpg', 'Lunio 靴型按摩器沙發情境照', 'Lunio massage boots sofa lifestyle image', {
        aspectRatio: '4 / 5',
      }),
      media('/media/products/boot/20260304-lunio34477.jpg', 'Lunio 靴型按摩器雙人品牌情境照', 'Lunio massage boots duo campaign image', {
        aspectRatio: '4 / 5',
      }),
    ],
    gallery: [
      bootCutouts[0],
      bootCutouts[1],
      bootCutouts[2],
      media('/media/products/boot/20260304-lunio34486.jpg', 'Lunio 靴型按摩器雙人坐姿情境照', 'Lunio massage boots duo seated lifestyle image', {
        aspectRatio: '4 / 5',
      }),
      media('/media/products/boot/20260304-lunio35088.jpg', 'Lunio 靴型按摩器運動感情境照', 'Lunio massage boots active lifestyle image', {
        aspectRatio: '16 / 10',
      }),
    ],
    cutouts: bootCutouts,
    usageScenes: [
      media('/media/products/boot/20260304-lunio34249.jpg', 'Lunio 靴型按摩器沙發情境照', 'Lunio massage boots sofa lifestyle image', {
        aspectRatio: '4 / 5',
      }),
      media('/media/products/boot/20260304-lunio34477.jpg', 'Lunio 靴型按摩器雙人品牌情境照', 'Lunio massage boots duo campaign image', {
        aspectRatio: '4 / 5',
      }),
      media('/media/products/boot/20260304-lunio34499.jpg', 'Lunio 靴型按摩器雙人時尚情境照', 'Lunio massage boots duo portrait image', {
        aspectRatio: '4 / 5',
      }),
      media('/media/products/boot/20260304-lunio35135_(2).jpg', 'Lunio 靴型按摩器行走情境照', 'Lunio massage boots walking lifestyle image', {
        aspectRatio: '4 / 5',
      }),
    ],
    usp: [
      {
        eyebrow: lt('Full Wrap', 'Full Wrap'),
        title: lt('從腳到底部小腿，一次收整整段疲勞', 'A full-leg recovery wrap from foot to calf'),
        description: lt(
          '靴型結構提供更高覆蓋率，讓足底、腳踝與小腿在同一輪節奏中被完整照顧。',
          'The boots silhouette extends the coverage so foot, ankle, and calf can reset in a single composed rhythm.'
        ),
      },
      {
        eyebrow: lt('Immersive Relief', 'Immersive Relief'),
        title: lt('放鬆感更深、更沉浸，也更有存在感', 'A deeper, more immersive release with stronger presence'),
        description: lt(
          '為高密度日程、長時間步行與晚間腿部脹感所設計，適合在回家後快速切換狀態。',
          'Built for packed schedules, long walks, and end-of-day heaviness so you can switch states faster at home.'
        ),
      },
      {
        eyebrow: lt('Lunio Signature', 'Lunio Signature'),
        title: lt('柔軟包覆搭配品牌感外型', 'Soft construction with an unmistakably Lunio silhouette'),
        description: lt(
          '保留 Lunio 的 Crocus Purple 與 Plum Night 語彙，讓功能型產品依然保持時髦存在感。',
          'The palette stays rooted in Crocus Purple and Plum Night so performance still feels elegant and brand-led.'
        ),
      },
    ],
    modes: [
      {
        name: lt('Desk Recovery', 'Desk Recovery'),
        description: lt('為久坐與久站後的腿部沉重感設計，從較柔和的節奏展開。', 'Designed for heavy legs after long sitting or standing, beginning with a softer rhythm.'),
      },
      {
        name: lt('Deep Restore', 'Deep Restore'),
        description: lt('更完整的下半身收束感，適合長時間行走或高密度工作日。', 'A fuller lower-leg reset for long walks and high-intensity days.'),
      },
      {
        name: lt('Night Unwind', 'Night Unwind'),
        description: lt('適合晚間收尾，讓雙腿在休息前回到更穩定的狀態。', 'Made for evening rituals, helping the legs settle before rest.'),
      },
    ],
    faq: [
      {
        question: lt('靴型按摩器適合哪些人？', 'Who is this boots-style massager for?'),
        answer: lt('適合長時間久站、久走、通勤量高或希望加強腿部恢復感的人。', 'It is ideal for anyone who spends long hours standing, walking, commuting, or seeking a more immersive leg reset.'),
      },
      {
        question: lt('需要每天使用嗎？', 'Do I need to use it every day?'),
        answer: lt('不一定，可依照行程密度調整；多數使用者會在下班後或運動後使用。', 'Not necessarily. Most people use it after work or after workouts depending on how demanding the day has been.'),
      },
      {
        question: lt('尺寸會不會太有存在感？', 'Will it feel too large in use?'),
        answer: lt('它的確比一般小腿款更完整包覆，但正因如此能帶來更沉浸的下半身放鬆感。', 'It is intentionally more enveloping than a calf-only style, which is what creates the deeper lower-leg recovery experience.'),
      },
    ],
    certifications: ['CE', 'BSMI', 'SGS', '1 Year Warranty'],
    theme: {
      accent: '#2d274a',
      accentSoft: '#ccd5f8',
      accentMute: '#ece8d8',
      contrast: '#ffffff',
      surface: '#221d36',
    },
    cta: {
      primary: lt('立即選購 Boots', 'Shop Boots'),
      secondary: lt('查看靴型包覆細節', 'Explore full-wrap details'),
      note: lt('適合大範圍下半身放鬆與回家後的完整收尾儀式。', 'Made for full lower-leg recovery and a more immersive after-work ritual.'),
    },
    stats: [
      {
        label: lt('覆蓋範圍', 'Coverage'),
        value: 'Foot → Calf',
        description: lt('從足底延伸到小腿', 'Extends from foot through calf'),
      },
      {
        label: lt('包覆形式', 'Wrap'),
        value: 'Boots',
        description: lt('全包覆靴型結構', 'Full-wrap boots structure'),
      },
      {
        label: lt('日常節奏', 'Session'),
        value: '15 min',
        description: lt('快速完成一輪放鬆', 'A composed reset in one cycle'),
      },
    ],
    detailMedia: {
      structure: bootCutouts[1],
      ergonomic: bootCutouts[2],
    },
    features: [
      '靴型全包覆結構',
      '足底到小腿完整覆蓋',
      '多段節奏模式',
      '晚間收尾與運動後恢復皆適合',
    ],
    specs: {
      按摩部位: '足底 / 腳踝 / 小腿',
      按摩方式: '大面積包覆節奏',
      模式切換: '3 種節奏模式',
      強度: '3 段強度',
      溫熱: '雙段溫熱輔助',
      使用建議: '每次約 15 分鐘',
      清潔方式: '表布可擦拭保養',
    },
    images: [],
  },
  {
    id: '3',
    sku: 'NECK-01',
    name: 'Lunio 頸肩按摩器',
    nameEn: 'Lunio Neck & Shoulder Massager',
    slug: 'lunio-neckrelief-pro-massager',
    description:
      '以更柔和、更可穿戴的方式，把頸肩紓壓帶回生活。Lunio 頸肩按摩器使用貼合肩頸輪廓的結構與雙拉帶設計，讓你在閱讀、工作或休息時都能穩定使用。這不是典型厚重的按摩器，而是一件能自然融入日常儀式的舒壓單品。',
    descriptionEn:
      'A softer, more wearable way to bring neck and shoulder relief back into your routine. Its contoured form and dual pull straps keep the experience stable while you read, work, or unwind.',
    shortDescription: '以 Titan White 與 Crocus Purple 呈現的可穿戴頸肩舒壓儀式，柔和而專業。',
    shortDescriptionEn:
      'A wearable neck-and-shoulder ritual in Titan White and Crocus Purple, balancing softness with precision.',
    price: 3280,
    comparePrice: 3980,
    category: 'neck-shoulder',
    stock: 55,
    rating: 4.7,
    reviewCount: 218,
    isBestSeller: true,
    heroImage: media('/media/products/neck/20260304-lunio33209.jpg', '使用 Lunio 頸肩按摩器的辦公情境照', 'Lunio neck and shoulder office lifestyle image', {
      aspectRatio: '16 / 10',
    }),
    heroImages: [
      media('/media/products/neck/20260304-lunio33209.jpg', '使用 Lunio 頸肩按摩器的辦公情境照', 'Lunio neck and shoulder office lifestyle image', {
        aspectRatio: '16 / 10',
      }),
      media('/media/products/neck/20260304-lunio33559.jpg', '使用 Lunio 頸肩按摩器的閱讀情境照', 'Lunio neck and shoulder reading lifestyle image', {
        aspectRatio: '4 / 5',
      }),
      media('/media/products/neck/20260304-lunio34215.jpg', '使用 Lunio 頸肩按摩器的沙發情境照', 'Lunio neck and shoulder sofa lifestyle image', {
        aspectRatio: '4 / 5',
      }),
    ],
    gallery: [
      neckCutouts[0],
      neckCutouts[1],
      neckCutouts[2],
      neckCutouts[3],
      media('/media/products/neck/20260304-lunio34197.jpg', 'Lunio 頸肩按摩器品牌造型照', 'Lunio neck and shoulder campaign portrait', {
        aspectRatio: '4 / 5',
      }),
    ],
    cutouts: neckCutouts,
    usageScenes: [
      media('/media/products/neck/20260304-lunio33559.jpg', '使用 Lunio 頸肩按摩器的閱讀情境照', 'Lunio neck and shoulder reading lifestyle image', {
        aspectRatio: '4 / 5',
      }),
      media('/media/products/neck/20260304-lunio34197.jpg', 'Lunio 頸肩按摩器品牌造型照', 'Lunio neck and shoulder campaign portrait', {
        aspectRatio: '4 / 5',
      }),
      media('/media/products/neck/20260304-lunio34209.jpg', 'Lunio 頸肩按摩器坐姿情境照', 'Lunio neck and shoulder seated lifestyle image', {
        aspectRatio: '4 / 5',
      }),
      media('/media/products/neck/20260304-lunio34215.jpg', 'Lunio 頸肩按摩器沙發情境照', 'Lunio neck and shoulder sofa lifestyle image', {
        aspectRatio: '4 / 5',
      }),
      media('/media/products/neck/20260304-lunio33235.jpg', 'Lunio 頸肩按摩器品牌近景照', 'Lunio neck and shoulder portrait detail', {
        aspectRatio: '4 / 5',
      }),
    ],
    usp: [
      {
        eyebrow: lt('Wearable Comfort', 'Wearable Comfort'),
        title: lt('不是放在角落的設備，而是能自然穿上的舒壓單品', 'Not a bulky device, but a wearable relief object'),
        description: lt(
          '結構貼合肩頸輪廓，搭配雙拉帶讓力道更穩定，也讓使用姿態更直覺。',
          'Its contour follows the neck and shoulder line, while the dual straps help keep the pressure stable and intuitive.'
        ),
      },
      {
        eyebrow: lt('Detail Control', 'Detail Control'),
        title: lt('模式、加熱與節奏切換都在手邊完成', 'Mode, heat, and rhythm controls live right at hand'),
        description: lt(
          '一體化按鍵設計讓切換更直覺，閱讀或休息時也不需要中斷狀態。',
          'The integrated control panel keeps adjustments close, so you can stay in the moment without breaking the ritual.'
        ),
      },
      {
        eyebrow: lt('Gentle Precision', 'Gentle Precision'),
        title: lt('柔和外型下，保留專業的頸肩壓感', 'A softer silhouette that still delivers precise neck-and-shoulder pressure'),
        description: lt(
          'Titan White 外層與 Crocus Purple 內襯讓視覺更輕盈，同時保有結構性的支撐與壓感。',
          'Titan White and Crocus Purple lighten the visual presence while preserving the structure needed for focused relief.'
        ),
      },
    ],
    modes: [
      {
        name: lt('Focus Reset', 'Focus Reset'),
        description: lt('適合工作日中段快速整理肩頸壓力。', 'A quick mid-day reset for neck and shoulder fatigue.'),
      },
      {
        name: lt('Heat Ritual', 'Heat Ritual'),
        description: lt('溫熱感更明顯，適合閱讀與晚間放鬆時使用。', 'Brings heat forward for reading and evening unwinds.'),
      },
      {
        name: lt('Deep Knead', 'Deep Knead'),
        description: lt('更有存在感的揉壓節奏，適合高壓工作日後使用。', 'A more present kneading rhythm made for high-pressure workdays.'),
      },
    ],
    faq: [
      {
        question: lt('可以坐著或躺著使用嗎？', 'Can I use it while seated or reclining?'),
        answer: lt('可以，拉帶設計讓你在坐姿或休息姿態都能穩定調整力道。', 'Yes. The strap system helps you tune the pressure whether you are seated or reclining.'),
      },
      {
        question: lt('適合長時間工作後使用嗎？', 'Is it good after long work hours?'),
        answer: lt('非常適合，尤其是久坐、低頭與肩頸緊繃明顯的情境。', 'Absolutely. It is especially suited to long seated hours, screen posture, and neck tension.'),
      },
      {
        question: lt('操作會很複雜嗎？', 'Is the control system complicated?'),
        answer: lt('不會，主要功能都集中在手邊按鍵上，切換模式非常直覺。', 'Not at all. The essential controls sit at hand, making the mode changes intuitive.'),
      },
    ],
    certifications: ['CE', 'BSMI', 'SGS', '1 Year Warranty'],
    theme: {
      accent: '#9786f3',
      accentSoft: '#ccd5f8',
      accentMute: '#ece8d8',
      contrast: '#141414',
      surface: '#eef1ff',
    },
    cta: {
      primary: lt('立即選購 Neck & Shoulder', 'Shop Neck & Shoulder'),
      secondary: lt('查看肩頸結構細節', 'Explore structure details'),
      note: lt('以更優雅、可穿戴的方式完成每日肩頸舒壓。', 'An elegant wearable ritual for daily neck-and-shoulder relief.'),
    },
    stats: [
      {
        label: lt('配色語彙', 'Palette'),
        value: 'Titan + Crocus',
        description: lt('Titan White 與 Crocus Purple', 'Titan White and Crocus Purple'),
      },
      {
        label: lt('操作介面', 'Control'),
        value: '4 Key',
        description: lt('模式與加熱集中在手邊', 'Mode and heat controls kept close at hand'),
      },
      {
        label: lt('使用節奏', 'Session'),
        value: '15 min',
        description: lt('快速完成一輪肩頸舒壓', 'A fast full ritual for neck and shoulders'),
      },
    ],
    detailMedia: {
      controls: media('/media/products/neck/4.png', 'Lunio 頸肩按摩器按鍵特寫', 'Lunio neck and shoulder massager control close-up', {
        fit: 'contain',
        aspectRatio: '1 / 1',
      }),
      structure: media('/media/products/neck/6.png', 'Lunio 頸肩按摩器打開結構產品圖', 'Lunio neck and shoulder structure render', {
        fit: 'contain',
        aspectRatio: '4 / 5',
      }),
      ergonomic: media('/media/products/neck/7.png', 'Lunio 頸肩按摩器正面產品圖', 'Lunio neck and shoulder front render', {
        fit: 'contain',
        aspectRatio: '4 / 5',
      }),
    },
    features: [
      '頸肩輪廓貼合設計',
      '雙拉帶調節力道',
      '加熱與模式一體控制',
      '適合閱讀、工作與晚間休息',
    ],
    specs: {
      按摩部位: '頸部 / 肩頸',
      按摩結構: '貼合式揉壓結構',
      操作介面: '四鍵切換面板',
      模式切換: '3 種節奏模式',
      加熱: '溫熱輔助',
      使用建議: '每次約 15 分鐘',
      清潔方式: '可拆式外套與表布保養',
    },
    images: [],
  },
];

for (const product of products) {
  product.images = product.gallery.map((item) => item.src);
}

export const reviews: Review[] = [
  {
    id: '1',
    productId: '1',
    author: '小美',
    role: 'Retail Planner',
    rating: 5,
    comment: '每天站櫃八小時，小腿都超緊。Calf 這款很適合工作日用，節奏不會太暴力，但放鬆感很乾淨。',
    date: '2026-03-10',
    verified: true,
  },
  {
    id: '2',
    productId: '2',
    author: 'Sabrina',
    role: 'Brand Manager',
    rating: 5,
    comment: 'Boot 款最喜歡的是包覆感，從腳到小腿整段都被照顧到，適合回家後完整收尾。',
    date: '2026-03-08',
    verified: true,
  },
  {
    id: '3',
    productId: '3',
    author: 'Wendy',
    role: 'Project Lead',
    rating: 4,
    comment: '頸肩這款外型很漂亮，不像一般按摩器那麼笨重。閱讀時拉帶一拉，肩頸很快就鬆下來。',
    date: '2026-03-05',
    verified: true,
  },
  {
    id: '4',
    productId: '1',
    author: '志偉',
    role: 'Runner',
    rating: 5,
    comment: '跑步後用 Calf 做恢復很有感，尤其晚間用完之後，隔天腿會輕很多。',
    date: '2026-02-28',
    verified: true,
  },
  {
    id: '5',
    productId: '2',
    author: '淑芬',
    role: 'Studio Founder',
    rating: 5,
    comment: 'Boot 的存在感很強，但正因為包覆完整，放鬆感真的跟小腿款完全不一樣。',
    date: '2026-02-25',
    verified: true,
  },
  {
    id: '6',
    productId: '3',
    author: 'Mika',
    role: 'Art Director',
    rating: 4,
    comment: '很喜歡 Neck & Shoulder 的 Titan White 配色，放在家裡不突兀，按鍵也很好上手。',
    date: '2026-02-20',
    verified: true,
  },
];

export const certifications = ['CE', 'BSMI', 'SGS', '1 Year Warranty', 'Taiwan Support'];

export const heroCertificationBadges = ['Smart Design', 'Wearable Relief', 'Premium Finish'];
