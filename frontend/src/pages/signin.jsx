import { useEffect, useState } from "react"

//Import below if we want to renavigate to sign up page.
//import { Link } from "react-router-dom"

function SignIn() {
    const [email, SetEmail] = useState("");
    const [password, SetPassword] = useState("");
    const [error, SetError] = useState(null);

    const HandleSubmit = async (event) => {
        event.preventDefault();
        const account = {email, password};
        const response = await fetch("http://localhost:4000/api/auth/signin", {
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
            SetEmail("");
            SetPassword("");
            SetError(null);
            console.log("Successfully signed in");
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
            </form>
        </div>
    );
}

export default SignIn;