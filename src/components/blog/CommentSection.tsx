import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useI18n } from '@/store/i18n';
import { mockComments, type Comment } from '@/data/comments';

function getRelativeTime(dateStr: string, locale: 'zh-TW' | 'en') {
  const now = Date.now();
  const diff = now - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (locale === 'zh-TW') {
    if (days > 0) return `${days} 天前`;
    if (hours > 0) return `${hours} 小時前`;
    if (minutes > 0) return `${minutes} 分鐘前`;
    return '剛剛';
  }
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
  return 'just now';
}

const avatarColors = [
  'bg-crocus text-white',
  'bg-amber-500 text-white',
  'bg-emerald-500 text-white',
  'bg-sky-500 text-white',
  'bg-rose-500 text-white',
  'bg-violet-500 text-white',
];

function getAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

interface CommentItemProps {
  comment: Comment;
  locale: 'zh-TW' | 'en';
  t: any;
  isReply?: boolean;
}

function CommentItem({ comment, locale, t, isReply = false }: CommentItemProps) {
  const [likes, setLikes] = useState(comment.likes);
  const [liked, setLiked] = useState(false);
  const [showReplies, setShowReplies] = useState(false);

  const handleLike = () => {
    if (liked) {
      setLikes((l) => l - 1);
      setLiked(false);
    } else {
      setLikes((l) => l + 1);
      setLiked(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-3 ${isReply ? 'ml-11 mt-3' : ''}`}
    >
      {/* Avatar */}
      <div
        className={`w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold ${getAvatarColor(comment.author.name)}`}
      >
        {comment.author.avatar ? (
          <img
            src={comment.author.avatar}
            alt={comment.author.name}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          comment.author.name.charAt(0).toUpperCase()
        )}
      </div>

      {/* Body */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-primary">
            {comment.author.name}
          </span>
          <span className="text-xs text-muted">
            {getRelativeTime(comment.createdAt, locale)}
          </span>
        </div>
        <p className="text-sm text-secondary mt-1 leading-relaxed">
          {comment.content}
        </p>
        <div className="flex items-center gap-4 mt-2">
          <button
            onClick={handleLike}
            className={`inline-flex items-center gap-1 text-xs transition-colors ${
              liked ? 'text-rose-500' : 'text-muted hover:text-rose-500'
            }`}
          >
            <Heart size={14} fill={liked ? 'currentColor' : 'none'} />
            {likes}
          </button>
          {!isReply && comment.replies && comment.replies.length > 0 && (
            <button
              onClick={() => setShowReplies(!showReplies)}
              className="inline-flex items-center gap-1 text-xs text-muted hover:text-crocus transition-colors"
            >
              <MessageCircle size={14} />
              {comment.replies.length} {t.comments.replies}
              {showReplies ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>
          )}
        </div>

        {/* Nested replies */}
        <AnimatePresence>
          {showReplies &&
            comment.replies?.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                locale={locale}
                t={t}
                isReply
              />
            ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

interface CommentSectionProps {
  postId: string;
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const { t, locale } = useI18n();
  const [comments, setComments] = useState<Comment[]>(() =>
    mockComments.filter((c) => c.postId === postId)
  );
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState<{ name?: boolean; content?: boolean }>({});

  const commentCount = useMemo(() => {
    let count = comments.length;
    comments.forEach((c) => {
      if (c.replies) count += c.replies.length;
    });
    return count;
  }, [comments]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { name?: boolean; content?: boolean } = {};
    if (!name.trim()) newErrors.name = true;
    if (!content.trim()) newErrors.content = true;
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    const newComment: Comment = {
      id: `c-${Date.now()}`,
      postId,
      author: { name: name.trim() },
      content: content.trim(),
      createdAt: new Date().toISOString(),
      likes: 0,
    };
    setComments((prev) => [newComment, ...prev]);
    setName('');
    setContent('');
  };

  return (
    <section className="mt-10 pt-8 border-t border-default">
      {/* Header */}
      <h2 className="text-lg font-bold text-primary mb-6">
        {t.comments.title} ({commentCount})
      </h2>

      {/* Write comment form */}
      <form onSubmit={handleSubmit} className="mb-8 p-5 rounded-2xl bg-surface-alt">
        <p className="text-sm font-semibold text-primary mb-3">
          {t.comments.writeComment}
        </p>
        <input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (errors.name) setErrors((prev) => ({ ...prev, name: false }));
          }}
          placeholder={t.comments.namePlaceholder}
          className={`w-full px-4 py-2.5 rounded-xl border text-sm text-primary bg-surface placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-crocus/40 transition ${
            errors.name ? 'border-rose-400' : 'border-default'
          }`}
        />
        <textarea
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            if (errors.content) setErrors((prev) => ({ ...prev, content: false }));
          }}
          placeholder={t.comments.contentPlaceholder}
          rows={3}
          className={`w-full mt-3 px-4 py-2.5 rounded-xl border text-sm text-primary bg-surface placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-crocus/40 resize-none transition ${
            errors.content ? 'border-rose-400' : 'border-default'
          }`}
        />
        <div className="flex justify-end mt-3">
          <button
            type="submit"
            className="h-11 px-6 rounded-full bg-crocus text-white text-sm font-semibold hover:bg-crocus-hover transition-colors"
          >
            {t.comments.submit}
          </button>
        </div>
      </form>

      {/* Comments list */}
      {comments.length === 0 ? (
        <p className="text-sm text-muted text-center py-8">
          {t.comments.noComments}
        </p>
      ) : (
        <div className="space-y-6">
          <AnimatePresence initial={false}>
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                locale={locale}
                t={t}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </section>
  );
}
