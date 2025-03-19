import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, useLayoutEffect } from "react"
import { UseGroupsContext } from "../hooks/use_groups_context";
import { UseSocketContext } from "../hooks/use_socket_context";
import { GetAuthHeader } from "../helpers";
import { io } from "socket.io-client";
import { API_URL } from "../constants.js";
const socket = io(`${API_URL}`);

import axios from "axios";

//components
import PageBar from "../components/pagebar";
import NavigationBar from "../components/navbar";

//icons
import { SendHorizontal, EllipsisVertical } from "lucide-react";

const Messaging = () => {
    const { groups } = UseGroupsContext();
    const { group_id } = useParams();
    const [messages, SetMessages] = useState([]);
    const [new_message, SetNewMessage] = useState("");

    const navigate = useNavigate();

    const group = groups.find(group => group._id === group_id);
    if(!group) {
        console.log("group data not found");
    }

    const bottom_ref = useRef(null);

    useEffect(() => {
        const FetchMessages = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/groups/${group._id}/messages`, GetAuthHeader());
                SetMessages(response.data);
            } catch ( error ) {
                console.log("Axios Error:", error.response ? error.response.data : error.message);
            }
        };

        FetchMessages();
    }, [group_id]);

    useLayoutEffect(() => {
        bottom_ref.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        socket.emit("join_group", {
            group_id: group_id,
            session_id: sessionStorage.getItem("session_id")
        });

        socket.on('new_message', (message) => {
            SetMessages((previous_messages) => [...previous_messages, message]);
        });

        socket.on("server_delete_message", (message_id) => {
            SetMessages((previous_messages) => previous_messages.filter(msg => msg._id !== message_id));
        });

        return () => {
            socket.emit('leave_group', group_id); 
            socket.off("new_message");
        };
    },[]);

    const HandleSendMessage = (event) => {
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
            
        }
    };

    const HandleDeleteMessage = (message) => {
        try {
            socket.emit("delete_message", {
                message_id: message._id,
                session_id: sessionStorage.getItem("session_id"),
                group_id: group_id
            });
        } catch ( error ) {
            
        }
    };

    return (
        <div className="page-container">
            <div className="navbar">
                <NavigationBar></NavigationBar>
            </div>
            <div className="messaging">
                <div className="page-background">
                    <PageBar title={group.name}>
                        <div className="icon-container">
                            <EllipsisVertical className="icon-ellipsis-vertical" size={40} strokeWidth={3} title={`More about ${group.name}`} onClick={() => navigate(`/groups/${group._id}/settings`)} />
                        </div>
                    </PageBar>
                    <br/>
                    <div className="page-element-list">
                        {messages && messages.map((msg) => (
                            <div key={msg._id} className={sessionStorage.getItem("email") === msg.sender_email ? "msg-self" : "msg-other"}>
                                <h2>{msg.sender + " @ " + new Date(msg.createdAt).toLocaleString()}</h2>
                                <p>{msg.content}</p>
                                <br/>
                                <button className="btn-destructive" onClick={() => HandleDeleteMessage(msg)}> Delete Message </button>
                            </div>
                        ))}
                        <div ref={bottom_ref}/>
                    </div>
                    <br/>
                    <form className="message-bar" onSubmit={HandleSendMessage}>
                        <input 
                            type="text" 
                            placeholder={`Message @${group.name}`}
                            value={new_message}
                            onChange={(event) => SetNewMessage(event.target.value)}
                            required
                            className="input-message"
                        />
                        <div className="icon-container">
                            <SendHorizontal size={40} strokeWidth={3} type="submit"/>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Messaging;