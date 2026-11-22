import { useState } from "react";
import { useNavigate } from "react-router-dom";

import type {
  AssistantRequest,
  ConversationMessage,
  ProcedureMatch,
} from "../../../types/assistant";

import "./ProcedureAssistant.css";

const ProcedureAssistant = () => {
  const navigate = useNavigate();

  const [countryCode, setCountryCode] = useState("DE");
  const [city, setCity] = useState("Mayen");
  const [language, setLanguage] = useState("uk");
  const [message, setMessage] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<ProcedureMatch | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);

  const sendAssistantRequest = async (
    request: AssistantRequest,
  ): Promise<ProcedureMatch> => {
    const apiResponse = await fetch("http://localhost:3001/api/assistant", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!apiResponse.ok) {
      throw new Error("Failed to send request");
    }

    const data = await apiResponse.json();

    console.log("Assistant response:", data);

    return data as ProcedureMatch;
  };

  const submitAssistantMessage = async (
    userMessage: string,
    continueConversation: boolean,
  ) => {
    const baseConversation = continueConversation ? conversation : [];

    const updatedConversation: ConversationMessage[] = [
      ...baseConversation,
      {
        role: "user",
        content: userMessage,
      },
    ];

    const request: AssistantRequest = {
      message: userMessage,
      location: {
        countryCode,
        city,
      },
      language,
      conversation: updatedConversation,
    };

    try {
      setIsLoading(true);
      setResponse(null);
      setError(null);

      setConversation(updatedConversation);

      const assistantResponse = await sendAssistantRequest(request);

      if (
        assistantResponse.status === "matched" &&
        assistantResponse.procedureId
      ) {
        navigate(`/verfahren/${assistantResponse.procedureId}`);
        return;
      }

      if (assistantResponse.status === "clarification_needed") {
        const assistantMessages: ConversationMessage[] = [
          ...(assistantResponse.message
            ? [
                {
                  role: "assistant" as const,
                  content: assistantResponse.message,
                },
              ]
            : []),
          ...(assistantResponse.questions?.map((question) => ({
            role: "assistant" as const,
            content: question.question,
          })) ?? []),
        ];

        setConversation([...updatedConversation, ...assistantMessages]);
      }

      setResponse(assistantResponse);
    } catch (error) {
      console.error("Assistant request failed:", error);
      setError("Etwas ist schiefgelaufen. Bitte versuche es erneut.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const userMessage = message.trim();

    if (!userMessage) return;

    const continueConversation = response?.status === "clarification_needed";

    await submitAssistantMessage(userMessage, continueConversation);
  };

  const handleClarificationAnswer = async (answer: string) => {
    await submitAssistantMessage(answer, true);
  };

  const isSubmitDisabled = !message.trim();

  return (
    <section className="procedure-assistant" id="assistant">
      <div className="procedure-assistant__container">
        <div className="procedure-assistant__intro">
          <span className="procedure-assistant__eyebrow">
            DEIN PERSÖNLICHER WEGWEISER
          </span>

          <h2>Beschreibe dein Anliegen</h2>

          <p>
            Wähle aus, für welchen Ort du Informationen suchst, und beschreibe
            dein Anliegen in deiner Sprache.
          </p>
        </div>

        <form className="procedure-assistant__form" onSubmit={handleSubmit}>
          <div className="procedure-assistant__location">
            <label>
              Land
              <select
                value={countryCode}
                onChange={(event) => setCountryCode(event.target.value)}
              >
                <option value="DE">Deutschland</option>
              </select>
            </label>

            <label>
              Stadt
              <select
                value={city}
                onChange={(event) => setCity(event.target.value)}
              >
                <option value="Mayen">Mayen</option>
              </select>
            </label>

            <label>
              Sprache
              <select
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
              >
                <option value="uk">Українська</option>
                <option value="de">Deutsch</option>
                <option value="en">English</option>
              </select>
            </label>
          </div>

          <label className="procedure-assistant__message">
            <span>Wobei brauchst du Hilfe?</span>

            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Beschreibe dein Anliegen..."
              rows={5}
            />
          </label>

          <div className="procedure-assistant__footer">
            <span className="procedure-assistant__hint">
              Du kannst dein Anliegen in deiner bevorzugten Sprache schreiben.
            </span>

            <button
              type="submit"
              className="procedure-assistant__submit"
              disabled={isSubmitDisabled || isLoading}
            >
              {isLoading ? "Suche läuft..." : "Hilfe finden"}
              {!isLoading && <span aria-hidden="true">→</span>}
            </button>
          </div>
        </form>
        {response?.status === "clarification_needed" && (
          <div className="procedure-assistant__response">
            {response.message && (
              <p className="procedure-assistant__response-message">
                {response.message}
              </p>
            )}

            {response.questions?.map((question) => (
              <div key={question.id} className="procedure-assistant__question">
                <p className="procedure-assistant__question-text">
                  {question.question}
                </p>

                {question.type === "single_choice" && (
                  <div className="procedure-assistant__options">
                    {question.options.map((option) => (
                      <button
                        key={option}
                        type="button"
                        className="procedure-assistant__option"
                        onClick={() => handleClarificationAnswer(option)}
                        disabled={isLoading}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {response?.status === "out_of_scope" && (
          <div className="procedure-assistant__response">
            <p className="procedure-assistant__response-message">
              {response.message}
            </p>
          </div>
        )}

        {response?.status === "not_supported" && (
          <div className="procedure-assistant__response">
            <p className="procedure-assistant__response-message">
              {response.message}
            </p>
          </div>
        )}

        {response?.status === "discovered" && response.discoveredProcedure && (
          <div className="procedure-assistant__discovered">
            <div className="procedure-assistant__discovered-warning">
              <strong>⚠ Noch nicht geprüft</strong>
              <p>
                Dieses Verwaltungsverfahren wurde automatisch gefunden und noch
                nicht redaktionell geprüft. Bitte überprüfe alle Angaben vor
                einer Antragstellung bei der zuständigen Behörde.
              </p>
            </div>

            <div className="procedure-assistant__discovered-content">
              <span className="procedure-assistant__discovered-label">
                NEU ENTDECKTES VERFAHREN
              </span>

              <h3>{response.discoveredProcedure.title}</h3>

              <p>{response.discoveredProcedure.description}</p>

              <div className="procedure-assistant__discovered-meta">
                <span>
                  <strong>Region:</strong> {response.discoveredProcedure.region}
                </span>

                {response.discoveredProcedure.deadline && (
                  <span>
                    <strong>Frist:</strong>{" "}
                    {response.discoveredProcedure.deadline}
                  </span>
                )}
              </div>

              {response.discoveredProcedure.authority && (
                <div className="procedure-assistant__discovered-authority">
                  <h4>Zuständige Behörde</h4>

                  <p>{response.discoveredProcedure.authority.name}</p>

                  {response.discoveredProcedure.authority.address && (
                    <p>{response.discoveredProcedure.authority.address}</p>
                  )}

                  {response.discoveredProcedure.authority.website && (
                    <a
                      href={response.discoveredProcedure.authority.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Webseite der Behörde
                    </a>
                  )}
                </div>
              )}

              <div className="procedure-assistant__discovered-steps">
                <h4>Voraussichtliche Schritte</h4>

                {response.discoveredProcedure.steps.map((step, index) => (
                  <div
                    key={step.id}
                    className="procedure-assistant__discovered-step"
                  >
                    <h5>
                      {index + 1}. {step.title}
                    </h5>

                    <p>{step.description}</p>

                    {step.documents.length > 0 && (
                      <div>
                        <strong>Benötigte Unterlagen:</strong>

                        <ul>
                          {step.documents.map((document) => (
                            <li key={document.id}>
                              {document.title}
                              {!document.required && " (optional)"}
                              {document.condition && ` — ${document.condition}`}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {response.discoveredProcedure.sources &&
                response.discoveredProcedure.sources.length > 0 && (
                  <div className="procedure-assistant__discovered-sources">
                    <h4>Gefundene Quellen</h4>

                    <ul>
                      {response.discoveredProcedure.sources.map((source) => (
                        <li key={source.url}>
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {source.title}
                          </a>
                          <span> ({source.authority})</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>
          </div>
        )}

        {error && <div className="procedure-assistant__response">{error}</div>}
      </div>
    </section>
  );
};

export default ProcedureAssistant;
