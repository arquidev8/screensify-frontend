import { create } from 'zustand';
import axios from 'axios';
import { API_ENDPOINTS, STORAGE_KEYS } from '../config';

const storedToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
if (storedToken) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
}

interface User {
  id: number;
  email: string;
  full_name: string;
  is_active: boolean;
  is_superuser: boolean;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => void;
  fetchUserProfile: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN),
  user: JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || 'null'),
  isLoading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN),

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      // OAuth2PasswordRequestForm requiere form data urlencoded
      const params = new URLSearchParams();
      params.append('username', email);
      params.append('password', password);
      const response = await axios.post(
        API_ENDPOINTS.LOGIN,
        params,
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );

      const { access_token } = response.data;
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, access_token);
      
      // Configurar el token para futuras peticiones
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      // Obtener el perfil del usuario
      await get().fetchUserProfile();
      
      set({ token: access_token, isAuthenticated: true, isLoading: false });
    } catch (error: any) {
      console.error('Error de login:', error);
      set({ 
        error: error.response?.data?.detail || 'Error al iniciar sesión', 
        isLoading: false 
      });
    }
  },

  register: async (email: string, password: string, fullName: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(API_ENDPOINTS.REGISTER, {
        email,
        password,
        full_name: fullName,
      });

      // Después del registro exitoso, iniciar sesión automáticamente
      await get().login(email, password);
      
      set({ isLoading: false });
    } catch (error: any) {
      console.error('Error de registro:', error);
      set({ 
        error: error.response?.data?.detail || 'Error al registrar usuario', 
        isLoading: false 
      });
    }
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    delete axios.defaults.headers.common['Authorization'];
    set({ token: null, user: null, isAuthenticated: false });
  },

  fetchUserProfile: async () => {
    const { token } = get();
    if (!token) return;

    try {
      const response = await axios.get(API_ENDPOINTS.USERS_ME, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const userData = response.data;
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
      set({ user: userData });
    } catch (error) {
      console.error('Error al obtener perfil:', error);
      // Si hay un error de autenticación, cerrar sesión
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        get().logout();
      }
    }
  },

  clearError: () => set({ error: null }),
}));