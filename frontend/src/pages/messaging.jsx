

const Messaging = () => {

    return (
        <div className="page-background">
            
            <div className="message-bar">
                <form action="">
                    <input 
                        type="text" 
                        placeholder="type in a message"
                    />
                    <button className="btn-constructive">Send</button>
                </form>
            </div>
        </div>
    );
};

export default Messaging;