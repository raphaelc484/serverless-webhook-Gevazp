import { PrismaClient } from "@prisma/client";

interface IIPDOProps {
  docType: string;
  valorPredSudeste: number;
  valorVerifSudeste: number;
  valorPredSul: number;
  valorVerifSul: number;
  valorPredNordeste: number;
  valorVerifNordeste: number;
  valorPredNorte: number;
  valorVerifNorte: number;
}

export async function IPDOLoadData({
  docType,
  valorPredSudeste,
  valorVerifSudeste,
  valorPredSul,
  valorVerifSul,
  valorPredNordeste,
  valorVerifNordeste,
  valorPredNorte,
  valorVerifNorte,
}: IIPDOProps) {
  const prisma = new PrismaClient();

  const findLastDateDocType = await prisma.tbl_file_data.findFirst({
    where: {
      nom_file: docType,
    },
    orderBy: { num_file: "desc" },
  });

  const findLastDataInSystem = await prisma.tbl_ipdo_load.findMany({
    take: 4,
    where: {
      dat_ipdo: findLastDateDocType.dat_file_publi,
    },
  });

  if (findLastDataInSystem.length < 1) {
    await prisma.tbl_ipdo_load.create({
      data: {
        num_ssis: 1,
        dat_ipdo: findLastDateDocType.dat_file_publi,
        val_load_predi: valorPredSudeste,
        val_load_verif: valorVerifSudeste,
      },
    });

    await prisma.tbl_ipdo_load.create({
      data: {
        num_ssis: 2,
        dat_ipdo: findLastDateDocType.dat_file_publi,
        val_load_predi: valorPredSul,
        val_load_verif: valorVerifSul,
      },
    });

    await prisma.tbl_ipdo_load.create({
      data: {
        num_ssis: 3,
        dat_ipdo: findLastDateDocType.dat_file_publi,
        val_load_predi: valorPredNordeste,
        val_load_verif: valorVerifNordeste,
      },
    });

    await prisma.tbl_ipdo_load.create({
      data: {
        num_ssis: 4,
        dat_ipdo: findLastDateDocType.dat_file_publi,
        val_load_predi: valorPredNorte,
        val_load_verif: valorVerifNorte,
      },
    });
  } else {
    await prisma.tbl_ipdo_load.update({
      where: {
        num_ipdo: findLastDataInSystem[0].num_ipdo,
      },
      data: {
        num_ssis: 1,
        val_load_predi: valorPredSudeste,
        val_load_verif: valorVerifSudeste,
      },
    });

    await prisma.tbl_ipdo_load.update({
      where: {
        num_ipdo: findLastDataInSystem[1].num_ipdo,
      },
      data: {
        num_ssis: 2,
        val_load_predi: valorPredSul,
        val_load_verif: valorVerifSul,
      },
    });

    await prisma.tbl_ipdo_load.update({
      where: {
        num_ipdo: findLastDataInSystem[2].num_ipdo,
      },
      data: {
        num_ssis: 3,
        val_load_predi: valorPredNordeste,
        val_load_verif: valorVerifNordeste,
      },
    });

    await prisma.tbl_ipdo_load.update({
      where: {
        num_ipdo: findLastDataInSystem[3].num_ipdo,
      },
      data: {
        num_ssis: 4,
        val_load_predi: valorPredNorte,
        val_load_verif: valorVerifNorte,
      },
    });
  }
}
