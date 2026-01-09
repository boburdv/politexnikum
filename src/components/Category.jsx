import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabase";

export default function CategoryPage() {
  const { categoryName } = useParams();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const descRef = useRef(null);
  const [descHeight, setDescHeight] = useState("auto");

  useEffect(() => {
    setLoading(true);
    supabase
      .from("static")
      .select("*")
      .ilike("name", categoryName)
      .single()
      .then(({ data, error }) => {
        if (error) throw error;
        setCategory(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [categoryName]);

  useEffect(() => {
    if (descRef.current) {
      if (showFullDescription) {
        setDescHeight(descRef.current.scrollHeight + "px");
      } else {
        const lineHeight = parseInt(window.getComputedStyle(descRef.current).lineHeight);
        const maxLines = 5;
        setDescHeight(lineHeight * maxLines + "px");
      }
    }
  }, [showFullDescription, category]);

  const Skeleton = () => (
    <div className="md:flex gap-8 w-full animate-pulse">
      <div className="md:w-1/2 w-full aspect-3/2 lg:aspect-[4/2.7] rounded-md bg-gray-200" />
      <div className="md:w-1/2 w-full mt-6 md:mt-0 space-y-4">
        <div className="h-8 w-2/3 bg-gray-200 rounded" />
        <div className="h-4 w-full bg-gray-200 rounded" />
        <div className="h-4 w-full bg-gray-200 rounded" />
        <div className="h-4 w-full bg-gray-200 rounded" />
        <div className="h-4 w-5/6 bg-gray-200 rounded" />
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-4 lg:my-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-center">
        {loading ? (
          <Skeleton />
        ) : category ? (
          <div className="md:flex gap-8 w-full">
            <div className="md:w-1/2 w-full aspect-[3/2] overflow-hidden">
              <img src={category.image_url || "/no-image.webp"} alt={category.name} className="w-full h-full object-cover rounded-md" />
            </div>

            <div className="md:w-1/2 w-full mt-4 md:mt-0">
              <h1 className="text-3xl font-bold mb-4">{category.name}</h1>

              <div
                ref={descRef}
                style={{
                  height: descHeight,
                  overflow: "hidden",
                  transition: "height 0.8s ease",
                }}
                className="text-gray-700 whitespace-pre-line"
              >
                {category.description}
              </div>

              {category.description?.split("\n").join(" ").length > 100 && (
                <button className="mt-2 text-blue-600 text-sm cursor-pointer hover:underline" onClick={() => setShowFullDescription(!showFullDescription)}>
                  {showFullDescription ? "Kamroq o'qish" : "Ko'proq o'qish"}
                </button>
              )}
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">Ma'lumot topilmadi</p>
        )}
      </div>
      <div>
        {category?.students?.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-3">O‘quvchilar ro‘yxati</h2>

            <div className="max-h-[400px] overflow-y-auto overflow-x-auto border border-gray-200 rounded-md">
              <table className="min-w-full text-sm">
                <thead className="sticky top-0 bg-base-200 z-10">
                  <tr className="text-left">
                    <th className="px-4 py-3 font-semibold">#</th>
                    <th className="px-4 py-3 font-semibold">Ism</th>
                    <th className="px-4 py-3 font-semibold">Familiya</th>
                    <th className="px-4 py-3 font-semibold">Bosqich</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {category.students.map((student, i) => (
                    <tr key={i} className="hover:bg-base-200 transition-colors">
                      <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                      <td className="px-4 py-3 font-medium">{student.first_name}</td>
                      <td className="px-4 py-3">{student.last_name}</td>
                      <td className="px-4 py-3">{student.group_name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
