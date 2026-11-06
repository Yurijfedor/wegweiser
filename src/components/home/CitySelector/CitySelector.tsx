import "./CitySelector.css";

const CitySelector = () => {
  return (
    <section className="city-selector">
      <div className="city-selector__container">
        <div className="city-selector__content">
          <span className="city-selector__eyebrow">DEIN STANDORT</span>

          <h2>Wo wohnst du?</h2>

          <p>
            Wähle deine Stadt, damit wir dir passende Informationen und
            Verfahren anzeigen können.
          </p>
        </div>

        <div className="city-selector__control">
          <label htmlFor="city">Deine Stadt</label>

          <select id="city" defaultValue="mayen">
            <option value="mayen">Mayen</option>
          </select>

          <span className="city-selector__hint">
            Weitere Städte folgen bald.
          </span>
        </div>
      </div>
    </section>
  );
};

export default CitySelector;
