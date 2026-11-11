import { useState } from "react";

import type { AssistantRequest } from "../../../types/assistant";

import "./ProcedureAssistant.css";

const ProcedureAssistant = () => {
  const [countryCode, setCountryCode] = useState("DE");
  const [city, setCity] = useState("Mayen");
  const [language, setLanguage] = useState("uk");
  const [message, setMessage] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const request: AssistantRequest = {
      message: message.trim(),
      location: {
        countryCode,
        city,
      },
      language,
    };

    // Тимчасово: перевіряємо сформований контракт.
    console.log("Assistant request:", request);
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
              disabled={isSubmitDisabled}
            >
              Hilfe finden
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ProcedureAssistant;
