import express from "express";
import { signup, signin, signout } from '../controllers/auth.controller.js'

const router = express.Router();

router.post("/sign-up", signup)

router.post("/sign-in", (req, res) => signin)

router.post("/sign-out", (req, res) => signout)

export default router;