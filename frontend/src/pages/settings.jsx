import { useEffect, useState } from "react"
import { GetAuthHeader } from "../helpers";
import axios from "axios"

//components
import NavigationBar from "../components/navbar";

function Settings() {
    const [email, SetEmail] = useState("");
    const [first_name, SetFirst] = useState("");
    const [last_name, SetLast] = useState("");
    const [error, SetError] = useState(null);

    useEffect(() => {
        const GetAccountData = async () => {
            try {
                const response = await axios.get("http://localhost:4000/api/auth/account-info", GetAuthHeader());
                SetEmail(response.data.email);
                SetFirst(response.data.first_name);
                SetLast(response.data.last_name);
                SetError(null);
            } catch (error) {
                SetError(error.response?.data?.error || "failed to fetch account data");
            }
        };

        GetAccountData();
    }, []);

    const HandleSubmit = async (event) => {
        event.preventDefault();
        const account = {first_name, last_name};
        try {
            const response = await axios.patch("http://localhost:4000/api/auth/account-info", account, GetAuthHeader());
            SetFirst(response.data.first_name);
            SetLast(response.data.last_name);
            SetError(null);
            
        } catch (error) {
            SetError(error.response?.data?.error || "failed to update account info");
        }
    };

    return (
        <div className="page-container">
            <div className="navbar">
                <NavigationBar></NavigationBar>
            </div>
            <div className="page-background">
                <h1>Settings</h1>
                <h2>Account Details</h2>
                <p><strong>Email:</strong> {email}</p>
                <br></br>
                <form onSubmit={HandleSubmit}>
                    <label>First Name:</label>
                    <input
                        type="text"
                        value={first_name}
                        onChange={(event) => SetFirst(event.target.value)}
                        placeholder="First name"
                    />
                    <label>Last Name:</label>
                    <input
                        type="text"
                        value={last_name}
                        onChange={(event) => SetLast(event.target.value)}
                        placeholder="Last name"
                    />
                    <button type="submit">Update</button>
                </form>

                {/* Success/Error Message */}
                {error && <p>{error}</p>}
            </div>
        </div>
    );
}

export default Settings;