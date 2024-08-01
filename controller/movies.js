import { Movie } from "../model/mongoDB/movie.js";

export const movieController = {
  async getAll(req, res) {
    const movieCollection = await Movie.find();
    movieCollection
      ? res.status(200).json({
          success: true,
          message: "Lista de peliculas",
          data: movieCollection,
        })
      : res
          .status(404)
          .json({ success: false, message: "Base de datos de peliculas vacia" });
  },
  async getByTitle(req, res) {
    const { title } = req.query;
    if (!title)
      res
        .status(400)
        .json({ success: false, message: "Falta el parámetro de consulta 'título'" });
  
    try {
      const movies = await Movie.find({
        title: { $regex: title, $options: "i" },
      });
      if (!movies.length) {
        return res.status(404).json({
          success: false,
          message: `No hay películas con ${title}  en el título`,
        });
      }

      return res.status(200).json({
        success: true,
        message: "Películas por título de consulta",
        data: movies,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, message: `Error interno: ${err.message}` });
    }
  },

  async createOne(req, res) {
    const { title, year, director, duration, poster, genre, rate } = req.body;
    try {
      const newMovie = new Movie({
        title,
        year,
        director,
        duration,
        poster,
        genre,
        rate,
      });
      const savedMovie = await newMovie.save();
      res
        .status(200)
        .json({ success: true, message: "Película creada", data: savedMovie });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  async updateMovie(req, res) {
    const allowedFields = [
      "title",
      "year",
      "director",
      "duration",
      "poster",
      "genre",
      "rate",
    ];
    try {
      const updates = Object.keys(req.body);
      const isValidOperation = updates.every((update) =>
        allowedFields.includes(update)
      );
      if (!isValidOperation) {
        return res.status(400).json({
          success: false,
          message: "Campo no válido en el cuerpo de la solicitud. Operación abortada",
        });
      }

      const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!movie) {
        return res.status(404).json({
          success: false,
          message: `Película no encontrada`,
        });
      }
      res
        .status(200)
        .json({ success: true, message: "Película actualizada", data: movie });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Error Interno del Servidor ${error.message}`,
      });
    }
  },

  async deleteOne(req, res) {
    try {
      const movie = await Movie.findByIdAndDelete(req.params.id);
      if (!movie) {
        return res.status(404).json({
          success: false,
          message: `Película no encontrada`,
        });
      }
      res.send(204);
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
};
