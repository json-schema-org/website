import type {
  BowtieImplementations,
  JSONSchemaTool,
} from '~/pages/tools/JSONSchemaTool';
import {
  buildBowtieIndex,
  findBowtieImplementations,
  getBowtieBadgeUrl,
  getBowtieImplementationUrl,
  getToolBowtieInfo,
  newestDraft,
  normalizeLanguage,
  normalizeSourceUrl,
  parseCompliance,
} from '~/pages/tools/lib/bowtie';

const DRAFT_2020_12 = 'https://json-schema.org/draft/2020-12/schema';
const DRAFT_2019_09 = 'https://json-schema.org/draft/2019-09/schema';
const DRAFT_7 = 'http://json-schema.org/draft-07/schema#';

const implementations: BowtieImplementations = {
  'js-ajv': {
    name: 'ajv',
    language: 'javascript',
    source: 'https://github.com/ajv-validator/ajv',
    dialects: [DRAFT_2020_12, DRAFT_7],
  },
  'dotnet-polyglot': {
    name: 'polyglot',
    language: 'dotnet',
    source: 'https://github.com/example/Polyglot',
    dialects: [DRAFT_2020_12, DRAFT_2019_09],
  },
  'rust-polyglot': {
    name: 'polyglot',
    language: 'rust',
    source: 'https://github.com/example/Polyglot',
    dialects: [DRAFT_2020_12],
  },
  'python-old': {
    name: 'old',
    language: 'python',
    source: 'https://github.com/example/old.git',
    dialects: [DRAFT_7],
  },
};

const index = buildBowtieIndex(implementations);

const tool = (overrides: Partial<JSONSchemaTool>): JSONSchemaTool => ({
  name: 'A tool',
  toolingTypes: ['validator'],
  ...overrides,
});

const ids = (found: { id: string }[]) => found.map(({ id }) => id);

