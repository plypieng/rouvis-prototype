export const i18nConfig = {
  locales: ['en', 'ja'],
  defaultLocale: 'en',
  localeDetection: true,
};

export type Locale = (typeof i18nConfig.locales)[number];
