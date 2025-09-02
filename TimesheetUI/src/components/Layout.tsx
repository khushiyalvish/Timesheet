import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const Layout: React.FC = () => {
  return (
    <div className="app-layout">
      <Header />
      <main style={{ minHeight: "80vh", padding: "20px" }}>
        <Outlet /> {}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
