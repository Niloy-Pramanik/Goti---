#!/bin/bash
echo "Starting Goti Backend (Spring Boot) and Frontend (Vite)..."

# Start the Spring Boot backend in the background
cd backend
./mvnw spring-boot:run &
BACKEND_PID=$!
cd ..

# Start the Vite frontend in the background
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo "Services are starting! Press [CTRL+C] to stop both."

# Trap CTRL+C and kill both processes
trap "kill $BACKEND_PID $FRONTEND_PID; exit" SIGINT SIGTERM

# Wait indefinitely so the script stays alive
wait $BACKEND_PID $FRONTEND_PID
