import React, { useEffect, useState } from "react";
import Style from "../../Styles/pages/Products.module.css";
import { useNavigate } from "react-router";
import { Icon } from "@iconify/react";
import { Link } from "react-router";
import Hero from "../../Components/shared/Hero";
import Swal from 'sweetalert2';
import { useSelector } from "react-redux"; // Importar useSelector para obtener el usuario

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.value); // Obtener el usuario del store

  const money = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  });

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/productos/todos", { // Usar proxy de Vite
          headers: user?.accessToken ? { 
            Authorization: `Bearer ${user.accessToken}` 
          } : {}
        });
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data = await res.json();
        const mapped = data.map((p) => ({
          id: p.id,
          name: p.nombre,
          category: p.categoria?.nombre || "Sin categoría",
          img: p.foto || "/img/default.jpg",
          price: p.valor,
          cantidad: p.cantidad,
        }));
        setProducts(mapped);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los productos.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [user]); // Agregar user como dependencia

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: '¿Desactivar producto?',
      text: "Esta acción desactivará el producto y no será visible en la tienda.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, desactivar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/productos/desactivar/${id}`, { // Usar proxy de Vite
          method: "POST",
          headers: user?.accessToken ? { 
            Authorization: `Bearer ${user.accessToken}` 
          } : {}
        });

        if (!res.ok) throw new Error(`Status ${res.status}`);
        
        // Optimista: actualizar UI
        setProducts((prev) => prev.filter((p) => p.id !== id));
        
        // Mostrar confirmación
        Swal.fire(
          '¡Desactivado!',
          'El producto ha sido desactivado correctamente.',
          'success'
        );
      } catch (err) {
        console.error(err);
        Swal.fire(
          'Error',
          'No se pudo desactivar el producto.',
          'error'
        );
      }
    }
  };

  if (loading) return <div className={Style.productsMain}>Cargando productos...</div>;
  if (error) return <div className={Style.productsMain}>{error}</div>;

  return (
    <main className={Style.productsMain}>
      <Hero />
      <section className={Style.content}>
        <article className={Style.products}>
          <header>
            <h2>Administración de Productos</h2>
            <p>Lista completa de productos registrados</p>
            <Link
              to="/admin/products/create"
              className={Style.createButton}
            >
              Crear Nuevo Producto
            </Link>
          </header>

          <ul>
            {products.map((producto) => (
              <li key={producto.id}>
                <figure>
                  <img
                    src={producto.img}
                    alt={producto.name}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/img/default.jpg";
                    }}
                  />
                </figure>
                <article>
                  <h3>{producto.name}</h3>
                  <p>{producto.category}</p>
                </article>

                <form className={Style.formCart} onSubmit={(e) => e.preventDefault()}>
                  <output>{money.format(producto.price)}</output>
                  <button
                    type="button"
                    title="Editar"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(`/admin/products/${producto.id}`);
                    }}
                  >
                    <Icon icon="mdi:pencil" />
                  </button>
                  <button
                    type="button"
                    title="Eliminar"
                    onClick={(e) => {
                      e.preventDefault();
                      handleDelete(producto.id);
                    }}
                  >
                    <Icon icon="mdi:trash-can" />
                  </button>
                </form>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </main>
  );
};

export default AdminProducts;