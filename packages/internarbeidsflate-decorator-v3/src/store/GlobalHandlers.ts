import { create } from 'zustand';

type GlobalHandlers = {
  onLinkClick?: (linkText: string, url: string) => void;
};

type Methods = {
  setHandler: <T extends keyof GlobalHandlers>(
    type: T,
    handler: GlobalHandlers[T],
  ) => void;
};

const useGlobalHandlers = create<GlobalHandlers & Methods>((set) => ({
  setHandler: (key, handler) => set(() => ({ [key]: handler })),
}));

export default useGlobalHandlers;
