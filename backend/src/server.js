require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const routes = require("./routes");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type'],
    }
});

const { Session, Group, Message } = require("./models.js");

//Apply middleware.
app.use(cors());
app.use(express.json());
app.use('/api', routes);

//connect to db
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        //Listen only upon database connection.
        server.listen(process.env.PORT, () => {
            console.log('Connected to database and listening on port', process.env.PORT);
        });

        io.on("connection", (socket) => {
            console.log("a user connected: ", socket.id);
        
            //Will return user doc for message formatting, or nothing if it failed.
            const GetUserSessionSocket = async (session_id) => {
                try {
                    const session = await Session.findById(session_id).populate("user");
                    return session;
                } catch (error) {
                    console.log("Server error get user session socket: ", error);
                    return null;
                };
            };
        
            socket.on("join_group", async ({ session_id, group_id }) => {
                console.log(session_id);
                const session = await GetUserSessionSocket(session_id);
                if(!session) {
                    console.log("invalid session id from: ", socket.id);
                    return;
                }
                socket.join(group_id);
                console.log("joined group");
            });
        
            socket.on("send_message", async ({ session_id, content, group_id }) => {
                //TODO: censor message based on censored phrases.
                const session = await GetUserSessionSocket(session_id);
                if(!session) {
                    console.log("invalid session id from: ", socket.id);
                    return;
                }
        
                try {
                    const group = await Group.findById(group_id);
                    if(!group) {
                        throw new Error(`group ${group_id} not found`);
                    }
                    
                    const message = new Message({
                        sender: session.user._id,
                        content: content
                    });

                    group.messages.push(message);
        
                    await group.save();
                    const { _id, createdAt } = group.messages[group.messages.length - 1];
                    console.log(createdAt);
                    const modified_message = { _id, createdAt, content };
                    modified_message.sender = session.user.first_name + " " + session.user.last_name;
                    console.log(modified_message);
                    io.to(group_id).emit("new_message", modified_message);
                } catch (error) {
                    console.log("error fetching group data: ", error);
                    
                }
            });

            socket.on("delete_message", async ({ session_id, message_id, group_id }) => {
                const session = await GetUserSessionSocket(session_id);
                if(!session) {
                    console.log("invalid session id from: ", socket.id);
                    return;
                }

                try {
                    const group = await Group.findById(group_id);
                    if(!group) {
                        throw new Error(`group ${group_id} not found`);
                    }
                    
                    const message = new Message({
                        sender: session.user._id,
                        content: content
                    });

                    group.messages.push(message);
        
                    await group.save();
                    const { _id, createdAt } = group.messages[group.messages.length - 1];
                    console.log(createdAt);
                    const modified_message = { _id, createdAt, content };
                    modified_message.sender = session.user.first_name + " " + session.user.last_name;
                    console.log(modified_message);
                    io.to(group_id).emit("new_message", modified_message);
                } catch (error) {
                    console.log("error fetching group data: ", error);
                    
                }
            });
        
            socket.on("leave_group", (group_id) => {
                socket.leave(group_id);
            })
        
        });
    })
    .catch((error) => {
        console.log(error);
    }); 
