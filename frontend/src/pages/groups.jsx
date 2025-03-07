import { useEffect } from "react"
import { UseGroupsContext } from "../hooks/use_groups_context";

import axios from "axios"

//components
import PageBar from "../components/pagebar"

function Groups() {
    const { groups, dispatch } = UseGroupsContext();

    useEffect(() => {
        const FetchGroups = async () => {
            try {
                const session_id = localStorage.getItem("session_id");
                const response = await axios.get("http://localhost:4000/api/groups", {
                    headers: {
                        "authorization": `Bearer ${session_id}`
                    }
                });

                dispatch({
                    type: "SET_GROUPS",
                    payload: response.data
                });

            } catch ( error ) {

            }
        };

        FetchGroups();
    }, []);

    return (
        <div className="page-background">
            <PageBar title="Groups">
                <button title="Create a new group"> + </button>
                <button title="View group invites"> ! </button>
            </PageBar>
            <div className="page-element-list">
                {groups && groups.map((group) => (
                    <PageBar title={ group.name }>
                        <button title="Open group chat"> o </button>
                        <button title="Leave group chat"> x </button>
                    </PageBar>
                ))}
            </div>
        </div>
    );
}

export default Groups;