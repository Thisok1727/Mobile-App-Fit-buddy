import { create } from "zustand";

export interface CourseItem {
  key: string;
  title: string;
  cover_i?: number;
}

interface FavState {
  favs: CourseItem[];
  addFav: (item: CourseItem) => void;
  removeFav: (key: string) => void;
  isFav: (key: string) => boolean;
}

export const useFavStore = create<FavState>((set, get) => ({
  favs: [],

  addFav: (item) => {
    const exists = get().favs.find((f) => f.key === item.key);
    if (!exists) set({ favs: [...get().favs, item] });
  },

  removeFav: (key) => set({ favs: get().favs.filter((f) => f.key !== key) }),

  isFav: (key) => get().favs.some((f) => f.key === key),
}));
