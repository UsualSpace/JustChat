import axios from "axios";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import SignIn from "../src/pages/signin";
import { BrowserRouter } from 'react-router-dom'

jest.mock("axios");

describe("Signin page", () => {
    beforeEach(async () => {
        jest.clearAllMocks();
    });

    test("displays 'successfully signed in' signin returns status 202", async () => {
        axios.post.mockResolvedValue({
            status: 202,
            data: {
                session_id: "random"
            }
        });

        render(
            <BrowserRouter>
                <SignIn/>
            </BrowserRouter>
        );

        const email_input = screen.getByPlaceholderText("Email");
        const password_input = screen.getByPlaceholderText("Password");
        const signin_button = screen.getByRole("button", { name: "Sign in" });

        await userEvent.type(email_input, "johndoe@example.com");
        await userEvent.type(password_input, "helpme");


        userEvent.click(signin_button);

        await waitFor(() => {
            expect(screen.getByText("successfully signed in")).toBeInTheDocument();
        });
    }); 

    test("displays 'sign in failed' when signin fails", async () => {
        axios.post.mockRejectedValue(new Error("sign in failed"));

        render(
            <BrowserRouter>
                <SignIn/>
            </BrowserRouter>
        );

        const email_input = screen.getByPlaceholderText("Email");
        const password_input = screen.getByPlaceholderText("Password");
        const signin_button = screen.getByRole("button", { name: "Sign in" });

        await userEvent.type(email_input, "johndoe@example.com");
        await userEvent.type(password_input, "helpme");

        userEvent.click(signin_button);

        await waitFor(() => {
            expect(screen.getByText("sign in failed")).toBeInTheDocument();
        });
    });    
});