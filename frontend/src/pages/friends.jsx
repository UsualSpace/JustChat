import { useEffect, useState } from "react";
import { UseFriendsContext } from "../hooks/use_friends_context";
import { GetAuthHeader } from "../helpers";
import PopUp from "../components/popup";

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
                const response = await axios.get("http://localhost:4000/api/friends", GetAuthHeader());

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
            const response = await axios.post(`http://localhost:4000/api/friends/${email}`, {}, GetAuthHeader());

            dispatch({
                type: "CREATE_FRIEND",
                payload: response.data
            });

        } catch ( error ) {
            console.log("Axios Error:", error.response ? error.response.data : error.message);
        }
    }

    const HandleUnfriend = async (friend) => {
        try {
            const response = await axios.delete(`http://localhost:4000/api/friends/${friend.friendship_id}`, GetAuthHeader());

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
                    {/*<button title="View Friend Requests"> ! </button> */}
                </PageBar>
                <div className="page-element-list">
                    {friends && friends.map((friend) => (
                        <PageBar key={ friend.friendship_id } title={ `${friend.first_name} ${friend.last_name}` } >
                            <button title={`Message ${friend.first_name}`}> Message </button>
                            <button className="btn-destructive" onClick={() => HandleUnfriend(friend)} title={`Unfriend ${friend.first_name}`}> Unfriend </button>
                        </PageBar>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Friends;