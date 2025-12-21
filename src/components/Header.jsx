import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { PhoneIcon, EnvelopeIcon, ClockIcon, UserIcon } from "@heroicons/react/16/solid";
import { FaInstagram } from "react-icons/fa";
import { SiTelegram } from "react-icons/si";
import { GrYoutube } from "react-icons/gr";
import { supabase } from "../supabase";

export default function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showHeader, setShowHeader] = useState(true);

  const socialLinks = [
    { icon: <SiTelegram className="w-4 h-4" />, href: "#" },
    { icon: <FaInstagram className="w-4 h-4" />, href: "#" },
    { icon: <GrYoutube className="w-4 h-4" />, href: "#" },
  ];

  /* ================= AUTH ================= */
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => setUser(session?.user ?? null));
    return () => listener.subscription.unsubscribe();
  }, []);

  /* ================= SCROLL HIDE ================= */
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const current = window.scrollY;
      setShowHeader(!(current > last && current > 80));
      last = current;
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className={`fixed top-0 left-0 right-0 shadow-xs z-50 bg-base-100 transition-transform duration-300 ${showHeader ? "translate-y-0" : "-translate-y-full"}`}>
      {/* ================= TOP INFO ================= */}
      <div className="bg-base-200 border-b border-base-300">
        <div className="max-w-6xl mx-auto flex justify-between items-center py-2 px-4 text-sm">
          {/* Left */}
          <div className="flex gap-5">
            <div className="flex items-center gap-1">
              <PhoneIcon className="w-4 h-4" /> (90) 123-4567
            </div>
            <div className="hidden md:flex items-center gap-1">
              <EnvelopeIcon className="w-4 h-4" /> info@politex.uz
            </div>
          </div>
          {/* Right */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <ClockIcon className="w-4 h-4" /> 8:00 - 18:00
            </div>
            <div className="hidden md:flex gap-2 ml-3">
              {socialLinks.map((s, i) => (
                <a key={i} href={s.href} className="p-1 rounded-lg bg-white hover:bg-primary hover:text-white">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ================= NAVBAR ================= */}
      <div className="navbar bg-base-100 py-4 pr-4 max-w-6xl mx-auto">
        {/* MOBILE HAMBURGER */}
        <div className="flex-none md:hidden">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-square btn-ghost">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-5 w-5 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </div>

            <ul tabIndex={-1} className="dropdown-content menu bg-base-100 rounded-box z-50 w-52 p-2 shadow-sm">
              {/* LOGO */}
              <li className="text-center mb-2">
                <span className="text-sm font-semibold text-gray-700">POLITEXNIKUM</span>
              </li>

              {/* MENU ITEMS */}
              <li className="hover:bg-gray-200 rounded">
                <Link to="/">Bosh sahifa</Link>
              </li>
              <li className="hover:bg-gray-200 rounded">
                <Link to="/">Yarmarka</Link>
              </li>
              <li className="hover:bg-gray-200 rounded">
                <Link to="/admin">Admin</Link>
              </li>
              <li className="hover:bg-gray-200 rounded">
                <Link to="/about">Haqida</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* LOGO (desktop) */}
        <div className="flex-1 justify-center md:justify-start">
          <Link to="/" className="hidden md:block text-[25px] font-semibold text-gray-700">
            POLITEXNIKUM
          </Link>
        </div>

        {/* DESKTOP MENU */}
        <nav className="hidden md:flex gap-6 text-sm font-medium">
          <Link to="/" className="hover:text-primary">
            Bosh sahifa
          </Link>
          <Link to="/about" className="hover:text-primary">
            Haqida
          </Link>
          <Link to="/" className="hover:text-primary">
            Yarmarka
          </Link>
          <Link to="/admin" className="hover:text-primary">
            Admin
          </Link>
        </nav>

        {/* AVATAR */}
        <div className="flex-none">
          {!user ? (
            <Link to="/auth" className="btn btn-primary btn-sm gap-1 ml-6">
              Kirish <UserIcon className="w-4 h-4" />
            </Link>
          ) : (
            <div className="dropdown dropdown-end">
              <button tabIndex={0} className="rounded-full overflow-hidden">
                <div className="bg-primary text-white w-8 h-8 flex items-center justify-center">{user.user_metadata?.full_name?.[0]?.toUpperCase() ?? "U"}</div>
              </button>
              <ul className="dropdown-content menu bg-base-100 rounded-box w-52 shadow mt-3 p-2">
                <li>
                  <span>{user.user_metadata?.full_name}</span>
                </li>
                <li>
                  <Link to="/chat">Izohlar</Link>
                </li>
                <li>
                  <button onClick={handleLogout}>Chiqish</button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
