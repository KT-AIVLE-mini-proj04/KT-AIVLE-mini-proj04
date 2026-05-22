import style from "./TextLogo.module.css";

function TextLogo({ children }) {
  return <h3 id={style["text-logo"]}>{children}</h3>;
}

export default TextLogo;
