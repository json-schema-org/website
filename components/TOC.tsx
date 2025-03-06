import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const TOC: React.FC = () => {
  const router = useRouter();
  const [headings, setHeadings] = useState<
    { id: string; text: string; level: number }[]
  >([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const mainContent = document.getElementById('main-content');
    const elements = mainContent
      ? mainContent.querySelectorAll('h1, h2, h3, h4')
      : [];
    const newHeadings: { id: string; text: string; level: number }[] = [];
    elements.forEach((el) => {
      const text = el.textContent || '';
      if (text.trim().toLowerCase() === 'on this page') return;
      if (el.closest('#sidebar')) return;
      const currentFolder = router.pathname.split('/').pop()?.toLowerCase();
      if (text.trim().toLowerCase() === currentFolder) return;
      if (
        text.includes('/') ||
        text.includes('\\') ||
        /\.md$|\.tsx$|\.jsx$|\.js$/i.test(text.trim())
      )
        return;
      const level = parseInt(el.tagName.replace('H', ''));
      if (!el.id) {
        const generatedId = text
          .toLowerCase()
          .trim()
          .replace(/\s+/g, '-')
          .replace(/[^\w-]+/g, '');
        if (generatedId) {
          el.id = generatedId;
        }
      }
      newHeadings.push({
        id: el.id,
        text: text,
        level,
      });
    });
    setHeadings(newHeadings);

    const handleScroll = () => {
      let currentId: string | null = null;
      elements.forEach((el) => {
        const rect = (el as HTMLElement).getBoundingClientRect();
        if (rect.top <= 100) {
          currentId = el.id;
        }
      });
      setActiveId(currentId);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [router.asPath]);

  return (
    <nav className='w-full p-4 sticky top-24 overflow-y-auto scrollbar-hide'>
      <h2 className='text-xl font-bold uppercase text-slate-400 mb-4'>
        On this page
      </h2>
      <ul className=''>
        {headings.map((heading) => (
          <li
            key={heading.id}
            className={`pl-${(heading.level - 1) * 2} ${
              activeId === heading.id
                ? 'text-primary font-semibold'
                : 'text-slate-600'
            }`}
          >
            <a href={`#${heading.id}`}>{heading.text}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default TOC;
