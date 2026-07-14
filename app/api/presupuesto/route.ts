import { NextResponse } from "next/server";
import { parseSiNube } from "../../../lib/parser";
import { calculateRow } from "../../../lib/metrics";

export async function GET(request: Request) {

  const empresa = process.env.FACTURANUBE_EMP || "";
  const sucursal = process.env.FACTURANUBE_SUC || "";

  const { searchParams } =
    new URL(request.url);

  const tipoFiltro =
    searchParams.get("tipoFiltro") || "mes";

  const mes =
    searchParams.get("mes") || "202607";

  const dia =
    searchParams.get("dia") || "";

  const obra =
    searchParams.get("obra") || "";

  let where =
    `WHERE C.empresa='${empresa}' ` +
    `AND C.sucursal='${sucursal}' `;

  if (tipoFiltro === "mes") {
    where += `AND C.mes=${mes} `;
  }

  if (tipoFiltro === "dia") {
    where += `AND C.dia=${dia} `;
  }

  if (obra) {
    where +=
      `AND $razonSocial='${obra}' `;
  }

  const query =
    "SELECT " +
    "C.cliente," +
    "C.razonSocial," +
    "D.renglon," +
    "D.producto," +
    "D.cantidad," +
    "D.descripcion," +
    "D.costo," +
    "D.valorUnitario," +
    "D.subtotalPresupuestado," +
    "C.mes " +
    "FROM DbContrato AS C " +
    "INNER JOIN DbContratoDet AS D " +
    "ON D.empresa=C.empresa " +
    "AND D.sucursal=C.sucursal " +
    "AND D.folioContrato=C.folioContrato " +
    where +
    "TAMPAG 500";

  const params = new URLSearchParams({
    tipo: "3",
    emp: empresa,
    suc: sucursal,
    usu: process.env.FACTURANUBE_USU || "",
    pas: process.env.FACTURANUBE_PASSWORD || "",
    cns: query,
  });

  try {

    const response = await fetch(
      "https://getpost-dot-facturanube.appspot.com/getpost",
      {
        method: "POST",
        body: params,
        cache: "no-store",
      }
    );

    const raw = await response.text();

    const data = parseSiNube(raw);

    const resultado =
      data.map(calculateRow);

    return NextResponse.json({
      success: true,
      total: resultado.length,
      data: resultado,
      query,
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
