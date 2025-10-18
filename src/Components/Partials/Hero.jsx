import React from "react";
import "../../Styles/Partials/Hero.css";

const bannerImagePath = "/img/swimmerBanner.webp";

const Hero = ({ title, subtitle, backgroundImage }) => {
  const imgSrc = backgroundImage || bannerImagePath;
  return (
    <section className="hero-section">
      <img
        src={imgSrc}
        alt={title || "Banner"}
      />
      <div className="hero-title-container">
        <h1>{title}</h1>
      </div>
    </section>
  );
};

export default Hero;