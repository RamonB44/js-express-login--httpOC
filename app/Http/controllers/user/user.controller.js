const sequelize = require('sequelize');
const db = require("../../../db.js");
const Op = sequelize.Op;
const User = db.user;

async function getUsers(req, res) {
    User.findAll({
        where: {
            id: {
                [Op.gt]: 1
            },
        },
        attributes: { exclude: ['password', 'token', 'updatedAt', 'deletedAt'] }
    })
        .then(users => {
            return res.status(200).send(users);// Log the retrieved data
            // Handle the data as needed
        })
        .catch(error => {
            console.error(error); // Log any errors
            // Handle the error as needed
            return res.status(500).send(error);
        });
}

async function list(req, res) {
    User.findAll({
        attributes: { exclude: ['password', 'token', 'updatedAt', 'deletedAt'] }
    })
        .then(users => {
            return res.status(200).send(users);// Log the retrieved data
            // Handle the data as needed
        })
        .catch(error => {
            console.error(error); // Log any errors
            // Handle the error as needed
            return res.status(500).send(error);
        });
}

async function create(req, res) {
    const user = User.build({
        username: req.body.fullName,
        email: req.body.email,
        password: req.body.password,
    });
    await user.save();
    user.save().then(() => {
        res.status(200).send({ message: 'Record created successfully!' });
    });

}

async function edit(req, res) {
    User.update({ username: req.body.username, email: req.body.email, password: req.body.password }, { where: { id: req.body.id } })
        .then(() => {
            res.status(200).send({ message: 'Record updated successfully!' });
        });
}

async function del(req, res) {
    const user = await User.findByPk(req.body.id);
    await user.destroy();
    user.destroy().then(() => {
        res.status(200).send({ message: 'Record soft deleted successfully!' });
    });
}

async function restore(req, res) {
    const user = await User.findByPk(req.body.id);
    await user.restore();
    user.restore().then(() => {
        res.status(200).send({ message: 'Record restored successfully!' });
    });
}

module.exports = {
    getUsers,
    list,
    create,
    edit,
    del
}