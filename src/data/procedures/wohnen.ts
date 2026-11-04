import type { Procedure } from "../../types/procedure";

export const wohnsitzAnmelden: Procedure = {
  id: "wohnsitz-anmelden",
  categoryId: "wohnen",
  title: "Wohnsitz anmelden",
  description: "Melde deine neue Wohnung bei der zuständigen Meldebehörde an.",

  region: "Mayen, Rheinland-Pfalz",

  deadline: "Innerhalb von zwei Wochen nach dem Einzug.",

  authority: {
    name: "Einwohnermeldeamt – Stadtverwaltung Mayen",
    address: "Rathaus Rosengasse 2, 56727 Mayen",
    phone: "+49 2651 88-0",
    email: "info@mayen.de",
    website: "https://www.mayen.de/",
  },

  steps: [
    {
      id: "documents",
      title: "Unterlagen vorbereiten",
      description:
        "Bereite die erforderlichen Dokumente für deine Anmeldung vor.",
      documents: [
        {
          id: "identity",
          title: "Personalausweis oder Reisepass",
          description:
            "Ein gültiges Identitätsdokument für jede anzumeldende Person.",
          required: true,
        },
        {
          id: "wohnungsgeber",
          title: "Wohnungsgeberbestätigung",
          description:
            "Eine vom Wohnungsgeber unterschriebene Bestätigung über den Einzug.",
          required: true,
          condition: "Bei einer Mietwohnung.",
        },
        {
          id: "ownership",
          title: "Kaufvertrag oder Grundbuchauszug",
          description: "Nachweis über das Wohneigentum.",
          required: true,
          condition: "Bei einer Eigentumswohnung.",
        },
        {
          id: "previous-address",
          title: "Letzte Wohnanschrift in Deutschland",
          description:
            "Angaben zur letzten deutschen Adresse und zum Ein- und Auszugsdatum.",
          required: true,
          condition:
            "Bei Zuzug aus dem Ausland, sofern zuvor eine Adresse in Deutschland bestand.",
        },
        {
          id: "family-documents",
          title: "Geburts- oder Heiratsurkunde",
          description:
            "Zusätzliche Nachweise können von der Meldebehörde verlangt werden.",
          required: false,
        },
      ],
    },
    {
      id: "registration",
      title: "Wohnsitz anmelden",
      description:
        "Melde deine neue Wohnung innerhalb der gesetzlichen Frist bei der Stadt Mayen an. Nutze den persönlichen oder verfügbaren digitalen Anmeldeweg.",
      documents: [],
    },
    {
      id: "confirmation",
      title: "Meldebestätigung erhalten",
      description:
        "Nach erfolgreicher Anmeldung erhältst du eine amtliche Meldebestätigung.",
      documents: [],
    },
  ],

  sources: [
    {
      title: "Wohnsitz anmelden – Stadt Mayen",
      url: "https://www.mayen.de/buergerservice/leistungen/RLP%3Aentry%3A67984%3AANLR-VLR/wohnsitz-anmelden/",
      authority: "Stadt Mayen",
    },
    {
      title: "Wohnungsgeberbestätigung – Stadt Mayen",
      url: "https://www.mayen.de/buergerservice/leistungen/RLP%3Aentry%3A101419%3AANLR-VLR/wohnungsgeberbestaetigung/",
      authority: "Stadt Mayen",
    },
    {
      title: "Online-Dienstleistungen – Stadt Mayen",
      url: "https://www.mayen.de/rathaus-buergerservice/buergerservice/online-dienstleistungen/",
      authority: "Stadt Mayen",
    },
  ],
};

export const wohnungKuendigen: Procedure = {
  id: "wohnung-kuendigen",
  categoryId: "wohnen",
  title: "Wohnung kündigen",
  description:
    "Kündige deinen Mietvertrag rechtzeitig und bereite deinen Auszug vor.",

  region: "Deutschland",

  deadline: "Prüfe die Kündigungsfrist in deinem Mietvertrag.",

  steps: [
    {
      id: "contract",
      title: "Mietvertrag prüfen",
      description:
        "Prüfe die Kündigungsfrist und mögliche besondere Regelungen in deinem Mietvertrag.",
      documents: [
        {
          id: "rental-contract",
          title: "Mietvertrag",
          description:
            "Prüfe die vereinbarte Kündigungsfrist und die Bedingungen für die Kündigung.",
          required: true,
        },
      ],
    },
    {
      id: "termination-letter",
      title: "Kündigung vorbereiten",
      description:
        "Erstelle ein schriftliches Kündigungsschreiben für deinen Vermieter.",
      documents: [
        {
          id: "termination-letter-document",
          title: "Kündigungsschreiben",
          description:
            "Das Schreiben sollte eindeutig erklären, dass du den Mietvertrag kündigen möchtest.",
          required: true,
        },
      ],
    },
    {
      id: "send-termination",
      title: "Kündigung versenden",
      description:
        "Sende die Kündigung rechtzeitig an deinen Vermieter und bewahre einen Nachweis über die Zustellung auf.",
      documents: [
        {
          id: "delivery-proof",
          title: "Zustellnachweis",
          description:
            "Bewahre einen Nachweis auf, dass deine Kündigung den Vermieter erreicht hat.",
          required: false,
        },
      ],
    },
    {
      id: "handover",
      title: "Wohnung übergeben",
      description:
        "Vereinbare einen Termin zur Wohnungsübergabe und dokumentiere den Zustand der Wohnung.",
      documents: [
        {
          id: "handover-protocol",
          title: "Übergabeprotokoll",
          description:
            "Halte den Zustand der Wohnung und die Zählerstände bei der Übergabe fest.",
          required: false,
        },
      ],
    },
  ],
};
