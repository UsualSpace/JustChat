const User = require('./models')

const RegisterNewUser = async (req, res) => {
    //TODO: add confirm password field
    const {email, password, first_name, last_name} = req.body
    const id = 2
    try {
        const user = await User.create({
            email: email,
            password: password,
            first_name: first_name,
            last_name: last_name,
            uid: 2
        })
        res.status(200).json(user)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

module.exports = {
    RegisterNewUser: RegisterNewUser
}