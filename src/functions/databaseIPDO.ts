import { S3Handler } from "aws-lambda";
import { S3 } from "aws-sdk";
import XLSX from "xlsx";
import { PrismaClient } from "@prisma/client";

export const handler: S3Handler = async (event) => {
  const bucketName = event.Records[0].s3.bucket.name;
  const fileKey = event.Records[0].s3.object.key;
  const docType = event.Records[0].s3.object.key.split("/")[0];

  const s3 = new S3();

  const dataRead = await s3
    .getObject({ Bucket: bucketName, Key: fileKey })
    .promise();

  if (dataRead) {
    try {
      const prisma = new PrismaClient();

      //criar uma checagem de tempo puxando da tabela que irá guardar os dados periodicidade
      const findLastDateDocType = await prisma.tbl_file_data.findFirst({
        where: {
          nom_file: docType,
        },
      });

      const result = await prisma.tbl_arm_ssis.findMany({
        take: 4,
        where: {
          dat_medicao: findLastDateDocType.dat_file_publi,
          cod_fonte: 3,
        },
      });


      // const t = await prisma.tbl_arm_ssis.upsert({
      //   where: {
      //     cod_fonte: 3,
      //   },
      // });

      // const test = await prisma.tbl_arm_ssis.upsert({
      //   where: {
      //     dat_medicao:
      //   }
      // })

      const wb = XLSX.read(dataRead.Body, { type: "buffer" });
      const ws = wb.Sheets.IPDO;
    } catch (error) {
      console.log(error);
    }
  }
};
