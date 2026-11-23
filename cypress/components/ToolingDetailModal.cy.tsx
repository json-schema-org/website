import React from 'react';
import ToolingDetailModal from '~/pages/tools/components/ToolingDetailModal';
import type {
  BowtieImplementation,
  JSONSchemaTool,
} from '~/pages/tools/JSONSchemaTool';
import type { ToolBowtieInfo } from '~/pages/tools/lib/bowtie';

const implementation: BowtieImplementation = {
  id: 'js-example',
  name: 'example',
  language: 'javascript',
  source: 'https://github.com/example/validator',
  version: '1.2.3',
  dialects: [
    'https://json-schema.org/draft/2020-12/schema',
    'http://json-schema.org/draft-07/schema#',
  ],
};

const bowtieInfo: ToolBowtieInfo = { kind: 'untested', implementation };

const tool: JSONSchemaTool = {
  name: 'Example Validator',
  description: 'Validates examples.',
  toolingTypes: ['validator', 'schema-to-code'],
  languages: ['JavaScript', 'TypeScript'],
  environments: ['Command Line'],
  dependsOnValidators: ['https://github.com/example/engine'],
  creators: [
    { name: 'Ada', username: 'ada', platform: 'github' },
    { username: 'anonymous', platform: 'gitlab' },
  ],
  maintainers: [
    { name: 'Grace', username: 'grace', platform: 'github' },
    { username: 'unnamed', platform: 'github' },
  ],
  license: 'MIT',
  source: 'https://github.com/example/validator',
  homepage: 'https://example.com/validator',
  supportedDialects: {
    draft: ['2020-12', '7'],
    additional: [{ name: 'OpenAPI 3.1', source: 'https://example.com/oas' }],
  },
  toolingListingNotes: 'Notes in *markdown*.',
  compliance: {
    config: {
      docs: 'https://example.com/compliance',
      instructions: 'Turn on strict mode.',
    },
  },
  landscape: { logo: 'example.svg', optOut: true },
  status: 'obsolete',
};

const Markdown = ({ markdown }: { markdown?: string }) => (
  <div data-test='notes'>{markdown}</div>
);

const section = (title: string) => cy.contains('h3', title).parent();

const mountModal = (
  props: Partial<React.ComponentProps<typeof ToolingDetailModal>> = {},
) => {
  const onClose = cy.stub().as('onClose');

  cy.mount(
    <ToolingDetailModal
      tool={tool}
      onClose={onClose}
      Markdown={Markdown}
      {...props}
    />,
  );
};

