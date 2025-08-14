const express = require("express");
const app = express();
require("dotenv").config();
const dbConnect = require("./config/db");
const cors = require("cors");
const path = require("path");
const http = require("http");
const initializeSocket = require("./utils/socket");

const authRoute = require("./routes/authRoute");
const requestsRoute = require("./routes/requestsRoute");
const userRoute = require("./routes/userRoute");
const profileRoute = require("./routes/profileRoute");
const chatRoute = require("./routes/chatRoute");

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/", authRoute);
app.use("/request", requestsRoute);
app.use("/user", userRoute);
app.use("/profile", profileRoute);
app.use("/chat", chatRoute);

const server = http.createServer(app);
initializeSocket(server);

dbConnect()
  .then(() => {
    console.log("Connected to Database.");
    server.listen(process.env.PORT, () => {
      console.log("Server listening to PORT 3000");
    });
  })
  .catch(() => {
    console.log("Database connection failed.");
  });
