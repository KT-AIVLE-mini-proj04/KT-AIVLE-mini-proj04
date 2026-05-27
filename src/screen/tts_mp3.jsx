import { useState } from "react";
import "@screen/tts_mp3.css";
import { hookAITTS } from "@hooks/tts_mp3.hook";
import { hookBooks } from "@hooks/books.hook";

/**
 * TtsGenerator — 수정 페이지용 TTS 생성 컴포넌트
 *
 * 사용법:
 *   <TtsGenerator book={{ id, title, author, content }} onAudioUpdate={(base64Url) => {}} />
 */
export default function TtsGenerator({ book, onAudioUpdate, apiKey }) {
  const [voice, setVoice] = useState("alloy");
  const [audioUrl, setAudioUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!apiKey?.trim()) {
      setError("OpenAI API Key를 입력해주세요.");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      const full = `${book.title}. 저자 ${book.author}. ${book.content}`;
      const script = full.slice(0, 80);
      const base64Url = await hookAITTS(apiKey.trim(), script, voice);

      if (book.id) {
        await hookBooks("PATCH", { id: book.id, audioUrl: base64Url });
      }

      setAudioUrl(base64Url);
      if (onAudioUpdate) onAudioUpdate(base64Url);
    } catch (err) {
      setError(err.message || "TTS 생성에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="aitts">
      <h3>🎧 오디오북 생성</h3>

      <div className="aitts-field">
        <label htmlFor="tts-voice">목소리</label>
        <select
          id="tts-voice"
          value={voice}
          onChange={(e) => setVoice(e.target.value)}>
          <option value="alloy">Alloy (중성)</option>
          <option value="echo">Echo (남성)</option>
          <option value="fable">Fable (영국 남성)</option>
          <option value="onyx">Onyx (저음 남성)</option>
          <option value="nova">Nova (여성)</option>
          <option value="shimmer">Shimmer (부드러운 여성)</option>
        </select>
      </div>

      <button
        className="aitts-btn"
        onClick={handleGenerate}
        disabled={isLoading}>
        {isLoading ? "생성 중..." : "🎙️ 오디오 생성"}
      </button>

      {error && <p className="aitts-error">{error}</p>}

      {audioUrl && (
        <div className="aitts-player">
          <audio controls src={audioUrl} style={{ width: "100%" }} />
        </div>
      )}

      <p className="aitts-notice">
        * TTS 생성 시 OpenAI API 비용이 발생합니다.
      </p>
    </div>
  );
}
