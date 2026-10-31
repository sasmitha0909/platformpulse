#!/usr/bin/env bash
set -e

echo "=================================================================="
echo "  PlatformPulse: Control Tower for Internal Data & IT Teams"
echo "  Hackathon Track: The Work Behind the Work (Powered by Exasol)"
echo "=================================================================="

# 1. Seed Database
echo "[1/3] Seeding Exasol database..."
python3 backend/seed.py

# 2. Start Backend API in background
echo "[2/3] Launching FastAPI Backend on http://127.0.0.1:8000..."
uvicorn backend.main:app --host 127.0.0.1 --port 8000 &

# 3. Start Frontend
echo "[3/3] Launching React Frontend on http://127.0.0.1:5173..."
cd platformpulse && npm run dev -- --host 127.0.0.1 --port 5173
