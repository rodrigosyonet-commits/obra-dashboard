export function calcularIndicadores(row: any) {
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

  let estado = "VERDE";

  if (porcentaje >= 100) {
    estado = "EXCEDIDO";
  } else if (porcentaje >= 90) {
    estado = "ROJO";
  } else if (porcentaje >= 60) {
    estado = "NARANJA";
  }

  return {
    ...row,
    presupuesto,
    utilizado,
    disponible,
    porcentaje,
    estado,
  };
}
