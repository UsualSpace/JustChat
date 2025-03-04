import { useEffect, useState } from "react"
import axios from "axios"

function GroupSettings() {
    

    useEffect(() => {
        const GetGroupData = async () => {
            try {
                const session_id = localStorage.getItem("session_id");
                const response = await axios.get("http://localhost:4000/api/auth/account-info", {
                    headers: {
                        "authorization": `Bearer ${session_id}`
                    }
                });
                
                SetError(null);
            } catch (error) {
                SetError(error.response?.data?.error || "failed to fetch account data");
            }
        };

        GetGroupData();
    }, []);

    const HandleSubmit = async (event) => {
        event.preventDefault();
        
        try {
            const session_id = localStorage.getItem("session_id");
            const response = await axios.patch("http://localhost:4000/api/auth/account-info", account, {
                headers: {
                    "authorization": `Bearer ${session_id}`
                }
            });
            
            SetError(null);
        } catch (error) {
            SetError(error.response?.data?.error || "failed to update account info");
        }
    };

    return (
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
    );
}

export default GroupSettings;