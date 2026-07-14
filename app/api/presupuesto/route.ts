import { NextResponse } from "next/server";
import { parseSiNube } from "@/lib/parser";
export async function GET() {

const empresa = process.env.FACTURANUBE_EMP;
const sucursal = process.env.FACTURANUBE_SUC;

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
    emp: process.env.FACTURANUBE_EMP || "",
    suc: process.env.FACTURANUBE_SUC || "",
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
      }
    );

    const raw = await response.text();

    console.log("STATUS:", response.status);
    console.log("RAW:", raw);

    return NextResponse.json({
      success: true,
      status: response.status,
      raw,
      env: {
        emp: process.env.FACTURANUBE_EMP,
        suc: process.env.FACTURANUBE_SUC,
        usu: process.env.FACTURANUBE_USU,
        passwordExiste: !!process.env.FACTURANUBE_PASSWORD
      }
    });

  } catch (error) {

    return NextResponse.json({
      success: false,
      error: String(error)
    });

  }
}
const raw = await response.text();

const data = parseSiNube(raw);

return NextResponse.json({
  total: data.length,
  data,
});
