/**
 * Mocks the Next.js router object.
 * @returns The mock router object.
 */

export interface MockRouter {
  push: Cypress.Agent<sinon.SinonStub>;
  replace: Cypress.Agent<sinon.SinonStub>;
  prefetch: Cypress.Agent<sinon.SinonStub>;
  pathname: string;
  query: Record<string, string | string[]>;
  asPath: string;
  events: {
    on: Cypress.Agent<sinon.SinonStub>;
    off: Cypress.Agent<sinon.SinonStub>;
    emit: Cypress.Agent<sinon.SinonStub>;
  };
}

export default function mockNextRouter() {
  const push = cy.stub().as('routerPush');
  const replace = cy.stub().as('routerReplace');
  const prefetch = cy.stub().as('routerPrefetch');

  const mockRouter: MockRouter = {
    push,
    replace,
    prefetch,
    pathname: '/',
    query: {},
    asPath: '/',
    events: {
      on: cy.stub(),
      off: cy.stub(),
      emit: cy.stub(),
    },
  };

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  cy.stub(require('next/router'), 'useRouter').returns(mockRouter);

  return mockRouter;
}
