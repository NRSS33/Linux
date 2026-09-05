@echo off
cd /d "%~dp0"
git add -A
git commit -m "Update notes" 2>nul
git push
echo.
echo Done! Site updates in about 1 minute.
pause
