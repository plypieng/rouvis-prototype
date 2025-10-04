import { Inter } from 'next/font/google';
import '../../styles/globals.css';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import getMessages, { locales } from '../../i18n';
import SideNav from '../../components/SideNav';
import LanguageSwitcher from '../../components/LanguageSwitcher';

const inter = Inter({ subsets: ['latin'] });

// Generate static params for all supported locales
export function generateStaticParams() {
  return locales.map(locale => ({ locale }));
}

// Layout component following Next.js 15 requirements for dynamic params
export default async function RootLayout(props: { 
  children: React.ReactNode; 
  params: { locale: string };
}) {
  // In Next.js 15.3.2, we need to separate the props extraction to avoid
  // the "params should be awaited" error
  const { children } = props;
  const params = await Promise.resolve(props.params);
  const locale = await params.locale;
  
  if (!locales.includes(locale)) {
    notFound();
  }
  
  // Get messages for the locale
  const messages = await getMessages(locale);

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <div className="flex h-screen bg-gray-50">
            <SideNav />
            <main className="flex-1 overflow-auto">
              <div className="absolute top-4 right-4">
                <LanguageSwitcher locale={locale} />
              </div>
              {children}
            </main>
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
