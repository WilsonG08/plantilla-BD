import Usuario from '../models/Usuario.js'
import mongoose from 'mongoose'
import generarJWT from "../helpers/crearJWT.js"
import sendMailToUser from "../config/nodemailer.js";



// Se crea una funcion asincrona 
const login = async(req, res) =>{
    // Asigna los valores a email y pasword del objeto req.body
    const {email, password} = req.body

    // Verifica si el objeto req.body contiene algun campo vacio
    if (Object.values(req.body).includes("")) return res.status(400).json({msj:"Lo sentimos, debes llenar todos los campos"})
    
    // Busca el email, si lo encuentra devuelve el objeto en caso contrario seria null
    const usuarioBDD = await Usuario.findOne({email}).select("-status -__v -token -updatedAt -createdAt")

    // Verifica si el campo confirmEmail es falso, si es asi devuelve el mensaje
    if(usuarioBDD?.confirmEmail===false) return res.status(403).json({msg:"Lo sentimos, debe verificar su cuenta"})

    // verifica si la contraseña coincide con la almacena en la BDD, si --> true // no --> false
    const verificarPassword = await usuarioBDD.matchPassword(password)

    // Verifica si el valor devuelto es falso, si es asi muestra el msg
    if(!verificarPassword) return res.status(404).json({msg:"Lo sentimos, el password no es el correcto"})

    // Genera un token para el usuario ID 
    const token = generarJWT(usuarioBDD._id)

    // Asigna los valores de los campos a las variables locales
    const {nombre,apellido,_id} = usuarioBDD

    // devuelve una respuesta con el estado 200 y un cuerpo JSON 
    res.status(200).json({
        token,
        nombre,
        apellido,
        _id,
        email: usuarioBDD.email
    })
}


/* const perfil = (req, res)>{
    delete req.usuarioBDD.token
    delete req.usuarioBDD.confirmEmail
    delete req.usuarioBDD.cre
    res.status(200).json(req.usuarioBDD)
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
    const verificarEmailBDD = await Usuario.findOne({email})

    // Verificia si el correo esta registrado y si esta muestra el msg
    if(verificarEmailBDD) return res.status(400).json({msg:"Lo sentimos, el email ya se encuentra registrado"})

    // Crea un objeto con los datos enpecificados 
    const nuevoUsuario = new Usuario(req.body)

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



const confirmEmail = async (req,res)=>{

    // Verifica si la variable esta vacia o no. Si esta vacia la linea devuelve un codigo 404 y el msg
    if(!(req.params.token)) return res.status(400).json({msg:"Lo sentimos, no se puede validar la cuenta"})

    // Bsuca en la BDD un usuario que coincida con el token de autenticacion, Si lo encuentra devuelve encontrado
    const usuarioBDD = await Usuario.findOne({token:req.params.token})

    // Verifica si el token es nulo o no
    if(!usuarioBDD?.token) return res.status(404).json({msg:"La cuenta ya ha sido confirmada"})

    // establece el valor de la propiedad token que es null
    usuarioBDD.token = null

    // Establece el valor de la propiedad confirmar email a true
    usuarioBDD.confirmEmail=true

    // Guarda los cambios realizado en el objeto de la BDD
    await usuarioBDD.save()

    // devuelve un msg de exito
    res.status(200).json({msg:"Token confirmado, ya puedes iniciar sesión"}) 
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