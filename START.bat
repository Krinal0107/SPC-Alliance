@echo off
echo.
echo  ====================================
echo   SPC Alliance — Starting Both Apps
echo  ====================================
echo.

echo [1/2] Installing backend packages...
cd backend
call npm install
cd ..

echo.
echo [2/2] Installing frontend packages...
cd frontend
call npm install
cd ..

echo.
echo  Starting Backend on http://localhost:8000
echo  Starting Frontend on http://localhost:3000
echo.
echo  Open http://localhost:3000 in your browser!
echo.

start cmd /k "cd backend && npm run dev"
start cmd /k "cd frontend && npm run dev"

echo Both apps are starting in separate windows!
pause
