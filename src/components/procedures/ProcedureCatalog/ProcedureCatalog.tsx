import { Link } from "react-router-dom";

import { procedures } from "../../../data/procedures";

import "./ProcedureCatalog.css";

interface ProcedureCatalogProps {
  selectedCategory: string | null;
}

const ProcedureCatalog = ({ selectedCategory }: ProcedureCatalogProps) => {
  const filteredProcedures = selectedCategory
    ? procedures.filter(
        (procedure) => procedure.categoryId === selectedCategory,
      )
    : procedures;

  return (
    <section className="procedure-catalog" id="procedure-catalog">
      <div className="procedure-catalog__container">
        <div className="procedure-catalog__header">
          <div>
            <span className="procedure-catalog__eyebrow">VERFAHREN</span>

            <h2>
              {selectedCategory
                ? "Verfahren in dieser Kategorie"
                : "Wobei können wir dir helfen?"}
            </h2>
          </div>

          <p>
            Wähle ein Verfahren und gehe Schritt für Schritt durch die
            wichtigsten Aufgaben.
          </p>
        </div>

        {filteredProcedures.length > 0 ? (
          <div className="procedure-catalog__grid">
            {filteredProcedures.map((procedure) => (
              <Link
                className="procedure-card"
                key={procedure.id}
                to={`/verfahren/${procedure.id}`}
              >
                <span className="procedure-card__category">
                  {procedure.categoryId}
                </span>

                <h3>{procedure.title}</h3>

                <p>{procedure.description}</p>

                {procedure.deadline && (
                  <span className="procedure-card__deadline">
                    {procedure.deadline}
                  </span>
                )}

                <span className="procedure-card__link">Verfahren öffnen →</span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="procedure-catalog__empty">
            <h3>Diese Verfahren sind noch in Vorbereitung.</h3>

            <p>
              Wir arbeiten daran, bald hilfreiche
              Schritt-für-Schritt-Anleitungen für diese Kategorie
              bereitzustellen.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProcedureCatalog;
