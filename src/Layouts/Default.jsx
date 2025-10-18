import { useEffect } from "react";
import { Outlet, useParams } from "react-router-dom";
import Header from "../Components/Partials/Header";
import { useLocation } from "react-router-dom";
import Footer from "../Components/Partials/Footer";

const Default = () => {
  const params = useParams();
  const { pathname } = useLocation();
  useEffect(() => {
    const title = params.id
      ? pathname
          .split("/")
          .filter((item) => item !== "")
          .shift()
      : pathname.split("/").pop();
    document.title =
      pathname === "/"
        ? `ASM | HOME`
        : `ASM | ${title.replace("/", "").toUpperCase()}`;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname, params]);
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};

export default Default;
