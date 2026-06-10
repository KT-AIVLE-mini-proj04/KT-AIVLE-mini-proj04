import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router";
import { hookBooks } from "@hooks/books.hook";
import { hookEpisodes } from "@hooks/episodes.hook";
import { hookComment } from "@hooks/comment.hook";
import { hookLike, hookLikeCount } from "@hooks/like.hook";
import { getUser } from "@utils/authStore";
import HeartIcon from "@/assets/heart.svg?react";
import "./bookdetail.css";

function BookDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [bookData, setBookData] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const [commentError, setCommentError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingContent, setEditingContent] = useState("");
  const [likeCount, setLikeCount] = useState(0);
  const [likes, setLikes] = useState([]);


  const [isLikeLoading, setIsLikeLoading] = useState(false);

useEffect(() => {
  const fetchBook = async () => {
    try {
      const [bookData, episodes, comments, likes] = await Promise.all([
        hookBooks("GET", { id }),
        hookEpisodes("GET", { bookId: id }),
        hookComment("GET", { bookId: id }),
        hookLikeCount(id),
      ]);

      setBookData(bookData);
      setEpisodes(episodes);
      setComments(comments ?? []);
      setLikes(likes ?? []);
      setLikeCount(likes?.length ?? 0);
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

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    const trimmed = commentInput.trim();
    if (!trimmed) {
      setCommentError("댓글 내용을 입력해주세요.");
      return;
    }
    try {
      await hookComment("POST", { bookId: id, content: trimmed });
      const updated = await hookComment("GET", { bookId: id });
      setComments(updated ?? []);
      setCommentInput("");
      setCommentError("");
    } catch (err) {
      console.error("댓글 등록 실패:", err);
      setCommentError("댓글 등록 중 오류가 발생했습니다.");
    }
  };

  const handleCommentDelete = async (commentId) => {
    try {
      await hookComment("DELETE", { id: commentId });
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (err) {
      console.error("댓글 삭제 실패:", err);
    }
  };

  const handleCommentEdit = (comment) => {
    setEditingId(comment.id);
    setEditingContent(comment.content);
  };

  const handleCommentEditSubmit = async (commentId) => {
    if (!editingContent.trim()) return;
    try {
      await hookComment("PATCH", { id: commentId, content: editingContent.trim() });
      setComments((prev) =>
        prev.map((c) => c.id === commentId ? { ...c, content: editingContent.trim() } : c)
      );
      setEditingId(null);
      setEditingContent("");
    } catch (err) {
      console.error("댓글 수정 실패:", err);
    }
  };


  const handleLikeToggle = async () => {
    const user = getUser();
    if (!user || !bookData || isLikeLoading) return;

    const myLike = likes.find((l) => l.userId === user.id);
    setIsLikeLoading(true);

    try {
      if (myLike) {
        // 이미 좋아요 → DELETE
        await hookLike({ method: "DELETE", likeId: myLike.id });
        setLikes((prev) => prev.filter((l) => l.id !== myLike.id));
        setLikeCount((prev) => prev - 1);
      } else {
        // 좋아요 없음 → POST
        await hookLike({ method: "POST", bookId: bookData.id, userId: user.id });
        setLikes((prev) => [...prev, { userId: user.id }]);
        setLikeCount((prev) => prev + 1);
      }
    } catch (err) {
      console.error("좋아요 변경 실패:", err);
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
          <div className="book-cover-col">
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

            <section className="episodes-section">
              <div className="episodes-header">
                <h3>에피소드</h3>
                <span>{episodes?.length ?? 0}화</span>
              </div>
              {!episodes?.length ? (
                <p className="no-episodes">회차가 등록되지 않았습니다.</p>
              ) : (
                <div className="episode-list">
                  {episodes.map((episode, index) => (
                    <div
                      key={episode.episodeId ?? index}
                      className="episode-item"
                      onClick={() => navigate(`/episodes/${episode.episodeId}`)}>
                      <span className="episode-number">{episode.episodeIndex ?? index + 1}화</span>
                      <span className="episode-title">{episode.episodeTitle ?? "제목 없음"}</span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          <div className="book-info">
            <h2 className="book-title">{bookData.title}</h2>
            <p className="book-author">저자: {bookData.author}</p>

            <h3 className="content-label">내용</h3>
            <div className="content-box">
              <p>{bookData.content}</p>
            </div>

            <div className="book-date-like">
              <p className="book-date">
                등록일: {formatDate(bookData.createdAt)}
              </p>
              <div className="like-wrapper">
                <button
                  type="button"
                  className={`like-button ${likes.some((l) => l.userId === getUser()?.id) ? "liked" : ""}`}
                  aria-label="좋아요"
                  title={!getUser() ? "로그인 후 이용 가능합니다" : "좋아요"}
                  onClick={handleLikeToggle}
                  disabled={isLikeLoading || !getUser()}>
                  <HeartIcon aria-hidden="true" focusable="false" />
                </button>
                <span className="like-count">{likeCount}</span>
              </div>
            </div>

            <div className="action-buttons">
              <button className="btn-edit" onClick={handleEdit}>
                수정
              </button>
              <button className="btn-delete" onClick={handleDelete}>
                삭제
              </button>
            </div>

{/*
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
*/}
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
                        <span className="comment-user">{comment.name}</span>
                        <span className="comment-date">
                          {new Date(comment.createdAt).toLocaleString("ko-KR", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        {getUser()?.id === comment.userId && (
                        <div className="comment-actions">
                          <button
                            type="button"
                            className="comment-edit"
                            onClick={() => handleCommentEdit(comment)}>
                            수정
                          </button>
                          <button
                            type="button"
                            className="comment-delete"
                            onClick={() => handleCommentDelete(comment.id)}>
                            삭제
                          </button>
                        </div>
                        )}
                      </div>
                      {editingId === comment.id ? (
                        <div className="comment-edit-form">
                          <textarea
                            className="comment-input"
                            value={editingContent}
                            onChange={(e) => setEditingContent(e.target.value)}
                            rows={3}
                          />
                          <div className="comment-edit-actions">
                            <button
                              type="button"
                              className="btn-edit comment-submit"
                              onClick={() => handleCommentEditSubmit(comment.id)}>
                              저장
                            </button>
                            <button
                              type="button"
                              className="comment-delete"
                              onClick={() => setEditingId(null)}>
                              취소
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="comment-text">{comment.content}</p>
                      )}
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
