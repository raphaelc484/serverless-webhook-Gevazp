import { S3Handler } from "aws-lambda";
import { S3 } from "aws-sdk";
import XLSX from "xlsx";

export const handler: S3Handler = async (event) => {
  const bucketName = event.Records[0].s3.bucket.name;
  const fileKey = event.Records[0].s3.object.key;

  const s3 = new S3();

  const dataRead = await s3
    .getObject({ Bucket: bucketName, Key: fileKey }, (err, data) => {
      if (err) err;
      else data;
    })
    .promise();

  const wb = XLSX.read(dataRead.Body, { type: "buffer" });
  // const ws = wb.Sheets.IPDO;

  console.log(wb);

  // if (dataRead) {
  //   const wb = XLSX.readFile(dataRead.Body);
  //   const ws = wb.Sheets.IPDO;
  // }
};
