import { useState } from 'react'
import type { FormEvent } from 'react'

type Pantalla = 'login' | 'registro' | 'productos'

type Producto = {
  id: number
  codigo: string
  nombre: string
  descripcion: string
  talle: string
  precio: number
  stock: number
  imagen: string
}

type ProductoForm = Omit<Producto, 'id' | 'precio' | 'stock'> & {
  precio: string
  stock: string
}

const formularioInicial: ProductoForm = {
  codigo: '',
  nombre: '',
  descripcion: '',
  talle: '',
  precio: '0',
  stock: '0',
  imagen: '',
}

async function obtenerDatos(respuesta: Response) {
  return respuesta.json().catch(() => ({}))
}

function App() {
  const [pantalla, setPantalla] = useState<Pantalla>('login')
  const [email, setEmail] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [nombre, setNombre] = useState('')
  const [productos, setProductos] = useState<Producto[]>([])
  const [producto, setProducto] = useState<ProductoForm>(formularioInicial)
  const [productoEnEdicion, setProductoEnEdicion] = useState<number | null>(null)
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  function limpiarMensajes() {
    setMensaje('')
    setError('')
  }

  function actualizarCampo(campo: keyof ProductoForm, valor: string) {
    setProducto((actual) => ({ ...actual, [campo]: valor }))
  }

  async function iniciarSesion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    limpiarMensajes()
    setCargando(true)

    try {
      const respuesta = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, contrasena }),
      })
      const datos = await obtenerDatos(respuesta)

      if (!respuesta.ok) {
        throw new Error(datos.error || 'No se pudo iniciar sesión')
      }

      await cargarProductos()
      setPantalla('productos')
      setContrasena('')
    } catch (problema) {
      setError(problema instanceof Error ? problema.message : 'Error de conexión con el servidor')
    } finally {
      setCargando(false)
    }
  }

  async function registrarUsuario(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    limpiarMensajes()
    setCargando(true)

    try {
      const respuesta = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, contrasena }),
      })
      const datos = await obtenerDatos(respuesta)

      if (!respuesta.ok) {
        throw new Error(datos.error || 'No se pudo registrar el usuario')
      }

      setMensaje('Usuario registrado. Ahora puede iniciar sesión.')
      setPantalla('login')
      setNombre('')
      setContrasena('')
    } catch (problema) {
      setError(problema instanceof Error ? problema.message : 'Error de conexión con el servidor')
    } finally {
      setCargando(false)
    }
  }

  async function cargarProductos() {
    const respuesta = await fetch('/api/Productos')
    const datos = await obtenerDatos(respuesta)

    if (!respuesta.ok) {
      throw new Error(datos.error || 'No se pudieron cargar los productos')
    }

    setProductos(datos)
  }

  async function guardarProducto(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    limpiarMensajes()
    setCargando(true)

    try {
      const ruta = productoEnEdicion === null
        ? '/api/Registrar'
        : `/api/Modificar/${productoEnEdicion}`
      const respuesta = await fetch(ruta, {
        method: productoEnEdicion === null ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...producto,
          precio: Number(producto.precio) || 0,
          stock: Number(producto.stock) || 0,
          imagen: producto.imagen || null,
        }),
      })
      const datos = await obtenerDatos(respuesta)

      if (!respuesta.ok) {
        throw new Error(datos.Mensaje || datos.error || 'No se pudo guardar el producto')
      }

      setMensaje(datos.Mensaje || 'Producto guardado correctamente')
      cancelarEdicion()
      await cargarProductos()
    } catch (problema) {
      setError(problema instanceof Error ? problema.message : 'Error de conexión con el servidor')
    } finally {
      setCargando(false)
    }
  }

  async function eliminarProducto(id: number) {
    if (!window.confirm('¿Seguro que desea eliminar este producto?')) return

    limpiarMensajes()
    setCargando(true)
    try {
      const respuesta = await fetch(`/api/Eliminar/${id}`, { method: 'DELETE' })
      const datos = await obtenerDatos(respuesta)

      if (!respuesta.ok) {
        throw new Error(datos.error || 'No se pudo eliminar el producto')
      }

      setMensaje(datos.Mensaje || 'Producto eliminado correctamente')
      await cargarProductos()
    } catch (problema) {
      setError(problema instanceof Error ? problema.message : 'Error de conexión con el servidor')
    } finally {
      setCargando(false)
    }
  }

  function editarProducto(productoSeleccionado: Producto) {
    setProducto({
      ...productoSeleccionado,
      precio: String(productoSeleccionado.precio),
      stock: String(productoSeleccionado.stock),
    })
    setProductoEnEdicion(productoSeleccionado.id)
    setMostrarFormulario(true)
    limpiarMensajes()
  }

  function cancelarEdicion() {
    setProducto(formularioInicial)
    setProductoEnEdicion(null)
    setMostrarFormulario(false)
  }

  function cerrarSesion() {
    setPantalla('login')
    setProductos([])
    setEmail('')
    setContrasena('')
    limpiarMensajes()
  }

  if (pantalla === 'login' || pantalla === 'registro') {
    const esRegistro = pantalla === 'registro'

    return (
      <main className="pantalla-acceso">
        <h1>Sistema de registro</h1>
        <h2>{esRegistro ? 'Crear usuario' : 'Iniciar sesión'}</h2>

        <form onSubmit={esRegistro ? registrarUsuario : iniciarSesion}>
          {esRegistro && (
            <label>
              Nombre
              <input required value={nombre} onChange={(event) => setNombre(event.target.value)} />
            </label>
          )}

          <label>
            Email
            <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>

          <label>
            Contraseña
            <input type="password" required minLength={8} value={contrasena} onChange={(event) => setContrasena(event.target.value)} />
          </label>

          <button type="submit" disabled={cargando}>
            {cargando ? 'Espere...' : esRegistro ? 'Registrarse' : 'Iniciar sesión'}
          </button>
        </form>

        <button className="boton-secundario" type="button" onClick={() => { limpiarMensajes(); setPantalla(esRegistro ? 'login' : 'registro') }}>
          {esRegistro ? 'Volver al inicio de sesión' : 'Crear una cuenta'}
        </button>

        {mensaje && <p role="status">{mensaje}</p>}
        {error && <p role="alert">{error}</p>}
      </main>
    )
  }

  return (
    <main>
      <header className="encabezado">
        <div>
          <h1>Productos</h1>
          <p>Administre los productos registrados.</p>
        </div>
        <button className="boton-secundario" type="button" onClick={cerrarSesion}>Cerrar sesión</button>
      </header>

      <div className="acciones">
        <button type="button" onClick={() => { cancelarEdicion(); limpiarMensajes(); setMostrarFormulario(true) }}>
          Cargar nuevo producto
        </button>
        <button className="boton-secundario" type="button" onClick={cargarProductos} disabled={cargando}>
          Actualizar lista
        </button>
      </div>

      {mostrarFormulario && (
        <form className="formulario-producto" onSubmit={guardarProducto}>
          <h2>{productoEnEdicion === null ? 'Cargar producto' : 'Modificar producto'}</h2>
          <div className="campos-producto">
            <label>Código *<input required value={producto.codigo} onChange={(event) => actualizarCampo('codigo', event.target.value)} /></label>
            <label>Nombre *<input required value={producto.nombre} onChange={(event) => actualizarCampo('nombre', event.target.value)} /></label>
            <label>Descripción<textarea value={producto.descripcion} onChange={(event) => actualizarCampo('descripcion', event.target.value)} /></label>
            <label>Talle<input value={producto.talle} onChange={(event) => actualizarCampo('talle', event.target.value)} /></label>
            <label>Precio<input type="number" min="0" step="0.01" value={producto.precio} onChange={(event) => actualizarCampo('precio', event.target.value)} /></label>
            <label>Stock<input type="number" min="0" step="1" value={producto.stock} onChange={(event) => actualizarCampo('stock', event.target.value)} /></label>
            <label>Imagen (URL)<input type="url" value={producto.imagen} onChange={(event) => actualizarCampo('imagen', event.target.value)} /></label>
          </div>
          <div className="acciones-formulario">
            <button type="submit" disabled={cargando}>{cargando ? 'Guardando...' : 'Guardar producto'}</button>
            <button className="boton-secundario" type="button" onClick={cancelarEdicion}>Cancelar</button>
          </div>
        </form>
      )}

      {mensaje && <p role="status">{mensaje}</p>}
      {error && <p role="alert">{error}</p>}

      <section>
        <h2>Lista de productos</h2>
        {productos.length === 0 ? <p>No hay productos registrados.</p> : (
          <div className="tabla-contenedor">
            <table>
              <thead>
                <tr><th>Código</th><th>Nombre</th><th>Precio</th><th>Stock</th><th>Acciones</th></tr>
              </thead>
              <tbody>
                {productos.map((productoActual) => (
                  <tr key={productoActual.id}>
                    <td>{productoActual.codigo}</td>
                    <td>{productoActual.nombre}</td>
                    <td>${productoActual.precio}</td>
                    <td>{productoActual.stock}</td>
                    <td className="acciones-tabla">
                      <button type="button" onClick={() => editarProducto(productoActual)}>Modificar</button>
                      <button className="boton-peligro" type="button" onClick={() => eliminarProducto(productoActual.id)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  )
}

export default App