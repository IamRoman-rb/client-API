import React from "react";
import { Link } from "react-router";
import { Icon } from "@iconify/react";

import Style from "../../Styles/components/Header.module.css";

const IconPath = "/img/Icon.svg";

const Header = () => {
  return (
    <header className={Style.header}>
      <nav className={Style.mainNav}>
        <Link to="/products">Productos</Link>
        <Link to="/about">Nosotros</Link>
        <Link to="/questions">Preguntas</Link>
      </nav>
      <Link to="/" className={Style.logoLink}>
        <img src={IconPath} alt="Logo de la empresa" />
      </Link>
      <section className={Style.headerActions}>
        <form action="" method="get">
          <fieldset>
            <input type="text" name="search" id="search" />
          </fieldset>
          <Icon icon="material-symbols:search" className={Style.iconSearch} />
        </form>
        <nav className={Style.userNav}>
          <Link to="/user">
            <Icon icon="mdi:user" className={Style.iconUser} />
          </Link>
        </nav>
      </section>
    </header>
  );
};

export default Header;
