from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from config import settings
from openai_client import OpenAIClient
from csv_handler import CSVHandler

# Initialise the Flask app
app = Flask(__name__)
app.secret_key = 'generalassembly'

# Load configuration from settings.py
app.config.from_object(settings)

# Initialise OpenAIClient and CSVHandler
openai_client = OpenAIClient()
csv_handler = CSVHandler()

# Route for the homepage
@app.route('/')
def index():
    return render_template('index.html')

# Route for adding words to a new Vocabulary List
@app.route('/addwords', methods=['GET', 'POST'])
def add_words():
    if 'list_name' not in session or not session['list_name']:
        session['list_name'] = request.args.get('list', '')
        session.modified = True  # Explicitly mark the session as modified
    
    print(f"List name from addwords at start of function: {session.get('list_name', 'Not set')}")
    count = request.args.get('count', 1, type=int)

    if request.method == 'POST':
        words = request.form.getlist('word')
        
        if words:
            try:
                print(f"List name before generating definitions: {session.get('list_name', 'Not set')}")
                definitions = openai_client.generate_definitions(words)
                print(f"List name before writing CSV: {session.get('list_name', 'Not set')}")
                csv_handler.write_csv(session['list_name'], definitions)
                print(f"List name after writing CSV: {session.get('list_name', 'Not set')}")
                
                return redirect(url_for('review_definitions'))
            except Exception as e:
                print(f"Error occurred. List name: {session.get('list_name', 'Not set')}")
                return jsonify({'error': str(e)}), 400
        else:
            return jsonify({'error': "No words were provided."}), 400

    # If it's a GET request, just render the form
    return render_template('vocabularylist/addwords.html', list_name=session.get('list_name', ''), count=count)

# Route for creating Vocabulary Lists
@app.route('/listcreate', methods=['GET', 'POST'])
def list_create():
    return render_template('vocabularylist/listcreate.html')

# Route to view all Vocabulary Lists
@app.route('/lists')
def lists():
    return render_template('vocabularylist/lists.html')

# Route to view all Vocabulary Lists
@app.route('/worddefinition')
def word_definition():
    return render_template('vocabularylist/worddefinition.html')

# Route to view all Vocabulary Lists
@app.route('/reviewdefinitions')
def review_definitions():
    return render_template('vocabularylist/reviewdefinitions.html')

# Route for starting a game
@app.route('/gamestart')
def game_start():
    return render_template('wordsup/gamestart.html')

# Run the application
if __name__ == '__main__':
    app.run(debug=True)
