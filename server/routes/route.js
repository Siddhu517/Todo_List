import express from "express";
import { getData, postData, deleteData, postDataCheck } from "../controllers/auth";

const router = express.Router();

router.post("/", postData);
router.get("/", getData);
router.delete("/:id", deleteData);
router.put("/:id", postDataCheck);

export default router;
