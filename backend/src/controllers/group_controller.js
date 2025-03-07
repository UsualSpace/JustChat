const { Group } =  require("../models");

//TODO: GetChatInformation

const CreateGroup = async (req, res) => {
    const { owner_id, group_name } = req.body;
  
    if(!group_name || !owner_id) {
      return res.status(400).json({message: "missing fields"});
    }
  
    try {
      const group = await Group.create({
        name: group_name,
        members: [
            {
                user: owner_id,
                role: "owner"
            }
        ]
      });
      res.status(200).json(group);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

module.exports = {
    CreateGroup,
}