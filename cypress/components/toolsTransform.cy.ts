import type {
  BowtieImplementation,
  JSONSchemaTool,
} from '~/pages/tools/JSONSchemaTool';
import type { BowtieResult, ToolBowtieInfo } from '~/pages/tools/lib/bowtie';
import {
  countActiveFilters,
  DEFAULT_TRANSFORM,
  filterTools,
  groupTools,
  parseTransform,
  serializeTransform,
  sortTools,
  UNGROUPED,
  type Transform,
} from '~/pages/tools/lib/transformTools';
import type { JSONSchemaDraft } from '~/lib/config';

const implementation: BowtieImplementation = {
  id: 'an-implementation',
  name: 'implementation',
  language: 'javascript',
  source: 'https://example.com',
  dialects: [],
};

const tested = (
  compliance: number | null,
  draft: JSONSchemaDraft = '2020-12',
): ToolBowtieInfo => {
  const result: BowtieResult = {
    implementation,
    draft,
    badgeUrl: 'https://example.com/badge.json',
    badge: undefined,
    compliance,
  };

  return { kind: 'tested', implementation, result };
};

const untested: ToolBowtieInfo = { kind: 'untested', implementation };

const notOnBowtie: ToolBowtieInfo = { kind: 'not-on-bowtie' };

const tool = (
  name: string,
  overrides: Partial<JSONSchemaTool> = {},
): JSONSchemaTool => ({ name, toolingTypes: ['validator'], ...overrides });

const names = (tools: JSONSchemaTool[]) => tools.map(({ name }) => name);

const transform = (overrides: Partial<Transform> = {}): Transform => ({
  ...DEFAULT_TRANSFORM,
  ...overrides,
});

