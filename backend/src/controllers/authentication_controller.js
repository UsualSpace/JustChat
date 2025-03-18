const {User, Session} = require("../models");

const SignUpUser = async (req, res) => {
  const { email, password, first_name, last_name } = req.body;

  if(!email || !password || !first_name || !last_name) {
    return res.status(400).json({error: "missing fields"});
  }

  try {
    const user = await User.create({
      email: email,
      password: password,
      first_name: first_name,
      last_name: last_name,
    });
    res.status(201).json({message: "user successfully signed up"});
  } catch (error) {
    res.status(400).json({ error: "cannot use that email" });
  }
};

const SignInUser = async (req, res) => {
  const { email, password } = req.body;

  if(!email || !password) {
    return res.status(400).json({error: "missing fields"});
  }

  try {
    //Find user document with email and grab email, password, and user id.
    const credentials = await User.findOne({email: email}).select("email password _id");
    if(!credentials) {
      return res.status(400).json({error: "there is no account registered with that email"});
    }
    console.log("found user");
    //Naive but for the scope of this project it should be fine.
    if(credentials.password !== password) {
      return res.status(401).json({error: "invalid credentials"});
    }
    console.log("pass confirmed");
    //At this point, passwords matched so generate a session object and return 
    //the session ID for authorizing future requests.
    const session = new Session({
      user: credentials._id
    });

    await session.save();

    console.log("created and saved session to db");
    console.log(session._id);
    res.status(202).json({session_id: session._id});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const SignOutUser = async (req, res) => {
  const { session_id } = req.body;
  
  if(!session_id) {
    return res.status(400).json({error: "missing fields"});
  }

  try {
    //find user document with email and grab email, password, and user id.
    const session = await Session.findByIdAndDelete(session_id);

    if(!session) {
      return res.status(401).json({error: "invalid session id"});
    }

    console.log("reached signout");
    res.status(200).json({message: "user successfully signed out"});
  } catch (error) {
    res.status(500).json({error: error.message });
  }
};

const GetAccountInfo = async(req, res) => {
  try {
    const user_id = req.body.user._id;
    const user = await User.findById(user_id);
    if(!user) {
      return res.status(401).json({error: "user does not exist"});
    }
  
    res.status(200).json({
      email: user.email, 
      first_name: user.first_name, 
      last_name: user.last_name
    });
  } catch (error) {
    res.status(500).json({error: error.message });
  }
};

const UpdateAccountInfo = async(req, res) => {
  try {
    const user_id = req.body.user._id;
    const updates = req.body;
    const user = await User.findByIdAndUpdate(user_id, updates, {
      new: true
    })

    if(!user) {
      return res.status(500).json({error: "user does not exist"});
    }

    res.status(200).json({message: "user successfully updated account information"});

  } catch (error) {
    res.status(500).json({error: error.message});
  }
};
  
module.exports = {
  SignUpUser,
  SignInUser,
  SignOutUser,
  GetAccountInfo,
  UpdateAccountInfo
};