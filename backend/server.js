import app from "./src/app.js";
import { config } from "dotenv";
import http from "http";
import setupSocketServer from "./src/socket/socket.js";
import logger from "./src/logger/logger.js";
config();

const PORT = process.env.PORT | 3000;
const httpServer = http.createServer(app);
setupSocketServer(httpServer);

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
