import { useState, useEffect } from 'react';
import './AICoverGenerator.css';
import { hookAiCover } from '../hooks/aiCover.hook';

/**
 * AI 표지 생성 컴포넌트 (M5 · M6)
 *
 * 사용법:
 *   <AICoverGenerator
 *     book={{ id, title, author, content }}
 *     onCoverUpdate={(imageSrc) => { ... }}
 *   />
 */
export default function AICoverGenerator({ book, setForm, isGenerating, setIsGenerating }) {
  const model                   = 'gpt-image-2';
  const [size, setSize]         = useState('1024x1536');
  const [quality, setQuality]   = useState('medium');

  const [error, setError]       = useState('');
  const [imageSrc, setImageSrc]   = useState('');
  const [apiKey, setApiKey]     = useState('');
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setImageSrc(book.coverImageUrl || '');
  }, [book.coverImageUrl]);


  const handleGenerateCover = async () => {
    setIsGenerating(true);
    setError('');
    try {
      const imageSrc = await hookAiCover(apiKey, book, { model, size, quality });
      console.log('생성된 이미지 URL:', imageSrc);
      setForm((prev) => ({ ...prev, coverImageUrl: imageSrc }));
      setImageSrc(imageSrc);

    } catch (err) {
      setError(err.message || '표지 생성에 실패했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="ai-cover-generator">
      <h2>AI 표지 생성</h2>
      <div className="ai-result">
        {imageSrc && <img src={imageSrc} alt="AI 생성 표지" />}
      </div>
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


      {/* 옵션 선택 */}
      <div className="ai-options">
        <div className="cover-opt">
          <label htmlFor="ai-size">이미지 크기</label>
          <select id="ai-size" value={size} onChange={(e) => setSize(e.target.value)}>
            <option value="1024x1536">1024x1536 (도서표지)</option>
            <option value="1024x1024">1024x1024 (정사각형)</option>
          </select>
        </div>

        <div className="cover-opt">
          <label htmlFor="ai-quality">품질</label>
          <select id="ai-quality" value={quality} onChange={(e) => setQuality(e.target.value)}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      <div className="ai-btn-row">
        <button
          onClick={handleGenerateCover}
          disabled={isGenerating}
          className="ai-generate-btn"
        >
          {isGenerating ? '생성 중...' : '생성'}
        </button>
      </div>

      {error && <p className="ai-error">{error}</p>}
    </div>
  );
}
