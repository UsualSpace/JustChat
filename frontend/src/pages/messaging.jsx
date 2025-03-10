import { useParams } from "react-router-dom";
import { useState, useEffect } from "react"
import { UseGroupsContext } from "../hooks/use_groups_context";
import { GetAuthHeader } from "../helpers";
import { io } from "socket.io-client";
const socket = io("http://localhost:4000")

import axios from "axios";


//components
import PageBar from "../components/pagebar";
import Message from "../components/message";
import NavigationBar from "../components/navbar";

const Messaging = () => {
    const { groups } = UseGroupsContext();
    const { group_id } = useParams();
    const [messages, SetMessages] = useState([]);
    const [new_message, SetNewMessage] = useState("");

    const group = groups.find(group => group._id === group_id);
    if(!group) {
        console.log("group data not found");
    }

    useEffect(() => {
        const FetchMessages = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/api/groups/${group._id}/messages`, GetAuthHeader());
                console.log(response.data);
                SetMessages(response.data);
            } catch ( error ) {
                console.log("Axios Error:", error.response ? error.response.data : error.message);
            }
        };

        FetchMessages();
    }, [group_id]);

    useEffect(() => {
        socket.emit("join_group", {
            group_id: group_id,
            session_id: sessionStorage.getItem("session_id")
        });

        socket.on('new_message', (message) => {
            SetMessages((previous_messages) => [...previous_messages, message]);
        });

        socket.on("server_remove_message", (message_id) => {
            SetMessages(messages.filter(msg => msg._id !== message_id));
        });

        return () => {
            socket.emit('leave_group', group_id); 
            socket.off('new_message'); 
            //socket.disconnect(); 
        };
    },[]);

    const HandleSendMessage = async (event) => {
        event.preventDefault();
        try {
            const message = {
                session_id: sessionStorage.getItem("session_id"),
                content: new_message,
                group_id: group_id
            };

            socket.emit("send_message", message);
            
            SetNewMessage("");
        } catch ( error ) {
            console.log("Axios Error:", error.response ? error.response.data : error.message);
        }
    };

    const HandleDeleteMessage = async (message) => {
        // try {
        //     socket.emit("delete_message", {
        //         message_id: message._id,
        //         session_id: sessionStorage.getItem("session_id"),
        //         group_id: group_id
        //     });
        // } catch ( error ) {
        //     console.log("Axios Error:", error.response ? error.response.data : error.message);
        // }
    };

    return (
        <div className="page-container">
            <div className="navbar">
                <NavigationBar></NavigationBar>
            </div>
            <div className="page-background">
                <PageBar title={group.name}>
                    {/*TODO: add a way to get to settings here?*/}
                </PageBar>
                <div className="page-element-list">
                    <div className="scrollable-container">
                        {messages && messages.map((msg) => (
                            <div key={msg._id} className="message">
                                <h2>{msg.sender + " @ " + new Date(msg.createdAt).toLocaleString()}</h2>
                                <PageBar title={msg.content}>
                                    <button className="btn-destructive" onClick={() => HandleDeleteMessage(msg)}> Delete Message </button>
                                </PageBar>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="message-bar">
                    <form onSubmit={HandleSendMessage}>
                        <input 
                            type="text" 
                            placeholder="type in a message"
                            value={new_message}
                            onChange={(event) => SetNewMessage(event.target.value)}
                            required
                        />
                        <button className="btn-constructive" type="submit">Send</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Messaging;