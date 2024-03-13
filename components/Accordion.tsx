import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

interface AccordionItem {
  question: string;
  answer: string;
  id: number;
}

interface AccordionProps {
  items: AccordionItem[];
}

const Accordion: React.FC<AccordionProps> = ({ items }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const router = useRouter();

  const handleToggle = (index: number) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  useEffect(() => {
    const hash = router.asPath.split('#')[1];
    if (hash) {
      const id = parseInt(hash, 10);
      const index = items.findIndex((item) => item.id === id);
      if (index !== -1) {
        setActiveIndex(index);

        setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) {
            const navbarHeight = 150;
            const offset = element.offsetTop - navbarHeight;
            window.scrollTo({ top: offset, behavior: 'smooth' });
          }
        }, 0);
      }
    }
  }, [items, router.asPath]);

  const handleLinkClick = (id: number) => {
    const index = items.findIndex((item) => item.id === id);
    setActiveIndex(index);

    const newUrl = `#${id}`;
    router.push(newUrl, undefined, { shallow: true });
  };

  return (
    <div>
      {items.map((item, index) => (
        <div
          key={item.id || index}
          className={`overflow-hidden transition-max-height border-t-2 ${
            activeIndex === index ? 'max-h-96' : 'max-h-20'
          } ${index === items.length - 1 ? 'border-b-2' : ''}`}
        >
          <div className='flex justify-between items-center p-4 cursor-pointer'>
            <div className='text-[20px]'>
              <a
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(item.id);
                }}
              >
                {item.question}
              </a>
            </div>
            <div
              className={`transform transition-transform text-[20px] ${
                activeIndex === index ? 'rotate-45' : ''
              }`}
              onClick={() => handleToggle(index)}
            >
              &#43;
            </div>
          </div>
          {activeIndex === index && (
            <div id={`${item.id}`} className='p-2 text-gray-500'>
              {item.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Accordion;
