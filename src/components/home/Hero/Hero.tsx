import "./Hero.css";

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero__container">
        <div className="hero__content">
          <span className="hero__eyebrow">
            DEIN WEG DURCH DEN BEHÖRDENALLTAG
          </span>

          <h1 className="hero__title">
            Behördengänge verstehen.
            <span> Schritt für Schritt erledigen.</span>
          </h1>

          <p className="hero__description">
            Welche Dokumente brauche ich? Welches Formular muss ich ausfüllen?
            Und an welche Behörde muss ich mich wenden? Wegweiser hilft dir, den
            Überblick zu behalten und deine nächsten Schritte sicher zu planen.
          </p>

          <div className="hero__actions">
            <a href="#themen" className="hero__button">
              Passendes Anliegen finden
              <span aria-hidden="true">→</span>
            </a>

            <a href="#ablauf" className="hero__secondary-link">
              So funktioniert's
            </a>
          </div>

          <div className="hero__note">Weniger Stress. Mehr Klarheit.</div>
        </div>

        <div className="hero__visual" aria-hidden="true">
          <div className="hero__visual-card">
            <div className="hero__visual-icon">✓</div>

            <div>
              <span className="hero__visual-label">DEINE CHECKLISTE</span>
              <strong>Alles im Überblick</strong>
            </div>

            <div className="hero__checklist">
              <div className="hero__check-item">
                <span className="hero__check-mark">✓</span>
                Dokumente vorbereiten
              </div>

              <div className="hero__check-item">
                <span className="hero__check-mark">✓</span>
                Formular ausfüllen
              </div>

              <div className="hero__check-item">
                <span className="hero__check-empty"></span>
                Termin vereinbaren
              </div>
            </div>

            <div className="hero__progress">
              <div className="hero__progress-bar">
                <span />
              </div>
              <span>2 von 3 Schritten erledigt</span>
            </div>
          </div>

          <div className="hero__decoration hero__decoration--one" />
          <div className="hero__decoration hero__decoration--two" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
