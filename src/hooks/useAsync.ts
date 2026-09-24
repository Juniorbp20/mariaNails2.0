/**
 * useAsync.ts — Hook para cargar datos asíncronos sin repetir código.
 *
 * Uso: const { data, loading, error } = useAsync(() => service.getX()).
 * Si immediate=false no carga solo; (actualmente solo expone el estado).
 */
import { useState, useEffect, useCallback } from 'react';

/** Estado que devuelve el hook: datos, cargando o error. */
interface UseAsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

/** Ejecuta una promesa y guarda su resultado/loading/error en el estado. */
export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  immediate = true,
  dependencies: any[] = []
): UseAsyncState<T> {
  const [state, setState] = useState<UseAsyncState<T>>({
    data: null,
    loading: immediate,
    error: null,
  });

  const execute = useCallback(async () => {
    setState({ data: null, loading: true, error: null });
    try {
      const response = await asyncFunction();
      setState({ data: response, loading: false, error: null });
    } catch (error) {
      setState({ data: null, loading: false, error: error as Error });
    }
  }, dependencies);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return state;
}
