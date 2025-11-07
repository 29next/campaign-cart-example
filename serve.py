#!/usr/bin/env python3
"""
Simple HTTP server that automatically opens the browser.
"""
import http.server
import socketserver
import webbrowser
import sys
from pathlib import Path

PORT = 8000
HOST = 'localhost'

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(Path(__file__).parent), **kwargs)

def main():
    try:
        with socketserver.TCPServer((HOST, PORT), Handler) as httpd:
            url = f"http://{HOST}:{PORT}/landing.html"
            print(f"Starting server at {url}")
            print("Opening browser...")
            webbrowser.open(url)
            print("Server running. Press Ctrl+C to stop.")
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
        sys.exit(0)
    except OSError as e:
        if e.errno == 48:  # Address already in use
            print(f"Error: Port {PORT} is already in use.")
            print(f"Please stop the other server or use a different port.")
        else:
            print(f"Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
