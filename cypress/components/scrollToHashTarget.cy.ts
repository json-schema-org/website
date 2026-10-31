import scrollToHashTarget from '~/lib/scrollToHashTarget';

describe('scrollToHashTarget', () => {
  let target: HTMLElement;

  beforeEach(() => {
    target = document.createElement('span');
    target.id = 'community';
    document.body.appendChild(target);
    cy.stub(target, 'scrollIntoView').as('scroll');
  });

  afterEach(() => {
    target.remove();
  });

  it('scrolls for #community (what location.hash actually returns)', () => {
    expect(scrollToHashTarget('#community', 'community')).to.equal(true);
    cy.get('@scroll').should('have.been.calledOnceWith', {
      behavior: 'smooth',
    });
  });

  it('scrolls for a percent-encoded hash', () => {
    expect(scrollToHashTarget('#%63ommunity', 'community')).to.equal(true);
    cy.get('@scroll').should('have.been.calledOnce');
  });

  it('scrolls when the hash has no leading #', () => {
    expect(scrollToHashTarget('community', 'community')).to.equal(true);
  });

  [
    '',
    '#',
    '#Community',
    '#COMMUNITY',
    '#community-guidelines',
    '#communityx',
    '#community/',
    '#xcommunity',
    '#other',
    '##community',
    '#%E0%A4%A',
  ].forEach((hash) => {
    it(`does not scroll for ${JSON.stringify(hash)}`, () => {
      expect(scrollToHashTarget(hash, 'community')).to.equal(false);
      cy.get('@scroll').should('not.have.been.called');
    });
  });

  it('does nothing when the target element is missing', () => {
    target.remove();
    expect(scrollToHashTarget('#community', 'community')).to.equal(false);
    cy.get('@scroll').should('not.have.been.called');
  });
});
