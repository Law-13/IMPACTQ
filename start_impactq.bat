@echo off
title ImpactQ Launcher
echo ===================================================
echo               ImpactQ Platform Launcher            
echo ===================================================
echo.

:: 1. Start Backend (FastAPI)
echo [1/3] Launching FastAPI Backend on http://localhost:8000...
start "ImpactQ Backend" cmd /k "cd backend && python -m uvicorn app.main:app --port 8000 --reload"

:: 2. Start Frontend (Next.js)
echo [2/3] Launching Next.js Frontend on http://localhost:3000...
start "ImpactQ Frontend" cmd /k "cd frontend && npm run dev"

:: 3. Wait a moment for Next.js to compile/initialize
echo [3/3] Waiting for servers to initialize...
timeout /t 3 /nobreak > nul

:: 4. Open default browser
echo Opening browser to http://localhost:3000...
start http://localhost:3000

echo.
echo ===================================================
echo Done! Both services are running in separate windows.
echo To stop them, simply close the other two command prompt windows.
echo ===================================================
echo.
pause
