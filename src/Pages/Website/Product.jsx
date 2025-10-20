import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { add } from "../../Redux/Slices/cart.js";
import Style from "../../Styles/pages/Product.module.css";
import Hero from "../../Components/shared/Hero.jsx";

const Product = () => {
    const { id } = useParams();
    const [producto, setProducto] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const param = decodeURIComponent(id || "");

        const fetchByQuery = async (q) => {
            try {
                const res = await fetch(`http://localhost:8080/productos/buscar?q=${encodeURIComponent(q)}`);
                if (!res.ok) return null;
                const arr = await res.json();
                // asumir que el endpoint devuelve un array de productos
                return Array.isArray(arr) && arr.length ? arr[0] : null;
            } catch (e) {
                return null;
            }
        };

        const fetchAllAndFind = async (q) => {
            try {
                const res = await fetch("http://localhost:8080/productos/todos");
                if (!res.ok) return null;
                const arr = await res.json();
                const found = arr.find(p => (p.nombre || "").toLowerCase() === q.toLowerCase());
                return found || null;
            } catch (e) {
                return null;
            }
        };

        const resolveProducto = async () => {
            setLoading(true);
            let result = null;
            // 1) si no, intentar buscar por query (nombre)
            if (!result) result = await fetchByQuery(param);

            // 2) fallback: traer todos y buscar por nombre exacto (case-insensitive)
            if (!result) result = await fetchAllAndFind(param);

            setProducto(result);
            setLoading(false);
        };

        if (param) resolveProducto();
    }, [id]);

    useEffect(() => {
        const fetchRelated = async () => {
            if (!producto?.categoria?.id) return setRelated([]);
            setRelatedLoading(true);
            try {
                const res = await fetch(`http://localhost:8080/productos/categoria/${producto.categoria.id}`);
                if (!res.ok) return setRelated([]);
                const data = await res.json();
                setRelated(Array.isArray(data) ? data.filter(p => p.id !== producto.id) : []);
            } catch (e) {
                setRelated([]);
            } finally {
                setRelatedLoading(false);
            }
        };
        fetchRelated();
    }, [producto]);

    const dispatch = useDispatch();
    const items = useSelector((state) => state.cart.value);
    const { user } = useSelector((state) => state.user);

    const money = new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
    });

    const [related, setRelated] = useState([]);
    const [relatedLoading, setRelatedLoading] = useState(false);
    const navigate = useNavigate();

    if (loading) return <p>Cargando...</p>;
    if (!producto) return <p>Producto no encontrado</p>;

    return (
        <main className={Style.mainProduct}>
            <Hero />
            <section className={Style.sectionProduct}>
                <article className={Style.detailProduct}>
                    <figure className={Style.imageProduct}>
                        <img
                            src={producto.foto || "/img/default.jpg"}
                            alt={producto.nombre}
                            loading="lazy"
                            onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = "/img/default.jpg";
                            }}
                        />
                    </figure>
                </article>
                <article className={Style.dataProduct}>
                    <h3 className={Style.titleProduct}>{producto.nombre}</h3>
                    <p className={Style.description}>{producto.descripcion}</p>
                    <ul className={Style.info}>
                        <h2>Caracteristicas</h2>
                        <li>Categoría: {producto.categoria?.nombre}</li>
                        <li>Stock: {producto.cantidad}</li>
                        <li>Descuento: {producto.descuento}%</li>
                        <li>Estado: {producto.estado}</li>
                    </ul>
                    <h3 className={Style.price}>{money.format(producto.valor)}</h3>
                    {user?.role !== "admin" && (
                        <form onSubmit={(e) => e.preventDefault()}>
                            <button
                            className={Style.buttonAddCart}
                                type="button"
                                onClick={() => dispatch(add({
                                    id: producto.id,
                                    name: producto.nombre,
                                    price: producto.valor,
                                    img: producto.foto || "/img/default.jpg",
                                }))}
                            >
                                Agregar al carrito
                            </button>
                        </form>
                    )}
                </article>
            </section>
            <section className={Style.relatedProducts}>
                <h4 className={Style.relatedProductsTitle}>Productos relacionados</h4>
                {relatedLoading ? (
                    <p>Cargando relacionados...</p>
                ) : related.length ? (
                    <ul className={Style.relatedProductsList}>
                        {related.map((r) => (
                            <li key={r.id} onClick={() => navigate(`/productos/${encodeURIComponent(r.nombre)}`)} style={{ cursor: 'pointer', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <img src={r.foto || '/img/default.jpg'} alt={r.nombre} width={64} height={64} loading="lazy" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/img/default.jpg' }} />
                                <div>
                                    <div className={Style.relatedProductName}>{r.nombre}</div>
                                    <div>{money.format(r.valor)}</div>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No hay productos relacionados</p>
                )}
            </section>
        </main>
    );
};

export default Product;