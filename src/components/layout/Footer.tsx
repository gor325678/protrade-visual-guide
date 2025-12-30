import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Phone, ArrowUp, Youtube, Instagram, Send, X as XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Footer = () => {
  const { t } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Social Media Links (Mocked for now mostly, except Telegram from previous context)
  const socialLinks = [
    { icon: <Youtube size={20} />, href: '#', label: 'YouTube' },
    { icon: <Instagram size={20} />, href: '#', label: 'Instagram' },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 12.5a6.32 6.32 0 0 0 12.6 0V5.75a4.85 4.85 0 0 0 2-5h3.45a8.47 8.47 0 0 1-3.46 4.94z" />
        </svg>
      ),
      href: '#',
      label: 'TikTok'
    },
    { icon: <XIcon size={20} />, href: '#', label: 'X' },
    { icon: <Send size={20} />, href: 'https://t.me/forexgbpgpy', label: 'Telegram' },
  ];

  return (
    <footer className="w-full bg-black py-8 px-4 border-t border-zinc-900 mt-auto no-select">
      <div className="max-w-7xl mx-auto flex flex-col space-y-8">

        {/* Top Row: Contacts */}
        <div className="flex justify-end">
          <a href="#" className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors bg-zinc-900/50 px-4 py-2 rounded-lg">
            <span>{t('footer.contacts')}</span>
            <Phone size={18} className="fill-white" />
          </a>
        </div>

        {/* Middle Row: Socials & Scroll Top */}
        <div className="flex flex-col md:flex-row justify-between items-center relative gap-6">
          {/* Spacer to balance the layout for centering socials */}
          <div className="hidden md:block w-[50px]"></div>

          {/* Social Icons (Centered) */}
          <div className="flex items-center gap-8">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-500 hover:text-white transition-colors transform hover:scale-110"
                aria-label={social.label}
              >
                {social.icon}
              </a>
            ))}
          </div>

          {/* Scroll to Top (Right) */}
          <Button
            onClick={scrollToTop}
            className="rounded-full w-12 h-12 bg-zinc-900 text-white hover:bg-zinc-800 border border-zinc-800 flex items-center justify-center transition-all p-0"
          >
            <ArrowUp size={20} />
          </Button>
        </div>

        {/* Bottom Row: Legal Links */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8 text-sm text-zinc-500 pt-8 border-t border-zinc-900/50">
          <Link
            to="/public-offer"
            className="hover:text-zinc-300 transition-colors"
          >
            {t('footer.offer')}
          </Link>
          <span className="hidden md:inline text-zinc-800">•</span>
          <Link
            to="/privacy-policy"
            className="hover:text-zinc-300 transition-colors"
          >
            {t('footer.privacy')}
          </Link>
          <span className="hidden md:inline text-zinc-800">•</span>
          <Link
            to="/eligible-clients"
            className="hover:text-zinc-300 transition-colors"
          >
            {t('footer.admissible')}
          </Link>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
