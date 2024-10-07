# Use an official Python runtime as the parent image
FROM python:3.8-slim

# Set the working directory in the container
WORKDIR /app

# Copy the producer directory contents into the container at /app
COPY ./ .

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt 

EXPOSE 6001
 
# Run producer.py when the container launches
CMD ["python", "./mymap.py"]
