import { useLoadingStore } from './useLoadingStore';

export const useLoading = () => {
    const { isLoading, show, hide } = useLoadingStore();
    return { isLoading, show, hide };
};
