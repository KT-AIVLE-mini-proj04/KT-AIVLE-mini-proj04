import React from "react";
import { useParams, useNavigate } from 'react-router-dom';
import './bookdetail.css';

const booksData = [
  {
    id: 1,
    title: "별빛 아래의 서점",
    author: "홍길동",
    content: "작은 마을 서점의 1년을 담은 에세이",
    coverImageUrl: "",
    createdAt: "2026-04-24T09:00:00.000Z",
    updatedAt: "2026-04-24T09:00:00.000Z",
  },
  {
    id: 2,
    title: "비밀의 숲",
    author: "이선우",
    content: "오래된 숲 속 깊은 곳에 숨겨진 오두막과 그곳에서 벌어지는 마법 같은 이야기",
    coverImageUrl: "",
    createdAt: "2026-05-20T11:00:00.000Z",
    updatedAt: "2026-05-20T11:00:00.000Z",
  },
  {
    id: 3,
    title: "인공지능 시대의 생존법",
    author: "김철수",
    content: "급변하는 기술 트렌드 속에서 지치지 않고 자신만의 경쟁력을 가꾸는 실천 가이드",
    coverImageUrl: "",
    createdAt: "2026-05-21T14:30:00.000Z",
    updatedAt: "2026-05-21T14:30:00.000Z",
  },
];

function BookDetailPage() {

  const { id } = useParams(); // URL 파라미터에서 id 추출 (예: /books/3 → id는 "3" 문자열)

  const navigate = useNavigate(); // 뒤로 가기 기능

  const bookData = booksData.find((book) => book.id === Number(id)); // id는 문자열이므로 Number()로 숫자로 변환하여 비교

  const handleBack = () => {
    navigate('/books');
  };


  const handleEdit = () => {
    navigate(`/books/edit?id=${bookData.id}`);
  };


  const handleDelete = () => {
    if (window.confirm(`"${bookData.title}"을(를) 정말 삭제하시겠습니까?`)) {
      console.log("삭제 진행, book id:", bookData.id);
      navigate('/books'); // 삭제 후 책 목록 페이지로 이동
    }
  }; 


  const formatDate = (isoString) => {  // 날짜
    if (!isoString) return "";
    return new Date(isoString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };




  if (!bookData) { // 해당 id에 맞는 책이 없는 경우
    return (
      <div className="book-detail-page">
        <header className="header">
          <h1 className="title">걷기가 서재</h1>
          <button className="notification-btn">알림</button>
        </header>
        <main className="main-content">
          <button className="back-button" onClick={() => navigate(-1)}>
            ← 뒤로 가기
          </button>
          <p style={{ textAlign: 'center', fontSize: '20px', marginTop: '60px' }}>
            해당 도서를 찾을 수 없습니다.
          </p>
        </main>
      </div>
    );
  }  


  const hasCoverImage = 
  bookData.coverImageUrl && bookData.coverImageUrl.trim() !== '';

  return (
    <div className="book-detail-page">
      <main className="main-content">
        <button className="back-button" onClick={handleBack}>
          ← 뒤로 가기
        </button>


        <div className="book-detail-Card">
          <div className="book-cover">
            {hasCoverImage ? (
              <img
                src={bookData.coverImageUrl}
                alt={`${bookData.title} 표지`}
              />
            ) : (
              // Placeholder: 이미지 없을 때 보여줄 대체 UI
              <div className="book-cover-placeholder">
                <span className="placeholder-icon">📖</span>
                <span className="placeholder-text">{bookData.title}</span>
              </div>
            )}
          </div>

          <div className="book-info">
            <h2 className="book-title">제목: {bookData.title}</h2>
            <p className="book-author">저자: {bookData.author}</p>

            <h3 className="content-label">내용</h3>
            <div className="content-box">
              <p>{bookData.content}</p>
            </div>

            <p className="book-date">
              등록일: {formatDate(bookData.createdAt)}
            </p>

            <div className="action-buttons">
              <button className="btn-edit" onClick={handleEdit}>
                수정
              </button>
              <button className="btn-delete" onClick={handleDelete}>
                삭제
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default BookDetailPage;
