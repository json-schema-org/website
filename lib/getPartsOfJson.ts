import getFindResultsByGlobalRegExp from '~/lib/getFindResultsByGlobalRegExp';
import { RegExpResult, RegExpGroupResult } from '~/components/JsonEditor';

const regexObject =
  /^\s*(?<objectStartBracket>{)(?<objectContent>.*)(?<objectEndBracket>})\s*$/g;
const regexArray =
  /^\s*(?<arrayStartBracket>\[)(?<arrayContent>.*)(?<arrayEndBracket>\])\s*$/g;
const regexNumber = /^\s*(?<number>-?\d+(\.\d+)?([Ee][+-]?\d+)?)\s*$/g;
const regexString = /^\s*(?<string>"(\\"|[^"])*")\s*$/g;
const regexBoolean = /^\s*(?<boolean>true|false)\s*$/g;
const regexNull = /^\s*(?<null>null)\s*$/g;
const regexDoubleQuote = /(?<!\\)"/g;
const regexCommaOrEndOfLine = /,/g;

export type SyntaxPart = {
  type: string;
  address?: string;
  index: number;
  length: number;
  match: string;
  jsonPath: string;
  parentJsonPath?: string;
};
type StringWithPayload = {
  index: number;
  string: string;
  payload: string;
  match: string;
};

export default function getPartsOfJson(
  serializedJson: string,
  offset = 0,
  jsonPath = '$',
): SyntaxPart[] {
  const objectMatch = getFindResultsByGlobalRegExp(
    serializedJson,
    regexObject,
  )[0];
  if (objectMatch) {
    const parts: SyntaxPart[] = objectMatch.groups.reduce(
      (acc: SyntaxPart[], objectMatchGroup: RegExpGroupResult) => {
        const totalGroupOffset =
          offset + objectMatch.index + objectMatchGroup.index;
        if (
          ['objectStartBracket', 'objectEndBracket'].includes(
            objectMatchGroup.name || '',
          )
        ) {
          const syntaxPart: SyntaxPart = {
            type: objectMatchGroup.name as string,
            index: totalGroupOffset,
            length: objectMatchGroup.match.length,
            match: objectMatchGroup.match,
            jsonPath,
          };
          return [...acc, syntaxPart];
        }
        if (objectMatchGroup.name === 'objectContent') {
          const parts = getPartsOfJsonObjectContent(
            objectMatchGroup.match,
            totalGroupOffset,
            jsonPath,
          );
          return [...acc, ...parts];
        }
        return acc;
      },
      [] as SyntaxPart[],
    );
    return parts;
  }
  const arrayMatch = getFindResultsByGlobalRegExp(
    serializedJson,
    regexArray,
  )[0];
  if (arrayMatch) {
    const parts: SyntaxPart[] = arrayMatch.groups.reduce(
      (acc: SyntaxPart[], arrayMatchGroup: RegExpGroupResult) => {
        const totalGroupOffset =
          offset + arrayMatch.index + arrayMatchGroup.index;
        if (
          ['arrayStartBracket', 'arrayEndBracket'].includes(
            arrayMatchGroup.name || '',
          )
        ) {
          const syntaxPart: SyntaxPart = {
            type: arrayMatchGroup.name as string,
            index: totalGroupOffset,
            length: arrayMatchGroup.match.length,
            match: arrayMatchGroup.match,
            jsonPath,
          };
          return [...acc, syntaxPart];
        }
        if (arrayMatchGroup.name === 'arrayContent') {
          const parts = getPartsOfArrayContent(
            arrayMatchGroup.match,
            totalGroupOffset,
            jsonPath,
          );
          return [...acc, ...parts];
        }
        return acc;
      },
      [] as SyntaxPart[],
    );
    return parts;
  }

  const numberMatch = getFindResultsByGlobalRegExp(
    serializedJson,
    regexNumber,
  )[0];
  if (numberMatch) {
    const numberRegExpGroup = numberMatch.groups.find(
      (group) => group.name === 'number',
    );
    if (!numberRegExpGroup)
      throw Error('no number group found in number regex');
    const part: SyntaxPart = {
      type: 'numberValue',
      index: offset + numberRegExpGroup.index,
      match: numberRegExpGroup.match,
      length: numberRegExpGroup.match.length,
      jsonPath,
    };
    return [part];
  }
  const stringMatch = getFindResultsByGlobalRegExp(
    serializedJson,
    regexString,
  )[0];
  if (stringMatch) {
    const stringRegExpGroup = stringMatch.groups.find(
      (group) => group.name === 'string',
    );
    if (!stringRegExpGroup)
      throw Error('no string group found in number regex');
    const part: SyntaxPart = {
      type: 'stringValue',
      index: offset + stringRegExpGroup.index,
      match: stringRegExpGroup.match,
      length: stringRegExpGroup.match.length,
      jsonPath,
    };
    return [part];
  }
  const booleanMatch = getFindResultsByGlobalRegExp(
    serializedJson,
    regexBoolean,
  )[0];
  if (booleanMatch) {
    const booleanRegExpGroup = booleanMatch.groups.find(
      (group) => group.name === 'boolean',
    );
    if (!booleanRegExpGroup)
      throw Error('no boolean group found in boolean regex');
    const part: SyntaxPart = {
      type: 'booleanValue',
      index: offset + booleanRegExpGroup.index,
      match: booleanRegExpGroup.match,
      length: booleanRegExpGroup.match.length,
      jsonPath,
    };
    return [part];
  }
  const nullMatch = getFindResultsByGlobalRegExp(serializedJson, regexNull)[0];
  if (nullMatch) {
    const nullRegExpGroup = nullMatch.groups.find(
      (group) => group.name === 'null',
    );
    if (!nullRegExpGroup) throw Error('no null group found in null regex');
    const part: SyntaxPart = {
      type: 'nullValue',
      index: offset + nullRegExpGroup.index,
      match: nullRegExpGroup.match,
      length: nullRegExpGroup.match.length,
      jsonPath,
    };
    return [part];
  }
  return [];
}

const getPartsOfJsonObjectContent = (
  serializedJson: string,
  offset = 0,
  jsonPath: string,
): SyntaxPart[] => {
  const doubleQuoteMatches = getFindResultsByGlobalRegExp(
    serializedJson,
    regexDoubleQuote,
  );
  let keywordStartIndex = 0;
  let stringsWithPayload: StringWithPayload[] = [];
  doubleQuoteMatches.forEach((doubleQuoteMatch, index) => {
    const isStart = index % 2 === 0;
    if (isStart) {
      keywordStartIndex = doubleQuoteMatch.index + 1;
      return;
    }
    const keywordLength = doubleQuoteMatch.index - keywordStartIndex;
    const string = serializedJson.substr(keywordStartIndex, keywordLength);
    const nextStartIndex = doubleQuoteMatches[index + 1]?.index || Infinity;
    const payload = serializedJson.substr(
      doubleQuoteMatch.index + 1,
      nextStartIndex - doubleQuoteMatch.index - 1,
    );
    const match = serializedJson.substr(
      keywordStartIndex - 1,
      nextStartIndex - (keywordStartIndex - 1),
    );
    const stringWithPayload: StringWithPayload = {
      index: keywordStartIndex,
      string,
      payload,
      match,
    };
    stringsWithPayload = [...stringsWithPayload, stringWithPayload];
  });

  let keywordsAndValue: any[] = [];

  let openCurlyBrackets = 0;
  let openSquareBrackets = 0;
  let completedWithComma = true;
  let keywordAndValue: {
    index?: number;
    keyword?: string;
    payload?: string;
    payloadStartIndex?: number;
  } = {};

  stringsWithPayload.forEach((stringWithPayload, index) => {
    if (
      completedWithComma &&
      openCurlyBrackets === 0 &&
      openSquareBrackets === 0
    ) {
      keywordAndValue = {
        keyword: stringWithPayload.string,
        index: stringWithPayload.index,
      };
    }
    const countOpenCurlyBracketsInPayload = getFindResultsByGlobalRegExp(
      stringWithPayload.payload,
      /\{/g,
    ).length;
    const countClosedCurlyBracketsInPayload = getFindResultsByGlobalRegExp(
      stringWithPayload.payload,
      /\}/g,
    ).length;
    const countOpenSquaredBracketsInPayload = getFindResultsByGlobalRegExp(
      stringWithPayload.payload,
      /\[/g,
    ).length;
    const countClosedSquaredBracketsInPayload = getFindResultsByGlobalRegExp(
      stringWithPayload.payload,
      /\]/g,
    ).length;

    openCurlyBrackets += countOpenCurlyBracketsInPayload;
    openSquareBrackets += countOpenSquaredBracketsInPayload;

    const indexOfComma = stringWithPayload.payload.indexOf(',');

    openCurlyBrackets -= countClosedCurlyBracketsInPayload;
    openSquareBrackets -= countClosedSquaredBracketsInPayload;
    const hasComma =
      indexOfComma > -1 && openCurlyBrackets === 0 && openSquareBrackets === 0;

    if (
      openCurlyBrackets === 0 &&
      openSquareBrackets === 0 &&
      (index === stringsWithPayload.length - 1 || hasComma)
    ) {
      completedWithComma = true;
      const payloadStartIndex =
        (keywordAndValue?.index || 0) +
        (keywordAndValue?.keyword?.length || 0) +
        2;
      const payloadEndIndex =
        stringWithPayload.index +
        (hasComma
          ? indexOfComma +
            stringWithPayload.match.length -
            stringWithPayload.payload.length
          : stringWithPayload.match.length);
      const payload = serializedJson.substr(
        payloadStartIndex,
        payloadEndIndex - payloadStartIndex - 1,
      );
      keywordAndValue = {
        ...keywordAndValue,
        payload,
        payloadStartIndex,
      };
      keywordsAndValue = [...keywordsAndValue, keywordAndValue];
    } else {
      completedWithComma = false;
    }
  });

  return keywordsAndValue.reduce((acc, keywordAndValue) => {
    const propertyJsonPath = `${jsonPath}['${keywordAndValue.keyword}']`;
    const objectPropertyStartQuotes: SyntaxPart = {
      type: 'objectPropertyStartQuotes',
      index: offset + keywordAndValue.index - 1,
      match: '"',
      length: 1,
      jsonPath: propertyJsonPath,
      parentJsonPath: jsonPath,
    };
    const objectProperty: SyntaxPart = {
      type: 'objectProperty',
      index: offset + keywordAndValue.index,
      match: keywordAndValue.keyword,
      length: keywordAndValue.keyword.length,
      jsonPath: propertyJsonPath,
      parentJsonPath: jsonPath,
    };
    const objectPropertyEndQuotes: SyntaxPart = {
      type: 'objectPropertyEndQuotes',
      index: offset + keywordAndValue.index + keywordAndValue.keyword.length,
      match: '"',
      length: 1,
      jsonPath: propertyJsonPath,
      parentJsonPath: jsonPath,
    };
    const partsFromPayload = getPartsOfJson(
      keywordAndValue.payload,
      offset + keywordAndValue.payloadStartIndex,
      propertyJsonPath,
    );
    return [
      ...acc,
      objectPropertyStartQuotes,
      objectProperty,
      objectPropertyEndQuotes,
      ...partsFromPayload,
    ];
  }, []);
};

const getPartsOfArrayContent = (
  serializedJson: string,
  offset = 0,
  jsonPath: string,
): SyntaxPart[] => {
  const endOfLineMatch: RegExpResult = {
    index: serializedJson.length,
    match: '',
    groups: [],
  };
  const commaOrEndOfLineMatches = [
    ...getFindResultsByGlobalRegExp(serializedJson, regexCommaOrEndOfLine),
    endOfLineMatch,
  ];

  let arrayValues: { index: number; length: number }[] = [];
  let syntaxParts: SyntaxPart[] = [];
  let arrayPayloadIndex = 0;

  commaOrEndOfLineMatches.forEach((match: RegExpResult) => {
    const length = match.index - arrayPayloadIndex;
    const payload = serializedJson.substr(arrayPayloadIndex, length);

    //ToDo filter brackets in strings
    const countOpenCurlyBracketsInPayload = getFindResultsByGlobalRegExp(
      payload,
      /\{/g,
    ).length;
    const countClosedCurlyBracketsInPayload = getFindResultsByGlobalRegExp(
      payload,
      /\}/g,
    ).length;
    const countOpenSquaredBracketsInPayload = getFindResultsByGlobalRegExp(
      payload,
      /\[/g,
    ).length;
    const countClosedSquaredBracketsInPayload = getFindResultsByGlobalRegExp(
      payload,
      /\]/g,
    ).length;
    const openCurlyBrackets =
      countOpenCurlyBracketsInPayload - countClosedCurlyBracketsInPayload;
    const openSquareBrackets =
      countOpenSquaredBracketsInPayload - countClosedSquaredBracketsInPayload;

    if (openCurlyBrackets === 0 && openSquareBrackets === 0) {
      const arrayValue = { index: arrayPayloadIndex, length };
      arrayValues = [...arrayValues, arrayValue];
      const syntaxPartComma: SyntaxPart = {
        type: 'arrayComma',
        match: ',',
        length: 1,
        index: offset + match.index,
        jsonPath,
      };
      syntaxParts = [...syntaxParts, syntaxPartComma];
      arrayPayloadIndex = match.index + 1;
    }
  });

  const partsFromArrayValues: SyntaxPart[] = arrayValues.reduce(
    (acc: SyntaxPart[], arrayValue, index) => {
      const indexJsonPath = `${jsonPath}[${index}]`;
      const value = serializedJson.substr(arrayValue.index, arrayValue.length);
      const parts: SyntaxPart[] = getPartsOfJson(
        value,
        offset + arrayValue.index,
        indexJsonPath,
      );
      return [...acc, ...parts];
    },
    [] as SyntaxPart[],
  );

  return [...syntaxParts, ...partsFromArrayValues];
};
