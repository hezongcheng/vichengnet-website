import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCity, getClientIp, getCountryCode } from '@/lib/request-geo';

function parseRefererHost(referer?: string | null) {
  if (!referer) return null;
  try {
    return new URL(referer).host;
  } catch {
    return null;
  }
}

function getDeviceType(ua = '') {
  const lower = ua.toLowerCase();
  if (/mobile|iphone|android/.test(lower)) return 'mobile';
  if (/ipad|tablet/.test(lower)) return 'tablet';
  return 'desktop';
}

function getBrowser(ua = '') {
  const lower = ua.toLowerCase();
  if (lower.includes('edg/')) return 'Edge';
  if (lower.includes('chrome/')) return 'Chrome';
  if (lower.includes('safari/') && !lower.includes('chrome/')) return 'Safari';
  if (lower.includes('firefox/')) return 'Firefox';
  if (lower.includes('msie') || lower.includes('trident/')) return 'IE';
  return 'Unknown';
}

function getOs(ua = '') {
  const lower = ua.toLowerCase();
  if (lower.includes('windows')) return 'Windows';
  if (lower.includes('mac os')) return 'macOS';
  if (lower.includes('android')) return 'Android';
  if (lower.includes('iphone') || lower.includes('ipad') || lower.includes('ios')) return 'iOS';
  if (lower.includes('linux')) return 'Linux';
  return 'Unknown';
}

function isSelfHost(host: string | null, reqHost: string | null) {
  if (!host || !reqHost) return false;
  return host === reqHost || host.startsWith(`${reqHost}:`);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const path = String(body.path || '/');
  const visitorId = String(body.visitorId || 'anonymous');
  const sessionId = body.sessionId ? String(body.sessionId) : null;
  const bodyReferer = body.referer ? String(body.referer) : null;
  const landingReferrer = body.landingReferrer ? String(body.landingReferrer) : null;
  const utmSource = body.utmSource ? String(body.utmSource).trim() : '';
  const userAgent = body.userAgent ? String(body.userAgent) : req.headers.get('user-agent');

  const reqHost = req.headers.get('x-forwarded-host') || req.headers.get('host');
  const headerReferer = req.headers.get('referer');

  const refererCandidates = [bodyReferer, landingReferrer, headerReferer].filter(Boolean) as string[];
  const externalRefererHost =
    refererCandidates
      .map((item) => parseRefererHost(item))
      .find((host) => host && !isSelfHost(host, reqHost)) || null;

  const sourceHost = utmSource ? `utm:${utmSource}` : externalRefererHost || 'direct';

  await prisma.visitEvent.create({
    data: {
      path,
      visitorId,
      sessionId,
      referer: refererCandidates[0] || null,
      refererHost: sourceHost,
      userAgent,
      ip: getClientIp(req.headers),
      deviceType: getDeviceType(userAgent || ''),
      browser: getBrowser(userAgent || ''),
      os: getOs(userAgent || ''),
      country: getCountryCode(req.headers),
      city: getCity(req.headers),
    },
  });

  return NextResponse.json({ success: true });
}
