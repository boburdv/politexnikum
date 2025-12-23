import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../supabase";

export default function Home() {
  const [staticCategories, setStaticCategories] = useState([]);
  const [dynamicCategories, setDynamicCategories] = useState([]);

  useEffect(() => {
    supabase
      .from("static")
      .select("*")
      .then(({ data }) => data && setStaticCategories(data));
    supabase
      .from("categories")
      .select("*")
      .then(({ data }) => data && setDynamicCategories(data));
  }, []);

  return (
    <div>
      {/* HERO */}
      <div className="relative w-full h-[450px] md:h-[500px] lg:h-[550px] mt-[105px]">
        <img src="/home-img.jpg" alt="hero" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <div className="w-full max-w-6xl text-white text-center md:text-left space-y-4 md:space-y-6 px-4">
            <span className="inline-block bg-primary px-4 py-1.5 rounded-full text-sm font-semibold mx-auto md:mx-0">RISHTON TUMAN</span>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-snug mx-auto md:mx-0 uppercase">1-son Politeхnikumi</h1>

            <p className="text-base md:text-lg font-medium text-white/90 max-w-lg mx-auto md:mx-0">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolores autem fugit itaque odio, iusto quis suscipit reprehenderit voluptas explicabo?
            </p>
          </div>
        </div>
      </div>

      {/* STATIC CATEGORIES */}
      <div className="max-w-6xl mx-auto mt-24 mb-10 px-4">
        <h2 className="text-2xl md:text-3xl font-medium text-gray-900 mb-8">Kasb yo'nalishlari</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 lg:gap-10">
          {staticCategories.length === 0
            ? Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="flex flex-col gap-4 rounded-lg overflow-hidden animate-pulse">
                  <div className="h-48 w-full bg-gray-300"></div>
                  <div className="h-4 w-28 bg-gray-300 mx-4 mt-2 rounded"></div>
                  <div className="h-4 w-full bg-gray-300 mx-4 rounded"></div>
                  <div className="h-4 w-full bg-gray-300 mx-4 rounded"></div>
                </div>
              ))
            : staticCategories.map((cat) => (
                <Link key={cat.id} to={`/${cat.name}`}>
                  <div className="card border-base-300 border hover:shadow transition-shadow duration-300 overflow-hidden">
                    {/* <figure className="aspect-[3/2] overflow-hidden">
                      <img src={cat.image_url || "/no-image.webp"} alt={cat.name} className="w-full h-full object-cover transition-transform" />
                    </figure> */}
                    <div className="card-body p-4 md:p-5">
                      <h2 className="card-title text-xl font-semibold">{cat.name}</h2>
                      <p className="line-clamp-3">{cat.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
        </div>
      </div>

      {/* DYNAMIC CATEGORIES */}
      <div className="max-w-6xl mx-auto mt-20 mb-24 px-4">
        <h2 className="text-2xl md:text-3xl font-medium text-gray-900 mb-8">Yarmarka</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-10">
          {dynamicCategories.length === 0
            ? Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="card shadow animate-pulse overflow-hidden">
                  <div className="aspect-square bg-gray-300"></div>
                  <div className="p-5.5">
                    <div className="h-4 w-3/4 bg-gray-300 mx-auto rounded"></div>
                  </div>
                </div>
              ))
            : dynamicCategories.map((cat) => (
                <Link key={cat.id} to={`/category/${encodeURIComponent(cat.name)}`}>
                  <div className="card border border-base-300 hover:shadow transition overflow-hidden">
                    <figure className="aspect-square bg-gray-100 flex items-center justify-center">
                      <img src={cat.image_url || "/no-image.webp"} alt={cat.name} className="w-full h-full object-cover" />
                    </figure>
                    <div className="card-body text-center p-4">
                      <h3 className="text-lg font-semibold">{cat.name}</h3>
                    </div>
                  </div>
                </Link>
              ))}
        </div>
      </div>
    </div>
  );
}
