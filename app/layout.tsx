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
      <body>
        {children}
      </body>
    </html>
  );
}
