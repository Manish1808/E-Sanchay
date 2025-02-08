import {Router} from "express";
import {updateGoal,createExpense,updateExpense,deleteExpense,getExpenses,summarizeExpenses} from "../controllers/sancheyagent.controller.js";



const router = Router();

router.route("/updategoal").post(updateGoal);
router.route("/createexpense").post(createExpense);
router.route("/expenses/:userId").get(getExpenses);
router.route("/expenses/:expenseId").put(updateExpense).delete(deleteExpense);
router.route("/summarize").post(summarizeExpenses);





export default router;