describe('Bowtie helpers for the tooling page', () => {
  describe('normalizeSourceUrl', () => {
    it('ignores case, www, trailing slashes, .git, queries and fragments', () => {
      [
        'https://GitHub.com/Example/Repo',
        'https://www.github.com/example/repo/',
        'https://github.com/example/repo.git',
        'https://github.com/example/repo?tab=readme#top',
      ].forEach((url) => {
        expect(normalizeSourceUrl(url)).to.equal(
          'https://github.com/example/repo',
        );
      });
    });
  });

  describe('normalizeLanguage', () => {
    it('reconciles the names used by Bowtie and by the tooling data', () => {
      expect(normalizeLanguage('.NET')).to.equal('dotnet');
      expect(normalizeLanguage('dotnet')).to.equal('dotnet');
      expect(normalizeLanguage('C++')).to.equal('c++');
      expect(normalizeLanguage('JavaScript')).to.equal('javascript');
      expect(normalizeLanguage('Rust')).to.equal('rust');
    });
  });

  describe('findBowtieImplementations', () => {
    it('uses the identifiers Bowtie gives its implementations', () => {
      const found = findBowtieImplementations(
        tool({ source: 'https://github.com/ajv-validator/ajv' }),
        index,
      );

      expect(ids(found)).to.deep.equal(['js-ajv']);
      expect(getBowtieImplementationUrl(found[0])).to.equal(
        'https://bowtie.report/#/implementations/js-ajv',
      );
      expect(getBowtieBadgeUrl(found[0], '2020-12')).to.equal(
        'https://bowtie.report/badges/js-ajv/compliance/draft2020-12.json',
      );
    });

    it('matches a tool living in a subdirectory of a repository', () => {
      const found = findBowtieImplementations(
        tool({
          source: 'https://github.com/ajv-validator/ajv/tree/main/packages/x',
        }),
        index,
      );

      expect(ids(found)).to.deep.equal(['js-ajv']);
    });

    it('tells apart implementations sharing a repository by language', () => {
      const source = 'https://github.com/example/polyglot';

      expect(
        ids(
          findBowtieImplementations(
            tool({ source, languages: ['.NET'] }),
            index,
          ),
        ),
      ).to.deep.equal(['dotnet-polyglot']);

      expect(
        ids(
          findBowtieImplementations(
            tool({ source, languages: ['.NET', 'Rust'] }),
            index,
          ),
        ),
      ).to.deep.equal(['dotnet-polyglot', 'rust-polyglot']);
    });

    it('prefers the languages being filtered by', () => {
      const found = findBowtieImplementations(
        tool({
          source: 'https://github.com/example/polyglot',
          languages: ['.NET', 'Rust'],
        }),
        index,
        ['Rust', 'Go'],
      );

      expect(ids(found)).to.deep.equal(['rust-polyglot']);
    });

    it('falls back to every implementation when no language matches', () => {
      const found = findBowtieImplementations(
        tool({
          source: 'https://github.com/example/polyglot',
          languages: ['Python'],
        }),
        index,
      );

      expect(ids(found)).to.deep.equal(['dotnet-polyglot', 'rust-polyglot']);
    });

    it('finds nothing without a source, a match, or an index', () => {
      expect(findBowtieImplementations(tool({}), index)).to.deep.equal([]);
      expect(
        findBowtieImplementations(
          tool({ source: 'https://example.com/unknown' }),
          index,
        ),
      ).to.deep.equal([]);
      expect(
        findBowtieImplementations(
          tool({ source: 'https://github.com/ajv-validator/ajv' }),
          null,
        ),
      ).to.deep.equal([]);
    });
  });

  describe('getToolBowtieInfo', () => {
    const ajv = tool({ source: 'https://github.com/ajv-validator/ajv' });

    it('reports on the selected dialect', () => {
      const info = getToolBowtieInfo(ajv, index, { draft: '7' });

      expect(info.kind).to.equal('tested');
      expect(info.results).to.have.length(1);
      expect(info.results[0].draft).to.equal('7');
      expect(info.results[0].badgeUrl).to.equal(
        'https://bowtie.report/badges/js-ajv/compliance/draft7.json',
      );
      expect(info.results[0].compliance).to.equal(null);
    });

    it('reports on the newest dialect Bowtie tests when none is selected', () => {
      const old = tool({ source: 'https://github.com/example/old' });

      expect(getToolBowtieInfo(ajv, index).results[0].draft).to.equal(
        '2020-12',
      );
      expect(getToolBowtieInfo(old, index).results[0].draft).to.equal('7');
    });

    it('says when Bowtie does not test the selected dialect', () => {
      const info = getToolBowtieInfo(ajv, index, { draft: '2019-09' });

      expect(info.kind).to.equal('untested');
      expect(info.results).to.deep.equal([]);
      expect(ids(info.implementations)).to.deep.equal(['js-ajv']);
    });

    it('puts the best of several implementations first', () => {
      const polyglot = tool({
        source: 'https://github.com/example/polyglot',
        languages: ['.NET', 'Rust'],
      });
      const badge = (message: string) => ({
        label: 'Draft 2020-12',
        message,
        color: '006400',
      });
      const info = getToolBowtieInfo(
        polyglot,
        index,
        { draft: '2020-12' },
        {
          'https://bowtie.report/badges/dotnet-polyglot/compliance/draft2020-12.json':
            badge('91% Passing'),
          'https://bowtie.report/badges/rust-polyglot/compliance/draft2020-12.json':
            badge('100% Passing'),
        },
      );

      expect(
        info.results.map(({ implementation, compliance }) => [
          implementation.id,
          compliance,
        ]),
      ).to.deep.equal([
        ['rust-polyglot', 100],
        ['dotnet-polyglot', 91],
      ]);
    });

    it('distinguishes validators missing from Bowtie from other tools', () => {
      const source = 'https://example.com/unknown';

      expect(getToolBowtieInfo(tool({ source }), index).kind).to.equal(
        'not-on-bowtie',
      );
      expect(
        getToolBowtieInfo(tool({ source, toolingTypes: ['editor'] }), index)
          .kind,
      ).to.equal('not-applicable');
      expect(getToolBowtieInfo(tool({ source }), null).kind).to.equal(
        'unknown',
      );
    });
  });

  describe('parseCompliance', () => {
    it('reads the percentage out of a badge', () => {
      const badge = { label: 'Draft 7', color: '006400' };

      expect(parseCompliance({ ...badge, message: '98% Passing' })).to.equal(
        98,
      );
      expect(parseCompliance({ ...badge, message: '99.5% Passing' })).to.equal(
        99.5,
      );
      expect(parseCompliance({ ...badge, message: 'unknown' })).to.equal(null);
      expect(parseCompliance(null)).to.equal(null);
      expect(parseCompliance(undefined)).to.equal(null);
    });
  });

  describe('newestDraft', () => {
    it('picks the most recent of several drafts', () => {
      expect(newestDraft(['4', '2019-09', '7'])).to.equal('2019-09');
      expect(newestDraft([])).to.equal(undefined);
    });
  });
});
