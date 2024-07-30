import { mongoose } from "mongoose";
export const { ObjectId } = mongoose.Types;
const currentYear = new Date().getFullYear();


const movieSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    year: {
      type: Number,
      required: true,
      min: [1896, "Year must be al least 1896"],
      max: [currentYear, `Year cannot exceed ${currentYear}`],
    },
    director: { type: String, required: true, trim: true },
    duration: { type: Number, required: true, trim: true },
    poster: { type: String, required: true, trim: true },
    genre: { type: [String], required: true, trim: true },
    rate: { type: Number, default: 5, trim: true },
  },
  { timestamps: true }
);
movieSchema.set("toJSON", {
  transform(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});
// movieSchema.index({ title: "text" });

export const Movie = mongoose.model("Movie", movieSchema);
