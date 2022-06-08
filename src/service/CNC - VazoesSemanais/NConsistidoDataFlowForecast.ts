import { PrismaClient } from "@prisma/client";

interface INCProps {
  docType: string;
  sudeste: IRegionProps;
  sul: IRegionProps;
  nordeste: IRegionProps;
  norte: IRegionProps;
}

interface IRegionProps {
  num_ssis: number;
  val_week1: number;
  val_week2: number;
  val_week3: number;
  val_week4: number;
  val_week5: number;
  val_week6: number;
  val_month: number;
  val_month_mlt: number;
  ind_consisted: number;
}

export async function NConsistidoDataFlowForecast({
  docType,
  sudeste,
  sul,
  nordeste,
  norte,
}: INCProps) {
  const prisma = new PrismaClient();

  const findLastDateDocType = await prisma.tbl_file_data.findFirst({
    where: {
      nom_file: docType,
    },
    orderBy: { num_file: "desc" },
  });

  const findDateFileConsistido = await prisma.tbl_flow_forecast.findMany({
    where: {
      dat_forecast: findLastDateDocType.dat_file_publi,
      ind_consisted: 1,
    },
  });

  const findDateFileNConsistido = await prisma.tbl_flow_forecast.findMany({
    where: {
      dat_forecast: findLastDateDocType.dat_file_publi,
      ind_consisted: 0,
    },
  });

  if (findDateFileConsistido.length === 0) {
    if (findDateFileNConsistido.length === 0) {
      await prisma.tbl_flow_forecast.createMany({
        data: [
          {
            dat_forecast: findLastDateDocType.dat_file_publi,
            ...sudeste,
          },
          {
            dat_forecast: findLastDateDocType.dat_file_publi,
            ...sul,
          },
          {
            dat_forecast: findLastDateDocType.dat_file_publi,
            ...nordeste,
          },
          {
            dat_forecast: findLastDateDocType.dat_file_publi,
            ...norte,
          },
        ],
      });
    } else {
      await prisma.tbl_flow_forecast.update({
        where: {
          num_forecast: findDateFileNConsistido[0].num_forecast,
        },
        data: {
          val_week1: sudeste.val_week1,
          val_week2: sudeste.val_week2,
          val_week3: sudeste.val_week3,
          val_week4: sudeste.val_week4,
          val_week5: sudeste.val_week5,
          val_week6: sudeste.val_week6,
          val_month: sudeste.val_month,
          val_month_mlt: sudeste.val_month_mlt,
        },
      });

      await prisma.tbl_flow_forecast.update({
        where: {
          num_forecast: findDateFileNConsistido[1].num_forecast,
        },
        data: {
          val_week1: sul.val_week1,
          val_week2: sul.val_week2,
          val_week3: sul.val_week3,
          val_week4: sul.val_week4,
          val_week5: sul.val_week5,
          val_week6: sul.val_week6,
          val_month: sul.val_month,
          val_month_mlt: sul.val_month_mlt,
        },
      });

      await prisma.tbl_flow_forecast.update({
        where: {
          num_forecast: findDateFileNConsistido[2].num_forecast,
        },
        data: {
          val_week1: nordeste.val_week1,
          val_week2: nordeste.val_week2,
          val_week3: nordeste.val_week3,
          val_week4: nordeste.val_week4,
          val_week5: nordeste.val_week5,
          val_week6: nordeste.val_week6,
          val_month: nordeste.val_month,
          val_month_mlt: nordeste.val_month_mlt,
        },
      });

      await prisma.tbl_flow_forecast.update({
        where: {
          num_forecast: findDateFileNConsistido[3].num_forecast,
        },
        data: {
          val_week1: norte.val_week1,
          val_week2: norte.val_week2,
          val_week3: norte.val_week3,
          val_week4: norte.val_week4,
          val_week5: norte.val_week5,
          val_week6: norte.val_week6,
          val_month: norte.val_month,
          val_month_mlt: norte.val_month_mlt,
        },
      });
    }
  }
}
