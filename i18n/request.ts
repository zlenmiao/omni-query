import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

export const languages = [
  {
    code: 'en-US',
    lang: 'en',
    label: 'English',
  },
  {
    code: 'zh-CN',
    lang: 'zh',
    label: '简体中文',
  },
];

export const locales = languages.map((lang) => lang.lang);

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;
  // Validate that the incoming `locale` parameter is valid
  if (!locale) notFound();

  return {
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
