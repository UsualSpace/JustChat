import { useEffect, useState } from "react";
import { UseGroupsContext } from "../hooks/use_groups_context";
import { GetAuthHeader } from "../helpers";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

//components
import PageBar from "../components/pagebar";
import PopUp from "../components/popup";
import NavigationBar from "../components/navbar";

function GroupSettings() {
    const { groups, dispatch } = UseGroupsContext();
    const { group_id } = useParams();
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

    return (
        <div className="page-container">
            <div className="navbar">
                <NavigationBar></NavigationBar>
            </div>
            <div className="page-background">
                <PageBar title={`${group.name} Settings`}></PageBar>
                {/* Potentially allow group name updates */}

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