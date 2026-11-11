import getPartsOfJson, { SyntaxPart } from '~/lib/getPartsOfJson';

// JsonEditor serializes the code without line breaks before parsing it
const parse = (json: string) => getPartsOfJson(json.split('\n').join(''));

// builds the json path the parser uses, e.g. at('r', 1) -> $['r'][1]
const at = (...segments: (string | number)[]) =>
  `$${segments
    .map((segment) =>
      typeof segment === 'number' ? `[${segment}]` : `['${segment}']`,
    )
    .join('')}`;

const findPart = (parts: SyntaxPart[], type: string, jsonPath: string) =>
  parts.find((part) => part.type === type && part.jsonPath === jsonPath);

describe('getPartsOfJson', () => {
  it('should end a string that finishes with an escaped backslash', () => {
    const json = `{
  "bad_string": "backslash: \\\\",
  "next_key": "this will be broken"
}`;
    const parts = parse(json);

    expect(findPart(parts, 'stringValue', at('bad_string'))?.match).to.equal(
      '"backslash: \\\\"',
    );
    expect(findPart(parts, 'objectProperty', at('next_key'))?.match).to.equal(
      'next_key',
    );
    expect(findPart(parts, 'stringValue', at('next_key'))?.match).to.equal(
      '"this will be broken"',
    );
  });

  it('should still treat a single backslash before a quote as escaped', () => {
    const parts = parse('{ "a": "say \\"hi\\"", "b": 1 }');

    expect(findPart(parts, 'stringValue', at('a'))?.match).to.equal(
      '"say \\"hi\\""',
    );
    expect(findPart(parts, 'numberValue', at('b'))?.match).to.equal('1');
  });

  it('should handle an escaped backslash followed by an escaped quote', () => {
    const parts = parse('{ "a": "x\\\\\\"y", "b": true }');

    expect(findPart(parts, 'stringValue', at('a'))?.match).to.equal(
      '"x\\\\\\"y"',
    );
    expect(findPart(parts, 'booleanValue', at('b'))?.match).to.equal('true');
  });

  it('should handle an even number of backslashes before the closing quote', () => {
    const parts = parse('{ "a": "\\\\\\\\", "b": null }');

    expect(findPart(parts, 'stringValue', at('a'))?.match).to.equal(
      '"\\\\\\\\"',
    );
    expect(findPart(parts, 'nullValue', at('b'))?.match).to.equal('null');
  });

  it('should handle a property name that ends with an escaped backslash', () => {
    const parts = parse('{ "k\\\\": 1, "n": 2 }');

    expect(findPart(parts, 'objectProperty', at('k\\\\'))?.match).to.equal(
      'k\\\\',
    );
    expect(findPart(parts, 'numberValue', at('k\\\\'))?.match).to.equal('1');
    expect(findPart(parts, 'numberValue', at('n'))?.match).to.equal('2');
  });

  it('should handle escaped backslashes inside nested objects and arrays', () => {
    const parts = parse(
      '{ "o": { "p": "q\\\\" }, "r": [1, "s\\\\", { "t": "u\\\\" }], "v": "w" }',
    );

    expect(findPart(parts, 'stringValue', at('o', 'p'))?.match).to.equal(
      '"q\\\\"',
    );
    expect(findPart(parts, 'numberValue', at('r', 0))?.match).to.equal('1');
    expect(findPart(parts, 'stringValue', at('r', 1))?.match).to.equal(
      '"s\\\\"',
    );
    expect(findPart(parts, 'stringValue', at('r', 2, 't'))?.match).to.equal(
      '"u\\\\"',
    );
    expect(findPart(parts, 'stringValue', at('v'))?.match).to.equal('"w"');
  });

  it('should keep empty strings working next to escaped backslashes', () => {
    const parts = parse('{ "a": "", "b": "\\\\" }');

    expect(findPart(parts, 'stringValue', at('a'))?.match).to.equal('""');
    expect(findPart(parts, 'stringValue', at('b'))?.match).to.equal('"\\\\"');
  });

  it('should parse a top level string value with an escaped backslash', () => {
    const parts = parse('"backslash: \\\\"');

    expect(parts).to.have.length(1);
    expect(parts[0].type).to.equal('stringValue');
    expect(parts[0].match).to.equal('"backslash: \\\\"');
  });

  it('should not treat a string with an unescaped closing quote as a single string', () => {
    // `"a\"` is not valid json, the quote at the end is escaped
    expect(parse('"a\\"')).to.deep.equal([]);
  });

  it('should keep part indexes in sync with the source text', () => {
    const json = '{ "a": "x\\\\", "b": ["y\\\\", "z"], "c": { "d": "\\\\" } }';
    const parts = getPartsOfJson(json);

    parts
      .filter((part) => part.type !== 'arrayComma')
      .forEach((part) => {
        expect(json.substr(part.index, part.length)).to.equal(part.match);
      });
  });
});
