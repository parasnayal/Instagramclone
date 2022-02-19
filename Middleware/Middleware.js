const jwt = require("jsonwebtoken");
// const JWT_SECRET = "paras123@#$nayal%^&";
const {JWT_SECRET} = require("../config/keys");
const user = require("../Models/User");
const middleware = (req, res, next) => {
    const Authorization = req.header("token");
    if (!Authorization) {
        return res.status(401).json({ error: "You must be login" });
    }
    jwt.verify(Authorization, JWT_SECRET, (error, payload) => {
        if (error) {
            return res.status(401).json({ error });
        }
        const { id } = payload.user;
        user.findById(id)
            .then(UserData => {
                req.user = UserData;
                next();
            })
            .catch(error => console.log(error));
    })
}
module.exports = middleware;