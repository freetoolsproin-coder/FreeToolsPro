@echo off
cd /d "%~dp0"
title FreeToolsPro dev server
where node >nul 2>nul || (echo Node.js is not installed. Get it from https://nodejs.org & pause & exit /b 1)
if not exist node_modules\lucide-react (
  echo Installing dependencies, this takes a minute...
  call npm install || (echo npm install failed. & pause & exit /b 1)
)
echo Starting http://localhost:4321
call npm run dev
pause
