import {Router}from 'express'
import { RegistrarProductos } from '../Controller/Productos'

const Rutas = Router()

Rutas.post('/',RegistrarProductos)

export default Rutas