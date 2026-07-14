export function parseSiNube(raw: string): Record<string, string>[] {
  const filas = raw.split("¬");

  if (filas.length < 2) {
    return [];
  }

  const header = filas[0].split("|");

  const columnas: string[] = [];

  for (let i = 2; i < header.length; i += 2) {
    columnas.push(header[i]);
  }

  const resultado: Record<string, string>[] = [];

  for (let i = 1; i < filas.length; i++) {
    const valores = filas[i].split("|");

    const row: Record<string, string> = {};

    columnas.forEach((columna, index) => {
      row[columna] = valores[index] ?? "";
    });

    resultado.push(row);
  }

  return resultado;
}
