
# Landsat Data Comparison Application

## Project Description

The Landsat Data Comparison Application is designed to bridge the gap between ground-based observations and satellite data for environmental monitoring and research. This application allows users to easily define locations, visualize satellite data, set up notifications for upcoming satellite overpasses, and compare satellite data with ground measurements. It's an ideal tool for researchers, educators, and citizen scientists, offering data visualization, export options, and real-time alerts to support informed decision-making and collaborative research.

## Video : https://drive.google.com/file/d/1iRjHbdTTjogZft_WbhIVgphISiVvJ5M9/view

Key features include:
- Multi-modal location selection (place name, latitude/longitude, map selection)
- Overpass notifications based on cloud cover and user preferences
- Access to Landsat data and comparisons with ground observations
- Tools for spectral data visualization and export capabilities
- Integration with additional datasets like Sentinel-2 for deeper analysis

## Technology Stack

- **Frontend**: Next.js with trpc for client-server communication
- **Backend**: Node.js with Prisma ORM
- **Python Server**: Flask API for handling specific map data processing
- **Data Sources**: NASA's Landsat, USGS Earth Explorer, Google Earth Engine

## How to Run the Application

### Prerequisites
Ensure the following are installed on your machine:
- Node.js
- Python 3.x
- PostgreSQL (for database)

### Backend Setup

1. **Clone the repository**:
   ```bash
   git clone landsat-pulse-app
   ```

2. **Set up environment variables**:
   Create a `.env` file in the project root directory, and add the necessary environment variables for database, API keys, and other secrets.

3. **Install dependencies**:
   Run the following commands to install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

4. **Database setup**:
   Ensure PostgreSQL is running. Set up Prisma and migrate the schema:
   ```bash
   npx prisma migrate dev
   ```

5. **Run the backend**:
   Start the backend server:
   ```bash
   npm run dev
   ```

### Python Server Setup

1. **Navigate to the Python server directory**:
   ```bash
   cd python-server
   ```

2. **Create a virtual environment and install dependencies**:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # For Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Run the Flask server**:
   ```bash
   python mymap.py
   ```

### Frontend Setup

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install frontend dependencies**:
   ```bash
   npm install
   ```

3. **Run the frontend**:
   Start the Next.js frontend application:
   ```bash
   npm run dev
   ```

### Accessing the Application

Once all services are running:
- Open the frontend in your browser at `http://localhost:3000`.
- Ensure the Flask server is running and accessible at the specified Python server port.

Enjoy using the Landsat Data Comparison Application!

---
 
