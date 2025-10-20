import React from "react";
import Hero from "../../Components/shared/Hero.jsx";
import Style from "../../Styles/pages/Login.module.css";
import { Icon } from "@iconify/react";

const Login = () => {
  return (
    <main className={Style.main}>
      <Hero title="Iniciar Sesión" />
      <form className={Style.content} action="" method="">
        <fieldset className={Style.fieldsetInput}>
          <label htmlFor="email" className={Style.label}>Email</label>
            <input type="email" className={Style.input} name="email" id="email" />
        </fieldset>
        <fieldset className={Style.fieldsetInput}>
          <label htmlFor="password" className={Style.label}>Contraseña</label>
          <input type="password" className={Style.input} name="password" id="password" />
          <button><Icon icon=""/></button>
        </fieldset>
        <fieldset  className={Style.fieldsetInputs}>
          <button type="submit">Ingresar</button>
          <button>Olvide mi contraseña</button>
        </fieldset>
        
      </form>
    </main>
  );
};

export default Login;
