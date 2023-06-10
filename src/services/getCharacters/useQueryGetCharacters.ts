import {
  InfiniteData,
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  useQuery,
  UseQueryOptions,
} from '@tanstack/react-query';
import { TextureLoader } from 'three';
import { QueryKeys } from '../queryKeys';
import {
  CharactersByStatus,
  CharacterSchema,
  charactersSchema,
  useQueryGetCharactersSchema,
  UseQueryGetCharactersSchema,
} from './userQueryGetCharacters.schema';

function getCursor(url: string) {
  const searchParams = new URLSearchParams(url.split('?')[1]);
  return searchParams.get('page');
}

async function fetchCharacters({
  pageParam = 0,
}): Promise<UseQueryGetCharactersSchema> {
  const response = await fetch(`/api/characters?page=${pageParam}`);

  if (!response.ok) {
    throw new Error('Failed to fetch characters');
  }

  const jsonData = await response.json();
  return useQueryGetCharactersSchema.parse(jsonData);
}

export function selectCharacters(
  data: InfiniteData<UseQueryGetCharactersSchema>
) {
  return {
    pageParams: data.pageParams,
    pages: data.pages,
    data: data.pages.map((page) => page.results).flat(),
  };
}

export function useQueryGetCharacters(
  options: UseInfiniteQueryOptions<
    UseQueryGetCharactersSchema,
    Error,
    UseQueryGetCharactersSchema
  > = {}
) {
  return useInfiniteQuery<
    UseQueryGetCharactersSchema,
    Error,
    UseQueryGetCharactersSchema
  >({
    queryKey: [QueryKeys.useQueryGetCharactersKey],
    queryFn: fetchCharacters,
    getNextPageParam: (lastPage) => getCursor(lastPage.info?.next ?? 'page0'),
    keepPreviousData: true,
    select: selectCharacters,
    cacheTime: Infinity,
    ...options,
  });
}

/**
 * Fetch data from local file
 */

async function selectDataFromLocalFile() {
  // headers allow-access-control-origin

  const response = await fetch('rickAndMortyCharacters.json', {
    headers: {
      'allow-access-control-origin': '*',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch characters');
  }

  const jsonData = await response.json();
  return charactersSchema.parse(jsonData.data);
}

export function useQueryGetCharactersFromFile(
  options: UseQueryOptions<CharacterSchema[], Error, CharacterSchema[]> = {}
) {
  return useQuery<CharacterSchema[], Error, CharacterSchema[]>({
    queryKey: [QueryKeys.useQueryGetCharactersFromFileKey],
    queryFn: selectDataFromLocalFile,
    select: (data) =>
      data.map((e) => ({ ...e, image: new TextureLoader().load(e.image) })),
    suspense: true,
    cacheTime: Infinity,
    ...options,
  });
}

function selectData(data: CharacterSchema[]): CharactersByStatus {
  const reducedByStatus = data.reduce<CharactersByStatus>(
    (acc, curr) => {
      acc[curr.status].push(curr);
      return acc;
    },
    { Alive: [], Dead: [], unknown: [] }
  );
  return reducedByStatus;
}

export function useQueryGetCharactersFromFileWithLoadedImages(
  options: UseQueryOptions<CharacterSchema[], Error, CharactersByStatus> = {}
) {
  return useQuery<CharacterSchema[], Error, CharactersByStatus>({
    queryKey: [QueryKeys.useQueryGetCharactersFromFileKey],
    queryFn: selectDataFromLocalFile,
    select: selectData,
    suspense: true,
    cacheTime: Infinity,
    ...options,
  });
}
