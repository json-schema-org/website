import React, { useState, useEffect } from 'react';

type AnnouncementBannerProps = {
  bannerRef?: React.RefObject<HTMLDivElement>;
  onHeightChange?: (height: number) => void;
};

export default function AnnouncementBanner({
  bannerRef,
  onHeightChange,
}: AnnouncementBannerProps) {
  const [visible, setVisible] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const updateHeight = () => {
      onHeightChange?.(bannerRef?.current?.getBoundingClientRect().height ?? 0);
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);

    return () => window.removeEventListener('resize', updateHeight);
  }, [bannerRef, onHeightChange, visible, dismissed]);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
    setTimeout(() => setTextVisible(true), 400);
  }, []);

  if (dismissed) return null;

  return (
    <div
      ref={bannerRef}
      data-testid='announcement-banner'
      className={`sticky top-0 z-50 bg-blue-700 text-white px-4 py-3 text-center transition-all duration-500 ease-in-out ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <span
        className={`inline-block transition-all duration-500 ease-out ${
          textVisible ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
        }`}
      >
        The JSON Schema Office Hours Now Runs Weekly!{' '}
        <a
          href='https://github.com/orgs/json-schema-org/discussions/34'
          className='underline'
        >
          Join Us!
        </a>
      </span>

      <button
        onClick={() => {
          setVisible(false);
          setTimeout(() => setDismissed(true), 500);
        }}
        aria-label='Dismiss banner'
        className='absolute right-3 top-1/2 -translate-y-1/2 text-white text-lg leading-none hover:text-violet-300 transition-colors'
      >
        ✕
      </button>
    </div>
  );
}
