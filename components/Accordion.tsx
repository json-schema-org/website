/* eslint-disable linebreak-style */
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

interface AccordionItem {
  question: string;
  answer: string;
  id: number;
}

interface AccordionProps {
  items: AccordionItem[];
}

const Accordion: React.FC<AccordionProps> = ({ items }) => {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());
  const router = useRouter();

  const handleToggle = (id: number) => {
    setOpenItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  useEffect(() => {
    const hash = router.asPath.split('#')[1];
    if (hash) {
      const id = parseInt(hash, 10);
      const item = items.find((item) => item.id === id);
      if (item) {
        setOpenItems(new Set([id]));
      }
    }
  }, [items, router.asPath]);

  return (
    <div className='w-full space-y-1'>
      {items.map((item) => (
        <Collapsible
          key={item.id}
          open={openItems.has(item.id)}
          onOpenChange={() => handleToggle(item.id)}
          className='w-full'
          data-test={`accordion-item-${item.id}`}
        >
          <div
            className={cn(
              'border border-border dark:border-[#bfdbfe] rounded-lg transition-colors',
              openItems.has(item.id) &&
                'border-primary/50 bg-[#e2e8f0] dark:bg-[#0f172a]',
            )}
          >
            <CollapsibleTrigger
              asChild
              className='w-full'
              data-test={`accordion-toggle-${item.id}`}
            >
              <button
                type='button'
                className='flex items-center justify-between w-full p-4 text-left hover:bg-muted/50 transition-colors rounded-lg group'
                onClick={() => {
                  const isCurrentlyOpen = openItems.has(item.id);
                  if (!isCurrentlyOpen) {
                    setTimeout(() => {
                      const element = document.getElementById(`${item.id}`);
                      if (element) {
                        const navbarHeight = 150;
                        const offset = element.offsetTop - navbarHeight - 20;
                        window.scrollTo({
                          top: offset,
                          behavior: 'smooth',
                        });
                      }
                    }, 100);
                  }
                }}
              >
                <div className='flex-1'>
                  <span
                    className={cn(
                      'text-lg font-medium text-foreground transition-all duration-200 dark:hover:text-[#bfdbfe] group-hover:text-blue-600',
                      openItems.has(item.id) &&
                        'text-primary dark:text-[#bfdbfe]',
                    )}
                    data-test={`accordion-question-${item.id}`}
                  >
                    {item.question}
                  </span>
                </div>
                <div className='ml-4 flex-shrink-0'>
                  <div
                    className={cn(
                      'w-6 h-6 rounded-full border-2 border-border flex items-center justify-center transition-all duration-200',
                      openItems.has(item.id)
                        ? 'border-primary bg-primary text-white rotate-45 dark:bg-[#bfdbfe] dark:text-black dark:border-[#bfdbfe]'
                        : 'group-hover:border-primary/50',
                    )}
                  >
                    <span className='text-sm font-bold leading-none'>
                      {openItems.has(item.id) ? '×' : '+'}
                    </span>
                  </div>
                </div>
              </button>
            </CollapsibleTrigger>

            <CollapsibleContent
              className='overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down'
              data-test={`accordion-answer-${item.id}`}
            >
              <div
                id={`${item.id}`}
                className='px-4 pb-4 text-muted-foreground leading-relaxed'
              >
                {item.answer}
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>
      ))}
    </div>
  );
};

export default Accordion;
