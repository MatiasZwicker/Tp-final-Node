import { Router } from "express";
export const router = Router();
import { movieController } from "../controller/movies.js";
import { token } from "../services/jwt.js";
router.get("/", token.validate, movieController.getAll);
router.get("/s", movieController.getByTitle);
router.get("/:id", (req, res) => {
  const { id } = req.params;
  res.send(`List a movie by id: ${id}`);
});
router.post("/", movieController.createOne);
router.patch("/:id", movieController.updateMovie);
router.delete("/:id", movieController.deleteOne);
