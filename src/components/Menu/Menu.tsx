import { NavLink, NavLinkProps, useLocation, useMatch } from 'react-router-dom';
import Style from './Menu.module.css';
import { useEffect } from 'react';
import { PathName, useStoreNav } from '@/stores/storeNav';

type NavLinkWithActiveStyleProps = {
  to: string;
  activeClassName: string;
} & NavLinkProps;

function NavLinkWithActiveStyle({
  to,
  className,
  activeClassName,
  end,
  ...rest
}: NavLinkWithActiveStyleProps) {
  const isActive = useMatch(to);

  return (
    <NavLink
      to={to}
      className={`${className} ${isActive ? activeClassName : ''}`}
      end={end}
      {...rest}
    />
  );
}

export const Menu = () => {
  const location = useLocation();
  const updatePathName = useStoreNav((state) => state.updatePathName);

  useEffect(() => {
    if (location) {
      updatePathName(location.pathname as PathName);
    }
  }, [location, updatePathName]);

  return (
    <nav className={Style.menu}>
      <NavLinkWithActiveStyle
        className={Style.menu__item}
        activeClassName={Style.menu__item_active}
        to="/"
        end
      >
        Home
      </NavLinkWithActiveStyle>
      <NavLinkWithActiveStyle
        className={Style.menu__item}
        activeClassName={Style.menu__item_active}
        to="/about"
      >
        About this Wiki
      </NavLinkWithActiveStyle>
      <NavLinkWithActiveStyle
        className={Style.menu__item}
        activeClassName={Style.menu__item_active}
        to="/contact"
      >
        Contact
      </NavLinkWithActiveStyle>
      {/* 
      <li>
        Todo : - virer le suspense - Ajouter une anim de loading sur le bouton
        qui devient clickable quand fetch terminé (avec % de load) - Remplir les
        pages - Ajouter React Router - Pour la page transition : simplement
        afficher des panneaux dans l'espace, qui flottent ? Et la cam y va quand
        on nav le menu ? NICKEL CA
      </li> */}
    </nav>
  );
};
