import { PrismaClient } from "@prisma/client";

interface IDecompProps {
  docType: string;
  dataTXT: any[];
}

export async function DecompDataLoadWeekly({ docType, dataTXT }: IDecompProps) {
  const prisma = new PrismaClient();
  const findLastDateDocType = await prisma.tbl_file_data.findFirst({
    where: {
      nom_file: docType,
    },
    orderBy: { num_file: "desc" },
  });

  const findLastDataInSystem = await prisma.tbl_load_weekly.findMany({
    where: {
      dat_load: findLastDateDocType.dat_file_publi,
    },
  });

  const subsystemOne = dataTXT.filter((r) => r.s === "1");
  const subsystemTwo = dataTXT.filter((r) => r.s === "2");
  const subsystemThree = dataTXT.filter((r) => r.s === "3");
  const subsystemFour = dataTXT.filter((r) => r.s === "4");

  if (subsystemOne.length < 7) {
    const checkLength = subsystemOne.length;

    for (let i = checkLength; i < 7; i += 1) {
      const numero = i + 1;

      const weekNull = { ip: numero.toString(), s: "1", resultado: 0 };
      subsystemOne.push(weekNull);
    }
  }

  if (subsystemTwo.length < 7) {
    const checkLength = subsystemTwo.length;

    for (let i = checkLength; i < 7; i += 1) {
      const numero = i + 1;

      const weekNull = { ip: numero.toString(), s: "1", resultado: 0 };
      subsystemTwo.push(weekNull);
    }
  }

  if (subsystemThree.length < 7) {
    const checkLength = subsystemThree.length;

    for (let i = checkLength; i < 7; i += 1) {
      const numero = i + 1;

      const weekNull = { ip: numero.toString(), s: "1", resultado: 0 };
      subsystemThree.push(weekNull);
    }
  }

  if (subsystemFour.length < 7) {
    const checkLength = subsystemFour.length;

    for (let i = checkLength; i < 7; i += 1) {
      const numero = i + 1;

      const weekNull = { ip: numero.toString(), s: "1", resultado: 0 };
      subsystemFour.push(weekNull);
    }
  }

  if (findLastDataInSystem.length === 0) {
    await prisma.tbl_load_weekly.createMany({
      data: [
        {
          dat_load: findLastDateDocType.dat_file_publi,
          num_ssis: 1,
          val_week1: subsystemOne[0].resultado,
          val_week2: subsystemOne[1].resultado,
          val_week3: subsystemOne[2].resultado,
          val_week4: subsystemOne[3].resultado,
          val_week5: subsystemOne[4].resultado,
          val_week6: subsystemOne[5].resultado,
          val_week7: subsystemOne[6].resultado,
        },
        {
          dat_load: findLastDateDocType.dat_file_publi,
          num_ssis: 2,
          val_week1: subsystemTwo[0].resultado,
          val_week2: subsystemTwo[1].resultado,
          val_week3: subsystemTwo[2].resultado,
          val_week4: subsystemTwo[3].resultado,
          val_week5: subsystemTwo[4].resultado,
          val_week6: subsystemTwo[5].resultado,
          val_week7: subsystemTwo[6].resultado,
        },
        {
          dat_load: findLastDateDocType.dat_file_publi,
          num_ssis: 3,
          val_week1: subsystemThree[0].resultado,
          val_week2: subsystemThree[1].resultado,
          val_week3: subsystemThree[2].resultado,
          val_week4: subsystemThree[3].resultado,
          val_week5: subsystemThree[4].resultado,
          val_week6: subsystemThree[5].resultado,
          val_week7: subsystemThree[6].resultado,
        },
        {
          dat_load: findLastDateDocType.dat_file_publi,
          num_ssis: 4,
          val_week1: subsystemFour[0].resultado,
          val_week2: subsystemFour[1].resultado,
          val_week3: subsystemFour[2].resultado,
          val_week4: subsystemFour[3].resultado,
          val_week5: subsystemFour[4].resultado,
          val_week6: subsystemFour[5].resultado,
          val_week7: subsystemFour[6].resultado,
        },
      ],
    });
  } else {
    await prisma.tbl_load_weekly.update({
      where: {
        num_load: findLastDataInSystem[0].num_load,
      },
      data: {
        val_week1: subsystemOne[0].resultado,
        val_week2: subsystemOne[1].resultado,
        val_week3: subsystemOne[2].resultado,
        val_week4: subsystemOne[3].resultado,
        val_week5: subsystemOne[4].resultado,
        val_week6: subsystemOne[5].resultado,
        val_week7: subsystemOne[6].resultado,
      },
    });

    await prisma.tbl_load_weekly.update({
      where: {
        num_load: findLastDataInSystem[1].num_load,
      },
      data: {
        val_week1: subsystemTwo[0].resultado,
        val_week2: subsystemTwo[1].resultado,
        val_week3: subsystemTwo[2].resultado,
        val_week4: subsystemTwo[3].resultado,
        val_week5: subsystemTwo[4].resultado,
        val_week6: subsystemTwo[5].resultado,
        val_week7: subsystemTwo[6].resultado,
      },
    });

    await prisma.tbl_load_weekly.update({
      where: {
        num_load: findLastDataInSystem[2].num_load,
      },
      data: {
        val_week1: subsystemThree[0].resultado,
        val_week2: subsystemThree[1].resultado,
        val_week3: subsystemThree[2].resultado,
        val_week4: subsystemThree[3].resultado,
        val_week5: subsystemThree[4].resultado,
        val_week6: subsystemThree[5].resultado,
        val_week7: subsystemThree[6].resultado,
      },
    });

    await prisma.tbl_load_weekly.update({
      where: {
        num_load: findLastDataInSystem[3].num_load,
      },
      data: {
        val_week1: subsystemFour[0].resultado,
        val_week2: subsystemFour[1].resultado,
        val_week3: subsystemFour[2].resultado,
        val_week4: subsystemFour[3].resultado,
        val_week5: subsystemFour[4].resultado,
        val_week6: subsystemFour[5].resultado,
        val_week7: subsystemFour[6].resultado,
      },
    });
  }
}
