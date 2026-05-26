import { Outlet } from "react-router";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../../App.css";

function MainLayout() {
  return (
    <div className="layout-container">
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;
