import { S3Handler } from "aws-lambda";
import { S3 } from "aws-sdk";
import { DessemData } from "../service/Dessem/DessemData";
import { MicrosoftTeam } from "../api/webhookTeams";

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
      const read = dataRead.Body.toString("utf-8").split("\n");

      const lines = read.filter((line) => line.includes("DP"));
      const lineValues = [];
      let lineSplit;
      for (let i = 0; i < lines.length; i += 1) {
        lineSplit = lines[i].split(" ").filter((l) => l !== " " && l !== "");
        if (lineSplit[2] === "11") {
          lineValues.push({
            ss: lineSplit[1],
            di: lineSplit[2],
            h1: lineSplit[3],
            m: lineSplit[4],
            carga: lineSplit[6],
          });
        } else {
          lineValues.push({
            ss: lineSplit[1],
            di: lineSplit[2],
            h1: lineSplit[3],
            m: lineSplit[4],
            carga: lineSplit[6],
          });
        }
      }

      await DessemData({ docType, dataTXT: lineValues });

      await MicrosoftTeam({
        title: "Previsão do Dessem",
        message:
          "Dados diários do Dessem, clique no link para acessar o relatório",
      });
    } catch (error) {
      console.log(error);
    }
  }
};
