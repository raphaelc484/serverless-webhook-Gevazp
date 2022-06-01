import { PrismaClient } from "@prisma/client";

interface IIPDOProps {
  docType: string;
  valorSudeste: number;
  valorSul: number;
  valorNordeste: number;
  valorNorte: number;
}

export async function IPDOEnaData({
  docType,
  valorSudeste,
  valorSul,
  valorNordeste,
  valorNorte,
}: IIPDOProps) {
  const prisma = new PrismaClient();

  const findLastDateDocType = await prisma.tbl_file_data.findFirst({
    where: {
      nom_file: docType,
    },
    orderBy: { num_file: "desc" },
  });

  const findLastDataInSystem = await prisma.tbl_ena.findMany({
    take: 4,
    where: {
      dat_ipdo: findLastDateDocType.dat_file_publi,
      cod_fonte: 3,
    },
  });

  if (findLastDataInSystem.length < 1) {
    await prisma.tbl_ena.create({
      data: {
        cod_fonte: 3,
        num_ssis: 1,
        dat_ipdo: findLastDateDocType.dat_file_publi,
        val_ena: valorSudeste,
      },
    });

    await prisma.tbl_ena.create({
      data: {
        cod_fonte: 3,
        num_ssis: 2,
        dat_ipdo: findLastDateDocType.dat_file_publi,
        val_ena: valorSul,
      },
    });

    await prisma.tbl_ena.create({
      data: {
        cod_fonte: 3,
        num_ssis: 3,
        dat_ipdo: findLastDateDocType.dat_file_publi,
        val_ena: valorNordeste,
      },
    });

    await prisma.tbl_ena.create({
      data: {
        cod_fonte: 3,
        num_ssis: 4,
        dat_ipdo: findLastDateDocType.dat_file_publi,
        val_ena: valorNorte,
      },
    });
  } else {
    await prisma.tbl_ena.update({
      where: {
        num_ena: findLastDataInSystem[0].num_ena,
      },
      data: {
        num_ssis: 1,
        val_ena: valorSudeste,
      },
    });

    await prisma.tbl_ena.update({
      where: {
        num_ena: findLastDataInSystem[1].num_ena,
      },
      data: {
        num_ssis: 2,
        val_ena: valorSul,
      },
    });

    await prisma.tbl_ena.update({
      where: {
        num_ena: findLastDataInSystem[2].num_ena,
      },
      data: {
        num_ssis: 3,
        val_ena: valorNordeste,
      },
    });

    await prisma.tbl_ena.update({
      where: {
        num_ena: findLastDataInSystem[3].num_ena,
      },
      data: {
        num_ssis: 4,
        val_ena: valorNorte,
      },
    });
  }

  // await prisma.tbl_ena.upsert({
  //   where: {
  //     num_ena: findLastDataInSystem[0].num_ena,
  //   },
  //   create: {
  //     cod_fonte: 3,
  //     num_ssis: 1,
  //     dat_ipdo: findLastDateDocType.dat_file_publi,
  //     val_ena: valorSudeste,
  //   },
  //   update: {
  //     num_ssis: 1,
  //     val_ena: valorSudeste,
  //   },
  // });

  // await prisma.tbl_ena.upsert({
  //   where: {
  //     num_ena: findLastDataInSystem[1].num_ena,
  //   },
  //   create: {
  //     cod_fonte: 3,
  //     num_ssis: 2,
  //     dat_ipdo: findLastDateDocType.dat_file_publi,
  //     val_ena: valorSul,
  //   },
  //   update: {
  //     num_ssis: 2,
  //     val_ena: valorSul,
  //   },
  // });

  // await prisma.tbl_ena.upsert({
  //   where: {
  //     num_ena: findLastDataInSystem[2].num_ena,
  //   },
  //   create: {
  //     cod_fonte: 3,
  //     num_ssis: 3,
  //     dat_ipdo: findLastDateDocType.dat_file_publi,
  //     val_ena: valorNordeste,
  //   },
  //   update: {
  //     num_ssis: 3,
  //     val_ena: valorNordeste,
  //   },
  // });

  // await prisma.tbl_ena.upsert({
  //   where: {
  //     num_ena: findLastDataInSystem[3].num_ena,
  //   },
  //   create: {
  //     cod_fonte: 3,
  //     num_ssis: 4,
  //     dat_ipdo: findLastDateDocType.dat_file_publi,
  //     val_ena: valorNorte,
  //   },
  //   update: {
  //     num_ssis: 4,
  //     val_ena: valorNorte,
  //   },
  // });
}
