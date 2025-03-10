const { Group } =  require("../models");

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
  CreateGroup,
  DeleteGroup,
  GetMessages
};