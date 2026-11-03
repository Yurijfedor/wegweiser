import { useState } from "react";

import type { Procedure } from "../../../types/procedure";

import "./Checklist.css";

interface ChecklistProps {
  procedure: Procedure;
}

const Checklist = ({ procedure }: ChecklistProps) => {
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>(
    {},
  );

  const totalItems = procedure.steps.reduce(
    (total, step) => total + 1 + step.documents.length,
    0,
  );

  const completedCount = procedure.steps.reduce((total, step) => {
    const completedDocuments = step.documents.filter((document) =>
      Boolean(completedItems[document.id]),
    ).length;

    const isStepCompleted =
      step.documents.length > 0
        ? completedDocuments === step.documents.length
        : Boolean(completedItems[step.id]);

    return total + completedDocuments + Number(isStepCompleted);
  }, 0);

  const progress = totalItems > 0 ? (completedCount / totalItems) * 100 : 0;

  const toggleStep = (stepId: string, checked: boolean) => {
    const step = procedure.steps.find((item) => item.id === stepId);

    if (!step) return;

    setCompletedItems((previous) => {
      const updated = { ...previous };

      if (step.documents.length > 0) {
        step.documents.forEach((document) => {
          updated[document.id] = checked;
        });
      } else {
        updated[step.id] = checked;
      }

      return updated;
    });
  };

  const toggleDocument = (documentId: string) => {
    setCompletedItems((previous) => ({
      ...previous,
      [documentId]: !previous[documentId],
    }));
  };

  return (
    <section className="checklist">
      <div className="checklist__header">
        <div>
          <span className="checklist__eyebrow">DEIN FORTSCHRITT</span>

          <h2>Deine Checkliste</h2>
        </div>

        <span className="checklist__counter">
          {completedCount} / {totalItems}
        </span>
      </div>

      <div
        className="checklist__progress"
        role="progressbar"
        aria-valuenow={completedCount}
        aria-valuemin={0}
        aria-valuemax={totalItems}
        aria-label="Fortschritt der Checkliste"
      >
        <div
          className="checklist__progress-bar"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="checklist__progress-label">
        {Math.round(progress)}% erledigt
      </p>

      <div className="checklist__steps">
        {procedure.steps.map((step, index) => (
          <article className="checklist-step" key={step.id}>
            <label className="checklist-step__heading">
              <input
                type="checkbox"
                checked={
                  step.documents.length > 0
                    ? step.documents.every((document) =>
                        Boolean(completedItems[document.id]),
                      )
                    : Boolean(completedItems[step.id])
                }
                onChange={(event) => toggleStep(step.id, event.target.checked)}
              />

              <span className="checklist-step__number">{index + 1}</span>

              <span className="checklist-step__title">{step.title}</span>
            </label>

            <p className="checklist-step__description">{step.description}</p>

            {step.documents.length > 0 && (
              <div className="checklist-step__documents">
                {step.documents.map((document) => (
                  <label className="checklist-document" key={document.id}>
                    <input
                      type="checkbox"
                      checked={Boolean(completedItems[document.id])}
                      onChange={() => toggleDocument(document.id)}
                    />

                    <span className="checklist-document__content">
                      <strong>{document.title}</strong>

                      <span>{document.description}</span>

                      {document.condition && (
                        <small>{document.condition}</small>
                      )}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
};

export default Checklist;
