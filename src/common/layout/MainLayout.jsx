import { Outlet } from "react-router";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Loading from "../components/Loading";
import "../../App.css";

function MainLayout() {
  return (
    <div className="layout-container">
      <Loading />
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;
