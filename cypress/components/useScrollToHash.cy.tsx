import React from 'react';
import useScrollToHash, {
  findHashTarget,
} from '~/pages/tools/hooks/useScrollToHash';

// The site has every page leave this much room above the target of a link
const SCROLL_PADDING = 100;

const Page = ({ covered }: { covered: number }) => {
  useScrollToHash(covered);
  const scrollMarginTop = covered - SCROLL_PADDING;

  return (
    <>
      <div
        data-test='bar'
        style={{ position: 'fixed', top: 0, height: covered, width: '100%' }}
      />
      <div style={{ height: 3000 }} />
      <section id='group-validator' style={{ scrollMarginTop }}>
        Validators
      </section>
      <section id='group-editor' style={{ scrollMarginTop }}>
        Editors
      </section>
      <div style={{ height: 3000 }} />
    </>
  );
};

// The site scrolls smoothly, so give the target time to arrive
const shouldBeBelowTheBar = (id: string, covered: number) =>
  cy.get(`#${id}`).should(($el) => {
    expect($el[0].getBoundingClientRect().top).to.be.closeTo(covered, 1);
  });

describe('Scrolling to the fragment of a link to the tools', () => {
  afterEach(() => {
    cy.window().then((win) => {
      win.history.replaceState(null, '', win.location.pathname);
    });
  });

  describe('findHashTarget', () => {
    beforeEach(() => {
      cy.mount(<Page covered={0} />);
    });

    it('finds an element by its id', () => {
      cy.get('#group-editor').then(($el) => {
        expect(findHashTarget('#group-editor')).to.equal($el[0]);
      });
    });

    it('finds the group which older links name', () => {
      cy.get('#group-validator').then(($el) => {
        expect(findHashTarget('#validators')).to.equal($el[0]);
        expect(findHashTarget('#validator')).to.equal($el[0]);
        expect(findHashTarget('#Validators')).to.equal($el[0]);
      });
    });

    it('finds nothing for no fragment, or one which names nothing', () => {
      cy.get('#group-editor').then(() => {
        expect(findHashTarget('')).to.equal(null);
        expect(findHashTarget('#')).to.equal(null);
        expect(findHashTarget('#nothing')).to.equal(null);
        expect(findHashTarget('#%E0%A4%A')).to.equal(null);
      });
    });
  });

  it('waits until it is known how much of the window is covered', () => {
    cy.window().then((win) => {
      win.history.replaceState(null, '', '#group-validator');
    });
    cy.mount(<Page covered={0} />);

    cy.window().its('scrollY').should('equal', 0);
  });

  it('brings the target into view below what covers the window', () => {
    cy.window().then((win) => {
      win.history.replaceState(null, '', '#validators');
    });
    cy.mount(<Page covered={120} />);

    shouldBeBelowTheBar('group-validator', 120);
  });

  it('follows the fragment when it changes', () => {
    cy.mount(<Page covered={120} />);
    cy.window().its('scrollY').should('equal', 0);

    cy.window().then((win) => {
      win.location.hash = '#group-editor';
    });

    shouldBeBelowTheBar('group-editor', 120);
  });

  it('follows a fragment which names a group but is not its id', () => {
    cy.mount(<Page covered={120} />);

    cy.window().then((win) => {
      win.location.hash = '#validators';
    });

    shouldBeBelowTheBar('group-validator', 120);
  });

  const Changing = () => {
    const [covered, setCovered] = React.useState(120);
    const [isTaller, setIsTaller] = React.useState(false);

    return (
      <>
        {isTaller && <div style={{ height: 500 }} data-test='late' />}
        <Page covered={covered} />
        <button
          style={{ position: 'fixed', top: 0, zIndex: 1 }}
          onClick={() => setCovered(200)}
        >
          Cover more
        </button>
        <button
          style={{ position: 'fixed', top: 0, left: 200, zIndex: 1 }}
          onClick={() => setIsTaller(true)}
        >
          Load more above
        </button>
      </>
    );
  };

  const mountAtValidators = () => {
    cy.window().then((win) => {
      win.history.replaceState(null, '', '#group-validator');
    });
    cy.mount(<Changing />);
    shouldBeBelowTheBar('group-validator', 120);
  };

  // Changes to the page which do not come from anything the reader does
  const click = (label: string) =>
    cy.contains('button', label).then(($button) => $button[0].click());

  it('keeps the target in view as what loads late moves it', () => {
    mountAtValidators();

    click('Load more above');
    cy.get('[data-test="late"]').should('exist');
    shouldBeBelowTheBar('group-validator', 120);

    click('Cover more');
    shouldBeBelowTheBar('group-validator', 200);
  });

  it('leaves the page where it is once the reader has taken over', () => {
    mountAtValidators();

    cy.window().then((win) => win.dispatchEvent(new win.Event('wheel')));
    cy.scrollTo(0, 0);
    cy.window().its('scrollY').should('equal', 0);

    click('Load more above');
    click('Cover more');
    cy.get('[data-test="bar"]').should('have.css', 'height', '200px');
    cy.window().its('scrollY').should('equal', 0);
  });

  it('leaves the page where it is once it has had time to settle', () => {
    cy.clock();
    mountAtValidators();

    cy.tick(6000);
    cy.scrollTo(0, 0);
    click('Load more above');
    cy.get('[data-test="late"]').should('exist');
    cy.window().its('scrollY').should('equal', 0);
  });
});
