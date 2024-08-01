import express from "express";
import "dotenv/config";

import "./config/db.js";
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

import { router as moviesRouter } from "./router/movies.js";
import { router as usersRouter } from "./router/users.js";

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, (err) => {
  console.log(
    err
      ? `Error al iniciar el servidor: ${err.message}`
      : `Servidor ejecutándose en el puerto http://127.0.0.1:${PORT} \n
    Ctrl + C para salir...`
  );
});

app.use("/api/movies", moviesRouter);
app.use("/api/users", usersRouter);