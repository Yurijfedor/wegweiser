import type { Procedure } from "../../types/procedure";

export const kindergeldBeantragen: Procedure = {
  id: "kindergeld-beantragen",
  categoryId: "familie",
  title: "Kindergeld beantragen",
  description:
    "Beantrage Kindergeld bei der zuständigen Familienkasse und reiche die erforderlichen Angaben und Nachweise ein.",

  region: "Deutschland",

  deadline:
    "Es gibt keine feste Antragsfrist. Kindergeld kann jedoch grundsätzlich höchstens für die letzten sechs Monate rückwirkend gezahlt werden.",

  authority: {
    name: "Familienkasse der Bundesagentur für Arbeit",
    website: "https://www.arbeitsagentur.de/familie-und-kinder",
  },

  steps: [
    {
      id: "requirements",
      title: "Voraussetzungen prüfen",
      description:
        "Prüfe, ob du die Voraussetzungen für den Bezug von Kindergeld erfüllst.",
      documents: [],
    },
    {
      id: "documents",
      title: "Angaben und Unterlagen vorbereiten",
      description:
        "Bereite die wichtigsten Angaben für den Kindergeldantrag vor.",
      documents: [
        {
          id: "applicant-tax-id",
          title: "Steuerliche Identifikationsnummer",
          description:
            "Die steuerliche Identifikationsnummer der antragstellenden Person.",
          required: true,
        },
        {
          id: "child-tax-id",
          title: "Steuerliche Identifikationsnummer des Kindes",
          description:
            "Die steuerliche Identifikationsnummer des Kindes, für das Kindergeld beantragt wird.",
          required: true,
        },
        {
          id: "additional-evidence",
          title: "Zusätzliche Nachweise",
          description:
            "Je nach persönlicher Situation können weitere Nachweise erforderlich sein.",
          required: false,
          condition:
            "Zum Beispiel bei volljährigen Kindern oder besonderen persönlichen Situationen.",
        },
      ],
    },
    {
      id: "application",
      title: "Kindergeld beantragen",
      description:
        "Stelle den Antrag online über die Familienkasse oder reiche ihn schriftlich ein.",
      documents: [],
    },
    {
      id: "decision",
      title: "Bescheid abwarten",
      description:
        "Die Familienkasse prüft deinen Antrag und informiert dich über die Entscheidung.",
      documents: [],
    },
  ],

  sources: [
    {
      title: "Kindergeld beantragen – Bundesportal",
      url: "https://verwaltung.bund.de/leistungsverzeichnis/de/leistung/99041008017000",
      authority: "Bundesministerium der Finanzen",
    },
    {
      title: "Kindergeld – Bundesagentur für Arbeit",
      url: "https://www.arbeitsagentur.de/familie-und-kinder/kindergeld-online",
      authority: "Bundesagentur für Arbeit",
    },
    {
      title: "Kindergeld: Formulare und Online-Antrag",
      url: "https://www.arbeitsagentur.de/familie-und-kinder/downloads-familie-und-kinder/formulare-kindergeld",
      authority: "Bundesagentur für Arbeit",
    },
  ],
};

export const kitaPlatzBeantragen: Procedure = {
  id: "kita-platz-beantragen",
  categoryId: "familie",
  title: "Kita-Platz beantragen",
  description:
    "Informiere dich über Betreuungsmöglichkeiten in Mayen und beantrage einen Platz für dein Kind.",

  region: "Mayen, Rheinland-Pfalz",

  deadline:
    "Informiere dich frühzeitig über freie Plätze und die örtlichen Anmeldefristen.",

  authority: {
    name: "Kindertagesstätten, -tageseinrichtungen – Stadtverwaltung Mayen",
    address: "Rosengasse 2, 56727 Mayen",
    phone: "+49 2651 88-3501",
    email: "info@mayen.de",
    website:
      "https://www.mayen.de/buergerservice/abteilungen/RLP%3Adepartment%3A341265/kindertagesstaetten-tageseinrichtungen/",
  },

  steps: [
    {
      id: "inform",
      title: "Über Betreuungsmöglichkeiten informieren",
      description:
        "Informiere dich über Kindertagesstätten und andere Betreuungsmöglichkeiten in Mayen.",
      documents: [],
    },
    {
      id: "prepare",
      title: "Anmeldung vorbereiten",
      description:
        "Bereite die Angaben vor, die für die Anmeldung deines Kindes benötigt werden.",
      documents: [
        {
          id: "child-details",
          title: "Angaben zum Kind",
          description:
            "Halte die persönlichen Daten und das Geburtsdatum deines Kindes bereit.",
          required: true,
        },
        {
          id: "parent-details",
          title: "Angaben zu den Eltern oder Sorgeberechtigten",
          description:
            "Bereite die Kontaktdaten der antragstellenden oder sorgeberechtigten Person vor.",
          required: true,
        },
        {
          id: "care-details",
          title: "Gewünschter Betreuungsumfang",
          description:
            "Überlege, ab wann und in welchem Umfang dein Kind betreut werden soll.",
          required: true,
        },
      ],
    },
    {
      id: "apply",
      title: "Kita-Platz anmelden",
      description:
        "Nutze den verfügbaren Anmeldeweg der Stadt Mayen oder informiere dich bei der zuständigen Stelle über das örtliche Verfahren.",
      documents: [],
    },
    {
      id: "response",
      title: "Rückmeldung abwarten",
      description:
        "Nach der Anmeldung erfolgt die Platzvergabe nach den örtlichen Regelungen.",
      documents: [],
    },
  ],

  sources: [
    {
      title:
        "Platz in Kindertageseinrichtung oder Kindertagespflege beantragen",
      url: "https://www.mayen.de/buergerservice/leistungen/RLP%3Aentry%3A258459/platz-in-kindertageseinrichtung-oder-kindertagespflege-beantragen/",
      authority: "Stadt Mayen",
    },
    {
      title: "Kindertagesstätten, -tageseinrichtungen – Stadt Mayen",
      url: "https://www.mayen.de/buergerservice/abteilungen/RLP%3Adepartment%3A341265/kindertagesstaetten-tageseinrichtungen/",
      authority: "Stadt Mayen",
    },
    {
      title: "Online-Dienstleistungen – Stadt Mayen",
      url: "https://www.mayen.de/rathaus-buergerservice/buergerservice/online-dienstleistungen/",
      authority: "Stadt Mayen",
    },
  ],
};
