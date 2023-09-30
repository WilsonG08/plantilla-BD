import Usuarios from '../models/Usuarios.js'
import mongoose from 'mongoose';


// Se crea una funcion asincrona 
const login = async(req, res) =>{
    // Asigna los valores a email y pasword del objeto req.body
    const {email, password} = req.body

    // Verifica si el objeto req.body contiene algun campo vacio
    if (Object.values(req.body).includes("")) return res.status(400).json({msj:"Lo sentimos, debes llenar todos los campos"})
    
    // Busca el email, si lo encuentra devuelve el objeto en caso contrario seria null
    const UsuariosBDD = await Usuarios.findOne({email}.select("-status -__v -token -updatedAt -createdAt"))

    // Verifica si el campo confirmEmail es falso, si es asi devuelve el mensaje
    if(UsuariosBDD?.confirmEmail===false) return res.status(403).json({msg:"Lo sentimos, debe verificar su cuenta"})

    // verifica si la contraseña coincide con la almacena en la BDD, si --> true // no --> false
    const verificarPassword = await UsuariosBDD.matchPassword(password)

    // Verifica si el valor devuelto es falso, si es asi muestra el msg
    if(!verificarPassword) return res.status(404).json({msg:"Lo sentimos, el password no es el correcto"})

    // Genera un token para el usuario ID 
    const token = generarJWT(UsuariosBDD._id)

    // Asigna los valores de los campos a las variables locales
    const {nombre,apellido,_id} = UsuariosBDD

    // devuelve una respuesta con el estado 200 y un cuerpo JSON 
    res.status(200).json({
        token,
        nombre,
        apellido,
        _id,
        email: UsuariosBDD.email
    })
}


