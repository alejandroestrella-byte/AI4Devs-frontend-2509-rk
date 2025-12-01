#!/bin/bash

# 🚀 Script de Verificación - Sistema Kanban
# Este script verifica que todos los archivos estén en su lugar

echo "🔍 Verificando implementación del Sistema Kanban..."
echo ""

# Función para verificar archivo
check_file() {
    if [ -f "$1" ]; then
        echo "✅ $1"
    else
        echo "❌ $1 - NO ENCONTRADO"
    fi
}

# Función para verificar directorio
check_dir() {
    if [ -d "$1" ]; then
        echo "✅ $1/"
    else
        echo "❌ $1/ - NO ENCONTRADO"
    fi
}

echo "📁 Verificando estructura de directorios..."
check_dir "src/types"
check_dir "src/services"
check_dir "src/factories"
check_dir "src/hooks"
check_dir "src/components/kanban"
check_dir "src/pages"
check_dir "src/styles"
echo ""

echo "📄 Verificando archivos TypeScript..."
check_file "src/types/kanban.types.ts"
check_file "src/services/positionService.ts"
check_file "src/services/candidateApiService.ts"
check_file "src/factories/CandidateCardFactory.ts"
check_file "src/factories/KanbanColumnFactory.ts"
check_file "src/hooks/usePositionKanban.ts"
check_file "src/hooks/useDragAndDrop.ts"
check_file "src/components/kanban/KanbanHeader.tsx"
check_file "src/components/kanban/CandidateCard.tsx"
check_file "src/components/kanban/KanbanColumn.tsx"
check_file "src/components/kanban/KanbanBoard.tsx"
check_file "src/pages/PositionKanban.tsx"
echo ""

echo "🎨 Verificando estilos..."
check_file "src/styles/kanban.css"
echo ""

echo "⚙️ Verificando configuración..."
check_file ".env"
check_file ".env.example"
echo ""

echo "📚 Verificando documentación..."
check_file "KANBAN_DOCUMENTATION.md"
check_file "QUICKSTART.md"
check_file "IMPLEMENTATION_SUMMARY.md"
echo ""

echo "📦 Verificando dependencias instaladas..."
if [ -f "package.json" ]; then
    echo "Verificando @dnd-kit/core..."
    if grep -q "@dnd-kit/core" package.json; then
        echo "✅ @dnd-kit/core"
    else
        echo "❌ @dnd-kit/core - NO INSTALADO"
    fi
    
    echo "Verificando @dnd-kit/sortable..."
    if grep -q "@dnd-kit/sortable" package.json; then
        echo "✅ @dnd-kit/sortable"
    else
        echo "❌ @dnd-kit/sortable - NO INSTALADO"
    fi
    
    echo "Verificando axios..."
    if grep -q "axios" package.json; then
        echo "✅ axios"
    else
        echo "❌ axios - NO INSTALADO"
    fi
    
    echo "Verificando dompurify..."
    if grep -q "dompurify" package.json; then
        echo "✅ dompurify"
    else
        echo "❌ dompurify - NO INSTALADO"
    fi
fi
echo ""

echo "🔧 Verificando TypeScript..."
npm run build --dry-run 2>&1 | grep -q "error" && echo "❌ Errores de TypeScript encontrados" || echo "✅ Sin errores de TypeScript"
echo ""

echo "✨ Verificación completada!"
echo ""
echo "Para iniciar el proyecto:"
echo "  1. Terminal 1: cd backend && npm run dev"
echo "  2. Terminal 2: cd frontend && npm start"
echo "  3. Abrir: http://localhost:3000"
