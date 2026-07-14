
import { NextResponse } from "next/server";
import { parseSiNube } from "../../../lib/parser";

export async function GET(request: Request) {
  const empresa = process.env.FACTURANUBE_EMP || "";
  const sucursal = process.env.FACTURANUBE_SUC || "";

  const { searchParams } = new URL(request.url);

  const mes =
    searchParams.get("mes") || "202607";

  const obra =
    searchParams.get("obra") || "";

  const paramsBase = {
    tipo: "3",
    emp: empresa,
    suc: sucursal,
    usu: process.env.FACTURANUBE_USU || "",
    pas: process.env.FACTURANUBE_PASSWORD || "",
  };

  try {
    let filtroContrato =
      `WHERE C.empresa='${empresa}' ` +
      `AND C.sucursal='${sucursal}' ` +
      `AND C.mes=${mes} `;

    if (obra) {
      filtroContrato +=
        `AND $razonSocial='${obra}' `;
    }

    const queryPresupuesto =
      "SELECT " +
      "C.folioContrato," +
      "C.razonSocial," +
      "D.renglon," +
      "D.descripcion," +
      "D.cantidad," +
      "D.valorUnitario," +
      "D.subtotalPresupuestado " +
      "FROM DbContrato AS C " +
      "INNER JOIN DbContratoDet AS D " +
      "ON D.empresa=C.empresa " +
      "AND D.sucursal=C.sucursal " +
      "AND D.folioContrato=C.folioContrato " +
      filtroContrato +
      "TAMPAG 1000";

    const presupuestoResponse = await fetch(
      "https://getpost-dot-facturanube.appspot.com/getpost",
      {
        method: "POST",
        body: new URLSearchParams({
          ...paramsBase,
          cns: queryPresupuesto,
        }),
      }
    );

    const presupuestoRaw =
      await presupuestoResponse.text();

    const presupuesto =
      parseSiNube(presupuestoRaw);

    let filtroCompras =
      `WHERE P.empresa='${empresa}' ` +
      `AND P.sucursal='${sucursal}' `;

    if (obra) {
      filtroCompras +=
        `AND $folioContrato='${obra}' `;
    }

    const queryCompras =
      "SELECT " +
      "P.folioContrato," +
      "P.proveedorRazonSocial," +
      "P.folioPedidoProveedor," +
      "PD.renglonOrigen," +
      "PD.descripcion," +
      "PD.cantidad," +
      "PD.precio," +
      "P.importeTotal," +
      "RATING(CampoBD;;Pendiente;Autorizado;Surtido;Facturado;Cancelado;Finiquitado;Pagada) AS estatus " +
      "FROM DbPedidoProveedor AS P " +
      "INNER JOIN DbPedidoProveedorDet AS PD " +
      "ON PD.empresa=P.empresa " +
      "AND PD.sucursal=P.sucursal " +
      "AND PD.folioPedidoProveedor=P.folioPedidoProveedor " +
      filtroCompras +
      "TAMPAG 1000";

    const comprasResponse = await fetch(
      "https://getpost-dot-facturanube.appspot.com/getpost",
      {
        method: "POST",
        body: new URLSearchParams({
          ...paramsBase,
          cns: queryCompras,
        }),
      }
    );

    const comprasRaw =
      await comprasResponse.text();

    const compras =
      parseSiNube(comprasRaw);

    const dashboard = presupuesto.map(
      (item: any) => {
        const presupuestoTotal =
          Number(
            item.subtotalPresupuestado || 0
          );

        const comprasRelacionadas =
          compras.filter(
            (c: any) =>
              String(
                c.renglonOrigen
              ) ===
              String(item.renglon)
          );

        const pagado =
          comprasRelacionadas
            .filter(
              (c: any) =>
                c.estatus ===
                "Pagada"
            )
            .reduce(
              (
                sum: number,
                c: any
              ) =>
                sum +
                Number(
                  c.importeTotal || 0
                ),
              0
            );

        const comprometido =
          comprasRelacionadas
            .filter(
              (c: any) =>
                c.estatus !==
                  "Pagada" &&
                c.estatus !==
                  "Cancelado"
            )
            .reduce(
              (
                sum: number,
                c: any
              ) =>
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
            ? ((pagado +
                comprometido) /
                presupuestoTotal) *
              100
            : 0;

        let estado = "🟢";

        if (avance >= 100) {
          estado = "⚫";
        } else if (avance >= 90) {
          estado = "🔴";
        } else if (avance >= 60) {
          estado = "🟠";
        }

        return {
          folioContrato:
            item.folioContrato,

          obra:
            item.razonSocial,

          renglon:
            item.renglon,

          concepto:
            item.descripcion,

          presupuesto:
            presupuestoTotal,

          pagado,

          comprometido,

          disponible,

          avance,

          estado,
        };
      }
    );

    const kpis = {
      presupuesto: dashboard.reduce(
        (s, r) => s + r.presupuesto,
        0
      ),

      pagado: dashboard.reduce(
        (s, r) => s + r.pagado,
        0
      ),

      comprometido:
        dashboard.reduce(
          (s, r) =>
            s + r.comprometido,
          0
        ),

      disponible:
        dashboard.reduce(
          (s, r) =>
            s + r.disponible,
          0
        ),
    };

    return NextResponse.json({
      success: true,
      kpis,
      total: dashboard.length,
      data: dashboard,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: String(error),
      },
      {
        status: 500,
      }
    );
  }
}
