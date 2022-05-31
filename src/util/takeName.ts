interface IDataProps {
  nome: string;
  date: string;
}

export async function takeName({ nome, date }: IDataProps) {
  let nameFile = "";
  let name = "";

  if (nome === "IPDO Editável") {
    name = "IPDO";
    nameFile = `${name}_${date}.xlsm`;
  } else if (nome === "Carga por patamar - DECOMP") {
    name = "Decomp";
    nameFile = `${name}_${date}.zip`;
  } else if (
    nome === "Resultados preliminares não consistidos  (vazões semanais - PMO)"
  ) {
    name = "N_consistidos";
    nameFile = `${name}_${date}.zip`;
  } else if (
    nome === "Resultados preliminares consistidos (vazões semanais - PMO)"
  ) {
    name = "Consistidos";
    nameFile = `${name}_${date}.zip`;
  } else if (nome === "Arquivos de Previsão de Carga para o DESSEM") {
    name = "Dessem";
    nameFile = `${name}_${date}.zip`;
  } else if (nome === "Arquivos dos modelos de geração de cenários de vazões") {
    name = "Gevazp";
    nameFile = `${name}_${Number(date) + 1}.zip`;
  } else if (nome === "Acomph") {
    name = "Acomph";
    nameFile = `${name}_${date}.xls`;
  } else if (nome === "RDH") {
    name = "RDH";
    nameFile = `${name}_${date}.xlsx`;
  }

  return { nameFile, name };
}
