import { S3Handler } from "aws-lambda";
import { S3 } from "aws-sdk";
import XLSX from "xlsx";
import { NConsistidoDataFlowForecast } from "../service/CNC - VazoesSemanais/NConsistidoDataFlowForecast";
import { MicrosoftTeam } from "../api/webhookTeams";

export const handler: S3Handler = async (event) => {
  const bucketName = event.Records[0].s3.bucket.name;
  const docType = event.Records[0].s3.object.key.split("/")[0];

  const s3 = new S3();

  const acessBucket = await s3
    .listObjectsV2({ Bucket: "bucket-docs-nodejs" })
    .promise();

  const listFilesBucket = acessBucket.Contents?.map((item) => item.Key).filter(
    (item) =>
      item.includes("Nao_Consistido") &&
      item?.includes("Relat�rio_de_Previs�o de Vaz�es") &&
      item?.endsWith(".xls")
  );

  const fileKey = listFilesBucket[0];

  const dataRead = await s3
    .getObject({ Bucket: bucketName, Key: fileKey })
    .promise();

  if (dataRead) {
    try {
      let wb;
      let wsMonth;
      let wsWeekPartOne;
      let wsWeekPartTwo;

      if (listFilesBucket[0].includes("REV")) {
        console.log("caiu no rev");

        wb = XLSX.read(dataRead.Body, { type: "buffer" });
        wsMonth = wb.Sheets["REV-2"];
        wsWeekPartOne = wb.Sheets["REV-5"];
        wsWeekPartTwo = wb.Sheets["REV-6"];

        const sudeste = {
          num_ssis: 1,
          val_week1: wsWeekPartOne.D175.v,
          val_week2: wsWeekPartOne.E175.v,
          val_week3: wsWeekPartOne.F175.v,
          val_week4: wsWeekPartOne.G175.v,
          val_week5: wsWeekPartOne.H175.v,
          val_week6: wsWeekPartOne.I175.v,
          val_month: wsMonth.G9.v,
          val_month_mlt: wsMonth.H9.v / 100,
          ind_consisted: 0,
        };

        const sul = {
          num_ssis: 2,
          val_week1: wsWeekPartTwo.D65.v,
          val_week2: wsWeekPartTwo.E65.v,
          val_week3: wsWeekPartTwo.F65.v,
          val_week4: wsWeekPartTwo.G65.v,
          val_week5: wsWeekPartTwo.H65.v,
          val_week6: wsWeekPartTwo.I65.v,
          val_month: wsMonth.G10.v,
          val_month_mlt: wsMonth.H10.v / 100,
          ind_consisted: 0,
        };

        const nordeste = {
          num_ssis: 3,
          val_week1: wsWeekPartTwo.D101.v,
          val_week2: wsWeekPartTwo.E101.v,
          val_week3: wsWeekPartTwo.F101.v,
          val_week4: wsWeekPartTwo.G101.v,
          val_week5: wsWeekPartTwo.H101.v,
          val_week6: wsWeekPartTwo.I101.v,
          val_month: wsMonth.G11.v,
          val_month_mlt: wsMonth.H11.v / 100,
          ind_consisted: 0,
        };

        const norte = {
          num_ssis: 4,
          val_week1: wsWeekPartTwo.D141.v,
          val_week2: wsWeekPartTwo.E141.v,
          val_week3: wsWeekPartTwo.F141.v,
          val_week4: wsWeekPartTwo.G141.v,
          val_week5: wsWeekPartTwo.H141.v,
          val_week6: wsWeekPartTwo.I141.v,
          val_month: wsMonth.H12.v,
          val_month_mlt: wsMonth.H12.v / 100,
          ind_consisted: 0,
        };

        await NConsistidoDataFlowForecast({
          docType,
          sudeste,
          sul,
          nordeste,
          norte,
        });
      } else {
        console.log("sem rev");
        wb = XLSX.read(dataRead.Body, { type: "buffer" });
        wsMonth = wb.Sheets["Tab-5-6-7"];
        wsWeekPartOne = wb.Sheets["Tab-12"];
        wsWeekPartTwo = wb.Sheets["Tab-13-14-15"];

        const sudeste = {
          num_ssis: 1,
          val_week1: wsWeekPartOne.D174.v,
          val_week2: wsWeekPartOne.E174.v,
          val_week3: wsWeekPartOne.F174.v,
          val_week4: wsWeekPartOne.G174.v,
          val_week5: wsWeekPartOne.H174.v,
          val_week6: wsWeekPartOne.I174.v,
          val_month: wsMonth.D8.v,
          val_month_mlt: wsMonth.E8.v / 100,
          ind_consisted: 0,
        };

        const sul = {
          num_ssis: 2,
          val_week1: wsWeekPartTwo.D64.v,
          val_week2: wsWeekPartTwo.E64.v,
          val_week3: wsWeekPartTwo.F64.v,
          val_week4: wsWeekPartTwo.G64.v,
          val_week5: wsWeekPartTwo.H64.v,
          val_week6: wsWeekPartTwo.I64.v,
          val_month: wsMonth.D9.v,
          val_month_mlt: wsMonth.E9.v / 100,
          ind_consisted: 0,
        };

        const nordeste = {
          num_ssis: 3,
          val_week1: wsWeekPartTwo.D99.v,
          val_week2: wsWeekPartTwo.E99.v,
          val_week3: wsWeekPartTwo.F99.v,
          val_week4: wsWeekPartTwo.G99.v,
          val_week5: wsWeekPartTwo.H99.v,
          val_week6: wsWeekPartTwo.I99.v,
          val_month: wsMonth.D10.v,
          val_month_mlt: wsMonth.E10.v / 100,
          ind_consisted: 0,
        };

        const norte = {
          num_ssis: 4,
          val_week1: wsWeekPartTwo.D137.v,
          val_week2: wsWeekPartTwo.E137.v,
          val_week3: wsWeekPartTwo.F137.v,
          val_week4: wsWeekPartTwo.G137.v,
          val_week5: wsWeekPartTwo.H137.v,
          val_week6: wsWeekPartTwo.I137.v,
          val_month: wsMonth.D11.v,
          val_month_mlt: wsMonth.E11.v / 100,
          ind_consisted: 0,
        };

        await NConsistidoDataFlowForecast({
          docType,
          sudeste,
          sul,
          nordeste,
          norte,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  await MicrosoftTeam({
    title: "Previsão de Vazões Atualizada - Não Consistido",
    message:
      "Dados semanais de Vazões atualizados, clique no link para acessar o relatório",
  });
};
