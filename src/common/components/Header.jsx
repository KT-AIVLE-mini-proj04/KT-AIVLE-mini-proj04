import style from "./Header.module.css";
import TextLogo from "./TextLogo";
import Button from "./Button";
import { Link } from "react-router";
import Search from "./Search";

function Header() {

  return (
    <header>
      <Link to={"/"}>
        <TextLogo>걷기가 서재</TextLogo>
      </Link>
      <div className={style.btBox}>
        <Button className={style.alarm}>알림</Button>
        <Search />
      </div>

    </header>
  );
}

export default Header;
