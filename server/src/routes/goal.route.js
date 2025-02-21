import {Router} from "express";
import {creategoal,updategoal,deletegoal,getgoals} from "../controllers/goal.controller.js";



const router = Router();

router.route("/creategoal").post(creategoal);
router.route("/updategoal/:id").put(updategoal);
router.route("/deletegoal/:id").delete(deletegoal);
router.route("/getgoals").post(getgoals);



export default router;