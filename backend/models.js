const mongoose = require('mongoose');

//User related schemas.
const user_schema = new mongoose.Schema({
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  first_name: {type: String, required: true},
  last_name: {type: String, required: true},
}, {timestamps: true});

const friendship_schema = new mongoose.Schema({
  requester: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
  receiver: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
  status: {type: String, enum: ["accepted", "pending"], default: "pending"}
}, {timestamps: true});

//Chat related schemas.
const member_schema = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
  role: {type: String, enum: ["normal", "moderator", "owner"], default: "normal"}
});

const message_schema = new mongoose.Schema({
  sender: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true}, 
  receiver: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
  content: {type: String, required: true},
}, {timestamps: true});

const groupchat_schema = new mongoose.Schema({
  name: {type: String, required: true},
  members: [member_schema],
  messages: [message_schema],
  censored_phrases: [{type: String}]
}, {timestamps: true});

const User = mongoose.model('User', user_schema);
const Friendship = mongoose.model('FriendShip', friendship_schema);
const GroupChat = mongoose.model("GroupChat", groupchat_schema);

module.exports = {
  User,
  Friendship,
  GroupChat
};
