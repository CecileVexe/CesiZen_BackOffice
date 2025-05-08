import { useEffect, useState } from "react";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/600.css";
import "@fontsource/montserrat/700.css";
import "@fontsource/fredoka/400.css";
import "@fontsource/fredoka/500.css";
import "@fontsource/fredoka/600.css";
import "@fontsource/fredoka/700.css";
import { Route, Routes } from "react-router-dom";
import Index from "./pages";
import Erreur404 from "./pages/erreur404";
import Role from "./pages/role";
import Article from "./pages/article";
import Login from "./pages/login";
import ArticleCategory from "./pages/articleCategory";
import StatsPage from "./pages/dashbord";
import EmotionCategory from "./pages/emotionCategory";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import Erreur401 from "./pages/Error401";
import Emotion from "./pages/emotions";

function App() {
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    setHeaderHeight(document.querySelector("#header")?.clientHeight || 0);
  }, []);

  return (
    <div className="app" style={{ height: `calc(100vh - ${headerHeight}px)` }}>
      <Routes>
        <Route path="/users" element={<Index />} />
        <Route path="/articles" element={<Article />} />
        <Route path="/roles" element={<Role />} />
        <Route path="*" element={<Erreur404 />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<StatsPage />} />
        <Route path="/article-categories" element={<ArticleCategory />} />
        <Route path="/emotion-categories" element={<EmotionCategory />} />
        <Route path="/emotions" element={<Emotion />} />
        <Route
          path="/"
          element={
            <>
              <SignedIn>
                <Article />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          }
        />
        <Route path="*" element={<Erreur404 />} />
        <Route path="/401" element={<Erreur401 />} />
      </Routes>
    </div>
  );
}

export default App;
