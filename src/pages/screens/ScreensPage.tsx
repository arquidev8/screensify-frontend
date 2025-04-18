import React, { useEffect, useState } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import { useProjectStore } from '../../stores/projectStore';
import { useScreenStore } from '../../stores/screenStore';

const ScreensPage: React.FC = () => {
  const { projects, fetchProjects } = useProjectStore();
  const { screens, fetchScreens, createScreen, deleteScreen, isLoading, error } = useScreenStore();
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [order, setOrder] = useState<number>(0);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);
  useEffect(() => {
    if (selectedProjectId !== null) fetchScreens(selectedProjectId);
  }, [selectedProjectId, fetchScreens]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProjectId) {
      await createScreen({ name, description, project_id: selectedProjectId, order, layout_data: {}, code_data: {} });
      setName(''); setDescription(''); setOrder(0);
    }
  };

  return (
    <MainLayout>
      <h1>Pantallas</h1>
      <div>
        <label>Proyecto:</label>
        <select value={selectedProjectId ?? ''} onChange={e => setSelectedProjectId(Number(e.target.value))}>
          <option value="">Selecciona un proyecto</option>
          {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>
      {selectedProjectId && (
        <>
          <form onSubmit={handleCreate} style={{ margin: '16px 0' }}>
            <input placeholder="Nombre pantalla" value={name} onChange={e => setName(e.target.value)} required />
            <input placeholder="Descripción" value={description} onChange={e => setDescription(e.target.value)} />
            <input type="number" placeholder="Orden" value={order} onChange={e => setOrder(Number(e.target.value))} />
            <button type="submit" disabled={isLoading}>Crear pantalla</button>
          </form>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {isLoading ? (<p>Cargando...</p>) : (
            <ul>
              {screens.map(s => (
                <li key={s.id}>
                  {s.name} <button onClick={() => deleteScreen(s.id)}>Eliminar</button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </MainLayout>
  );
};

export default ScreensPage;
