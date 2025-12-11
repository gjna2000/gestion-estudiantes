// src/services/gemini.js

const GEMINI_API_KEY = 'TU_API_KEY_AQUI'; // Reemplaza con tu API Key
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

export async function generarRecomendacionesIA(materia, nota, notasDetalles, temasActuales) {
  try {
    const prompt = `
Eres un tutor académico experto. Analiza el rendimiento del estudiante y genera recomendaciones específicas.

MATERIA: ${materia}
NOTA ACTUAL: ${nota}/5.0
DETALLES DE CORTES:
${notasDetalles}

TEMAS QUE ESTÁ ESTUDIANDO ACTUALMENTE:
${temasActuales}

IMPORTANTE: Usa los temas específicos que está estudiando para buscar recursos MUY CONCRETOS y relevantes.

Por favor proporciona:

1. ANÁLISIS: Un análisis breve del rendimiento enfocado en los temas actuales (2-3 líneas)

2. RECURSOS DE ESTUDIO (formato JSON):
{
  "videos": [
    {
      "titulo": "título específico relacionado con el tema actual",
      "query": "búsqueda EXACTA para YouTube usando el tema específico del estudiante",
      "descripcion": "explicación de por qué este video ayudará con el tema"
    }
  ],
  "articulos": [
    {
      "titulo": "título del recurso específico del tema",
      "url": "términos de búsqueda exactos relacionados con el tema actual",
      "descripcion": "qué aprenderás específicamente sobre el tema"
    }
  ],
  "libros": [
    {
      "titulo": "nombre del libro con capítulos específicos sobre el tema",
      "autor": "autor si lo conoces",
      "descripcion": "capítulos específicos que cubren el tema actual: ${temasActuales}"
    }
  ]
}

3. PLAN DE ACCIÓN: 3-5 pasos concretos y específicos para dominar los temas actuales

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
    return generarRecomendacionesBackup(materia, nota, temasActuales);
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

function generarRecomendacionesBackup(materia, nota, temasActuales) {
  // Recomendaciones de respaldo si falla la IA
  const temaTexto = temasActuales || materia;
  
  return {
    analisis: `Necesitas reforzar tus conocimientos en ${materia}, específicamente en: ${temaTexto}. Te recomendamos recursos específicos para estos temas.`,
    recursos: {
      videos: [
        {
          titulo: `Tutorial completo de ${temaTexto}`,
          query: `${temaTexto} tutorial completo español`,
          descripcion: 'Video introductorio para repasar conceptos fundamentales del tema'
        }
      ],
      articulos: [
        {
          titulo: `Guía de estudio de ${temaTexto}`,
          url: `${temaTexto} guía estudio PDF`,
          descripcion: 'Material de apoyo académico sobre el tema específico'
        }
      ],
      libros: [
        {
          titulo: `Libro recomendado sobre ${temaTexto}`,
          autor: 'Consultar biblioteca',
          descripcion: `Capítulos específicos sobre ${temaTexto}`
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