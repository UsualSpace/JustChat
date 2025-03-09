require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const routes = require("./routes");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

//Apply middleware.
app.use(cors());
app.use(express.json());
app.use('/api', routes);

io.on("connection", (socket) => {
    console.log("a user connected");
});

//connect to db
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        //Listen only upon database connection.
        server.listen(process.env.PORT, () => {
            console.log('Connected to database and listening on port', process.env.PORT);
        });
    })
    .catch((error) => {
        console.log(error);
    });
