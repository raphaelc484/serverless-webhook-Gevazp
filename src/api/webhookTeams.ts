import axios from "axios";

const webhookTeams = axios.create({
  baseURL: "https://idealenergias.webhook.office.com",
  headers: {
    Accept: "application/json",
  },
});

interface Msg {
  title: string;
  message: string;
  url: string;
}

export async function MicrosoftTeam({ title, message, url }: Msg) {
  await webhookTeams.post(process.env.WEBHOOK_MICROSOFT_TEAMS, {
    "@type": "MessageCard",
    summary: title,
    title,
    text: message,
    potentialAction: [
      {
        "@type": "OpenUri",
        name: "Abrir Acompanhamento InfoMiddle",
        targets: [
          {
            os: "default",
            uri: url,
          },
        ],
      },
    ],
  });
}
