import { useState } from 'react'
import AICoverGenerator from './screen/AICoverGenerator'

const TEST_BOOK = {
  id: 1,
  title: '별빛 아래의 서점',
  author: '홍길동',
  content: '작은 마을 서점의 1년을 담은 에세이',
}

function App() {
  const [coverSrc, setCoverSrc] = useState('')

  return (
    <div style={{ maxWidth: 480, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h2 style={{ marginBottom: 8 }}>테스트 도서</h2>
      <p style={{ color: '#555', marginBottom: 24 }}>
        📖 {TEST_BOOK.title} — {TEST_BOOK.author}
      </p>

      {coverSrc && (
        <img
          src={coverSrc}
          alt="생성된 표지"
          style={{ width: '100%', borderRadius: 8, marginBottom: 24, boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}
        />
      )}

      <AICoverGenerator
        book={TEST_BOOK}
        onCoverUpdate={(src) => setCoverSrc(src)}
      />
    </div>
  )
}

export default App
