import Link from 'next/link';
import LanguageSwitch from './LanguageSwitch';
import { useTranslations } from 'next-intl';

const Header = () => {
  const t = useTranslations('header');

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <nav className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            {t('title')}
          </Link>
          <div className="flex items-center space-x-4">
            <LanguageSwitch />
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
