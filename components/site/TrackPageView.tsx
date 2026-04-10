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

export default function TrackPageView({ path }: { path: string }) {
  useEffect(() => {
    const visitorId = getVisitorId();
    const sessionId = sessionStorage.getItem('vichengnet_session_id') || crypto.randomUUID();
    sessionStorage.setItem('vichengnet_session_id', sessionId);

    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path,
        visitorId,
        sessionId,
        referer: document.referrer || '',
        userAgent: navigator.userAgent,
      }),
      keepalive: true,
    }).catch(() => {});
  }, [path]);

  return null;
}
