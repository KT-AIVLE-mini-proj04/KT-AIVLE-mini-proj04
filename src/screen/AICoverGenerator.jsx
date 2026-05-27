import { useState, useEffect } from "react";
import "@screen/AICoverGenerator.css";
import { hookAiCover } from "@hooks/aiCover.hook";

/**
 * AI 표지 생성 컴포넌트 (M5 · M6)
 *
 * 사용법:
 *   <AICoverGenerator
 *     book={{ id, title, author, content }}
 *     onCoverUpdate={(imageSrc) => { ... }}
 *   />
 */
const SIZE_OPTIONS = [
  { label: '1024×1536 (세로 대형 · 도서표지)', apiSize: '1024x1536', w: 1024, h: 1536 },
  { label: '768×1152 (세로 중형)',              apiSize: '1024x1536', w: 768,  h: 1152 },
  { label: '512×768 (세로 소형)',               apiSize: '1024x1536', w: 512,  h: 768  },
  { label: '400×600 (세로 미니)',               apiSize: '1024x1536', w: 400,  h: 600  },
  { label: '1024×1024 (정사각형 대형)',         apiSize: '1024x1024', w: 1024, h: 1024 },
  { label: '512×512 (정사각형 중형)',           apiSize: '1024x1024', w: 512,  h: 512  },
  { label: '300×300 (정사각형 소형)',           apiSize: '1024x1024', w: 300,  h: 300  },
  { label: '1536×1024 (가로 대형)',             apiSize: '1536x1024', w: 1536, h: 1024 },
  { label: '1024×683 (가로 중형)',              apiSize: '1536x1024', w: 1024, h: 683  },
  { label: '512×341 (가로 소형)',               apiSize: '1536x1024', w: 512,  h: 341  },
];

export default function AICoverGenerator({ book, setForm, isGenerating, setIsGenerating }) {
  const model                   = 'gpt-image-2';
  const [sizeKey, setSizeKey]   = useState('1024×1536 (세로 대형 · 도서표지)');
  const [quality, setQuality]   = useState('medium');
  const [error, setError]       = useState('');
  const [imageSrc, setImageSrc] = useState('');
  const [apiKey, setApiKey]     = useState('');

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setImageSrc(book.coverImageUrl || "");
  }, [book.coverImageUrl]);

  const handleGenerateCover = async () => {
    setIsGenerating(true);
    setError("");
    try {
      const opt = SIZE_OPTIONS.find(o => o.label === sizeKey) || SIZE_OPTIONS[0];
      const result = await hookAiCover(apiKey, book, {
        model, size: opt.apiSize, quality,
        compressWidth: opt.w, compressHeight: opt.h,
      });
      setForm((prev) => ({ ...prev, coverImageUrl: result }));
      setImageSrc(result);
    } catch (err) {
      setError(err.message || "표지 생성에 실패했습니다.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="ai-cover-generator">
      <div className="ai-field">
        <label htmlFor="shared-api-key">OpenAI API Key</label>
        <input
          id="shared-api-key"
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="sk-..."
        />
      </div>

      <div className="ai-result">
        {imageSrc && <img src={imageSrc} alt="AI 생성 표지" />}
      </div>

      <div className="ai-options">
        <div className="cover-opt">
          <label htmlFor="ai-size">이미지 크기</label>
          <select id="ai-size" value={sizeKey} onChange={(e) => setSizeKey(e.target.value)}>
            {SIZE_OPTIONS.map(o => (
              <option key={o.label} value={o.label}>{o.label}</option>
            ))}
          </select>
        </div>

        <div className="cover-opt">
          <label htmlFor="ai-quality">품질</label>
          <select
            id="ai-quality"
            value={quality}
            onChange={(e) => setQuality(e.target.value)}>
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
          className="ai-generate-btn">
          {isGenerating ? "생성 중..." : "생성"}
        </button>
      </div>

      {error && <p className="ai-error">{error}</p>}
      <p className="ai-notice">* 이미지 생성 시 OpenAI API 비용이 발생합니다.</p>
    </div>
  );
}
