import "./submit_edit.screen.css";

import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router";

import { hookBooks } from "../hooks/books.hook.js";
import { useLocation, useNavigate } from "react-router";

function SubmitEdit() {
  const [form, setForm] = useState({
    title: "",
    author: "",
    content: "",
    title: "",
    author: "",
    content: "",
  });
  const location = useLocation();
  const id = location.state?.id;

  useEffect(() => {
    if (!id) return;

    const fetchBook = async () => {
      try {
        const res = await hookBooks('GET', { id });
        setForm({
          title: res.title,
          author: res.author,
          content: res.content,
        });
      } catch (error) {
        console.error('도서 정보 불러오기 실패:', error);
        alert('도서 정보를 불러오는 데 실패했습니다.');
      }
    };
    fetchBook();
  }, [id]);

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
      alert("제목을 입력하세요.");
      return;
    }

    if (!form.author.trim()) {
      alert("저자를 입력하세요.");
      alert("저자를 입력하세요.");
      return;
    }

    if (!form.content.trim()) {
      alert("내용을 입력하세요.");
      alert("내용을 입력하세요.");
      return;
    }

    try {
      setLoading(true);

      const res = await hookBooks(id ? 'PATCH' : 'POST', {
        id,
        title: form.title,
        author: form.author,
        content: form.content,
      });

      console.log(id ? '수정 성공:' : '등록 성공:', res);
      alert(id ? '도서가 수정되었습니다.' : '도서가 등록되었습니다.');

      if (!id) {
        setForm({
          title: '',
          author: '',
          content: '',
        });
      }
    } catch (error) {
      console.error(id ? '수정 실패:' : '등록 실패:', error);
      alert(id ? '도서 수정에 실패했습니다.' : '도서 등록에 실패했습니다.');
    } finally {
      setLoading(false);
      navigate(-1);
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
            <div className="form-title">
              {id ? '도서 수정' : '새 도서 등록'}
            </div>

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
                      title: "",
                      author: "",
                      content: "",
                    })
                  }>
                  }>
                  취소
                </button>

                <button
                  type="submit"
                  className="save-btn"
                  disabled={loading}
                >
                  {loading ? '저장 중...' : id ? '수정' : '저장'}
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
