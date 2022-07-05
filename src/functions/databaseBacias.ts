import { S3Handler } from "aws-lambda";
import { S3 } from "aws-sdk";
import { BaciasDataPrecipitation } from "../service/Bacias/BaciasDataPrecipitation";

export const handler: S3Handler = async (event) => {
  const bucketName = event.Records[0].s3.bucket.name;
  const docType = event.Records[0].s3.object.key.split("/")[0];

  const s3 = new S3();

  const acessBucket = await s3.listObjectsV2({ Bucket: bucketName }).promise();

  const listFilesBucket = acessBucket.Contents?.map((item) => item.Key).filter(
    (item) => item.includes(docType) && item?.endsWith(".csv")
  );

  const fileKey = listFilesBucket[0];

  const dataRead = await s3
    .getObject({ Bucket: bucketName, Key: fileKey })
    .promise();

  const readData = dataRead.Body.toString("utf-8")
    .split("\n")
    .map((line) => line.split(","));

  const dataList = [];

  readData.map(async (line) => {
    const [dat_forecast, dat_running, num_prec_model, val_prec, nom_bacia] =
      line;

    if (
      dat_forecast !== undefined &&
      dat_running !== undefined &&
      num_prec_model !== undefined &&
      val_prec !== undefined &&
      nom_bacia !== undefined
    ) {
      dataList.push({
        dat_forecast,
        dat_running,
        num_prec_model,
        val_prec,
        nom_bacia,
      });
    }
  });

  await Promise.all(dataList);

  await BaciasDataPrecipitation({ docType, dataList });
};
