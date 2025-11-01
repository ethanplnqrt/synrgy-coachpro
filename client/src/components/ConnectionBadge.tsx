import { useEffect, useState } from 'react';
import { API_BASE } from '../lib/api';

export default function ConnectionBadge() {
  const [status, setStatus] = useState<'ok' | 'down' | 'checking'>('checking');

  useEffect(() => {
    let tries = 0;
    
    const tick = async () => {
      try {
        const res = await fetch(`${API_BASE}/config`);
        if (res.ok) {
          setStatus('ok');
          tries = 0;
        } else {
          throw new Error('bad status');
        }
      } catch {
        tries++;
        if (tries >= 3) {
          setStatus('down');
        }
        const backoff = Math.min(tries * 1000, 5000);
        setTimeout(tick, backoff);
        return;
      }
      setTimeout(tick, 10000);
    };

    tick();
  }, []);

  if (status === 'checking') return null;

  return (
    <div
      className="fixed top-2 right-2 z-50 text-xs rounded-full px-3 py-1.5 shadow-lg"
      style={{
        background: status === 'ok' ? '#16a34a' : '#ef4444',
        color: '#fff'
      }}
    >
      {status === 'ok' ? '🟢 Backend OK' : '🔴 Backend OFF'}
    </div>
  );
}
