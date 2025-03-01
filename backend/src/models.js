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
  role: {type: String, enum: ["member", "moderator", "owner"], default: "member"}
});

const message_schema = new mongoose.Schema({
  sender: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true}, 
  receiver: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
  content: {type: String, required: true},
}, {timestamps: true});

const groupchat_schema = new mongoose.Schema({
  name: {type: String, required: true},
  members: [member_schema],
  banned_members:[{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
  messages: [message_schema],
  censored_phrases: [{type: String}]
}, {timestamps: true});

const groupchat_invite_schema = new mongoose.Schema({
  sender: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
  groupchat_id: {type: mongoose.Schema.Types.ObjectId, required: true}
});

const privatechat_schema = new mongoose.Schema({
  name: {type: String, required: true},
  members: [member_schema],
  messages: [message_schema]
}, {timestamps: true});

//Handle authentication with sessions. TODO: handle expiration date.
const session_schema = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
  createdAt: {type: Date, default: Date.now, expires: 60 * 60 * 24} //Expire a session after 24 hours.
});

const User = mongoose.model('User', user_schema);
const Friendship = mongoose.model('Friendship', friendship_schema);
const GroupChat = mongoose.model("GroupChat", groupchat_schema);
const GroupChatInvite = mongoose.model("GroupChatInvite", groupchat_invite_schema);
const PrivateChat = mongoose.model("PrivateChat", privatechat_schema);
const Session = mongoose.model("Session", session_schema);

module.exports = {
  User,
  Friendship,
  GroupChat,
  GroupChatInvite,
  PrivateChat,
  Session
};
