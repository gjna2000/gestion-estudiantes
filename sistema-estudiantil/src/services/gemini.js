// src/services/gemini.js

const GEMINI_API_KEY = 'AIzaSyDWYuN4_WSAo2wKHdxyISxVx1LPqF9BSjw'; // Reemplaza con tu API Key
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

export async function generarRecomendacionesIA(materia, nota, notasDetalles) {
  try {
    const prompt = `
Eres un tutor académico experto. Analiza el rendimiento del estudiante y genera recomendaciones específicas.

MATERIA: ${materia}
NOTA ACTUAL: ${nota}/5.0
DETALLES DE CORTES:
${notasDetalles}

Por favor proporciona:

1. ANÁLISIS: Un análisis breve del rendimiento (2-3 líneas)

2. RECURSOS DE ESTUDIO (formato JSON):
{
  "videos": [
    {
      "titulo": "título descriptivo del video",
      "query": "búsqueda exacta para YouTube sobre el tema más importante",
      "descripcion": "por qué este video ayudará"
    }
  ],
  "articulos": [
    {
      "titulo": "título del recurso",
      "url": "conceptos clave a buscar en Google Scholar o artículos académicos",
      "descripcion": "qué aprenderás"
    }
  ],
  "libros": [
    {
      "titulo": "nombre del libro recomendado",
      "autor": "autor si lo conoces",
      "descripcion": "capítulos o temas específicos a revisar"
    }
  ]
}

3. PLAN DE ACCIÓN: 3-5 pasos concretos y específicos para mejorar

Responde SOLO con el JSON de recursos y el análisis en texto plano separados por "---"
`;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2000,
        }
      })
    });

    if (!response.ok) {
      throw new Error('Error al conectar con Gemini AI');
    }

    const data = await response.json();
    const textoCompleto = data.candidates[0].content.parts[0].text;

    // Parsear la respuesta
    return parsearRespuestaIA(textoCompleto, materia);

  } catch (error) {
    console.error('Error en Gemini AI:', error);
    return generarRecomendacionesBackup(materia, nota);
  }
}

function parsearRespuestaIA(texto, materia) {
  try {
    // Intentar extraer el JSON de la respuesta
    const jsonMatch = texto.match(/\{[\s\S]*\}/);
    let recursos = {
      videos: [],
      articulos: [],
      libros: []
    };

    if (jsonMatch) {
      try {
        recursos = JSON.parse(jsonMatch[0]);
      } catch (e) {
        console.error('Error parseando JSON:', e);
      }
    }

    // Extraer análisis (texto antes del JSON)
    const analisis = texto.split('{')[0].replace('---', '').trim();

    return {
      analisis: analisis || `Análisis del rendimiento en ${materia}`,
      recursos: recursos,
      generadoPorIA: true
    };

  } catch (error) {
    console.error('Error parseando respuesta:', error);
    return generarRecomendacionesBackup(materia, 0);
  }
}

function generarRecomendacionesBackup(materia, nota) {
  // Recomendaciones de respaldo si falla la IA
  return {
    analisis: `Necesitas reforzar tus conocimientos en ${materia}. Te recomendamos recursos específicos para mejorar.`,
    recursos: {
      videos: [
        {
          titulo: `Tutorial completo de ${materia}`,
          query: `${materia} tutorial completo español`,
          descripcion: 'Video introductorio para repasar conceptos fundamentales'
        }
      ],
      articulos: [
        {
          titulo: `Guía de estudio de ${materia}`,
          url: `${materia} guía estudio PDF`,
          descripcion: 'Material de apoyo académico'
        }
      ],
      libros: [
        {
          titulo: `Libro recomendado de ${materia}`,
          autor: 'Consultar biblioteca',
          descripcion: 'Texto base de la materia'
        }
      ]
    },
    generadoPorIA: false
  };
}

// Función para buscar videos en YouTube (sin API key)
export function buscarEnYouTube(query) {
  const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
  return searchUrl;
}

// Función para buscar en Google Scholar
export function buscarEnScholar(query) {
  const searchUrl = `https://scholar.google.com/scholar?q=${encodeURIComponent(query)}`;
  return searchUrl;
}