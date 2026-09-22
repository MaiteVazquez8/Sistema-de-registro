import {Router}from 'express'
import { ObtenerProductos, ModificarProducto, RegistrarProductos, EliminarProducto } from '../Controller/Productos'

const Rutas = Router()

Rutas.get('/Productos',ObtenerProductos)
Rutas.post('/Registrar',RegistrarProductos)
Rutas.put('/Modificar/:Id',ModificarProducto)
Rutas.delete('/Eliminar/:Id',EliminarProducto)
export default Rutas