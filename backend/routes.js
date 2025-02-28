const express = require("express")
const router = express.Router()
const auth = require("./controllers/authentication_controller")
const chat = require("./controllers/chat_controller")

//AUTHENTICATION RELATED ROUTES.
router.get("/auth/user-profile", ); //Get user profile information.

router.post("/auth/signup", auth.SignUpUser); //Post a new user account.
// router.post("/auth/login", controllers.LoginUser); //Login an existing user.
// router.post("/auth/:userID/logout", controllers.LogoutUser); //Logout a logged in user.

// router.patch("/auth/:userID/update-profile", controllers.UpdateUserProfile); //Update user profile fields.

//CHAT RELATED ROUTES.
// router.get("/chat/:chatID", ); //Get general chat information. 
// router.get("/chat/:chatID/messages", ); //Get all messages.
// router.get("/chat/:chatID/members", ); //Get all member data. 

router.post("/chat", chat.CreateChat); //Post a new chat.
// router.post("/chat/:chatID/messages", ); //Post a message to the chat with with chatID.    
// router.post("/chat/:chatID/censored-phrases/:phrase", ); //Post a new censored phrase in the chat with chatID. 

// router.delete("/chat/:chatID", ); //Delete an existing chat with chatID.
// router.delete("/chat/:chatID/censored-phrases/:phrase", ); //Delete an existing censored phrase in the chat with chatID.
// router.delete("/chat/:chatID/:messageID", ); //Delete a message with messageID from the chat with chatID.  

//FRIENDSHIP RELATED ROUTES.
//router.get("/friends/:userID"); //Get all friends of a user with userID.

//router.post("/friends/:email/")


module.exports = router