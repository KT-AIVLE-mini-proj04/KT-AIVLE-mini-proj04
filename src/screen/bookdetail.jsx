import React from "react";
import { Link, useParams, useNavigate } from "react-router";

const bookData = {
  id: 3,
  title: "인공지능 시대의 생존법",
  author: "김철수",
  content:
    "급변하는 기술 트렌드 속에서 지치지 않고 자신만의 경쟁력을 가꾸는 실천 가이드",
  coverImageUrl: "",
  createdAt: "2026-05-21T14:30:00.000Z",
  updatedAt: "2026-05-21T14:30:00.000Z",
};

function BookDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleBack = () => {
    console.log("뒤로가기 버튼 클릭");
  };

  const handleEdit = () => {
    navigate(`/books/${id}/edit`);
  };

  const formatDate = (isoString) => {
    if (!isoString) return "";
    return new Date(isoString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleDelete = () => {
    if (window.confirm(`"${bookData.title}"을(를) 정말 삭제하시겠습니까?`)) {
      console.log("삭제 진행, book id:", id);
    }
  };

  const hasCoverImage =
    bookData.coverImageUrl && bookData.coverImageUrl.trim() !== "";

  return (
    <div className="book-detail-page">
      <main className="main-content">
        <Link to={"/books"}>
          <button className="back-button" onClick={handleBack}>
            ← 뒤로 가기
          </button>
        </Link>

        <div className="book-detail-Card">
          <div className="book-cover">
            {hasCoverImage ? (
              <img
                src={bookData.coverImageUrl}
                alt={`${bookData.title} 표지`}
              />
            ) : (
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