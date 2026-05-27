import { useEffect, useState } from "react";
import { Route, Routes } from "react-router";
import "@/App.css";
import MainLayout from "@/common/layout/MainLayout.jsx";
import MainPage from "@screen/main.screen.jsx";
import BookList from "@screen/booklist.screen.jsx";
import BookDetail from "@screen/bookdetail.jsx";
import SubmitEdit from "@screen/submit_edit.screen.jsx";
import NotFound from "@screen/NotFound.screen.jsx";

function App() {
  return (
    <>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<MainPage />} />
          <Route path="books">
            <Route index element={<BookList />} />
            <Route path=":id" element={<BookDetail />} />
            <Route path=":id/edit" element={<SubmitEdit />} />
            <Route path="submit" element={<SubmitEdit />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
