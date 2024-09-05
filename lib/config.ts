export const HOST = 'https://www.json-schema.org';

export const DRAFT_ORDER = [
  '2020-12',
  '2019-09',
  '7',
  '6',
  '5',
  '4',
  '3',
  '2',
  '1',
  '0',
] as const;

export type JSONSchemaDraft = (typeof DRAFT_ORDER)[number];
