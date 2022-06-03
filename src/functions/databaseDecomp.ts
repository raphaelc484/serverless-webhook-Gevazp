import { S3Handler } from "aws-lambda";
import { S3 } from "aws-sdk";
import { DecompDataLoadWeekly } from "../service/Decomp/DecompDataLoadWeekly";
import { MicrosoftTeam } from "../api/webhookTeams";

export const handler: S3Handler = async (event) => {
  const bucketName = event.Records[0].s3.bucket.name;
  const docType = event.Records[0].s3.object.key.split("/")[0];

  const s3 = new S3();

  const acessBucket = await s3
    .listObjectsV2({ Bucket: "bucket-docs-nodejs" })
    .promise();

  const listFilesBucket = acessBucket.Contents?.map((item) => item.Key).filter(
    (item) => item?.includes("CargaDecomp_PMO") && item?.endsWith(".txt")
  );

  const fileKey = listFilesBucket[0];

  const dataRead = await s3
    .getObject({ Bucket: bucketName, Key: fileKey })
    .promise();

  if (dataRead) {
    try {
      const read = dataRead.Body.toString("utf-8").split("\n");
      const lines = read.filter((line) => line.includes("DP"));
      const lineValues = [];
      const mathResults = [];
      let lineSplit;
      for (let i = 0; i < lines.length; i += 1) {
        lineSplit = lines[i].split(" ").filter((l) => l !== " " && l !== "");
        if (lineSplit[2] === "11") {
          lineValues.push({
            ip: lineSplit[1],
            s: lineSplit[2],
            pat: lineSplit[3],
            MWmed1: "0",
            Pat_1: lineSplit[4],
            MWmed2: "0",
            Pat_2: lineSplit[5],
            MWmed3: "0",
            Pat_3: lineSplit[6],
          });
        } else {
          lineValues.push({
            ip: lineSplit[1],
            s: lineSplit[2],
            pat: lineSplit[3],
            MWmed1: lineSplit[4],
            Pat_1: lineSplit[5],
            MWmed2: lineSplit[6],
            Pat_2: lineSplit[7],
            MWmed3: lineSplit[8],
            Pat_3: lineSplit[9],
          });
        }

        // 1
        const formattedMWmed1 = parseFloat(lineValues[i].MWmed1);
        const formattedPat1 = parseFloat(
          lineValues[i].Pat_1.split("\r").filter((r) => r !== "")[0]
        );
        // 2
        const formattedMWmed2 = parseFloat(lineValues[i].MWmed2);
        const formattedPat2 = parseFloat(
          lineValues[i].Pat_2.split("\r").filter((r) => r !== "")[0]
        );
        // 3
        const formattedMWmed3 = parseFloat(lineValues[i].MWmed3);
        const formattedPat3 = parseFloat(
          lineValues[i].Pat_3.split("\r").filter((r) => r !== "")[0]
        );

        const MwPt1 = formattedMWmed1 * formattedPat1;
        const MwPt2 = formattedMWmed2 * formattedPat2;
        const MwPt3 = formattedMWmed3 * formattedPat3;
        const sumPat = formattedPat1 + formattedPat2 + formattedPat3;
        const soma = (MwPt1 + MwPt2 + MwPt3) / sumPat;
        mathResults.push({
          ip: lineValues[i].ip,
          s: lineValues[i].s,
          resultado: Math.round(soma),
        });
      }

      await DecompDataLoadWeekly({ docType, dataTXT: mathResults });

      // await MicrosoftTeam({
      //   title: "Previsão de Carga Atualizada",
      //   message:
      //     "Dados semanais de Carga atualizados, clique no link para acessar o relatório",
      // });
    } catch (error) {
      console.log(error);
    }
  }
};