describe('Transforming the list of tools', () => {
  describe('parseTransform', () => {
    it('defaults to every tool, by tool type, sorted by Bowtie compliance', () => {
      expect(parseTransform({})).to.deep.equal(DEFAULT_TRANSFORM);
      expect(DEFAULT_TRANSFORM.groupBy).to.equal('toolingTypes');
      expect(DEFAULT_TRANSFORM.sortBy).to.equal('bowtie');
    });

    it('reads filters from the query string', () => {
      const parsed = parseTransform({
        query: 'schema',
        languages: 'JavaScript,TypeScript',
        drafts: '2020-12,not-a-draft',
        toolingTypes: 'validator',
        showObsolete: 'true',
        sortBy: 'license',
        sortOrder: 'descending',
      });

      expect(parsed).to.deep.include({
        query: 'schema',
        languages: ['JavaScript', 'TypeScript'],
        drafts: ['2020-12'],
        toolingTypes: ['validator'],
        showObsolete: 'true',
        supportsBowtie: 'false',
        sortBy: 'license',
        sortOrder: 'descending',
      });
    });

    it('reads how to group the tools', () => {
      expect(parseTransform({ groupBy: 'languages' }).groupBy).to.equal(
        'languages',
      );
      expect(parseTransform({ groupBy: 'none' }).groupBy).to.equal('none');
      expect(parseTransform({ groupBy: 'nonsense' }).groupBy).to.equal(
        'toolingTypes',
      );
      expect(serializeTransform(transform({ groupBy: 'none' }))).to.deep.equal({
        groupBy: 'none',
      });
    });

    it('sorts names and licenses from A to Z unless told otherwise', () => {
      expect(parseTransform({ sortBy: 'name' }).sortOrder).to.equal(
        'ascending',
      );
    });

    it('keeps the filters of links to the grouped page, but not their sort', () => {
      const parsed = parseTransform({
        query: '',
        sortBy: 'name',
        sortOrder: 'ascending',
        groupBy: 'toolingTypes',
        licenses: '',
        languages: '',
        drafts: '',
        toolingTypes: 'validator',
      });

      expect(parsed).to.deep.equal(transform({ toolingTypes: ['validator'] }));
    });
  });

  describe('serializeTransform', () => {
    it('leaves out everything which is at its default', () => {
      expect(serializeTransform(DEFAULT_TRANSFORM)).to.deep.equal({});
    });

    it('round-trips through the query string', () => {
      const original = transform({
        query: 'schema',
        languages: ['.NET'],
        drafts: ['2020-12', '7'],
        licenses: ['MIT'],
        supportsBowtie: 'true',
        sortBy: 'name',
        sortOrder: 'descending',
      });

      expect(serializeTransform(original)).to.deep.equal({
        query: 'schema',
        languages: '.NET',
        drafts: '2020-12,7',
        licenses: 'MIT',
        supportsBowtie: 'true',
        sortBy: 'name',
        sortOrder: 'descending',
      });
      expect(parseTransform(serializeTransform(original))).to.deep.equal(
        original,
      );
    });
  });

  describe('countActiveFilters', () => {
    it('counts what is narrowing the list, but not the sort order', () => {
      expect(countActiveFilters(DEFAULT_TRANSFORM)).to.equal(0);
      expect(countActiveFilters(transform({ sortBy: 'name' }))).to.equal(0);
      expect(
        countActiveFilters(
          transform({
            query: 'a',
            languages: ['Go', 'Rust'],
            showObsolete: 'true',
          }),
        ),
      ).to.equal(4);
    });
  });

  describe('filterTools', () => {
    const tools = [
      tool('js-validator', {
        languages: ['JavaScript'],
        license: 'MIT',
        supportedDialects: { draft: ['2020-12', '7'] },
      }),
      tool('go-generator', {
        languages: ['Go'],
        toolingTypes: ['schema-to-code'],
        environments: ['CLI'],
        supportedDialects: { draft: ['7'] },
      }),
      tool('retired', { languages: ['Go'], status: 'obsolete' }),
    ];
    const filter = (overrides: Partial<Transform>) =>
      names(
        filterTools(tools, transform(overrides), (candidate) =>
          candidate.name === 'js-validator' ? tested(100) : notOnBowtie,
        ),
      );

    it('lists every tool which is not obsolete by default', () => {
      expect(filter({})).to.deep.equal(['js-validator', 'go-generator']);
      expect(filter({ showObsolete: 'true' })).to.have.length(3);
    });

    it('filters by language, whatever its case', () => {
      expect(filter({ languages: ['go'] })).to.deep.equal(['go-generator']);
      expect(filter({ languages: ['Go', 'JavaScript'] })).to.have.length(2);
    });

    it('filters by dialect, tool type, environment and license', () => {
      expect(filter({ drafts: ['2020-12'] })).to.deep.equal(['js-validator']);
      expect(filter({ toolingTypes: ['schema-to-code'] })).to.deep.equal([
        'go-generator',
      ]);
      expect(filter({ environments: ['CLI'] })).to.deep.equal(['go-generator']);
      expect(filter({ licenses: ['mit'] })).to.deep.equal(['js-validator']);
    });

    it('combines filters', () => {
      expect(filter({ languages: ['Go'], drafts: ['2020-12'] })).to.deep.equal(
        [],
      );
    });

    it('filters to the tools which are on Bowtie', () => {
      expect(filter({ supportsBowtie: 'true' })).to.deep.equal([
        'js-validator',
      ]);
    });
  });

  describe('groupTools', () => {
    const tools = [
      tool('both', {
        toolingTypes: ['annotations', 'validator'],
        languages: ['Go'],
      }),
      tool('editor', { toolingTypes: ['editor'] }),
      tool('validator', { languages: ['.NET', 'C++'] }),
    ];
    const group = (overrides: Partial<Transform>) =>
      groupTools(tools, transform(overrides)).map(
        ({ group: name, tools: grouped }) => [name, names(grouped)],
      );

    it('puts every tool in each of its tool types, in a set order', () => {
      expect(group({ groupBy: 'toolingTypes' })).to.deep.equal([
        ['validator', ['both', 'validator']],
        ['annotations', ['both']],
        ['editor', ['editor']],
      ]);
    });

    it('groups by language, with tools for no language last', () => {
      expect(group({ groupBy: 'languages' })).to.deep.equal([
        ['.NET', ['validator']],
        ['C++', ['validator']],
        ['Go', ['both']],
        [UNGROUPED, ['editor']],
      ]);
    });

    it('only gives the groups being filtered to', () => {
      expect(
        group({ groupBy: 'toolingTypes', toolingTypes: ['Validator'] }),
      ).to.deep.equal([['validator', ['both', 'validator']]]);
    });

    it('gives a single unnamed group when not grouping', () => {
      expect(group({ groupBy: 'none' })).to.deep.equal([
        [null, ['both', 'editor', 'validator']],
      ]);
    });

    it('gives no groups when there are no tools to group', () => {
      expect(groupTools([], transform({}))).to.deep.equal([]);
    });
  });

  describe('sortTools', () => {
    const info: Record<string, ToolBowtieInfo> = {
      zebra: tested(100),
      apple: tested(100),
      Mango: tested(98),
      loading: tested(null),
      legacy: tested(100, '7'),
      elsewhere: untested,
      absent: notOnBowtie,
      another: notOnBowtie,
    };
    const tools = Object.keys(info).map((name) => tool(name));
    const sort = (
      sortBy: Transform['sortBy'],
      sortOrder: Transform['sortOrder'],
    ) =>
      names(sortTools(tools, { sortBy, sortOrder }, ({ name }) => info[name]));

    it('sorts by Bowtie compliance, and alphabetically within that', () => {
      expect(sort('bowtie', 'descending')).to.deep.equal([
        'apple',
        'zebra',
        'Mango',
        'legacy',
        'loading',
        'elsewhere',
        'absent',
        'another',
      ]);
    });

    it('keeps tools without results last when the order is reversed', () => {
      expect(sort('bowtie', 'ascending')).to.deep.equal([
        'legacy',
        'Mango',
        'apple',
        'zebra',
        'loading',
        'elsewhere',
        'absent',
        'another',
      ]);
    });

    it('sorts by name, ignoring case', () => {
      expect(sort('name', 'ascending').slice(0, 4)).to.deep.equal([
        'absent',
        'another',
        'apple',
        'elsewhere',
      ]);
      expect(sort('name', 'descending')[0]).to.equal('zebra');
    });

    it('sorts by license, then name, with unlicensed tools last', () => {
      const licensed = [
        tool('b', { license: 'MIT' }),
        tool('unlicensed'),
        tool('a', { license: 'MIT' }),
        tool('c', { license: 'Apache-2.0' }),
      ];
      const sortByLicense = (sortOrder: Transform['sortOrder']) =>
        names(
          sortTools(
            licensed,
            { sortBy: 'license', sortOrder },
            () => notOnBowtie,
          ),
        );

      expect(sortByLicense('ascending')).to.deep.equal([
        'c',
        'a',
        'b',
        'unlicensed',
      ]);
      expect(sortByLicense('descending')).to.deep.equal([
        'a',
        'b',
        'c',
        'unlicensed',
      ]);
    });
  });
});
