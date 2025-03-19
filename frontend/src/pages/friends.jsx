import { useEffect, useState } from "react";
import { UseFriendsContext } from "../hooks/use_friends_context";
import { GetAuthHeader } from "../helpers";
import PopUp from "../components/popup";
import { API_URL } from "../constants.js";

import axios from "axios"

//components
import PageBar from "../components/pagebar"
import NavigationBar from "../components/navbar";

function Friends() {
    const { friends, dispatch } = UseFriendsContext();
    const [email, SetEmail] = useState("");

    useEffect(() => {
        const FetchFriends = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/friends`, GetAuthHeader());

                dispatch({
                    type: "SET_FRIENDS",
                    payload: response.data
                });

            } catch ( error ) {
                console.log("Axios Error:", error.response ? error.response.data : error.message);
            }
        };

        FetchFriends();
    }, []);

    const HandleFriendRequest = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`${API_URL}/api/friends/${email}`, {}, GetAuthHeader());
            console.log("help");
            dispatch({
                type: "CREATE_FRIEND",
                payload: response.data
            });
        } catch ( error ) {
            console.log("Axios Error:", error);//error.response ? error.response.data : error.message);
        }
    }

    const HandleFriendRequestAccept = async (friend) => {
        try {
            const response = await axios.patch(`${API_URL}/api/friends/${friend.friendship_id}`, {}, GetAuthHeader());

            dispatch({
                type: "ACCEPT_FRIEND",
                payload: response.data
            });

        } catch ( error ) {
            console.log("Axios Error:", error.response ? error.response.data : error.message);
        }
    }

    const HandleUnfriend = async (friend) => {
        try {
            const response = await axios.delete(`${API_URL}/api/friends/${friend.friendship_id}`, GetAuthHeader());

            dispatch({
                type: "DELETE_FRIEND",
                payload: response.data
            });

        } catch ( error ) {
            console.log("Axios Error:", error.response ? error.response.data : error.message);
        }
    }

    return (
        <div className="page-container">
            <div className="navbar">
                <NavigationBar></NavigationBar>
            </div>
            <div className="page-background">
                <PageBar title="Friends">
                    <PopUp button_label="Add a friend">
                        <h1>Look for friends:</h1>
                        <form className="input-control" onSubmit={HandleFriendRequest}>
                            <input
                                placeholder="Email"
                                type="text"
                                onChange={(event) => SetEmail(event.target.value)}
                                value={email}
                                required
                            />
                            <button type="submit" className="btn-constructive">Send Friend Request</button>
                        </form>
                    </PopUp>
                </PageBar>
                <br/>
                <div className="page-element-list">
                    {friends && friends.map((friend) => (
                        <PageBar key={ friend.friendship_id } title={ `${friend.first_name} ${friend.last_name}` } >
                            <button title={`Message ${friend.first_name}`}> Message </button>
                            {
                                friend.friendship_status == "accepted" ?
                                <button className="btn-destructive" onClick={() => HandleUnfriend(friend)} title={`Unfriend ${friend.first_name}`}> Unfriend </button>
                                :
                                !friend.is_receiver ?
                                <p>Pending</p>
                                :
                                <button className="btn-constructive" onClick={() => HandleFriendRequestAccept(friend)} title={`Accept ${friend.first_name}'s friend request`}> Accept </button>
                            }   
                        </PageBar>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Friends;