// Import required modules
import express from 'express';
import bodyParser from "body-parser"
import cors from "cors"
import route from "./routes/index.js"
import "dotenv/config.js"
const app = express();

// Middleware setup
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"))

/**------routes call--------- */
app.use('/api', route);

/**--------server start-------- */
let port = process.env.PORT || 5005;
// "192.168.29.216"
app.listen(port,() => {
    console.log(`Server started at http://localhost:${port}`); // Log server start message with port number
});
