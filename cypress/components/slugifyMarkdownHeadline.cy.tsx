import React from 'react';
import slugifyMarkdownHeadline from '~/lib/slugifyMarkdownHeadline';

describe('slugifyMarkdownHeadline', () => {
  it('should slugify plain text', () => {
    expect(slugifyMarkdownHeadline('Hello World')).to.equal('hello-world');
    expect(slugifyMarkdownHeadline(['Hello World'])).to.equal('hello-world');
  });

  it('should return an empty string for empty input', () => {
    expect(slugifyMarkdownHeadline('')).to.equal('');
    expect(slugifyMarkdownHeadline([])).to.equal('');
    expect(slugifyMarkdownHeadline(null)).to.equal('');
    expect(slugifyMarkdownHeadline(undefined)).to.equal('');
  });

  it('should keep the text of inline code', () => {
    const children = [
      'Q: What happened to all the discussions around re-using schemas with ',
      <code key='0'>&quot;additionalProperties&quot;</code>,
      '?',
    ];
    expect(slugifyMarkdownHeadline(children)).to.equal(
      'q:-what-happened-to-all-the-discussions-around-re-using-schemas-with-"additionalproperties"',
    );
  });

  it('should keep the text of bold and italic children', () => {
    expect(
      slugifyMarkdownHeadline([
        'How do I ',
        <em key='0'>explicitly</em>,
        ' indicate ',
        <strong key='1'>methods</strong>,
      ]),
    ).to.equal('how-do-i-explicitly-indicate-methods');
  });

  it('should handle nested formatting and links', () => {
    expect(
      slugifyMarkdownHeadline([
        'Using ',
        <a key='0' href='/x'>
          the{' '}
          <strong>
            <code>$ref</code>
          </strong>{' '}
          keyword
        </a>,
      ]),
    ).to.equal('using-the-dollarref-keyword');
  });

  it('should handle numbers and ignore booleans', () => {
    expect(slugifyMarkdownHeadline(['Draft ', 7])).to.equal('draft-7');
    expect(slugifyMarkdownHeadline(['Draft', false, null])).to.equal('draft');
  });

  it('should handle markdown AST like nodes', () => {
    expect(
      slugifyMarkdownHeadline(['Splitting ', { text: '"schema"' }]),
    ).to.equal('splitting-"schema"');
    expect(
      slugifyMarkdownHeadline(['A ', { children: [{ text: 'b' }] }]),
    ).to.equal('a-b');
  });

  it('should use the custom [#id] fragment', () => {
    expect(slugifyMarkdownHeadline(['Retrieval URI[#retrieval-uri]'])).to.equal(
      'retrieval-uri',
    );
    expect(
      slugifyMarkdownHeadline(['dependentSchemas [#dependentSchemas]']),
    ).to.equal('dependentSchemas');
    expect(
      slugifyMarkdownHeadline([<code key='0'>$id</code>, '[#id]']),
    ).to.equal('id');
  });
});
