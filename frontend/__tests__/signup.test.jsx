import axios from "axios";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import SignUp from "../src/pages/signup";

describe("Signup page", () => {
    beforeAll(async () => {
        
    });

    afterAll(async () => {
        
    });

    beforeEach(async () => {
        jest.clearAllMocks();
    });

    test("displays 'successfully signed up' signup returns status 201", async () => {
        axios.post.mockResolvedValue({status: 201});

        render(<SignUp/>);

        const first_name_input = screen.getByPlaceholderText("First Name");
        const last_name_input = screen.getByPlaceholderText("Last Name");
        const email_input = screen.getByPlaceholderText("Email");
        const password_input = screen.getByPlaceholderText("Password");
        const confirm_password_input = screen.getByPlaceholderText("Confirm Password");
        const signup_button = screen.getByRole("button", { name: "Sign Up" });

        await userEvent.type(first_name_input, "John");
        await userEvent.type(last_name_input, "Doe");
        await userEvent.type(email_input, "johndoe@example.com");
        await userEvent.type(password_input, "helpme");
        await userEvent.type(confirm_password_input, "helpme");

        userEvent.click(signup_button);

        await waitFor(() => {
            expect(screen.getByText("successfully signed up")).toBeInTheDocument();
        });
    });

    test("displays 'sign up failed' when signup fails", async () => {
        axios.post.mockResolvedValue(new Error("sign up failed"));

        render(<SignUp/>);

        const first_name_input = screen.getByPlaceholderText("First Name");
        const last_name_input = screen.getByPlaceholderText("Last Name");
        const email_input = screen.getByPlaceholderText("Email");
        const password_input = screen.getByPlaceholderText("Password");
        const confirm_password_input = screen.getByPlaceholderText("Confirm Password");
        const signup_button = screen.getByRole("button", { name: "Sign Up" });

        await userEvent.type(first_name_input, "John");
        await userEvent.type(last_name_input, "Doe");
        await userEvent.type(email_input, "johndoe@example.com");
        await userEvent.type(password_input, "helpme");
        await userEvent.type(confirm_password_input, "helpme");

        userEvent.click(signup_button);

        await waitFor(() => {
            expect(screen.getByText("sign up failed")).toBeInTheDocument();
        });
    });
});