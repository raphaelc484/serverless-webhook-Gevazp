import { APIGatewayProxyHandler } from "aws-lambda";
import { S3 } from "aws-sdk";
import dayjs from "dayjs";
import axios from "axios";

interface IWebhookProps {
  url: string;
  nome: string;
  periodicidade: string;
}

export const handler: APIGatewayProxyHandler = async (event) => {
  const { url, nome, periodicidade } = JSON.parse(event.body) as IWebhookProps;

  const date = dayjs(periodicidade).format("YYYYMM");

  // const nameFile = `Gevazp_${date}.zip`;

  let nameFile = "";

  if (nome === "IPDO Editável") {
    nameFile = `IPDO_${date}.xlsm`;
  } else if (nome === "Carga por patamar - DECOMP") {
    nameFile = `Decomp_${date}.zip`;
  } else if (
    nome === "Resultados preliminares não consistidos  (vazões semanais - PMO)"
  ) {
    nameFile = `N_consistidos_${date}.zip`;
  } else if (
    nome === "Resultados preliminares consistidos (vazões semanais - PMO)"
  ) {
    nameFile = `Consistidos_${date}.zip`;
  } else if (nome === "Arquivos de Previsão de Carga para o DESSEM") {
    nameFile = `Dessem_${date}.zip`;
  } else if (nome === "Arquivos dos modelos de geração de cenários de vazões") {
    nameFile = `Gevazp_${date}.zip`;
  }

  const s3 = new S3();

  const acessBucket = await s3
    .listObjectsV2({ Bucket: "bucket-docs-nodejs" })
    .promise();

  const listFilesBucket = acessBucket.Contents?.map((item) => item.Key).filter(
    (item) => item?.includes(nameFile.split("_")[0])
  )[0];

  console.log(listFilesBucket);

  if (listFilesBucket) {
    await s3
      .deleteObject({
        Bucket: "bucket-docs-nodejs",
        Key: listFilesBucket,
      })
      .promise();
  }

  const response = await axios({
    url,
    method: "GET",
    responseType: "arraybuffer",
  });

  await s3
    .putObject({
      Body: response.data,
      Bucket: "bucket-docs-nodejs",
      Key: nameFile,
    })
    .promise();

  return {
    statusCode: 201,
    body: JSON.stringify("success"),
  };
};
