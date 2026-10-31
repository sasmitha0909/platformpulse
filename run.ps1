# PlatformPulse One-Click Launch Script (Windows PowerShell)
Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host "  PlatformPulse: Control Tower for Internal Data & IT Teams" -ForegroundColor White
Write-Host "  Hackathon Track: The Work Behind the Work (Powered by Exasol)" -ForegroundColor Yellow
Write-Host "==================================================================" -ForegroundColor Cyan

# 1. Check Python
Write-Host "[1/4] Checking Python environment..." -ForegroundColor Green
python --version

# 2. Run Database Seeder
Write-Host "[2/4] Seeding Exasol database..." -ForegroundColor Green
python backend/seed.py

# 3. Start Backend in background
Write-Host "[3/4] Launching FastAPI Backend on http://127.0.0.1:8000..." -ForegroundColor Green
Start-Process -FilePath "python" -ArgumentList "-m uvicorn backend.main:app --host 127.0.0.1 --port 8000" -WindowStyle Hidden

# 4. Start Frontend
Write-Host "[4/4] Launching React Frontend on http://127.0.0.1:5173..." -ForegroundColor Green
Set-Location platformpulse
npm run dev -- --host 127.0.0.1 --port 5173
