import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getProcedureById } from "../../data/procedures";
import type { Procedure } from "../../types/procedure";

import { Header, Footer } from "../../components/layout";
import Checklist from "../../components/procedures/Checklist";

import "./ProcedurePage.css";

interface DiscoveryCandidateResponse {
  candidate: {
    id: string;
    procedure: Omit<Procedure, "id">;
  };
}

const ProcedurePage = () => {
  const { procedureId, candidateId } = useParams();

  const [discoveredProcedure, setDiscoveredProcedure] =
    useState<Procedure | null>(null);

  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (!candidateId) return;

    const controller = new AbortController();

    const loadDiscoveredProcedure = async () => {
      setLoading(true);
      setLoadError(false);
      setDiscoveredProcedure(null);

      try {
        const response = await fetch(
          `http://localhost:3001/api/discovery/candidates/${candidateId}`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error("Failed to load discovered procedure");
        }

        const data = (await response.json()) as DiscoveryCandidateResponse;

        const procedure: Procedure = {
          ...data.candidate.procedure,
          id: data.candidate.id,
        };

        setDiscoveredProcedure(procedure);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }

        console.error("Failed to load discovered procedure:", error);
        setLoadError(true);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadDiscoveredProcedure();

    return () => controller.abort();
  }, [candidateId]);

  const procedure = candidateId
    ? discoveredProcedure
    : procedureId
      ? getProcedureById(procedureId)
      : undefined;

  if (loading) {
    return (
      <>
        <Header />
        <main className="procedure-page">
          <div className="procedure-page__container">
            <p>Verfahren wird geladen...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (loadError || !procedure) {
    return (
      <>
        <Header />
        <main className="procedure-page">
          <div className="procedure-page__container">
            <h1>
              {loadError
                ? "Informationen konnten nicht geladen werden"
                : "Verfahren nicht gefunden"}
            </h1>
            <Link to="/">Zurück zur Startseite</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const verification = procedure.verification ?? {
    status: "unverified" as const,
  };

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

          <section className="procedure-page__verification">
            <div className="procedure-page__verification-header">
              <span>Status der Informationen</span>

              <span
                className={`procedure-page__verification-badge procedure-page__verification-badge--${verification.status}`}
              >
                {verification.status === "verified"
                  ? "Verified"
                  : verification.status === "needs_review"
                    ? "Needs Review"
                    : "Unverified"}
              </span>
            </div>

            {verification.status === "verified" &&
              verification.lastVerifiedAt && (
                <p>
                  Zuletzt geprüft:{" "}
                  {new Date(verification.lastVerifiedAt).toLocaleDateString(
                    "de-DE",
                  )}
                </p>
              )}

            {verification.status === "unverified" && (
              <p>
                Diese Informationen wurden noch nicht vollständig überprüft.
              </p>
            )}

            {verification.status === "needs_review" && (
              <p>Diese Informationen müssen erneut überprüft werden.</p>
            )}
          </section>

          <Checklist procedure={procedure} />

          {procedure.authority && (
            <section className="procedure-page__authority">
              <h2>Zuständige Behörde</h2>

              <h3>{procedure.authority.name}</h3>

              {procedure.authority.address && (
                <p className="procedure-page__contact">
                  <strong>Adresse:</strong> {procedure.authority.address}
                </p>
              )}

              {procedure.authority.phone && (
                <p className="procedure-page__contact">
                  <strong>Telefon:</strong>{" "}
                  <a
                    href={`tel:${procedure.authority.phone.replace(/[^\d+]/g, "")}`}
                  >
                    {procedure.authority.phone}
                  </a>
                </p>
              )}

              {procedure.authority.email && (
                <p className="procedure-page__contact">
                  <strong>E-Mail:</strong>{" "}
                  <a href={`mailto:${procedure.authority.email}`}>
                    {procedure.authority.email}
                  </a>
                </p>
              )}

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
