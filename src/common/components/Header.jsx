import style from "./Header.module.css";
import TextLogo from "./TextLogo";
import Button from "./Button";

function Header() {
  return (
    <header>
      <TextLogo>걷기가 서재</TextLogo>
      <Button className={style.alarm}>알림</Button>
    </header>
  );
}

export default Header;
