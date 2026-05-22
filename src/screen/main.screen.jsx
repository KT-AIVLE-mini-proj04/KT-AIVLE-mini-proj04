import coverLogo from '../assets/sample_img.png'
import './main.screen.css'

const stats = [
	{ value: '99', label: '등록 도서' },
	{ value: '8', label: '나의 표지 관리' },
	{ value: '2', label: '도서 관리' },
]

function MainScreen() {
	return (
		<div className="main-page">
			<header className="main-header">
				<div className="main-shell header-content">
					<strong className="brand">걷기와 서재</strong>
					<button type="button" className="alert-btn">
						알림
					</button>
				</div>
			</header>

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
							<button type="button" className="hero-btn">
								도서 목록
							</button>
							<button type="button" className="hero-btn ghost">
								새 도서 등록
							</button>
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

			<footer className="main-footer">
				<div className="main-shell footer-content">
					<strong className="footer-brand">걷기와 서재</strong>
					<div className="footer-meta">
						<div className="footer-links">
							<button type="button" className="footer-link">
								이용약관
							</button>
							<button type="button" className="footer-link">
								개인정보처리방침
							</button>
							<button type="button" className="footer-link">
								고객센터
							</button>
						</div>
						<div className="footer-contact">문의 전화 : 010-0000-0000</div>
						<div className="footer-copy">
							© 2026. (주) 걷기와 서재 Co., Ltd. All rights reserved.
						</div>
					</div>
				</div>
			</footer>
		</div>
	)
}

export default MainScreen