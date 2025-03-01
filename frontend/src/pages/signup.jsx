import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

function SignUp() {
    const [email, SetEmail] = useState("");
    const [password, SetPassword] = useState("");
    const [first_name, SetFirst] = useState("");
    const [last_name, SetLast] = useState("");
    const [confirm, SetConfirm] = useState("");
    const [error, SetError] = useState(null);

    const HandleSubmit = async (event) => {
        event.preventDefault();
        const account = {email, password, first_name, last_name};
        const response = await fetch("http://localhost:4000/api/auth/signup", {
            method: "POST",
            body: JSON.stringify(account),
            headers: {
                "Content-Type": "application/json"
            }
        });
        const json = await response.json();

        if(!response.ok) {
            SetError(json.error);
        }

        if(response.ok) {
            SetFirst("");
            SetLast("");
            SetEmail("");
            SetPassword("");
            SetConfirm("");
            SetError(null);
            console.log("Successfully signed up");
        }
    }

    return (
        <div className="main-container">
            {/* Left Side: Sign Up Form */}
            <div className="signup-container">
                <h2>Create an Account</h2>
                <form id="form" onSubmit={HandleSubmit}>
                    <div className="input-control">
                        <input 
                            id="firstname" 
                            placeholder="First Name" 
                            type="text"
                            onChange={(event) => SetFirst(event.target.value)}
                            value={first_name}
                            required 
                        />
                        <div className="error"></div>
                    </div>
                    <div className="input-control">
                        <input 
                            id="lastname" 
                            placeholder="Last Name" 
                            onChange={(event) => SetLast(event.target.value)}
                            value={last_name}
                            required 
                        />
                        <div className="error"></div>
                    </div>
                    <div className="input-control">
                        <input 
                            id="email" 
                            placeholder="Email" 
                            type="email" 
                            onChange={(event) => SetEmail(event.target.value)}
                            value={email}
                            required 
                        />
                        <div className="error"></div>
                    </div>
                    <div className="input-control">
                        <input 
                            id="password" 
                            placeholder="Password" 
                            type="password" 
                            onChange={(event) => SetPassword(event.target.value)}
                            value={password}
                            required 
                        />
                        <div className="error"></div>
                    </div>
                    <div className="input-control">
                        <input 
                            id="password2" 
                            placeholder="Confirm Password" 
                            type="password" 
                            onChange={(event) => SetConfirm(event.target.value)}
                            value={confirm}
                            required 
                        />
                        <div className="error"></div>
                    </div>
                    <button type="submit">Sign Up</button>
                    <p style={{ marginTop: "15px" }}>
                        Already have an account?   
                        <Link to="/signin" style={{ color: "#007bff", textDecoration: "none", fontWeight: "bold" }}>
                            Sign in
                        </Link>
                    </p>
                </form>
            </div>

            {/* Right Side: Info Section */}
            <div className="info-container">
                <h2>Welcome to JustChat</h2>
                <p>Connect with friends and chat seamlessly.</p>
                <p>Sign up today and start your conversations.</p>
            </div>
        </div>
    );
}

export default SignUp;
