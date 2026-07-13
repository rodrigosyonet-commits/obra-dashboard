export function calculateRow(row: any) {

  const presupuesto =
    Number(row.subtotalPresupuestado || 0);

  const utilizado =
    Number(row.valorUnitario || 0) *
    Number(row.cantidad || 0);

  const disponible =
    presupuesto - utilizado;

  const porcentaje =
    presupuesto > 0
      ? (utilizado / presupuesto) * 100
      : 0;

  let semaforo = "VERDE";

  if (porcentaje >= 100) {
    semaforo = "EXCEDIDO";
  }
  else if (porcentaje >= 90) {
    semaforo = "ROJO";
  }
  else if (porcentaje >= 60) {
    semaforo = "NARANJA";
  }

  return {
    ...row,
    presupuesto,
    utilizado,
    disponible,
    porcentaje,
    semaforo
  };
}
