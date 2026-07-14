export function parseSiNube(raw: string) {

  const filas = raw.split("¬");

  if (filas.length < 2) {
    return [];
  }

  const header = filas[0].split("|");

  const columnas: string[] = [];

  for (let i = 2; i < header.length; i += 2) {
    columnas.push(header[i]);
  }

  const resultado: any[] = [];

  for (let i = 1; i < filas.length; i++) {

    const valores = filas[i].split("|");

    const row: any = {};

    columnas.forEach((columna, index) => {
      row[columna] = valores[index];
    });

    resultado.push(row);
  }

  return resultado;
}
