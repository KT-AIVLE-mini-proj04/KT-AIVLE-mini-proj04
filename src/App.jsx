import { hookBookList } from "./hooks/booklist.hook"
import { hookBooks } from './hooks/books.hook'
import { useEffect } from "react"

function App() {
  useEffect(() => {
    // 목록 조회
    /*hookBookList().then(console.log)

    // 단건 조회
    hookBooks('GET', { id: '1' }).then(console.log)*/

    // 추가
    /*hookBooks('POST', {
      id: '4',
      title: '테스트',
      author: '한울',
      content: '테스트 내용',
      coverImageUrl: ''
    }).then(console.log)*/


    // 일부 수정 (PATCH)
    hookBooks('PATCH', {
      id: 'fJRtC_Cbz8g',
      title: '제목만 수정',
      author: '나',
    }).then(console.log)

    // 삭제
    //hookBooks('DELETE', { id: 'MNq0sDIB_og' }).then(console.log)

  }, [])

  return <div>테스트 중</div>
}

export default App
