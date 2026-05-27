import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router";
import { hookBooks } from "@hooks/books.hook";
import { hookAITTS } from "@hooks/tts_mp3.hook";
import { hookLike } from "@hooks/like.hook";
import HeartIcon from "@/assets/heart.svg?react";
import "./bookdetail.css";

function BookDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [bookData, setBookData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const [commentError, setCommentError] = useState("");

  const commentStorageKey = `book_comments_${id}`;

  const loadComments = () => {
    try {
      const stored = localStorage.getItem(commentStorageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (err) {
      console.error("댓글 불러오기 오류:", err);
      return [];
    }
  };

  const saveComments = (newComments) => {
    try {
      localStorage.setItem(commentStorageKey, JSON.stringify(newComments));
    } catch (err) {
      console.error("댓글 저장 오류:", err);
    }
  };

  const [apiKey, setApiKey] = useState("");
  const [voice, setVoice] = useState("alloy");
  const [audioSrc, setAudioSrc] = useState("");
  const [isTtsLoading, setIsTtsLoading] = useState(false);
  const [ttsError, setTtsError] = useState("");
  const [isLikeLoading, setIsLikeLoading] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const result = await hookBooks("GET", { id });
        setBookData(result);
        setComments(loadComments());
        const saved =
          result.audioUrl || localStorage.getItem(`audio_${result.id}`) || "";
        setAudioSrc(saved);
      } catch (err) {
        console.error("도서 조회 실패:", err);
        setError("해당 도서를 찾을 수 없습니다.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchBook();
  }, [id, location.key]);

  const handleBack = () => {
    navigate("/books");
  };

  const handleEdit = () => {
    navigate("/books/submit", { state: { id: bookData.id } });
  };

  const handleDelete = async () => {
    if (!window.confirm(`"${bookData.title}"을(를) 정말 삭제하시겠습니까?`)) {
      return;
    }

    try {
      await hookBooks("DELETE", { id: bookData.id });
      alert("삭제되었습니다.");
      navigate("/books");
    } catch (err) {
      console.error("삭제 중 오류:", err);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  const handleCommentSubmit = (event) => {
    event.preventDefault();
    const trimmed = commentInput.trim();
    if (!trimmed) {
      setCommentError("댓글 내용을 입력해주세요.");
      return;
    }

    const newComment = {
      id: `${Date.now()}`,
      text: trimmed,
      createdAt: new Date().toISOString(),
    };

    const updatedComments = [newComment, ...comments];
    setComments(updatedComments);
    saveComments(updatedComments);
    setCommentInput("");
    setCommentError("");
  };

  const handleCommentDelete = (commentId) => {
    const updatedComments = comments.filter(
      (comment) => comment.id !== commentId,
    );
    setComments(updatedComments);
    saveComments(updatedComments);
  };

  const handleTtsDelete = async () => {
    localStorage.removeItem(`audio_${bookData.id}`);
    setAudioSrc("");
    setTtsError("");
    try {
      await hookBooks("PATCH", { id: bookData.id, audioUrl: "" });
    } catch (_) {}
  };

  const handleTtsGenerate = async () => {
    if (!apiKey.trim()) {
      setTtsError("OpenAI API Key를 입력해주세요.");
      return;
    }
    setIsTtsLoading(true);
    setTtsError("");
    try {
      const script = `${bookData.title}. 저자 ${bookData.author}. ${bookData.content}`;
      const url = await hookAITTS(apiKey.trim(), script, voice);
      localStorage.setItem(`audio_${bookData.id}`, url);
      setAudioSrc(url);
      try {
        await hookBooks("PATCH", { id: bookData.id, audioUrl: url });
      } catch (_) {}
    } catch (err) {
      setTtsError(err.message || "TTS 생성에 실패했습니다.");
    } finally {
      setIsTtsLoading(false);
    }
  };

  const handleLikeToggle = async () => {
    if (!bookData || isLikeLoading) {
      return;
    }

    const nextLike = !Boolean(bookData.like);
    setIsLikeLoading(true);

    try {
      await hookLike({ id: bookData.id, like: nextLike });
      setBookData((prev) =>
        prev
          ? { ...prev, like: nextLike, updatedAt: new Date().toISOString() }
          : prev,
      );
    } catch (err) {
      console.error("좋아요 변경 실패:", err);
      alert("좋아요 상태 변경 중 오류가 발생했습니다.");
    } finally {
      setIsLikeLoading(false);
    }
  };

  const formatDate = (isoString) => {
    // 날짜
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
          <p
            style={{
              textAlign: "center",
              fontSize: "20px",
              marginTop: "60px",
            }}>
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
          <p
            style={{
              textAlign: "center",
              fontSize: "20px",
              marginTop: "60px",
            }}>
            {error || "해당 도서를 찾을 수 없습니다."}
          </p>
        </main>
      </div>
    );
  }

  const hasCoverImage =
    bookData.coverImageUrl && bookData.coverImageUrl.trim() !== "";

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

            <div className="book-date-like">
              <p className="book-date">
                등록일: {formatDate(bookData.createdAt)}
              </p>
              <button
                type="button"
                className={`like-button ${bookData.like ? "liked" : ""}`}
                aria-label={bookData.like ? "좋아요 취소" : "좋아요"}
                title={bookData.like ? "좋아요 취소" : "좋아요"}
                onClick={handleLikeToggle}
                disabled={isLikeLoading}>
                <HeartIcon aria-hidden="true" focusable="false" />
              </button>
            </div>

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
                <select
                  className="tts-voice-select"
                  value={voice}
                  onChange={(e) => setVoice(e.target.value)}>
                  <option value="alloy">Alloy (중성)</option>
                  <option value="ash">Ash (중성)</option>
                  <option value="ballad">Ballad (부드러운 남성)</option>
                  <option value="coral">Coral (여성)</option>
                  <option value="echo">Echo (남성)</option>
                  <option value="fable">Fable (영국 남성)</option>
                  <option value="nova">Nova (여성)</option>
                  <option value="onyx">Onyx (저음 남성)</option>
                  <option value="sage">Sage (차분한 여성)</option>
                  <option value="shimmer">Shimmer (부드러운 여성)</option>
                  <option value="verse">Verse (표현력 있는 중성)</option>
                </select>
                <button
                  className="tts-generate-btn"
                  onClick={handleTtsGenerate}
                  disabled={isTtsLoading}>
                  {isTtsLoading ? "생성 중..." : "생성"}
                </button>
                {audioSrc && (
                  <button
                    className="tts-delete-btn"
                    onClick={handleTtsDelete}
                    disabled={isTtsLoading}>
                    삭제
                  </button>
                )}
              </div>
              {ttsError && <p className="tts-error">{ttsError}</p>}
              {audioSrc && (
                <audio controls src={audioSrc} className="tts-player" />
              )}
              <p className="tts-notice">* TTS 생성 시 OpenAI API 비용이 발생합니다.</p>
            </div>
            <section className="comments-section">
              <div className="comments-header">
                <h3>댓글</h3>
                <span>{comments.length}개</span>
              </div>

              <form className="comment-form" onSubmit={handleCommentSubmit}>
                <textarea
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder="댓글을 입력하세요."
                  rows={4}
                  className="comment-input"
                />
                {commentError && (
                  <p className="comment-error">{commentError}</p>
                )}
                <button type="submit" className="btn-edit comment-submit">
                  댓글 등록
                </button>
              </form>

              <div className="comment-list">
                {comments.length === 0 ? (
                  <p className="no-comments">첫 번째 댓글을 남겨보세요.</p>
                ) : (
                  comments.map((comment) => (
                    <article key={comment.id} className="comment-item">
                      <div className="comment-meta">
                        <span className="comment-date">
                          {new Date(comment.createdAt).toLocaleString("ko-KR", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        <button
                          type="button"
                          className="comment-delete"
                          onClick={() => handleCommentDelete(comment.id)}>
                          삭제
                        </button>
                      </div>
                      <p className="comment-text">{comment.text}</p>
                    </article>
                  ))
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default BookDetailPage;
