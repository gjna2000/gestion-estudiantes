# gestion-estudiantes
# 📚 Sistema de Gestión Estudiantil

Sistema web para gestión académica con sistema de recomendaciones inteligentes basado en el rendimiento de los estudiantes.

## 👥 Equipo de Desarrollo

| Rol | Nombre | Responsabilidades |
|-----|--------|-------------------|
| **Líder de Proyecto** | [Gonzalo Javier Niño amaris] | Coordinación, diseño, testing, documentación |
| **Frontend Developer** | [Jorge Sebastian Ortiz Humo] | Interfaces, componentes React, formularios |
| **Backend Developer** | [Miller Marlow Martinez Martinez] | Firebase, lógica, base de datos, autenticación |

## 🎯 Objetivo del Proyecto

Crear una plataforma web que permita a estudiantes:
- Registrar sus materias y notas
- Visualizar su rendimiento académico
- Recibir alertas sobre materias en riesgo
- Obtener recomendaciones de estudio personalizadas

## 🛠️ Tecnologías

- **Frontend:** React + Vite
- **Backend:** Firebase (Authentication + Firestore)
- **Lenguaje:** JavaScript
- **Estilos:** CSS inline (primera fase)
- **Control de versiones:** Git + GitHub

## 📁 Estructura del Proyecto
```
gestion-estudiantes/
├── frontend/              # Aplicación React (Estudiante 1 y 2)
│   ├── src/
│   │   ├── components/   # Componentes reutilizables
│   │   ├── pages/        # Páginas completas
│   │   ├── services/     # Conexión Firebase
│   │   └── utils/        # Funciones auxiliares
│   └── package.json
│
├── docs/                 # Documentación del proyecto (Estudiante 3)
│   ├── DISEÑO.md        # Guía de diseño y colores
│   ├── TAREAS.md        # Distribución de tareas
│   ├── PRUEBAS.md       # Plan de pruebas y bugs
│   └── REPORTES.md      # Reportes semanales
│
└── README.md            # Este archivo
```

## 🚀 Funcionalidades

### Fase 1 (Semanas 1-2)
- [x] Configuración inicial del proyecto
- [ ] Sistema de autenticación (login/registro)
- [ ] Perfil de estudiante
- [ ] Registro de materias y notas

### Fase 2 (Semanas 3-4)
- [ ] Dashboard con estadísticas
- [ ] Sistema de alertas automáticas
- [ ] Cálculo de promedios
- [ ] Recomendaciones de estudio

### Fase 3 (Semana 5)
- [ ] Gráficas de rendimiento
- [ ] Historial académico
- [ ] Exportar reportes
- [ ] Despliegue en Firebase Hosting

## 📊 Base de Datos

### Colección: estudiantes
```
{
  userId: "abc123",
  nombre: "Juan",
  apellido: "Pérez",
  documento: "1234567890",
  carrera: "Ingeniería de Sistemas",
  semestre: 5,
  creado: timestamp
}
```

### Subcolección: materias
```
{
  materiaId: "mat001",
  nombre: "Matemáticas",
  nota: 4.5,
  semestre: 5,
  estado: "aprobada",
  fecha: timestamp
}
```

## 📝 Instalación y Uso

### Prerrequisitos
- Node.js 20 o superior
- npm 10 o superior
- Cuenta de Firebase

### Pasos para ejecutar localmente

1. **Clonar el repositorio:**
```bash
git clone https://github.com/TU-USUARIO/gestion-estudiantes.git
cd gestion-estudiantes
```

2. **Instalar dependencias:**
```bash
cd frontend
npm install
```

3. **Configurar Firebase:**
- Crear proyecto en Firebase Console
- Copiar configuración en `src/firebase.js`

4. **Ejecutar en desarrollo:**
```bash
npm run dev
```

5. **Abrir navegador:**
```
http://localhost:5173
```

## 🎨 Sistema de Alertas

| Nota | Color | Mensaje | Acción |
|------|-------|---------|--------|
| < 3.0 | 🔴 Rojo | ¡Alerta crítica! Riesgo de reprobar | Prioridad alta de estudio |
| 3.0 - 3.4 | 🟡 Amarillo | Alerta media. Mejorar rendimiento | Reforzar conocimientos |
| ≥ 3.5 | 🟢 Verde | Buen rendimiento | Mantener el nivel |

## 📖 Documentación

Toda la documentación técnica y de diseño se encuentra en la carpeta `docs/`:

- **DISEÑO.md:** Paleta de colores, tipografía y guías visuales
- **TAREAS.md:** Distribución detallada de tareas por estudiante
- **PRUEBAS.md:** Plan de pruebas y registro de bugs
- **REPORTES.md:** Avances semanales del proyecto

## 🐛 Reportar Bugs

Si encuentras un bug:
1. Ve a la pestaña "Issues"
2. Click "New issue"
3. Describe el problema detalladamente
4. Asigna la etiqueta correspondiente



## 📅 Cronograma

| Semana | Fechas | Objetivos |
|--------|--------|-----------|
| 1 | __/__/24 - __/__/24 | Configuración y estructura base |
| 2 | __/__/24 - __/__/24 | Autenticación y perfiles |
| 3 | __/__/24 - __/__/24 | Gestión de materias |
| 4 | __/__/24 - __/__/24 | Sistema de recomendaciones |
| 5 | __/__/24 - __/__/24 | Pulir y desplegar |

## 📜 Licencia

Este proyecto es un trabajo académico sin fines comerciales.

---

**Última actualización:** [Fecha]

