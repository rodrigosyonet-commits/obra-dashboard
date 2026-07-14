
import { NextResponse } from "next/server";
import { parseSiNube } from "../../../lib/parser";

export async function GET(request: Request) {

  const empresa =
    process.env.FACTURANUBE_EMP || "";

  const sucursal =
    process.env.FACTURANUBE_SUC || "";

  const { searchParams } =
    new URL(request.url);

  const obra =
    searchParams.get("obra") || "";

  let where =
    `WHERE P.empresa='${empresa}' ` +
    `AND P.sucursal='${sucursal}' `;

  if (obra) {
    where +=
      `AND $folioContrato='${obra}' `;
  }

  const query =
    "SELECT " +
    "P.folioContrato," +
    "P.proveedorRazonSocial," +
    "P.folioPedidoProveedor," +
    "PD.renglonOrigen," +
    "PD.renglon," +
    "PD.producto," +
    "PD.descripcion," +
    "PD.cantidad," +
    "PD.unidad," +
    "PD.precio," +
    "P.montoIVA," +
    "P.importeTotal," +
    "RATING(CampoBD;;Pendiente;Autorizado;Surtido;Facturado;Cancelado;Finiquitado;Pagada) AS estatus " +
    "FROM DbPedidoProveedor AS P " +
    "INNER JOIN DbPedidoProveedorDet AS PD " +
    "ON PD.empresa=P.empresa " +
    "AND PD.sucursal=P.sucursal " +
    "AND PD.folioPedidoProveedor=P.folioPedidoProveedor " +
    where +
    "TAMPAG 1000";

  const params = new URLSearchParams({
    tipo: "3",
    emp: empresa,
    suc: sucursal,
    usu: process.env.FACTURANUBE_USU || "",
    pas: process.env.FACTURANUBE_PASSWORD || "",
    cns: query,
  });

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

  return NextResponse.json(data);
}
