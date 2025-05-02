#!/bin/bash

# Stop the containers
echo "Stopping application containers..."
sudo docker-compose down

# Start local PostgreSQL if needed
echo "Starting local PostgreSQL service..."
sudo systemctl start postgresql

echo "Application containers stopped and local PostgreSQL service started."

