import { Link, useLocation } from "react-router-dom";

import "./Header.css";

const Header = () => {
  const { pathname } = useLocation();
  const isHomePage = pathname === "/";

  return (
    <header className="header">
      <div className="header__container">
        <Link to="/" className="header__logo">
          Wegweiser<span>.</span>
        </Link>

        <nav className="header__nav" aria-label="Hauptnavigation">
          <a href="/#ablauf">So funktioniert's</a>
          <a href="/#themen">Themen</a>
          <a href="/#ueber-uns">Über uns</a>
        </nav>

        {isHomePage ? (
          <a href="#themen" className="header__cta">
            Jetzt starten
          </a>
        ) : (
          <a href="/#themen" className="header__cta">
            Alle Themen
          </a>
        )}
      </div>
    </header>
  );
};

export default Header;
