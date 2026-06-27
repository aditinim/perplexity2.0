import {Router } from 'express';
import { loginValidator, registerValidator } from '../validators/auth.validator.js';
import { register, verifyEmail, login, getMe } from '../controllers/auth.controller.js';
import {authUser} from '../middlewares/auth.middleware.js'


const authRouter= Router();

authRouter.post("/register", registerValidator, register);

authRouter.get("/verify-email", verifyEmail);

authRouter.post("/login", loginValidator, login);

authRouter.get("/get-me", authUser, getMe);





export default authRouter