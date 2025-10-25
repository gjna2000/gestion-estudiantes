### 📅 SEMANA 1: Setup y Diseño

#### LUNES 
- [ ] Instalar Visual Studio Code
- [ ] Instalar Node.js y verificar
- [ ] Instalar Git
- [ ] Crear cuenta en GitHub
- [ ] Crear repositorio "gestion-estudiantes"
- [ ] Invitar a Estudiante Jorge Sebastian Ortiz Humo y Miller Marlow Martinez Martinez como colaboradores
- [ ] Configurar Git local
- [ ] Clonar repositorio

#### MARTES 
- [ ] Verificar que Est. Jorge Sebastian Ortiz Humo y Miller Marlow Martinez Martinez aceptaron invitación
- [ ] Editar README.md con información completa del proyecto
- [ ] Crear carpeta `docs/`
- [ ] Crear archivo `docs/TAREAS.md` (este archivo)
- [ ] Subir cambios a GitHub

#### MIÉRCOLES 
- [ ] Crear archivo `docs/DISEÑO.md`
  - Definir paleta de colores
  - Especificar tipografía
  - Definir espaciados y bordes
  - Ejemplos visuales
- [ ] Crear mockups en papel o digital:
  - Pantalla de Login
  - Pantalla de Dashboard
  - Pantalla de Materias
- [ ] Guardar mockups en `docs/mockups/`
- [ ] Subir a GitHub

#### JUEVES 
- [ ] Crear archivo `docs/PRUEBAS.md`
  - Plan de pruebas para Login/Registro
  - Plan de pruebas para Materias
  - Plantilla para reportar bugs
- [ ] Esperar a que Est. Miller Marlow Martinez Martinez configure Firebase
- [ ] Revisar avances del equipo

#### VIERNES 
- [ ] Descargar cambios: `git pull`
- [ ] Instalar dependencias: `npm install`
- [ ] Ejecutar proyecto: `npm run dev`
- [ ] Verificar que funciona localmente
- [ ] Crear archivo `docs/REPORTES.md`
- [ ] Escribir reporte de Semana 1
- [ ] Subir a GitHub

---

### 📅 SEMANA 2: Testing de Autenticación

#### LUNES 
- [ ] Actualizar proyecto: `git pull`
- [ ] Probar componente Login visualmente
- [ ] Verificar estilos según guía de diseño
- [ ] Reportar problemas visuales a Est. Jorge Sebastian Ortiz Humo
- [ ] Actualizar `PRUEBAS.md` con resultados

#### MARTES 
- [ ] Probar registro de usuario
  - Crear cuenta nueva
  - Verificar en Firebase Console
  - Probar con emails duplicados
  - Probar con contraseñas débiles
- [ ] Documentar bugs encontrados
- [ ] Crear issues en GitHub para cada bug
- [ ] Actualizar `PRUEBAS.md`

#### MIÉRCOLES 
- [ ] Probar login funcional
  - Login exitoso
  - Login con datos incorrectos
  - Recuperar contraseña (si aplica)
- [ ] Verificar mensajes de error
- [ ] Verificar que redirige correctamente
- [ ] Documentar resultados

#### JUEVES 
- [ ] Probar componente Perfil
- [ ] Verificar guardado de datos
- [ ] Revisar Firebase Console para confirmar datos
- [ ] Probar validaciones de formulario
- [ ] Reportar bugs

#### VIERNES 
- [ ] Revisar todos los componentes de la semana
- [ ] Verificar que bugs reportados fueron corregidos
- [ ] Actualizar `REPORTES.md` con Semana 2
- [ ] Reunión con equipo para revisar avances
- [ ] Subir documentación a GitHub

---

### 📅 SEMANA 3: Testing de Materias

#### LUNES 
- [ ] Actualizar proyecto: `git pull`
- [ ] Probar componente Agregar Materia
  - Agregar materia válida
  - Agregar con nota inválida (>5, <0)
  - Agregar sin llenar campos
  - Verificar colores según nota
- [ ] Documentar resultados

#### MARTES 
- [ ] Probar Lista de Materias
  - Verificar que se muestran todas
  - Verificar colores de alertas
  - Verificar iconos
- [ ] Probar con 0 materias
- [ ] Probar con muchas materias (10+)
- [ ] Reportar bugs visuales

#### MIÉRCOLES 
- [ ] Probar edición de materias
  - Editar nota
  - Editar nombre
  - Verificar que se actualiza en Firebase
- [ ] Probar eliminación de materias
  - Verificar confirmación
  - Verificar que se borra de Firebase
- [ ] Documentar resultados

#### JUEVES 
- [ ] Pruebas de integración completas
  - Flujo: Registro → Perfil → Agregar 5 materias
  - Verificar promedio se calcula bien
  - Verificar alertas aparecen
- [ ] Crear casos de prueba extremos
- [ ] Documentar todo

#### VIERNES 
- [ ] Verificar correcciones de bugs
- [ ] Actualizar `PRUEBAS.md`
- [ ] Actualizar `REPORTES.md` con Semana 3
- [ ] Preparar lista de mejoras para siguiente semana
- [ ] Subir a GitHub

---

### 📅 SEMANA 4: Testing de Recomendaciones

#### LUNES 
- [ ] Actualizar proyecto: `git pull`
- [ ] Probar Dashboard con datos reales
- [ ] Verificar cálculo de promedio
- [ ] Verificar alertas activas
- [ ] Probar con diferentes escenarios:
  - Todas las notas altas
  - Todas las notas bajas
  - Notas mixtas
