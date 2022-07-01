import { S3Handler } from "aws-lambda";
import { S3 } from "aws-sdk";
import csvParser from "csv-parse";
import fs from "fs";

interface IFileCSV {
  dat_running: Date;
  dat_forecast: Date;
  num_prec_model: number;
  nom_bacia: string;
  val_prec: number;
}

// async function loadCSV(Body: any): Promise<IFileCSV[]> {
//   return new Promise((resolve, reject) => {
//     const dataFromCSV: IFileCSV[] = [];

//     const stream =fs.read

//     const parseFile = csvParse({
//       delimiter: ",",
//     });
//     stream.pipe(parseFile);

//     parseFile
//       .on("data", async (line) => {
//         const [dat_forecast, dat_running, num_prec_model, val_prec, nom_bacia] =
//           line;

//         dataFromCSV.push({
//           dat_forecast,
//           dat_running,
//           num_prec_model,
//           val_prec,
//           nom_bacia,
//         });
//       })
//       .on("end", async () => {
//         await fs.promises.unlink(csvFile);
//         resolve(dataFromCSV);
//       })
//       .on("error", (err) => {
//         reject(err);
//       });
//   });
// }

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

  // const readData = dataRead.Body.toString("utf-8").split("\n");

  const readData = fs.createReadStream(dataRead.Body.toString("utf-8"));

  const parseFile = csvParser({
    delimiter: ",",
  });

  readData.pipe(parseFile);

  const dataFromCSV: IFileCSV[] = [];

  parseFile.on("data", async (line) => {
    const [dat_forecast, dat_running, num_prec_model, val_prec, nom_bacia] =
      line;

    dataFromCSV.push({
      dat_forecast,
      dat_running,
      num_prec_model,
      val_prec,
      nom_bacia,
    });

    console.log(dataFromCSV);
  });

  // const [dat_forecast, dat_running, num_prec_model, val_prec, nom_bacia] = line;
};
