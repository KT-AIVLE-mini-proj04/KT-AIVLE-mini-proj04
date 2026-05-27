const OPENAI_TTS_URL = "https://api.openai.com/v1/audio/speech";
const TTS_MODEL = "tts-1";

/**
 * hookAiTts — 오디오북 TTS 생성 hook
 *
 * OpenAI TTS API를 호출하여 텍스트를 음성으로 변환하고
 * 브라우저에서 바로 재생 가능한 Blob URL을 반환합니다.
 *
 * ─────────────────────────────────────────
 * 파라미터
 * ─────────────────────────────────────────
 * @param {string} apiKey
 *   OpenAI API Key (sk-... 형태)
 *
 * @param {string} script
 *   읽어줄 텍스트 (book.content)
 *
 * @param {string} [voice='alloy']
 *   목소리 프리셋
 *   선택: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer'
 *
 * ─────────────────────────────────────────
 * 반환값
 * ─────────────────────────────────────────
 * @returns {Promise<string>}
 *   브라우저 Blob URL — <audio src={url} /> 에 바로 사용 가능
 *   (페이지 이탈 시 URL.revokeObjectURL()로 해제 권장)
 *
 * ─────────────────────────────────────────
 * 에러
 * ─────────────────────────────────────────
 *   - 401: API Key 오류
 *   - 429: 요청 한도 초과
 *
 * ─────────────────────────────────────────
 * 사용 예시
 * ─────────────────────────────────────────
 * import { hookAiTts } from '@hooks/aiTts.hook';
 *
 * const audioUrl = await hookAiTts(apiKey, book.content, 'nova');
 * // → <audio controls src={audioUrl} />
 */
export const hookAITTS = async (apiKey, script, voice = "alloy") => {
  const res = await fetch(OPENAI_TTS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: TTS_MODEL,
      voice,
      input: script,
      response_format: "opus",
    }),
  });

  if (!res.ok) {
    const status = res.status;
    if (status === 401)
      throw new Error("API Key가 유효하지 않습니다. [401 Unauthorized]");
    if (status === 429)
      throw new Error(
        "요청 한도 초과입니다. 잠시 후 재시도하세요. [429 Too Many Requests]",
      );
    throw new Error(`TTS 오류 [${status}]`);
  }

  // 응답 binary → base64 data URL (json-server 저장 가능)
  const arrayBuffer = await res.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++)
    binary += String.fromCharCode(bytes[i]);
  return `data:audio/ogg;codecs=opus;base64,${btoa(binary)}`;
};
