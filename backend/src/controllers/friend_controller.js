const { Friendship, User } = require("../models");

const GetFriends = async (req, res) => {
    const { user_id } = req.body;
    try {
        const friendships = await Friendship.find({
            $or: [{ requester: user_id }, { receiver: user_id }], 
            status: "accepted"
        }).populate("requester receiver"); // Populate user details if needed
        if(!friendships) {
            return res.status(400).json({error: "Failed to grab friends"});
        }
        res.json(friendships);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

const FriendRequest = async (req, res) => {
    const { user_id, email } = req.body;

    
    try {
        const receiver_id = await User.findOne({email: email}).select("_id");

        if(!receiver_id) {
            return res.status(401).json({error: "could not find user with that email"});
        }

        const friendship = await Friendship.create({
            requester: user_id,
            receiver: receiver_id
        })

        res.status(200).json({message: "Request sent succesfully"});
    } catch (error) {
        res.status(500).json({ error: "Server error"});
    }
};

const FriendRequestAccept = async (req, res) => {
    const { friendship_id } = req.body;
    const updates = {
        status: "accepted"
    };

    try {
        const friendship = await Friendship.findByIdAndUpdate(friendship_id, updates, {
            new: true
        })

        res.status(200).json({message: "Accepted friend request"});
    } catch (error) {
        res.status(500).json({ error: "Server error"});
    }
}

module.exports = {
    GetFriends,
    FriendRequest,
    FriendRequestAccept,
};
