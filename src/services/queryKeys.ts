export type QueryNames =
  | 'useQueryGetCharactersKey'
  | 'useQueryGetCharactersFromFileKey'
  | 'useQueryGetCharactersFromFileKeyWithImg';

export const QueryKeys: Record<QueryNames, string> = {
  useQueryGetCharactersKey: 'useQueryGetCharactersKey',
  useQueryGetCharactersFromFileKey: 'useQueryGetCharactersFromFileKey',
  useQueryGetCharactersFromFileKeyWithImg:
    'useQueryGetCharactersFromFileKeyWithImg',
} as const;
