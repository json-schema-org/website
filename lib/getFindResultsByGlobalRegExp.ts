import { RegExpResult, RegExpGroupResult } from '~/components/JsonEditor';

export default function getFindResultsByGlobalRegExp(
  text: string,
  regex: RegExp,
  offset = 0,
): RegExpResult[] {
  let results: RegExpResult[] = [];
  let regexResult;
  if (Array.isArray(text))
    throw new Error('array used for regular expression!');
  if (!regex.global)
    throw new Error(
      `regex for getFindResultsByGlobalRegExp() has no global flag ${regex.toString()}`,
    );
  while ((regexResult = regex.exec(text)) !== null) {
    const fullMatchText = regexResult[0];
    let groupIndex = 1;
    let groupOffset: number = regexResult.index;
    let groups: RegExpGroupResult[] = [];
    const groupsReverseMap: Record<string, string> = Object.entries(
      regexResult.groups || {},
    ).reduce((acc, [groupName, match]) => {
      return { ...acc, [match]: groupName };
    }, {});
    while (typeof regexResult[groupIndex] === 'string') {
      const match: string = regexResult[groupIndex];
      const name = groupsReverseMap[match] || null;
      const inMatchGroupOffset = text.substr(groupOffset).indexOf(match);
      if (inMatchGroupOffset >= 0) {
        groupOffset += inMatchGroupOffset;
        const group: RegExpGroupResult = {
          name,
          match,
          index: groupOffset,
        };
        groupOffset += match.length;
        groups = [...groups, group];
      }
      groupIndex++;
    }
    const newResult: RegExpResult = {
      match: regexResult.groups?.target || fullMatchText,
      index:
        regexResult.index +
        (regexResult.groups?.pretarget?.length || 0) +
        offset,
      groups,
    };
    results = [...results, newResult];
  }
  return results;
}
