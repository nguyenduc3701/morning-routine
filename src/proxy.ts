import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';
import {NextRequest} from 'next/server';

const handleI18nRouting = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  if (!request.cookies.has('NEXT_LOCALE')) {
    request.headers.delete('accept-language');
  }
  return handleI18nRouting(request);
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(vi|en|jp|cn|kr)/:path*']
};
