import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { poolPromise as promesaConexion, sql } from '../Config/supabase';

const saltos = 12;

export async function RegistrarUsuario(req: Request, res: Response) {
    try {
        const { nombre, email, contrasena } = req.body;

        if (!nombre || !email || !contrasena) {
            return res.status(400).json({ error: 'Nombre, email y contraseña son obligatorios' });
        }

        if (typeof contrasena !== 'string' || contrasena.length < 8) {
            return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres' });
        }

        const emailNormalizado = String(email).trim().toLowerCase();
        const conexion = await promesaConexion;
        const usuarioExistente = await conexion.request()
            .input('email', sql.VarChar(255), emailNormalizado)
            .query('SELECT id FROM Usuarios WHERE email = @email');

        if (usuarioExistente.recordset.length > 0) {
            return res.status(409).json({ error: 'El email ya esta registrado' });
        }

        const hashContrasena = await bcrypt.hash(contrasena, saltos);

        await conexion.request()
            .input('nombre', sql.VarChar(100), String(nombre).trim())
            .input('email', sql.VarChar(255), emailNormalizado)
            .input('hashContrasena', sql.VarChar(255), hashContrasena)
            .query('INSERT INTO Usuarios (nombre, email, contrasena_hash) VALUES (@nombre, @email, @hashContrasena)');

        return res.status(201).json({ mensaje: 'Usuario registrado correctamente' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al registrar el usuario' });
    }
}

export async function IniciarSesion(req: Request, res: Response) {
    try {
        const { email, contrasena } = req.body;

        if (!email || !contrasena) {
            return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
        }

        const conexion = await promesaConexion;
        const resultado = await conexion.request()
            .input('email', sql.VarChar(255), String(email).trim().toLowerCase())
            .query('SELECT id, nombre, email, contrasena_hash FROM Usuarios WHERE email = @email');

        const usuario = resultado.recordset[0];
        const contrasenaValida = usuario
            ? await bcrypt.compare(String(contrasena), usuario.contrasena_hash)
            : false;

        if (!usuario || !contrasenaValida) {
            return res.status(401).json({ error: 'Credenciales invalidas' });
        }

        return res.status(200).json({
            mensaje: 'Inicio de sesión exitoso',
            usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al iniciar sesion' });
    }
}