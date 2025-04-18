// Configuración global de la aplicación

// Nombre de la aplicación
export const APP_NAME = 'Screensify';

// URL base de la API
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Prefijo de la API
export const API_PREFIX = '/api/v1';

// URL completa de la API
export const API_URL = `${API_BASE_URL}${API_PREFIX}`;

// Endpoints de la API
export const API_ENDPOINTS = {
  LOGIN: `${API_URL}/login/access-token`,
  REGISTER: `${API_URL}/register`,
  USERS_ME: `${API_URL}/users/me`,
  PROJECTS: `${API_URL}/projects`,
  SCREENS: `${API_URL}/screens`,
  MCP_EXECUTE: `${API_URL}/mcp/execute`,
};

// Configuración de almacenamiento local
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'screensify_auth_token',
  USER: 'screensify_user',
};

// Configuración de tema
export const THEME = {
  PRIMARY_COLOR: '#3f51b5',
  SECONDARY_COLOR: '#f50057',
  BACKGROUND_COLOR: '#f5f5f5',
};