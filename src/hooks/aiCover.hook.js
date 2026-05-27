const OPENAI_API_URL = "https://api.openai.com/v1/images/generations";

// Canvas API로 이미지를 지정 크기로 압축 (JPEG 70%) → json-server 저장 크기 절감
export const compressImage = (dataUrl, targetWidth, targetHeight) => new Promise((resolve, reject) => {
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width  = targetWidth;
    canvas.height = targetHeight;
    canvas.getContext('2d').drawImage(img, 0, 0, targetWidth, targetHeight);
    resolve(canvas.toDataURL('image/jpeg', 0.7));
  };
  img.onerror = reject;
  img.src = dataUrl;
});

/**
 * hookAiCover — AI 표지 생성 hook
 *
 * OpenAI 이미지 생성 API를 호출하고, 결과를 json-server에 저장한 뒤
 * Data URL(base64) 형태의 이미지 경로를 반환합니다.
 *
 * ─────────────────────────────────────────
 * 파라미터
 * ─────────────────────────────────────────
 * @param {string} apiKey
 *   OpenAI API Key (sk-... 형태)
 *   예) 'sk-proj-abc123...'
 *
 * @param {object} book
 *   도서 정보 객체 — 아래 필드가 모두 있어야 합니다.
 *   - id      {string|number}  json-server 도서 ID
 *   - title   {string}         도서 제목 (프롬프트에 사용)
 *   - author  {string}         저자명   (프롬프트에 사용)
 *   - content {string}         줄거리   (프롬프트에 사용)
 *
 * @param {object} [options={}]
 *   이미지 생성 옵션 (모두 선택 사항, 생략 시 기본값 사용)
 *   - model   {string}  생성 모델       기본값: 'gpt-image-2'
 *   - size    {string}  이미지 크기     기본값: '1024x1536'
 *                       선택: '1024x1024' | '1024x1536'
 *   - quality {string}  이미지 품질     기본값: 'medium'
 *                       선택: 'low' | 'medium' | 'high'
 *
 * ─────────────────────────────────────────
 * 반환값
 * ─────────────────────────────────────────
 * @returns {Promise<string>}
 *   생성된 이미지의 Data URL — 'data:image/png;base64,...'
 *   이 값은 <img src={imageSrc} /> 에 바로 사용 가능합니다.
 *   json-server의 해당 도서 coverImageUrl 필드에도 자동 저장됩니다.
 *
 * ─────────────────────────────────────────
 * 에러
 * ─────────────────────────────────────────
 * 아래 상황에서 Error를 throw합니다. try/catch로 처리하세요.
 *   - API Key 없음 또는 잘못됨 → '401 Unauthorized'
 *   - 요청 한도 초과           → '429 Too Many Requests'
 *   - 이미지 데이터 없음       → '이미지 데이터를 받지 못했습니다.'
 *
 * ─────────────────────────────────────────
 * 사용 예시
 * ─────────────────────────────────────────
 * import { hookAiCover } from '@hooks/aiCover.hook';
 *
 * // 기본 옵션으로 호출
 * const imageSrc = await hookAiCover(apiKey, book);
 *
 * // 옵션 지정
 * const imageSrc = await hookAiCover(apiKey, book, {
 *   size: '1024x1024',
 *   quality: 'high',
 * });
 *
 * // 에러 처리 포함
 * try {
 *   const imageSrc = await hookAiCover(apiKey, book);
 *   console.log(imageSrc); // 'data:image/png;base64,...'
 * } catch (err) {
 *   console.error(err.message);
 * }
 */
export const hookAiCover = async (apiKey, book, options = {}) => {
  if (!apiKey) {
    throw new Error(
      "OpenAI API Key가 필요합니다. 입력창에 sk-... 키를 입력하거나 .env에 VITE_OPENAI_API_KEY를 설정하세요.",
    );
  }

  const {
    model = 'gpt-image-2',
    size = '1024x1536',
    quality = 'medium',
    compressWidth = 512,
    compressHeight = 768,
  } = options;

  // 1. 도서 제목·내용으로 프롬프트 구성
  const prompt = `A book cover for a book titled "${book.title}" by ${book.author}. ${book.content}`;

  // 2. OpenAI Image API 호출 (POST)
  const res = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      prompt,
      n: 1,
      size,
      quality,
      output_format: "png",
    }),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    const status = res.status;
    if (status === 401)
      throw new Error("API Key가 유효하지 않습니다. [401 Unauthorized]");
    if (status === 429)
      throw new Error(
        "요청 한도 초과입니다. 잠시 후 재시도하세요. [429 Too Many Requests]",
      );
    throw new Error(errData.error?.message || `OpenAI 오류 [${status}]`);
  }

  // 3. b64_json → Data URL 변환
  const data = await res.json();
  const b64Json = data.data?.[0]?.b64_json;
  if (!b64Json) throw new Error("이미지 데이터를 받지 못했습니다.");
  const imageSrc = `data:image/png;base64,${b64Json}`;
  const compressedSrc = await compressImage(imageSrc, compressWidth, compressHeight);

  // 4. json-server에 coverImageUrl PATCH 저장
  return compressedSrc;
};
