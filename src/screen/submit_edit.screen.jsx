import './App.css';

import { useState } from 'react';
import { useEffect } from 'react';

import './App.css';

function App() {
  return (
    <div className="page">
      <header className="header">
        <h1 className="logo">걷기가 서재</h1>
        <button className="alarm-btn">알림</button>
      </header>

      <main className="main">
        <button className="back-btn">← 뒤로 가기</button>

        <section className="content">
          <section className="form-card">
            <div className="form-title">새 도서 등록</div>

            <form className="book-form">
              <label>
                제목
                <input type="text" placeholder="제목을 입력하세요" />
              </label>

              <label>
                저자
                <input type="text" placeholder="저자를 입력하세요" />
              </label>

              <label>
                내용
                <textarea placeholder="내용을 입력하세요" />
              </label>

              <div className="form-buttons">
                <button type="button" className="cancel-btn">
                  취소
                </button>
                <button type="submit" className="save-btn">
                  저장
                </button>
              </div>
            </form>
          </section>

          <section className="ai-section">
            <h2>AI 표지 생성</h2>

            <div className="result-box">
              <p>(결과물)</p>
            </div>
          </section>
        </section>
      </main>

      <footer className="footer">
        <h2 className="footer-logo">걷기가 서재</h2>

        <div className="footer-info">
          <div className="footer-links">
            <span>이용약관</span>
            <span>개인정보처리방침</span>
            <span>고객센터</span>
          </div>

          <p>문의 전화: 010-0000-0000</p>
          <p>© 2026. (주) 걷기가 서재 Co., Ltd. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;