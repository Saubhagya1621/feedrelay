import dotenv from "dotenv";
import { createServer } from "http";
import connectDB from "./db/index.js";
import { app } from "./app.js";
import { initSocket } from "./socket/index.js";

dotenv.config({ path: "./.env" });

const httpServer = createServer(app);
const io = initSocket(httpServer);
app.set("io", io);

connectDB()
  .then(() => {
    httpServer.listen(process.env.PORT || 8000, () => {
      console.log(`Server running at port: ${process.env.PORT || 8000}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
  });
