import { useState, useEffect, useCallback } from 'react';
import { projectsApi } from '../api';
import { Project } from '../types';

export function useRelatedProjects(currentProjectId: string | undefined) {
  const [relatedProjects, setRelatedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchRelated = useCallback(async () => {
    if (!currentProjectId) return;
    setLoading(true);
    try {
      const res = await projectsApi.getAll();
      const all: Project[] = Array.isArray(res.data) ? res.data : [];
      const filtered = all
        .filter((p) => p.id !== currentProjectId)
        .slice(0, 3);
      setRelatedProjects(filtered);
    } catch {
      setRelatedProjects([]);
    } finally {
      setLoading(false);
    }
  }, [currentProjectId]);

  useEffect(() => {
    fetchRelated();
  }, [fetchRelated]);

  return { relatedProjects, loading };
}
