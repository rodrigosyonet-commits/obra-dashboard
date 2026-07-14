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

  let estado = "🟢";

  if (porcentaje >= 100) {
    estado = "⚫";
  } else if (porcentaje >= 90) {
    estado = "🔴";
  } else if (porcentaje >= 60) {
    estado = "🟠";
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
