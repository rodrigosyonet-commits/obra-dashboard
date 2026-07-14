import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard Ejecutivo de Obras",
  description: "Control Presupuestal de Obras",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        style={{
          margin: 0,
          padding: 0,
          minHeight: "100vh",
          backgroundColor: "#f4f6f8",
          fontFamily:
            '"Segoe UI", Inter, Arial, sans-serif',
          color: "#1f2937",
        }}
      >
        {children}
      </body>
    </html>
  );
}
