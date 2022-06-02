import { S3Handler } from "aws-lambda";
import { S3 } from "aws-sdk";
import fs from "fs";
import { set } from "date-fns";
import { MicrosoftTeam } from "../api/webhookTeams";
import { PrismaClient } from "@prisma/client";

function ale(day: string, hour: string, min: string) {
  let formatDate = new Date();

  if (day !== undefined) {
    if (min === "0") {
      formatDate = set(new Date(), {
        date: parseFloat(day),
        hours: parseFloat(hour),
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
      });
    } else if (min === "1") {
      formatDate = set(new Date(), {
        date: parseFloat(day),
        hours: parseFloat(hour),
        minutes: 30,
        seconds: 0,
        milliseconds: 0,
      });
    }
  } else {
    formatDate = set(new Date(), {
      date: 12 + 1,
      hours: 0,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
    });
  }

  return formatDate;
}

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
      const arquivo = dataRead.Body.toString("utf-8");
      const testeLeitura = fs.readFileSync(arquivo, "utf-8").split("\n");
      console.log(testeLeitura);

      //     const prisma = new PrismaClient();

      //     const findLastDateDocType = await prisma.tbl_file_data.findFirst({
      //       where: {
      //         nom_file: docType,
      //       },
      //       orderBy: { num_file: "desc" },
      //     });

      //     const findLastDataInSystem = await prisma.tbl_load_daily.findMany({
      //       where: {
      //         dat_running: findLastDateDocType.dat_file_publi,
      //       },
      //     });

      //     const read = fs
      //       .readFileSync(dataRead.Body.toString("utf-8"), "utf-8")
      //       .split("\n");

      //     const lines = read.filter((line) => line.includes("DP"));

      //     const lineValues = [];
      //     let lineSplit;

      //     for (let i = 0; i < lines.length; i += 1) {
      //       lineSplit = lines[i].split(" ").filter((l) => l !== " " && l !== "");
      //       if (lineSplit[2] === "11") {
      //         lineValues.push({
      //           ss: lineSplit[1],
      //           di: lineSplit[2],
      //           h1: lineSplit[3],
      //           m: lineSplit[4],
      //           carga: lineSplit[6],
      //         });
      //       } else {
      //         lineValues.push({
      //           ss: lineSplit[1],
      //           di: lineSplit[2],
      //           h1: lineSplit[3],
      //           m: lineSplit[4],
      //           carga: lineSplit[6],
      //         });
      //       }
      //     }
      //     const tableFromTxt = [];

      //     for (let x = 1; x <= 4; x += 1) {
      //       const subsystemOne = lineValues.filter((r) => r.ss === x.toString());

      //       for (let i = 0; i < subsystemOne.length; i += 1) {
      //         const j = i + 1;

      //         if (j < subsystemOne.length) {
      //           const dataTest = {
      //             dat_running: findLastDateDocType,
      //             dat_initi: ale(
      //               subsystemOne[i].di,
      //               subsystemOne[i].h1,
      //               subsystemOne[i].m
      //             ),
      //             dat_final: ale(
      //               subsystemOne[j].di,
      //               subsystemOne[j].h1,
      //               subsystemOne[j].m
      //             ),
      //             val_load_daily: parseFloat(subsystemOne[i].carga),
      //             num_ssis: parseFloat(subsystemOne[i].ss),
      //           };
      //           tableFromTxt.push(dataTest);
      //         } else {
      //           const dataTest = {
      //             dat_running: findLastDateDocType,
      //             dat_initi: ale(
      //               subsystemOne[i].di,
      //               subsystemOne[i].h1,
      //               subsystemOne[i].m
      //             ),
      //             dat_final: ale(
      //               (parseFloat(subsystemOne[i].di) + 1).toString(),
      //               "0",
      //               "0"
      //             ),
      //             val_load_daily: parseFloat(subsystemOne[i].carga),
      //             num_ssis: parseFloat(subsystemOne[i].ss),
      //           };
      //           tableFromTxt.push(dataTest);
      //         }
      //       }
      //     }

      //     if (findLastDataInSystem.length < 1) {
      //       console.log("estamos aqui,create");

      //       await prisma.tbl_load_daily.createMany({
      //         data: tableFromTxt,
      //       });
      //     } else {
      //       console.log("estamos aqui,update");

      //       for (let z = 0; z < findLastDataInSystem.length; z += 1) {
      //         await prisma.tbl_load_daily.update({
      //           where: {
      //             num_load_daily: findLastDataInSystem[z].num_load_daily,
      //           },
      //           data: {
      //             dat_initi: tableFromTxt[z].dat_initi,
      //             dat_final: tableFromTxt[z].dat_final,
      //             dat_running: tableFromTxt[z].dat_running,
      //             val_load_daily: tableFromTxt[z].val_load_daily,
      //             num_ssis: tableFromTxt[z].num_ssis,
      //           },
      //         });
      //       }
      //     }

      //     // console.log("teste", tableFromTxt);

      //     // await MicrosoftTeam({
      //     //   title: "Previsão do Dessem",
      //     //   message:
      //     //     "Dados diários do Dessem, clique no link para acessar o relatório",
      //     // });
    } catch (error) {
      console.log(error);
    }
  }
};
