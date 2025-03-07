const { Session } = require("./models");

const AuthenticateSession = async (req, res, next) => {
    const auth_header = req.headers["authorization"];
    
    if(auth_header) {
        const session_id = auth_header.split(" ")[1];
        try {
            const session = await Session.findById(session_id);
            if(!session) {
                return res.status(401).json({error: "invalid session id"})
            }
            
            //Store parsed session id for easy use in next route.
            req.body.user_id = session.user;
            req.body.session_id = session_id;
        } catch (error) {
            return res.status(500).json({error: error.message});
        }
    } else {
        return res.status(401).json({error: "invalid session id"})
    }

    next();
};

module.exports = {
    AuthenticateSession
};