const config = require("../../../config/auth.config.js");
const db = require("../../db.js");
const User = db.user;
const Role = db.role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {

  const role = await Role.findOne({ where: { roleName: "Guest" } });

  await User.create({
    username: req.body.fullName,
    email: req.body.email,
    password: req.body.password,
  }).then((user) => {
    if (user) {
      user.addRole(role);

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400, // 24 hours
      });
      var authorities = [];
      // console.log(role.roleName);
      // for (let i = 0; i < user.roles.length; i++) {
      authorities.push("ROLE_" + role.roleName.toUpperCase());
      // }

      res.send({
        id: user._id,
        username: user.username,
        email: user.email,
        roles: authorities,
        token: token
      });
    }
  }).catch((err) => {
    if (err) {
      res.status(500).send({ message: err.message });
      return;
    }
  }
  );
}

exports.signin = async (req, res) => {
  await User.findOne({
    where: {
      email: req.body.email
    },
    include: Role
  }).then(function (user) {
    // retrieve user
    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    var passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({ message: "Invalid Password!" });
    }

    var token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 86400, // 24 hours
    });

    var authorities = [];

    for (let i = 0; i < user.roles.length; i++) {
      authorities.push("ROLE_" + user.roles[i].roleName.toUpperCase());
    }

    req.session.token = token;

    res.status(200).send({
      id: user._id,
      username: user.username,
      email: user.email,
      roles: authorities,
      token: token
    });

  }).catch(function (err) {
    // handle error;
    console.log(err)
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
  });
};

exports.signout = async (req, res) => {
  try {
    req.session = null;
    return res.status(200).send({ message: "You've been signed out!" });
  } catch (err) {
    this.next(err);
  }
};