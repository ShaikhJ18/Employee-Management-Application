from flask import Flask, render_template, request, redirect, url_for, session, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3
from flask_cors import CORS
import secrets
from datetime import datetime
from random import choice, randint

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])  # Replace with your frontend URL

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

@app.route('/deleteEmployee/<int:id>', methods=['DELETE'])
def delete_employee(id):
    conn = get_db()
    cursor = conn.cursor()
    
    # Delete the employee from the `employees` table by their ID
    cursor.execute('DELETE FROM employees WHERE id = ?', (id,))
    
    # Commit changes and close connection
    conn.commit()
    conn.close()

    return jsonify({"message": f"Employee with id {id} deleted successfully!"}), 200

@app.route('/getEmployeeDetails/<int:id>', methods=['GET'])
def get_employee_details(id):
    print(f"Fetching details for employee with id: {id}")  # Debugging line
    try:
        # Fetch the employee details from your database using the provided ID
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM employees WHERE id = ?", (id,))
        employee = cursor.fetchone()  # Use fetchone to get a single row
        
        conn.commit()
        conn.close()
        
        if employee:
            # Convert the tuple into a dictionary
            return jsonify({
                'id': employee[0],
                'name': employee[1],
                'position': employee[2],
                'gender': employee[3],
                'email': employee[4],
                'phone': employee[5],
                'address': employee[6],
                'emergency_contact': employee[7],
                'emergency_contact_phone': employee[8],
                'salary': employee[9],
                'hire_date': employee[10],
                'department': employee[11]
            })
        else:
            return jsonify({'error': 'Employee not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

@app.route('/addEmployee', methods=['POST'])
def add_employee():
    data = request.json  # Get JSON data from the request

    # Extract data from the request
    name = data.get('name')
    position = data.get('position')
    gender = data.get('gender')
    email = data.get('email')
    phone = data.get('phone')
    address = data.get('address')
    emergency_contact = data.get('emergencyContact')
    emergency_contact_phone = data.get('emergencyContactPhone')
    salary = data.get('salary')
    hire_date = data.get('hireDate')
    department = data.get('department')

    # Insert into the employees table
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO employees (
            name, position, gender, email, phone, address, emergency_contact, emergency_contact_phone, 
            salary, hire_date, department
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        name, position, gender, email, phone, address, emergency_contact, emergency_contact_phone, 
        salary, hire_date, department
    ))
    conn.commit()
    conn.close()

    return jsonify({"message": "Employee added successfully!"}), 201

@app.route('/getAllEmployees')
def getAllEmployees():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM employees')
    employees = cursor.fetchall()
    
    if not employees:  # Check if the list is empty
        return jsonify([])  # Return empty list if no employees are found
    
    # Convert the employee data to a list of dictionaries
    employee_list = [
        {"id": employee[0], "name": employee[1], "position": employee[2]}  # Assuming a basic schema
        for employee in employees
    ]
    
    return jsonify(employee_list)


# New route to fire all employees
@app.route('/fireAllEmployees', methods=['DELETE'])
def fireAllEmployees():
    # Connect to the database
    conn = get_db()
    cursor = conn.cursor()
    
    # Delete all employees from the `employees` table
    cursor.execute('DELETE FROM employees')
    conn.commit()

    # Fetch the updated list of employees (which will be empty)
    cursor.execute('SELECT * FROM employees')
    employees = cursor.fetchall()
    
    # Convert the employee data to a list of dictionaries
    employee_list = [
        {"id": employee[0], "name": employee[1], "position": employee[2]}  # Assuming a basic schema
        for employee in employees
    ]
    
    # Return the updated list of employees (empty list after firing all employees)
    return jsonify(employee_list)

if __name__ == '__main__':
    init_db()
    populate_lots(10)  # Populate some fake data
    app.run(debug=True)
