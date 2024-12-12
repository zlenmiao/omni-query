'use client';

import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function LanguageSwitch() {
  const t = useTranslations('header');
  const locale = useLocale();
  const router = useRouter();

  const switchLanguage = (newLocale: string) => {
    const currentPath = window.location.pathname;
    // 如果当前路径是根路径或只有语言前缀
    if (currentPath === '/' || currentPath === `/${locale}`) {
      router.push(`/${newLocale}`);
    } else {
      // 对于其他路径，替换语言部分
      const pathWithoutLocale = currentPath.replace(`/${locale}/`, '/');
      router.push(`/${newLocale}${pathWithoutLocale}`);
    }
  };

  return (
    <div className="relative inline-block text-left">
      <select
        value={locale}
        onChange={(e) => switchLanguage(e.target.value)}
        className="block w-full px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        aria-label={t('language')}
      >
        <option value="zh">中文</option>
        <option value="en">English</option>
      </select>
    </div>
  );
}
