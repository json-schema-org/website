import React from 'react';
import { getLayout } from '~/components/Sidebar';
import fs from 'fs';
import matter from 'gray-matter';
import StyledMarkdown from '~/components/StyledMarkdown';
import { SectionContext } from '~/context';
import DocTable from '~/components/DocTable';
import { Headline1 } from '~/components/Headlines';
import { DocsHelp } from '~/components/DocsHelp';
import { TableOfContentMarkdown } from '~/components/StyledMarkdown';
export async function getStaticProps() {
  const index = fs.readFileSync('pages/draft/2019-09/index.md', 'utf-8');
  const { content: indexContent, data: indexData } = matter(index);

  const frontmatter = { ...indexData };
  return {
    props: {
      blocks: {
        index: indexContent,
      },
      frontmatter,
    },
  };
}

export default function ImplementationsPages({
  blocks,
  frontmatter,
}: {
  blocks: any;
  frontmatter: any;
}) {
  return (
    <SectionContext.Provider value={null}>
            <div className="flex pt-4">
            <div className="w-full pr-5">
      <Headline1>{frontmatter.title}</Headline1>
      <DocTable frontmatter={frontmatter} />
      <StyledMarkdown markdown={blocks.index} />
      <DocsHelp />
      </div>
        <div className="w-2/5 lg:block mt-10 hidden sticky top-24 h-[calc(100vh-6rem)] overflow-hidden">
          <div className="h-full overflow-y-auto scrollbar-hidden pl-5">
            <div className="uppercase text-xs text-slate-400 mb-4">On this page</div>
            <TableOfContentMarkdown markdown={blocks.index} depth={3} />
          </div>
        </div>
      </div>
    </SectionContext.Provider>
  );
}
ImplementationsPages.getLayout = getLayout;
