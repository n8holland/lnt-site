#!/usr/bin/env bash
cd "$(dirname "$0")"
PORT="${1:-8080}"
echo "Late Nite Takeout → http://127.0.0.1:${PORT}/"
echo "Press Ctrl+C to stop."
exec python3 -m http.server "$PORT" --bind 127.0.0.1
