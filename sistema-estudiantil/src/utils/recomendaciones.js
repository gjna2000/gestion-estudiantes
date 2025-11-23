// src/utils/recomendaciones.js

/**
 * Genera recomendaciones personalizadas basadas en el rendimiento académico
 * @param {Array} materias - Array de objetos con información de materias
 * @returns {Array} Array de recomendaciones ordenadas por prioridad
 */
export function generarRecomendaciones(materias) {
  if (!materias || materias.length === 0) {
    return [{
      id: 'bienvenida',
      tipo: 'info',
      prioridad: 'BAJA',
      icono: '📚',
      titulo: 'Comienza tu seguimiento académico',
      mensaje: 'Registra tus primeras materias para recibir recomendaciones personalizadas.',
      acciones: ['Agrega materias usando el botón "+ Agregar Materia"']
    }];
  }

  const recomendaciones = [];
  const promedio = calcularPromedio(materias);

  // Análisis por materia individual
  materias.forEach(materia => {
    if (materia.nota < 3.0) {
      recomendaciones.push({
        id: `critica-${materia.id}`,
        tipo: 'critica',
        prioridad: 'ALTA',
        icono: '🔴',
        materia: materia.nombre,
        nota: materia.nota,
        titulo: `${materia.nombre}: Situación crítica`,
        mensaje: 'Esta materia requiere atención urgente para evitar reprobarla.',
        acciones: [
          'Dedica al menos 2-3 horas diarias a esta materia',
          'Busca tutorías o grupos de estudio inmediatamente',
          'Consulta con el profesor sobre temas específicos',
          'Revisa los conceptos fundamentales desde el inicio',
          'Organiza un plan de estudio semanal enfocado'
        ],
        recursos: [
          'Videos educativos en YouTube sobre los temas',
          'Khan Academy para refuerzo de conceptos',
          'Grupos de estudio con compañeros'
        ]
      });
    } else if (materia.nota >= 3.0 && materia.nota < 3.5) {
      recomendaciones.push({
        id: `media-${materia.id}`,
        tipo: 'advertencia',
        prioridad: 'MEDIA',
        icono: '🟡',
        materia: materia.nombre,
        nota: materia.nota,
        titulo: `${materia.nombre}: Refuerza conocimientos`,
        mensaje: 'Estás en un punto clave. Con un poco más de esfuerzo puedes mejorar significativamente.',
        acciones: [
          'Practica ejercicios adicionales regularmente',
          'Repasa antes de cada clase nueva',
          'Participa activamente en clases',
          'Forma un grupo de estudio',
          'Resuelve ejercicios de exámenes anteriores'
        ],
        recursos: [
          'Ejercicios de práctica en línea',
          'Libros complementarios de la biblioteca',
          'Sesiones de repaso grupales'
        ]
      });
    } else if (materia.nota >= 4.5) {
      recomendaciones.push({
        id: `excelente-${materia.id}`,
        tipo: 'exito',
        prioridad: 'BAJA',
        icono: '🟢',
        materia: materia.nombre,
        nota: materia.nota,
        titulo: `${materia.nombre}: ¡Excelente desempeño!`,
        mensaje: '¡Vas muy bien! Continúa con este nivel de dedicación.',
        acciones: [
          'Mantén tu rutina de estudio actual',
          'Considera ayudar a compañeros con dificultades',
          'Profundiza en temas avanzados de tu interés',
          'Participa en proyectos extracurriculares'
        ]
      });
    }
  });

  // Recomendaciones generales basadas en promedio
  if (promedio < 3.0) {
    recomendaciones.push({
      id: 'promedio-critico',
      tipo: 'critica',
      prioridad: 'ALTA',
      icono: '⚠️',
      titulo: 'Promedio general en riesgo',
      mensaje: `Tu promedio actual (${promedio.toFixed(2)}) está por debajo del mínimo. Es crucial tomar acción inmediata.`,
      acciones: [
        'Evalúa tu método de estudio actual',
        'Considera reducir actividades extracurriculares temporalmente',
        'Busca apoyo psicopedagógico si es necesario',
        'Establece un horario de estudio estructurado',
        'Habla con un asesor académico sobre estrategias'
      ]
    });
  } else if (promedio >= 3.0 && promedio < 3.5) {
    recomendaciones.push({
      id: 'promedio-mejorar',
      tipo: 'advertencia',
      prioridad: 'MEDIA',
      icono: '📈',
      titulo: 'Oportunidad de mejora',
      mensaje: `Tu promedio (${promedio.toFixed(2)}) es aceptable, pero puedes aspirar a más.`,
      acciones: [
        'Identifica tus puntos débiles y enfócate en ellos',
        'Optimiza tu técnica de estudio',
        'Establece metas semanales específicas',
        'Mantén un equilibrio entre estudio y descanso'
      ]
    });
  } else if (promedio >= 4.0) {
    recomendaciones.push({
      id: 'promedio-excelente',
      tipo: 'exito',
      prioridad: 'BAJA',
      icono: '⭐',
      titulo: '¡Rendimiento sobresaliente!',
      mensaje: `Tu promedio (${promedio.toFixed(2)}) es excelente. ¡Sigue así!`,
      acciones: [
        'Mantén tu disciplina de estudio',
        'Comparte tus métodos de estudio con otros',
        'Busca retos académicos adicionales',
        'Considera participar en investigación o proyectos'
      ]
    });
  }

  // Recomendación de balance de carga académica
  const creditosTotales = materias.reduce((sum, m) => sum + (m.creditos || 0), 0);
  if (creditosTotales > 18) {
    recomendaciones.push({
      id: 'carga-alta',
      tipo: 'advertencia',
      prioridad: 'MEDIA',
      icono: '📚',
      titulo: 'Carga académica elevada',
      mensaje: `Tienes ${creditosTotales} créditos. Asegúrate de gestionar bien tu tiempo.`,
      acciones: [
        'Usa una agenda o app de organización',
        'Prioriza tareas por fechas de entrega',
        'No descuides tu descanso y salud',
        'Considera técnicas de productividad (Pomodoro, etc.)'
      ]
    });
  }

  // Ordenar por prioridad
  const ordenPrioridad = { 'ALTA': 1, 'MEDIA': 2, 'BAJA': 3 };
  return recomendaciones.sort((a, b) => 
    ordenPrioridad[a.prioridad] - ordenPrioridad[b.prioridad]
  );
}

/**
 * Calcula el promedio ponderado o simple de las materias
 * @param {Array} materias - Array de materias
 * @returns {number} Promedio calculado
 */
export function calcularPromedio(materias) {
  if (!materias || materias.length === 0) return 0;
  
  // Promedio simple (puedes cambiarlo a ponderado si lo necesitas)
  const suma = materias.reduce((acc, m) => acc + (m.nota || 0), 0);
  return suma / materias.length;
}

/**
 * Obtiene estadísticas generales del rendimiento
 * @param {Array} materias - Array de materias
 * @returns {Object} Objeto con estadísticas
 */
export function obtenerEstadisticas(materias) {
  if (!materias || materias.length === 0) {
    return {
      total: 0,
      aprobadas: 0,
      reprobadas: 0,
      enRiesgo: 0,
      promedio: 0
    };
  }

  return {
    total: materias.length,
    aprobadas: materias.filter(m => m.nota >= 3.0).length,
    reprobadas: materias.filter(m => m.nota < 3.0).length,
    enRiesgo: materias.filter(m => m.nota >= 3.0 && m.nota < 3.5).length,
    promedio: calcularPromedio(materias)
  };
}