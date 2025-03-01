const { GroupChat } =  require("../models");

//TODO: GetChatInformation

const CreateChat = async (req, res) => {
    const { owner_id, chat_name } = req.body;
  
    if(!chat_name || !owner_id) {
      return res.status(400).json({message: "missing fields"});
    }
  
    try {
      const chat = await GroupChat.create({
        name: chat_name,
        members: [
            {
                user: owner_id,
                role: "owner"
            }
        ]
      });
      res.status(200).json(chat);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

module.exports = {
    CreateChat,
}