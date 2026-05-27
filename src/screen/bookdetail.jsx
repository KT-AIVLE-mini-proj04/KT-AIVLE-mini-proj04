import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from 'react-router';
import { hookBooks } from '../hooks/books.hook';
import { hookAITTS } from '../hooks/tts_mp3.hook';
import './bookdetail.css';


function BookDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [bookData, setBookData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [apiKey, setApiKey]         = useState('');
  const [audioSrc, setAudioSrc]     = useState('');
  const [isTtsLoading, setIsTtsLoading] = useState(false);
  const [ttsError, setTtsError]     = useState('');

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const result = await hookBooks('GET', { id });
        setBookData(result);
        const saved = result.audioUrl || localStorage.getItem(`audio_${result.id}`) || '';
        setAudioSrc(saved);
      } catch (err) {
        console.error('도서 조회 실패:', err);
        setError('해당 도서를 찾을 수 없습니다.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchBook();
  }, [id, location.key]);

  const handleBack = () => {
    navigate('/books');
  };


  const handleEdit = () => {
    navigate("/books/submit", { state: { id: bookData.id } });
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


  const handleTtsGenerate = async () => {
    if (!apiKey.trim()) { setTtsError('OpenAI API Key를 입력해주세요.'); return; }
    setIsTtsLoading(true);
    setTtsError('');
    try {
      const full = `${bookData.title}. 저자 ${bookData.author}. ${bookData.content}`;
      const script = full.slice(0, 80);
      const url = await hookAITTS(apiKey.trim(), script);
      localStorage.setItem(`audio_${bookData.id}`, url);
      setAudioSrc(url);
      try { await hookBooks('PATCH', { id: bookData.id, audioUrl: url }); } catch (_) {}
    } catch (err) {
      setTtsError(err.message || 'TTS 생성에 실패했습니다.');
    } finally {
      setIsTtsLoading(false);
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

            <div className="tts-section">
              <h4 className="tts-title">🎧 오디오북</h4>
              <div className="tts-key-row">
                <input
                  type="password"
                  className="tts-key-input"
                  placeholder="OpenAI API Key (sk-...)"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
                <button
                  className="tts-generate-btn"
                  onClick={handleTtsGenerate}
                  disabled={isTtsLoading}
                >
                  {isTtsLoading ? '생성 중...' : audioSrc ? '재생성' : '생성'}
                </button>
              </div>
              {ttsError && <p className="tts-error">{ttsError}</p>}
              {audioSrc && (
                <audio controls src={audioSrc} className="tts-player" />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default BookDetailPage;
