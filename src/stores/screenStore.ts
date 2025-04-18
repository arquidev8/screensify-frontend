import { create } from 'zustand';
import axios from 'axios';
import { API_ENDPOINTS } from '../config';

export interface Screen {
  id: number;
  name: string;
  description?: string;
  project_id: number;
  layout_data: any;
  code_data: any;
  order: number;
  is_active: boolean;
}

interface ScreenState {
  screens: Screen[];
  isLoading: boolean;
  error: string | null;
  fetchScreens: (projectId: number) => Promise<void>;
  createScreen: (data: { name: string; description?: string; project_id: number; order?: number; layout_data?: any; code_data?: any }) => Promise<void>;
  deleteScreen: (id: number) => Promise<void>;
}

export const useScreenStore = create<ScreenState>((set, get) => ({
  screens: [],
  isLoading: false,
  error: null,

  fetchScreens: async (projectId) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.get<Screen[]>(`${API_ENDPOINTS.SCREENS}?project_id=${projectId}`);
      set({ screens: res.data, isLoading: false });
    } catch (e: any) {
      set({ error: e.response?.data?.detail || e.message, isLoading: false });
    }
  },

  createScreen: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await axios.post<Screen>(API_ENDPOINTS.SCREENS, data);
      await get().fetchScreens(data.project_id);
    } catch (e: any) {
      set({ error: e.response?.data?.detail || e.message });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteScreen: async (id) => {
    set({ isLoading: true, error: null });
    try {
      // find project_id to refetch
      const screen = get().screens.find(s => s.id === id);
      if (!screen) throw new Error('Screen not found');
      await axios.delete<Screen>(`${API_ENDPOINTS.SCREENS}/${id}`);
      await get().fetchScreens(screen.project_id);
    } catch (e: any) {
      set({ error: e.response?.data?.detail || e.message });
    } finally {
      set({ isLoading: false });
    }
  },
}));
