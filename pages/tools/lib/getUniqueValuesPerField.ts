import jsonpath from 'jsonpath';
import { type JSONSchemaTool } from '../JSONSchemaTool';

export type Fields = 'languages' | 'drafts' | 'toolingTypes' | 'licenses';

export type UniqueValuesPerField = Partial<Record<Fields, string[]>>;

const getUniqueValuesPerField = (
  data: JSONSchemaTool[],
  path: string,
  exclude: Array<string | number> = [],
) => {
  const values = Array.from(new Set(jsonpath.query(data, path)));
  return values.filter((value) => !exclude.includes(value));
};

export default getUniqueValuesPerField;
