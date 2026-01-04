import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../supabase";
import { UserIcon } from "@heroicons/react/16/solid";
import { FaShoppingCart } from "react-icons/fa";

export default function CategoryAds() {
  const { categoryName } = useParams();
  const decodedCategory = decodeURIComponent(categoryName);

  const [category, setCategory] = useState(null);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedSub, setSelectedSub] = useState("");
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => setUser(session?.user ?? null));
    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => supabase.auth.signOut();

  useEffect(() => {
    setLoading(true);
    supabase
      .from("dynamic")
      .select("*")
      .ilike("name", decodedCategory)
      .then(({ data }) => {
        if (!data?.length) return;
        const current = data[0];
        setCategory(current);
        setSubCategories(current.sub || []);
        return supabase.from("ads").select("*").eq("category", decodedCategory);
      })
      .then(({ data }) => setAds(data || []))
      .finally(() => setLoading(false));
  }, [decodedCategory]);

  const filteredAds = selectedSub ? ads.filter((ad) => ad.sub_category?.toLowerCase() === selectedSub.toLowerCase()) : ads;

  if (!category && !loading) return <div className="text-center mt-32">Kategoriya topilmadi</div>;

  const skeletonCards = Array.from({ length: 5 }, (_, i) => <div key={i} className="bg-gray-200 animate-pulse aspect-[3/4.1] rounded-lg" />);

  return (
    <>
      <div className="sticky top-0 z-30 bg-white border-b border-base-200 mb-4">
        <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between">
          {loading ? (
            <div className="w-full animate-pulse">
              <div className="h-7 w-64 bg-gray-200 rounded mb-3" />
              <div className="flex gap-2 overflow-hidden">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-10 w-24 bg-gray-200 rounded-sm" />
                ))}
              </div>
            </div>
          ) : (
            <>
              <h2 className="lg:text-2xl text-[20px] font-medium text-gray-600 line-clamp-1">{category.name} bo'yicha e'lonlar</h2>
              <div className="flex gap-4 items-center">
                <button className="text-gray-600">
                  <FaShoppingCart />
                </button>
                {!user ? (
                  <Link to="/auth" className="btn btn-primary btn-sm gap-1">
                    Kirish <UserIcon className="w-4 h-4" />
                  </Link>
                ) : (
                  <div className="dropdown dropdown-end">
                    <button className="rounded-full overflow-hidden">
                      <div className="bg-primary text-white w-8 h-8 flex items-center justify-center">{user.user_metadata?.full_name?.[0]?.toUpperCase() ?? "U"}</div>
                    </button>
                    <ul className="dropdown-content menu bg-base-100 rounded-box w-52 shadow mt-3 p-2">
                      <li>
                        <span>Ism: {user.user_metadata?.full_name}</span>
                      </li>
                      <li>
                        <Link to="/admin">Admin panel</Link>
                      </li>
                      <li>
                        <button onClick={handleLogout}>Hisobdan chiqish</button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {!loading && subCategories.length > 0 && (
          <div className="max-w-6xl mx-auto px-4 py-2 flex gap-2 overflow-x-auto scroll-hidden border-t border-base-200">
            <button onClick={() => setSelectedSub("")} className={`btn h-9 btn-soft ${selectedSub === "" ? "btn-primary" : ""}`}>
              Barchasi
            </button>
            {subCategories.map((sub, i) => (
              <button key={i} onClick={() => setSelectedSub(sub)} className={`btn h-9 btn-soft ${selectedSub === sub ? "btn-primary" : ""}`}>
                {sub}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="max-w-6xl mx-auto px-4 mb-24">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">{skeletonCards}</div>
        ) : filteredAds.length === 0 ? (
          <div className="text-center text-gray-500 text-lg py-24">Hozircha joylangan e'lonlar topilmadi</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-5">
            {filteredAds.map((ad) => (
              <Link key={ad.id} to={`/ad/${ad.id}`}>
                <div className="border border-base-300 rounded-lg shadow hover:shadow-lg transition overflow-hidden">
                  <figure className="relative aspect-[3/3.5] bg-gray-100">
                    <button className="btn btn-circle btn-sm absolute top-2 right-2 bg-white/70 hover:bg-white">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-[1.2em]">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                        />
                      </svg>
                    </button>
                    <img src={ad.image_url} alt={ad.title} className="w-full h-full object-cover" />
                  </figure>
                  <div className="px-4 py-2">
                    <h2 className="text-base font-medium line-clamp-1">{ad.title}</h2>
                    {ad.price && <p className="font-semibold text-primary line-clamp-1">{ad.price}</p>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
