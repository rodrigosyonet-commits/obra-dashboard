"use client";

import { useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState(false);

  const [mes, setMes] = useState("202607");

  const [obra, setObra] = useState("");

  const [datos, setDatos] = useState<any[]>([]);

  const [kpis, setKpis] = useState({
    presupuesto: 0,
    utilizado: 0,
    disponible: 0,
    avance: 0,
  });

  async function consultar() {
    setLoading(true);

    try {
      const response = await fetch(
        `/api/presupuesto?tipoFiltro=mes&mes=${mes}&obra=${encodeURIComponent(
          obra
        )}`
      );

      const result = await response.json();

      const rows = result.data || [];

      setDatos(rows);

      const presupuesto = rows.reduce(
        (sum: number, r: any) =>
          sum + Number(r.presupuesto || 0),
        0
      );

      const utilizado = rows.reduce(
        (sum: number, r: any) =>
          sum + Number(r.utilizado || 0),
        0
      );

      const disponible =
        presupuesto - utilizado;

      const avance =
        presupuesto > 0
          ? (utilizado / presupuesto) * 100
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

  return (
    <main
      style={{
        maxWidth: "1600px",
        margin: "0 auto",
        padding: "30px",
      }}
    >
      <h1
        style={{
          color: "#1e293b",
          marginBottom: "30px",
        }}
      >
        Dashboard Ejecutivo de Obras
      </h1>

      {/* FILTROS */}

      <div
        style={{
          background: "white",
          padding: 20,
          borderRadius: 12,
          display: "flex",
          gap: 15,
          alignItems: "center",
          marginBottom: 25,
          boxShadow:
            "0 2px 10px rgba(0,0,0,.08)",
        }}
      >
        <div>
          <label>Mes</label>

          <br />

          <input
            type="month"
            value={`${mes.slice(
              0,
              4
            )}-${mes.slice(4, 6)}`}
            onChange={(e) => {
              setMes(
                e.target.value.replace("-", "")
              );
            }}
          />
        </div>

        <div>
          <label>Obra</label>

          <br />

          <input
            type="text"
            placeholder="OBRA MOLINO"
            value={obra}
            onChange={(e) =>
              setObra(e.target.value)
            }
          />
        </div>

        <button
          onClick={consultar}
          disabled={loading}
          style={{
            background: "#2563eb",
            color: "white",
            border: 0,
            borderRadius: 8,
            padding: "10px 25px",
            cursor: "pointer",
            marginTop: 18,
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
          marginBottom: 25,
        }}
      >
        <Card
          titulo="Presupuesto"
          valor={kpis.presupuesto}
          color="#2563eb"
        />

        <Card
          titulo="Utilizado"
          valor={kpis.utilizado}
          color="#e11d48"
        />

        <Card
          titulo="Disponible"
          valor={kpis.disponible}
          color="#16a34a"
        />

        <Card
          titulo="% Avance"
          valor={`${kpis.avance.toFixed(
            2
          )}%`}
          color="#ea580c"
        />
      </div>

      {/* TABLA */}

      <div
        style={{
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
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr
              style={{
                background: "#f1f5f9",
              }}
            >
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
              (row: any, index: number) => (
                <tr key={index}>
                  <td>{row.renglon}</td>

                  <td>
                    {row.descripcion}
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
                    ).toFixed(2)}
                    %
                  </td>

                  <td>
                    <span
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        display:
                          "inline-block",
                        background:
                          row.estado === "⚫"
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

function Card({
  titulo,
  valor,
  color,
}: {
  titulo: string;
  valor: number | string;
  color: string;
}) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: 12,
        padding: 20,
        borderLeft: `6px solid ${color}`,
        boxShadow:
          "0 2px 10px rgba(0,0,0,.08)",
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
        {typeof valor === "number"
          ? `$${valor.toLocaleString()}`
          : valor}
      </div>
    </div>
  );
}
