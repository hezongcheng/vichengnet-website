import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { defaultLocale, isLocale } from '@/lib/i18n/config';
import { localeByCountry } from '@/lib/request-geo';

function isPublicAsset(pathname: string) {
  return pathname.startsWith('/_next') || /\.[^/]+$/.test(pathname);
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (isPublicAsset(pathname)) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/admin/login')) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/api')) {
    const protectedApiPrefixes = ['/api/posts', '/api/nav', '/api/settings', '/api/content', '/api/upload'];
    const needsAuth = protectedApiPrefixes.some((prefix) => pathname.startsWith(prefix));

    if (!needsAuth) {
      return NextResponse.next();
    }

    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token || token.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.next();
  }

  if (pathname.startsWith('/admin')) {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      const loginUrl = new URL('/admin/login', req.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  const firstSegment = pathname.split('/').filter(Boolean)[0] || '';
  if (isLocale(firstSegment)) {
    const strippedPath = pathname.slice(firstSegment.length + 1) || '/';

    if (firstSegment === defaultLocale) {
      const canonicalUrl = req.nextUrl.clone();
      canonicalUrl.pathname = strippedPath;
      return NextResponse.redirect(canonicalUrl);
    }

    if (strippedPath.startsWith('/admin')) {
      const adminUrl = req.nextUrl.clone();
      adminUrl.pathname = strippedPath;
      return NextResponse.redirect(adminUrl);
    }

    const rewriteUrl = req.nextUrl.clone();
    rewriteUrl.pathname = strippedPath;
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-locale', firstSegment);
    const res = NextResponse.rewrite(rewriteUrl, {
      request: {
        headers: requestHeaders,
      },
    });
    res.cookies.set('NEXT_LOCALE', firstSegment, { path: '/', maxAge: 60 * 60 * 24 * 365 });
    return res;
  }

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-locale', defaultLocale);
  const res = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  const cookieLocale = req.cookies.get('NEXT_LOCALE')?.value;
  const preferredLocale =
    cookieLocale && isLocale(cookieLocale)
      ? cookieLocale
      : localeByCountry(req.headers, defaultLocale, req.headers.get('accept-language'));
  res.cookies.set('NEXT_LOCALE', preferredLocale, { path: '/', maxAge: 60 * 60 * 24 * 365 });
  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
