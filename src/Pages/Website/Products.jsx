import { useState, useEffect } from "react";
import Style from "../../Styles/pages/Products.module.css";
import Hero from "../../Components/shared/Hero.jsx";
import { useNavigate, useLocation, Link } from "react-router";
import { Icon } from "@iconify/react";
import { useSelector, useDispatch } from "react-redux";
import { add } from "../../Redux/Slices/cart.js";
const list = [
  {
    id: 1,
    name: "Full Body",
    category: "Mallas",
    img: "/img/fullBodyWomen.jpg",
    price: 100,
  },
  {
    id: 2,
    name: "First Aid",
    category: "Salvamento",
    img: "/img/backpack.webp",
    price: 100,
  },
  {
    id: 3,
    name: "Swim Cap",
    category: "Accesorios",
    img: "/img/swimCap.webp",
    price: 100,
  },
  {
    id: 4,
    name: "Swim GG 2",
    category: "Antiparras",
    img: "/img/antiparras.jpg",
    price: 100,
  },
];
const Products = () => {
  const { user } = useSelector((state) => state.user);
  const items = useSelector((state) => state.cart.value);
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const money = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  });
  useEffect(() => {
    console.log("items", items);
  }, [items]);
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // const response = await fetch(`/api/usuario`);
        // const data = await response.json();
        setProfile(user);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    if (user) {
      fetchProfile();
    }
  }, [user]);
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
            {products.map((producto) => (
              <li
                key={producto.id}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  navigate(`/productos/${producto.id}`);
                }}
              >
                <figure>
                  <img src={producto.img} alt={producto.name} />
                </figure>
                <article>
                  <h3>{producto.name}</h3>
                  <p>{producto.category}</p>
                </article>

                {user && profile?.role !== "admin" && (
                  <form
                    onSubmit={(e) => e.preventDefault()}
                    className={Style.formCart}
                  >
                    <output>{money.format(producto.price)} </output>
                    {Array.isArray(items) &&
                      items.find((item) => item.id === producto.id) && (
                        <span className={Style.quantity}>
                          {
                            items.find((item) => item.id === producto.id)
                              .quantity
                          }
                        </span>
                      )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        dispatch(add(producto));
                      }}
                    >
                      <Icon icon="mdi:cart" />
                    </button>
                  </form>
                )}
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
