import axios from "axios";

interface TProps {
  url: string;
  nome: string;
  periodicidade: string;
}

const apiTest = axios.create({
  baseURL: "http://18.228.169.76",
});

export class TestWebhookResponse {
  public async execute({ url, nome, periodicidade }: TProps) {
    const res = await apiTest.post("/test/webhook", {
      url,
      nome,
      periodicidade,
    });

    return res;
  }
}
