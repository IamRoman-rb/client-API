import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import Style from "../../Styles/pages/Product.module.css";
import Hero from "../../Components/shared/Hero";
import toast from "react-hot-toast";

const AdminProductsCreate = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [categorias, setCategorias] = useState([]);
    const [atributos, setAtributos] = useState([]);
    const user = useSelector((state) => state.user.value);

    // Estado inicial del formulario
    const [form, setForm] = useState({
        nombre: "",
        valor: 0,
        descripcion: "",
        foto: "",
        cantidad: 0,
        descuento: 0,
        categoria: { id: "" },
        estado: "ACTIVO",
        datos: []
    });

    // Verificación de permisos
    useEffect(() => {
        if (user?.accessToken) {
            try {
                const decoded = jwtDecode(user.accessToken);
                const roles = decoded?.roles || decoded?.authorities || [];
                const role = Array.isArray(roles) ? roles[0] : roles;
                
                if (role !== "ROLE_ADMINISTRADOR") {
                    toast.error("No tienes permisos para crear productos");
                    navigate("/admin/products");
                    return;
                }
            } catch (err) {
                console.error("Error al decodificar el token:", err);
                toast.error("Error de autenticación");
                navigate("/login");
            }
        } else {
            navigate("/login");
        }
    }, [user, navigate]);

    // Cargar categorías
    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                setLoading(true);
                const res = await fetch("/api/categorias/", {
                    headers: user?.accessToken ? { 
                        Authorization: `Bearer ${user.accessToken}`,
                        'Content-Type': 'application/json'
                    } : {},
                });
                
                if (!res.ok) throw new Error(`Error ${res.status}`);
                
                const data = await res.json();
                // Filtrar solo categorías activas
                const categoriasActivas = Array.isArray(data) 
                    ? data.filter(cat => cat.estado === 'ACTIVO') 
                    : [];
                setCategorias(categoriasActivas);
                
            } catch (e) {
                console.error("Error fetching categorias:", e);
                toast.error("Error al cargar las categorías");
            } finally {
                setLoading(false);
            }
        };
        
        if (user?.accessToken) {
            fetchCategorias();
        }
    }, [user]);

    // Cargar atributos disponibles
    useEffect(() => {
        const fetchAtributos = async () => {
            try {
                const res = await fetch("/api/atributos/", {
                    headers: user?.accessToken ? { 
                        Authorization: `Bearer ${user.accessToken}`,
                        'Content-Type': 'application/json'
                    } : {},
                });
                
                if (res.ok) {
                    const data = await res.json();
                    setAtributos(Array.isArray(data) ? data : []);
                }
            } catch (e) {
                console.error("Error fetching atributos:", e);
                // No mostramos error porque los atributos son opcionales
            }
        };
        
        if (user?.accessToken) {
            fetchAtributos();
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : value
        }));
    };

    const handleCategoriaChange = (e) => {
        const categoriaId = e.target.value;
        setForm(prev => ({
            ...prev,
            categoria: { id: categoriaId }
        }));
    };

    const handleAtributoChange = (index, field, value) => {
        setForm(prev => {
            const nuevosDatos = [...prev.datos];
            if (!nuevosDatos[index]) {
                nuevosDatos[index] = {};
            }
            nuevosDatos[index][field] = value;
            return {
                ...prev,
                datos: nuevosDatos
            };
        });
    };

    const agregarAtributo = () => {
        setForm(prev => ({
            ...prev,
            datos: [...prev.datos, { atributoNombre: "", valor: "" }]
        }));
    };

    const eliminarAtributo = (index) => {
        setForm(prev => ({
            ...prev,
            datos: prev.datos.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        
        // Validaciones
        if (!form.nombre || form.nombre.trim().length < 2) {
            toast.error('El nombre es requerido y debe tener al menos 2 caracteres');
            setSaving(false);
            return;
        }
        
        if (form.valor <= 0) {
            toast.error('El precio debe ser mayor a 0');
            setSaving(false);
            return;
        }
        
        if (form.cantidad < 0) {
            toast.error('La cantidad no puede ser negativa');
            setSaving(false);
            return;
        }

        if (form.descuento < 0 || form.descuento > 100) {
            toast.error('El descuento debe estar entre 0 y 100%');
            setSaving(false);
            return;
        }

        if (!form.categoria.id) {
            toast.error('Debes seleccionar una categoría');
            setSaving(false);
            return;
        }

        if (!form.descripcion || form.descripcion.trim().length < 10) {
            toast.error('La descripción es requerida y debe tener al menos 10 caracteres');
            setSaving(false);
            return;
        }

        try {
            // Preparar payload según ProductoRequest
            const payload = {
                nombre: form.nombre.trim(),
                descripcion: form.descripcion.trim(),
                valor: form.valor,
                cantidad: form.cantidad,
                descuento: form.descuento,
                estado: form.estado,
                foto: form.foto.trim() || null,
                categoria: form.categoria.id ? { id: form.categoria.id } : null,
                datos: form.datos.filter(dato => dato.atributoNombre && dato.valor)
            };

            console.log("Enviando payload para crear producto:", payload);

            const res = await fetch(`/api/productos/crear`, {
                method: "POST",
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

            const nuevoProducto = await res.json();
            toast.success('Producto creado correctamente');
            navigate("/admin/products");
            
        } catch (err) {
            console.error("Error creating product:", err);
            if (err.message.includes("409") || err.message.includes("duplicado")) {
                toast.error('Ya existe un producto con ese nombre');
            } else {
                toast.error(err.message || 'Error al crear el producto');
            }
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className={Style.mainProduct}>Cargando categorías...</div>;

    return (
        <main className={Style.mainProduct}>
        <Hero />
            <section className={Style.sectionProduct}>
                <article className={Style.detailProduct}>
                    <figure className={Style.imageProduct}>
                        <img 
                            src={form.foto || "/img/default.jpg"} 
                            alt={form.nombre || "Nuevo producto"}
                            onError={(e) => {
                                e.target.src = "/img/default.jpg";
                            }}
                        />
                        {!form.foto && (
                            <div className={Style.imagePlaceholder}>
                                <span>Vista previa</span>
                            </div>
                        )}
                    </figure>
                </article>

                <article className={Style.dataProduct}>
                    <div className={Style.pageHeader}>
                        <h3 className={Style.titleProduct}>Crear Nuevo Producto</h3>
                        <button 
                            type="button" 
                            onClick={() => navigate('/admin/products')}
                            className={Style.backButton}
                        >
                            ← Volver a Productos
                        </button>
                    </div>
                    
                    <form onSubmit={handleSubmit}>
                        {/* Información Básica */}
                        <div className={Style.formSection}>
                            <h4>Información Básica</h4>
                            
                            <label>
                                Nombre *
                                <input 
                                    name="nombre" 
                                    value={form.nombre} 
                                    onChange={handleChange}
                                    required
                                    minLength={2}
                                    placeholder="Nombre del producto"
                                    disabled={saving}
                                />
                            </label>
                            
                            <label>
                                Descripción *
                                <textarea 
                                    name="descripcion" 
                                    value={form.descripcion} 
                                    onChange={handleChange}
                                    rows={4}
                                    placeholder="Describe el producto en detalle..."
                                    required
                                    minLength={10}
                                    disabled={saving}
                                />
                            </label>
                            
                            <label>
                                Foto (URL)
                                <input 
                                    name="foto" 
                                    value={form.foto} 
                                    onChange={handleChange}
                                    placeholder="https://ejemplo.com/imagen.jpg"
                                    disabled={saving}
                                />
                                <small className={Style.helperText}>
                                    Opcional. Si no proporcionas una URL, se usará una imagen por defecto.
                                </small>
                            </label>
                        </div>

                        {/* Precio y Stock */}
                        <div className={Style.formSection}>
                            <h4>Precio y Stock</h4>
                            <div className={Style.formRow}>
                                <label>
                                    Precio *
                                    <input 
                                        name="valor" 
                                        type="number" 
                                        step="0.01" 
                                        min="0.01"
                                        value={form.valor} 
                                        onChange={handleChange} 
                                        required
                                        disabled={saving}
                                    />
                                </label>
                                
                                <label>
                                    Stock *
                                    <input 
                                        name="cantidad" 
                                        type="number" 
                                        min="0"
                                        value={form.cantidad} 
                                        onChange={handleChange} 
                                        required
                                        disabled={saving}
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
                                        disabled={saving}
                                    />
                                </label>
                            </div>
                        </div>

                        {/* Categoría y Estado */}
                        <div className={Style.formSection}>
                            <h4>Categoría y Estado</h4>
                            <div className={Style.formRow}>
                                <label>
                                    Categoría *
                                    <select 
                                        value={form.categoria.id} 
                                        onChange={handleCategoriaChange}
                                        required
                                        disabled={saving || categorias.length === 0}
                                    >
                                        <option value="">Seleccionar categoría</option>
                                        {categorias.map(c => (
                                            <option key={c.id} value={c.id}>
                                                {c.nombre}
                                            </option>
                                        ))}
                                    </select>
                                    {categorias.length === 0 && (
                                        <small className={Style.helperText}>
                                            No hay categorías activas disponibles. 
                                            <button 
                                                type="button" 
                                                onClick={() => navigate('/admin/categories')}
                                                className={Style.linkButton}
                                            >
                                                Crear categoría
                                            </button>
                                        </small>
                                    )}
                                </label>
                                
                                <label>
                                    Estado *
                                    <select 
                                        name="estado" 
                                        value={form.estado} 
                                        onChange={handleChange}
                                        disabled={saving}
                                    >
                                        <option value="ACTIVO">ACTIVO</option>
                                        <option value="INACTIVO">INACTIVO</option>
                                    </select>
                                </label>
                            </div>
                        </div>

                        {/* Atributos Adicionales */}
                        <div className={Style.formSection}>
                            <div className={Style.sectionHeader}>
                                <h4>Atributos Adicionales</h4>
                                <button 
                                    type="button" 
                                    onClick={agregarAtributo}
                                    className={Style.addButton}
                                    disabled={saving}
                                >
                                    + Agregar Atributo
                                </button>
                            </div>
                            
                            {form.datos.map((dato, index) => (
                                <div key={index} className={Style.atributoRow}>
                                    <input
                                        type="text"
                                        placeholder="Nombre del atributo (ej: Color, Tamaño)"
                                        value={dato.atributoNombre || ""}
                                        onChange={(e) => handleAtributoChange(index, 'atributoNombre', e.target.value)}
                                        className={Style.atributoInput}
                                        disabled={saving}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Valor (ej: Rojo, Grande)"
                                        value={dato.valor || ""}
                                        onChange={(e) => handleAtributoChange(index, 'valor', e.target.value)}
                                        className={Style.atributoInput}
                                        disabled={saving}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => eliminarAtributo(index)}
                                        className={Style.deleteButton}
                                        disabled={saving}
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                            
                            {form.datos.length === 0 && (
                                <p className={Style.noAtributos}>
                                    No hay atributos adicionales. Agrega algunos si es necesario (ej: Color, Tamaño, Material).
                                </p>
                            )}
                        </div>

                        {/* Botones de acción */}
                        <div className={Style.formActions}>
                            <button 
                                type="submit" 
                                disabled={saving} 
                                className={Style.buttonPrimary}
                            >
                                {saving ? 'Creando Producto...' : 'Crear Producto'}
                            </button>
                            <button 
                                type="button" 
                                onClick={() => navigate('/admin/products')}
                                disabled={saving}
                                className={Style.buttonSecondary}
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

export default AdminProductsCreate;