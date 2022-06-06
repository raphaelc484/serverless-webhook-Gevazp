import { PrismaClient } from "@prisma/client";
import {
  differenceInDays,
  eachWeekendOfMonth,
  endOfMonth,
  getDaysInMonth,
  addMonths,
  set,
  getDate,
  getDay,
  startOfMonth,
  subHours,
} from "date-fns";
import { DecompDataLoadMonthly } from "../Decomp/DecompDataLoadMonthly";

interface IDecomProps {
  docType: string;
}

export async function DecompDataRev0({ docType }: IDecomProps) {
  const prisma = new PrismaClient();

  const findLastDateDocType = await prisma.tbl_file_data.findFirst({
    where: {
      nom_file: docType,
    },
    orderBy: { num_file: "desc" },
  });

  const time = findLastDateDocType.dat_file_publi;

  const weekToFind = await prisma.tbl_load_weekly.findMany({
    where: {
      dat_load: time,
    },
  });

  const dateToUse = weekToFind[0].dat_load;

  const checkDay = getDate(dateToUse);

  const listOfResults = [];

  let daysInMonth = 0;

  let dateSet = new Date();

  if (checkDay !== 1) {
    const addMonthOneTime = addMonths(dateToUse, 1);

    daysInMonth = getDaysInMonth(addMonthOneTime);

    const arrayOfSaturdayAndSunday = eachWeekendOfMonth(addMonthOneTime);
    const listOfSaturday = arrayOfSaturdayAndSunday.filter(
      (s) => getDay(s) === 6 && s
    );

    const newListOfWeek = [];

    newListOfWeek.push(time, ...listOfSaturday);

    const lastSaturday = newListOfWeek[newListOfWeek.length - 1];

    const quantosDiasFaltamComeço = differenceInDays(
      newListOfWeek[1],
      startOfMonth(addMonthOneTime)
    );

    const quantosDiasFaltamFinal = differenceInDays(
      endOfMonth(addMonthOneTime),
      subHours(lastSaturday, 3)
    );

    dateSet = set(addMonthOneTime, {
      date: 1,
    });

    if (newListOfWeek.length <= 5) {
      const semana1 = {
        valorSudeste: weekToFind[0]?.val_week1 * quantosDiasFaltamComeço,
        valorSul: weekToFind[1]?.val_week1 * quantosDiasFaltamComeço,
        valorNordeste: weekToFind[2]?.val_week1 * quantosDiasFaltamComeço,
        valorNorte: weekToFind[3]?.val_week1 * quantosDiasFaltamComeço,
        qtdDiasMes: quantosDiasFaltamComeço,
      };
      listOfResults.push(semana1);
      const semana2 = {
        valorSudeste: weekToFind[0]?.val_week2 * 7,
        valorSul: weekToFind[1]?.val_week2 * 7,
        valorNordeste: weekToFind[2]?.val_week2 * 7,
        valorNorte: weekToFind[3]?.val_week2 * 7,
        qtdDiasMes: 7,
      };
      listOfResults.push(semana2);
      const semana3 = {
        valorSudeste: weekToFind[0]?.val_week3 * 7,
        valorSul: weekToFind[1]?.val_week3 * 7,
        valorNordeste: weekToFind[2]?.val_week3 * 7,
        valorNorte: weekToFind[3]?.val_week3 * 7,
        qtdDiasMes: 7,
      };
      listOfResults.push(semana3);
      const semana4 = {
        valorSudeste: weekToFind[0]?.val_week4 * 7,
        valorSul: weekToFind[1]?.val_week4 * 7,
        valorNordeste: weekToFind[2]?.val_week4 * 7,
        valorNorte: weekToFind[3]?.val_week4 * 7,
        qtdDiasMes: 7,
      };
      listOfResults.push(semana4);
      const semana5 = {
        valorSudeste: weekToFind[0]?.val_week5 * quantosDiasFaltamFinal,
        valorSul: weekToFind[1]?.val_week5 * quantosDiasFaltamFinal,
        valorNordeste: weekToFind[2]?.val_week5 * quantosDiasFaltamFinal,
        valorNorte: weekToFind[3]?.val_week5 * quantosDiasFaltamFinal,
        qtdDiasMes: quantosDiasFaltamFinal,
      };
      listOfResults.push(semana5);
    } else {
      const semana1 = {
        valorSudeste: weekToFind[0]?.val_week1 * quantosDiasFaltamComeço,
        valorSul: weekToFind[1]?.val_week1 * quantosDiasFaltamComeço,
        valorNordeste: weekToFind[2]?.val_week1 * quantosDiasFaltamComeço,
        valorNorte: weekToFind[3]?.val_week1 * quantosDiasFaltamComeço,
        qtdDiasMes: quantosDiasFaltamComeço,
      };
      listOfResults.push(semana1);
      const semana2 = {
        valorSudeste: weekToFind[0]?.val_week2 * 7,
        valorSul: weekToFind[1]?.val_week2 * 7,
        valorNordeste: weekToFind[2]?.val_week2 * 7,
        valorNorte: weekToFind[3]?.val_week2 * 7,
        qtdDiasMes: 7,
      };
      listOfResults.push(semana2);
      const semana3 = {
        valorSudeste: weekToFind[0]?.val_week3 * 7,
        valorSul: weekToFind[1]?.val_week3 * 7,
        valorNordeste: weekToFind[2]?.val_week3 * 7,
        valorNorte: weekToFind[3]?.val_week3 * 7,
        qtdDiasMes: 7,
      };
      listOfResults.push(semana3);
      const semana4 = {
        valorSudeste: weekToFind[0]?.val_week4 * 7,
        valorSul: weekToFind[1]?.val_week4 * 7,
        valorNordeste: weekToFind[2]?.val_week4 * 7,
        valorNorte: weekToFind[3]?.val_week4 * 7,
        qtdDiasMes: 7,
      };
      listOfResults.push(semana4);
      const semana5 = {
        valorSudeste: weekToFind[0]?.val_week5 * 7,
        valorSul: weekToFind[1]?.val_week5 * 7,
        valorNordeste: weekToFind[2]?.val_week5 * 7,
        valorNorte: weekToFind[3]?.val_week5 * 7,
        qtdDiasMes: 7,
      };
      listOfResults.push(semana5);
      const semana6 = {
        valorSudeste: weekToFind[0]?.val_week6 * quantosDiasFaltamFinal,
        valorSul: weekToFind[1]?.val_week6 * quantosDiasFaltamFinal,
        valorNordeste: weekToFind[2]?.val_week6 * quantosDiasFaltamFinal,
        valorNorte: weekToFind[3]?.val_week6 * quantosDiasFaltamFinal,
        qtdDiasMes: quantosDiasFaltamFinal,
      };
      listOfResults.push(semana6);
    }
  } else {
    const arrayOfSaturdayAndSunday = eachWeekendOfMonth(time);

    daysInMonth = getDaysInMonth(time);

    const listOfSaturday = arrayOfSaturdayAndSunday.filter(
      (s) => getDay(s) === 6 && s
    );

    const quantosDiasFaltamFinal = differenceInDays(
      endOfMonth(time),
      subHours(listOfSaturday[listOfSaturday.length - 1], 3)
    );

    dateSet = time;

    if (listOfSaturday.length <= 5) {
      const semana1 = {
        valorSudeste: weekToFind[0]?.val_week1 * 7,
        valorSul: weekToFind[1]?.val_week1 * 7,
        valorNordeste: weekToFind[2]?.val_week1 * 7,
        valorNorte: weekToFind[3]?.val_week1 * 7,
        qtdDiasMes: 7,
      };
      listOfResults.push(semana1);
      const semana2 = {
        valorSudeste: weekToFind[0]?.val_week2 * 7,
        valorSul: weekToFind[1]?.val_week2 * 7,
        valorNordeste: weekToFind[2]?.val_week2 * 7,
        valorNorte: weekToFind[3]?.val_week2 * 7,
        qtdDiasMes: 7,
      };
      listOfResults.push(semana2);
      const semana3 = {
        valorSudeste: weekToFind[0]?.val_week3 * 7,
        valorSul: weekToFind[1]?.val_week3 * 7,
        valorNordeste: weekToFind[2]?.val_week3 * 7,
        valorNorte: weekToFind[3]?.val_week3 * 7,
        qtdDiasMes: 7,
      };
      listOfResults.push(semana3);
      const semana4 = {
        valorSudeste: weekToFind[0]?.val_week4 * 7,
        valorSul: weekToFind[1]?.val_week4 * 7,
        valorNordeste: weekToFind[2]?.val_week4 * 7,
        valorNorte: weekToFind[3]?.val_week4 * 7,
        qtdDiasMes: 7,
      };
      listOfResults.push(semana4);
      const semana5 = {
        valorSudeste: weekToFind[0]?.val_week5 * quantosDiasFaltamFinal,
        valorSul: weekToFind[1]?.val_week5 * quantosDiasFaltamFinal,
        valorNordeste: weekToFind[2]?.val_week5 * quantosDiasFaltamFinal,
        valorNorte: weekToFind[3]?.val_week5 * quantosDiasFaltamFinal,
        qtdDiasMes: quantosDiasFaltamFinal,
      };
      listOfResults.push(semana5);
    } else {
      const semana1 = {
        valorSudeste: weekToFind[0]?.val_week1 * 7,
        valorSul: weekToFind[1]?.val_week1 * 7,
        valorNordeste: weekToFind[2]?.val_week1 * 7,
        valorNorte: weekToFind[3]?.val_week1 * 7,
        qtdDiasMes: 7,
      };
      listOfResults.push(semana1);
      const semana2 = {
        valorSudeste: weekToFind[0]?.val_week2 * 7,
        valorSul: weekToFind[1]?.val_week2 * 7,
        valorNordeste: weekToFind[2]?.val_week2 * 7,
        valorNorte: weekToFind[3]?.val_week2 * 7,
        qtdDiasMes: 7,
      };
      listOfResults.push(semana2);
      const semana3 = {
        valorSudeste: weekToFind[0]?.val_week3 * 7,
        valorSul: weekToFind[1]?.val_week3 * 7,
        valorNordeste: weekToFind[2]?.val_week3 * 7,
        valorNorte: weekToFind[3]?.val_week3 * 7,
        qtdDiasMes: 7,
      };
      listOfResults.push(semana3);
      const semana4 = {
        valorSudeste: weekToFind[0]?.val_week4 * 7,
        valorSul: weekToFind[1]?.val_week4 * 7,
        valorNordeste: weekToFind[2]?.val_week4 * 7,
        valorNorte: weekToFind[3]?.val_week4 * 7,
        qtdDiasMes: 7,
      };
      listOfResults.push(semana4);
      const semana5 = {
        valorSudeste: weekToFind[0]?.val_week5 * 7,
        valorSul: weekToFind[1]?.val_week5 * 7,
        valorNordeste: weekToFind[2]?.val_week5 * 7,
        valorNorte: weekToFind[3]?.val_week5 * 7,
        qtdDiasMes: 7,
      };
      listOfResults.push(semana5);
      const semana6 = {
        valorSudeste: weekToFind[0]?.val_week6 * quantosDiasFaltamFinal,
        valorSul: weekToFind[1]?.val_week6 * quantosDiasFaltamFinal,
        valorNordeste: weekToFind[2]?.val_week6 * quantosDiasFaltamFinal,
        valorNorte: weekToFind[3]?.val_week6 * quantosDiasFaltamFinal,
        qtdDiasMes: quantosDiasFaltamFinal,
      };
      listOfResults.push(semana6);
    }
  }

  const somaSuldeste = listOfResults
    .filter((r) => r.valorSudeste)
    .reduce((acc, cur) => acc + cur.valorSudeste, 0);
  const somaSul = listOfResults
    .filter((r) => r.valorSul)
    .reduce((acc, cur) => acc + cur.valorSul, 0);
  const somaNordeste = listOfResults
    .filter((r) => r.valorNordeste)
    .reduce((acc, cur) => acc + cur.valorNordeste, 0);
  const somaNorte = listOfResults
    .filter((r) => r.valorNorte)
    .reduce((acc, cur) => acc + cur.valorNorte, 0);

  const mediaMensal = {
    mensalSudeste: Number((somaSuldeste / daysInMonth).toFixed(0)),
    mensalSul: Number((somaSul / daysInMonth).toFixed(0)),
    mensalNordeste: Number((somaNordeste / daysInMonth).toFixed(0)),
    mensalNorte: Number((somaNorte / daysInMonth).toFixed(0)),
  };

  await DecompDataLoadMonthly({
    docType,
    dateSet,
    valorSudeste: mediaMensal.mensalSudeste,
    valorSul: mediaMensal.mensalSul,
    valorNordeste: mediaMensal.mensalNordeste,
    valorNorte: mediaMensal.mensalNorte,
  });
}
