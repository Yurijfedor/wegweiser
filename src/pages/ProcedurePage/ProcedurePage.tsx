import { Link, useParams } from "react-router-dom";

import { getProcedureById } from "../../data/procedures";

import { Header, Footer } from "../../components/layout";

import Checklist from "../../components/procedures/Checklist";

import "./ProcedurePage.css";

const ProcedurePage = () => {
  const { procedureId } = useParams();

  // Тимчасово підтримуємо першу процедуру.
  const procedure = procedureId ? getProcedureById(procedureId) : undefined;

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

          <Checklist procedure={procedure} />

          {procedure.authority && (
            <section className="procedure-page__authority">
              <h2>Zuständige Behörde</h2>

              <h3>{procedure.authority.name}</h3>

              {procedure.authority.address && (
                <p>{procedure.authority.address}</p>
              )}

              {procedure.authority.phone && <p>{procedure.authority.phone}</p>}

              {procedure.authority.email && <p>{procedure.authority.email}</p>}

              {procedure.authority.website && (
                <a
                  href={procedure.authority.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Zur offiziellen Website →
                </a>
              )}
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
