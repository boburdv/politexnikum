import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../supabase";
import { HeartIcon, ChatBubbleLeftRightIcon, TagIcon, CalendarIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { LiaTelegramPlane } from "react-icons/lia";

const LS_KEY = "favorites_ads";

function readFavorites() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY)) || [];
  } catch {
    return [];
  }
}

export default function AdDetail() {
  const { adId } = useParams();
  const navigate = useNavigate();

  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState(readFavorites);

  const toggleFavorite = useCallback((id) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id];
      localStorage.setItem(LS_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);

      const { data, error } = await supabase.from("ads").select("*").eq("id", adId).single();

      if (cancelled) return;

      setAd(error ? null : data);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [adId]);

  const view = useMemo(() => {
    if (!ad) {
      return {
        isFav: false,
        telegramLink: "",
        purchaseLink: "",
        createdText: "",
      };
    }

    const isFav = favorites.includes(ad.id);

    const telegramLink = ad.telegram?.startsWith("http") ? ad.telegram : `https://t.me/${ad.telegram?.replace("@", "")}`;

    const purchaseLink = `${telegramLink}?text=${encodeURIComponent(`Assalomu alaykum, "${ad.title}" e'loni boyicha murojat qilyapman`)}`;

    const createdText = ad.created_at ? new Date(ad.created_at).toLocaleString() : "";

    return { isFav, telegramLink, purchaseLink, createdText };
  }, [ad, favorites]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-ring loading-xl"></span>
      </div>
    );
  }

  if (!ad) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-center text-xl font-medium" style={{ color: "var(--text-main)" }}>
          Xatolik, e'lon topilmadi.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 lg:mt-16">
      <div className="flex flex-col lg:flex-row lg:gap-6 gap-0 rounded-lg shadow lg:h-[450px]" style={{ backgroundColor: "var(--bg-card)" }}>
        <figure className="flex-1 overflow-hidden rounded-t-lg lg:rounded-t-none lg:rounded-l-lg">
          <img src={ad.image_url} alt={ad.title} className="w-full h-64 sm:h-80 lg:h-full object-cover" />
        </figure>

        <div className="flex-1 p-4 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-center gap-2">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold" style={{ color: "var(--text-main)" }}>
                {ad.title}
              </h1>

              <button
                onClick={() => toggleFavorite(ad.id)}
                className="btn btn-circle btn-ghost"
                style={{
                  color: view.isFav ? "var(--error)" : "var(--text-secondary)",
                }}
              >
                {view.isFav ? <HeartSolid className="w-6 h-6" /> : <HeartIcon className="w-6 h-6" />}
              </button>
            </div>

            {ad.price && (
              <div className="rounded-lg p-3" style={{ backgroundColor: "var(--bg-muted)" }}>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  Narx
                </p>
                <p className="text-2xl font-bold" style={{ color: "var(--primary)" }}>
                  {ad.price} so'm
                </p>
              </div>
            )}

            <p
              style={{
                color: "var(--text-main)",
                opacity: 0.8,
                maxHeight: "6.5rem",
                overflowY: "auto",
              }}
            >
              {ad.description}
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <span
                className="badge badge-outline gap-1"
                style={{
                  backgroundColor: "var(--bg-card)",
                  color: "var(--text-secondary)",
                  borderColor: "var(--border)",
                }}
              >
                <TagIcon className="w-4 h-4" />
                {ad.category}
              </span>

              {ad.sub_category && (
                <span className="badge badge-soft badge-primary gap-1">
                  <TagIcon className="w-4 h-4" />
                  {ad.sub_category}
                </span>
              )}
            </div>

            {ad.created_at && (
              <div className="flex items-center gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                <CalendarIcon className="w-4 h-4" />
                {view.createdText}
              </div>
            )}

            <div className="divider" style={{ borderColor: "var(--border)" }} />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <a href={view.purchaseLink} target="_blank" rel="noopener noreferrer" className="btn gap-2" style={{ backgroundColor: "var(--primary)", color: "var(--bg-card)" }}>
                Xarid qilish
              </a>

              <a href={view.telegramLink} target="_blank" rel="noopener noreferrer" className="btn btn-ghost gap-2" style={{ color: "var(--primary)" }}>
                <LiaTelegramPlane className="w-5 h-5" />
                Bog'lanish
              </a>

              <button onClick={() => navigate(`/chat?category=${encodeURIComponent(ad.category)}`)} className="btn btn-ghost gap-2" style={{ color: "var(--text-secondary)" }}>
                <ChatBubbleLeftRightIcon className="w-5 h-5" />
                Fikrlar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
