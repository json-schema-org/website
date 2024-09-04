import jsonpath from 'jsonpath';

const getDistinctEntries = <T, V>(
  data: T,
  path: string,
  exclude: Array<V> = [],
): Array<V> => {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid data input. Expected an object or an array.');
  }
  if (typeof path !== 'string') {
    throw new Error('Invalid path input. Expected a string.');
  }

  const values = Array.from(new Set<V>(jsonpath.query(data, path)));

  return values.filter((value) => !exclude.includes(value));
};

export default getDistinctEntries;
