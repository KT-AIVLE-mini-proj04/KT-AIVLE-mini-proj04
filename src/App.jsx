import { useEffect, useState } from "react";
import { Route, Routes } from "react-router";
import "@/App.css";
import MainLayout from "@/common/layout/MainLayout.jsx";
import MainPage from "@screen/main.screen.jsx";
import BookList from "@screen/booklist.screen.jsx";
import BookDetail from "@screen/bookdetail/BookDetailPage.jsx";
import SubmitEdit from "@screen/submit_edit.screen.jsx";
import NotFound from "@screen/NotFound.screen.jsx";
import LoginScreen from "@screen/login.screen.jsx";
import SignupScreen from "@screen/signup.screen.jsx";
import EpisodeScreen from "@screen/episode.screen.jsx";
import { refreshAccessToken } from "@hooks/auth/refreshAccessToken.hook";

function App() {
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const restoreAuth = async () => {
      try {
        await refreshAccessToken();
      } catch (_) {
        // 리프레시 토큰 없음 or 만료 → 비로그인 상태로 진행
      } finally {
        setAuthReady(true);
      }
    };
    restoreAuth();
  }, []);

  if (!authReady) return null;

  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/users" element={<SignupScreen />} />
        <Route element={<MainLayout />}>
          <Route index element={<MainPage />} />
          <Route path="books">
            <Route index element={<BookList />} />
            <Route path=":id" element={<BookDetail />} />
            <Route path=":id/edit" element={<SubmitEdit />} />
            <Route path="submit" element={<SubmitEdit />} />
          </Route>
        </Route>
        <Route path="/episodes/:id" element={<EpisodeScreen />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
