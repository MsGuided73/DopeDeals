"use client";

import React, { useState } from 'react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FeedbackType = 'bug' | 'design' | 'feature' | 'other';

export default function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const [feedbackType, setFeedbackType] = useState<FeedbackType>('bug');
  const [description, setDescription] = useState('');
  const [pageUrl, setPageUrl] = useState('');
  const [browser, setBrowser] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: feedbackType,
          description,
          pageUrl: pageUrl || window.location.href,
          browser: browser || navigator.userAgent.substring(0, 100) + (navigator.userAgent.length > 100 ? '...' : ''),
          contactInfo,
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        setSubmitMessage('Thank you for your feedback! We\'ll review it shortly.');
        // Reset form
        setDescription('');
        setPageUrl('');
        setBrowser('');
        setContactInfo('');
        setTimeout(() => {
          onClose();
          setSubmitMessage('');
        }, 2000);
      } else {
        setSubmitMessage('Failed to submit feedback. Please try again.');
      }
    } catch (error) {
      console.error('Feedback submission error:', error);
      setSubmitMessage('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide">
              Report Issue / Feedback
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close modal"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Help us improve! Report bugs, suggest design changes, or request features.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Feedback Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type of Feedback *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'bug', label: '🐛 Bug Report' },
                { value: 'design', label: '🎨 Design Issue' },
                { value: 'feature', label: '✨ Feature Request' },
                { value: 'other', label: '💭 Other' },
              ].map((option) => (
                <label key={option.value} className="flex items-center">
                  <input
                    type="radio"
                    name="feedbackType"
                    value={option.value}
                    checked={feedbackType === option.value}
                    onChange={(e) => setFeedbackType(e.target.value as FeedbackType)}
                    className="mr-2 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please describe the issue or your suggestion in detail..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-vertical min-h-[100px]"
              required
            />
          </div>

          {/* Page URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Page URL (auto-filled)
            </label>
            <input
              type="url"
              value={pageUrl || window.location.href}
              onChange={(e) => setPageUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50"
              readOnly
            />
          </div>

          {/* Browser/Device Info */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Browser/Device (auto-filled)
            </label>
            <input
              type="text"
              value={browser || navigator.userAgent.split(' ').slice(0, 3).join(' ')}
              onChange={(e) => setBrowser(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50"
              readOnly
            />
          </div>

          {/* Contact Info */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Info (optional)
            </label>
            <input
              type="text"
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              placeholder="Email, Discord, or how you'd like us to follow up"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Submit Message */}
          {submitMessage && (
            <div className={`p-3 rounded-lg text-sm ${
              submitMessage.includes('Thank you')
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {submitMessage}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !description.trim()}
              className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition-colors font-medium disabled:cursor-not-allowed"
              style={{
                backgroundColor: isSubmitting || !description.trim() ? '#9ca3af' : '#2d8f47',
              }}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
