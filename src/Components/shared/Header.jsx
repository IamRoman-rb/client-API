import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Icon } from "@iconify/react";
import { useSelector } from "react-redux";

import Style from "../../Styles/components/Header.module.css";
import Search from "./Search";

const IconPath = "/img/Icon.svg";
const paths = {
  default: [
    {
      id: 1,
      path: "/products",
      name: "Productos",
      icon: null,
      left: false,
    },
    {
      id: 2,
      path: "/about",
      name: "Nosotros",
      icon: null,
      left: false,
    },
    {
      id: 3,
      path: "/questions",
      name: "Preguntas",
      icon: null,
      left: false,
    },
    { id: 4, path: "/login", name: "Usuario", icon: "mdi:user", left: true },
  ],
  comprador: [
    {
      id: 1,
      path: "/user",
      name: "Usuario",
      icon: "mdi:user",
      left: true,
    },
    {
      id: 2,
      path: "/logout",
      name: "Salir",
      icon: "mdi:logout",
      left: true,
    },
    {
      id: 3,
      path: "/user/cart",
      name: "Carrito",
      icon: "mdi:cart",
      left: true,
    },
    {
      id: 4,
      path: "/productos",
      name: "Productos",
      icon: null,
      left: false,
    },
    {
      id: 5,
      path: "/about",
      name: "Nosotros",
      icon: null,
      left: false,
    },
    {
      id: 6,
      path: "/questions",
      name: "Preguntas",
      icon: null,
      left: false,
    },
  ],
  administrador: [
    {
      id: 1,
      path: "/admin",
      name: "Usuario",
      icon: "mdi:user",
      left: true,
    },
    {
      id: 2,
      path: "/logout",
      name: "Salir",
      icon: "mdi:logout",
      left: true,
    },
    {
      id: 3,
      path: "/admin/orders",
      name: "Ordenes",
      icon: null,
      left: false,
    },
    {
      id: 4,
      path: "/admin/products",
      name: "Productos",
      icon: null,
      left: false,
    },
  ],
};

const Header = () => {
  const [profile, setProfile] = useState("default");
  const { user } = useSelector((state) => state.user);
  useEffect(() => {
    if (!user) {
      setProfile("default");
    }
    if (user?.role === "ADMINISTRADOR") {
      setProfile("administrador");
    }
    if (user?.role === "COMPRADOR") {
      setProfile("comprador");
    }
  }, [user]);
  return (
    <header className={Style.header}>
      <nav className={Style.mainNav}>
        {paths[profile]
          .filter((path) => !path.left)
          .map((path) => (
            <Link key={path.id} to={path.path}>
              {path.name}
            </Link>
          ))}
      </nav>
      <Link to="/" className={Style.logoLink}>
        <img src={IconPath} alt="Logo de la empresa" />
      </Link>
      <section className={Style.headerActions}>
        <Search />
        <nav className={Style.userNav}>
          {paths[profile]
            .filter((path) => path.left)
            .map((path) => (
              <Link key={path.id} to={path.path}>
                <Icon icon={path.icon} />
              </Link>
            ))}
        </nav>
      </section>
    </header>
  );
};

export default Header;
