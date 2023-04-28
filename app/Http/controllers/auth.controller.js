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

      var token = jwt.sign({ id: user.id }, config.ACCESS_TOKEN_PRIVATE_KEY, {
        expiresIn: "1m", // 1 minuto
      });
  
      var refresh_token = jwt.sign({ id: user.id }, config.REFRESH_TOKEN_PRIVATE_KEY, {
        expiresIn: "30d", // 30 dias
      });

      var authorities = [];
      // console.log(role.roleName);
      // for (let i = 0; i < user.roles.length; i++) {
      authorities.push("ROLE_" + role.roleName.toUpperCase());
      // }
      user.token = refresh_token;
      user.save();
      
      res.send({
        id: user._id,
        username: user.username,
        email: user.email,
        roles: authorities,
        token: {
            access_token: token, // access token 1 min expiration
            refresh_token: refresh_token // refresh token 1h expiration
        }
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

    var token = jwt.sign({ id: user.id }, config.ACCESS_TOKEN_PRIVATE_KEY, {
      expiresIn: "1m", // 1 minuto
    });

    var refresh_token = jwt.sign({ id: user.id }, config.REFRESH_TOKEN_PRIVATE_KEY, {
      expiresIn: "30d", // 30 dias
    });

    var authorities = [];
    
    for (let i = 0; i < user.roles.length; i++) {
      authorities.push("ROLE_" + user.roles[i].roleName.toUpperCase());
    }
    // var refresh_token = "";
    //req.session.token = token;
    user.token = refresh_token;
    user.save();

    res.status(200).send({
      id: user._id,
      username: user.username,
      email: user.email,
      roles: authorities,
      token: {
          access_token: token, // access token 1 min expiration
          refreshToken: refresh_token // refresh token 1h expiration
      }
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
    // invalida el token de las cookies
    // req.session = null;
    await User.findOne({ token: req.body.token.refresh_token}).then( (user) => {
      user.token = null;
      user.save();
      return res.status(200).send({ message: "You've been signed out!" });
    }).catch( (err) => {
      return res.status(401).send({
        message: "Error"
      });
    })
    
  } catch (err) {
    console.log(err)
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
  }
};

exports.refreshToken = async (req, res) => {
  // console.log(req.body)
  jwt.verify(req.body.token.refreshToken, config.REFRESH_TOKEN_PRIVATE_KEY, (err, decoded) => {
    if (err) {
      err.data = { content: "Invalid refreshToken" };
      res.status(401).send({
        message: err.data.content
      })
    } else {
      // const tokenPayload = jwt.decode(req.body.token.refresh_token, { json: true, complete: true });
      // console.log(tokenPayload.payload.id)
      const user = User.findByPk(req.body.accessTokenPayload.id);
      // console.log(user);
      const newToken = jwt.sign({ id: user.id }, config.ACCESS_TOKEN_PRIVATE_KEY, {
        expiresIn: "1m", // 1 minutos
      });


      // console.log(newToken)
      res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        token: {
          access_token : newToken,
          refreshToken: req.body.token.refreshToken
        }
      });
    }
  });

}

exports.token = async (req, res) => {

}
