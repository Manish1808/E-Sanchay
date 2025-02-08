import {Router} from "express";
import {registerUser,loginUser,updatepoints} from "../controllers/userAuth.controller.js";



const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/updatepoints").post(updatepoints);



export default router;