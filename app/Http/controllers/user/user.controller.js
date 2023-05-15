const db = require("../../../db.js");
const User = db.user;

async function getUsers(req, res) {
    const userData = User.findAll()
        .then(users => {
            return users; // Log the retrieved data
            // Handle the data as needed
        })
        .catch(error => {
            console.error(error); // Log any errors
            // Handle the error as needed
            return res.status(500).send(error);
        });
    return res.status(200).send(userData);
}

module.exports = (req, res) => {
    getUsers(req, res)
}