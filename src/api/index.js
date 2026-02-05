import { supabase } from "../supabase";

/* =========================
   AUTH
========================= */
export async function authGetUser() {
  return supabase.auth.getUser();
}

export async function authLogin(email, password) {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function authSignup(email, password, fullName) {
  return supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });
}

export async function authGoogle() {
  return supabase.auth.signInWithOAuth({ provider: "google" });
}

export async function authLogout() {
  return supabase.auth.signOut();
}

/* =========================
   NEWS
========================= */
export async function fetchNews() {
  return supabase.from("news").select("*").order("created_at", { ascending: false });
}

export async function addNews({ description, image_url }) {
  return supabase.from("news").insert([{ description, image_url }]).select();
}

export async function updateNews(id, { description, image_url }) {
  return supabase
    .from("news")
    .update({ description, ...(image_url ? { image_url } : {}) })
    .eq("id", id)
    .select();
}

export async function deleteNews(id) {
  return supabase.from("news").delete().eq("id", id);
}

/* =========================
   STAFF
========================= */
export async function fetchStaffActive() {
  return supabase.from("staff").select("id,name,description,photo_path,order_index,is_active").eq("is_active", true).order("order_index", { ascending: true });
}

export async function fetchStaffAll() {
  return supabase.from("staff").select("id,name,description,photo_path,order_index,is_active").order("order_index", { ascending: true });
}

export async function addStaff(payload) {
  return supabase.from("staff").insert([payload]).select();
}

export async function updateStaff(id, payload) {
  return supabase.from("staff").update(payload).eq("id", id).select();
}

export async function deleteStaff(id) {
  return supabase.from("staff").delete().eq("id", id);
}

/* =========================
   ADS
========================= */
export async function fetchAds() {
  return supabase.from("ads").select("*").order("created_at", { ascending: false });
}

export async function fetchAdsByCategory(category) {
  return supabase.from("ads").select("*").eq("category", category);
}

export async function fetchAdById(adId) {
  return supabase.from("ads").select("*").eq("id", adId).single();
}

export async function addAd(payload) {
  return supabase.from("ads").insert([payload]).select();
}

export async function updateAd(id, payload) {
  return supabase.from("ads").update(payload).eq("id", id).select();
}

export async function deleteAd(id) {
  return supabase.from("ads").delete().eq("id", id);
}

/* =========================
   CATEGORIES
========================= */
export async function fetchStaticCategories() {
  return supabase.from("static").select("*").order("name");
}

export async function fetchDynamicCategories() {
  return supabase.from("dynamic").select("*");
}

export async function fetchDynamicCategoryByName(name) {
  return supabase.from("dynamic").select("*").ilike("name", name);
}

export async function fetchStaticCategoryLikeName(name) {
  return supabase.from("static").select("id, name, description, image_url, students").ilike("name", `%${name}%`).maybeSingle();
}

export async function fetchChatMessages(chatId) {
  return supabase.from("chats").select("messages").eq("id", chatId).single();
}

export async function fetchChats() {
  return supabase.from("chats").select("*");
}

export async function upsertChat(id, messages = []) {
  return supabase.from("chats").insert([{ id, messages }]).select().single();
}

export async function updateChatMessages(chatId, messages) {
  return supabase.from("chats").update({ messages }).eq("id", chatId);
}
