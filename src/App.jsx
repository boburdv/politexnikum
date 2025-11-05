import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import CategoryPage from "./components/Category";
import AdCategory from "./components/AdCategory";
import AdminPanel from "./pages/Admin";
import AdDetail from "./components/AdDetail";
import ChatPage from "./pages/AllChats";
import Auth from "./pages/Auth";
import About from "./pages/About";

function AppWrapper() {
  const location = useLocation();
  const hideLayout = ["/auth", "/chat", "/admin"].some((path) => location.pathname.startsWith(path));

  return (
    <div className="flex flex-col min-h-screen">
      {!hideLayout && <Header />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:categoryName" element={<CategoryPage />} />
          <Route path="/category/:categoryName" element={<AdCategory />} />
          <Route path="/ad/:adId" element={<AdDetail />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
      {!hideLayout && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}
