@echo off
setlocal
cd /d "%~dp0"

where npm >nul 2>nul
if errorlevel 1 (
  echo Node.js and npm were not found.
  echo Install a current Node.js LTS release, then run this file again.
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo Installing project dependencies...
  call npm install
  if errorlevel 1 goto :error
)

echo Starting the portfolio...
echo Keep this window open while viewing the site.
call npm start
exit /b %errorlevel%

:error
echo.
echo The portfolio could not be started. Review the error above.
pause
exit /b 1
