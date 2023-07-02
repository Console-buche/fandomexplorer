import { CharacterSchema } from '@/services/getCharacters/userQueryGetCharacters.schema';
import { Vector3 } from 'three';
import { StoreApi } from 'zustand';
import { useStoreNav } from '../storeNav';

export type PathName = '/' | '/about' | '/contact';
type Path = {
  position: Vector3;
  lookAt: Vector3;
  path: string;
};

type Paths = Map<PathName, Path>;

type SliceState = { rickAndMorty: RickAndMortySlice };

export type RickAndMortySlice = InitialState & Actions;

type InitialPosAndRotX = {
  pos: Vector3;
  lookAt: Vector3;
  rotX: number;
};

type InitialState = {
  hasStarted: boolean;
  paths: Paths;
  name: string;
  initialPos: Vector3;
  activeStatus: CharacterSchema['status'];
  previousStatus: CharacterSchema['status'];
  initialPosByStatus: Record<CharacterSchema['status'], InitialPosAndRotX>;
};

type Actions = {
  reset: () => void;
  updateActiveStatus: (filterBy: CharacterSchema['status']) => void;
  getPositionFromCurrentFilter: () => InitialPosAndRotX;
  updateHasStarted: (hasStarted: boolean) => void;
};

const initialState: InitialState = {
  hasStarted: false,
  name: 'LALALA JE SUIS LE STORE RICK AND MORTY',
  initialPos: new Vector3(0, 0, 240),
  previousStatus: 'Alive',
  activeStatus: 'Alive',
  paths: new Map([
    [
      '/',
      {
        position: new Vector3(0, 0, 240),
        lookAt: new Vector3(0, 0, 0),
        path: '/',
      },
    ],
    [
      '/about',
      {
        position: new Vector3(0, 10, 240),
        lookAt: new Vector3(0, 0, 0),
        path: '/about',
      },
    ],
    [
      '/contact',
      {
        position: new Vector3(0, -10, 240),
        lookAt: new Vector3(1000, 100, 1),
        path: '/contact',
      },
    ],
  ]),
  initialPosByStatus: {
    Alive: {
      pos: new Vector3(0, 0, 240),
      rotX: 0.05,
      lookAt: new Vector3(0, 0, 0),
    },
    Dead: {
      pos: new Vector3(0, 0, 160),
      rotX: Math.PI / 3,
      lookAt: new Vector3(0, 0, 0),
    },
    unknown: {
      pos: new Vector3(0, 0, 70),
      rotX: Math.PI / -3,
      lookAt: new Vector3(0, 0, 0),
    },
  },
};

export const createFandomSliceRickAndMorty = (
  set: StoreApi<SliceState>['setState'],
  get: StoreApi<SliceState>['getState']
): RickAndMortySlice => ({
  ...initialState,

  updateActiveStatus(filterBy: CharacterSchema['status']) {
    set((state) => ({
      ...state,
      rickAndMorty: {
        ...state.rickAndMorty,
        previousStatus: state.rickAndMorty.activeStatus,
        activeStatus: filterBy,
      },
    }));
  },

  updateHasStarted(hasStarted) {
    set((state) => ({
      ...state,
      rickAndMorty: {
        ...state.rickAndMorty,
        hasStarted,
      },
    }));
  },

  getPositionFromCurrentFilter() {
    const currentPathName = useStoreNav.getState().currentPath as PathName;
    const path = get().rickAndMorty.paths.get(currentPathName);
    // if not on home page, return the position of the current path
    if (currentPathName !== '/' && path) {
      return {
        pos: path.position,
        lookAt: path.lookAt,
        rotX: 0,
      };
    }
    return get().rickAndMorty.initialPosByStatus[
      get().rickAndMorty.activeStatus
    ];
  },

  reset() {
    set(({ rickAndMorty }) => ({
      rickAndMorty: { ...rickAndMorty, ...initialState },
    }));
  },
});
