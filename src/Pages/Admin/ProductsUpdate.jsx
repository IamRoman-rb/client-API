import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import Style from "../../Styles/pages/Product.module.css";
import toast from "react-hot-toast";

const ProductsUpdate = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [producto, setProducto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);
    const [categorias, setCategorias] = useState([]);
    const user = useSelector((state) => state.user.value);

    useEffect(() => {
        const fetchProducto = async () => {
            setLoading(true);
            setError(null);
            
            try {
                console.log("Buscando producto con ID:", id);
                
                const res = await fetch(`http://localhost:8080/productos/${id}`, {
                    headers: user?.accessToken ? { 
                        Authorization: `Bearer ${user.accessToken}`,
                        'Content-Type': 'application/json'
                    } : {},
                });

                console.log("Response status:", res.status);
                
                if (res.status === 404) {
                    setError("Producto no encontrado");
                    setProducto(null);
                    return;
                }
                
                if (!res.ok) {
                    throw new Error(`Error ${res.status}: ${res.statusText}`);
                }
                
                const data = await res.json();
                console.log("Producto encontrado:", data);
                setProducto(data);
                
            } catch (err) {
                console.error("Error fetching producto:", err);
                setError(err.message || "Error al cargar el producto");
                setProducto(null);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProducto();
        }
    }, [id, user]);

    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const res = await fetch("http://localhost:8080/categorias/", {
                    headers: user?.accessToken ? { 
                        Authorization: `Bearer ${user.accessToken}`,
                        'Content-Type': 'application/json'
                    } : {},
                });
                
                if (!res.ok) throw new Error(`Error ${res.status}`);
                
                const data = await res.json();
                setCategorias(Array.isArray(data) ? data.filter(cat => cat.estado === 'ACTIVO') : []);
            } catch (e) {
                console.error("Error fetching categorias:", e);
            }
        };
        
        fetchCategorias();
    }, [user]);

    const [form, setForm] = useState({
        nombre: "",
        descripcion: "",
        valor: 0,
        cantidad: 0,
        descuento: 0,
        estado: "ACTIVO",
        categoriaId: "",
        foto: "",
    });

    useEffect(() => {
        if (producto) {
            console.log("Setting form with producto:", producto);
            setForm({
                nombre: producto.nombre || "",
                descripcion: producto.descripcion || "",
                valor: producto.valor || 0,
                cantidad: producto.cantidad || 0,
                descuento: producto.descuento || 0,
                estado: producto.estado || "ACTIVO",
                categoriaId: producto.categoria?.id || "",
                foto: producto.foto || "",
            });
        }
    }, [producto]);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!producto) return;
        
        setSaving(true);
        
        // Validaciones
        if (!form.nombre || form.nombre.trim().length < 2) {
            toast.error('El nombre es requerido y debe tener al menos 2 caracteres');
            setSaving(false);
            return;
        }
        
        if (form.valor < 0) {
            toast.error('El precio no puede ser negativo');
            setSaving(false);
            return;
        }
        
        if (form.cantidad < 0) {
            toast.error('La cantidad no puede ser negativa');
            setSaving(false);
            return;
        }

        try {
            // Prepara el payload según lo que espera tu backend
            const payload = {
                id: producto.id,
                nombre: form.nombre.trim(),
                descripcion: form.descripcion.trim(),
                valor: form.valor,
                cantidad: form.cantidad,
                descuento: form.descuento,
                estado: form.estado,
                foto: form.foto.trim(),
                categoria: form.categoriaId ? { id: form.categoriaId } : null
            };

            console.log("Enviando payload:", payload);

            const res = await fetch(`http://localhost:8080/productos/editar/${producto.id}`, {
                method: "PUT",
                headers: { 
                    "Content-Type": "application/json", 
                    ...(user?.accessToken ? { Authorization: `Bearer ${user.accessToken}` } : {}) 
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Error ${res.status}: ${errorText}`);
            }

            const updatedProduct = await res.json();
            toast.success('Producto actualizado correctamente');
            navigate("/admin/products");
            
        } catch (err) {
            console.error("Error updating product:", err);
            toast.error(err.message || 'Error al actualizar el producto');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className={Style.mainProduct}>Cargando producto...</div>;
    if (error) return <div className={Style.mainProduct}>Error: {error}</div>;
    if (!producto) return <div className={Style.mainProduct}>Producto no encontrado</div>;

    return (
        <main className={Style.mainProduct}>
            <section className={Style.sectionProduct}>
                <article className={Style.detailProduct}>
                    <figure className={Style.imageProduct}>
                        <img 
                            src={form.foto || "/img/default.jpg"} 
                            alt={form.nombre}
                            onError={(e) => {
                                e.target.src = "/img/default.jpg";
                            }}
                        />
                    </figure>
                </article>

                <article className={Style.dataProduct}>
                    <h3 className={Style.titleProduct}>Editar producto</h3>
                    <form onSubmit={handleSubmit}>
                        <label>
                            Nombre
                            <input 
                                name="nombre" 
                                value={form.nombre} 
                                onChange={handleChange}
                                required
                                minLength={2}
                            />
                        </label>
                        <label>
                            Descripción
                            <textarea 
                                name="descripcion" 
                                value={form.descripcion} 
                                onChange={handleChange}
                                rows={4}
                            />
                        </label>
                        <label>
                            Precio
                            <input 
                                name="valor" 
                                type="number" 
                                step="0.01" 
                                min="0"
                                value={form.valor} 
                                onChange={handleChange} 
                            />
                        </label>
                        <label>
                            Stock
                            <input 
                                name="cantidad" 
                                type="number" 
                                min="0"
                                value={form.cantidad} 
                                onChange={handleChange} 
                            />
                        </label>
                        <label>
                            Descuento %
                            <input 
                                name="descuento" 
                                type="number" 
                                min="0" 
                                max="100"
                                value={form.descuento} 
                                onChange={handleChange} 
                            />
                        </label>
                        <label>
                            Categoría
                            <select 
                                name="categoriaId" 
                                value={form.categoriaId} 
                                onChange={handleChange}
                            >
                                <option value="">-- Sin categoría --</option>
                                {categorias.map(c => (
                                    <option key={c.id} value={c.id}>
                                        {c.nombre}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label>
                            Estado
                            <select 
                                name="estado" 
                                value={form.estado} 
                                onChange={handleChange}
                            >
                                <option value="ACTIVO">ACTIVO</option>
                                <option value="INACTIVO">INACTIVO</option>
                            </select>
                        </label>
                        <label>
                            Foto (URL)
                            <input 
                                name="foto" 
                                value={form.foto} 
                                onChange={handleChange}
                                placeholder="https://ejemplo.com/imagen.jpg"
                            />
                        </label>

                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                            <button 
                                type="submit" 
                                disabled={saving} 
                                className={Style.buttonAddCart}
                            >
                                {saving ? 'Guardando...' : 'Guardar'}
                            </button>
                            <button 
                                type="button" 
                                onClick={() => navigate('/admin/products')}
                                disabled={saving}
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </article>
            </section>
        </main>
    );
};

export default ProductsUpdate;