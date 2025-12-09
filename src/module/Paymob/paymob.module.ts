import { Router } from "express";
import { cardController } from "./paymob.controller";

const router: Router = Router()

router.post('/card', cardController)

export default router
