import createMiddleware from 'next-intl/middleware';
 
export default createMiddleware({
  // A list of all locales that are supported
  locales: ['zh', 'en'],
  // Used when no locale matches
  defaultLocale: 'zh',
  // Skip locale prefix for default locale
  localePrefix: 'as-needed'
});

export const config = {
  // Match all pathnames except for
  // - API routes
  // - Asset files
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
