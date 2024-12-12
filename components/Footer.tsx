import { useTranslations } from 'next-intl';

const Footer = () => {
  const t = useTranslations('footer');

  return (
    <footer className="bg-gray-100 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-600">{t('copyright')}</p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-600 hover:text-blue-600">{t('terms')}</a>
            <a href="#" className="text-gray-600 hover:text-blue-600">{t('privacy')}</a>
            <a href="#" className="text-gray-600 hover:text-blue-600">{t('contact')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
