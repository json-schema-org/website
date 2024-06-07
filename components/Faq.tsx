import React from 'react';
import faqData from '../data/faq.json';
import Accordion from '~/components/Accordion';

export default function Faq({ category }: { category: string }) {
  const filteredFAQs = faqData.filter((item) => item.category === category);

  return (
    <section>
      <div className='max-w-screen-md mx-auto p-8 px-0 ml-0'>
        <h2 className='text-2xl font-bold text-[24px] mb-4'>
          {category.toUpperCase()}
        </h2>
        <Accordion items={filteredFAQs} />
      </div>
    </section>
  );
}
