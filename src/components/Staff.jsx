import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "../supabase";

const BUCKET = "staff-photos";
const SPEED = 45;

function StaffCard({ item, getPhotoUrl }) {
  const img = getPhotoUrl(item.photo_path);

  return (
    <div className="border my-2 border-base-300 shadow hover:shadow-md transition-all duration-300 flex flex-col gap-3 p-3 sm:p-3 bg-[var(--bg-card)] rounded-lg hover:-translate-y-0.5 w-[220px] sm:w-[240px] lg:w-[220px] shrink-0">
      <div className="w-full aspect-[3/3] rounded-lg overflow-hidden bg-base-200">
        {img ? (
          <img src={img} alt={item.name || "xodim"} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-sm opacity-60">Rasm yo‘q</div>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="text-xl font-semibold text-[var(--text-main)] leading-snug line-clamp-2">{item.name}</h3>
        <p className="text-sm text-[var(--text-secondary)] line-clamp-2 leading-relaxed">{item.description || "—"}</p>
      </div>
    </div>
  );
}

export default function Staff() {
  const trackRef = useRef(null);
  const laneRef = useRef(null);
  const rafRef = useRef(null);

  const pausedRef = useRef(false);
  const lastTimeRef = useRef(0);
  const stepRef = useRef(0);
  const rotateAccRef = useRef(0);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const canAuto = items.length >= 2;

  const getPhotoUrl = useCallback((photoPath) => {
    if (!photoPath) return null;
    if (/^https?:\/\//.test(photoPath)) return photoPath;
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(photoPath);
    return data?.publicUrl || null;
  }, []);

  useEffect(() => {
    let alive = true;

    (async () => {
      setLoading(true);

      const { data, error } = await supabase.from("staff").select("id,name,description,photo_path,order_index,is_active").eq("is_active", true).order("order_index", { ascending: true });

      if (!alive) return;

      if (!error && data) setItems(data);
      setLoading(false);
    })();

    return () => {
      alive = false;
    };
  }, []);

  const pause = () => {
    pausedRef.current = true;
  };

  const resume = () => {
    pausedRef.current = false;
  };

  const measureStep = useCallback(() => {
    const lane = laneRef.current;
    if (!lane) return 0;

    const first = lane.firstElementChild;
    if (!first) return 0;

    const cardW = first.getBoundingClientRect().width;
    const styles = window.getComputedStyle(lane);
    const gapStr = styles.columnGap || styles.gap || "0px";
    const gap = parseFloat(gapStr) || 0;

    return cardW + gap;
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || loading || !items.length) return;

    track.scrollLeft = 0;
    rotateAccRef.current = 0;
    lastTimeRef.current = performance.now();
    stepRef.current = measureStep();
  }, [loading, items.length, measureStep]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || loading || !canAuto) return;

    const tick = (now) => {
      const dt = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      if (!pausedRef.current) {
        track.scrollLeft += SPEED * dt;

        const step = stepRef.current || 0;
        if (step > 0) {
          rotateAccRef.current += SPEED * dt;

          const shifts = Math.floor(rotateAccRef.current / step);
          if (shifts > 0) {
            rotateAccRef.current -= shifts * step;
            track.scrollLeft -= shifts * step;

            setItems((prev) => {
              if (prev.length < 2) return prev;
              const n = shifts % prev.length;
              if (n === 0) return prev;
              return [...prev.slice(n), ...prev.slice(0, n)];
            });
          }
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    const onResize = () => {
      const t = trackRef.current;
      if (!t) return;
      t.scrollLeft = 0;
      rotateAccRef.current = 0;
      lastTimeRef.current = performance.now();
      stepRef.current = measureStep();
    };

    window.addEventListener("resize", onResize);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, [loading, canAuto, measureStep]);

  if (!loading && items.length === 0) return null;

  return (
    <div className="container mx-auto mt-20 mb-16 px-4">
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight flex items-center gap-2 text-[var(--text-main)]">
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--primary)] mt-1" />
          Xodimlar
        </h2>

        <p className="mt-1 text-sm md:text-base text-[var(--text-secondary)]">Texnikumda faoliyat yurituvchi xodimlar</p>
      </div>

      <div ref={trackRef} className="overflow-hidden" onMouseEnter={pause} onMouseLeave={resume} onTouchStart={pause} onTouchEnd={resume}>
        <div ref={laneRef} className="flex w-max gap-4 lg:gap-5 pr-4">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="border border-base-300 my-2 shadow rounded-lg p-3 bg-[var(--bg-card)] flex flex-col gap-3.5 w-[220px] sm:w-[240px] lg:w-[220px] shrink-0">
                  <div className="skeleton w-full aspect-[3/3] rounded-lg" />
                  <div className="skeleton h-5 w-dull rounded mt-2" />
                  <div className="skeleton h-3 w-full rounded" />
                  <div className="skeleton h-3 w-2/3 rounded" />
                </div>
              ))
            : items.map((x) => <StaffCard key={x.id} item={x} getPhotoUrl={getPhotoUrl} />)}
        </div>
      </div>
    </div>
  );
}
