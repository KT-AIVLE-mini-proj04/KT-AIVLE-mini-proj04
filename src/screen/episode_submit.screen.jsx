import { useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { hookEpisodes } from "@hooks/episodes.hook";
import { hookUser } from "@utils/authStore";
import "@screen/episode_submit.screen.css";

function EpisodeSubmit() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const user = hookUser();

  const [form, setForm] = useState({
    episodeTitle: "",
    episodeIndex: "",
    content: "",
  });
  const [loading, setLoading] = useState(false);

  const titleCountRef = useRef(null);
  const contentCountRef = useRef(null);

  const syncCounter = (ref, value, max) => {
    if (!ref.current) return;
    const len = value.length;
    ref.current.textContent = `${len}/${max}`;
    ref.current.className = `char-counter${len > max ? " over" : ""}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.episodeTitle.trim()) {
      alert("에피소드 제목을 입력하세요.");
      return;
    }
    if (form.episodeTitle.trim().length > 100) {
      alert("제목은 100자 이하로 입력하세요.");
      return;
    }
    if (!form.episodeIndex || isNaN(Number(form.episodeIndex)) || Number(form.episodeIndex) < 1) {
      alert("올바른 화수를 입력하세요.");
      return;
    }
    if (!form.content.trim()) {
      alert("내용을 입력하세요.");
      return;
    }
    if (form.content.trim().length < 10) {
      alert("내용을 10자 이상 입력하세요.");
      return;
    }
    if (form.content.trim().length > 5000) {
      alert("내용은 5000자 이하로 입력하세요.");
      return;
    }

    try {
      setLoading(true);
      await hookEpisodes("POST", {
        bookId: Number(bookId),
        usersId: user?.usersId,
        episodeTitle: form.episodeTitle.trim(),
        episodeIndex: Number(form.episodeIndex),
        content: form.content.trim(),
      });
      alert("에피소드가 등록되었습니다.");
      navigate(-1);
    } catch (error) {
      console.error("에피소드 등록 실패:", error);
      alert("에피소드 등록에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ep-submit-page">
      <main className="ep-submit-main">
        <button className="ep-submit-back" onClick={() => navigate(-1)}>
          ← 뒤로가기
        </button>

        <section className="ep-submit-card">
          <div className="ep-submit-title">새 에피소드 등록</div>

          <form className="ep-submit-form" onSubmit={handleSubmit}>
            <div className="ep-submit-row">
              <div className="ep-submit-field ep-submit-field--index">
                <label htmlFor="episodeIndex">화수</label>
                <input
                  id="episodeIndex"
                  type="number"
                  name="episodeIndex"
                  min="1"
                  value={form.episodeIndex}
                  onChange={handleChange}
                  placeholder="예) 1"
                />
              </div>

              <div className="ep-submit-field ep-submit-field--title">
                <label htmlFor="episodeTitle">에피소드 제목</label>
                <input
                  id="episodeTitle"
                  type="text"
                  name="episodeTitle"
                  value={form.episodeTitle}
                  onChange={handleChange}
                  onInput={(e) => syncCounter(titleCountRef, e.target.value, 100)}
                  placeholder="제목을 입력하세요 (최대 100자)"
                />
                <span
                  ref={titleCountRef}
                  className={`char-counter${form.episodeTitle.length > 100 ? " over" : ""}`}>
                  {form.episodeTitle.length}/100
                </span>
              </div>
            </div>

            <div className="ep-submit-field">
              <label htmlFor="content">내용</label>
              <textarea
                id="content"
                name="content"
                value={form.content}
                onChange={handleChange}
                onInput={(e) => syncCounter(contentCountRef, e.target.value, 5000)}
                placeholder="내용을 입력하세요 (10자 이상, 최대 5000자)"
              />
              <span
                ref={contentCountRef}
                className={`char-counter${form.content.length > 5000 ? " over" : ""}`}>
                {form.content.length}/5000
              </span>
            </div>

            <div className="ep-submit-buttons">
              <button type="button" className="ep-cancel-btn" onClick={() => navigate(-1)}>
                취소
              </button>
              <button type="submit" className="ep-save-btn" disabled={loading}>
                {loading ? "저장 중..." : "저장"}
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}

export default EpisodeSubmit;
