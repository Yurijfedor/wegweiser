import "./Header.css";

const Header = () => {
  return (
    <header className="header">
      <div className="header__container">
        <a href="/" className="header__logo">
          Wegweiser<span>.</span>
        </a>

        <nav className="header__nav" aria-label="Hauptnavigation">
          <a href="#ablauf">So funktioniert's</a>
          <a href="#themen">Themen</a>
          <a href="#ueber-uns">Über uns</a>
        </nav>

        <a href="#themen" className="header__cta">
          Jetzt starten
        </a>
      </div>
    </header>
  );
};

export default Header;
