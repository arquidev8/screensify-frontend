import { create } from 'zustand';
import axios from 'axios';
import { API_ENDPOINTS } from '../config';

export interface ComponentInstance {
  id: number;
  screen_id: number;
  component_type: string;
  props: any;
  parent_id?: number;
  order: number;
  is_active: boolean;
}

interface EditorState {
  instances: ComponentInstance[];
  isLoading: boolean;
  error: string | null;
  selectedId: number | null;
  fetchInstances: (screenId: number) => Promise<void>;
  createInstance: (data: Omit<ComponentInstance, 'id'>) => Promise<void>;
  updateInstance: (id: number, data: Partial<Omit<ComponentInstance, 'id' | 'screen_id'>>) => Promise<void>;
  deleteInstance: (id: number) => Promise<void>;
  selectInstance: (id: number | null) => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  instances: [],
  isLoading: false,
  error: null,
  selectedId: null,

  fetchInstances: async (screenId) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.get<ComponentInstance[]>(`${API_ENDPOINTS.COMPONENT_INSTANCES}?screen_id=${screenId}`);
      set({ instances: res.data, isLoading: false });
    } catch (e: any) {
      set({ error: e.response?.data?.detail || e.message, isLoading: false });
    }
  },

  createInstance: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await axios.post<ComponentInstance>(API_ENDPOINTS.COMPONENT_INSTANCES, data);
      await get().fetchInstances(data.screen_id);
    } catch (e: any) {
      set({ error: e.response?.data?.detail || e.message });
    } finally {
      set({ isLoading: false });
    }
  },

  updateInstance: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      await axios.put<ComponentInstance>(`${API_ENDPOINTS.COMPONENT_INSTANCES}/${id}`, data);
      const screenId = get().instances.find(i => i.id === id)?.screen_id;
      if (screenId) await get().fetchInstances(screenId);
    } catch (e: any) {
      set({ error: e.response?.data?.detail || e.message });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteInstance: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const inst = get().instances.find(i => i.id === id);
      if (!inst) throw new Error('Instance not found');
      await axios.delete<ComponentInstance>(`${API_ENDPOINTS.COMPONENT_INSTANCES}/${id}`);
      await get().fetchInstances(inst.screen_id);
    } catch (e: any) {
      set({ error: e.response?.data?.detail || e.message });
    } finally {
      set({ isLoading: false });
    }
  },

  selectInstance: (id) => set({ selectedId: id }),
}));
