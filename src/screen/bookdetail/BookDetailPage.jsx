import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router";
import { hookBooks } from "@hooks/books.hook";
import { hookEpisodes } from "@hooks/episodes.hook";
import { hookComment } from "@hooks/comment.hook";
import { hookLike, hookLikeCount } from "@hooks/like.hook";
import { getUser } from "@utils/authStore";
import BookCover from "./BookCover";
import EpisodeList from "./EpisodeList";
import BookInfo from "./BookInfo";
import CommentSection from "./CommentSection";
import "../bookdetail.css";

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
  const [commentPage, setCommentPage] = useState(0);
  const [hasMoreComments, setHasMoreComments] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editingContent, setEditingContent] = useState("");
  const [likeCount, setLikeCount] = useState(0);
  const [likes, setLikes] = useState([]);
  const [isLikeLoading, setIsLikeLoading] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const [bookRes, episodesRes, commentsRes, likesRes] = await Promise.all([
          hookBooks("GET", { id }),
          hookEpisodes("GET", { bookId: id }),
          hookComment("GET", { bookId: id, page: 0 }),
          hookLikeCount(id),
        ]);

        setBookData(bookRes);
        setEpisodes(episodesRes);
        setComments(commentsRes ?? []);
        setHasMoreComments((commentsRes?.length ?? 0) === 10);
        setLikes(likesRes ?? []);
        setLikeCount(likesRes?.length ?? 0);
      } catch (err) {
        console.error("도서 조회 실패:", err);
        setError("해당 도서를 찾을 수 없습니다.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchBook();
  }, [id, location.key]);

  const handleEdit = () => {
    navigate("/books/submit", { state: { id: bookData.id } });
  };

  const handleDelete = async () => {
    if (!window.confirm(`"${bookData.title}"을(를) 정말 삭제하시겠습니까?`)) return;
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
      console.log("getUser() 전체:", getUser());
      await hookComment("POST", { bookId: id, content: trimmed, usersId: getUser()?.usersId });
      const updated = await hookComment("GET", { bookId: id, page: 0 });
      setComments(updated ?? []);
      setCommentPage(0);
      setHasMoreComments((updated?.length ?? 0) === 10);
      setCommentInput("");
      setCommentError("");
    } catch (err) {
      console.error("댓글 등록 실패:", err);
      setCommentError("댓글 등록 중 오류가 발생했습니다.");
    }
  };

  const handleCommentDelete = async (commentId) => {
    try {
      await hookComment("DELETE", { id: commentId, usersId: getUser()?.usersId });
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
        prev.map((c) => (c.id === commentId ? { ...c, content: editingContent.trim() } : c))
      );
      setEditingId(null);
      setEditingContent("");
    } catch (err) {
      console.error("댓글 수정 실패:", err);
    }
  };

  const handleLoadMoreComments = async () => {
    const nextPage = commentPage + 1;
    try {
      const more = await hookComment("GET", { bookId: id, page: nextPage });
      setComments((prev) => [...prev, ...(more ?? [])]);
      setCommentPage(nextPage);
      setHasMoreComments((more?.length ?? 0) === 10);
    } catch (err) {
      console.error("댓글 추가 로드 실패:", err);
    }
  };

  const handleLikeToggle = async () => {
    const user = getUser();
    if (!user || !bookData || isLikeLoading) return;

    const myLike = likes.find((l) => l.usersId === user.usersId);
    setIsLikeLoading(true);
    try {
      if (myLike) {
        await hookLike({ method: "DELETE", likeId: myLike.id });
        setLikes((prev) => prev.filter((l) => l.id !== myLike.id));
        setLikeCount((prev) => prev - 1);
      } else {
        await hookLike({ method: "POST", bookId: bookData.id, usersId: user.usersId });
        setLikes((prev) => [...prev, { usersId: user.usersId }]);
        setLikeCount((prev) => prev + 1);
      }
    } catch (err) {
      console.error("좋아요 변경 실패:", err);
    } finally {
      setIsLikeLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="book-detail-page">
        <main className="main-content">
          <p style={{ textAlign: "center", fontSize: "20px", marginTop: "60px" }}>
            도서 정보를 불러오는 중...
          </p>
        </main>
      </div>
    );
  }

  if (error || !bookData) {
    return (
      <div className="book-detail-page">
        <main className="main-content">
          <button className="back-button" onClick={() => navigate("/books")}>← 뒤로 가기</button>
          <p style={{ textAlign: "center", fontSize: "20px", marginTop: "60px" }}>
            {error || "해당 도서를 찾을 수 없습니다."}
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="book-detail-page">
      <main className="main-content">
        <button className="back-button" onClick={() => navigate("/books")}>← 뒤로 가기</button>

        <div className="book-detail-Card">
          <div className="book-cover-col">
            <BookCover title={bookData.title} coverImageUrl={bookData.coverImageUrl} />
            <EpisodeList episodes={episodes} bookId={id} />
          </div>

          <div className="book-info">
            <BookInfo
              bookData={bookData}
              likes={likes}
              likeCount={likeCount}
              isLikeLoading={isLikeLoading}
              onLikeToggle={handleLikeToggle}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />

{/*
            <div className="tts-section">
              <h4 className="tts-title">🎧 오디오북</h4>
              ...
            </div>
*/}

            <CommentSection
              comments={comments}
              commentInput={commentInput}
              commentError={commentError}
              hasMoreComments={hasMoreComments}
              editingId={editingId}
              editingContent={editingContent}
              onCommentInputChange={setCommentInput}
              onCommentSubmit={handleCommentSubmit}
              onCommentDelete={handleCommentDelete}
              onCommentEdit={handleCommentEdit}
              onCommentEditChange={setEditingContent}
              onCommentEditSubmit={handleCommentEditSubmit}
              onCommentEditCancel={() => setEditingId(null)}
              onLoadMore={handleLoadMoreComments}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default BookDetailPage;
