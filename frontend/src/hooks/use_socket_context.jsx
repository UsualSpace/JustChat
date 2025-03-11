import { socket_context } from "../contexts/socket_context";
import { useContext } from "react";

export const UseSocketContext = () => {
    const context = useContext(socket_context);

    if(!context) {
        throw Error("UseSocketContext must be used inside a SocketContextProvider");
    }

    return context;
};