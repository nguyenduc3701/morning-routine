import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import {TopAppBar} from '@/components/layout/TopAppBar';
import {BottomNavBar} from '@/components/layout/BottomNavBar';
import {AppInitializer} from '@/components/layout/AppInitializer';
import '../globals.css'; // Make sure to use the global CSS

export const metadata = {
  title: 'Morning Routine',
  description: 'The day begins in silence.',
  appleWebApp: {
    capable: true,
    title: 'Morning Routine',
    statusBarStyle: 'black-translucent',
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale} className="dark" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Manrope:wght@600;700;800&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-background text-on-surface pb-24">
        <NextIntlClientProvider messages={messages}>
          <AppInitializer />
          <div className="relative z-10 w-full min-h-screen flex flex-col pb-xl md:pb-0">
            <TopAppBar />
            <main className="flex-1 w-full max-w-5xl mx-auto px-container-margin md:px-8 mt-sm space-y-md">
              {children}
            </main>
            <BottomNavBar />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
