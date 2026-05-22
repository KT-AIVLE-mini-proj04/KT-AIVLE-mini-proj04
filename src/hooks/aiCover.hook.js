import { hookBooks } from './books.hook';

const OPENAI_API_URL = 'https://api.openai.com/v1/images/generations';

/**
 * AI 표지 생성 hook
 * @param {string} apiKey  - OpenAI API Key
 * @param {object} book    - { id, title, author, content }
 * @param {object} options - { model, size, quality }
 * @returns {string} imageSrc - data:image/png;base64,...
 */
export const hookAiCover = async (apiKey, book, options = {}) => {
  const {
    model = 'gpt-image-2',
    size = '1024x1536',
    quality = 'medium',
  } = options;

  // 1. 도서 제목·내용으로 프롬프트 구성
  const prompt = `A book cover for a book titled "${book.title}" by ${book.author}. ${book.content}`;

  // 2. OpenAI Image API 호출 (POST)
  const res = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model, prompt, n: 1, size, quality, output_format: 'png' }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    const status = res.status;
    if (status === 401) throw new Error('API Key가 유효하지 않습니다. [401 Unauthorized]');
    if (status === 429) throw new Error('요청 한도 초과입니다. 잠시 후 재시도하세요. [429 Too Many Requests]');
    throw new Error(errData.error?.message || `OpenAI 오류 [${status}]`);
  }

  // 3. b64_json → Data URL 변환
  const data = await res.json();
  const b64Json = data.data?.[0]?.b64_json;
  if (!b64Json) throw new Error('이미지 데이터를 받지 못했습니다.');
  const imageSrc = `data:image/png;base64,${b64Json}`;

  // 4. json-server에 coverImageUrl PATCH 저장
  await hookBooks('PATCH', { id: book.id, coverImageUrl: imageSrc });

  return imageSrc;
};
