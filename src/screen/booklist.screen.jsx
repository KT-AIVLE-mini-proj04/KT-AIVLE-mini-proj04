import { useEffect, useState } from 'react';
import './booklist.screen.css';

function BookListScreen() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/books')
      .then((res) => res.json())
      .then((data) => setBooks(data))
      .catch((err) => console.error('도서 목록 조회 실패:', err));
  }, []);

  return (
    <div className="app">
      <header className="book-header">
        <h1>걷기가 서재</h1>
        <button className="login-btn">알림</button>
      </header>

      <main className="book-main">
        <div className="book-main-top">
          <h2>도서 목록</h2>
          <button className="search-box">🔍 제목, 저자 검색</button>
        </div>

        <section className="book-list">
          {books.map((book, index) => (
            <div className="book-card" key={`${book.id}-${index}`}>
              <div className="book-cover" onClick={() => navigate('/book-detail')}>
                {book.coverImageUrl && (
                  <img src={book.coverImageUrl} alt={book.title} />
                )}
              </div>

              <h3>{book.title}</h3>
              <p>저자 · {book.author}</p>
              <p>{book.updatedAt.slice(0, 10)}</p>
            </div>
          ))}

          <div className="book-card">
            <div className="book-cover add-cover"  onClick={() => navigate('/book-new')}> 
              <span>+</span>
              <p>새 도서 등록</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="book-footer">
        <h2>걷기가 서재</h2>
        <div className="footer-info">
          <p>이름작성 · 개인정보처리방침 · 고객센터</p>
          <p>문의: 010-0000-0000</p>
          <p>© 2026. 걷기가 서재 Co., Ltd. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default BookListScreen;