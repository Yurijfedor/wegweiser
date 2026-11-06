import type { Procedure } from "../../types/procedure";

export const grundsicherungsgeldBeantragen: Procedure = {
  id: "grundsicherungsgeld-beantragen",
  categoryId: "finanzen",
  title: "Grundsicherungsgeld beantragen",
  description:
    "Beantrage finanzielle Unterstützung beim zuständigen Jobcenter und bereite die erforderlichen Angaben und Nachweise vor.",

  region: "Deutschland",

  deadline:
    "Stelle deinen Antrag möglichst frühzeitig. Die Leistungen werden grundsätzlich ab dem Monat der Antragstellung geprüft.",

  authority: {
    name: "Jobcenter",
    website: "https://www.arbeitsagentur.de/grundsicherung",
  },

  steps: [
    {
      id: "check-requirements",
      title: "Anspruch prüfen",
      description:
        "Informiere dich über die Voraussetzungen und prüfe, ob Grundsicherungsgeld für deine persönliche Situation infrage kommt.",
      documents: [],
    },
    {
      id: "prepare-documents",
      title: "Angaben und Nachweise vorbereiten",
      description:
        "Bereite die wichtigsten Informationen über deine persönliche und finanzielle Situation vor.",
      documents: [
        {
          id: "identity-document",
          title: "Identitätsnachweis",
          description:
            "Zum Beispiel Personalausweis, gültiger Reisepass mit aktueller Meldebescheinigung oder Aufenthaltstitel.",
          required: true,
        },
        {
          id: "income-proof",
          title: "Nachweise über Einkommen",
          description:
            "Bereite Nachweise über vorhandenes Einkommen und regelmäßige Einnahmen vor.",
          required: true,
        },
        {
          id: "bank-statements",
          title: "Aktuelle Kontoauszüge",
          description:
            "Kontoauszüge können als Nachweis über deine finanzielle Situation benötigt werden.",
          required: true,
        },
        {
          id: "housing-costs",
          title: "Nachweise über Wohnkosten",
          description:
            "Zum Beispiel Mietvertrag sowie Unterlagen zu Heiz- und Nebenkosten.",
          required: true,
        },
        {
          id: "additional-documents",
          title: "Weitere Nachweise",
          description:
            "Je nach persönlicher Situation können weitere Unterlagen erforderlich sein.",
          required: false,
          condition:
            "Abhängig von deiner persönlichen Lebenssituation und den Angaben im Antrag.",
        },
      ],
    },
    {
      id: "submit-application",
      title: "Antrag stellen",
      description:
        "Stelle den Antrag online oder wende dich an dein zuständiges Jobcenter.",
      documents: [],
    },
    {
      id: "submit-missing-documents",
      title: "Fehlende Unterlagen nachreichen",
      description:
        "Reiche angeforderte oder fehlende Nachweise möglichst schnell nach.",
      documents: [],
    },
    {
      id: "check-decision",
      title: "Bescheid prüfen",
      description:
        "Nach der Bearbeitung erhältst du einen Bescheid. Prüfe die Angaben und die Entscheidung sorgfältig.",
      documents: [],
    },
  ],

  sources: [
    {
      title: "Grundsicherungsgeld – Bundesagentur für Arbeit",
      url: "https://www.arbeitsagentur.de/grundsicherung",
      authority: "Bundesagentur für Arbeit",
    },
    {
      title: "Online-Services der Jobcenter",
      url: "https://www.arbeitsagentur.de/grundsicherung/online-services-im-ueberblick",
      authority: "Bundesagentur für Arbeit",
    },
  ],
};

export const wohngeldBeantragen: Procedure = {
  id: "wohngeld-beantragen",
  categoryId: "finanzen",
  title: "Wohngeld beantragen",
  description:
    "Beantrage einen Zuschuss zu deinen Wohnkosten, wenn du die Voraussetzungen für Wohngeld erfüllst.",

  region: "Deutschland",

  deadline:
    "Stelle den Antrag möglichst frühzeitig. Wohngeld wird grundsätzlich ab dem Monat berücksichtigt, in dem der Antrag bei der zuständigen Wohngeldbehörde eingeht.",

  steps: [
    {
      id: "check-eligibility",
      title: "Anspruch prüfen",
      description:
        "Prüfe, ob Wohngeld für deine persönliche und finanzielle Situation infrage kommt.",
      documents: [],
    },
    {
      id: "prepare-documents",
      title: "Unterlagen vorbereiten",
      description: "Bereite die wichtigsten Nachweise für deinen Antrag vor.",
      documents: [
        {
          id: "wohngeld-application",
          title: "Wohngeldantrag",
          description:
            "Fülle den Antrag für die zuständige Wohngeldbehörde aus.",
          required: true,
        },
        {
          id: "housing-cost-proof",
          title: "Nachweis über die Wohnkosten",
          description:
            "Zum Beispiel Mietvertrag oder andere Nachweise über deine monatlichen Wohnkosten.",
          required: true,
        },
        {
          id: "income-proof",
          title: "Einkommensnachweise",
          description:
            "Lege Nachweise über das Einkommen der Personen vor, die bei der Berechnung berücksichtigt werden.",
          required: true,
        },
        {
          id: "additional-documents",
          title: "Weitere Nachweise",
          description:
            "Die Wohngeldbehörde kann abhängig von deiner persönlichen Situation weitere Unterlagen verlangen.",
          required: false,
          condition: "Abhängig von Haushalt, Einkommen und Wohnsituation.",
        },
      ],
    },
    {
      id: "submit-application",
      title: "Antrag einreichen",
      description:
        "Reiche den Antrag bei der für deinen Wohnort zuständigen Wohngeldbehörde ein. Je nach Region ist auch eine Online-Antragstellung möglich.",
      documents: [],
    },
    {
      id: "submit-missing-documents",
      title: "Unterlagen nachreichen",
      description:
        "Reiche fehlende oder zusätzlich angeforderte Nachweise möglichst schnell nach.",
      documents: [],
    },
    {
      id: "check-decision",
      title: "Bescheid erhalten und prüfen",
      description:
        "Nach der Prüfung erhältst du einen Bescheid über die Entscheidung und gegebenenfalls die Höhe des Wohngelds.",
      documents: [],
    },
  ],

  sources: [
    {
      title: "Wohngeld – Familienportal des Bundes",
      url: "https://familienportal.de/familienportal/familienleistungen/weitere-leistungen/wohngeld",
      authority: "Familienportal des Bundes",
    },
    {
      title: "Wohngeld erstmalig oder neu beantragen – Bundesportal",
      url: "https://verwaltung.bund.de/leistungsverzeichnis/de/leistung/99107023037000",
      authority: "Bundesportal",
    },
  ],
};
