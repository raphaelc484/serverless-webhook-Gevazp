import { APIGatewayProxyHandler } from "aws-lambda";
import { S3 } from "aws-sdk";
import dayjs from "dayjs";
import { join, resolve } from "path";
import fs, { readFileSync } from "fs";
import axios from "axios";

interface IWebhookProps {
  url: string;
  nome: string;
  periodicidade: string;
}

export const handler: APIGatewayProxyHandler = async (event) => {
  const { url, nome, periodicidade } = JSON.parse(event.body) as IWebhookProps;

  const date = dayjs(periodicidade).format("YYYYMM");

  const nameFile = `Gevazp_${date}.zip`;

  const pathTmp = join(process.cwd(), "tmp", nameFile);
  const writer = fs.createWriteStream(pathTmp);

  const response = await axios({
    url,
    method: "GET",
    responseType: "stream",
  });

  await response.data.pipe(writer);

  const s3 = new S3();

  await s3
    .putObject({
      Bucket: "nome do bucket",
      Key: nameFile,
      Body: pathTmp,
    })
    .promise();

  return {
    statusCode: 201,
    body: JSON.stringify("success"),
  };
};
