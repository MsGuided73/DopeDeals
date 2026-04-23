"use client";
import { Toaster } from 'react-hot-toast';

/* ─────────────────────────────────────────────
   Highway Road-Sign Toast Theme
   ─────────────────────────────────────────────
   Base:    Interstate highway sign (dark green + white border)
   Success: Green highway sign   ✅
   Error:   Red warning/wrong-way sign ⛔
   Loading: Orange construction / work-zone sign 🚧
   ───────────────────────────────────────────── */

const sharedSign = {
  fontFamily: "'Highway Gothic', 'Oswald', 'Impact', 'Arial Narrow', sans-serif",
  letterSpacing: '0.06em',
  textTransform: 'uppercase' as const,
  fontSize: '15px',
  fontWeight: '700',
  padding: '14px 22px 14px 18px',
  borderRadius: '4px',
  boxShadow:
    '0 0 0 3px rgba(255,255,255,0.90), 0 0 0 5px rgba(0,0,0,0.6), 0 6px 20px rgba(0,0,0,0.5)',
  maxWidth: '420px',
  minWidth: '280px',
  lineHeight: '1.4',
};

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={10}
      toastOptions={{
        duration: 4000,

        // ── Default: dark green Interstate sign ──────────────────────────
        style: {
          ...sharedSign,
          background: '#1A472A',   // FHWA sign green
          color: '#FFFFFF',
          borderLeft: '5px solid #FFFFFF',
        },

        // ── Success: bright green with highway shield feel ────────────────
        success: {
          duration: 3500,
          style: {
            ...sharedSign,
            background: '#145A32',
            color: '#FFFFFF',
            borderLeft: '5px solid #2ECC71',
          },
          iconTheme: {
            primary: '#2ECC71',
            secondary: '#145A32',
          },
        },

        // ── Error: WRONG WAY / No-entry red ──────────────────────────────
        error: {
          duration: 5000,
          style: {
            ...sharedSign,
            background: '#7B0000',  // MUTCD red
            color: '#FFFFFF',
            borderLeft: '5px solid #FF0000',
            boxShadow:
              '0 0 0 3px #FFFFFF, 0 0 0 5px #FF0000, 0 6px 20px rgba(0,0,0,0.55)',
          },
          iconTheme: {
            primary: '#FF0000',
            secondary: '#FFFFFF',
          },
        },

        // ── Loading: orange work-zone / construction sign ─────────────────
        loading: {
          style: {
            ...sharedSign,
            background: '#3D1F00',  // dark backing to orange sign
            color: '#F97316',
            borderLeft: '5px solid #F97316',
            boxShadow:
              '0 0 0 3px rgba(249,115,22,0.7), 0 0 0 5px rgba(0,0,0,0.6), 0 6px 20px rgba(0,0,0,0.5)',
          },
          iconTheme: {
            primary: '#F97316',
            secondary: '#3D1F00',
          },
        },
      }}
    />
  );
}
