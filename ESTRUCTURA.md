# Estructura del Proyecto PetCast

Este proyecto sigue una **arquitectura modular basada en roles/dominios** para facilitar la escalabilidad y el mantenimiento.

## 📁 Estructura de Carpetas

```
src/
├── modules/              # Módulos por rol (autónomos)
│   ├── pet/             # Todo relacionado con mascotas
│   ├── owner/           # Todo relacionado con dueños
│   ├── vet/             # Todo relacionado con veterinarios
│   └── admin/           # Todo relacionado con administración
│
├── pages/               # Páginas de la aplicación
│   ├── auth/           # Páginas de autenticación
│   │   ├── Login.jsx
│   │   ├── ForgotPassword.jsx
│   │   └── VerifyCode.jsx
│   └── NotFound.jsx    # Página 404
│
├── shared/              # Código compartido entre módulos
│   ├── components/      # Componentes UI reutilizables (Button, Input, Card)
│   ├── hooks/           # Custom hooks globales
│   ├── services/        # Servicios compartidos (API, auth)
│   ├── context/         # Contextos globales de React
│   ├── utils/           # Funciones de utilidad
│   ├── constants/       # Constantes globales
│   └── types/           # Tipos/interfaces compartidos
│
└── assets/              # Recursos estáticos
```

## 🎯 Principios de Organización

### 1. **Módulos Autónomos**
Cada módulo (`pet`, `owner`, `vet`, `admin`) contiene:
- `components/` - Componentes específicos del módulo
- `hooks/` - Hooks específicos del módulo
- `services/` - Lógica de negocio y llamadas API
- `types/` - Tipos/interfaces del módulo
- `index.js` - Exportaciones públicas

**Regla:** Un módulo NO debe importar de otro módulo. Solo de `shared/`.

### 2. **Shared es para Código Reutilizable**
Solo coloca en `shared/` lo que:
- Se usa en **múltiples módulos**
- Es **genérico** (no pertenece a un dominio específico)

**Ejemplos:**
- ✅ `shared/components/Button.jsx` - Botón genérico
- ✅ `shared/hooks/useAuth.js` - Autenticación global
- ❌ `shared/components/PetCard.jsx` - Va en `modules/pet/`

### 3. **Importaciones Limpias**
Usa los archivos `index.js` para importaciones limpias:

```javascript
// ❌ Evitar
import PetCard from '@/modules/pet/components/PetCard';
import PetList from '@/modules/pet/components/PetList';

// ✅ Mejor
import { PetCard, PetList } from '@/modules/pet';
```

## 🚀 Cómo Empezar

### Crear un Componente en un Módulo

1. Crea el componente en `modules/[modulo]/components/`
2. Expórtalo en `modules/[modulo]/index.js`
3. Úsalo desde otros archivos

**Ejemplo:**
```javascript
// modules/pet/components/PetCard.jsx
export default function PetCard({ pet }) {
  return <div>{pet.name}</div>;
}

// modules/pet/index.js
export { default as PetCard } from './components/PetCard';

// Uso en App.jsx
import { PetCard } from '@/modules/pet';
```

### Crear un Hook Compartido

1. Crea el hook en `shared/hooks/`
2. Úsalo desde cualquier módulo

**Ejemplo:**
```javascript
// shared/hooks/useAuth.js
export function useAuth() {
  // lógica de autenticación
}

// Uso en cualquier módulo
import { useAuth } from '@/shared/hooks/useAuth';
```

## 📝 Convenciones

- **Componentes:** PascalCase (`PetCard.jsx`)
- **Hooks:** camelCase con prefijo `use` (`usePets.js`)
- **Services:** camelCase con sufijo `Service` (`petService.js`)
- **Constantes:** UPPER_SNAKE_CASE (`USER_ROLES`)
- **Utilidades:** camelCase (`formatDate.js`)

## 🔄 Flujo de Datos

```
Component (módulo) → Hook (módulo) → Service (módulo) → API (shared)
       ↓                                    ↓
   Context (shared)              shared/services/api.js
```

---

**Última actualización:** 2025-11-14
