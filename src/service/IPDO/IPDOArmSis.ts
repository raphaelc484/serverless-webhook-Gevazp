import { PrismaClient } from "@prisma/client";

interface IIPDOProps {
  docType: string;
  valorSudeste: number;
  valorSul: number;
  valorNordeste: number;
  valorNorte: number;
}

export async function IPDOArmSis({
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

  const findLastDataInSystem = await prisma.tbl_arm_ssis.findMany({
    take: 4,
    where: {
      dat_medicao: findLastDateDocType.dat_file_publi,
      cod_fonte: 3,
    },
  });

  if (findLastDataInSystem.length < 1) {
    await prisma.tbl_arm_ssis.create({
      data: {
        cod_fonte: 3,
        num_ssis: 1,
        dat_medicao: findLastDateDocType.dat_file_publi,
        val_arm_p: valorSudeste,
      },
    });

    await prisma.tbl_arm_ssis.create({
      data: {
        cod_fonte: 3,
        num_ssis: 2,
        dat_medicao: findLastDateDocType.dat_file_publi,
        val_arm_p: valorSul,
      },
    });

    await prisma.tbl_arm_ssis.create({
      data: {
        cod_fonte: 3,
        num_ssis: 3,
        dat_medicao: findLastDateDocType.dat_file_publi,
        val_arm_p: valorNordeste,
      },
    });

    await prisma.tbl_arm_ssis.create({
      data: {
        cod_fonte: 3,
        num_ssis: 4,
        dat_medicao: findLastDateDocType.dat_file_publi,
        val_arm_p: valorNorte,
      },
    });
  } else {
    await prisma.tbl_arm_ssis.update({
      where: {
        id: findLastDataInSystem[0].id,
      },
      data: {
        num_ssis: 1,
        val_arm_p: valorSudeste,
      },
    });

    await prisma.tbl_arm_ssis.update({
      where: {
        id: findLastDataInSystem[1].id,
      },
      data: {
        num_ssis: 2,
        val_arm_p: valorSul,
      },
    });

    await prisma.tbl_arm_ssis.update({
      where: {
        id: findLastDataInSystem[2].id,
      },
      data: {
        num_ssis: 3,
        val_arm_p: valorNordeste,
      },
    });

    await prisma.tbl_arm_ssis.update({
      where: {
        id: findLastDataInSystem[3].id,
      },
      data: {
        num_ssis: 4,
        val_arm_p: valorNorte,
      },
    });
  }

  // await prisma.tbl_arm_ssis.upsert({
  //   where: {
  //     id: findLastDataInSystem[0].id,
  //   },
  //   update: {
  //     num_ssis: 1,
  //     val_arm_p: valorSudeste,
  //   },
  //   create: {
  //     cod_fonte: 3,
  //     num_ssis: 1,
  //     dat_medicao: findLastDateDocType.dat_file_publi,
  //     val_arm_p: valorSudeste,
  //   },
  // });

  // await prisma.tbl_arm_ssis.upsert({
  //   where: {
  //     id: findLastDataInSystem[1].id,
  //   },
  //   update: {
  //     num_ssis: 2,
  //     val_arm_p: valorSul,
  //   },
  //   create: {
  //     cod_fonte: 3,
  //     num_ssis: 2,
  //     dat_medicao: findLastDateDocType.dat_file_publi,
  //     val_arm_p: valorSul,
  //   },
  // });

  // await prisma.tbl_arm_ssis.upsert({
  //   where: {
  //     id: findLastDataInSystem[2].id,
  //   },
  //   update: {
  //     num_ssis: 3,
  //     val_arm_p: valorNordeste,
  //   },
  //   create: {
  //     cod_fonte: 3,
  //     num_ssis: 3,
  //     dat_medicao: findLastDateDocType.dat_file_publi,
  //     val_arm_p: valorNordeste,
  //   },
  // });

  // await prisma.tbl_arm_ssis.upsert({
  //   where: {
  //     id: findLastDataInSystem[3].id,
  //   },
  //   update: {
  //     num_ssis: 4,
  //     val_arm_p: valorNorte,
  //   },
  //   create: {
  //     cod_fonte: 3,
  //     num_ssis: 4,
  //     dat_medicao: findLastDateDocType.dat_file_publi,
  //     val_arm_p: valorNorte,
  //   },
  // });
}
