import { useEffect, useState } from "react"
import { UseFriendsContext } from "../hooks/use_friends_context";
import PopUp from "../components/popup";

import axios from "axios"

//components
import PageBar from "../components/pagebar"

function Friends() {
    const { friends , dispatch } = UseFriendsContext();
    const [email, SetEmail] = useState("");
    const [friendNames, setFriendNames] = useState({});

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
            console.log(error);
        }
    }

    // const Test = async (friend) => {
    //     let name = "poop";
    //     console.log(friend);

    //     try {
    //         const session_id = localStorage.getItem("session_id");
    //         const account = await axios.get("http://localhost:4000/api/auth/account-info", {
    //             headers: {
    //                 "authorization": `Bearer ${session_id}`
    //             }
    //         });
    //         if (friend.requester.first_name === account.data.first_name) {
    //             name = friend.receiver.first_name;
    //         } else {
    //             name = friend.requester.first_name;
    //         }
    //         return name;
    //     } catch (error) {

    //     };
    //     return name;
    // }
    useEffect(() => {
        const fetchFriendNames = async () => {
            const session_id = localStorage.getItem("session_id");
            const account = await axios.get("http://localhost:4000/api/auth/account-info", {
                headers: {
                    "authorization": `Bearer ${session_id}`
                }
            });

            const names = {};

            friends.forEach(friend => {
                let name = "poop";
                if (friend.requester.first_name === account.data.first_name) {
                    name = friend.receiver.first_name;
                } else {
                    name = friend.requester.first_name;
                }
                names[friend.id] = name;
            });

            setFriendNames(names);
        };

        // if (friends.length) {
        //     fetchFriendNames();
        // }
    }, [friends]); // This effect will run when `friends` changes


    return (
        <div className="page-background">
            <PageBar title="Friends">
                <PopUp button_label="Add a friend">
                    <h1>Look for friends:</h1>
                    <form className="input-control" onSubmit={() => HandleFriendRequest}>
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
                    <PageBar key={ "gfdhsjghj" } title={ friendNames[friend.id] } >
                        <button title={`Message ${friendNames[friend.id]}`}> o </button>
                        <button title={`Unfriend ${friendNames[friend.id]}`}> x </button>
                    </PageBar>
                ))}
            </div>
        </div>
    );
}

export default Friends;