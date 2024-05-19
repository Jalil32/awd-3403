| UWA ID   | Name           | GitHub Username |
|----------|----------------|-----------------|
| 22751096  | Jalil Inayat-Hussain    | Jalil32     |
| 22717638  | Janodi Weerasinghe    | oobiwanjanodi       |
| 23422132  | Markus Gopcevic | mighT77 |

# Project Name: Plating Perth

Web application for sharing and reviewing food in Perth.

## Getting Started

These instructions will get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Before you start, ensure you have the following installed:
- Python 3.x
- pip (Python package installer)
- Virtual environment (venv)
- Google Chrome (for Selenium tests)

### Installation

#### Setting Up a Virtual Environment

Create and activate a Python virtual environment to manage dependencies:

```bash
python3 -m venv venv
source venv/bin/activate
```

#### Installing Dependencies
```bash
pip install -r requirements.txt
```

#### Running Tests
To run the automated tests, follow these steps:
1. Set the Flask Environment for testing:
  ```bash
  export FLASK_ENV="testing"
  flask run
  ```
2. Open another terminal, ensure the virual environment is activated, and set the Flask environment variable again
3. Run the tests using pytest. Make sure Google Chrome is installed as Selenium will use it for browser-based tests:
  ```bash
  pytest
  ```
#### Running the Application
To run the application in development mode, follow these steps:
1. Exit testing mode by setting the Flask environment to none:
   ```bash
   export FLASK_ENV=None
   ```
2. Start the Flask application
   ```bash
   flask run
   ```
3. Navigate to url in output

#### External Libraries Used

1. **alembic==1.13.1**:
   - Alembic is a lightweight database migration tool for use with SQLAlchemy, allowing you to manage database schema changes.

2. **email_validator==2.1.1**:
   - Email Validator is a robust library to check the validity and deliverability of email addresses.

3. **Flask==3.0.3**:
   - Flask is a micro web framework for Python, providing tools, libraries, and technologies to build web applications.

4. **flask_jwt_extended==4.6.0**:
   - Flask-JWT-Extended is an extension for Flask that provides JSON Web Tokens (JWT) for authentication in your Flask applications.

5. **flask_login==0.6.3**:
   - Flask-Login is an extension that manages user sessions and provides tools for handling user authentication in Flask applications.

6. **flask_migrate==4.0.7**:
   - Flask-Migrate is an extension that handles SQLAlchemy database migrations for Flask applications using Alembic.

7. **flask_sqlalchemy==3.1.1**:
   - Flask-SQLAlchemy is an extension that adds SQLAlchemy support to Flask applications, providing ORM functionality.

8. **selenium==4.21.0**:
   - Selenium is a powerful tool for automating web browsers, widely used for testing web applications and scraping web content.

9. **SQLAlchemy==2.0.30**:
   - SQLAlchemy is a SQL toolkit and Object-Relational Mapping (ORM) library for Python, providing a full suite of tools for database interactions.

10. **Werkzeug==3.0.3**:
    - Werkzeug is a comprehensive WSGI web application library that powers Flask and provides utilities for web development.

11. **pytest==8.2.0**:
    - pytest is a testing framework for Python that makes it easy to write simple and scalable test cases.

12. **python-dotenv==1.0.1**:
    - python-dotenv is a library for loading environment variables from a `.env` file, allowing for easy configuration management.

   
