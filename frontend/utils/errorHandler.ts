export class AppError extends Error {
  constructor(
    public code: string,
    public statusCode: number = 500,
    message: string = 'Une erreur est survenue'
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const handleApiError = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (error.response?.status === 401) {
    return 'Votre session a expiré, veuillez vous reconnecter';
  }

  if (error.response?.status === 403) {
    return 'Vous n\'avez pas le droit d\'accéder à cette ressource';
  }

  if (error.response?.status === 404) {
    return 'La ressource demandée n\'existe pas';
  }

  if (error.response?.status === 400) {
    return error.response.data?.message || 'Données invalides';
  }

  if (error.response?.status === 409) {
    return 'Cette ressource existe déjà';
  }

  if (error.response?.status === 429) {
    return 'Trop de requêtes, veuillez réessayer plus tard';
  }

  if (error.response?.status === 500) {
    return 'Erreur serveur, veuillez réessayer plus tard';
  }

  if (error.request && !error.response) {
    return 'Erreur de connexion, veuillez vérifier votre connexion internet';
  }

  return error.message || 'Une erreur inconnue est survenue';
};

export const handleValidationError = (
  error: any
): { [key: string]: string } => {
  if (error.response?.data?.errors) {
    return error.response.data.errors;
  }

  return {
    general: handleApiError(error),
  };
};

export const logError = (error: Error, context?: string) => {
  console.error(`[Error${context ? ` - ${context}` : ''}]:`, error);
  
  // Vous pouvez ajouter ici une intégration avec un service de logging
  // (Sentry, LogRocket, etc.)
};
