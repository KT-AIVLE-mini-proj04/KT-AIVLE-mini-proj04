import style from "./Button.module.css";

function Button({ className, children, onClick }) {
  return <button className={className} onClick={onClick}>{children}</button>;
}

export default Button;
