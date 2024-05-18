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

#### Runnint Tests
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


   
