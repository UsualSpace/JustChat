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
import { MessageCircle, EllipsisVertical, LogOut, Check, X } from "lucide-react";

function Groups() {
    const { groups, dispatch } = UseGroupsContext();
    const [group_name, SetGroupName] = useState("");
    const [group_invites, SetGroupInvites] = useState([]);
    const [success, SetSuccess] = useState(null);
    const [error, SetError] = useState(null);
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

        const FetchInvites = async () => {
            try {
                const response = await axios.get("http://localhost:4000/api/groups/invites", GetAuthHeader());

                SetGroupInvites(response.data);

            } catch ( error ) {
                console.log("Axios Error:", error.response ? error.response.data : error.message);
            }
        };

        FetchGroups();
        FetchInvites();
    }, []);

    const HandleCreateGroup = async () => {
        try {
            const response = await axios.post("http://localhost:4000/api/groups", {group_name}, GetAuthHeader());
            SetError(null);
            SetSuccess("succesfully created group");
            dispatch({
                type: "CREATE_GROUP",
                payload: response.data
            });

        } catch ( error ) {
            SetError("failed to create group");
        }
    };

    const HandleDeclineInvite = async (invite_id) => {
        console.log("HELLO");
        try {        
            console.log("HELLO");
            const response = await axios.delete(`http://localhost:4000/api/groups/remove-invite/${invite_id}`, GetAuthHeader());
            console.log(response);
            const result = group_invites.filter(invite => invite._id !== invite_id);
            
            SetGroupInvites(previous_group_invites => previous_group_invites.filter(invite => invite._id !== invite_id));

        } catch ( error ) {
            console.log("Axios Error:", error.response ? error.response.data : error.message);
        }
    };

    const HandleAcceptInvite = async (invite) => {
        try {
            const user_added_response = await axios.patch(`http://localhost:4000/api/groups/${invite.group._id}/add-member`, {}, GetAuthHeader());

            const groups_response = await axios.get("http://localhost:4000/api/groups", GetAuthHeader());
            dispatch({
                type: "SET_GROUPS",
                payload: groups_response.data
            });

            const response = await axios.delete(`http://localhost:4000/api/groups/remove-invite/${invite._id}`, GetAuthHeader());
            const result = group_invites.filter(invite => invite._id !== invite._id);

            SetGroupInvites(result);

        } catch ( error ) {
            console.log("Axios Error:", error.response ? error.response.data : error.message);
        }
    };

    const HandleLeaveGroup = async (group_id) => {
        try {
            //rushed, needed user_id and didnt store locally.
            SetError(null);
            SetSuccess("succesfully left group");
            const response = await axios.patch(`http://localhost:4000/api/groups/${group_id}/remove-member`, {}, GetAuthHeader());
            dispatch({
                type: "DELETE_GROUP",
                payload: {group_id}
            });
        } catch (error) {
            SetError("failed to leave group");
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
                            {error && <p>{error}</p>}
                            {success && <p>{success}</p>}
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
                                <LogOut className="icon-logout" size={40} strokeWidth={3} title={`Leave ${group.name}`} onClick={() => HandleLeaveGroup(group._id)}/>
                            </div>
                            <div className="icon-container">
                                <EllipsisVertical className="icon-ellipsis-vertical" size={40} strokeWidth={3} title={`More about ${group.name}`} onClick={() => GoToSettings(group._id)} />
                            </div>
                        </PageBar>
                    ))}
                </div>
                <br/>
                <h2>Group Invites:</h2>
                <div className="page-element-list">
                    {group_invites && group_invites.map((invite) => (
                        <PageBar key={invite._id} title={ invite.group.name }>
                            <div className="icon-container">
                                <Check size={40} strokeWidth={3} onClick={() => HandleAcceptInvite(invite)}/>
                            </div>
                            <div className="icon-container">
                                <X size={40} strokeWidth={3} onClick={() => HandleDeclineInvite(invite._id)}/>
                            </div>
                        </PageBar>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Groups;