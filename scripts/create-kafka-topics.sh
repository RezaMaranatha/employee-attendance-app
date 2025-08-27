#!/bin/bash

echo "Creating Kafka topics..."

# Wait for Kafka to be ready
echo "Waiting for Kafka to be ready..."
docker-compose exec kafka cub kafka-ready -b localhost:9092 1 30

# Create the user-data-changes topic
echo "Creating topic: user-data-changes"
docker-compose exec kafka kafka-topics \
  --create \
  --if-not-exists \
  --bootstrap-server localhost:9092 \
  --topic user-data-changes \
  --partitions 1 \
  --replication-factor 1

# List all topics
echo "Listing all topics:"
docker-compose exec kafka kafka-topics \
  --list \
  --bootstrap-server localhost:9092

echo "Kafka topics setup complete!"
