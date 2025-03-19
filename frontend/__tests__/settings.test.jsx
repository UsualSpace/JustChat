import axios from "axios";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import Settings from "../src/pages/settings";
import { BrowserRouter } from 'react-router-dom'

jest.mock("axios");


describe("Settings page", () => {
    beforeEach(async () => {
        jest.clearAllMocks();
    });

    test("displays 'successfully updated account information' when settings returns status 200", async () => {
        axios.patch.mockResolvedValue({status: 200});

        render(
            <BrowserRouter>
                <Settings/>
            </BrowserRouter>
        );

        const first_name_input = screen.getByPlaceholderText("First Name");
        const last_name_input = screen.getByPlaceholderText("Last Name");
        const update_button = screen.getByRole("button", { name: "Update" });

        await userEvent.type(first_name_input, "John");
        await userEvent.type(last_name_input, "Doe");

        userEvent.click(update_button);

        await waitFor(() => {
            expect(screen.getByText("successfully updated account information")).toBeInTheDocument();
        });
    });

    test("displays 'failed to update account information' when update settings fails", async () => {
        axios.patch.mockRejectedValue(new Error("failed to update account information"));

        render(
            <BrowserRouter>
                <Settings/>
            </BrowserRouter>
        );

        const first_name_input = screen.getByPlaceholderText("First Name");
        const last_name_input = screen.getByPlaceholderText("Last Name");
        const update_button = screen.getByRole("button", { name: "Update" });

        await userEvent.type(first_name_input, "John");
        await userEvent.type(last_name_input, "Doe");

        userEvent.click(update_button);

        await waitFor(() => {
            expect(screen.getByText("failed to update account information")).toBeInTheDocument();
        });
    });
});