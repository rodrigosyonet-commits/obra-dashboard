"use client";

import { useEffect, useState } from "react";

type DashboardRow = {
  obra: string;
  concepto: string;
  presupuesto: number;
  pagado: number;
  comprometido: number;
  disponible: number;
  avance: number;
  estado: string;
};

export default function Home() {
  const [loading, setLoading] = useState(false);

  const [fecha, setFecha] =
    useState("2026-07-13");

  const [obra, setObra] =
    useState("");

  const [obras, setObras] =
    useState<any[]>([]);

  const [datos, setDatos] =
    useState<DashboardRow[]>([]);

  const [kpis, setKpis] =
    useState({
      presupuesto: 0,
      pagado: 0,
      comprometido: 0,
      disponible: 0,
    });

  function obtenerMes(
    fechaTexto: string
  ) {
    const d = new Date(fechaTexto);

    const anio = d.getFullYear();

    const mes = String(
      d.getMonth() + 1
    ).padStart(2, "0");

    return `${anio}${mes}`;
  }

  async function cargarObras() {
    try {
      const mes =
        obtenerMes(fecha);

      const response =
        await fetch(
          `/api/obras?mes=${mes}`
        );

      const result =
        await response.json();

      setObras(result.obras || []);
    } catch (error) {
      console.error(error);
    }
  }

  async function consultar() {
    setLoading(true);

    try {
      const mes =
        obtenerMes(fecha);

      let url =
        `/api/dashboard?mes=${mes}`;

      if (obra) {
        url +=
          `&obra=${encodeURIComponent(
            obra
          )}`;
      }

      const response =
        await fetch(url);

      const result =
        await response.json();

      const rows =
        result.data || [];

      setDatos(rows);

      setKpis({
        presupuesto:
          result.kpis
            ?.presupuesto || 0,

        pagado:
          result.kpis?.pagado || 0,

        comprometido:
          result.kpis
            ?.comprometido || 0,

        disponible:
          result.kpis
            ?.disponible || 0,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargarObras();
  }, [fecha]);

  return (
    <main
      style={{
        maxWidth: "1700px",
        margin: "0 auto",
        padding: "30px",
      }}
    >
      <h1>
        Dashboard Ejecutivo de Obras
      </h1>

      {/* FILTROS */}

      <div
        style={{
          background: "white",
          padding: 20,
          borderRadius: 12,
          marginTop: 20,
          display: "flex",
          gap: 20,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <input
          type="date"
          value={fecha}
          onChange={(e) =>
            setFecha(
              e.target.value
            )
          }
        />

        <select
          value={obra}
          onChange={(e) =>
            setObra(
              e.target.value
            )
          }
        >
          <option value="">
            Todas las Obras
          </option>

          {obras.map(
            (
              item: any,
              index: number
            ) => (
              <option
                key={index}
                value={
                  item.razonSocial
                }
              >
                {
                  item.razonSocial
                }
              </option>
            )
          )}
        </select>

        <button
          onClick={consultar}
          disabled={loading}
          style={{
            background:
              "#2563eb",
            color: "white",
            border: 0,
            padding:
              "10px 25px",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          {loading
            ? "Consultando..."
            : "Consultar"}
        </button>
      </div>

      {/* KPIs */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(4,1fr)",
          gap: 20,
          marginTop: 25,
        }}
      >
        <KPI
          titulo="Presupuesto"
          valor={
            kpis.presupuesto
          }
          color="#2563eb"
        />

        <KPI
          titulo="Pagado"
          valor={kpis.pagado}
          color="#16a34a"
        />

        <KPI
          titulo="Comprometido"
          valor={
            kpis.comprometido
          }
          color="#f59e0b"
        />

        <KPI
          titulo="Disponible"
          valor={
            kpis.disponible
          }
          color="#dc2626"
        />
      </div>

      {/* TABLA */}

      <div
        style={{
          marginTop: 25,
          background: "white",
          padding: 20,
          borderRadius: 12,
          overflowX: "auto",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse:
              "collapse",
          }}
        >
          <thead>
            <tr>
              <th>Concepto</th>
              <th>Presupuesto</th>
              <th>Pagado</th>
              <th>Comprometido</th>
              <th>Disponible</th>
              <th>%</th>
              <th>Estado</th>
            </tr>
          </thead>

          <tbody>
            {datos.map(
              (
                row,
                index
              ) => (
                <tr key={index}>
                  <td>
                    {
                      row.concepto
                    }
                  </td>

                  <td>
                    $
                    {row.presupuesto.toLocaleString()}
                  </td>

                  <td>
                    $
                    {row.pagado.toLocaleString()}
                  </td>

                  <td>
                    $
                    {row.comprometido.toLocaleString()}
                  </td>

                  <td>
                    $
                    {row.disponible.toLocaleString()}
                  </td>

                  <td>
                    {row.avance.toFixed(
                      2
                    )}
                    %
                  </td>

                  <td>
                    {
                      row.estado
                    }
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}

function KPI({
  titulo,
  valor,
  color,
}: {
  titulo: string;
  valor: number;
  color: string;
}) {
  return (
    <div
      style={{
        background: "white",
        padding: 20,
        borderRadius: 12,
        borderLeft: `6px solid ${color}`,
      }}
    >
      <div
        style={{
          color: "#64748b",
          marginBottom: 10,
        }}
      >
        {titulo}
      </div>

      <div
        style={{
          fontSize: 28,
          fontWeight: 700,
        }}
      >
        $
        {valor.toLocaleString()}
      </div>
    </div>
  );
}
