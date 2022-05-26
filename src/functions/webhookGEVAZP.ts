import { APIGatewayProxyHandler } from "aws-lambda";
import { S3 } from "aws-sdk";
import dayjs from "dayjs";
import axios from "axios";
import unzipper from "unzipper";
import { document } from "../utils/dynamodbClient";

interface IWebhookProps {
  url: string;
  nome: string;
  periodicidade: string;
}

export const handler: APIGatewayProxyHandler = async (event) => {
  const { url, nome, periodicidade } = JSON.parse(event.body) as IWebhookProps;

  // await document
  //   .put({
  //     TableName: "received_tables",
  //     Item: {
  //       id: "218c244f-9b24-4063-af89-1b93020d219a",
  //       nome: nome,
  //       periodicidade: periodicidade,
  //       url: url,
  //     },
  //   })
  //   .promise();

  // const response = await document
  //   .query({
  //     TableName: "received_table",
  //     KeyConditionExpression: "nome = :nome and periodicidade = :periodicidade",
  //     ExpressionAttributeValues: {
  //       ":nome": nome,
  //       ":periodicidade": periodicidade,
  //     },
  //   })
  //   .promise();

  // console.log(response);

  const date = dayjs(periodicidade).format("YYYYMM");

  let nameFile = "";
  let name = "";

  if (nome === "IPDO Editável") {
    name = "IPDO";
    nameFile = `${name}_${date}.xlsm`;
  } else if (nome === "Carga por patamar - DECOMP") {
    name = "Decomp";
    nameFile = `${name}_${date}.zip`;
  } else if (
    nome === "Resultados preliminares não consistidos  (vazões semanais - PMO)"
  ) {
    name = "N_consistidos";
    nameFile = `${name}_${date}.zip`;
  } else if (
    nome === "Resultados preliminares consistidos (vazões semanais - PMO)"
  ) {
    name = "Consistidos";
    nameFile = `${name}_${date}.zip`;
  } else if (nome === "Arquivos de Previsão de Carga para o DESSEM") {
    name = "Dessem";
    nameFile = `${name}_${date}.zip`;
  } else if (nome === "Arquivos dos modelos de geração de cenários de vazões") {
    name = "Gevazp";
    nameFile = `${name}_${date}.zip`;
  } else if (nome === "Acomph") {
    name = "Acomph";
    nameFile = `${name}_${date}.xls`;
  } else if (nome === "RDH") {
    name = "RDH";
    nameFile = `${name}_${date}.xlsx`;
  }

  const s3 = new S3();

  const acessBucket = await s3
    .listObjectsV2({ Bucket: "bucket-docs-nodejs" })
    .promise();

  const listFilesBucket = acessBucket.Contents?.map((item) => item.Key).filter(
    (item) => item?.startsWith(`${name}/`) && !item?.endsWith(`${name}/`)
  );

  const listTest = [];

  for (let i = 0; i < listFilesBucket.length; i += 1) {
    listTest.push({
      Key: listFilesBucket[i],
    });
  }

  await Promise.all(listTest);

  if (listFilesBucket.length > 0) {
    await s3
      .deleteObjects({
        Bucket: "bucket-docs-nodejs",
        Delete: {
          Objects: listTest,
        },
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
      Key: `${name}/${nameFile}`,
    })
    .promise();

  if (nameFile.includes(".zip")) {
    const zip = s3
      .getObject({
        Bucket: "bucket-docs-nodejs",
        Key: `${name}/${nameFile}`,
      })
      .createReadStream()
      .pipe(unzipper.Parse({ forceStream: true }));

    const promises = [];

    for await (const e of zip) {
      const entry = e;

      const fileName = entry.path;
      const type = entry.type;
      if (type === "File") {
        const uploadParams = {
          Bucket: "bucket-docs-nodejs",
          Key: `${name}/${fileName}`,
          Body: entry,
        };

        promises.push(s3.upload(uploadParams).promise());
      } else {
        entry.autodrain();
      }
    }

    await Promise.all(promises);
  }

  return {
    statusCode: 201,
    body: JSON.stringify("success"),
  };
};
