import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard Ejecutivo de Obras",
  description: "Control presupuestal de obra con SiNube",
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
          padding: 0,
          fontFamily:
            "Inter, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif",
          backgroundColor: "#f5f7fa",
        }}
      >
        {children}
      </body>
    </html>
  );
}
