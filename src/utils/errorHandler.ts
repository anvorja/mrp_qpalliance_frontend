// src/utils/errorHandler.ts

/**
 * Función para manejar errores en la aplicación
 * @param error - Error capturado
 * @returns Mensaje de error formateado para mostrar al usuario
 */
export const handleApiError = (error: unknown): string => {
  // Verificar si es un error de red o conexión
  if (error instanceof TypeError && error.message === 'Failed to fetch') {
    return 'Error de conexión: No se pudo conectar con el servidor. Verifique su conexión a internet y que el servidor esté en funcionamiento.';
  }

  // Verificar si es un error de la API
  if (error instanceof Error) {
    // Intentar extraer el mensaje de error de la API
    const match = error.message.match(/Error: \d+ - (.+)/);
    if (match && match[1]) {
      return `Error del servidor: ${match[1]}`;
    }

    return error.message;
  }

  // Error genérico
  return 'Ha ocurrido un error inesperado. Por favor, inténtelo de nuevo más tarde.';
};

/**
 * Comprueba si el servidor de la API está disponible
 * @returns Promise<boolean> - Verdadero si el servidor está disponible
 */
export const checkApiAvailability = async (): Promise<boolean> => {
  try {
    const API_URL = 'http://localhost:5000/api/v1';
    const response = await fetch(`${API_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      // Timeout corto para no bloquear la interfaz
      signal: AbortSignal.timeout(3000)
    });

    return response.ok;
  } catch (error) {
    console.error('Error checking API availability:', error);
    return false;
  }
};