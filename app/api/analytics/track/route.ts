import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function parseRefererHost(referer?: string | null) {
  if (!referer) return null;
  try {
    return new URL(referer).host;
  } catch {
    return null;
  }
}

function getClientIp(req: NextRequest) {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.headers.get('x-real-ip') || null;
}

function getDeviceType(ua = '') {
  const lower = ua.toLowerCase();
  if (/mobile|iphone|android/.test(lower)) return 'mobile';
  if (/ipad|tablet/.test(lower)) return 'tablet';
  return 'desktop';
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const path = String(body.path || '/');
  const visitorId = String(body.visitorId || 'anonymous');
  const sessionId = body.sessionId ? String(body.sessionId) : null;
  const referer = body.referer ? String(body.referer) : null;
  const userAgent = body.userAgent ? String(body.userAgent) : req.headers.get('user-agent');
  const ip = getClientIp(req);

  await prisma.visitEvent.create({
    data: {
      path,
      visitorId,
      sessionId,
      referer,
      refererHost: parseRefererHost(referer),
      userAgent,
      ip,
      deviceType: getDeviceType(userAgent || ''),
      browser: null,
      os: null,
      country: null,
      city: null,
    },
  });

  return NextResponse.json({ success: true });
}
