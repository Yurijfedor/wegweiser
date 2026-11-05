import type { Procedure } from "../../types/procedure";

export const arbeitAufnehmen: Procedure = {
  id: "arbeit-aufnehmen",
  categoryId: "arbeit",
  title: "Arbeit aufnehmen",
  description:
    "Bereite deinen Arbeitsbeginn vor und kläre die wichtigsten Unterlagen und organisatorischen Schritte.",

  region: "Deutschland",

  deadline:
    "Informiere die zuständigen Stellen rechtzeitig, wenn sich deine persönliche oder finanzielle Situation durch die neue Arbeit ändert.",

  steps: [
    {
      id: "contract",
      title: "Arbeitsvertrag prüfen",
      description:
        "Prüfe die wichtigsten Bedingungen deines Arbeitsvertrags vor deinem Arbeitsbeginn.",
      documents: [
        {
          id: "employment-contract",
          title: "Arbeitsvertrag",
          description:
            "Prüfe Arbeitsbeginn, Arbeitszeit, Vergütung, Probezeit und weitere vereinbarte Bedingungen.",
          required: true,
        },
      ],
    },
    {
      id: "documents",
      title: "Unterlagen vorbereiten",
      description:
        "Halte die wichtigsten persönlichen Angaben und Unterlagen für deinen Arbeitgeber bereit.",
      documents: [
        {
          id: "tax-id",
          title: "Steuerliche Identifikationsnummer",
          description:
            "Deine persönliche Steueridentifikationsnummer kann für die Lohnabrechnung benötigt werden.",
          required: true,
        },
        {
          id: "social-insurance-number",
          title: "Sozialversicherungsnummer",
          description:
            "Halte deine Sozialversicherungsnummer bereit, falls dein Arbeitgeber diese benötigt.",
          required: false,
          condition:
            "Falls bereits eine Sozialversicherungsnummer vorhanden ist.",
        },
        {
          id: "bank-details",
          title: "Bankverbindung",
          description:
            "Gib deinem Arbeitgeber die erforderlichen Bankdaten für die Gehaltszahlung.",
          required: true,
        },
      ],
    },
    {
      id: "inform-authorities",
      title: "Änderungen mitteilen",
      description:
        "Informiere zuständige Stellen über die Aufnahme deiner Beschäftigung, wenn du Leistungen oder andere Unterstützung erhältst.",
      documents: [
        {
          id: "employment-notification",
          title: "Nachweis über die neue Beschäftigung",
          description:
            "Halte bei Bedarf deinen Arbeitsvertrag oder andere Unterlagen über den Beginn der Beschäftigung bereit.",
          required: false,
          condition:
            "Wenn eine Behörde oder Leistungsträger einen Nachweis verlangt.",
        },
      ],
    },
    {
      id: "start-work",
      title: "Arbeitsbeginn vorbereiten",
      description:
        "Kläre mit deinem Arbeitgeber Arbeitsort, Arbeitszeit und die organisatorischen Details für deinen ersten Arbeitstag.",
      documents: [],
    },
  ],

  sources: [
    {
      title: "Arbeit aufnehmen und behalten",
      url: "https://www.arbeitsagentur.de/grundsicherung/arbeit-finden/arbeit-aufnehmen",
      authority: "Bundesagentur für Arbeit",
    },
    {
      title: "Ihre Rechte im Job – Bundesagentur für Arbeit",
      url: "https://www.arbeitsagentur.de/arbeiten-in-deutschland/faire-migration",
      authority: "Bundesagentur für Arbeit",
    },
  ],
};

export const arbeitslosMelden: Procedure = {
  id: "arbeitslos-melden",
  categoryId: "arbeit",
  title: "Arbeitslos melden",
  description:
    "Melde dich rechtzeitig bei der Agentur für Arbeit arbeitslos und bereite die wichtigsten Schritte vor.",

  region: "Deutschland",

  deadline:
    "Du kannst dich frühestens drei Monate vor Beginn der Arbeitslosigkeit arbeitslos melden. Spätestens am ersten Tag der Arbeitslosigkeit solltest du die Meldung vornehmen, um Nachteile zu vermeiden.",

  authority: {
    name: "Agentur für Arbeit",
    website: "https://www.arbeitsagentur.de/",
  },

  steps: [
    {
      id: "job-search-registration",
      title: "Arbeitsuchendmeldung prüfen",
      description:
        "Wenn dein Arbeitsverhältnis bald endet, prüfe, ob du dich bereits arbeitsuchend gemeldet hast.",
      documents: [],
    },
    {
      id: "prepare-identification",
      title: "Identifizierung vorbereiten",
      description:
        "Bereite ein gültiges Ausweisdokument für die Online- oder persönliche Arbeitslosmeldung vor.",
      documents: [
        {
          id: "identity-document",
          title: "Personalausweis oder anderer Identitätsnachweis",
          description:
            "Für die persönliche Meldung benötigst du ein Ausweisdokument. Bei der Online-Meldung ist eine elektronische Identifizierung erforderlich.",
          required: true,
        },
        {
          id: "registration-certificate",
          title: "Aktuelle Meldebescheinigung",
          description:
            "Sie kann erforderlich sein, wenn du dich mit einem Reisepass oder Ersatzdokument ohne aktuelle Wohnanschrift ausweist.",
          required: false,
          condition:
            "Bei persönlicher Meldung mit Reisepass oder Ersatzdokument.",
        },
      ],
    },
    {
      id: "register-unemployed",
      title: "Arbeitslos melden",
      description:
        "Melde dich online über die Bundesagentur für Arbeit oder persönlich bei der für deinen Wohnort zuständigen Agentur für Arbeit arbeitslos.",
      documents: [],
    },
    {
      id: "apply-for-benefits",
      title: "Nächste Schritte klären",
      description:
        "Nach der Arbeitslosmeldung kannst du prüfen, ob du Arbeitslosengeld beantragen möchtest und welche weiteren Schritte für deine persönliche Situation erforderlich sind.",
      documents: [],
    },
  ],

  sources: [
    {
      title: "Arbeitslos melden – Bundesagentur für Arbeit",
      url: "https://www.arbeitsagentur.de/arbeitslos-arbeit-finden/arbeitslosengeld/ihre-schritte-wenn-sie-arbeitslos-werden/wie-sie-sich-arbeitslos-melden",
      authority: "Bundesagentur für Arbeit",
    },
    {
      title: "Ihre Schritte, wenn Sie arbeitslos werden",
      url: "https://www.arbeitsagentur.de/arbeitslos-arbeit-finden/arbeitslosengeld/ihre-schritte-wenn-sie-arbeitslos-werden",
      authority: "Bundesagentur für Arbeit",
    },
  ],
};
