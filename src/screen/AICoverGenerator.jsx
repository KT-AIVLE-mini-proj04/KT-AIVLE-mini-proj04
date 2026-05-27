import { useState } from 'react';
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
export default function AICoverGenerator({ book, setForm, apiKey }) {
  const model                   = 'gpt-image-2';
  const [size, setSize]         = useState('1024x1536');
  const [quality, setQuality]   = useState('medium');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError]       = useState('');

  const handleGenerateCover = async () => {
    setIsGenerating(true);
    setError('');

    try {
      const url = await hookAiCover(book, { model, size, quality }, apiKey?.trim() || undefined);
      setForm((prev) => ({ ...prev, coverImageUrl: url }));
    } catch (err) {
      setError(err.message || '표지 생성에 실패했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="ai-cover-generator">
      <h2>AI 표지 생성</h2>
      {/* 옵션 선택 */}
      <div className="ai-options">
        <div className="ai-field">
          <label htmlFor="ai-size">이미지 크기</label>
          <select id="ai-size" value={size} onChange={(e) => setSize(e.target.value)}>
            <option value="1024x1536">1024x1536 (도서표지)</option>
            <option value="1024x1024">1024x1024 (정사각형)</option>
          </select>
        </div>

        <div className="ai-field">
          <label htmlFor="ai-quality">품질</label>
          <select id="ai-quality" value={quality} onChange={(e) => setQuality(e.target.value)}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      {/* 생성 버튼 */}
      <button
        onClick={handleGenerateCover}
        disabled={isGenerating}
        className="ai-generate-btn"
      >
        {isGenerating ? '생성 중...' : 'AI 표지 생성'}
      </button>

      {/* 에러 메시지 */}
      {error && <p className="ai-error">{error}</p>}

      {/* 비용 안내 */}
      <p className="ai-notice">* AI 표지 생성 시 OpenAI API 비용이 발생합니다.</p>
    </div>
  );
}
