from flask import Flask, jsonify, render_template, request, redirect, url_for
import geemap
import ee
import urllib.parse
import json
import os
from datetime import datetime

app = Flask(__name__)
# os.environ['EARTHENGINE_CREDENTIALS'] = '/ee_credentials'
# ee.Initialize()

service_account = 'landsatpulse@nasa-space-app-436223.iam.gserviceaccount.com'
credentials = ee.ServiceAccountCredentials(service_account, './service_key.json')
ee.Initialize(credentials)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/landsat_map')
def landsat_map():
    return render_template('landsat_map.html')

@app.route('/landsat-block')
def landsat_block():
    return render_template('landsat_block_map.html')

@app.route('/landsat-shape')
def landsat_shape():
    return render_template('landsat_shape_map.html')
 
def format_date(date_str):
    try:
        # Parse the date string to a datetime object
        date_obj = datetime.strptime(date_str, '%Y-%m-%dT%H:%M:%S.%fZ')
        # Format the datetime object back to a string in the desired format
        return date_obj.strftime('%Y-%m-%d')
    except ValueError:
        # If parsing fails, return a default date
        return '2024-01-01'

@app.route('/api/landsat')
def get_landsat_image():

    cloud = request.args.get('cloud', default=20, type=int)
    
    lat = request.args.get('lat', default=23.8103, type=float)
    lon = request.args.get('lon', default=90.4125, type=float)

        
    start_date = request.args.get('start_date', default='2024-01-01', type=str)
    end_date = request.args.get('end_date', default='2024-09-01', type=str)

    print(f"Start Date: {start_date}")
    print(f"End Date: {end_date}")

    # Format the dates
    start_date = format_date(start_date)
    end_date = format_date(end_date)
    
    landsat = request.args.get('landsat', default='landsat-9', type=str)

    both = False
    
    if landsat == 'landsat-8':
        landsat = "LC08"
    elif landsat == 'landsat-9':
        landsat = "LC09"
    elif landsat == 'both':
        both = True
        landsat = "LC09"
    else:
        landsat = "LC09"

    print(f"landsat: {landsat}")
    print(f"Cloud: {cloud}")
    print(f"Latitude: {lat}")
    print(f"Longitude: {lon}")
    print(f"Start Date: {start_date}")
    print(f"End Date: {end_date}")
    print(f"Landsat: {landsat}")
    
    # Load Landsat Surface Reflectance datasets (Collection 2, Level 2)
    if both:
        landsat8 = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2') \
            .filterDate(start_date, end_date) \
            .filter(ee.Filter.lt('CLOUD_COVER', cloud))

        landsat9 = ee.ImageCollection('LANDSAT/LC09/C02/T1_L2') \
            .filterDate(start_date, end_date) \
            .filter(ee.Filter.lt('CLOUD_COVER', cloud))

        dataset = landsat8.merge(landsat9)
    else:
        landsat_collection = f'LANDSAT/{landsat}/C02/T1_L2'
    
        landsat_images = ee.ImageCollection(landsat_collection) \
            .filterDate(start_date, end_date) \
            .filter(ee.Filter.lt('CLOUD_COVER', cloud))
        dataset =  landsat_images
        

    # Define the function to apply scale factors
    def apply_scale_factors(image):
        opticalBands = image.select('SR_B.').multiply(0.0000275).add(-0.2)
        thermalBands = image.select('ST_B.*').multiply(0.00341802).add(149.0)
        return image.addBands(opticalBands, None, True).addBands(thermalBands, None, True)

    # Apply the scaling function to the image collection
    dataset = dataset.map(apply_scale_factors)

    # Visualization parameters
    vis_params_true_color = {
        'bands': ['SR_B4', 'SR_B3', 'SR_B2'],  # Red, Green, Blue
        'min': 0.0,
        'max': 0.3
    }

    vis_params_false_color = {
        'bands': ['SR_B5', 'SR_B4', 'SR_B3'],  # Near Infrared, Red, Green
        'min': 0.0,
        'max': 0.3
    }

    # NDVI calculation and visualization parameters
    def calculate_ndvi(image):
        ndvi = image.normalizedDifference(['SR_B5', 'SR_B4']).rename('NDVI')
        return image.addBands(ndvi)

    dataset = dataset.map(calculate_ndvi)

    vis_params_ndvi = {
        'bands': ['NDVI'],
        'min': 0.0,
        'max': 1.0,
        'palette': ['blue', 'white', 'green']
    }

    # Example Land Cover classification visualization (using MODIS land cover dataset)
    landcover = ee.Image('MODIS/006/MCD12Q1/2020_01_01').select('LC_Type1')

    landcover_vis_params = {
        'min': 1,
        'max': 17,
        'palette': [
            '05450a', '086a10', '54a708', '78d203', '009900', 'c6b044', 'dcd159',
            'dade48', 'fbff13', 'b6ff05', '27ff87', 'c24f44', 'a5a5a5', 'ff6d4c',
            '69fff8', 'f9ffa4', '1c0dff'
        ]
    }

    # Create a map centered on the specified location
    Map = geemap.Map()
    Map.setCenter(lon, lat, 8) # Set center to the specified location

    # Add layers to the map
    Map.addLayer(dataset, vis_params_true_color, 'True Color (Landsat 8-9)')
    Map.addLayer(dataset, vis_params_false_color, 'False Color (Landsat 8-9)')
    Map.addLayer(dataset.select('NDVI'), vis_params_ndvi, 'NDVI (Landsat 8-9)')
    Map.addLayer(landcover, landcover_vis_params, 'Land Cover Classification')

    # Save the map as an HTML file
    map_html = 'templates/landsat_map.html'
    Map.to_html(filename=map_html, height="700px", width="100%")

    return redirect(url_for('landsat_map'))


