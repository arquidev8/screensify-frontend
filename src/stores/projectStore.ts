import { create } from 'zustand';
import axios from 'axios';
import { API_ENDPOINTS } from '../config';

export interface Project {
  id: number;
  name: string;
  description?: string;
  target_environment: string;
  is_active: boolean;
  owner_id: number;
}

interface ProjectState {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  createProject: (data: { name: string; description?: string; target_environment: string }) => Promise<void>;
  updateProject: (id: number, data: Partial<{ name: string; description?: string; target_environment: string; is_active: boolean }>) => Promise<void>;
  deleteProject: (id: number) => Promise<void>;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  isLoading: false,
  error: null,

  fetchProjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.get<Project[]>(API_ENDPOINTS.PROJECTS);
      set({ projects: res.data, isLoading: false });
    } catch (e: any) {
      set({ error: e.response?.data?.detail || e.message, isLoading: false });
    }
  },

  createProject: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await axios.post<Project>(API_ENDPOINTS.PROJECTS, data);
      await get().fetchProjects();
    } catch (e: any) {
      set({ error: e.response?.data?.detail || e.message });
    } finally {
      set({ isLoading: false });
    }
  },

  updateProject: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      await axios.put<Project>(`${API_ENDPOINTS.PROJECTS}/${id}`, data);
      await get().fetchProjects();
    } catch (e: any) {
      set({ error: e.response?.data?.detail || e.message });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteProject: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete<Project>(`${API_ENDPOINTS.PROJECTS}/${id}`);
      await get().fetchProjects();
    } catch (e: any) {
      set({ error: e.response?.data?.detail || e.message });
    } finally {
      set({ isLoading: false });
    }
  },
}));
