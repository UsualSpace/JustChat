import PageBar from "./pagebar";
import PopUp from "./popup";

const Message = ({ msg }) => {

    const formatted_time = new Date(msg.createdAt).toLocaleString();

    const HandleDeleteMsg = async (msg) => {

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