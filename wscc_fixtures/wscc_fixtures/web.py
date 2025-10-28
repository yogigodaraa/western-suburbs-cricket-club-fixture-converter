"""
Web interface for the WSCC Fixtures converter.
"""
import os
from flask import Flask, render_template, request, send_file, flash, redirect, url_for
from werkzeug.utils import secure_filename
from .converter import FixtureConverter

app = Flask(__name__)
app.secret_key = os.urandom(24)

# Configure upload folder
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
ALLOWED_EXTENSIONS = {'csv'}

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        if 'file' not in request.files:
            flash('No file selected')
            return redirect(request.url)
            
        file = request.files['file']
        if file.filename == '':
            flash('No file selected')
            return redirect(request.url)
            
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            input_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            output_filename = 'converted_' + filename
            output_path = os.path.join(app.config['UPLOAD_FOLDER'], output_filename)
            
            file.save(input_path)
            
            try:
                converter = FixtureConverter()
                converter.convert_file(input_path, output_path)
                
                # Clean up input file
                os.remove(input_path)
                
                return send_file(
                    output_path,
                    as_attachment=True,
                    download_name=output_filename,
                    mimetype='text/csv'
                )
            except Exception as e:
                flash(f'Error converting file: {str(e)}')
                return redirect(request.url)
            finally:
                # Clean up output file
                if os.path.exists(output_path):
                    os.remove(output_path)
        else:
            flash('Invalid file type. Please upload a CSV file.')
            return redirect(request.url)
            
    return render_template('upload.html')

def init_app():
    return app