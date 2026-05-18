import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { useI18n } from '@/store/i18n';
import { useCookieStore } from '@/store/cookie';

export default function Footer() {
  const { t, locale } = useI18n();
  const isZh = locale === 'zh-TW';

  const footerSections = [
    {
      title: t.footer.productsTitle,
      links: [
        { name: t.footer.allProducts, path: '/products' },
        { name: t.footer.bootMassager, path: '/product/boot-massager' },
        { name: t.footer.calfMassager, path: '/product/calf-massager' },
        { name: t.footer.neckShoulder, path: '/product/neck-shoulder' },
      ],
    },
    {
      title: t.footer.serviceTitle,
      links: [
        { name: t.footer.faq, path: '/support' },
        { name: t.footer.shippingInfo, path: '/support' },
        { name: t.footer.returnPolicy, path: '/support' },
        { name: t.footer.warrantyService, path: '/support' },
      ],
    },
    {
      title: t.footer.companyTitle,
      links: [
        { name: t.footer.aboutLunio, path: '/about' },
        { name: t.footer.blogSection, path: '/blog' },
        { name: isZh ? '顧客評價' : 'Reviews', path: '/reviews' },
        { name: isZh ? '門市據點' : 'Store Locations', path: '/store' },
      ],
    },
  ];

  const socialLinks = [
    { icon: FaFacebook, label: 'Facebook', href: '#' },
    { icon: FaInstagram, label: 'Instagram', href: '#' },
    { icon: FaYoutube, label: 'YouTube', href: '#' },
    { icon: MdEmail, label: 'Email', href: 'mailto:hello@lunio.com.tw' },
  ];

  return (
    <footer className="bg-brand text-white">
      {/* Newsletter */}
      <div className="border-b border-white/10">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-14 lg:py-20">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.3em] uppercase text-white/55 mb-3">{t.footer.stayInTouch}</p>
              <h3 className="text-2xl lg:text-3xl font-bold tracking-[-0.03em] mb-2">{t.footer.newsletter}</h3>
              <p className="text-white/60 text-sm max-w-xl">{t.footer.newsletterDesc}</p>
            </div>
            <div className="flex w-full lg:w-auto flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder={t.footer.emailPlaceholder}
                className="w-full sm:flex-1 lg:w-80 h-12 px-5 bg-white/8 border border-white/10 rounded-full text-sm text-white placeholder:text-white/35 focus:outline-none focus:border-crocus focus:ring-1 focus:ring-crocus/30 transition-colors"
              />
              <button className="h-12 px-6 bg-crocus hover:bg-crocus-hover text-white text-sm font-medium rounded-full transition-colors whitespace-nowrap w-full sm:w-auto">
                {t.footer.subscribe}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-14 lg:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="inline-block mb-5">
              <img src="/img/lunio logo white.png" alt="Lunio" className="h-7" />
            </Link>
            <p className="text-white/55 text-sm leading-relaxed mb-6 max-w-[280px]">
              {t.footer.tagline}
            </p>
            <div className="flex gap-2">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  className="flex items-center justify-center w-9 h-9 rounded-full bg-white/5 hover:bg-crocus text-white/70 hover:text-white transition-all"
                  aria-label={label}
                >
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </div>

          {/* Link sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-xs font-semibold mb-5 text-white/70 uppercase tracking-wider">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-sm text-white/55 hover:text-crocus transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-white/35">
            <p>{t.footer.copyright}</p>
            <div className="flex gap-6">
              <Link to="/privacy" className="hover:text-white/55 transition-colors">{t.footer.privacyPolicy}</Link>
              <Link to="/terms" className="hover:text-white/55 transition-colors">{t.footer.termsOfService}</Link>
              <button
                onClick={() => useCookieStore.getState().openSettings()}
                className="hover:text-white/55 transition-colors"
              >
                {t.footer.cookieSettings}
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
