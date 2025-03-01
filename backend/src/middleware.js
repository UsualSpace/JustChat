const { Session } = require("./models");

const AuthenticateSession = async (req, res) => {
    const { session_id } = req.body;
    
    if(!session_id) {
        return res.status(400).json({message: "missing fields"});
    }

    try {
        const session = await Session.findById(session_id);
        if(!session) {
            return res.status(401).json({message: "invalid session id"})
        }
    } catch (error) {
        return res.status(500).json({error: error.message});
    }

    next();
};

module.exports = {
    AuthenticateSession
};