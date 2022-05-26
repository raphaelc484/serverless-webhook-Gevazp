import { S3Handler } from "aws-lambda";
import { S3 } from "aws-sdk";
import XLSX from "xlsx";
import { PrismaClient } from "@prisma/client";

export const handler: S3Handler = async (event) => {
  const bucketName = event.Records[0].s3.bucket.name;
  const fileKey = event.Records[0].s3.object.key;

  const s3 = new S3();

  const dataRead = await s3
    .getObject({ Bucket: bucketName, Key: fileKey })
    .promise();

  if (dataRead) {
    try {
      const prisma = new PrismaClient();

      const result = await prisma.tbl_arm_ssis.findMany({
        take: 4,
        where: {
          cod_fonte: 3,
        },
        orderBy: {
          dat_medicao: "desc",
        },
      });

      console.log(result);

      const wb = XLSX.read(dataRead.Body, { type: "buffer" });
      const ws = wb.Sheets.IPDO;

      console.log("lendo excel: ", ws.R65.v);
    } catch (error) {
      console.log(error);
    }
  }
};
