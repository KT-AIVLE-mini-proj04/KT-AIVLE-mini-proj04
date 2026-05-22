import style from "./Button.module.css";

function Button({ className, children }) {
  return <button className={className}>{children}</button>;
}

export default Button;
