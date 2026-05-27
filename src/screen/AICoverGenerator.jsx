import { useState, useEffect } from 'react';
import './AICoverGenerator.css';
import { hookAiCover } from '../hooks/aiCover.hook';

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
