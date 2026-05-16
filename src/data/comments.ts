export interface Comment {
  id: string;
  postId: string;
  author: { name: string; avatar?: string };
  content: string;
  createdAt: string;
  likes: number;
  replies?: Comment[];
}

export const mockComments: Comment[] = [
  {
    id: 'c1',
    postId: 'post-1',
    author: { name: '小美' },
    content: '這篇整理得好詳細！我之前買了冰絲的，果然涼感只有剛蓋的時候，看完文章決定換天絲試試看。',
    createdAt: '2026-05-14T10:30:00Z',
    likes: 12,
    replies: [
      {
        id: 'c1r1',
        postId: 'post-1',
        author: { name: 'David Chen' },
        content: '天絲真的很推，我用了半年夏天終於不會半夜踢被子了。',
        createdAt: '2026-05-14T14:20:00Z',
        likes: 5,
      },
    ],
  },
  {
    id: 'c2',
    postId: 'post-1',
    author: { name: '阿明' },
    content: '石墨烯的部分可以再多介紹一些嗎？最近很多品牌都在推，不知道是不是真的有效。',
    createdAt: '2026-05-13T08:15:00Z',
    likes: 8,
  },
  {
    id: 'c3',
    postId: 'post-2',
    author: { name: 'Sarah Wu' },
    content: 'I started using the neck massager two weeks ago and my chronic stiffness has improved so much. Highly recommend for anyone working at a desk all day!',
    createdAt: '2026-05-12T16:45:00Z',
    likes: 15,
    replies: [
      {
        id: 'c3r1',
        postId: 'post-2',
        author: { name: '小琳' },
        content: '請問你是用哪一款呢？我也想買一台給我爸。',
        createdAt: '2026-05-12T19:00:00Z',
        likes: 3,
      },
      {
        id: 'c3r2',
        postId: 'post-2',
        author: { name: 'Sarah Wu' },
        content: 'I got the Lunio Pro Neck model. It has the heat function which really helps with deep knots.',
        createdAt: '2026-05-13T09:10:00Z',
        likes: 7,
      },
    ],
  },
  {
    id: 'c4',
    postId: 'post-3',
    author: { name: '志偉' },
    content: '選購指南寫得很清楚，讓我一次看懂不同類型的差別。最後選了靴型按摩器，腿真的輕鬆很多！',
    createdAt: '2026-05-10T20:30:00Z',
    likes: 9,
  },
  {
    id: 'c5',
    postId: 'post-4',
    author: { name: 'Emily' },
    content: 'Love the idea of creating a relaxation corner at home. I added some essential oils and the Lunio calf massager — perfect evening routine now.',
    createdAt: '2026-05-11T12:00:00Z',
    likes: 11,
  },
  {
    id: 'c6',
    postId: 'post-5',
    author: { name: '阿華' },
    content: '足底按摩真的不只是放鬆而已，我每天按15分鐘，睡眠品質明顯提升，推薦大家試試！',
    createdAt: '2026-05-09T07:45:00Z',
    likes: 14,
    replies: [
      {
        id: 'c6r1',
        postId: 'post-5',
        author: { name: 'Mike' },
        content: 'Same here! My physiotherapist actually recommended daily foot massage for better circulation.',
        createdAt: '2026-05-09T15:30:00Z',
        likes: 6,
      },
    ],
  },
  {
    id: 'c7',
    postId: 'post-6',
    author: { name: '佳琪' },
    content: '上次母親節就是送媽媽頸肩按摩器，她超開心的！今年父親節打算再送一台腿部的給爸爸。',
    createdAt: '2026-05-08T18:20:00Z',
    likes: 18,
  },
  {
    id: 'c8',
    postId: 'post-2',
    author: { name: 'Jason' },
    content: 'The article mentions regular massage can help — how often should you ideally use a neck massager per day?',
    createdAt: '2026-05-15T09:00:00Z',
    likes: 4,
  },
];
