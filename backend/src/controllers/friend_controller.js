const { Friendship, User } = require("../models");

//helper function
const GetFriend = (friendship, user) => {
    let friend;
    if (friendship.requester.email === user.email) {
        friend = friendship.receiver;
    } else {
        friend = friend.requester;
    }
    return friend;
};
//

const GetFriends = async (req, res) => {
    const { user } = req.body;
    try {
        const friendships = await Friendship.find({
            $or: [{ requester: user._id }, { receiver: user._id }], 
            status: "accepted"
        }).populate("requester receiver");
        if(!friendships) {
            return res.status(400).json({error: "failed to grab friends"});
        }

        const friends = friendships.map(friendship => (GetFriend(friendship, user)));

        res.json(friends);
    } catch (error) {
        res.status(500).json({ error: "Server error get friends" });
    }
};

const FriendRequest = async (req, res) => {
    const user = req.body.user;
    const { email } = req.params;
    console.log("friend request called");
    
    try {
        const receiver_id = await User.findOne({email: email}).select("_id");

        if(!receiver_id) {
            return res.status(401).json({error: "could not find user with that email"});
        }

        const friendship = await Friendship.create({
            requester: user._id,
            receiver: receiver_id._id
        })

        console.log("friendship awaited");

        if(!friendship) {
            return res.status(500).json({error: "failed to create friendship document"});
        }

        console.log("friend success");
        res.status(200);//.json(GetFriend(friendship, user));
    } catch (error) {
        res.status(500).json({ error: "Server error friend request"});
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
        res.status(500).json({ error: "Server error friend reques accept"});
    }
}

module.exports = {
    GetFriends,
    FriendRequest,
    FriendRequestAccept,
};
