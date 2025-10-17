#!/usr/bin/env python3

import os
from pyftpdlib.authorizers import DummyAuthorizer
from pyftpdlib.handlers import FTPHandler
from pyftpdlib.servers import FTPServer

def main():
    # Create authorizer
    authorizer = DummyAuthorizer()
    
    # Add user with full permissions
    authorizer.add_user('deploy', 'upload123', os.getcwd(), perm='elradfmwMT')
    
    # Create FTP handler
    handler = FTPHandler
    handler.authorizer = authorizer
    
    # Create server
    server = FTPServer(('0.0.0.0', 2121), handler)
    
    print("🚀 FTP Server starting...")
    print("📍 Server: 0.0.0.0:2121")
    print("👤 Username: deploy")
    print("🔑 Password: upload123")
    print("📁 Directory: Current project folder")
    print("⏹️  Press Ctrl+C to stop")
    print("-" * 50)
    
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 FTP Server stopped")
        server.close_all()

if __name__ == "__main__":
    main()
