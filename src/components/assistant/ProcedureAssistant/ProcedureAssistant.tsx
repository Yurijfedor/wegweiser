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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const userMessage = message.trim();

    const newConversation: ConversationMessage[] = [
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
      conversation: newConversation,
    };

    try {
      setIsLoading(true);
      setResponse(null);
      setError(null);

      setConversation(newConversation);

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

        setConversation([...newConversation, ...assistantMessages]);
      }

      setResponse(assistantResponse);
    } catch (error) {
      console.error("Assistant request failed:", error);
      setError("Etwas ist schiefgelaufen. Bitte versuche es erneut.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClarificationAnswer = async (answer: string) => {
    const updatedConversation: ConversationMessage[] = [
      ...conversation,
      {
        role: "user",
        content: answer,
      },
    ];

    const request: AssistantRequest = {
      message: answer,
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
      console.error("Clarification request failed:", error);
      setError("Etwas ist schiefgelaufen. Bitte versuche es erneut.");
    } finally {
      setIsLoading(false);
    }
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

        {error && <div className="procedure-assistant__response">{error}</div>}
      </div>
    </section>
  );
};

export default ProcedureAssistant;