@app.route('/api/landsat/block')
def get_landsat_block():
    # Get path and row from query parameters
    path = request.args.get('path', default=None, type=int)
    row = request.args.get('row', default=None, type=int)
    cloud = request.args.get('cloud', default=20, type=int)

    if path is None or row is None:
        return jsonify({"error": "Please provide both path and row query parameters."}), 400

    # Load Landsat 8 and 9 Surface Reflectance datasets (Collection 2, Level 2)
    landsat8 = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2') \
        .filter(ee.Filter.eq('WRS_PATH', path)) \
        .filter(ee.Filter.eq('WRS_ROW', row)) \
        .filterDate('2024-01-01', '2024-09-01') \
        .filter(ee.Filter.lt('CLOUD_COVER', cloud))

    landsat9 = ee.ImageCollection('LANDSAT/LC09/C02/T1_L2') \
        .filter(ee.Filter.eq('WRS_PATH', path)) \
        .filter(ee.Filter.eq('WRS_ROW', row)) \
        .filterDate('2024-01-01', '2024-09-01') \
        .filter(ee.Filter.lt('CLOUD_COVER', cloud))

    # Combine Landsat 8 and 9
    dataset = landsat8.merge(landsat9)

    # Define the function to apply scale factors
    def apply_scale_factors(image):
        opticalBands = image.select('SR_B.').multiply(0.0000275).add(-0.2)
        thermalBands = image.select('ST_B.*').multiply(0.00341802).add(149.0)
        return image.addBands(opticalBands, None, True).addBands(thermalBands, None, True)

    # Apply the scaling function to the image collection
    dataset = dataset.map(apply_scale_factors)

    # Visualization parameters for True Color
    vis_params_true_color = {
        'bands': ['SR_B4', 'SR_B3', 'SR_B2'],  # Red, Green, Blue
        'min': 0.0,
        'max': 0.3
    }

    # Visualization parameters for False Color
    vis_params_false_color = {
        'bands': ['SR_B5', 'SR_B4', 'SR_B3'],  # Near Infrared, Red, Green
        'min': 0.0,
        'max': 0.3
    }

    # NDVI calculation and visualization parameters
    def calculate_ndvi(image):
        ndvi = image.normalizedDifference(['SR_B5', 'SR_B4']).rename('NDVI')
        return image.addBands(ndvi)

    dataset = dataset.map(calculate_ndvi)

    vis_params_ndvi = {
        'bands': ['NDVI'],
        'min': 0.0,
        'max': 1.0,
        'palette': ['blue', 'white', 'green']
    }

    # Get the first image (least cloudy) from the filtered dataset
    image = dataset.first()

    if image is None:
        return jsonify({"error": "No image found for the provided path and row."}), 404

    # Create a map centered on the image footprint
    footprint = image.geometry().centroid().coordinates().getInfo()
    Map = geemap.Map()
    Map.setCenter(footprint[0], footprint[1], 8)  # Set center to the image centroid

    # Add layers to the map
    Map.addLayer(image, vis_params_true_color, 'True Color (Landsat Block)')
    Map.addLayer(image, vis_params_false_color, 'False Color (Landsat Block)')
    Map.addLayer(image.select('NDVI'), vis_params_ndvi, 'NDVI (Landsat Block)')

    # Save the map as an HTML file
    map_html = 'landsat_block_map.html'

    Map.to_html(filename=f'templates/{map_html}', height="700px", width="100%")

    return redirect(url_for('landsat_block'))


