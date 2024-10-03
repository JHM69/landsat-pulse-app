# Python Server for Landsat Pulse (port 5000)

This project is a geospatial application built with Python, using `geemap`, `earthengine-api`, and `flask`. It allows you to create a web interface for handling geospatial data.

## Requirements

- Python version: `>= 3.5`
- Optionally uses Pipenv for environment management.

## Installation

You can run the project either using Pipenv or with `requirements.txt`. Follow the appropriate instructions based on your preference.

### Option 1: Using `requirements.txt`

If you prefer not to use Pipenv, you can install the dependencies with `pip`.

1. **Install dependencies**:

   ```bash
   pip install -r requirements.txt
   ```

2. **Run the application**:

   ```bash
   python mymap.py
   ```

### Option 2: Using Pipenv

1. **Install Pipenv** (if not already installed):

   ```bash
   pip install pipenv
   ```

2. **Install dependencies** using Pipenv:

   ```bash
   pipenv install
   ```

3. **Activate the virtual environment**:

   ```bash
   pipenv shell
   ```

4. **Run the application**:

   ```bash
   python mymap.py
   ```