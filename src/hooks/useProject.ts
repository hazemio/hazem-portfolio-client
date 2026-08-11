import { useState, useEffect, useCallback } from 'react';
import { projectsApi } from '../api';
import { Project } from '../types';

export function useProject(id: string | undefined) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProject = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await projectsApi.getOne(id);
      setProject(res.data);
    } catch (err: any) {
      setError(
        err?.response?.data?.message || err?.message || 'Failed to load project details',
      );
      setProject(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  return { project, loading, error, refetch: fetchProject };
}
