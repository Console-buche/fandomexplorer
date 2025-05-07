import { z } from 'zod';

export const characterSchema = z.object({
  id: z.number(),
  name: z.string(),
  status: z.enum(['Alive', 'Dead', 'unknown']),
  species: z.string(),
  type: z.string(),
  gender: z.enum(['Female', 'Male', 'Genderless', 'unknown']),
  origin: z.object({
    name: z.string(),
    url: z.string(),
  }),
  location: z.object({
    name: z.string(),
    url: z.string(),
  }),
  image: z.string().url(),
  img: z.instanceof(Image).optional(),
  episode: z.array(z.string().url()),
  url: z.string().url(),
  created: z.string(),
});

export const charactersSchema = z.array(characterSchema);
export type CharactersSchema = z.infer<typeof charactersSchema>;

export const useQueryGetCharactersSchema = z.object({
  info: z.object({
    count: z.number(),
    pages: z.number(),
    next: z.string().url().or(z.null()),
    prev: z.string().url().or(z.null()),
  }),
  results: z.array(characterSchema),
});

export type CharacterSchema = z.infer<typeof characterSchema>;
export type UseQueryGetCharactersSchema = z.infer<
  typeof useQueryGetCharactersSchema
>;

export type CharactersByStatus = Record<
  CharacterSchema['status'],
  CharacterSchema[]
>;
