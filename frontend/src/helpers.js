export const GetAuthHeader = () => {
    const session_id = sessionStorage.getItem("session_id");
    
    const auth_header = {
        headers: {
            "Authorization": `Bearer ${session_id}`
        }
    };

    return auth_header;
};