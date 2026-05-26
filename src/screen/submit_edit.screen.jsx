import "./submit_edit.screen.css";

import { useState } from "react";
import { useEffect } from "react";

import "./submit_edit.screen.css";
import { Link } from "react-router";
import { hookBooks } from '../hooks/books.hook.js';

function SubmitEdit() {
  const [form, setForm] = useState({
    title: "",
    author: "",
    content: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      alert("제목을 입력하세요.");
      return;
    }

    if (!form.author.trim()) {
      alert("저자를 입력하세요.");
      return;
    }

    if (!form.content.trim()) {
      alert("내용을 입력하세요.");
      return;
    }

    try {
      setLoading(true);

      const res = await hookBooks("POST", {
        title: form.title,
        author: form.author,
        content: form.content,
      });

      console.log("등록 성공:", res);
      alert("도서가 등록되었습니다.");

      setForm({
        title: "",
        author: "",
        content: "",
      });
    } catch (error) {
      console.error("등록 실패:", error);
      alert("도서 등록에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const navigate = useNavigate();

  return (
    <div className="page">
      <main className="main">
        <div>
          <button onClick={() => navigate(-1)}>
            ← 뒤로가기
          </button> 
        </div>

        <section className="content">
          <section className="form-card">
            <div className="form-title">새 도서 등록</div>

            <form className="book-form" onSubmit={handleSubmit}>
              <label>
                제목
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="제목을 입력하세요"
                />
              </label>

              <label>
                저자
                <input
                  type="text"
                  name="author"
                  value={form.author}
                  onChange={handleChange}
                  placeholder="저자를 입력하세요"
                />
              </label>

              <label>
                내용
                <textarea
                  name="content"
                  value={form.content}
                  onChange={handleChange}
                  placeholder="내용을 입력하세요"
                />
              </label>

              <div className="form-buttons">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() =>
                    setForm({
                      title: "",
                      author: "",
                      content: "",
                    })
                  }>
                  취소
                </button>

                <button type="submit" className="save-btn" disabled={loading}>
                  {loading ? "저장 중..." : "저장"}
                </button>
              </div>
            </form>
          </section>

          <section className="ai-section">
            <h2>AI 표지 생성</h2>

            <div className="result-box">
              <p>(결과물)</p>
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}

export default SubmitEdit;
