import { hookBookList } from "./hooks/booklist.hook"
import { hookBooks } from './hooks/books.hook'
import { useEffect, useState } from "react"
import MainScreen from './screen/main.screen.jsx'

function App() {
  useEffect(() => {
    // 목록 조회


    //hookBookList().then(console.log)

    // 단건 조회
    //hookBooks('GET', { id: '1' })

    // 추가
    /*hookBooks('POST', {
      title: '테스트',
      author: '한울',
      content: '테스트 내용',
      coverImageUrl: ''
    }).then(console.log)*/

    const res = {
      id: 'vMa9VeVkGDU',
      title: '제목만 수정',
      author: '나',
    }
    // 일부 수정 (PATCH)
    hookBooks('PATCH', res)

    // 삭제
    hookBooks('DELETE', { id: 'vMa9VeVkGDU' }).then(console.log)
  }, [])
  
  return <MainScreen />
}

export default App;
