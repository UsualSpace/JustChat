const express = require("express")
const router = express.Router()
const auth = require("./controllers/authentication_controller")
const group = require("./controllers/group_controller")
const middleware = require("./middleware");
const friend = require("./controllers/friend_controller");

//AUTHENTICATION RELATED ROUTES.
router.get("/auth/account-info", middleware.AuthenticateSession, auth.GetAccountInfo); //get user profile information.
router.post("/auth/signup", auth.SignUpUser); //post a new user account.
router.post("/auth/signin", auth.SignInUser); //sign in an existing user.
router.patch("/auth/account-info", middleware.AuthenticateSession, auth.UpdateAccountInfo);
router.delete("/auth/signout", middleware.AuthenticateSession, auth.SignOutUser); //sign out a signed in in user.

//GROUP RELATED ROUTES.
router.get("/groups", middleware.AuthenticateSession, group.GetGroups); //get a list of all group chats and general info that the user with the valid session is a member of.
router.get("/groups/invites", middleware.AuthenticateSession, group.GetInvites);
router.get("/groups/:group_id/messages", middleware.AuthenticateSession, group.GetMessages); //get all messages in a group with group_id.

router.post("/groups", middleware.AuthenticateSession, group.CreateGroup); //post a new chat.
// router.post("/groups/:group_id/message", middleware.AuthenticateSession, ); //post a message to the chat with with group_id. NOTE: NOT NEEDED DUE TO IT BEING HANDLED BY SOCKET.IO.   
router.post("/groups/:group_id/censored-phrases/:phrase", middleware.AuthenticateSession, ); //post a new censored phrase in the chat with chatID. 
router.post("/groups/:group_id/invite/:email", middleware.AuthenticateSession, group.InviteUser)
router.delete("/groups/remove-invite/:invite_id", middleware.AuthenticateSession, group.RemoveInvite);

router.patch("/groups/:group_id/add-member", middleware.AuthenticateSession, group.AddMember);
router.patch("/groups/:group_id/remove-member", middleware.AuthenticateSession, group.RemoveMember);

router.delete("/groups/:group_id", middleware.AuthenticateSession, group.DeleteGroup); //delete an existing group with group_id.
router.delete("/groups/:group_id/censored-phrases/:phrase", middleware.AuthenticateSession, ); //delete an existing censored phrase in the chat with chatID.

//FRIENDSHIP RELATED ROUTES.
router.get("/friends", middleware.AuthenticateSession, friend.GetFriends); //get all friends of a user
router.post("/friends/:email", middleware.AuthenticateSession, friend.FriendRequest); //send a friend request to a user with email.
router.patch("/friends/:friendship_id", middleware.AuthenticateSession, friend.FriendRequestAccept); //accept a friend request.
router.delete("/friends/:friendship_id", middleware.AuthenticateSession, friend.Unfriend); //unfriend a friend.

module.exports = router