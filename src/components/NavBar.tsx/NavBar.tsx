import { useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  useQueryGetCharactersFromFile,
  useQueryGetCharactersFromFileWithLoadedImages,
} from '@/services/getCharacters/useQueryGetCharacters';
import { Links } from './data';
import {
  linkStyle,
  navBarInnerStyle,
  navBarSearchStyle,
  navBarStyle,
} from './navBarStyle.css';
import { useStoreSearch } from '@/stores/storeSearch';

export const NavBar = () => {
  const ref = useRef<HTMLInputElement>(null);
  const updateSearch = useStoreSearch((state) => state.updateSearch);

  const loadedCharacters = useQueryGetCharactersFromFileWithLoadedImages();

  if (!loadedCharacters.data) {
    return null;
  }

  return (
    <nav className={navBarStyle}>
      <ul className={navBarInnerStyle}>
        <li>Zustand demo </li>
        <input
          className={navBarSearchStyle}
          placeholder="Search characters by name"
          onChange={(e) => updateSearch(e.target.value)}
          ref={ref}
        />
        <ul className={linkStyle}>
          {Links.map(({ url, name }) => (
            <li key={name}>
              <Link style={{ color: '#E3E3E3' }} to={url}>
                {name}
              </Link>
            </li>
          ))}
        </ul>
      </ul>
    </nav>
  );
};
