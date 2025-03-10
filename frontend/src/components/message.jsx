import PageBar from "./pagebar";
import PopUp from "./popup";

const Message = ({ msg, socket }) => {

    const formatted_time = new Date(msg.createdAt).toLocaleString();

    const HandleDeleteMsg = async () => {
        try {
            socket.emit("delete_message", msg._id);
            
        } catch ( error ) {
            console.log("Axios Error:", error.response ? error.response.data : error.message);
        }
    };

    return (
        <div className="message">
            <h2>{msg.sender + " @ " + formatted_time}</h2>
            <PageBar title={msg.content}>
                <button className="btn-destructive" onClick={() => HandleDeleteMsg(msg)}> Delete Message </button>
            </PageBar>
        </div>
    );
};

export default Message;