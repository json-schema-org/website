import type {
  BowtieImplementations,
  JSONSchemaTool,
} from '~/pages/tools/JSONSchemaTool';
import {
  buildBowtieIndex,
  findBowtieEngines,
  findBowtieImplementation,
  getBowtieBadgeUrl,
  getBowtieImplementationUrl,
  getToolBowtieInfo,
  newestDraft,
  parseCompliance,
} from '~/pages/tools/lib/bowtie';

const DRAFT_2020_12 = 'https://json-schema.org/draft/2020-12/schema';
const DRAFT_7 = 'http://json-schema.org/draft-07/schema#';

// Several implementations can share a repository, and a name
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
    source: 'https://github.com/example/polyglot',
    dialects: [DRAFT_2020_12],
  },
  'rust-polyglot': {
    name: 'polyglot',
    language: 'rust',
    source: 'https://github.com/example/polyglot',
    dialects: [DRAFT_2020_12],
  },
  'python-old': {
    name: 'old',
    language: 'python',
    source: 'https://github.com/example/old',
    dialects: [DRAFT_7],
  },
};

const index = buildBowtieIndex(implementations);

const tool = (
  identifier?: string,
  overrides: Partial<JSONSchemaTool> = {},
): JSONSchemaTool => ({
  name: 'A tool',
  toolingTypes: ['validator'],
  ...(identifier ? { bowtie: { identifier } } : {}),
  ...overrides,
});

describe('Bowtie helpers for the tooling page', () => {
  describe('findBowtieImplementation', () => {
    it('finds the implementation the tooling data names', () => {
      const found = findBowtieImplementation(tool('js-ajv'), index);

      expect(found?.id).to.equal('js-ajv');
      expect(found?.language).to.equal('javascript');
    });

    it('tells apart implementations which share a repository', () => {
      const source = 'https://github.com/example/polyglot';

      expect(
        findBowtieImplementation(tool('rust-polyglot', { source }), index)?.id,
      ).to.equal('rust-polyglot');
      expect(
        findBowtieImplementation(tool('dotnet-polyglot', { source }), index)
          ?.id,
      ).to.equal('dotnet-polyglot');
    });

    it('does not guess: a tool is only on Bowtie if the data says so', () => {
      expect(
        findBowtieImplementation(
          tool(undefined, { source: 'https://github.com/ajv-validator/ajv' }),
          index,
        ),
      ).to.equal(null);
    });

    it('finds nothing for an unknown identifier, or without an index', () => {
      expect(findBowtieImplementation(tool('js-gone'), index)).to.equal(null);
      expect(findBowtieImplementation(tool('js-ajv'), null)).to.equal(null);
    });

    it('links to the report and badges Bowtie publishes', () => {
      const found = findBowtieImplementation(tool('js-ajv'), index)!;

      expect(getBowtieImplementationUrl(found)).to.equal(
        'https://bowtie.report/#/implementations/js-ajv',
      );
      expect(getBowtieBadgeUrl(found, '2020-12')).to.equal(
        'https://bowtie.report/badges/js-ajv/compliance/draft2020-12.json',
      );
    });
  });

  describe('getToolBowtieInfo', () => {
    it('reports on the selected dialect', () => {
      const info = getToolBowtieInfo(tool('js-ajv'), index, '7');

      expect(info.kind).to.equal('tested');
      expect(info.implementation?.id).to.equal('js-ajv');
      expect(info.result?.draft).to.equal('7');
      expect(info.result?.badgeUrl).to.equal(
        'https://bowtie.report/badges/js-ajv/compliance/draft7.json',
      );
      expect(info.result?.compliance).to.equal(null);
    });

    it('reports on the newest dialect Bowtie tests when none is selected', () => {
      expect(getToolBowtieInfo(tool('js-ajv'), index).result?.draft).to.equal(
        '2020-12',
      );
      expect(
        getToolBowtieInfo(tool('python-old'), index).result?.draft,
      ).to.equal('7');
    });

    it('includes the compliance once its badge has loaded', () => {
      const info = getToolBowtieInfo(tool('js-ajv'), index, '2020-12', {
        'https://bowtie.report/badges/js-ajv/compliance/draft2020-12.json': {
          label: 'Draft 2020-12',
          message: '80% Passing',
          color: '283c00',
        },
      });

      expect(info.result?.compliance).to.equal(80);
      expect(info.result?.badge?.message).to.equal('80% Passing');
    });

    it('says when Bowtie does not test the selected dialect', () => {
      const info = getToolBowtieInfo(tool('js-ajv'), index, '2019-09');

      expect(info.kind).to.equal('untested');
      expect(info.result).to.equal(undefined);
      expect(info.implementation?.id).to.equal('js-ajv');
      expect(info.draft).to.equal('2019-09');
    });

    it('distinguishes validators missing from Bowtie from other tools', () => {
      expect(getToolBowtieInfo(tool(), index).kind).to.equal('not-on-bowtie');
      expect(
        getToolBowtieInfo(tool(undefined, { toolingTypes: ['editor'] }), index)
          .kind,
      ).to.equal('not-applicable');
      expect(getToolBowtieInfo(tool('js-ajv'), null).kind).to.equal('unknown');
    });
  });

  describe('findBowtieEngines', () => {
    const ajv = tool('js-ajv', {
      name: 'ajv',
      source: 'https://github.com/ajv-validator/ajv',
    });
    const cli = tool(undefined, {
      name: 'ajv-cli',
      source: 'https://github.com/ajv-validator/ajv-cli',
      dependsOnValidators: ['https://github.com/ajv-validator/AJV/'],
    });
    const untestedEngine = tool(undefined, {
      name: 'untested',
      source: 'https://github.com/example/untested',
    });
    const onUntested = tool(undefined, {
      name: 'on-untested',
      dependsOnValidators: ['https://github.com/example/untested'],
    });
    const tools = [ajv, cli, untestedEngine, onUntested];
    const engines = findBowtieEngines(tools);

    it('finds the validator a tool is built on, if Bowtie tests it', () => {
      expect(engines.get(cli)).to.equal(ajv);
      expect(engines.has(onUntested)).to.equal(false);
      expect(engines.has(ajv)).to.equal(false);
    });

    it('gives a tool the results of the validator it is built on', () => {
      const info = getToolBowtieInfo(cli, index, '2020-12', {}, engines);

      expect(info.kind).to.equal('tested');
      expect(info.implementation?.id).to.equal('js-ajv');
      expect(info.engine).to.equal(ajv);
      expect(info.result?.badgeUrl).to.equal(
        'https://bowtie.report/badges/js-ajv/compliance/draft2020-12.json',
      );
    });

    it('does not name an engine for a tool Bowtie tests itself', () => {
      const info = getToolBowtieInfo(ajv, index, '2020-12', {}, engines);

      expect(info.implementation?.id).to.equal('js-ajv');
      expect(info.engine).to.equal(undefined);
    });

    it('leaves a tool built on an untested validator off Bowtie', () => {
      expect(
        getToolBowtieInfo(onUntested, index, undefined, {}, engines).kind,
      ).to.equal('not-on-bowtie');
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
