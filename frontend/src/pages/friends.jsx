import { useEffect } from "react"
import { UseFriendsContext } from "../hooks/use_friends_context";

import axios from "axios"

//components
import PageBar from "../components/pagebar"

function Friends() {
    const { friends , dispatch } = UseFriendsContext();

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

            }
        };

        FetchFriends();
    }, []);

    const HandleFriendRequest = async (event) => {
        try {
            const session_id = localStorage.getItem("session_id");
            const response = await axios.post("http://localhost:4000/api/friends/", {
                headers: {
                    "authorization": `Bearer ${session_id}`
                }
            });

            dispatch({
                type: "SET_FRIENDS",
                payload: response.data
            });

        } catch ( error ) {

        }
    }

    return (
        <div className="page-background">
            <PageBar title="Friends">
                <button title="Add a friend" onClick={HandleFriendRequest}> + </button>
                {/*<button title="View Friend Requests"> ! </button> */}
            </PageBar>
            <div className="page-element-list">
                {friends && friends.map((friends) => (
                    <PageBar title={ friends.name }>
                        <button title={`Message ${friends.name}`}> o </button>
                        <button title={`Unfriend ${friends.name}`}> x </button>
                    </PageBar>
                ))}
            </div>
        </div>
    );
}

export default Friends;