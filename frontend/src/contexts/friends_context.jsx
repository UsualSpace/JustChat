import { createContext, useReducer } from 'react'

export const friends_context = createContext();

export const FriendsReducer = (state, action) => {
    switch (action.type) {
        case "CREATE_FRIEND":
            return {
                friends: [action.payload, ...state.friends]
            }
        case "DELETE_FRIEND":
            return {
                friends: state.friends.filter(friend => friend.friendship_id !== action.payload.friendship_id)
            }
        case "SET_FRIENDS":
            return {
                friends: action.payload
            }
        case "ACCEPT_FRIEND":
            return {
                friends: state.friends.map(friend => {
                    friend.friendship_status = "accepted";
                    return friend;
                })
            }
        default:
            return state
    }
}

export const FriendshipsContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(FriendsReducer, {
        friends: null
    });

    return (
        <friends_context.Provider value={{...state, dispatch}}>
            { children }
        </friends_context.Provider>
    );
};