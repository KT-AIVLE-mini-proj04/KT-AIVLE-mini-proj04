import { useState } from 'react';
import './AICoverGenerator.css';

const OPENAI_API_URL = 'https://api.openai.com/v1/images/generations';
const JSON_SERVER_URL = 'http://localhost:3000';

/**
 * AI 표지 생성 컴포넌트 (M5 · M6)
 *
 * 사용법:
 *   <AICoverGenerator
 *     book={{ id, title, author, content }}
 *     onCoverUpdate={(imageSrc) => { ... }}
 *   />
 */
export default function AICoverGenerator({ book, onCoverUpdate }) {
  const [apiKey, setApiKey]     = useState('');
  const [model, setModel]       = useState('gpt-image-2');
  const [size, setSize]         = useState('1024x1536');
  const [quality, setQuality]   = useState('auto');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError]       = useState('');

  const handleGenerateCover = async () => {
    // 1. API Key 유효성 검사
    if (!apiKey.trim()) {
      setError('OpenAI API Key를 입력해주세요.');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      // 2. 도서 제목·내용으로 프롬프트 구성
      const prompt = `A book cover for a book titled "${book.title}" by ${book.author}. ${book.content}`;

      // 3. OpenAI Image API 호출
      const res = await fetch(OPENAI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey.trim()}`,
        },
        body: JSON.stringify({
          model,
          prompt,
          n: 1,
          size,
          quality,
          output_format: 'png',
        }),
      });

      // 4. 응답 확인
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        const status = res.status;
        if (status === 401) throw new Error('API Key가 유효하지 않습니다. [401 Unauthorized]');
        if (status === 429) throw new Error('요청 한도 초과입니다. 잠시 후 재시도하세요. [429 Too Many Requests]');
        throw new Error(errData.error?.message || `OpenAI 오류 [${status}]`);
      }

      // 5. b64_json 추출 → Data URL 변환
      const data = await res.json();
      const b64Json = data.data?.[0]?.b64_json;
      if (!b64Json) throw new Error('이미지 데이터를 받지 못했습니다.');
      const imageSrc = `data:image/png;base64,${b64Json}`;

      // 6. json-server에 coverImageUrl PATCH 저장
      await fetch(`${JSON_SERVER_URL}/books/${book.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coverImageUrl: imageSrc }),
      });

      // 7. 화면 즉시 반영
      onCoverUpdate(imageSrc);

    } catch (err) {
      setError(err.message || '표지 생성에 실패했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="ai-cover-generator">
      <h3>AI 표지 생성</h3>

      {/* API Key 입력 */}
      <div className="ai-field">
        <label htmlFor="ai-api-key">OpenAI API Key</label>
        <input
          id="ai-api-key"
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="sk-..."
        />
      </div>

      {/* 옵션 선택 */}
      <div className="ai-options">
        <div className="ai-field">
          <label htmlFor="ai-model">생성 모델</label>
          <select id="ai-model" value={model} onChange={(e) => setModel(e.target.value)}>
            <option value="gpt-image-2">gpt-image-2</option>
          </select>
        </div>

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
            <option value="auto">Auto</option>
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