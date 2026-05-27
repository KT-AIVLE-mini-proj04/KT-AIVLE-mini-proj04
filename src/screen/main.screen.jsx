import { Link } from "react-router";
import coverLogo from "@assets/sample_img.png";
import "@screen/main.screen.css";

const stats = [
  { value: "99", label: "등록 도서" },
  { value: "8", label: "나의 표지 관리" },
  { value: "2", label: "도서 관리" },
];

function MainScreen() {
  return (
    <div className="main-page">
      <main>
        <section className="hero">
          <div className="main-shell hero-content">
            <div className="hero-mark">
              <img src={coverLogo} alt="CoverAI" />
            </div>
            <h1>도서 관리 시스템에 오신 것을 환영합니다!</h1>
            <p className="hero-subtext">
              예비 작가들의 창작 활동을 AI 표지 자동 생성으로 응원합니다.
            </p>
            <div className="hero-actions">
              <Link to={"/books"}>
                <button type="button" className="hero-btn">
                  도서 목록
                </button>
              </Link>
              <Link to={"/books/submit"}>
                <button type="button" className="hero-btn ghost">
                  새 도서 등록
                </button>
              </Link>
            </div>
          </div>
        </section>

        <section className="stats" aria-label="도서 현황">
          <div className="main-shell stats-grid">
            {stats.map((item) => (
              <div className="stat" key={item.label}>
                <span className="stat-value">{item.value}</span>
                <span className="stat-label">{item.label}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default MainScreen;
