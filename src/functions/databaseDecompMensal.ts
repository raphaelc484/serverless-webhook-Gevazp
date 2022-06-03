import { S3Handler } from "aws-lambda";
import { S3 } from "aws-sdk";
import { set } from "date-fns";
import { DecompDataLoadMonthly } from "../service/Decomp/DecompDataLoadMonthly";
import { MicrosoftTeam } from "../api/webhookTeams";

import XLSX from "xlsx";

export const handler: S3Handler = async (event) => {
  const bucketName = event.Records[0].s3.bucket.name;
  const docType = event.Records[0].s3.object.key.split("/")[0];

  const s3 = new S3();

  const acessBucket = await s3
    .listObjectsV2({ Bucket: "bucket-docs-nodejs" })
    .promise();

  const listFilesBucket = acessBucket.Contents?.map((item) => item.Key).filter(
    (item) => item?.includes("Carga_PMO") && item?.endsWith(".xlsx")
  );

  const fileKey = listFilesBucket[0];

  const dataRead = await s3
    .getObject({ Bucket: bucketName, Key: fileKey })
    .promise();

  if (dataRead) {
    try {
      const wb = XLSX.read(dataRead.Body, { type: "buffer" });
      const ws = wb.Sheets["Relatório SCPC"];
      const ceduleWithTime: string = ws.K3.v;

      const ceduleWithTimeSplit = ceduleWithTime.split("de ");
      const ceduleWithTimeSplitMonthAndYear = ceduleWithTimeSplit[1].split("/");
      const monthOfYear = [
        { month: "Janeiro", n: 0 },
        { month: "Fevereiro", n: 1 },
        { month: "Março", n: 2 },
        { month: "Abril", n: 3 },
        { month: "Maio", n: 4 },
        { month: "Junho", n: 5 },
        { month: "Julho", n: 6 },
        { month: "Agosto", n: 7 },
        { month: "Setembro", n: 8 },
        { month: "Outubro", n: 9 },
        { month: "Novembro", n: 10 },
        { month: "Dezembro", n: 11 },
      ];
      const ceduleWithTimeSplitMonth = monthOfYear.filter(
        (k) => k.month === ceduleWithTimeSplitMonthAndYear[0]
      );

      const dateSet = set(new Date(), {
        date: 1,
        month: ceduleWithTimeSplitMonth[0].n,
        year: parseFloat(ceduleWithTimeSplitMonthAndYear[1]),
        hours: 0,
        milliseconds: 0,
        minutes: 0,
        seconds: 0,
      });

      await DecompDataLoadMonthly({
        docType,
        dateSet,
        valorSudeste: ws.G16.v,
        valorSul: ws.G17.v,
        valorNordeste: ws.G14.v,
        valorNorte: ws.G15.v,
      });

      await MicrosoftTeam({
        title: "Previsão de Carga Atualizada",
        message:
          "Dados semanais de Carga atualizados, clique no link para acessar o relatório",
      });
    } catch (error) {
      console.log(error);
    }
  }
};
