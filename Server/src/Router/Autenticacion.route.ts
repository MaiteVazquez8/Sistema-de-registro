import { Router } from 'express';
import { IniciarSesion, RegistrarUsuario } from '../Controller/Autenticacion';

const RutasAutenticacion = Router();

RutasAutenticacion.post('/register', RegistrarUsuario);
RutasAutenticacion.post('/login', IniciarSesion);

export default RutasAutenticacion;