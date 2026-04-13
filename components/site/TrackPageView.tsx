'use client';

import { useEffect } from 'react';

function getVisitorId() {
  const key = 'vichengnet_visitor_id';
  const existing = localStorage.getItem(key);
  if (existing) return existing;
  const id = crypto.randomUUID();
  localStorage.setItem(key, id);
  return id;
}

function getLandingReferrer() {
  const key = 'vichengnet_landing_referrer';
  const existing = sessionStorage.getItem(key);
  if (existing !== null) return existing;
  const first = document.referrer || '';
  sessionStorage.setItem(key, first);
  return first;
}

export default function TrackPageView({ path }: { path: string }) {
  useEffect(() => {
    const visitorId = getVisitorId();
    const sessionId = sessionStorage.getItem('vichengnet_session_id') || crypto.randomUUID();
    sessionStorage.setItem('vichengnet_session_id', sessionId);
    const landingReferrer = getLandingReferrer();
    const params = new URLSearchParams(window.location.search);
    const utmSource = params.get('utm_source') || '';

    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path,
        visitorId,
        sessionId,
        referer: document.referrer || '',
        landingReferrer,
        utmSource,
        userAgent: navigator.userAgent,
      }),
      keepalive: true,
    }).catch(() => {});
  }, [path]);

  return null;
}
