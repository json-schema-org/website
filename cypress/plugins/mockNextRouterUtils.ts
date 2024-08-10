/**
 * Mocks the Next.js router object.
 * @returns The mock router object.
 */

export interface MockRouter {
  push: any;
  replace: any;
  prefetch: any;
  pathname: string;
  query: Record<string, any>;
  asPath: string;
  events: {
    on: any;
    off: any;
    emit: any;
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
