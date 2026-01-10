#!/bin/bash
echo "🚀 Iniciando servicios..."

# Abrir nuevas pestañas de terminal para cada servicio
osascript -e 'tell application "Terminal"
    do script "cd '"$(pwd)"' && php artisan reverb:start"
end tell'

osascript -e 'tell application "Terminal"
    do script "cd '"$(pwd)"' && npm run dev"
end tell'

osascript -e 'tell application "Terminal"
    do script "cd '"$(pwd)"' && php artisan serve"
end tell'

echo "✅ Servicios iniciados en ventanas separadas"
echo ""
echo "📝 Servicios disponibles:"
echo "  - Laravel: http://localhost:8000"
echo "  - Reverb: ws://localhost:8080"
echo "  - Vite: http://localhost:5173"
echo ""
echo "🔐 Credenciales de prueba:"
echo "  Username: admin"
echo "  Password: admin123"
