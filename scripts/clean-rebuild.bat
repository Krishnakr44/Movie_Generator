@echo off
REM Run this script AFTER closing Cursor/VS Code and any dev servers.
REM Fixes EBUSY, missing tailwindcss, and corrupted node_modules.
REM Run from project root: scripts\clean-rebuild.bat

cd /d "%~dp0.."

echo Cleaning .next and node_modules...
if exist .next rmdir /s /q .next
if exist node_modules rmdir /s /q node_modules

echo Installing dependencies...
call npm install
if errorlevel 1 (
  echo npm install failed. Make sure no other app is using node_modules.
  pause
  exit /b 1
)

echo Patching Next.js build-id...
node scripts\patch-next-build-id.js

echo Building...
call npm run build
if errorlevel 1 (
  echo Build failed.
  pause
  exit /b 1
)

echo Build succeeded.
pause
