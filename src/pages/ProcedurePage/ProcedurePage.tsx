import { Link, useParams } from "react-router-dom";

import { wohnsitzAnmelden } from "../../data/procedures";

import { Header, Footer } from "../../components/layout";

import "./ProcedurePage.css";

const ProcedurePage = () => {
  const { procedureId } = useParams();

  // Тимчасово підтримуємо першу процедуру.
  const procedure =
    procedureId === wohnsitzAnmelden.id ? wohnsitzAnmelden : null;

  if (!procedure) {
    return (
      <>
        <Header />
        <main className="procedure-page">
          <div className="procedure-page__container">
            <h1>Verfahren nicht gefunden</h1>
            <Link to="/">Zurück zur Startseite</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="procedure-page">
        <div className="procedure-page__container">
          <Link to="/" className="procedure-page__back">
            ← Zurück zur Übersicht
          </Link>

          <div className="procedure-page__header">
            <span className="procedure-page__eyebrow">{procedure.region}</span>

            <h1>{procedure.title}</h1>

            <p>{procedure.description}</p>

            {procedure.deadline && (
              <div className="procedure-page__deadline">
                <strong>Frist:</strong> {procedure.deadline}
              </div>
            )}
          </div>

          <section className="procedure-page__section">
            <h2>Deine nächsten Schritte</h2>

            <div className="procedure-page__steps">
              {procedure.steps.map((step, index) => (
                <article className="procedure-step" key={step.id}>
                  <div className="procedure-step__number">{index + 1}</div>

                  <div className="procedure-step__content">
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>

                    {step.documents.length > 0 && (
                      <div className="procedure-step__documents">
                        <h4>Benötigte Unterlagen</h4>

                        {step.documents.map((document) => (
                          <div className="procedure-document" key={document.id}>
                            <span className="procedure-document__title">
                              {document.title}
                            </span>

                            <span className="procedure-document__description">
                              {document.description}
                            </span>

                            {document.condition && (
                              <span className="procedure-document__condition">
                                {document.condition}
                              </span>
                            )}

                            <span className="procedure-document__status">
                              {document.condition && document.required
                                ? "Je nach Situation erforderlich"
                                : document.required
                                  ? "Erforderlich"
                                  : "Zusätzlich"}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>

          {procedure.authority && (
            <section className="procedure-page__authority">
              <h2>Zuständige Behörde</h2>

              <h3>{procedure.authority.name}</h3>

              <p>{procedure.authority.address}</p>
              <p>{procedure.authority.phone}</p>
              <p>{procedure.authority.email}</p>

              <a
                href={procedure.authority.website}
                target="_blank"
                rel="noopener noreferrer"
              >
                Zur offiziellen Website →
              </a>
            </section>
          )}

          {procedure.sources && (
            <section className="procedure-page__sources">
              <h2>Offizielle Informationen</h2>

              {procedure.sources.map((source) => (
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={source.url}
                >
                  {source.title} — {source.authority} ↗
                </a>
              ))}
            </section>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
};

export default ProcedurePage;
