import http.server
import socketserver
import webbrowser
import socket
import os

# Change to the form directory
os.chdir(r'D:\faculty_data_form')

# Get local IP address
hostname = socket.gethostname()
local_ip = socket.gethostbyname(hostname)

PORT = 8000

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

# Start server
with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
    print(f"Server running at:")
    print(f"Local: http://localhost:{PORT}")
    print(f"Network: http://{local_ip}:{PORT}")
    print(f"\nShare this link: http://{local_ip}:{PORT}")
    print("Press Ctrl+C to stop server")
    
    # Open browser
    webbrowser.open(f'http://localhost:{PORT}')
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped")