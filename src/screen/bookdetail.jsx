import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { hookBooks } from '../hooks/books.hook';
import './bookdetail.css';


function BookDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // 상태 3종 세트
  const [bookData, setBookData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 페이지 진입 시 책 정보 가져오기
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const result = await hookBooks('GET', { id });
        setBookData(result);
      } catch (err) {
        console.error('도서 조회 실패:', err);
        setError('해당 도서를 찾을 수 없습니다.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  const handleBack = () => {
    navigate('/books');
  };


const handleEdit = () => {
  navigate("/books/submit", { state: { id: bookData.id } }); // submit으로 수정, 파람으로 id 자체를 넘겨야 함
};


const handleDelete = async () => {
  if (!window.confirm(`"${bookData.title}"을(를) 정말 삭제하시겠습니까?`)) {
    return;
  }

  try {
    await hookBooks('DELETE', { id: bookData.id });
    alert('삭제되었습니다.');
    navigate('/books');
  } catch (err) {
    console.error('삭제 중 오류:', err);
    alert('삭제 중 오류가 발생했습니다.');
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




// 로딩 중 표시
if (isLoading) {
  return (
    <div className="book-detail-page">
      <main className="main-content">
        <p style={{ textAlign: 'center', fontSize: '20px', marginTop: '60px' }}>
          도서 정보를 불러오는 중...
        </p>
      </main>
    </div>
  );
}

// 에러 또는 책 없음
if (error || !bookData) {
  return (
    <div className="book-detail-page">
      <main className="main-content">
        <button className="back-button" onClick={handleBack}>
          ← 뒤로 가기
        </button>
        <p style={{ textAlign: 'center', fontSize: '20px', marginTop: '60px' }}>
          {error || '해당 도서를 찾을 수 없습니다.'}
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
