const {User, Session} = require("../models");

const SignUpUser = async (req, res) => {
  const { email, password, first_name, last_name } = req.body;

  if(!email || !password || !first_name || !last_name) {
    return res.status(400).json({message: "missing fields"});
  }

  try {
    const user = await User.create({
      email: email,
      password: password,
      first_name: first_name,
      last_name: last_name,
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const SignInUser = async (req, res) => {
  const { email, password } = req.body;

  if(!email || !password) {
    return res.status(400).json({message: "missing fields"});
  }

  try {
    //Find user document with email and grab email, password, and user id.
    const credentials = await User.findOne({email: email}).select("email password _id");

    //Naive but for the scope of this project it should be fine.
    if(credentials.password !== password) {
      return res.status(401).json({message: "invalid credentials"})
    }

    //At this point, passwords matched so generate a session object and return 
    //the session ID for authorizing future requests.
    const session = await Session.create({
      user: credentials._id
    });

    res.status(200).json({session_id: session._id});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const SignOutUser = async (req, res) => {
  const { session_id } = req.body;
  
  if(!session_id) {
    return res.status(400).json({message: "missing fields"});
  }

  try {
    //Find user document with email and grab email, password, and user id.
    const session = await Session.findByIdAndDelete(session_id);

    //Naive but for the scope of this project it should be fine.
    if(!session) {
      return res.status(401).json({message: "invalid session id"});
    }

    res.status(200).json({message: "successfully signed out"});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const GetUserProfile = async(req, res) => {

};

const UpdateUserProfile = async(req, res) => {

};
  
  module.exports = {
    SignUpUser,
    SignInUser,
    SignOutUser,
    GetUserProfile,
    // UpdateUserProfile
  };