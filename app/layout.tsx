import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard Ejecutivo de Obras",
  description: "Control Presupuestal de Obras",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body
        style={{
          margin: 0,
          background: "#f4f6f8",
          fontFamily:
            "Segoe UI, Inter, Arial, sans-serif",
        }}
      >
        {children}
      </body>
    </html>
  );
}
