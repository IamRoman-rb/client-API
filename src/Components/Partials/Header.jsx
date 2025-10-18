import React from "react";
import { Link } from "react-router";
import { Icon as IconifyIcon } from "@iconify/react";

import "../../Styles/Partials/Header.css";

const IconPath = "/img/Icon.svg";

const Header = () => {
  return (
    <header>
      <nav>
        <Link to="/products">Productos</Link>
        <Link to="/about">Nosotros</Link>
        <Link to="/questions">Preguntas</Link>
      </nav>
      <figure>
        <Link to="/">
          <img src={IconPath} alt="Logo de la empresa" />
        </Link>
      </figure>
      <section>
        <form action="" method="get">
          <fieldset>
            <input type="text" name="search" id="search" />
          </fieldset>
          <IconifyIcon
            icon="material-symbols:search"
            className="iconSearch"
            width="24"
            height="24"
          />
        </form>
        <Link to="/user">
          <IconifyIcon
            icon="mdi:user"
            className="iconUser"
            width="24"
            height="24"
          />
        </Link>
      </section>
    </header>
  );
};

export default Header;
