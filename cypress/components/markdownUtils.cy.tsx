import React from 'react';
import { checkHasContent } from '~/lib/markdownUtils';

describe('checkHasContent', () => {
  it('returns false for null or undefined', () => {
    expect(checkHasContent(null as any)).to.be.false;
    expect(checkHasContent(undefined as any)).to.be.false;
  });

  it('returns true for strings and numbers', () => {
    expect(checkHasContent('text')).to.be.true;
    expect(checkHasContent(123)).to.be.true;
  });

  it('handles empty elements', () => {
    const empty = <th></th>;
    expect(checkHasContent(empty)).to.be.false;
  });

  it('handles single child elements without crashing', () => {
    const single = <th>Single</th>;
    expect(checkHasContent(single)).to.be.true;
  });

  it('handles arrays of children', () => {
    const multiple = (
      <tr>
        <th>One</th>
        <th>Two</th>
      </tr>
    );
    expect(checkHasContent(multiple)).to.be.true;
  });

  it('handles deeply nested content', () => {
    const nested = (
      <div>
        <span>
          <strong>Deep</strong>
        </span>
      </div>
    );
    expect(checkHasContent(nested)).to.be.true;
  });

  it('handles deeply nested empty elements', () => {
    const nestedEmpty = (
      <div>
        <span></span>
      </div>
    );
    expect(checkHasContent(nestedEmpty)).to.be.false;
  });
});
