from http.server import BaseHTTPRequestHandler
import json
class handler(BaseHTTPRequestHandler):
  def do_GET(self):
    data=[{"concepto":"Tramites","presupuesto":200000,"utilizado":125000,"porcentaje":62.5,"estado":"NARANJA"}]
    self.send_response(200); self.end_headers(); self.wfile.write(json.dumps(data).encode())
