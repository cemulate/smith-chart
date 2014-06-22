import os
from flask import Flask

app = Flask(__name__)

@app.route('/')
def index():
    return open('index.html', 'rb').read()
    
if __name__ == '__main__':
    app.run('127.0.0.1', 8000, True)