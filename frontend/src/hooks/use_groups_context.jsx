import { groups_context } from "../contexts/groups_context";
import { useContext } from "react";

export const UseGroupsContext = () => {
    const context = useContext(groups_context);

    if(!context) {
        throw Error("UseGroupsContext must be used inside a GroupsContextProvider");
    }

    return context;
};