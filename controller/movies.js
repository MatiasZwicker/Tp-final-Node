import { Movie } from "../model/mongoDB/movie.js";

export const movieController = {
  async getAll(req, res) {
    const movieCollection = await Movie.find();
    movieCollection
      ? res.status(200).json({
          success: true,
          message: "List of movies",
          data: movieCollection,
        })
      : res
          .status(404)
          .json({ success: false, message: "Movies database empty" });
  },
  async getByTitle(req, res) {
    const { title } = req.query;
    if (!title)
      res
        .status(400)
        .json({ success: false, message: "Missing 'title' query param" });
    // const movies = await Movie.find({
    //   $text: { $search: title },
    // });

    try {
      const movies = await Movie.find({
        title: { $regex: title, $options: "i" },
      });
      if (!movies.length) {
        return res.status(404).json({
          success: false,
          message: `No movies with ${title}  in the title`,
        });
      }

      return res.status(200).json({
        success: true,
        message: "Movies by query title",
        data: movies,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, message: `Internal Error: ${err.message}` });
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
        .json({ success: true, message: "Movie created", data: savedMovie });
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
          message: "Invalid field in the request body. Operation aborted.",
        });
      }

      const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!movie) {
        return res.status(404).json({
          success: false,
          message: `Movie Not Found`,
        });
      }
      res
        .status(200)
        .json({ success: true, message: "Movie updated", data: movie });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Internal Server Error ${error.message}`,
      });
    }
  },

  async deleteOne(req, res) {
    try {
      const movie = await Movie.findByIdAndDelete(req.params.id);
      if (!movie) {
        return res.status(404).json({
          success: false,
          message: `Movie Not Found`,
        });
      }
      res.send(204);
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
};
