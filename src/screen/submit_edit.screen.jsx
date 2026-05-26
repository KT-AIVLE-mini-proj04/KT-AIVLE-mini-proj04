import "./submit_edit.screen.css";

import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { hookBooks } from '../hooks/books.hook.js';
import { compressImage } from '../hooks/aiCover.hook.js';
import AICoverGenerator from './AICoverGenerator';
import TtsGenerator from './tts_mp3';

function SubmitEdit() {
  const navigate = useNavigate();
  const location = useLocation();
  const id = location.state?.id || null;

  const [title, setTitle]       = useState('');
  const [author, setAuthor]     = useState('');
  const [content, setContent]   = useState('');
  const [savedBook, setSavedBook] = useState(null);
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [apiKey, setApiKey]     = useState('');
  const [loading, setLoading]   = useState(false);

  const titleCountRef   = useRef(null);
  const authorCountRef  = useRef(null);
  const contentCountRef = useRef(null);

  const syncCounter = (ref, value, max, isContent) => {
    if (!ref.current) return;
    const len = value.length;
    ref.current.textContent = `${len}/${max}`;
    ref.current.className = `char-counter${len > max ? ' over' : isContent && len < 10 && len > 0 ? ' under' : ''}`;
  };

  useEffect(() => {
    if (!id) return;
    hookBooks('GET', { id }).then(book => {
      if (!book) return;
      setTitle(book.title || '');
      setAuthor(book.author || '');
      setContent(book.content || '');
      setSavedBook(book);
      setCoverImageUrl(book.coverImageUrl || '');
      setAudioUrl(book.audioUrl || localStorage.getItem(`audio_${book.id}`) || '');
    }).catch(console.error);
  }, [id]);

  const handleSave = async (e) => {
    e.preventDefault();

    if (!title.trim()) { alert('제목을 입력하세요.'); return; }
    if (!author.trim()) { alert('저자를 입력하세요.'); return; }
    if (!content.trim()) { alert('내용을 입력하세요.'); return; }

    if (title.trim().length > 20) { alert('제목은 20자 이하로 입력하세요.'); return; }
    if (author.trim().length > 10) { alert('저자는 10자 이하로 입력하세요.'); return; }
    if (content.trim().length < 10) { alert('내용을 10자 이상 입력하세요.'); return; }
    if (content.trim().length > 43) { alert('내용은 43자 이하로 입력하세요.'); return; }

    try {
      setLoading(true);
      const isEdit = !!savedBook?.id;
      const method = isEdit ? 'PATCH' : 'POST';
      const payload = isEdit
        ? { id: savedBook.id, title, author, content }
        : { title, author, content };
      const book = await hookBooks(method, payload);
      if (book) {
        if (!isEdit) {
          if (coverImageUrl) {
            try {
              const thumb = await compressImage(coverImageUrl, 300);
              await hookBooks('PATCH', { id: book.id, coverImageUrl: thumb });
            } catch (_) {}
          }
          if (audioUrl) {
            await hookBooks('PATCH', { id: book.id, audioUrl });
          }
        }

        setSavedBook(prev => ({
          ...prev,
          ...book,
          audioUrl: audioUrl || book.audioUrl || null,
          coverImageUrl: coverImageUrl || book.coverImageUrl || null,
        }));
      }
      alert(isEdit ? '도서가 수정되었습니다.' : '도서가 등록되었습니다.');
    } catch (error) {
      console.error('저장 실패:', error);
      alert('저장에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <main className="main">
        <Link to="/books">
          <button className="back-btn">← 뒤로 가기</button>
        </Link>

        <section className="content">
          <section className="form-card">
            <div className="form-title">{id ? '도서 수정' : '새 도서 등록'}</div>

            <form className="book-form" onSubmit={handleSave}>
              <div className="form-field">
                <label htmlFor="title">제목</label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onCompositionEnd={(e) => setTitle(e.target.value)}
                  onInput={(e) => syncCounter(titleCountRef, e.target.value, 20, false)}
                  placeholder="제목을 입력하세요 (최대 20자)"
                />
                <span ref={titleCountRef} className={`char-counter ${title.length > 20 ? 'over' : ''}`}>{title.length}/20</span>
              </div>

              <div className="form-field">
                <label htmlFor="author">저자</label>
                <input
                  id="author"
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  onCompositionEnd={(e) => setAuthor(e.target.value)}
                  onInput={(e) => syncCounter(authorCountRef, e.target.value, 10, false)}
                  placeholder="저자를 입력하세요 (최대 10자)"
                />
                <span ref={authorCountRef} className={`char-counter ${author.length > 10 ? 'over' : ''}`}>{author.length}/10</span>
              </div>

              <div className="form-field">
                <label htmlFor="content">내용</label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  onCompositionEnd={(e) => setContent(e.target.value)}
                  onInput={(e) => syncCounter(contentCountRef, e.target.value, 43, true)}
                  placeholder="내용을 입력하세요 (10자 이상, 최대 43자)"
                />
                <span ref={contentCountRef} className={`char-counter ${content.length > 43 ? 'over' : content.length < 10 && content.length > 0 ? 'under' : ''}`}>{content.length}/43</span>
              </div>

              <div className="form-buttons">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => navigate('/books')}
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="save-btn"
                  disabled={loading}
                >
                  {loading ? '저장 중...' : '저장'}
                </button>
              </div>
            </form>
          </section>

          <section className="ai-section">
            <h2>AI 생성</h2>

            <div className="ai-field" style={{ marginBottom: '16px' }}>
              <label htmlFor="shared-api-key">OpenAI API Key</label>
              <input
                id="shared-api-key"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
              />
            </div>

            <div className="result-box">
              {coverImageUrl
                ? <img src={coverImageUrl} alt="AI 생성 표지"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                : <p>(결과물)</p>
              }
            </div>

            <AICoverGenerator
              book={savedBook || { title, author, content }}
              onCoverUpdate={(url) => {
                setCoverImageUrl(url);
                if (savedBook) setSavedBook(prev => ({ ...prev, coverImageUrl: url }));
              }}
              apiKey={apiKey}
            />

            <TtsGenerator
              book={savedBook || { title, author, content }}
              onAudioUpdate={(url) => {
                setAudioUrl(url);
                if (savedBook) setSavedBook(prev => ({ ...prev, audioUrl: url }));
              }}
              apiKey={apiKey}
            />
          </section>
        </section>
      </main>
    </div>
  );
}

export default SubmitEdit;