describe('ToolingDetailModal Component', () => {
  beforeEach(() => {
    cy.intercept('GET', 'https://bowtie.report/badges/**', (request) => {
      request.reply({
        label: request.url.includes('draft7') ? 'Draft 7' : 'Draft 2020-12',
        message: request.url.includes('draft7')
          ? '97% Passing'
          : '100% Passing',
        color: '006400',
      });
    }).as('badge');
  });

  it('describes the tool', () => {
    mountModal();

    cy.get('h2').should('contain.text', 'Example Validator');
    cy.get('h2').should('contain.text', 'obsolete');
    cy.contains('Validates examples.');
    cy.get('img[alt="landscape logos"]').should(
      'have.attr',
      'src',
      'img/tools/logos/example.svg',
    );
    section('Source')
      .find('a')
      .should('have.attr', 'href', 'https://github.com/example/validator');
    section('Homepage')
      .find('a')
      .should('have.attr', 'href', 'https://example.com/validator');
    section('License').should('contain.text', 'MIT');
    section('Tooling Types')
      .should('contain.text', 'Validator')
      .and('contain.text', 'Schema To Code');
    section('Languages')
      .should('contain.text', 'JavaScript')
      .and('contain.text', 'TypeScript');
    section('Environments').should('contain.text', 'Command Line');
    section('Depends On Validators')
      .find('a')
      .should('have.attr', 'href', 'https://github.com/example/engine');
    section('Landscape').should('contain.text', 'Yes');
  });

  it('says how to make the tool compliant, and shows its notes', () => {
    mountModal();

    section('Compliance')
      .should('contain.text', 'Turn on strict mode.')
      .find('a')
      .should('have.attr', 'href', 'https://example.com/compliance');
    section('Tooling Listing Notes')
      .find('[data-test="notes"]')
      .should('have.text', 'Notes in *markdown*.');
  });

  it('names the people behind the tool, linking to their profiles', () => {
    mountModal();

    section('Creators').within(() => {
      cy.contains('li', 'Ada')
        .find('a')
        .should('have.attr', 'href', 'https://github.com/ada');
      cy.contains('li', 'N.A.')
        .find('a')
        .should('have.attr', 'href', 'https://gitlab.com/anonymous');
    });
    section('Maintainers').within(() => {
      cy.contains('li', 'Grace')
        .find('a')
        .should('have.attr', 'href', 'https://github.com/grace');
      cy.contains('li', 'N.A.').should('contain.text', '@unnamed');
    });
  });

  it('lists the dialects the tool supports', () => {
    mountModal();

    section('Supported Dialects').within(() => {
      cy.contains('2020-12');
      cy.contains('7');
      cy.contains('li', 'OpenAPI 3.1')
        .find('a')
        .should('have.attr', 'href', 'https://example.com/oas');
    });
  });

  it('shows the Bowtie results for every dialect Bowtie tests', () => {
    mountModal({ bowtieInfo });

    section('Bowtie Report').within(() => {
      cy.contains('js-example');
      cy.contains('(version 1.2.3)');
      cy.get('[data-test="bowtie-badge-result"]').should('have.length', 2);
      cy.contains('[data-test="bowtie-badge-result"]', 'Draft 2020-12').should(
        'contain.text',
        '100% Passing',
      );
      cy.contains('[data-test="bowtie-badge-result"]', 'Draft 7').should(
        'contain.text',
        '97% Passing',
      );
      cy.contains('a', 'View detailed report').should(
        'have.attr',
        'href',
        'https://bowtie.report/#/implementations/js-example',
      );
      cy.contains('Built on').should('not.exist');
    });
  });

  it('says when the results are for the validator the tool is built on', () => {
    mountModal({
      bowtieInfo: {
        ...bowtieInfo,
        implementation: { ...implementation, version: undefined },
        engine: { name: 'The Engine', toolingTypes: ['validator'] },
      },
    });

    section('Bowtie Report')
      .should('contain.text', 'Built on The Engine')
      .and('not.contain.text', 'version');
  });

  it('lists the tools of a project, each with its own Bowtie results', () => {
    const onSelectTool = cy.stub().as('onSelectTool');
    const member: JSONSchemaTool = { ...tool, name: 'Example for Go' };

    mountModal({
      tool: {
        name: 'Example',
        toolingTypes: ['validator'],
        members: [tool, { ...member, languages: undefined }],
      },
      bowtieInfo,
      getBowtieInfo: (listed) =>
        listed === tool ? bowtieInfo : { kind: 'not-on-bowtie' },
      onSelectTool,
    });

    // The project has no results of its own
    cy.contains('h3', 'Bowtie Report').should('not.exist');

    cy.get('[data-test="tool-members"] li').should('have.length', 2);
    cy.get('[data-test="tool-members"] li')
      .first()
      .should('contain.text', 'Example Validator')
      .and('contain.text', '(JavaScript, TypeScript)')
      .find('[data-test="bowtie-badge-untested"]')
      .should('exist');
    cy.get('[data-test="tool-members"] li')
      .eq(1)
      .find('[data-test="bowtie-badge-not-on-bowtie"]')
      .should('exist');

    cy.contains('button', 'Example for Go').click();
    cy.get('@onSelectTool').should('have.been.calledOnce');
  });

  it('leaves out what is not known about a tool', () => {
    mountModal({ tool: { name: 'Bare', toolingTypes: [] } });

    cy.get('h2').should('have.text', 'Bare');
    cy.get('h3').should('have.length', 1).and('have.text', 'Tooling Types');
    cy.get('img').should('not.exist');
  });

  it('copes with partial details', () => {
    mountModal({
      tool: {
        name: 'Partial',
        toolingTypes: ['validator'],
        supportedDialects: {},
        compliance: {},
        landscape: { optOut: false },
      },
    });

    section('Supported Dialects').find('li').should('not.exist');
    section('Compliance').find('a').should('not.exist');
    cy.contains('h3', 'Landscape').should('not.exist');
  });

  it('stops the page behind it from scrolling while it is open', () => {
    mountModal();
    cy.get('body').should('have.class', 'no-scroll');

    cy.mount(<div />);
    cy.get('body').should('not.have.class', 'no-scroll');
  });

  it('closes with its button, a click outside it, or the Escape key', () => {
    mountModal();

    cy.get('button').first().click();
    cy.get('@onClose').should('have.been.calledOnce');

    cy.get('.fixed.inset-0.bg-black').click({ force: true });
    cy.get('@onClose').should('have.been.calledTwice');

    cy.get('body').type('a');
    cy.get('@onClose').should('have.been.calledTwice');
    cy.get('body').type('{esc}');
    cy.get('@onClose').should('have.been.calledThrice');
  });
});
