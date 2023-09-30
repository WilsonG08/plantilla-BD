
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

// cARGA LA VARIBALE DE ENOTRNO DEL ARCHIVO .ENV EN EL PROCESO ACTUAL 
dotenv.config()

// Creación del transporter
const transport = nodemailer.createTransport({
    host: process.env.HOST_GMAIL,
    port: process.env.PORT_GMAIL,
    auth: {
        user: process.env.USER_GMAIL,
        pass: process.env.PASS_GMAIL
    }
})


// Enviar mail con el objeto
const sendMailToUser = async(userMail, token) => {
    let info = await transport.sendMail({
        from: 'admin@est.com',
        to: userMail,
        subject: "Verificar tu cuenta de correo electronico",
        html: `
        <h1>Sistema de gestión estudiante (ESFOT)</h1>
        <hr>
        <a href="http://localhost:3000/api/confirmar/${token}">Clic para confirmar tu cuenta</a>
        <hr>
        <footer>Bienvenido a la EPN!</footer>
        `
    });
    console.log("Mensaje enviado satisfactoriamente:", info.messageId)
}

export default sendMailToUser
