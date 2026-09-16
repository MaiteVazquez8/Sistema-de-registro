import {sql,poolPromise} from '../Config/supabase'
import {Request,Response} from 'express'

export async function RegistrarProducto (req:Request,res:Response){
    try{
        const {codigo,nombre,descripcion,precio,stock,imagen} = req.body
        if(!codigo || !nombre){
            return res.status(400).json({Mensaje:'Debe completar los campos Código y Nombre para continuar'})
        }
        const pool = await poolPromise
        const result = await pool.request()
            .input('codigo', sql.VarChar, codigo)
            .input('nombre', sql.VarChar, nombre)
            .input('descripcion', sql.VarChar(sql.MAX), descripcion)
            .input('precio', sql.Decimal(10, 2), precio ?? 0)
            .input('stock', sql.Int, stock ?? 0)
            .input('imagen', sql.VarChar, imagen ?? null)

            .query('INSERT INTO Productos (codigo, nombre, descripcion, precio, stock, imagen) VALUES (@codigo, @nombre, @descripcion, @precio, @stock, @imagen)') 
            return res.status(201).json({Mensaje:'Producto registrado exitosamente'})
    }
    catch(error){
        console.error('Error al registrar el producto:', error)
        return res.status(500).json({error:'Error interno del servidor'})
    }
}