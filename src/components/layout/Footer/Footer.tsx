import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer" id="ueber-uns">
      <div className="footer__container">
        <div className="footer__main">
          <div className="footer__brand">
            <a href="/" className="footer__logo">
              Wegweiser<span>.</span>
            </a>

            <p className="footer__description">
              Deine Orientierung bei Behörden und Dokumenten. Weniger Stress.
              Mehr Klarheit.
            </p>
          </div>

          <div className="footer__links">
            <div className="footer__column">
              <h3>Navigation</h3>
              <a href="#ablauf">So funktioniert's</a>
              <a href="#themen">Themen</a>
              <a href="#ueber-uns">Über uns</a>
            </div>

            <div className="footer__column">
              <h3>Informationen</h3>
              <a href="#impressum">Impressum</a>
              <a href="#datenschutz">Datenschutz</a>
              <a href="#kontakt">Kontakt</a>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <p>
            © {new Date().getFullYear()} Wegweiser. Alle Rechte vorbehalten.
          </p>
          <span>Mit Klarheit durch den Behördenalltag.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
