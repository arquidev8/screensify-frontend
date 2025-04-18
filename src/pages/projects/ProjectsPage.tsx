import React, { useEffect, useState } from 'react';
import { useProjectStore, Project } from '../../stores/projectStore';
import MainLayout from '../../components/layout/MainLayout';

const ProjectsPage: React.FC = () => {
  const { projects, isLoading, error, fetchProjects, createProject, deleteProject } = useProjectStore();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [env, setEnv] = useState<'expo' | 'cli'>('expo');

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await createProject({ name, description, target_environment: env });
    setName(''); setDescription(''); setEnv('expo');
  };

  return (
    <MainLayout>
      <h1>Mis Proyectos</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleCreate} style={{ marginBottom: 20 }}>
        <input
          placeholder="Nombre"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <input
          placeholder="Descripción"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <select value={env} onChange={e => setEnv(e.target.value as any)}>
          <option value="expo">Expo</option>
          <option value="cli">CLI</option>
        </select>
        <button type="submit" disabled={isLoading}>Crear</button>
      </form>

      {isLoading ? (
        <p>Cargando proyectos...</p>
      ) : (
        <ul>
          {projects.map((p: Project) => (
            <li key={p.id}>
              <strong>{p.name}</strong> [{p.target_environment}] {' '}
              <button onClick={() => deleteProject(p.id)}>Eliminar</button>
            </li>
          ))}
        </ul>
      )}
    </MainLayout>
  );
};

export default ProjectsPage;
