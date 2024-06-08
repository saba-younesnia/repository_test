from flask import *
import sqlite3
import os

app = Flask(__name__)

app.config['DATABASE'] ='pr1.db'

if not os.path.exists('property_images'):
    os.makedirs('property_images')
def connect_db():
    db=getattr(g, '_database', None)
    if db is None:
        db=g._database=sqlite3.connect(app.config['DATABASE'])
    return db

def search_addresses(query):
    db=connect_db()
    cursor = db.cursor()
    cursor.execute("select property_address from properties WHERE property_address LIKE ?", ('%' + query + '%',))
    addresses = [row[0] for row in cursor.fetchall()]
    db.close()
    return addresses

@app.route('/',methods=["GET","POST"])
def index():
    return render_template('index.html')

@app.route('/search',methods=["GET","POST"])
def search():
    query = request.args.get('q', '')
    addresses = search_addresses(query)
    return jsonify(addresses)

@app.route('/add_post')
def add_post():
    return render_template('add_post.html')

@app.route('/post-property',methods=["POST"])
def post_property():
    property_type = request.form['propertyType']
    area = request.form['area']
    address = request.form['address']
    price = request.form['price']
    images = request.files.getlist('pictures')

    # Save property images to property_images directory
    image_paths = []
    for image in images:
        filename = image.filename
        filepath = os.path.join('property_images', filename)
        image.save(filepath)
        image_paths.append(filepath)

    # Save property data to the database
    db = connect_db()
    cursor = db.cursor()
    cursor.execute('''INSERT INTO properties (property_type, area, address, price, image_paths)
                          VALUES (?, ?, ?, ?, ?)''', (property_type, area, address, price, ','.join(image_paths)))
    db.commit()
    db.close()

    return jsonify({'message': 'Property posted successfully'})


if __name__ == '__main__':
    app.run()
