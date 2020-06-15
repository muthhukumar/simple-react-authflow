import Mongoose from "mongoose";

const ATLAS_URI = process.env.ATLAS_URI!;
Mongoose.connect(ATLAS_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

Mongoose.connection.on("connected", () => {
  console.log("MongoDB connection established");
});

Mongoose.connection.on("disconnected", () => {
  console.log("MongoDB connection disconnected");
});

Mongoose.connection.on("error", (err) => {
  console.log("Error in MongoDB connection " + err);
});
