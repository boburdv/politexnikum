import { create } from "zustand";
import { supabase } from "../supabase";

export const useAuthStore = create((set) => ({
  user: null,
  loading: true,

  init: async () => {
    const { data } = await supabase.auth.getUser();
    set({ user: data.user, loading: false });

    supabase.auth.onAuthStateChange((_, session) => {
      set({ user: session?.user ?? null, loading: false });
    });
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null });
  },
}));
