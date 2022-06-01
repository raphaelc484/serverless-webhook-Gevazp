import { S3Handler } from "aws-lambda";
import { S3 } from "aws-sdk";
import XLSX from "xlsx";
import { IPDOArmSis } from "../service/IPDO/IPDOArmSis";
import { IPDOEnaData } from "../service/IPDO/IPDOEnaData";
import { IPDOLoadData } from "../service/IPDO/IPDOLoadData";
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
      const wb = XLSX.read(dataRead.Body, { type: "buffer" });
      const ws = wb.Sheets.IPDO;

      await IPDOArmSis({
        docType,
        valorSudeste: ws.R65.v,
        valorSul: ws.R64.v,
        valorNordeste: ws.R63.v,
        valorNorte: ws.R62.v,
      });

      await IPDOEnaData({
        docType,
        valorSudeste: ws.M65.v,
        valorSul: ws.M64.v,
        valorNordeste: ws.M63.v,
        valorNorte: ws.M62.v,
      });

      await IPDOLoadData({
        docType,
        valorPredSudeste: ws.M40.v,
        valorVerifSudeste: ws.O40.v,
        valorPredSul: ws.M48.v,
        valorVerifSul: ws.O48.v,
        valorPredNordeste: ws.M32.v,
        valorVerifNordeste: ws.O32.v,
        valorPredNorte: ws.M24.v,
        valorVerifNorte: ws.O24.v,
      });

      await MicrosoftTeam({
        title: "Dados IPDO Atualizados",
        message:
          "Dados do IPDO atualizados, clique no link para acessar o relatório",
      });
    } catch (error) {
      console.log(error);
    }
  }
};
