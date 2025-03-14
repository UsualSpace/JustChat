const { Friendship, User } = require("../models");

//helper function
const GetFriend = (friendship, user) => {
    console.log(user.email);
    console.log(friendship.requester.email);
    console.log(friendship.receiver.email);
    let friend;
    if (friendship.requester.email === user.email) {
        friend = {
            first_name: friendship.receiver.first_name, 
            last_name: friendship.receiver.last_name, 
            email: friendship.receiver.email,
            is_receiver: false
        };
        console.log(`Sent back receiver data ${friend.first_name}`);
    } else {
        friend = {
            first_name: friendship.requester.first_name, 
            last_name: friendship.requester.last_name, 
            email: friendship.requester.email,
            is_receiver: true
        };
        console.log(`Sent back requester data ${friend.first_name}`);
    }
    friend.friendship_id = friendship._id;
    friend.friendship_status = friendship.status;
    return friend;
};
//

const GetFriends = async (req, res) => {
    const { user } = req.body;
    try {
        const friendships = await Friendship.find({
            $or: [{ requester: user._id }, { receiver: user._id }]
        }).populate("requester receiver");
        if(!friendships) {
            return res.status(400).json({error: "failed to grab friends"});
        }

        console.log(friendships);

        const friends = friendships.map(friendship => (GetFriend(friendship, user)));

        res.status(200).json(friends);
    } catch (error) {
        res.status(500).json({ error: `Server error get friends: ${error}` });
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
        res.status(200).json(GetFriend(friendship, user));
    } catch (error) {
        res.status(500).json({ error: "Server error friend request"});
    }
};

const FriendRequestAccept = async (req, res) => {
    const { friendship_id } = req.params;
    const updates = {
        status: "accepted"
    };

    try {
        const friendship = await Friendship.findByIdAndUpdate(friendship_id, updates, {
            new: true
        })

        res.status(200).json({message: "Accepted friend request"});
    } catch (error) {
        res.status(500).json({ error: "Server error friend request accept"});
    }
};

const Unfriend = async (req, res) => {
    const { friendship_id } = req.params;
    try {
        const friendship = await Friendship.findByIdAndDelete(friendship_id);
        res.status(200).json({
            friendship_id: friendship._id
        });
    } catch (error) {
        res.status(500).json({ error: "Server error unfriend"});
    }
}

module.exports = {
    GetFriends,
    FriendRequest,
    FriendRequestAccept,
    Unfriend
};
