export const GetAuthHeader = () => {
    const session_id = sessionStorage.getItem("session_id");
    
    const auth_header = {
        headers: {
            "authorization": `Bearer ${session_id}`
        }
    };

    return auth_header;
};