import React from "react";
import { Icon } from "@iconify/react";
import Style from "../../Styles/components/Footer.module.css";
import { Link } from "react-router";

const IconPath = "/img/Icon.svg";

const socialMediasList = [
  {
    id: 1,
    name: "Facebook",
    icon: "mdi:facebook",
    link: "https://www.facebook.com/SwimmingVives",
  },
  {
    id: 2,
    name: "Instagram",
    icon: "mdi:instagram",
    link: "https://www.instagram.com/SwimmingVives",
  },
  {
    id: 3,
    name: "Twitter",
    icon: "mdi:twitter",
    link: "https://www.twitter.com/SwimmingVives",
  },
];

const Footer = () => {
  return (
    <footer className={Style.footer}>
      <form action="">
        <h2>Novedades</h2>
        <fieldset>
          <p>@</p>
          <input
            type="text"
            name="msg"
            id="msg"
            placeholder="Correco Electronico"
          />
          <button type="submit">
            <Icon icon="mdi:send-outline" />
          </button>
        </fieldset>
      </form>
      <section className={Style.dataContainer}>
        <img src={IconPath} alt="" />
        <h2>2025</h2>
        <h2>UADE</h2>
        <p>&copy; 2024 Swimming Vives. Todos los derechos reservados.</p>
      </section>
      <section className={Style.socialMediaContainer}>
        <h2>Contacto</h2>
        <ul>
          {socialMediasList.map((item) => (
            <li key={item.id}>
              <Link href={item.link} target="_blank" rel="noopener noreferrer">
                <Icon icon={item.icon} />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </footer>
  );
};

export default Footer;
