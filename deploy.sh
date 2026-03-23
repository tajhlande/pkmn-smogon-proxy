#!/usr/bin/env bash

set -e

APP_NAME="pkmn-smogon-proxy"
COMPOSE_FILE="docker-compose.yml"

echo "Building $APP_NAME..."
docker compose build

echo "Stopping existing containers..."
docker compose down

echo "Starting $APP_NAME..."
docker compose up -d

echo "Waiting for health check..."
sleep 5

if docker compose ps | grep -q "Up"; then
  echo "✓ $APP_NAME is running"
  echo "  Health check: http://localhost:3000/health"
  echo "  Readiness: http://localhost:3000/ready"
else
  echo "✗ Failed to start $APP_NAME"
  docker compose logs
  exit 1
fi
