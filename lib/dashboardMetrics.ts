
export function generarResumen(
  presupuesto: any[],
  compras: any[]
) {

  return presupuesto.map((item) => {

    const presupuestoTotal =
      Number(
        item.subtotalPresupuestado || 0
      );

    const relacionadas =
      compras.filter(
        (c) =>
          c.renglonOrigen ===
          item.renglon
      );

    const pagado =
      relacionadas
        .filter(
          (c) =>
            c.estatus === "Pagada"
        )
        .reduce(
          (sum, c) =>
            sum +
            Number(
              c.importeTotal || 0
            ),
          0
        );

    const comprometido =
      relacionadas
        .filter(
          (c) =>
            c.estatus !== "Pagada" &&
            c.estatus !== "Cancelado"
        )
        .reduce(
          (sum, c) =>
            sum +
            Number(
              c.importeTotal || 0
            ),
          0
        );

    const disponible =
      presupuestoTotal -
      pagado -
      comprometido;

    const avance =
      presupuestoTotal > 0
        ? (
            (pagado +
              comprometido) /
            presupuestoTotal
          ) * 100
        : 0;

    return {
      concepto:
        item.descripcion,

      presupuesto:
        presupuestoTotal,

      pagado,

      comprometido,

      disponible,

      avance,
    };
  });
}
