"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div style={{
      minHeight: '70vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      textAlign: 'center',
      background: '#ffffff',
      color: '#1c1208'
    }}>
      <h1 style={{
        fontFamily: "'BebasNeue', 'Bebas Neue', sans-serif",
        fontSize: 'clamp(80px, 12vw, 150px)',
        lineHeight: 1,
        margin: '0 0 16px 0',
        color: '#1c1208'
      }}>
        404 <span style={{ color: '#52C41A' }}>LOST</span>
      </h1>
      
      <p style={{
        fontFamily: 'Inter, sans-serif',
        fontSize: '20px',
        maxWidth: '500px',
        margin: '0 0 32px 0',
        color: '#4b5563',
        lineHeight: 1.5
      }}>
        Looks like you took a wrong turn off Highway 420. The page or product you're looking for couldn't be found.
      </p>

      <p style={{
        fontFamily: 'Inter, sans-serif',
        fontSize: '15px',
        margin: '0 0 32px 0',
        color: '#9ca3af'
      }}>
        Redirecting back to the home page in {countdown} seconds...
      </p>

      <Link
        href="/"
        style={{
          display: 'inline-block',
          background: 'radial-gradient(ellipse at 50% 35%, #5FD01D 0%, #52C41A 55%, #42A416 100%)',
          color: '#ffffff',
          fontFamily: "'BebasNeue','Bebas Neue',sans-serif",
          fontSize: '22px',
          letterSpacing: '0.06em',
          padding: '14px 56px',
          textDecoration: 'none',
          borderRadius: '4px',
          transition: 'transform 0.1s',
          boxShadow: '0 4px 14px rgba(82, 196, 26, 0.4)'
        }}
        onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
        onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        TAKE ME HOME
      </Link>
    </div>
  );
}
