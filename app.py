from flask import Flask, render_template, request, redirect, url_for, session
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3
import secrets
from datetime import datetime
from random import choice, randint

app = Flask(__name__)
app.secret_key = secrets.token_hex(128)

# Database setup
DATABASE = 'employees.db'

def get_db():
    conn = sqlite3.connect(DATABASE)
    return conn


def init_db():
    with get_db() as conn:
        conn.execute('''
            CREATE TABLE IF NOT EXISTS employees (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                position TEXT NOT NULL,
                gender TEXT NOT NULL,
                email TEXT NOT NULL,
                phone TEXT NOT NULL,
                address TEXT NOT NULL,
                emergency_contact TEXT NOT NULL,
                emergency_contact_phone TEXT NOT NULL,
                salary REAL NOT NULL,
                hire_date TEXT NOT NULL,
                department TEXT NOT NULL
            )
        ''')
        # Create users table
        conn.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL
            )
        ''')

def test_with_fake_data():
    # Fake data for testing
    names = ["John Smith", "Alice Johnson", "Bob Brown", "Emily White", "Michael Green"]
    positions = ["Software Engineer", "HR Manager", "Product Manager", "Designer", "Data Analyst"]
    genders = ["Male", "Female", "Other"]
    departments = ["Engineering", "HR", "Marketing", "Sales", "Finance"]
    
    # Randomly generate fake data
    name = choice(names)
    position = choice(positions)
    gender = choice(genders)
    email = f"{name.replace(' ', '').lower()}@example.com"
    salary = round(randint(40000, 120000) + randint(0, 99) / 100, 2)  # Random salary between 40,000 to 120,000
    hire_date = datetime.now().strftime('%Y-%m-%d')
    department = choice(departments)
    
    # Emergency contact and phone for fake data
    emergency_contact = f"{name} Emergency"
    emergency_contact_phone = f"+1-{randint(100, 999)}-{randint(1000000, 9999999)}"
    
    phone = f"+1-{randint(100, 999)}-{randint(1000000, 9999999)}"
    address = f"1234 {choice(['Elm St', 'Oak St', 'Maple Ave', 'Pine Blvd'])}, Cityville, State {randint(1000, 9999)}"
    
    # Open a database connection
    conn = get_db()
    cursor = conn.cursor()

    # Insert the fake data into the `employees` table
    cursor.execute('''
        INSERT INTO employees (
            name, position, gender, email, phone, address, emergency_contact, emergency_contact_phone, 
            salary, hire_date, department
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        name, position, gender, email, phone, address, emergency_contact, emergency_contact_phone, 
        salary, hire_date, department
    ))
    
    # Commit the transaction
    conn.commit()

    # Close the connection
    conn.close()

    print("Fake employee data added successfully!")

def populate_lots(amount: int):
    for i in range(amount):
        test_with_fake_data()

# Route for sign-up
@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        confirm_password = request.form['confirm_password']

        # Check if passwords match
        if password != confirm_password:
            return "Passwords do not match", 400

        # Check if the username is already taken
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM users WHERE username = ?', (username,))
        existing_user = cursor.fetchone()
        if existing_user:
            return "Username already taken", 400
        
        # Hash the password for security
        hashed_password = generate_password_hash(password)

        # Store the new user in the database
        conn.execute('INSERT INTO users (username, password) VALUES (?, ?)', (username, hashed_password))
        conn.commit()

        # Redirect to sign-in page after successful registration
        return redirect(url_for('signin'))

    return render_template('signup.html')

# Route to fire all employees (delete all employees and reset the database)
@app.route('/fire_all_employees', methods=['GET'])
def fire_all_employees():
    conn = get_db()
    cursor = conn.cursor()
    
    # Drop the employees table to reset it
    cursor.execute("DROP TABLE IF EXISTS employees")
    
    # Recreate the table with the correct schema
    init_db()
    
    conn.commit()
    return redirect(url_for('index'))

@app.route('/')
def landing():
    if 'user_id' in session:
        # If the user is already logged in, redirect them to the employee directory (or dashboard)
        return redirect(url_for('index'))
    else:
        # If the user is not logged in, show the sign-up page
        return redirect(url_for('signup'))
@app.route('/index')
def index():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM employees')
    employees = cursor.fetchall()
    return render_template('index.html', employees=employees)

# Route for sign-in (login)
@app.route('/signin', methods=['GET', 'POST'])
def signin():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM users WHERE username = ?', (username,))
        user = cursor.fetchone()

        if user and check_password_hash(user[2], password):  # Check hashed password
            session['user_id'] = user[0]  # Store user ID in session
            return redirect(url_for('index'))  # Redirect to the employee directory
        else:
            return "Invalid username or password", 401

    return render_template('signin.html')
# Route to add a new employee
@app.route('/add', methods=['GET', 'POST'])
def add_employee():
    if request.method == 'POST':
        name = request.form['name']
        position = request.form['position']
        gender = request.form['gender']
        email = request.form['email']
        phone = request.form['phone']
        address = request.form['address']
        emergency_contact = request.form['emergency_contact']
        emergency_contact_phone = request.form['emergency_contact_phone']
        salary = float(request.form['salary'])
        hire_date = request.form['hire_date']
        department = request.form['department']
        
        conn = get_db()
        conn.execute('''
            INSERT INTO employees (name, position, gender, email, phone, address, emergency_contact, emergency_contact_phone, salary, hire_date, department)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (name, position, gender, email, phone, address, emergency_contact, emergency_contact_phone, salary, hire_date, department))
        conn.commit()
        return redirect(url_for('index'))
    
    return render_template('add_employee.html')


@app.route('/edit/<int:id>', methods=['GET', 'POST'])
def edit_employee(id):
    conn = get_db()
    
    if request.method == 'POST':
        name = request.form['name']
        position = request.form['position']
        gender = request.form['gender']
        email = request.form['email']
        phone = request.form['phone']
        address = request.form['address']
        emergency_contact = request.form['emergency_contact']
        emergency_contact_phone = request.form['emergency_contact_phone']
        salary = float(request.form['salary'])
        hire_date = request.form['hire_date']
        department = request.form['department']
        
        conn.execute('''
            UPDATE employees SET 
                name = ?, position = ?, gender = ?, email = ?, phone = ?, address = ?, 
                emergency_contact = ?, emergency_contact_phone = ?, salary = ?, hire_date = ?, department = ? 
            WHERE id = ?
        ''', (name, position, gender, email, phone, address, emergency_contact, emergency_contact_phone, salary, hire_date, department, id))
        conn.commit()
        return redirect(url_for('index'))
    
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM employees WHERE id = ?', (id,))
    employee = cursor.fetchone()
    return render_template('edit_employee.html', employee=employee)

# Route to delete an employee
@app.route('/delete/<int:id>')
def delete_employee(id):
    conn = get_db()
    conn.execute('DELETE FROM employees WHERE id = ?', (id,))
    conn.commit()
    return redirect(url_for('index'))

if __name__ == '__main__':
    init_db()
    populate_lots(10)
    app.run(debug=True)
