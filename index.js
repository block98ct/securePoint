// Import required modules
import express from "express";
import bodyParser from "body-parser";
import path from "path";
import cors from "cors";
import http from "http";
import route from "./routes/index.js";
import { Server } from "socket.io";
import "dotenv/config.js";
const app = express();

const server = http.createServer(app);
const io = new Server(server);

// Middleware setup
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));

/**------routes call--------- */
app.use("/api", route);

/**--------server start-------- */
let port = process.env.PORT || 5005;
// "192.168.29.216"

io.on("connection", (socket) => {
  console.log("a user connected");
  console.log(`socket id ${socket.id}`);
});


server.listen(port, "192.168.1.12", () => {
  console.log(`Server started at http://localhost:${port}`); // Log server start message with port number
});
