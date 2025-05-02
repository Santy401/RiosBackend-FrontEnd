#!/bin/bash

# Stop local PostgreSQL
echo "Stopping local PostgreSQL..."
sudo systemctl stop postgresql

# Stop any running containers and remove volumes
echo "Cleaning up existing containers..."
sudo docker-compose down --volumes

# Start the containers
echo "Starting application containers..."
sudo docker-compose up -d

# Show the logs
echo "Showing container logs (Ctrl+C to exit logs, containers will keep running)..."
sudo docker-compose logs -f

