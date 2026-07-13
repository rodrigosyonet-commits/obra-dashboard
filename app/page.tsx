export default function Home() {
  return (
    <main
      style={{
        padding: "40px",
        maxWidth: "1400px",
        margin: "0 auto",
      }}
    >
      <h1>Dashboard Ejecutivo de Obras</h1>

      <p>
        Conexión SiNube / FacturaNube
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <h3>Presupuesto</h3>
          <h2>$0</h2>
        </div>

        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <h3>Utilizado</h3>
          <h2>$0</h2>
        </div>

        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <h3>Disponible</h3>
          <h2>$0</h2>
        </div>

        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <h3>Avance</h3>
          <h2>0%</h2>
        </div>
      </div>
    </main>
  );
}
