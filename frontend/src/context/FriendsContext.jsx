import { createContext } from 'react'

export const FriendshipContext = createContext()

export const FriendshipContextProvider = ({ children }) => {

    return (
        <FriendshipContext.Provider value={{friends: []}}>
            { children }
        </FriendshipContext.Provider>
    )
}