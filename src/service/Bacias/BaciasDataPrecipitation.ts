import { PrismaClient } from "@prisma/client";

interface IDataProps {
  docType: string;
  dataList: IBaciasProps[];
}

interface IBaciasProps {
  dat_running: string;
  dat_forecast: string;
  num_prec_model: string;
  nom_bacia: string;
  val_prec: string;
}
export async function BaciasDataPrecipitation({ dataList }) {
  const prisma = new PrismaClient();

  for (let i = 0; i < dataList.length; i += 1) {
    const baciaSemCarcterEstranho = dataList[i].nom_bacia
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    const numberBacia = await prisma.tbl_bacia.findMany({
      where: {
        nom_bacia: baciaSemCarcterEstranho,
      },
    });

    await prisma.tbl_precipitation.create({
      data: {
        dat_forecast: new Date(dataList[i].dat_forecast),
        dat_running: new Date(dataList[i].dat_running),
        num_prec_model: Number(dataList[i].num_prec_model),
        val_prec: Number(dataList[i].val_prec),
        num_bacia: numberBacia[0].num_bacia,
      },
    });
  }
}
