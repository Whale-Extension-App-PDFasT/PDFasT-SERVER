from flask import Flask, render_template,request
from requests_toolbelt import MultipartDecoder
from flask_cors import CORS
app = Flask(__name__)

CORS(app)
@app.route('/', methods=["POST"])
def index():
	test = request.form['test']
	#print(test)
	return render_template('index4.html',test=test)

if __name__ == '__main__':
	app.run(debug = True, host="0.0.0.0")