@app.route('/api/landsat/shape')
def get_landsat_shape():
    # Get GeoJSON data from query parameters
    geojson = request.args.get('geojson', default=None, type=str)
    if geojson:
        geojson = urllib.parse.unquote(geojson)
    
    cloud = request.args.get('cloud', default=20, type=int)

    if geojson is None:
        return jsonify({"error": "Please provide the 'geojson' parameter."}), 400

    # Load the GeoJSON geometry
    try:
        # Parse GeoJSON string and extract the geometry
        geojson_obj = json.loads(geojson)
        coordinates = geojson_obj['features'][0]['geometry']['coordinates']
        region = ee.Geometry.Polygon(coordinates)
    except Exception as e:
        return jsonify({"error": f"Invalid GeoJSON format: {str(e)}"}), 400

    # Load Landsat 8 and 9 Surface Reflectance datasets (Collection 2, Level 2)
    landsat8 = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2') \
        .filterBounds(region) \
        .filterDate('2024-01-01', '2024-09-01') \
        .filter(ee.Filter.lt('CLOUD_COVER', cloud))

    landsat9 = ee.ImageCollection('LANDSAT/LC09/C02/T1_L2') \
        .filterBounds(region) \
        .filterDate('2024-01-01', '2024-09-01') \
        .filter(ee.Filter.lt('CLOUD_COVER', cloud))

    # Combine Landsat 8 and 9
    dataset = landsat8.merge(landsat9)

    # Define the function to apply scale factors
    def apply_scale_factors(image):
        opticalBands = image.select('SR_B.').multiply(0.0000275).add(-0.2)
        thermalBands = image.select('ST_B.*').multiply(0.00341802).add(149.0)
        return image.addBands(opticalBands, None, True).addBands(thermalBands, None, True)

    # Apply the scaling function to the image collection
    dataset = dataset.map(apply_scale_factors)

    # Clip the image to the region defined by the GeoJSON
    dataset = dataset.map(lambda image: image.clip(region))

    # Visualization parameters for True Color
    vis_params_true_color = {
        'bands': ['SR_B4', 'SR_B3', 'SR_B2'],  # Red, Green, Blue
        'min': 0.0,
        'max': 0.3
    }

    # Visualization parameters for False Color
    vis_params_false_color = {
        'bands': ['SR_B5', 'SR_B4', 'SR_B3'],  # Near Infrared, Red, Green
        'min': 0.0,
        'max': 0.3
    }

    # NDVI calculation and visualization parameters
    def calculate_ndvi(image):
        ndvi = image.normalizedDifference(['SR_B5', 'SR_B4']).rename('NDVI')
        return image.addBands(ndvi)
    
    dataset = dataset.map(calculate_ndvi)

    vis_params_ndvi = {
        'bands': ['NDVI'],
        'min': 0.0,
        'max': 1.0,
        'palette': ['blue', 'white', 'green']
    }

    # Get the first image (least cloudy) from the filtered dataset
    image = dataset.first()

    if image is None:
        return jsonify({"error": "No image found for the provided region."}), 404

    # Create a map centered on the image region
    Map = geemap.Map()
    Map.centerObject(region, 8)  # Center map based on region

    # Add the clipped layer to the map
    Map.addLayer(image, vis_params_true_color, 'Clipped Landsat Image (True Color)')
    Map.addLayer(image, vis_params_false_color, 'Clipped Landsat Image (False Color)')
    Map.addLayer(image.select('NDVI'), vis_params_ndvi, 'Clipped Landsat Image (NDVI)')

    # Save the map as an HTML file
    map_html = 'landsat_shape_map.html'
    Map.to_html(filename=f'templates/{map_html}', height="700px", width="100%")

    return redirect(url_for('landsat_shape'))


 
if __name__ == '__main__':
    app.run(debug=True, port=6001)