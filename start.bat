@echo off
echo ===================================================
echo     Starting Nyay Mitra AI Application
echo ===================================================
echo.

echo [1/2] Starting FastAPI Backend on Port 8000...
start "Nyay Mitra Backend" cmd /k "cd /d "%~dp0fastapi_engine" && call venv\Scripts\activate && uvicorn main:app --host 127.0.0.1 --port 8000 --reload"

echo [2/2] Starting Next.js Frontend on Port 3005...
start "Nyay Mitra Frontend" cmd /k "cd /d "%~dp0" && npm run dev -- --port 3005"

echo.
echo All services are launching in separate windows!
echo Frontend will be available at: http://localhost:3005
echo Backend API is running at: http://localhost:8000
echo.
pause
