const mongoose = require('mongoose')

const schema = mongoose.Schema 

const user_schema = new schema({
    email: {type: String, required: true},
    password: {type: String, required: true},
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    uid: {type: Number, required: true}
}, {timestamps: true})

module.exports = mongoose.model('User', user_schema)


// sender = UserID
// receiver = UserID
// content = message
// timestamp = time of message sent
// status = "sent, delivered, or read"
const message_schema = new schema({
  sender: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true}, 
  receiver: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
  content: {type: string, required: true},
  timestamp: {type: Date, default: Date.now},
  status: {type: string, enum: ["sent", "delivered", "read"], defualt: "sent"}
});

const Message = mongoose.model("Message", message_schema);
module.exports = Message;
