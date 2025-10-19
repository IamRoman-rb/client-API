import React from "react";
import Hero from "../../Components/shared/Hero.jsx";
import Style from "../../Styles/pages/Login.module.css";

const Login = () => {
  return (
    <main className={Style.main}>
      <Hero title="Iniciar Sesión" />
      <section className={Style.content}></section>
    </main>
  );
};

export default Login;
