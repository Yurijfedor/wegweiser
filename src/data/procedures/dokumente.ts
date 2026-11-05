import type { Procedure } from "../../types/procedure";

export const meldebescheinigungBeantragen: Procedure = {
  id: "meldebescheinigung-beantragen",
  categoryId: "dokumente",
  title: "Meldebescheinigung beantragen",
  description:
    "Beantrage eine Meldebescheinigung als Nachweis deines Wohnsitzes.",

  region: "Mayen, Rheinland-Pfalz",

  authority: {
    name: "Einwohnermeldeamt, Pass- und Ausweiswesen – Stadt Mayen",
    address: "Rosengasse 2, 56727 Mayen",
    phone: "+49 2651 88-0",
    email: "info@mayen.de",
    website: "https://www.mayen.de/",
  },

  steps: [
    {
      id: "documents",
      title: "Unterlagen vorbereiten",
      description:
        "Bereite die erforderlichen Unterlagen für deinen Antrag vor.",
      documents: [
        {
          id: "identity-document",
          title: "Personalausweis oder Reisepass",
          description: "Du benötigst einen gültigen Identitätsnachweis.",
          required: true,
        },
        {
          id: "authorization",
          title: "Schriftliche Vollmacht",
          description:
            "Eine Vollmacht ist erforderlich, wenn eine andere Person die Bescheinigung für dich beantragt.",
          required: false,
          condition: "Bei Antrag durch eine bevollmächtigte Person.",
        },
      ],
    },
    {
      id: "submit-application",
      title: "Meldebescheinigung beantragen",
      description:
        "Beantrage die Meldebescheinigung online oder bei der zuständigen Meldebehörde der Stadt Mayen.",
      documents: [],
    },
    {
      id: "receive-certificate",
      title: "Meldebescheinigung erhalten",
      description: "Nach der Bearbeitung erhältst du deine Meldebescheinigung.",
      documents: [],
    },
  ],

  sources: [
    {
      title: "Meldebescheinigung beantragen – Stadt Mayen",
      url: "https://www.mayen.de/buergerservice/leistungen/RLP%3Aentry%3A67798%3AANLR-VLR/meldebescheinigung-beantragen/",
      authority: "Stadt Mayen",
    },
    {
      title: "Online-Dienstleistungen – Stadt Mayen",
      url: "https://www.mayen.de/rathaus-buergerservice/buergerservice/online-dienstleistungen/",
      authority: "Stadt Mayen",
    },
  ],
};

export const aufenthaltstitelBeantragen: Procedure = {
  id: "aufenthaltstitel-beantragen",
  categoryId: "dokumente",
  title: "Aufenthaltstitel beantragen",
  description:
    "Beantrage einen Aufenthaltstitel und bereite die erforderlichen Unterlagen für deine persönliche Situation vor.",

  region: "Deutschland",

  deadline:
    "Beantrage oder verlängere deinen Aufenthaltstitel rechtzeitig vor Ablauf deines aktuellen Aufenthaltstitels.",

  steps: [
    {
      id: "check-requirements",
      title: "Voraussetzungen prüfen",
      description:
        "Prüfe, welcher Aufenthaltstitel zu deinem Aufenthaltszweck und deiner persönlichen Situation passt.",
      documents: [],
    },
    {
      id: "prepare-documents",
      title: "Unterlagen vorbereiten",
      description:
        "Bereite die für deinen Antrag erforderlichen Unterlagen vor. Die genauen Anforderungen können je nach Aufenthaltstitel unterschiedlich sein.",
      documents: [
        {
          id: "valid-passport",
          title: "Gültiger Reisepass",
          description:
            "Du benötigst in der Regel einen gültigen Reisepass oder ein anerkanntes Passersatzdokument.",
          required: true,
        },
        {
          id: "biometric-photo",
          title: "Biometrisches Passfoto",
          description:
            "Für die Ausstellung eines elektronischen Aufenthaltstitels kann ein aktuelles biometrisches Foto erforderlich sein.",
          required: true,
        },
        {
          id: "proof-of-purpose",
          title: "Nachweis über den Aufenthaltszweck",
          description:
            "Die erforderlichen Nachweise richten sich nach dem Grund deines Aufenthalts, zum Beispiel Arbeit, Ausbildung oder Familie.",
          required: true,
          condition: "Je nach Art des beantragten Aufenthaltstitels.",
        },
        {
          id: "additional-documents",
          title: "Weitere Nachweise",
          description:
            "Die zuständige Ausländerbehörde kann zusätzliche Unterlagen anfordern.",
          required: false,
          condition: "Abhängig von deiner persönlichen Situation.",
        },
      ],
    },
    {
      id: "contact-authority",
      title: "Termin bei der Ausländerbehörde vereinbaren",
      description:
        "Wende dich an die für deinen Wohnort zuständige Ausländerbehörde und informiere dich über den Antragsweg.",
      documents: [],
    },
    {
      id: "submit-application",
      title: "Antrag einreichen",
      description:
        "Reiche deinen Antrag und die erforderlichen Unterlagen bei der zuständigen Ausländerbehörde ein.",
      documents: [],
    },
    {
      id: "receive-residence-permit",
      title: "Entscheidung und Aufenthaltstitel erhalten",
      description:
        "Nach der Bearbeitung erhältst du eine Entscheidung über deinen Antrag und gegebenenfalls deinen Aufenthaltstitel.",
      documents: [],
    },
  ],

  sources: [
    {
      title: "Aufenthaltstitel – Bundesamt für Migration und Flüchtlinge",
      url: "https://www.bamf.de/",
      authority: "Bundesamt für Migration und Flüchtlinge",
    },
    {
      title: "Aufenthaltstitel – Make it in Germany",
      url: "https://www.make-it-in-germany.com/",
      authority: "Make it in Germany",
    },
  ],
};
