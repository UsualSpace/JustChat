import axios from "axios";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import Settings from "../src/pages/settings";
//import { BrowserRouter } from 'react-router-dom'
//import { MemoryRouter } from "react-router-dom";

jest.mock("axios");


describe("Settings page", () => {
    beforeAll(async () => {
        
    });

    afterAll(async () => {
        
    });

    beforeEach(async () => {
        jest.clearAllMocks();
    });

    test("displays 'successfully updated account information' settings returns status 201", async () => {
        axios.patch.mockResolvedValue({status: 201});

        render(<Settings/>);

        const first_name_input = screen.getByPlaceholderText("First Name");
        const last_name_input = screen.getByPlaceholderText("Last Name");
        const update_button = screen.getByRole("button", { name: "Update" });

        await userEvent.type(first_name_input, "John");
        await userEvent.type(last_name_input, "Doe");

        userEvent.click(update_button);

        await waitFor(() => {
            expect(screen.getByText("successfully signed up")).toBeInTheDocument();
        });
    });

    test("displays 'successfully updated account information' settings returns status 201", async () => {
        axios.patch.mockRejectedValue(new Error("failed to update account info"));

        render(<Settings/>);

        const first_name_input = screen.getByPlaceholderText("First Name");
        const last_name_input = screen.getByPlaceholderText("Last Name");
        const update_button = screen.getByRole("button", { name: "Update" });

        await userEvent.type(first_name_input, "John");
        await userEvent.type(last_name_input, "Doe");

        userEvent.click(update_button);

        await waitFor(() => {
            expect(screen.getByText("failed to update account info")).toBeInTheDocument();
        });
    });


    // test("displays 'failed to fetch account data' when fetching failed", async () => {
    //     axios.post.mockResolvedValue({status: 201});

    //     render(<SignUp/>);

    //     const first_name_input = screen.getByPlaceholderText("First Name");
    //     const last_name_input = screen.getByPlaceholderText("Last Name");
    //     const signup_button = screen.getByRole("button", { name: "Update" });

    //     await userEvent.type(first_name_input, "John");
    //     await userEvent.type(last_name_input, "Doe");

    //     userEvent.click(signup_button);

    //     await waitFor(() => {
    //         expect(screen.getByText("successfully signed up")).toBeInTheDocument();
    //     });
    // });

});