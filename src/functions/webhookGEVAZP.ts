import { APIGatewayProxyHandler } from "aws-lambda";
import { S3 } from "aws-sdk";
import dayjs from "dayjs";
import axios from "axios";
import unzipper from "unzipper";
import { takeName } from "../util/takeName";
import { PrismaClient } from "@prisma/client";

interface IWebhookProps {
  url: string;
  nome: string;
  periodicidade: string;
}

export const handler: APIGatewayProxyHandler = async (event) => {
  const { url, nome, periodicidade } = JSON.parse(event.body) as IWebhookProps;

  const date = dayjs(periodicidade).format("YYYYMM");

  const dataName = await takeName({ nome, date });

  const s3 = new S3();

  const acessBucket = await s3
    .listObjectsV2({ Bucket: "bucket-docs-nodejs" })
    .promise();

  const listFilesBucket = acessBucket.Contents?.map((item) => item.Key).filter(
    (item) =>
      item?.startsWith(`${dataName.name}/`) &&
      !item?.endsWith(`${dataName.name}/`)
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
      Key: `${dataName.name}/${dataName.nameFile}`,
    })
    .promise();

  const prisma = new PrismaClient();

  const findRegister = await prisma.tbl_file_data.findFirst({
    take: 1,
    where: {
      nom_file: dataName.name,
      dat_file_publi: new Date(periodicidade),
    },
  });

  if (!findRegister) {
    await prisma.tbl_file_data.create({
      data: {
        nom_file: dataName.name,
        dat_file_publi: new Date(periodicidade),
        dat_file_download: new Date(),
      },
    });
  } else {
    await prisma.tbl_file_data.update({
      where: {
        num_file: findRegister.num_file,
      },
      data: {
        dat_file_download: new Date(),
      },
    });
  }

  if (dataName.nameFile.includes(".zip")) {
    const zip = s3
      .getObject({
        Bucket: "bucket-docs-nodejs",
        Key: `${dataName.name}/${dataName.nameFile}`,
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
          Key: `${dataName.name}/${fileName}`,
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
