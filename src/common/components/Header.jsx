import style from "./Header.module.css";
import TextLogo from "./TextLogo";
import Button from "./Button";
import { Link } from "react-router";

function Header() {
  return (
    <header>
      <Link to={"/"}>
        <TextLogo>걷기가 서재</TextLogo>
      </Link>
      <Button className={style.alarm}>알림</Button>
    </header>
  );
}

export default Header;
