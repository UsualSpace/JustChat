import axios from "axios";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import Groups from "../src/pages/groups";
import { GroupsContextProvider } from '../src/contexts/groups_context.jsx'
import { UseGroupsContext } from "../src/hooks/use_groups_context";
import { BrowserRouter } from 'react-router-dom'

jest.mock("axios");

// create, leave

describe("Groups page", () => {
    beforeEach(async () => {
        jest.clearAllMocks();
    });

    test("'JustChatSupport' renders on the page when create group returns status 201", async () => {
        axios.get.mockResolvedValue({
            status: 200,
            data: []
        });
        axios.post.mockResolvedValue({
            status: 201,
            data: {
                name: "JustChatSupport",
                _id: "randomstring"
            }
        });

        render(
            <GroupsContextProvider>
                <BrowserRouter>
                    <Groups/>
                </BrowserRouter>
            </GroupsContextProvider>
        );

        const popup_create_button = await screen.findByRole("button", { name: "Create a new group"});

        await userEvent.click(popup_create_button);

        const groupname_input = await screen.findByPlaceholderText("Group name");
        const create_button = await screen.findByRole("button", { name: "Create Group" });

        await userEvent.type(groupname_input, "JustChatSupport");

        await userEvent.click(create_button);

        await waitFor(async () => {
            expect(screen.getByText("JustChatSupport")).toBeInTheDocument();
        });
    });

    // test("'JustChatSupport' and 'GamingGlobal' render on the page when get groups succeeds", async () => {
    //     //only relevant data used
    //     axios.get.mockReturnValue({
    //         status: 200,
    //         data: []
    //     })
    //     .mockReturnValueOnce({
    //         status: 200,
    //         data: [
    //             {
    //                 name: "JustChatSupport",
    //                 _id: "randomstring"
    //             },
    //             {
    //                 name: "GamingGlobal",
    //                 _id: "anotherrandomstring"
    //             }
    //         ]
    //     });

    //     render(
    //         <GroupsContextProvider>
    //             <BrowserRouter>
    //                 <Groups/>
    //             </BrowserRouter>
    //         </GroupsContextProvider>
    //     );

    //     await waitFor(async () => {
    //         expect(screen.getByText("JustChatSupport")).toBeInTheDocument();
    //         expect(screen.getByText("GamingGlobal")).toBeInTheDocument();
    //     });
    // });
});