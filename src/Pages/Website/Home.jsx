import React from "react";
import Hero from "../../Components/Partials/Hero.jsx";
import { Link } from "react-router-dom";
import "../../Styles/Home/Home.css"

const list = [
    {
        id: 1,
        name: "Full Body",
        category: "Mallas",
        img: "/img/fullBodyWomen.jpg"
    },
    {
        id: 2,
        name: "First Aid",
        category: "Salvamento",
        img: "/img/backpack.webp"
    },
    {
        id: 3,
        name: "Swim Cap",
        category: "Accesorios",
        img: "/img/swimCap.webp"
    },
    {
        id: 4,
        name: "Swim GG 2",
        category: "Antiparras",
        img: "/img/antiparras.jpg"
    }

]
const Home = () => {
    return (
        <main className="homeMain">
            <Hero title="Swimming Vives" />
            <section className="categoryContent">
                <ul>
                    <h2>Mas Vendidos</h2>
                    {list.map((item) => (
                        <li key={item.id}>
                            <figure>
                                <img src={item.img} alt={item.name} />
                            </figure>
                            <article>
                                <h3>{item.name}</h3>
                                <p>{item.category}</p>
                            </article>
                        </li>
                    ))}    
                </ul>   
                <nav>
                    <h2>Categorias</h2>
                    {list.map((item) => (
                        <Link key={item.id}>
                            <p>{item.category}</p>
                        </Link>
                    ))} 
                </nav>
            </section>
        </main>
        );
};
export default Home;