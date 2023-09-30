import jwt from "jsonwebtoken";

// Es una funcion que genera un token JWT valido por un dia 
const generarJWT = (id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:"1d"})
}

export default  generarJWT