import { useState } from 'react'
import type { FormEvent } from 'react'

type ProductoForm = {
  codigo: string
  nombre: string
  descripcion: string
  precio: string
  stock: string
  imagen: string
}

const formularioInicial: ProductoForm = {
  codigo: '',
  nombre: '',
  descripcion: '',
  precio: '0',
  stock: '0',
  imagen: '',
}

function App() {
  const [producto, setProducto] = useState(formularioInicial)
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')
  const [guardando, setGuardando] = useState(false)

  function actualizarCampo(campo: keyof ProductoForm, valor: string) {
    setProducto((actual) => ({ ...actual, [campo]: valor }))
  }

  async function registrarProducto(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMensaje('')
    setError('')
    setGuardando(true)

    try {
      const respuesta = await fetch('/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...producto,
          precio: Number(producto.precio) || 0,
          stock: Number(producto.stock) || 0,
          imagen: producto.imagen || null,
        }),
      })

      const datos = await respuesta.json().catch(() => ({}))

      if (!respuesta.ok) {
        throw new Error(datos.Mensaje || datos.error || 'No se pudo registrar el producto')
      }

      setMensaje(datos.Mensaje || 'Producto registrado exitosamente')
      setProducto(formularioInicial)
    } catch (problema) {
      setError(problema instanceof Error ? problema.message : 'Error de conexión con el servidor')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <main>
      <h1>Registro de productos</h1>

      <form onSubmit={registrarProducto}>
        <label>
          Código *
          <input
            required
            value={producto.codigo}
            onChange={(event) => actualizarCampo('codigo', event.target.value)}
          />
        </label>

        <label>
          Nombre *
          <input
            required
            value={producto.nombre}
            onChange={(event) => actualizarCampo('nombre', event.target.value)}
          />
        </label>

        <label>
          Descripción
          <textarea
            value={producto.descripcion}
            onChange={(event) => actualizarCampo('descripcion', event.target.value)}
          />
        </label>

        <label>
          Precio
          <input
            type="number"
            min="0"
            step="0.01"
            value={producto.precio}
            onChange={(event) => actualizarCampo('precio', event.target.value)}
          />
        </label>

        <label>
          Stock
          <input
            type="number"
            min="0"
            step="1"
            value={producto.stock}
            onChange={(event) => actualizarCampo('stock', event.target.value)}
          />
        </label>

        <label>
          Imagen (URL)
          <input
            type="url"
            value={producto.imagen}
            onChange={(event) => actualizarCampo('imagen', event.target.value)}
          />
        </label>

        <button type="submit" disabled={guardando}>
          {guardando ? 'Guardando...' : 'Registrar producto'}
        </button>
      </form>

      {mensaje && <p role="status">{mensaje}</p>}
      {error && <p role="alert">{error}</p>}
    </main>
  )
}

export default App