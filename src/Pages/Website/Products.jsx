import { useState, useEffect } from "react";
import Style from "../../Styles/pages/Products.module.css";
import Hero from "../../Components/shared/Hero.jsx";
import { useNavigate, useLocation, Link } from "react-router";
import { Icon } from "@iconify/react";
const list = [
  {
    id: 1,
    name: "Full Body",
    category: "Mallas",
    img: "/img/fullBodyWomen.jpg",
  },
  {
    id: 2,
    name: "First Aid",
    category: "Salvamento",
    img: "/img/backpack.webp",
  },
  {
    id: 3,
    name: "Swim Cap",
    category: "Accesorios",
    img: "/img/swimCap.webp",
  },
  {
    id: 4,
    name: "Swim GG 2",
    category: "Antiparras",
    img: "/img/antiparras.jpg",
  },
];
const Products = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [categorias, setCategorias] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const search = params.get("search");
        const category = params.get("category");
        let query = new URLSearchParams({ page });
        if (search) {
          query.set("search", search);
          setSearch(search);
        } else {
          setSearch("");
        }
        if (category) {
          query.set("category", category);
          setCategory(category);
        } else {
          setCategory("");
        }
        console.log(`?${query.toString()}`);
        // const response = await fetch(`/api/products${query.toString()}`);
        // const data = await response.json();
        // const rCategorias = await fetch(`/api/categories`);
        // const dataCategorias = await rCategorias.json();
        const data = await new Promise((resolve) => {
          setTimeout(() => {
            resolve(list);
          }, 1000);
        });
        setProducts(data);
        setCategorias([...new Set(data.map((item) => item.category))]);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, [page, location]);

  return (
    <main className={Style.productsMain}>
      <Hero title="Swimming Vives" />
      <section className={Style.content}>
        <article className={Style.categories}>
          <h2>Categorias</h2>
          <nav>
            {categorias.map((item, index) => (
              <Link
                key={index}
                to={`/productos?${new URLSearchParams({
                  category: item.toLowerCase(),
                }).toString()}`}
                className={`${Style.category} ${
                  category === item.toLowerCase() ? Style.active : ""
                }`}
              >
                {item}
              </Link>
            ))}
          </nav>
        </article>
        <article className={Style.products}>
          <header>
            <h2>Productos</h2>
            <p>
              {search && `Resultados para "${search}"`}
              {category && `Categoría "${category}"`}
            </p>
          </header>
          <ul>
            {products.map((item) => (
              <li
                key={item.id}
                onClick={() => navigate(`/productos/${item.id}`)}
              >
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
          <form
            onSubmit={(e) => e.preventDefault()}
            className={Style.pagination}
          >
            <button
              type="button"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              <Icon icon="mdi:chevron-left" />
            </button>
            <output>{page}</output>
            <button
              type="button"
              onClick={() => setPage(page + 1)}
              disabled={products.length <= 12}
            >
              <Icon icon="mdi:chevron-right" />
            </button>
          </form>
        </article>
      </section>
    </main>
  );
};

export default Products;
