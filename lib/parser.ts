export function parseSiNubeResponse(raw: string) {

  const rows = raw.split("¬");

  if (!rows.length) {
    return [];
  }

  const header = rows[0].split("|");

  const columns: string[] = [];

  for (let i = 2; i < header.length; i += 2) {
    columns.push(header[i]);
  }

  const result: any[] = [];

  for (let i = 1; i < rows.length; i++) {

    const values = rows[i].split("|");

    const item: any = {};

    columns.forEach((col, index) => {
      item[col] = values[index];
    });

    result.push(item);
  }

  return result;
}
