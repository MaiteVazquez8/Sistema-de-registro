import {Router}from 'express'
import { ModificarProducto, RegistrarProductos } from '../Controller/Productos'

const Rutas = Router()

Rutas.post('/Registrar',RegistrarProductos)
Rutas.put('/Modificar/:Id',ModificarProducto)

export default Rutas