import "./HowItWorks.css";

const steps = [
  {
    number: "1",
    title: "Anliegen auswählen",
    description: "Wähle ein Thema, das zu deiner aktuellen Situation passt.",
  },
  {
    number: "2",
    title: "Passendes Verfahren finden",
    description:
      "Wähle das Verfahren aus, das du Schritt für Schritt erledigen möchtest.",
  },
  {
    number: "3",
    title: "Schritte erledigen",
    description:
      "Nutze die Checkliste und behalte deinen Fortschritt jederzeit im Blick.",
  },
];

const HowItWorks = () => {
  return (
    <section className="how-it-works" id="ablauf">
      <div className="how-it-works__container">
        <div className="how-it-works__header">
          <span className="how-it-works__eyebrow">SO FUNKTIONIERT'S</span>

          <h2>Einfach Schritt für Schritt.</h2>

          <p>
            Wegweiser hilft dir, Behördengänge übersichtlich zu organisieren und
            die wichtigsten Aufgaben im Blick zu behalten.
          </p>
        </div>

        <div className="how-it-works__steps">
          {steps.map((step) => (
            <article className="how-it-works__step" key={step.number}>
              <span className="how-it-works__number">{step.number}</span>

              <h3>{step.title}</h3>

              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
