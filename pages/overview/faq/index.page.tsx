import React from 'react';
import { getLayout } from '~/components/Sidebar';
import Head from 'next/head';
import { SectionContext } from '~/context';
import Faq from '~/components/Faq';
import { Headline1 } from '~/components/Headlines';

export default function Content() {
  const newTitle = 'FAQ';

  return (
    <SectionContext.Provider value='docs'>
      <Head>
        <title>{newTitle}</title>
      </Head>
      <Headline1>{newTitle}</Headline1>
      <p>
        Below you'll find answers to questions we get asked the most about JSON
        Schema.
      </p>

      <Faq category='general' />
    </SectionContext.Provider>
  );
}
Content.getLayout = getLayout;
