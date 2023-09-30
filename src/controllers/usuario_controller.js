import Usuarios from '../models/Usuarios.js'
import mongoose from 'mongoose'
import sendMailToUser from "../config/nodemailer.js"



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


/* const perfil = (req, res)>{
    delete req.UsuariosBDD.token
    delete req.UsuariosBDD.confirmEmail
    delete req.UsuariosBDD.cre
    res.status(200).json(req.UsuariosBDD)
} */

const perfil = (req, res)=>{
    res.status(200).json({res:'perfil del usuario'})
}


const registro = async (req,res)=>{
    // Extrae las propiedades del email y password del objeto 
    const {email,password} = req.body

    // Verifica si tiene algun valor vacio, para verificar si ha llenado todos los campos obligatorios
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})

    // Busca el usuario en BDD
    const verificarEmailBDD = await Usuarios.findOne({email})

    // Verificia si el correo esta registrado y si esta muestra el msg
    if(verificarEmailBDD) return res.status(400).json({msg:"Lo sentimos, el email ya se encuentra registrado"})

    // Crea un objeto con los datos enpecificados 
    const nuevoUsuario = new Usuarios(req.body)

    // Encripta la contraseña proporcionada por el usuario 
    nuevoUsuario.password = await nuevoUsuario.encrypPassword(password)

    // Crea un token JWT para el nuevo usuario
    const token = nuevoUsuario.crearToken()

    // Se envia un correo electronico al usuario con el token JWT
    await sendMailToUser(email,token)

    // Guarda el nuevo usuario en la base de datos
    await nuevoUsuario.save()

    // Manda al respuesta con el status 200
    res.status(200).json({res:'Revisa tu correo electronico para confirmar tu cuenta'})
}



const confirmEmail = (req,res)=>{
    res.status(200).json({res:'confirmar email de registro del usuario'})
}

const actualizarPerfil = (req,res)=>{
    res.status(200).json({res:'actualizar perfil de un usuario registrado'})
}

export{
    login,
    perfil,
    registro,
    confirmEmail,
    actualizarPerfil,
}