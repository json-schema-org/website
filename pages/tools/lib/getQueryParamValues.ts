export default function getQueryParamValues(
  param: string | string[] | undefined,
): string[] {
  if (!param) return [];

  if (typeof param === 'string') {
    return [decodeURIComponent(param)];
  } else {
    return param.map((p) => decodeURIComponent(p));
  }
}
