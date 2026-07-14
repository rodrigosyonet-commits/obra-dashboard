import { NextResponse } from "next/server";
import { parseSiNube } from "../../../lib/parser";
import { calculateRow } from "../../../lib/metrics";

export async function GET() {
  const empresa = process.env.FACTURANUBE_EMP || "";
  const sucursal = process.env.FACTURANUBE_SUC || "";

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
    `WHERE C.empresa='${empresa}' ` +
    `AND C.sucursal='${sucursal}' ` +
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
    console.log("QUERY:");
    console.log(query);

    const response = await fetch(
      "https://getpost-dot-facturanube.appspot.com/getpost",
      {
        method: "POST",
        body: params,
        cache: "no-store",
      }
    );

    const raw = await response.text();

    console.log("RAW:");
    console.log(raw);

    const data = parseSiNube(raw);

    const dataProcesada = data.map((row) =>
      calculateRow(row)
    );

    return NextResponse.json({
      success: true,
      total: dataProcesada.length,
      data: dataProcesada,
      raw,
      debug: {
        empresa,
        sucursal,
      },
    });
  } catch (error) {
    console.error("ERROR API:", error);

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
`
