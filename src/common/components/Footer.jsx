import style from "./Footer.module.css";
import TextLogo from "./TextLogo";

function CompanyInfo() {
  return (
    <div id={style["company-info"]}>
      <div
        style={{
          display: "flex",
          gap: "24px",
        }}>
        <span>이용약관</span>
        <span>개인정보처리방침</span>
        <span>고객센터</span>
      </div>
      <span>문의 전화: 010-0000-0000</span>
      <span>{"ⓒ 2026. (주) 걷기가 서재 Co., Ltd. All rights reserved."}</span>
    </div>
  );
}

function Footer() {
  return (
    <footer>
      <TextLogo>걷기가 서재</TextLogo>
      <CompanyInfo />
    </footer>
  );
}

export default Footer;
