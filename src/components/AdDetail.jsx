import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { HeartIcon, ChatBubbleLeftRightIcon, TagIcon, CalendarIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { LiaTelegramPlane } from "react-icons/lia";

const LS_KEY = "favorites_ads";

export default function AdDetail() {
  const { adId } = useParams();
  const navigate = useNavigate();

  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(LS_KEY)) || [];
    setFavorites(saved);
  }, []);

  const toggleFavorite = (id) => {
    const updated = favorites.includes(id) ? favorites.filter((f) => f !== id) : [...favorites, id];
    setFavorites(updated);
    localStorage.setItem(LS_KEY, JSON.stringify(updated));
  };

  useEffect(() => {
    const fetchAd = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("ads").select("*").eq("id", adId).single();
      setAd(error ? null : data);
      setLoading(false);
    };
    fetchAd();
  }, [adId]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-ring loading-xl"></span>
      </div>
    );
  if (!ad) return <p className="text-center mt-20 text-xl">Eʼlon topilmadi</p>;

  const isFav = favorites.includes(ad.id);
  const telegramLink = ad.telegram?.startsWith("http") ? ad.telegram : `https://t.me/${ad.telegram?.replace("@", "")}`;
  const purchaseLink = `${telegramLink}?text=${encodeURIComponent(`Assalomu alaykum, "${ad.title}" e'loni boyicha murojat qilyapman`)}`;

  return (
    <div className="max-w-6xl mx-auto p-4 lg:mt-16">
      <div className="flex flex-col lg:flex-row lg:gap-6 gap-0 bg-base-100 rounded-lg shadow lg:h-[450px]">
        <figure className="flex-1 overflow-hidden rounded-t-lg lg:rounded-t-none lg:rounded-l-lg">
          <img src={ad.image_url} alt={ad.title} className="w-full h-64 sm:h-80 lg:h-full object-cover" />
        </figure>

        <div className="flex-1 p-4 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-center gap-2">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">{ad.title}</h1>
              <button onClick={() => toggleFavorite(ad.id)} className="btn btn-circle btn-ghost">
                {isFav ? <HeartSolid className="w-6 h-6 text-error" /> : <HeartIcon className="w-6 h-6" />}
              </button>
            </div>

            {ad.price && (
              <div className="bg-base-200 rounded-lg p-3">
                <p className="text-sm opacity-70">Narx</p>
                <p className="text-2xl font-bold text-primary">{ad.price} so'm</p>
              </div>
            )}

            <p className="opacity-80 lg:max-h-26 overflow-y-auto">{ad.description}</p>
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {ad.sub_category && (
                <span className="badge badge-outline gap-1">
                  <TagIcon className="w-4 h-4" />
                  {ad.sub_category}
                </span>
              )}
              <span className="badge badge-primary badge-outline gap-1">
                <TagIcon className="w-4 h-4" />
                {ad.category}
              </span>
            </div>

            {ad.created_at && (
              <div className="flex items-center gap-2 text-sm opacity-60">
                <CalendarIcon className="w-4 h-4" />
                {new Date(ad.created_at).toLocaleString()}
              </div>
            )}

            <div className="divider"></div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <a href={purchaseLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary gap-2">
                Xarid qilish
              </a>

              <a href={telegramLink} target="_blank" rel="noopener noreferrer" className="btn btn-ghost gap-2">
                <LiaTelegramPlane className="w-5 h-5" />
                Bog'lanish
              </a>

              <button onClick={() => navigate(`/chat?category=${encodeURIComponent(ad.category)}`)} className="btn btn-ghost gap-2">
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
