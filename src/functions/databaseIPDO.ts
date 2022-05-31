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

      const findLastDateDocType = await prisma.tbl_file_data.findFirst({
        where: {
          nom_file: docType,
        },
      });

      const findLastDataInSystem = await prisma.tbl_arm_ssis.findMany({
        take: 4,
        where: {
          dat_medicao: findLastDateDocType.dat_file_publi,
          cod_fonte: 3,
        },
      });

      const wb = XLSX.read(dataRead.Body, { type: "buffer" });
      const ws = wb.Sheets.IPDO;

      await prisma.tbl_arm_ssis.upsert({
        where: {
          id: findLastDataInSystem[0].id,
        },
        create: {
          cod_fonte: 3,
          num_ssis: 1,
          dat_medicao: findLastDateDocType.dat_file_publi,
          val_arm_p: ws.R65.v,
        },
        update: {
          num_ssis: 1,
          val_arm_p: ws.R65.v,
        },
      });

      await prisma.tbl_arm_ssis.upsert({
        where: {
          id: findLastDataInSystem[1].id,
        },
        create: {
          cod_fonte: 3,
          num_ssis: 2,
          dat_medicao: findLastDateDocType.dat_file_publi,
          val_arm_p: ws.R64.v,
        },
        update: {
          num_ssis: 2,
          val_arm_p: ws.R64.v,
        },
      });

      await prisma.tbl_arm_ssis.upsert({
        where: {
          id: findLastDataInSystem[2].id,
        },
        create: {
          cod_fonte: 3,
          num_ssis: 3,
          dat_medicao: findLastDateDocType.dat_file_publi,
          val_arm_p: ws.R63.v,
        },
        update: {
          num_ssis: 3,
          val_arm_p: ws.R63.v,
        },
      });

      await prisma.tbl_arm_ssis.upsert({
        where: {
          id: findLastDataInSystem[3].id,
        },
        create: {
          cod_fonte: 3,
          num_ssis: 4,
          dat_medicao: findLastDateDocType.dat_file_publi,
          val_arm_p: ws.R62.v,
        },
        update: {
          num_ssis: 4,
          val_arm_p: ws.R62.v,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }
};
