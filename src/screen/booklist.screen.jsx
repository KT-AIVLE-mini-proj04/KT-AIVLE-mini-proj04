import { useEffect, useState } from "react";
import "./booklist.screen.css";
import { hookBookList } from "../hooks/bookList.hook.js";
import { Link, useNavigate } from "react-router";

function BookListScreen() {
  const [bookList, setBookList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await hookBookList();
        setBookList(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("도서 목록 조회 실패:", err);
      }
    };
    fetchBooks();
  }, []);

  return (
    <div className="app">
      <main className="book-main">
        <div className="book-main-top">
          <h2>도서 목록</h2>
          <button className="search-box">🔍 제목, 저자 검색</button>
        </div>

        <section className="book-list">
          {bookList.map((book, index) => (
            <div className="book-card" key={`${book.id}-${index}`}>
              <Link to={`${book.id}`}>
                <div className="book-cover" onClick={() => navigate(`${book.id}`)}>
                  {book.coverImageUrl ? (
                    <img src={book.coverImageUrl} alt={book.title} />
                  ) : (
                    <div className="empty-cover">표지 없음</div>
                  )}
                </div>
              </Link>

              <h3>{book.title}</h3>

              <p>저자 · {book.author}</p>

              <p>{book.updatedAt?.slice(0, 10)}</p>
            </div>
          ))}

          <Link to={"submit"}>
            <div className="book-card">
              <div className="book-cover add-cover">
                <span>+</span>
                <p>새 도서 등록</p>
              </div>
            </div>
          </Link>
        </section>
      </main>
    </div>
  );
}

export default BookListScreen;
