const User = require("./models");

// USER controller
const RegisterNewUser = async (req, res) => {
  //TODO: add confirm password field
  const { email, password, first_name, last_name } = req.body;
  const id = 2;
  try {
    const user = await User.create({
      email: email,
      password: password,
      first_name: first_name,
      last_name: last_name,
      uid: 2,
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  RegisterNewUser: RegisterNewUser,
};

// MESSAGE controller
const Message = async (req, res) => {
  const { sender, receiver, content } = req.body;

  try {
    const newMessage = new Message({ sender, receiver, content });
    await newMessage.save();

    res
      .status(200)
      .json({ message: "Message sent succesfully", data: newMessage });
  } catch (error) {
    res.status(400).json({ error: "Failed to send message" });
  }
};

/* not sure if this is how we're suppose to be exporting multiple controller functions
module.exports = {
    RegisterNewUser: RegisterNewUser;
    Message: Message;


}
*/
