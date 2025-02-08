import {Router} from "express";
import {invest} from "../controllers/smartinvest.controller.js";



const router = Router();

router.route("/invest").post(invest);




export default router;