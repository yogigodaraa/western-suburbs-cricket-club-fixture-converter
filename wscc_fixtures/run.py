"""
Run the web application.
"""
from wscc_fixtures.web import init_app

if __name__ == '__main__':
    app = init_app()
    app.run(debug=True)