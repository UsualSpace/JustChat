import { useEffect, useState } from "react";
import { UseGroupsContext } from "../hooks/use_groups_context";
import { GetAuthHeader } from "../helpers";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

//components
import PageBar from "../components/pagebar";
import PopUp from "../components/popup";
import NavigationBar from "../components/navbar";

//icons
import { MessageCircle, UserRoundPlus } from "lucide-react";

function GroupSettings() {
    const { groups, dispatch } = UseGroupsContext();
    const { group_id } = useParams();
    const [email, SetEmail] = useState("");
    const [success, SetSuccess] = useState(null);
    const [error, SetError] = useState(null);
    const navigate = useNavigate();

    const group = groups.find(group => group._id === group_id);

    if(!group) {
        console.log("group data not found");
    }

    // useEffect(() => {
    //     const GetGroupData = () => {
            
    //     };

    //     GetGroupData();
    // }, []);

    const HandleDeleteGroup = async () => {
        try {
            const response = await axios.delete(`http://localhost:4000/api/groups/${group._id}`, GetAuthHeader());
            dispatch({
                type: "DELETE_GROUP",
                payload: response.data
            });
            navigate("/groups");
        } catch ( error ) {
            console.log("Axios Error:", error.response ? error.response.data : error.message);
        }
    };

    const HandleSendGroupInvite = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`http://localhost:4000/api/groups/${group._id}/invite/${email}`, {}, GetAuthHeader());
            
        } catch ( error ) {
            console.log("Axios Error:", error);//error.response ? error.response.data : error.message);
        }
    };

    return (
        <div className="page-container">
            <div className="navbar">
                <NavigationBar></NavigationBar>
            </div>
            <div className="page-background">
                <PageBar title={`${group.name} Settings`}>
                    <div className="icon-container">
                        <MessageCircle className="icon-message-circle" size={40} strokeWidth={3} title={`Message in ${group.name}`} onClick={() => navigate(`/groups/${group._id}/messaging`)} />
                    </div>
                    {/*<div className="icon-container">
                        <UserRoundPlus size={40} strokeWidth={3} title={`Message in ${group.name}`} onClick={() => navigate(`/groups/${group._id}/messaging`)} />
                    </div>*/}
                    <PopUp button_label="Send a group invite">
                        <form onSubmit={HandleSendGroupInvite}>
                            <input 
                                type="text" 
                                placeholder="Email"
                                value={email}
                                onChange={(event) => SetEmail(event.target.value)}
                                required
                            />
                            <button type="submit" className="btn-constructive">Send Group Invite</button>
                        </form>
                    </PopUp>
                </PageBar>
                <h1>Members:</h1>
                <div className="page-element-list">
                    {group && group.members.map((member) => (
                        <PageBar key={member.user._id} title={ "[" + member.role + "] " + member.user.first_name + " " + member.user.last_name + " (" + member.user.email + ")"}>
                        </PageBar>
                    ))}
                </div>

                <button className="btn-destructive" onClick={HandleDeleteGroup}>Delete Group</button>

                {/* Success/Error Message */}
                {/*error && <p>{error}</p>*/}
            </div>
        </div>
    );
}

export default GroupSettings;