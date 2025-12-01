# Sistema Kanban de Gestión de Candidatos

## 📋 Descripción

Sistema de tablero Kanban implementado para visualizar y gestionar candidatos en diferentes fases del proceso de entrevista. Permite arrastrar y soltar candidatos entre columnas para actualizar su estado.

## 🏗️ Arquitectura

### Estructura de Carpetas

```
frontend/src/
├── pages/
│   └── PositionKanban.tsx          # Página principal del Kanban
├── components/
│   └── kanban/
│       ├── KanbanBoard.tsx          # Tablero principal con DnD context
│       ├── KanbanColumn.tsx         # Columna individual (drop zone)
│       ├── CandidateCard.tsx        # Tarjeta de candidato (draggable)
│       └── KanbanHeader.tsx         # Encabezado con navegación
├── services/
│   ├── positionService.ts           # API para posiciones
│   └── candidateApiService.ts       # API para candidatos
├── hooks/
│   ├── usePositionKanban.ts         # Lógica de negocio del Kanban
│   └── useDragAndDrop.ts            # Lógica de drag & drop
├── factories/
│   ├── CandidateCardFactory.ts      # Factory para crear tarjetas
│   └── KanbanColumnFactory.ts       # Factory para crear columnas
├── types/
│   └── kanban.types.ts              # Tipos TypeScript
└── styles/
    └── kanban.css                   # Estilos responsive
```

## 🎯 Patrones de Diseño Implementados

### Factory Pattern
- **CandidateCardFactory**: Crea tarjetas de candidatos con validación y sanitización
- **KanbanColumnFactory**: Crea y gestiona columnas del tablero Kanban

### Custom Hooks
- **usePositionKanban**: Gestiona el estado y carga de datos del Kanban
- **useDragAndDrop**: Maneja la lógica de arrastrar y soltar

### Lazy Loading
- Componente `KanbanBoard` cargado bajo demanda para optimizar rendimiento

## 🔒 Seguridad

### Sanitización de Inputs
- Uso de `DOMPurify` para prevenir XSS
- Validación de tipos con TypeScript estricto
- Sanitización en `CandidateCardFactory`

### Validación
- Validación de candidatos antes de renderizar
- Validación de operaciones de drag & drop
- Manejo robusto de errores

## 📱 Responsive Design

### Breakpoints
- **Desktop** (> 1024px): Columnas horizontales con scroll
- **Tablet** (768px - 1024px): Columnas horizontales optimizadas
- **Mobile** (< 768px): Columnas verticales apiladas, ancho completo

### Características Mobile
- Touch events optimizados
- Delay de activación en touch (200ms)
- Columnas con altura adaptativa
- UI simplificada para pantallas pequeñas

## 🎨 Características

### Drag & Drop
- Biblioteca: `@dnd-kit` (moderna, accesible, performante)
- Soporte para mouse y touch
- Actualizaciones optimistas
- Revert automático en caso de error

### Visualización
- Estrellas para mostrar score promedio
- Contador de candidatos por columna
- Estados de carga y error
- Animaciones suaves

### Navegación
- Botón de retorno (←) a lista de posiciones
- Rutas con React Router
- Deep linking a posiciones específicas

## 🔌 API Endpoints Utilizados

### GET /positions/:id/interviewFlow
Obtiene las fases del proceso de entrevista

### GET /positions/:id/candidates
Obtiene todos los candidatos de una posición

### PUT /candidates/:id/stage
Actualiza la fase actual de un candidato

## 🚀 Uso

### Variables de Entorno
Crear archivo `.env` basado en `.env.example`:
```bash
REACT_APP_API_URL=http://localhost:3010
```

### Navegación
1. Lista de posiciones: `/positions`
2. Kanban de una posición: `/position/:id`
3. Clic en "Ver proceso" para acceder al Kanban

### Operaciones
- **Arrastrar candidato**: Click/touch + drag a columna destino
- **Volver**: Click en botón ← o navegación del navegador
- **Reintentar**: En caso de error, botón "Retry"

## 🎯 Best Practices Implementadas

### KISS (Keep It Simple)
- Componentes simples y enfocados
- Separación clara de responsabilidades
- Lógica de negocio en custom hooks

### DRY (Don't Repeat Yourself)
- Factories para creación consistente
- Hooks reutilizables
- Funciones helper centralizadas

### Clean Code
- Nombres descriptivos
- Comentarios JSDoc
- Tipado estricto con TypeScript
- Código formateado consistentemente

### Performance
- Lazy loading de componentes pesados
- Actualizaciones optimistas
- Memoización donde es necesario
- Sensors optimizados para DnD

### Accesibilidad
- Labels ARIA
- Focus styles para navegación con teclado
- Soporte para prefers-reduced-motion
- Texto alternativo y roles semánticos

## 🧪 Testing

Los componentes están preparados para testing con:
- React Testing Library
- Jest
- Tests unitarios de factories y hooks
- Tests de integración de componentes

## 📝 Notas de Desarrollo

### Dependencias Principales
- `@dnd-kit/core`: Drag & drop core
- `@dnd-kit/sortable`: Sortable lists
- `@dnd-kit/utilities`: Utilidades DnD
- `axios`: HTTP client
- `dompurify`: Sanitización XSS
- `react-router-dom`: Routing

### TypeScript
Tipado estricto en todos los archivos para mayor seguridad y autocompletado.

### CSS
Estilos modulares en `kanban.css` con media queries para responsive design.

## 🔄 Flujo de Datos

1. Usuario accede a `/position/:id`
2. `usePositionKanban` carga datos en paralelo:
   - Interview Flow (columnas)
   - Candidates (tarjetas)
3. Factories crean estructura del Kanban
4. Usuario arrastra tarjeta
5. `useDragAndDrop` actualiza estado local (optimistic)
6. Llama a API para persistir cambio
7. En caso de error, revierte cambios

## 🎓 Mejoras Futuras

- Tests automatizados completos
- Paginación de candidatos
- Filtros y búsqueda en Kanban
- Drag preview personalizado
- Historial de cambios
- Notificaciones en tiempo real
- Analytics de proceso de contratación
