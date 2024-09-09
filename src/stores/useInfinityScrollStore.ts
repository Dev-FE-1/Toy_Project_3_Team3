import create from 'zustand';
import throttle from 'lodash/throttle';

interface InfinityScrollState {
  visibleItems: number;
  loading: boolean;
  hasMore: boolean;
  setVisibleItems: (newCount: number) => void;
  setLoading: (isLoading: boolean) => void;
  setHasMore: (hasMore: boolean) => void;
  resetScrollState: () => void;
  initializeScroll: (fetchMoreItems: () => void) => () => void; // cleanup 반환 타입 추가
}

export const useInfinityScrollStore = create<InfinityScrollState>((set) => ({
  visibleItems: 12,
  loading: false,
  hasMore: true,
  setVisibleItems: (newCount) => set({ visibleItems: newCount }),
  setLoading: (isLoading) => set({ loading: isLoading }),
  setHasMore: (hasMore) => set({ hasMore }),
  resetScrollState: () => set({ visibleItems: 12, loading: false, hasMore: true }),

  initializeScroll: (fetchMoreItems) => {
    const throttledHandleScroll = throttle(() => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      set((state) => {
        if (scrollTop + clientHeight >= scrollHeight - 5 && !state.loading && state.hasMore) {
          fetchMoreItems();
        }
        return state;
      });
    }, 500);

    window.addEventListener('scroll', throttledHandleScroll);

    // 이벤트 리스너를 제거하는 cleanup 함수 반환
    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
    };
  },
}));
