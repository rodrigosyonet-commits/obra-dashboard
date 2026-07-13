"use client";

import { useEffect, useState } from "react";
import { calculateRow } from "@/lib/metrics";

export default function Home() {

  const [datos, setDatos] = useState<any[]>([]);

  useEffect(() => {

    // Datos de prueba

    const demo = [
      {
        renglon: 1,
        descripcion: "Terracerías",
        subtotalPresupuestado: 3200000,
        cantidad: 3600,
        valorUnitario: 1000
      },
      {
        renglon: 2,
        descripcion: "Pisos",
        subtotalPresupuestado: 23000,
        cantidad: 21,
        valorUnitario: 1000
      }
    ];

    setDatos(
      demo.map(calculateRow)
    );

  }, []);

  return (
    <main style={{ padding: "40px" }}>

      <h1>Dashboard Ejecutivo de Obras</h1>

      <table
        style={{
          width: "100%",
          marginTop: "30px",
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
          {datos.map((row, index) => (

            <tr key={index}>

              <td>{row.renglon}</td>

              <td>{row.descripcion}</td>

              <td>
                $
                {row.presupuesto.toLocaleString()}
              </td>

              <td>
                $
                {row.utilizado.toLocaleString()}
              </td>

              <td>
                $
                {row.disponible.toLocaleString()}
              </td>

              <td>
                {row.porcentaje.toFixed(2)}%
              </td>

              <td>
                {row.estado}
              </td>

            </tr>

          ))}
        </tbody>

      </table>

    </main>
  );
}
