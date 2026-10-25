import { readFileSync, readdirSync } from 'node:fs';
import { resolve, sep } from 'node:path';
import matter from 'gray-matter';

export type BlogFixture = {
  slug: string;
  frontmatter: Record<string, any>;
  content: string;
};

function coverageFor(source: string) {
  const path = resolve(source);
  const coverage = (
    globalThis as typeof globalThis & {
      __coverage__?: Record<string, unknown>;
    }
  ).__coverage__;
  if (!coverage?.[path])
    throw new Error(`Server coverage missing for ${source}`);
  return { [path]: coverage[path] };
}

async function compiledPage(page: string) {
  // Next recompiles shared chunks as routes are requested. Reload its server
  // modules together so the Cypress task never mixes two webpack compilations.
  const serverRoot = `${resolve('.next/server')}${sep}`;
  Object.keys(require.cache).forEach((path) => {
    if (path.startsWith(serverRoot)) delete require.cache[path];
  });
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return await require(resolve('.next/server/pages', `${page}.js`));
}

export const blogMetadataTasks = {
  blogFixtures(): BlogFixture[] {
    return readdirSync('pages/blog/posts')
      .filter((name) => name.endsWith('.md') && !name.startsWith('_'))
      .map((name) => {
        const { data, content } = matter(
          readFileSync(`pages/blog/posts/${name}`, 'utf8'),
        );
        return { slug: name.slice(0, -3), frontmatter: data, content };
      });
  },
  async blogStaticProps(slug: string) {
    // An article request first compiles this module, including its real server exports.
    const { getStaticPaths, getStaticProps } =
      await compiledPage('blog/posts/[slug]');
    return {
      paths: await getStaticPaths(),
      result: await getStaticProps({ params: { slug } }),
      coverage: coverageFor('pages/blog/posts/[slug].page.tsx'),
    };
  },
  async blogIndexStaticProps(type: string | null) {
    const { getStaticProps } = await compiledPage('blog');
    return {
      result: await getStaticProps({ query: type ? { type } : undefined }),
      coverage: coverageFor('pages/blog/index.page.tsx'),
    };
  },
  async homeStaticProps(failCalendar: boolean) {
    const { getStaticProps } = await compiledPage('index');
    const originalFetch = globalThis.fetch;
    const originalError = console.error;
    const errors: string[] = [];
    globalThis.fetch = async () => {
      if (failCalendar) throw new Error('Calendar unavailable in test');
      return new Response(
        'BEGIN:VCALENDAR\r\nVERSION:2.0\r\nEND:VCALENDAR\r\n',
      );
    };
    console.error = (...args: unknown[]) => errors.push(String(args[0]));
    try {
      return {
        result: await getStaticProps({}),
        errors,
        coverage: coverageFor('pages/index.page.tsx'),
      };
    } finally {
      globalThis.fetch = originalFetch;
      console.error = originalError;
    }
  },
};
