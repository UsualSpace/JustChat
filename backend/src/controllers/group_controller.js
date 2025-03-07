const { Group } =  require("../models");

const GetGroups = async (req, res) => {
  const { user_id } = req.body;
  Group.find({ "members.user": user_id}, 'name members')
    .then(groups => {
        // Map the results to return only the desired fields
        const group_data = groups.map(group => ({
            name: group.name,
            members: group.members
        }));
        
        res.status(200).json(group_data);
        //console.log(group_data); // Array of objects containing the selected fields
    })
    .catch(err => {
        console.error("Error fetching groups: ", err);
        res.status(500).json({error: "Error fetching groups"});
    });
}

const CreateGroup = async (req, res) => {
  const { user_id, group_name } = req.body;

  if(!group_name || !owner_id) {
    return res.status(400).json({message: "missing fields"});
  }

  try {
    const group = await Group.create({
      name: group_name,
      members: [
          {
              user: user_id,
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
  GetGroups,
  CreateGroup,
}