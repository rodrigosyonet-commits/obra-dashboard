"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState(false);

  const [modoFecha, setModoFecha] =
    useState("mes");

  const [fecha, setFecha] =
    useState("2026-07-13");

  const [obra, setObra] =
    useState("");

  const [obras, setObras] =
    useState<any[]>([]);

  const [datos, setDatos] =
    useState<any[]>([]);

  const [kpis, setKpis] =
    useState({
      presupuesto: 0,
      utilizado: 0,
      disponible: 0,
      avance: 0,
    });

  function obtenerMes(fecha: string) {
    const d = new Date(fecha);

    const anio = d.getFullYear();

    const mes = String(
      d.getMonth() + 1
    ).padStart(2, "0");

    return `${anio}${mes}`;
  }

  function obtenerDia(fecha: string) {
    return fecha.replaceAll("-", "");
  }

  async function cargarObras() {
    const mes = obtenerMes(fecha);

    const response = await fetch(
      `/api/obras?mes=${mes}`
    );

    const result = await response.json();

    setObras(result.obras || []);
  }

  async function consultar() {
    setLoading(true);

    try {
      let url =
        `/api/presupuesto?tipoFiltro=${modoFecha}`;

      if (modoFecha === "mes") {
        url +=
          `&mes=${obtenerMes(fecha)}`;
      }

      if (modoFecha === "dia") {
        url +=
          `&dia=${obtenerDia(fecha)}`;
      }

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

      const presupuesto =
        rows.reduce(
          (
            sum: number,
            row: any
          ) =>
            sum +
            Number(
              row.presupuesto || 0
            ),
          0
        );

      const utilizado =
        rows.reduce(
          (
            sum: number,
            row: any
          ) =>
            sum +
            Number(
              row.utilizado || 0
            ),
          0
        );

      const disponible =
        presupuesto - utilizado;

      const avance =
        presupuesto > 0
          ? (utilizado /
              presupuesto) *
            100
          : 0;

      setKpis({
        presupuesto,
        utilizado,
        disponible,
        avance,
      });
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
        padding: 30,
        maxWidth: 1600,
        margin: "0 auto",
      }}
    >
      <h1
        style={{
          color: "#1f2937",
          marginBottom: 30,
        }}
      >
        Dashboard Ejecutivo
        de Obras
      </h1>

      {/* FILTROS */}

      <div
        style={{
          background: "white",
          padding: 20,
          borderRadius: 12,
          display: "flex",
          gap: 20,
          alignItems: "center",
          flexWrap: "wrap",
          boxShadow:
            "0 2px 10px rgba(0,0,0,.08)",
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

        <label>
          <input
            type="radio"
            name="modo"
            checked={
              modoFecha === "mes"
            }
            onChange={() =>
              setModoFecha(
                "mes"
              )
            }
          />
          Mes
        </label>

        <label>
          <input
            type="radio"
            name="modo"
            checked={
              modoFecha ===
              "semana"
            }
            onChange={() =>
              setModoFecha(
                "semana"
              )
            }
          />
          Semana
        </label>

        <label>
          <input
            type="radio"
            name="modo"
            checked={
              modoFecha ===
              "dia"
            }
            onChange={() =>
              setModoFecha(
                "dia"
              )
            }
          />
          Día
        </label>

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
              obra,
              index
            ) => (
              <option
                key={index}
                value={
                  obra.razonSocial
                }
              >
                {
                  obra.razonSocial
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

      {/* KPIS */}

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
          valor={kpis.presupuesto}
          color="#2563eb"
        />

        <KPI
          titulo="Utilizado"
          valor={kpis.utilizado}
          color="#dc2626"
        />

        <KPI
          titulo="Disponible"
          valor={kpis.disponible}
          color="#16a34a"
        />

        <KPI
          titulo="% Avance"
          valor={`${kpis.avance.toFixed(
            2
          )}%`}
          color="#f97316"
        />
      </div>

      {/* TABLA */}

      <div
        style={{
          marginTop: 25,
          background: "white",
          borderRadius: 12,
          padding: 20,
          overflowX: "auto",
          boxShadow:
            "0 2px 10px rgba(0,0,0,.08)",
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
              <th>Renglón</th>
              <th>Concepto</th>
              <th>Presupuesto</th>
              <th>Utilizado</th>
              <th>Disponible</th>
              <th>%</th>
              <th>Estado</th>
            </tr>
          </thead>

          <tbody>
            {datos.map(
              (
                row: any,
                index: number
              ) => (
                <tr key={index}>
                  <td>
                    {
                      row.renglon
                    }
                  </td>

                  <td>
                    {
                      row.descripcion
                    }
                  </td>

                  <td>
                    $
                    {Number(
                      row.presupuesto
                    ).toLocaleString()}
                  </td>

                  <td>
                    $
                    {Number(
                      row.utilizado
                    ).toLocaleString()}
                  </td>

                  <td>
                    $
                    {Number(
                      row.disponible
                    ).toLocaleString()}
                  </td>

                  <td>
                    {Number(
                      row.porcentaje
                    ).toFixed(
                      2
                    )}
                    %
                  </td>

                  <td>
                    <div
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius:
                          "50%",
                        background:
                          row.estado ===
                          "⚫"
                            ? "#111827"
                            : row.estado ===
                              "🔴"
                            ? "#ef4444"
                            : row.estado ===
                              "🟠"
                            ? "#f59e0b"
                            : "#22c55e",
                      }}
                    />
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
}: any) {
  return (
    <div
      style={{
        background: "white",
        padding: 20,
        borderRadius: 12,
        borderLeft:
          `6px solid ${color}`,
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
        {typeof valor ===
        "number"
          ? `$${valor.toLocaleString()}`
          : valor}
      </div>
    </div>
  );
}
