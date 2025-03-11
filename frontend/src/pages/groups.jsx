import { useEffect, useState } from "react"
import { UseGroupsContext } from "../hooks/use_groups_context";
import { GetAuthHeader } from "../helpers";
import { useNavigate } from 'react-router-dom';

import axios from "axios"

//components
import PageBar from "../components/pagebar";
import PopUp from "../components/popup";
import NavigationBar from "../components/navbar";

//icons
import { MessageCircle, EllipsisVertical, LogOut } from "lucide-react";

function Groups() {
    const { groups, dispatch } = UseGroupsContext();
    const [group_name, SetGroupName] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const FetchGroups = async () => {
            try {
                const response = await axios.get("http://localhost:4000/api/groups", GetAuthHeader());

                dispatch({
                    type: "SET_GROUPS",
                    payload: response.data
                });

            } catch ( error ) {
                console.log("Axios Error:", error.response ? error.response.data : error.message);
            }
        };

        FetchGroups();
    }, []);

    const HandleCreateGroup = async () => {
        try {
            const response = await axios.post("http://localhost:4000/api/groups", {group_name}, GetAuthHeader());

            dispatch({
                type: "CREATE_GROUP",
                payload: response.data
            });

        } catch ( error ) {
            console.log("Axios Error:", error.response ? error.response.data : error.message);
        }
    };

    const GoToSettings = (group_id) => {
        navigate(`/groups/${group_id}/settings`);
    };

    const GoToMessaging = (group_id) => {
        navigate(`/groups/${group_id}/messaging`);
    };

    return (
        <div className="page-container">
            <div className="navbar">
                    <NavigationBar></NavigationBar>
            </div>
            <div className="page-background">
                <PageBar title="Groups">
                    <PopUp button_label="Create a new group">
                        <h1>Enter the name of your new group:</h1>
                        <form className="input-control" onSubmit={HandleCreateGroup}>
                            <input
                                placeholder="Group name"
                                type="text"
                                onChange={(event) => SetGroupName(event.target.value)}
                                value={group_name}
                                required
                            />
                            <button type="submit" className="btn-constructive">Create Group</button>
                        </form>
                    </PopUp>
                    <button title="View group invites"> ! </button>
                </PageBar>
                <br/>
                <div className="page-element-list">
                    {groups && groups.map((group) => (
                        <PageBar key={group._id} title={ group.name }>
                        <div className="icon-container">
                            <MessageCircle className="icon-message-circle" size={40} strokeWidth={3} title={`Message in ${group.name}`} onClick={() => GoToMessaging(group._id)} />
                        </div>
                        <div className="icon-container">
                            <LogOut className="icon-logout" size={40} strokeWidth={3} title={`Leave ${group.name}`} />
                        </div>
                        <div className="icon-container">
                            <EllipsisVertical className="icon-ellipsis-vertical" size={40} strokeWidth={3} title={`Settings ${group.name}`} onClick={() => GoToSettings(group._id)} />
                        </div>
                        </PageBar>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Groups;