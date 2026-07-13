"use client";

import { useState } from "react";

export default function Home() {

  const [loading, setLoading] = useState(false);
  const [datos, setDatos] = useState<any[]>([]);

  async function consultar() {

    setLoading(true);

    try {

      const response = await fetch("/api/presupuesto");

      const result = await response.json();

      console.log(result);

      setDatos(result.data || []);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }
  }

  return (
    <main style={{ padding: "40px" }}>

      <h1>Dashboard Ejecutivo de Obras</h1>

      <button
        onClick={consultar}
        disabled={loading}
        style={{
          background: "#2563eb",
          color: "white",
          border: "none",
          padding: "12px 24px",
          borderRadius: "8px",
          cursor: "pointer",
          marginBottom: "20px"
        }}
      >
        {loading ? "Consultando..." : "Consultar SiNube"}
      </button>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse"
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

          {datos.map((row: any, index: number) => (

            <tr key={index}>

              <td>{row.renglon}</td>

              <td>{row.descripcion}</td>

              <td>
                ${row.presupuesto?.toLocaleString()}
              </td>

              <td>
                ${row.utilizado?.toLocaleString()}
              </td>

              <td>
                ${row.disponible?.toLocaleString()}
              </td>

              <td>
                {row.porcentaje?.toFixed(2)}%
              </td>

              <td>{row.estado}</td>

            </tr>

          ))}

        </tbody>
      </table>

    </main>
  );
}
