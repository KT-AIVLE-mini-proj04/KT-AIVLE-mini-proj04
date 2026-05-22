import { useState } from "react";
import Header from "./common/components/Header";
import Footer from "./common/components/Footer";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Header />
      <Footer />
    </>
  );
}

export default App;
