import { create } from 'zustand';

type Store = {
  overlayNavigation: null | 'docs';
};

const useStore = create<Store>(() => ({
  overlayNavigation: null,
}));

export default useStore;
