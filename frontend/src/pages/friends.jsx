import { useEffect, useState } from "react"
import { UseFriendsContext } from "../hooks/use_friends_context";
import PopUp from "../components/popup";

import axios from "axios"

//components
import PageBar from "../components/pagebar"

function Friends() {
    const { friends, dispatch } = UseFriendsContext();
    const [email, SetEmail] = useState("");

    useEffect(() => {
        const FetchFriends = async () => {
            try {
                const session_id = localStorage.getItem("session_id");
                const response = await axios.get("http://localhost:4000/api/friends", {
                    headers: {
                        "authorization": `Bearer ${session_id}`
                    }
                });

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
            const session_id = localStorage.getItem("session_id");
            const response = await axios.post(`http://localhost:4000/api/friends/${email}`, {}, {
                headers: {
                    "authorization": `Bearer ${session_id}`
                }
            });

            dispatch({
                type: "CREATE_FRIEND",
                payload: response.data
            });

        } catch ( error ) {
            console.log("Axios Error:", error.response ? error.response.data : error.message);
        }
    }

    return (
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
                    <PageBar key={ friend._id } title={ `${friend.first_name} ${friend.last_name}` } >
                        <button title={`Message ${friend.first_name}`}> o </button>
                        <button title={`Unfriend ${friend.first_name}`}> x </button>
                    </PageBar>
                ))}
            </div>
        </div>
    );
}

export default Friends;