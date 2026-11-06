import type { Procedure } from "../../types/procedure";

export const fuehrerscheinUmschreiben: Procedure = {
  id: "fuehrerschein-umschreiben",
  categoryId: "alltag",
  title: "Ausländischen Führerschein umschreiben",
  description:
    "Lass deinen ausländischen Führerschein in einen deutschen Führerschein umschreiben.",

  region: "Deutschland",

  deadline:
    "Prüfe rechtzeitig, wie lange du mit deinem ausländischen Führerschein in Deutschland fahren darfst.",

  steps: [
    {
      id: "check-requirements",
      title: "Voraussetzungen prüfen",
      description:
        "Prüfe, welche Regeln für deinen Führerschein gelten. Die Anforderungen unterscheiden sich je nachdem, in welchem Land dein Führerschein ausgestellt wurde.",
      documents: [],
    },
    {
      id: "prepare-documents",
      title: "Unterlagen vorbereiten",
      description: "Bereite die erforderlichen Unterlagen für den Antrag vor.",
      documents: [
        {
          id: "identity-document",
          title: "Personalausweis oder Reisepass",
          description: "Du benötigst einen gültigen Lichtbildausweis.",
          required: true,
        },
        {
          id: "registration-certificate",
          title: "Meldebescheinigung",
          description:
            "Bei Vorlage eines Reisepasses kann zusätzlich eine aktuelle Meldebescheinigung erforderlich sein.",
          required: false,
          condition: "Abhängig vom vorgelegten Identitätsdokument.",
        },
        {
          id: "biometric-photo",
          title: "Biometrisches Passfoto",
          description:
            "Ein aktuelles biometrisches Lichtbild wird für den Antrag benötigt.",
          required: true,
        },
        {
          id: "foreign-driving-license",
          title: "Ausländischer Führerschein",
          description:
            "Lege deinen gültigen ausländischen Führerschein vor. Je nach Fall kann eine amtliche Übersetzung erforderlich sein.",
          required: true,
        },
        {
          id: "additional-documents",
          title: "Weitere Nachweise",
          description:
            "Je nach Führerscheinklasse und Ausstellungsstaat können weitere Unterlagen oder Prüfungen erforderlich sein.",
          required: false,
          condition:
            "Abhängig vom Ausstellungsstaat und der Führerscheinklasse.",
        },
      ],
    },
    {
      id: "contact-authority",
      title: "Zuständige Fahrerlaubnisbehörde kontaktieren",
      description:
        "Informiere dich bei der für deinen Wohnort zuständigen Fahrerlaubnisbehörde über den genauen Antragsweg.",
      documents: [],
    },
    {
      id: "submit-application",
      title: "Antrag auf Umschreibung stellen",
      description:
        "Reiche den Antrag persönlich bei der zuständigen Fahrerlaubnisbehörde ein.",
      documents: [],
    },
    {
      id: "receive-license",
      title: "Entscheidung abwarten und Führerschein erhalten",
      description:
        "Nach der Prüfung deines Antrags erhältst du eine Entscheidung und gegebenenfalls einen deutschen Führerschein.",
      documents: [],
    },
  ],

  sources: [
    {
      title: "Ausländischen Führerschein umschreiben – Bundesportal",
      url: "https://verwaltung.bund.de/leistungsverzeichnis/de/leistung/99108047050002",
      authority: "Bundesportal",
    },
    {
      title:
        "Gültigkeit ausländischer Fahrerlaubnisse – Bundesministerium für Verkehr",
      url: "https://www.bmv.de/SharedDocs/DE/Artikel/StV/Strassenverkehr/gueltigkeit-auslaendischer-fahrerlaubnisse-in-deutschland.html",
      authority: "Bundesministerium für Verkehr",
    },
  ],
};

export const hundAnmelden: Procedure = {
  id: "hund-anmelden",
  categoryId: "alltag",
  title: "Hund anmelden",
  description:
    "Melde deinen Hund bei der Stadt Mayen an und beachte die örtlichen Regelungen zur Hundehaltung.",

  region: "Mayen, Rheinland-Pfalz",

  deadline:
    "Melde deinen Hund innerhalb von 14 Tagen nach Beginn der Hundehaltung oder nach dem Zuzug nach Mayen an.",

  authority: {
    name: "Abgaben und Steuern – Stadtverwaltung Mayen",
    address: "Rathaus Rosengasse 2, 56727 Mayen",
    phone: "+49 2651 88-0",
    email: "info@mayen.de",
    website: "https://www.mayen.de/",
  },

  steps: [
    {
      id: "check-requirements",
      title: "Anmeldepflicht prüfen",
      description:
        "Informiere dich über die örtlichen Regeln zur Hundehaltung und zur Anmeldung deines Hundes.",
      documents: [],
    },
    {
      id: "prepare-documents",
      title: "Unterlagen vorbereiten",
      description:
        "Bereite die erforderlichen Angaben und Unterlagen für die Anmeldung vor.",
      documents: [
        {
          id: "identity-document",
          title: "Personalausweis oder Meldebestätigung",
          description:
            "Bei einer persönlichen Anmeldung benötigst du einen aktuellen Identitätsnachweis oder eine aktuelle Meldebestätigung.",
          required: true,
        },
        {
          id: "dog-information",
          title: "Angaben zum Hund",
          description:
            "Halte wichtige Angaben wie Rasse, Geburtsdatum, Herkunft und Anschaffungsdatum bereit.",
          required: true,
        },
        {
          id: "transponder-information",
          title: "Transpondernummer",
          description:
            "Für Hunde, die älter als drei Monate sind, kann eine Kennzeichnung durch einen Transponder erforderlich sein.",
          required: false,
          condition: "Abhängig vom Alter und den geltenden Vorschriften.",
        },
      ],
    },
    {
      id: "submit-registration",
      title: "Hund anmelden",
      description:
        "Melde deinen Hund online oder bei der zuständigen Stelle der Stadtverwaltung Mayen an.",
      documents: [],
    },
    {
      id: "receive-tax-information",
      title: "Steuerbescheid und Hundesteuermarke erhalten",
      description:
        "Nach der Anmeldung erhältst du Informationen zur Hundesteuer und gegebenenfalls eine Hundesteuermarke.",
      documents: [],
    },
  ],

  sources: [
    {
      title: "Hundehaltung anmelden – Stadt Mayen",
      url: "https://www.mayen.de/buergerservice/leistungen/RLP%3Aentry%3A258784/hundehaltung-anmelden/",
      authority: "Stadt Mayen",
    },
    {
      title: "Online-Dienstleistungen – Stadt Mayen",
      url: "https://www.mayen.de/rathaus-buergerservice/buergerservice/online-dienstleistungen/",
      authority: "Stadt Mayen",
    },
  ],
};
