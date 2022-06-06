import { PrismaClient } from "@prisma/client";

interface IDecompProps {
  docType: string;
  dateSet: Date;
  valorSudeste: number;
  valorSul: number;
  valorNordeste: number;
  valorNorte: number;
}

export async function DecompDataLoadMonthly({
  docType,
  dateSet,
  valorSudeste,
  valorSul,
  valorNordeste,
  valorNorte,
}: IDecompProps) {
  const prisma = new PrismaClient();
  const findLastDateDocType = await prisma.tbl_file_data.findFirst({
    where: {
      nom_file: docType,
    },
    orderBy: { num_file: "desc" },
  });

  const findLastDataInSystem = await prisma.tbl_load_monthly.findMany({
    where: {
      dat_load_running: findLastDateDocType.dat_file_publi,
    },
  });

  if (findLastDataInSystem.length === 0) {
    await prisma.tbl_load_monthly.createMany({
      data: [
        {
          dat_load_running: findLastDateDocType.dat_file_publi,
          dat_load: dateSet,
          val_load_monthly: valorSudeste,
          num_ssis: 1,
        },
        {
          dat_load_running: findLastDateDocType.dat_file_publi,
          dat_load: dateSet,
          val_load_monthly: valorSul,
          num_ssis: 2,
        },
        {
          dat_load_running: findLastDateDocType.dat_file_publi,
          dat_load: dateSet,
          val_load_monthly: valorNordeste,
          num_ssis: 3,
        },
        {
          dat_load_running: findLastDateDocType.dat_file_publi,
          dat_load: dateSet,
          val_load_monthly: valorNorte,
          num_ssis: 4,
        },
      ],
    });
  } else {
    await prisma.tbl_load_monthly.update({
      where: {
        num_load_monthly: findLastDataInSystem[0].num_load_monthly,
      },
      data: {
        val_load_monthly: valorSudeste,
        dat_load: dateSet,
      },
    });

    await prisma.tbl_load_monthly.update({
      where: {
        num_load_monthly: findLastDataInSystem[1].num_load_monthly,
      },
      data: {
        val_load_monthly: valorSul,
        dat_load: dateSet,
      },
    });

    await prisma.tbl_load_monthly.update({
      where: {
        num_load_monthly: findLastDataInSystem[2].num_load_monthly,
      },
      data: {
        val_load_monthly: valorNordeste,
        dat_load: dateSet,
      },
    });

    await prisma.tbl_load_monthly.update({
      where: {
        num_load_monthly: findLastDataInSystem[3].num_load_monthly,
      },
      data: {
        val_load_monthly: valorNorte,
        dat_load: dateSet,
      },
    });
  }
}
