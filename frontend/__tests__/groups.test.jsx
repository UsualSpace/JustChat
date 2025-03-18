import axios from "axios";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import Groups from "../src/pages/groups";
import { GroupsContextProvider } from './contexts/groups_context.jsx'
import { UseGroupsContext } from "../src/hooks/use_groups_context";
//import { BrowserRouter } from 'react-router-dom'
//import { MemoryRouter } from "react-router-dom";

jest.mock("axios");

// create, leave

describe("Groups page", () => {
    beforeAll(async () => {
        
    });

    afterAll(async () => {
        
    });

    beforeEach(async () => {
        jest.clearAllMocks();
    });

    test("displays 'succesfully created group' groups returns status 201", async () => {
        axios.post.mockResolvedValue({
            status: 201,
            group: {
                name: "JustChatSupport",
                _id: "randomstring"
            }
        });

        render(<Groups/>);

        const popup_create_button = screen.getByRole("button", { name: "Create a new group"});
        userEvent.click(popup_create_button);
        const groupname_input = screen.getByPlaceholderText("Group name");
        const create_button = screen.getByRole("button", { name: "Create Group" });

        await userEvent.type(groupname_input, "JustChatSupport");

        userEvent.click(create_button);

        await waitFor(() => {
            expect(screen.getByText("succesfully created group")).toBeInTheDocument();
            expect(screen.getByText("JustChatSupport")).toBeInTheDocument();
        });
    });

    //TODO: FINISH THIS CODE
    test("displays 'succesfully left group' leave group returns status 200", async () => {
        axios.post.mockResolvedValue({
            status: 201,
            group: {
                name: "JustChatSupport",
                _id: "randomstring"
            }
        });

        render(<GroupsContextProvider><Groups/></GroupsContextProvider>);

        const create_button = screen.getByRole("button", { name: "Leave Group" });

        await userEvent.type(groupname_input, "JustChatSupport");

        userEvent.click(create_button);

        await waitFor(() => {
            expect(screen.getByText("succesfully left group")).toBeInTheDocument();
        });
    });

    
 
});