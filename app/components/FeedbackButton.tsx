"use client";

import React, { useState } from 'react';
import FeedbackModal from './FeedbackModal';

export default function FeedbackButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* Floating Feedback Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="
          fixed bottom-6 right-6 z-50
          bg-green-600 hover:bg-green-700
          text-white font-bold
          px-4 py-3 rounded-full
          shadow-lg hover:shadow-xl
          transition-all duration-300
          hover:scale-105
          flex items-center gap-2
          border-2 border-green-600
        "
        style={{
          backgroundColor: '#2d8f47',
          borderColor: '#2d8f47',
          fontFamily: "'Chalets-Legweb', 'Inter', system-ui, sans-serif",
          fontWeight: 'normal',
          letterSpacing: '0.05em',
        }}
        aria-label="Report a bug or suggest improvement"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 12l2 2 4-4"/>
          <path d="M21 12c-1 0-3-1-3-3s2-3 3-3"/>
          <path d="M3 12c1 0 3-1 3-3s-2-3-3-3"/>
          <path d="M12 3c0 1-1 3-3 3s-3-2-3-3"/>
          <path d="M12 21c0-1-1-3-3-3s-3 2-3 3"/>
        </svg>
        <span className="text-sm uppercase tracking-wide">Feedback</span>
      </button>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
