import "./App.css";

const categories = [
  {
    id: "wohnen",
    icon: "🏠",
    title: "Wohnen & Umzug",
    description: "Anmeldung, Ummeldung und alles rund ums Wohnen.",
    count: "12 Checklisten",
  },
  {
    id: "familie",
    icon: "👨‍👩‍👧",
    title: "Familie & Kinder",
    description: "Geburt, Kindergeld, Schule und Familienleistungen.",
    count: "8 Checklisten",
  },
  {
    id: "arbeit",
    icon: "💼",
    title: "Arbeit & Beruf",
    description: "Arbeitsvertrag, Jobsuche und berufliche Veränderungen.",
    count: "10 Checklisten",
  },
  {
    id: "dokumente",
    icon: "📄",
    title: "Dokumente & Ausweise",
    description: "Ausweise, Bescheinigungen und wichtige Unterlagen.",
    count: "9 Checklisten",
  },
  {
    id: "finanzen",
    icon: "💶",
    title: "Finanzen & Leistungen",
    description: "Steuern, Sozialleistungen und finanzielle Unterstützung.",
    count: "7 Checklisten",
  },
  {
    id: "gesundheit",
    icon: "🏥",
    title: "Gesundheit",
    description: "Krankenversicherung, Arztbesuche und Gesundheitswesen.",
    count: "6 Checklisten",
  },
];

function App() {
  return (
    <div className="app">
      <header className="header">
        <div className="header-container">
          <a href="/" className="brand">
            <span className="brand-icon">W</span>
            <span>Wegweiser</span>
          </a>

          <nav className="navigation">
            <a href="#categories">Kategorien</a>
            <a href="#how-it-works">So funktioniert's</a>
          </nav>

          <button className="header-button">Meine Listen</button>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-content">
            <span className="hero-label">DEIN DIGITALER BEGLEITER</span>

            <h1>
              Behördengänge.
              <br />
              <span>Einfacher erledigen.</span>
            </h1>

            <p className="hero-description">
              Finde heraus, welche Dokumente du brauchst, welche Schritte auf
              dich warten und an welche Behörde du dich wenden musst.
            </p>

            <div className="hero-search">
              <span>⌕</span>
              <input
                type="search"
                placeholder="Was möchtest du erledigen?"
                aria-label="Anliegen suchen"
              />
              <button type="button">Suchen</button>
            </div>

            <p className="hero-note">✓ Kostenlos · Einfach · Übersichtlich</p>
          </div>
        </section>

        <section className="categories" id="categories">
          <div className="section-heading">
            <div>
              <span className="section-label">FINDE DEIN ANLIEGEN</span>
              <h2>Wobei können wir dir helfen?</h2>
              <p>
                Wähle einen Bereich und erhalte deine persönliche Checkliste.
              </p>
            </div>

            <a href="#categories" className="all-categories">
              Alle Kategorien →
            </a>
          </div>

          <div className="category-grid">
            {categories.map((category) => (
              <article className="category-card" key={category.id}>
                <div className="category-icon">{category.icon}</div>

                <h3>{category.title}</h3>

                <p>{category.description}</p>

                <span className="category-count">{category.count}</span>

                <span className="category-arrow">→</span>
              </article>
            ))}
          </div>
        </section>

        <section className="help-section" id="how-it-works">
          <div>
            <span className="section-label">WEGWEISER HILFT DIR</span>
            <h2>Gut vorbereitet. Schritt für Schritt.</h2>
            <p>
              Die richtigen Informationen an einem Ort. Damit du weißt, was zu
              tun ist.
            </p>
          </div>
        </section>
      </main>

      <footer className="footer">
        <span>© 2026 Wegweiser</span>
        <span>Deine Orientierung bei Behörden und Dokumenten.</span>
      </footer>
    </div>
  );
}

export default App;
