import {Router}from 'express'
import { RegistrarProducto } from '../Controller/Productos'

const Rutas = Router()

Rutas.post('/',RegistrarProducto)

export default Rutas