import React from 'react';
import { getLayout } from '~/components/Sidebar';
import fs from 'fs';
import matter from 'gray-matter';
import StyledMarkdown from '~/components/StyledMarkdown';
export async function getStaticProps() {
  const block1 = fs.readFileSync(
    'pages/managed-mixed-page/mdblock1.md',
    'utf-8',
  );
  const block2 = fs.readFileSync(
    'pages/managed-mixed-page/mdblock2.md',
    'utf-8',
  );
  const { content: block1Content } = matter(block1);
  const { content: block2Content } = matter(block2);
  return {
    props: {
      blocks: [block1Content, block2Content],
    },
  };
}

export default function ContentExample({ blocks }: { blocks: any[] }) {
  return (
    <>
      <StyledMarkdown markdown={blocks[0]} />
      <div className='bg-red-500'>any custom component here</div>
      <StyledMarkdown markdown={blocks[1]} />
    </>
  );
}
ContentExample.getLayout = getLayout;
