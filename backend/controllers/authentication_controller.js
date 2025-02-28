const {User} = require("../models");

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

};

const SignOutUser = async (req, res) => {

};

const GetUserProfile = async(req, res) => {

};

const UpdateUserProfile = async(req, res) => {

};
  
  module.exports = {
    SignUpUser,
    // SignInUser,
    // SignOutUser,
    // GetUserProfile,
    // UpdateUserProfile
  };