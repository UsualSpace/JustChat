import { createContext, useReducer } from 'react'

export const friends_context = createContext();

export const FriendsReducer = (state, action) => {
    switch (action.type) {
        case "CREATE_FRIEND":
            return {
                friends: [action.payload, ...state.group]
            }
        case "DELETE_FRIEND":
            return {
                friends: state.friends.filter(friend => friend.id !== action.payload)
            }
        case "SET_FRIENDS":
            return {
                friends: action.payload
            }
        default:
            return state
    }
}

export const FriendshipContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(FriendsReducer, {
        friends: null
        });



    return (
        <friends_context.Provider value={{...state, dispatch}}>
            { children }
        </friends_context.Provider>
    );
};