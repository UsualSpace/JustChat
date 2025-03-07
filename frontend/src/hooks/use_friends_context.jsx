import { friends_context } from "../contexts/friends_context";
import { useContext } from "react";

export const UseFriendsContext = () => {
    const context = useContext(friends_context)

    if(!context) {
        throw Error('UseFriendsContext must be used inside an FriendshipContextPRovider')
    }



    return context
}