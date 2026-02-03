import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";

import { addNews, deleteNews, fetchNews } from "../api";
import { supabase } from "../supabase";

const BUCKET = "news-image";

export default function NewsAdmin() {
  const searchRef = useRef(null);
  const deleteModalRef = useRef(null);

  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [saving, setSaving] = useState(false);

  const [newsToDelete, setNewsToDelete] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await fetchNews();
    if (data) setNews(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const uploadIfNeeded = useCallback(async () => {
    if (!image) return null;

    const ext = image.name.split(".").pop() || "jpg";
    const fileName = `${Date.now()}-${Math.random().toString(16).slice(2)}.${ext}`;

    const { error } = await supabase.storage.from(BUCKET).upload(fileName, image, { upsert: true });

    if (error) {
      toast.error("Rasm yuklanmadi");
      return null;
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
    return data?.publicUrl || null;
  }, [image]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) return toast.error("Matnni kiriting");

    setSaving(true);

    try {
      const image_url = await uploadIfNeeded();
      const { data } = await addNews({ description: description.trim(), image_url });
      if (data?.[0]) setNews((prev) => [data[0], ...prev]);

      toast.success("Yangilik qo‘shildi");
      setDescription("");
      setImage(null);
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (item) => {
    setNewsToDelete(item);
    deleteModalRef.current?.showModal();
  };

  const handleDelete = async () => {
    if (!newsToDelete) return;

    await deleteNews(newsToDelete.id);
    setNews((prev) => prev.filter((n) => n.id !== newsToDelete.id));

    setNewsToDelete(null);
    deleteModalRef.current?.close();
    toast.error("Yangilik o‘chirildi");
  };

  const filteredNews = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return news;
    return news.filter((n) => (n.description || "").toLowerCase().includes(q));
  }, [news, searchQuery]);

  return (
    <div className="flex flex-col sm:flex-row gap-6">
      <div className="flex-1 max-w-xl bg-base-100 shadow card p-6">
        <h2 className="card-title mb-4 text-center">Yangilik qo‘shish</h2>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <textarea placeholder="Yangilik matni, maksimal 3 qator" className="textarea w-full min-h-[120px]" value={description} onChange={(e) => setDescription(e.target.value)} />

          <input type="file" className="file-input w-full" onChange={(e) => setImage(e.target.files?.[0] || null)} />

          <button className="btn btn-primary w-full" disabled={saving}>
            {saving && <span className="loading loading-spinner"></span>}
            Qo‘shish
          </button>
        </form>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-5">
          <input ref={searchRef} type="text" className="input grow" placeholder="Yangilik bo‘yicha qidirish..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          <kbd className="kbd kbd-sm">⌘</kbd>
          <kbd className="kbd kbd-sm">K</kbd>
        </div>

        <div className="overflow-y-auto h-[448px] space-y-4 p-0.5 pr-1.5">
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="bg-base-100 shadow rounded-lg p-4 animate-pulse">
                  <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                </div>
              ))
            : filteredNews.map((item) => (
                <div key={item.id} className="bg-base-100 shadow transition-shadow hover:shadow-md rounded-lg p-4 flex justify-between items-center">
                  <p className="text-sm text-gray-600 line-clamp-2 pr-2">{item.description}</p>

                  <button className="btn btn-circle btn-ghost" onClick={() => confirmDelete(item)}>
                    <TrashIcon className="w-5 h-5 text-red-600" />
                  </button>
                </div>
              ))}
        </div>
      </div>

      <dialog ref={deleteModalRef} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Rostdan o‘chirmoqchimisiz?</h3>
          <p className="py-4">Bu amalni qaytarib bo‘lmaydi.</p>
          <div className="modal-action">
            <button className="btn" onClick={() => deleteModalRef.current?.close()}>
              Bekor qilish
            </button>
            <button className="btn btn-error" onClick={handleDelete}>
              <TrashIcon className="w-5 h-5" />
              O‘chirish
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
