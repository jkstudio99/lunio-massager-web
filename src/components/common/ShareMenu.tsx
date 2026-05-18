import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Link2, Check, X } from 'lucide-react';
import { FaFacebookF, FaLine, FaXTwitter } from 'react-icons/fa6';
import { useI18n } from '@/store/i18n';
import { useToastStore } from '@/store/toast';

interface ShareMenuProps {
  url?: string;
  title?: string;
  /** 'button' = standalone button, 'inline' = just the icon trigger (for embedding) */
  variant?: 'button' | 'inline';
  className?: string;
}

export default function ShareMenu({ url, title = '', variant = 'button', className = '' }: ShareMenuProps) {
  const { t } = useI18n();
  const addToast = useToastStore((s) => s.addToast);
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const shareUrl = url || window.location.href;
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const menuWidth = 224; // w-56 = 14rem = 224px
    let left = rect.right - menuWidth;
    if (left < 8) left = 8;
    setMenuPos({ top: rect.bottom + 8, left });
  }, []);

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    updatePosition();
    const handler = (e: MouseEvent) => {
      if (
        menuRef.current && !menuRef.current.contains(e.target as Node) &&
        triggerRef.current && !triggerRef.current.contains(e.target as Node)
      ) setOpen(false);
    };
    const scrollHandler = () => updatePosition();
    document.addEventListener('mousedown', handler);
    window.addEventListener('scroll', scrollHandler, true);
    window.addEventListener('resize', scrollHandler);
    return () => {
      document.removeEventListener('mousedown', handler);
      window.removeEventListener('scroll', scrollHandler, true);
      window.removeEventListener('resize', scrollHandler);
    };
  }, [open, updatePosition]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      addToast(t.share.linkCopied, 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      addToast(t.share.copyFailed, 'error');
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url: shareUrl });
        setOpen(false);
      } catch {
        // User cancelled — ignore
      }
    }
  };

  const socials = [
    {
      name: 'Facebook',
      icon: <FaFacebookF size={16} />,
      color: 'hover:bg-[#1877f2] hover:text-white',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      name: 'X (Twitter)',
      icon: <FaXTwitter size={16} />,
      color: 'hover:bg-black hover:text-white',
      href: `https://x.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      name: 'LINE',
      icon: <FaLine size={18} />,
      color: 'hover:bg-[#06C755] hover:text-white',
      href: `https://social-plugins.line.me/lineit/share?url=${encodedUrl}`,
    },
  ];

  const handleToggle = () => {
    if (!open) updatePosition();
    setOpen(!open);
  };

  return (
    <span className="inline-block">
      <button
        ref={triggerRef}
        onClick={handleToggle}
        className={variant === 'button'
          ? `inline-flex items-center gap-1.5 text-sm font-medium text-secondary hover:text-crocus transition-colors ${className}`
          : `inline-flex items-center gap-1.5 text-xs text-muted hover:text-crocus transition-colors ${className}`
        }
      >
        <Share2 size={variant === 'button' ? 16 : 14} />
        {t.share.share}
      </button>

      {createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, scale: 0.95, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -4 }}
              transition={{ duration: 0.15 }}
              style={{ position: 'fixed', top: menuPos.top, left: menuPos.left, zIndex: 9999 }}
              className="w-56 bg-surface border border-default rounded-xl shadow-xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-default">
                <p className="text-sm font-semibold text-primary">{t.share.shareVia}</p>
                <button onClick={() => setOpen(false)} className="text-muted hover:text-primary transition-colors">
                  <X size={14} />
                </button>
              </div>

              {/* Social buttons */}
              <div className="p-2">
                {socials.map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-secondary transition-all ${s.color}`}
                  >
                    {s.icon}
                    {s.name}
                  </a>
                ))}

                {/* Copy link */}
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-secondary hover:bg-surface-alt transition-all w-full"
                >
                  {copied ? <Check size={16} className="text-emerald-500" /> : <Link2 size={16} />}
                  {copied ? t.share.copied : t.share.copyLink}
                </button>

                {/* Native share (mobile) */}
                {typeof navigator !== 'undefined' && navigator.share && (
                  <button
                    onClick={handleNativeShare}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-secondary hover:bg-surface-alt transition-all w-full"
                  >
                    <Share2 size={16} />
                    {t.share.more}
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </span>
  );
}