- [ ] Documentar comportamiento

#### MARTES 
- [ ] Probar sistema de recomendaciones
  - Verificar mensajes personalizados
  - Verificar priorización de materias
  - Verificar plan de estudio sugerido
- [ ] Probar con diferentes perfiles de estudiante
- [ ] Documentar resultados

#### MIÉRCOLES 
- [ ] Probar gráficas (si están implementadas)
- [ ] Verificar página de Historial
- [ ] Probar comparación entre semestres
- [ ] Verificar que todos los datos son consistentes
- [ ] Reportar bugs

#### JUEVES 
- [ ] Pruebas de usabilidad
  - ¿Es intuitivo?
  - ¿Los mensajes son claros?
  - ¿Es fácil navegar?
- [ ] Hacer pruebas con otra persona (amigo/familiar)
- [ ] Recopilar feedback
- [ ] Documentar sugerencias de mejora

#### VIERNES 
- [ ] Revisión final de la semana
- [ ] Actualizar toda la documentación
- [ ] Crear lista de prioridades para Semana 5
- [ ] Reunión con equipo
- [ ] Subir a GitHub

---

### 📅 SEMANA 5: Testing Final y Documentación

#### LUNES 
- [ ] Pruebas exhaustivas de toda la aplicación
- [ ] Crear checklist de funcionalidades completas
- [ ] Verificar cada función una por una
- [ ] Hacer pruebas en diferentes navegadores:
  - Chrome
  - Firefox
  - Edge
  - Safari (si tienes Mac)
- [ ] Documentar incompatibilidades

#### MARTES 
- [ ] Pruebas en diferentes dispositivos
  - Desktop (1920x1080)
  - Laptop (1366x768)
  - Tablet (768px)
  - Móvil (375px)
- [ ] Verificar que es responsive
- [ ] Reportar problemas de diseño
- [ ] Documentar resultados

#### MIÉRCOLES 
- [ ] Verificar que todos los bugs fueron corregidos
- [ ] Cerrar issues en GitHub
- [ ] Actualizar README.md final
- [ ] Completar documentación técnica
- [ ] Escribir manual de usuario básico

#### JUEVES 
- [ ] Probar versión desplegada online (Firebase Hosting)
- [ ] Verificar que funciona igual que en local
- [ ] Hacer pruebas de rendimiento
- [ ] Verificar tiempos de carga
- [ ] Documentar URL final

#### VIERNES 
- [ ] Escribir reporte final del proyecto
- [ ] Completar `REPORTES.md` con Semana 5
- [ ] Crear presentación del proyecto
- [ ] Preparar demo
- [ ] Subir TODO a GitHub


---

## 📊 TAREAS CONTINUAS (TODAS LAS SEMANAS)

### Responsabilidades Diarias
- [ ] Revisar Issues en GitHub
- [ ] Actualizar documentación
- [ ] Comunicación con el equipo (WhatsApp/Discord)
- [ ] Hacer `git pull` antes de trabajar
- [ ] Subir cambios al final del día

### Responsabilidades Semanales
- [ ] Reunión de equipo (viernes)
- [ ] Reporte semanal en `REPORTES.md`
- [ ] Revisar avances vs cronograma
- [ ] Planificar próxima semana

### Testing Continuo
- [ ] Probar cada nueva funcionalidad inmediatamente
- [ ] Reportar bugs en cuanto se encuentren
- [ ] Verificar correcciones
- [ ] Mantener `PRUEBAS.md` actualizado

---



## ✅ CHECKLIST FINAL (Semana 5)

### Funcionalidades
- [ ] Login funciona correctamente
- [ ] Registro funciona correctamente
- [ ] Perfil se guarda y muestra bien
- [ ] Agregar materia funciona
- [ ] Editar materia funciona
- [ ] Eliminar materia funciona
- [ ] Promedio se calcula correctamente
- [ ] Alertas se muestran según nota
- [ ] Recomendaciones son coherentes
- [ ] Dashboard muestra datos reales
- [ ] Cerrar sesión funciona

### Diseño
- [ ] Colores consistentes según guía
- [ ] Tipografía correcta
- [ ] Espaciados uniformes
- [ ] Responsive en móvil
- [ ] Responsive en tablet
- [ ] Botones tienen hover effects
- [ ] Formularios tienen validación visual

### Técnico
- [ ] No hay errores en consola
- [ ] Datos se guardan en Firebase
- [ ] Autenticación persiste al recargar
- [ ] Tiempos de carga aceptables (<3 segundos)
- [ ] Funciona en diferentes navegadores
- [ ] Código está en GitHub
- [ ] Proyecto desplegado online

### Documentación
- [ ] README completo
- [ ] DISEÑO.md completo
- [ ] TAREAS.md completo
- [ ] PRUEBAS.md completo
- [ ] REPORTES.md completo (5 semanas)
- [ ] Manual de usuario
- [ ] Comentarios en código importante

---


### Convenciones Git
```bash
# Commits descriptivos
git commit -m "Feat: Agregar componente Login"
git commit -m "Fix: Corregir cálculo de promedio"
git commit -m "Docs: Actualizar README"
git commit -m "Test: Agregar pruebas de materia"

# Prefijos:
# Feat: Nueva funcionalidad
# Fix: Corrección de bug
# Docs: Documentación
# Test: Pruebas
# Style: Estilos/formato
# Refactor: Mejora de código
```

---

**Última actualización:** [25/10/2025]
**Versión:** 1.0