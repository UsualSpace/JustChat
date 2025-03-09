import { createContext, useReducer, useEffect } from "react"
import { GetAuthHeader } from "../helpers";
import axios from "axios";

export const groups_context = createContext();

export const GroupsReducer = (state, action) => {
    switch(action.type) {
        case "CREATE_GROUP":
            return {
                groups: [action.payload, ...state.groups]
            }
        case "DELETE_GROUP":
            return {
                groups: state.groups.filter(group => group._id !== action.payload.group_id)
            }
        case "SET_GROUPS":
            return {
                groups: action.payload
            }
        default:
            return state;
    }
};

export const GroupsContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(GroupsReducer, {
        groups: null
    });

    // useEffect(() => {
    //     const FetchGroups = async () => {
    //         try {
    //             const response = await axios.get("http://localhost:4000/api/groups", GetAuthHeader());

    //             dispatch({
    //                 type: "SET_GROUPS",
    //                 payload: response.data
    //             });

    //         } catch ( error ) {
    //             console.log("Axios Error:", error.response ? error.response.data : error.message);
    //         }
    //     };

    //     FetchGroups();
    // }, []);

    return (
       <groups_context.Provider value={{ ...state, dispatch }}>
            { children }
       </groups_context.Provider>
    );
};
