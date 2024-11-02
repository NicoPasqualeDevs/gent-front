import { useState, useCallback } from 'react';

export interface LoadingState {
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
}

export interface ExtendedLoadingState<T> extends LoadingState {
  data?: T;
}

const useLoadingState = <T = void>(initialState: boolean = true) => {
  const [state, setState] = useState<ExtendedLoadingState<T>>({
    isLoading: initialState,
    isError: false,
  });

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, isLoading: loading }));
  }, []);

  const setError = useCallback((error: Error | string) => {
    setState({
      isLoading: false,
      isError: true,
      errorMessage: error instanceof Error ? error.message : error,
    });
  }, []);

  const setData = useCallback((data: T) => {
    setState(prev => ({
      ...prev,
      isLoading: false,
      isError: false,
      data
    }));
  }, []);

  const resetState = useCallback(() => {
    setState({
      isLoading: false,
      isError: false,
    });
  }, []);

  return {
    state,
    setState,
    setLoading,
    setError,
    setData,
    resetState,
  };
};

export default useLoadingState; 