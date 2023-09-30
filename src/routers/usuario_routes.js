import { Router } from 'express'
import {
    login,
    perfil,
    registro,
    confirmEmail,
    actualizarPerfil,
} from '../controllers/usuario_controller.js'

const router = Router();

router.post("/login", login);
router.post("/registro", registro);

router.get("/confirmar/:token", confirmEmail);


router.get("/perfil", perfil);
router.put("/usuario/:id", actualizarPerfil);

export default router

