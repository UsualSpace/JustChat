import { createContext, useReducer } from "react"

export const groups_context = createContext();

export const GroupsReducer = (state, action) => {
    switch(action.type) {
        case "CREATE_GROUP":
            return {
                groups: [action.payload, ...state.groups]
            }
        case "DELETE_GROUP":
            return {
                groups: state.groups.filter(group => group.id !== action.payload)
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

    return (
       <groups_context.Provider value={{ ...state, dispatch }}>
            { children }
       </groups_context.Provider>
    );
};
