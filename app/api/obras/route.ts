import { NextResponse } from "next/server";
import { parseSiNube } from "../../../lib/parser";

export async function GET(request: Request) {
  const empresa = process.env.FACTURANUBE_EMP || "";
  const sucursal = process.env.FACTURANUBE_SUC || "";

  const { searchParams } = new URL(request.url);

  const mes =
    searchParams.get("mes") || "202607";

  const query =
    "SELECT " +
    "razonSocial," +
    "estatus," +
    "mes " +
    "FROM DbContrato " +
    `WHERE empresa='${empresa}' ` +
    `AND sucursal='${sucursal}' ` +
    `AND mes=${mes} ` +
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

    const obras = data
      .filter(
        (obra) => obra.estatus !== "4"
      )
      .filter(
        (obra, index, self) =>
          index ===
          self.findIndex(
            (o) =>
              o.razonSocial ===
              obra.razonSocial
          )
      )
      .map((obra) => ({
        razonSocial: obra.razonSocial,
        estatus: obra.estatus,
        estatusTexto:
          obra.estatus === "1"
            ? "Pendiente"
            : obra.estatus === "2"
            ? "Autorizado"
            : obra.estatus === "3"
            ? "Terminado"
            : "Desconocido",
        mes: obra.mes,
      }));

    return NextResponse.json({
      success: true,
      total: obras.length,
      obras,
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
