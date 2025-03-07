const express = require("express")
const router = express.Router()
const auth = require("./controllers/authentication_controller")
const group = require("./controllers/group_controller")
const middleware = require("./middleware");
const friend = require("./controllers/friend_controller");

//AUTHENTICATION RELATED ROUTES.
router.get("/auth/account-info", middleware.AuthenticateSession, auth.GetAccountInfo); //Get user profile information.
router.post("/auth/signup", auth.SignUpUser); //Post a new user account.
router.post("/auth/signin", auth.SignInUser); //Login an existing user.
router.patch("/auth/account-info", middleware.AuthenticateSession, auth.UpdateAccountInfo);
router.delete("/auth/signout", middleware.AuthenticateSession, auth.SignOutUser); //Signout a signed in in user.

//CHAT RELATED ROUTES.
router.get("/groups", middleware.AuthenticateSession, group.GetGroups); //get a list of all group chats and general info that the user with the valid session is a member of.
router.get("/groups/:group-id/messages", middleware.AuthenticateSession, ); //Get all messages in a chat with.
router.post("/groups", group.CreateGroup); //Post a new chat.
router.post("/groups/:group-id/message", ); //Post a message to the chat with with chatID.    
router.post("/groups/:group-id/censored-phrases/:phrase", middleware.AuthenticateSession, ); //Post a new censored phrase in the chat with chatID. 
router.delete("/groups/:group-id", middleware.AuthenticateSession, ); //Delete an existing chat with chatID.
router.delete("/groups/:group-id/censored-phrases/:phrase", middleware.AuthenticateSession, ); //Delete an existing censored phrase in the chat with chatID.
router.delete("/groups/:group-id/:message-id", middleware.AuthenticateSession, ); //Delete a message with messageID from the chat with chatID.  

//FRIENDSHIP RELATED ROUTES.
router.get("/friends", middleware.AuthenticateSession, friend.GetFriends); //Get all friends of a user
router.post("/friends/:email", middleware.AuthenticateSession, friend.FriendRequest);
router.patch("/friends", middleware.AuthenticateSession, friend.FriendRequestAccept);



module.exports = router