import React from "react";
import { Icon as IconifyIcon } from "@iconify/react";
import "../../Styles/Partials/Footer.css";
import { Link } from "react-router-dom";

const IconPath = "/img/Icon.svg";

const socialMediasList = [
  {
    id: 1,
    name: "Facebook",
    icon: "mdi:facebook",
    link: "https://www.facebook.com/SwimmingVives"
  },
  {
    id: 2,
    name: "Instagram",
    icon: "mdi:instagram",
    link: "https://www.instagram.com/SwimmingVives"
  },
  {
    id: 3,
    name: "Twitter",
    icon: "mdi:twitter",
    link: "https://www.twitter.com/SwimmingVives"
  }
];

const Footer = () => {
  return (
    <footer className="footer">
        <form action="">
            <h2>Novedades</h2>
            <fieldset>
                <p>@</p>
                <input type="text" name="msg" id="msg" placeholder="Correco Electronico"/>
                <button type="submit"><IconifyIcon icon="mdi:send-outline" width="24" height="24" /></button>
            </fieldset>
        </form>
        <section className="dataContainer">
            <img src={IconPath} alt="" />
            <h2>2025</h2>
            <h2>UADE</h2>
            <p>&copy; 2024 Swimming Vives. Todos los derechos reservados.</p>
        </section>
        <section className="socialMediaContainer">
            <h2>Contacto</h2>
            <ul>
                {socialMediasList.map((item) => (
                    <li key={item.id}>
                        <Link href={item.link} target="_blank" rel="noopener noreferrer">
                            <IconifyIcon icon={item.icon} width="24" height="24" />
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    </footer>
  );
}

export default Footer;