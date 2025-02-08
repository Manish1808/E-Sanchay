import {Router} from "express";
import { chat } from "../controllers/sandehbot.controller.js";



const router = Router();

router.route("/sandeh").post(chat);




export default router;