from http.server import BaseHTTPRequestHandler
import os
import requests
import json

URL = "https://getpost-dot-facturanube.appspot.com/getpost"

QUERY = """
SELECT
    C.cliente,
    C.razonSocial,
    D.renglon,
    D.producto,
    D.cantidad,
    D.descripcion,
    D.costo,
    D.valorUnitario,
    D.subtotalPresupuestado,
    C.mes
FROM DbContrato AS C
INNER JOIN DbContratoDet AS D
ON D.empresa = C.empresa
AND D.sucursal = C.sucursal
AND D.folioContrato = C.folioContrato
WHERE
    C.empresa = @empresa
AND C.sucursal = @sucursal
TAMPAG 500
"""

class handler(BaseHTTPRequestHandler):

    def do_GET(self):

        params = {
            "tipo": 3,
            "emp": os.getenv("FACTURANUBE_EMP"),
            "suc": os.getenv("FACTURANUBE_SUC"),
            "usu": os.getenv("FACTURANUBE_USU"),
            "pas": os.getenv("FACTURANUBE_PASSWORD"),
            "cns": QUERY
        }

        response = requests.post(
            URL,
            data=params,
            timeout=60
        )

        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.end_headers()

        self.wfile.write(
            json.dumps({
                "status": response.status_code,
                "raw": response.text
            }).encode()
        )
