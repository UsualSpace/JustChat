import { Route, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

function SignIn() {
    const [email, SetEmail] = useState("");
    const [password, SetPassword] = useState("");
    const [error, SetError] = useState(null);
    const [success, SetSuccess] = useState(null);

    const navigate = useNavigate();

    const HandleSubmit = async (event) => {
        event.preventDefault();
        const credentials = {email, password};
        try {
            const response = await axios.post("http://localhost:4000/api/auth/signin", credentials);
            SetEmail("");
            SetPassword("");
            SetError(null);
            SetSuccess("successfully signed in");
            console.log("successfully signed in");
            
            //Store session id from server locally for protecting routes/future user authentication.
            sessionStorage.setItem("session_id", response.data.session_id);

            //Not sure how okay this is, but we need a way to differentiate between sender and recipient when displaying group messages,
            //especially when loading a chat and fetching the chat history.
            sessionStorage.setItem("email", email);

            //Force navigate to the main dashboard.
            navigate("/dashboard");
        } catch (error) {
            SetError("sign in failed");
        }
    }

    return (
        <div className="signin-container">
            <h2>JustChat</h2>
            <form id="signinForm" onSubmit={HandleSubmit}>
                <input 
                    type="email" 
                    placeholder="Email" 
                    required
                    onChange={(event) => SetEmail(event.target.value)}
                    value={email}
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    onChange={(event) => SetPassword(event.target.value)}
                    value={password}
                    required
                />
                <button type="submit">Sign in</button>
                {error && <p>{error}</p>}
                {success && <p>{success}</p>}
            </form>
            <p style={{ marginTop: "15px" }}>
                Don't have an account?   
                <Link to="/signup" style={{ color: "#007bff", textDecoration: "none", fontWeight: "bold" }}>
                    Sign up
                </Link>
            </p>
        </div>
    );
}

export default SignIn;