const { Group, GroupInvite, User } =  require("../models");

const GetGroups = async (req, res) => {
  const { user } = req.body;
  Group.find({ "members.user": user._id}, '_id name members')
    .populate("members")
    .populate("members.user", "_id first_name last_name email")
    .then(groups => {
      res.status(200).json(groups);
    })
    .catch(err => {
        console.error("Error fetching groups: ", err);
        res.status(500).json({error: "Error fetching groups"});
    });
};

const GetInvites = async (req, res) => {
  const { user } = req.body;

  if(!user) {
    return res.status(400).json({error: "missing fields"});
  }

  try {
    const invites = await GroupInvite.find({recipient: user._id}).populate("group", "_id name");
    
    if(!invites) {
      return res.status(400);
    }
    console.log(JSON.stringify(invites, null, 2));
    res.status(200).json(invites);
  } catch (error) {
    res.status(500).json(`Server error get invites ${error.message}`);
  }
};

const CreateGroup = async (req, res) => {
  const { user, group_name } = req.body;

  if(!group_name || !user) {
    return res.status(400).json({message: "missing fields"});
  }

  try {
    const group = await Group.create({
      name: group_name,
      members: [
          {
              user: user._id,
              role: "owner"
          }
      ]
    });
    res.status(200).json(group);
  } catch (error) {
    res.status(500).json(`Server error create group ${error.message}`);
  }
};

const InviteUser = async (req, res) => {
  const { email, group_id } = req.params; 

  if(!email) {
    return res.status(400).json({error: "failure"});
  }

  try {
    const recipient = await User.findOne({email: email}).select("_id");
    if(!recipient) {
      return res.status(400).json({error: "failure"});
    }

    const group_exists = await Group.exists({_id: group_id});
    if(!group_exists) {
      return res.status(400).json({error: "failure"});
    }

    const invite = await GroupInvite.create({
      recipient: recipient._id,
      group: group_id
    });

    res.status(200).json({message: "success"});
  } catch (error) {
    res.status(500).json(`Server error create group ${error.message}`);
  }
};

const RemoveInvite = async (req, res) => {
  const { invite_id } = req.params; 
  console.log("remove invite called");
  if(!invite_id) {
    return res.status(400).json({message: "success"});
  }

  try {

    const invite = await GroupInvite.findByIdAndDelete(invite_id);
    if(!invite) {
      return res.status(400).json({error: "invite invalid"});
    }
    
    res.status(200).json({message: "success"});
  } catch (error) {
    res.status(500).json(`Server error create group ${error.message}`);
  }
};

const AddMember = async (req, res) => {
  const { group_id } = req.params;
  const user_id = req.body.user._id;

  if(!user_id || !group_id) {
    return res.status(400).json({error: "failure"});
  }

  try {
    const user_exists = await User.exists({_id: user_id});
    if(!user_exists) {
      return res.status(400).json({error: "failure"});
    }

    const group = await Group.findById(group_id);
    if(!group) {
      return res.status(400).json({error: "failure"});
    }

    group.members.push({
      user: user_id,
      role: "member"
    });

    group.save();

    res.status(200).json({message: "success"});
  } catch (error) {
    res.status(500).json(`Server error create group ${error.message}`);
  }
};

const RemoveMember = async (req, res) => {
  const { group_id } = req.params;
  const user_id = req.body.user._id;

  if(!user_id || !group_id) {
    return res.status(400).json({error: "failure"});
  }

  try {
    // const user_exists = await User.exists({_id: user_id});
    // if(!user_exists) {
    //   return res.status(400).json({error: "failure"});
    // }

    const group = await Group.findById(group_id);
    if(!group) {
      return res.status(400).json({error: "failure"});
    }
    console.log(user_id);
    group.members = group.members.filter(member => String(member.user) !== String(user_id));
    console.log(group.members)

    await group.save();

    res.status(200).json({message: "success"});
  } catch (error) {
    res.status(500).json(`Server error create group ${error.message}`);
  }
};

const DeleteGroup = async (req, res) => {
  const { user } = req.body;
  const { group_id } = req.params;

  if(!group_id || !user) {
    return res.status(400).json({message: "missing fields"});
  }

  try {
    const group = await Group.findById(group_id);
    console.log(group.members[0]);
    if(!group.members.some((member) => String(member.user) === String(user._id) && member.role == "owner")) {
      return res.status(400).json("delete not authorized for this user");
    }

    const group_delete = await Group.findByIdAndDelete(group_id);
    if(!group_delete) {
      res.status(500).json("Server error: failed to delete group");
    }

    res.status(200).json(group_id);
  } catch (error) {
    res.status(500).json(`Server error create group ${error.message}`);
  }
};

const GetMessages = async (req, res) => {
  const { user } = req.body;
  const { group_id } = req.params;

  if(!group_id || !user) {
    return res.status(400).json({message: "missing fields"});
  }

  try {
    const { messages } = await Group.findById(group_id).populate("messages.sender").select("messages");
    modified_messages = messages.map(message => {
      const { _id, createdAt, content } = message;
      const modified_message = { _id, createdAt, content };
      modified_message.sender = message.sender.first_name + " " + message.sender.last_name;
      modified_message.sender_email = message.sender.email;
      return modified_message;
    });
    console.log(JSON.stringify(modified_messages, null, 2));
    return res.status(200).json(modified_messages);
  } catch (error) {
    res.status(500).json(`Server error get messages ${error.message}`);
  }
};

module.exports = {
  GetGroups,
  GetInvites,
  CreateGroup,
  InviteUser,
  RemoveInvite,
  AddMember,
  RemoveMember,
  DeleteGroup,
  GetMessages
};