const config = require("../../../config/auth.config.js");
const db = require("../../db.js");
const User = db.user;
const Role = db.role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

/**
 * Sign up a new user, create their account and generate access and refresh tokens.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves when the response is sent.
 */
exports.signup = async (req, res) => {
  try {
    // Find the "Guest" role in the database
    const role = await Role.findOne({ where: { roleName: "Guest" } });

    // Create a new user
    const user = await User.create({
      username: req.body.fullName,
      email: req.body.email,
      password: req.body.password
    });

    if (user) {
      // Assign the "Guest" role to the user
      user.addRole(role);

      // Generate access token
      const access_token = jwt.sign({ id: user.id }, config.ACCESS_TOKEN_PRIVATE_KEY, {
        expiresIn: "1m" // Expires in 1 minute
      });

      // Generate refresh token
      const refresh_token = jwt.sign({ id: user.id }, config.REFRESH_TOKEN_PRIVATE_KEY, {
        expiresIn: "30d" // Expires in 30 days
      });

      const authorities = ["ROLE_" + role.roleName.toUpperCase()];

      // Set cookie options
      const access_token_opt = { maxAge: 1000 * 60 * 60 * 24, httpOnly: true };
      const refresh_token_opt = { maxAge: 1000 * 60 * 60 * 24 * 7, httpOnly: true };

      // Update the user's token in the database
      user.token = refresh_token;
      await user.save();

      // Send the response with cookies
      res
        .cookie("access_token", access_token, access_token_opt)
        .cookie("refresh_token", refresh_token, refresh_token_opt)
        .send({
          id: user._id,
          username: user.username,
          email: user.email,
          roles: authorities
        });
    }
  } catch (err) {
    // Handle error
    if (err) {
      res.status(500).send({ message: err.message });
    }
  }
};

/**
 * Sign in the user and generate access and refresh tokens.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves when the response is sent.
 */
exports.signin = async (req, res) => {
  try {
    // Find the user in the database
    const user = await User.findOne({
      where: {
        email: req.body.email
      },
      include: Role
    });

    if (!user) {
      // User not found
      return res.status(404).send({ message: "User Not found." });
    }

    // Validate the password
    const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

    if (!passwordIsValid) {
      // Invalid password
      return res.status(401).send({ message: "Invalid Password!" });
    }

    // Generate access token
    const access_token = jwt.sign({ id: user.id }, config.ACCESS_TOKEN_PRIVATE_KEY, {
      expiresIn: "1m" // Expires in 1 minute
    });

    // Generate refresh token
    const refresh_token = jwt.sign({ id: user.id }, config.REFRESH_TOKEN_PRIVATE_KEY, {
      expiresIn: "30d" // Expires in 30 days
    });

    const authorities = user.roles.map(role => "ROLE_" + role.roleName.toUpperCase());

    // const access_token_opt = { maxAge: 1000 * 60 * 60 * 24, httpOnly: true };
    // const refresh_token_opt = { maxAge: 1000 * 60 * 60 * 24 * 7, httpOnly: true };
    // Update the user's token in the database
    req.session.access_token = access_token;
    req.session.refresh_token = refresh_token;
    user.token = refresh_token;
    await user.save();

    // Send the response
    res.status(200)
      // .cookie("access_token", access_token, access_token_opt)
      // .cookie("refresh_token", refresh_token, refresh_token_opt)
      .send({
        id: user._id,
        username: user.username,
        email: user.email,
        roles: authorities
      });
  } catch (err) {
    // Handle error
    console.log(err);
    res.status(500).send({ message: err });
  }
};

/**
 * Sign out a user by invalidating their refresh token and clearing the access and refresh tokens from cookies.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves when the response is sent.
 */
exports.signout = async (req, res) => {
  try {
    let refresh_token = req.session.refresh_token;

    // Find the user with the provided refresh token
    const user = await User.findOne({ token: refresh_token });

    if (user) {
      // Invalidate the user's token
      user.token = null;
      await user.save();

      // Clear the access and refresh tokens from cookies
      res.clearCookie('access_token');
      res.clearCookie('refresh_token');

      // Send the response
      return res.status(200).send({ message: "You've been signed out!" });
    } else {
      // User not found
      return res.status(401).send({ message: "Error" });
    }
  } catch (err) {
    console.log(err);
    if (err) {
      res.status(500).send({ message: err });
    }
  }
};

/**
 * Refreshes the access token.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The response object containing the refreshed access token and user information.
 */
exports.refreshToken = async (req, res) => {
  
  // Retrieve the refresh token from the session
  let refresh_token = req.session.refresh_token;

  // Check if a refresh token is provided
  if (!refresh_token) {
    return res.status(403).send({ message: "No refreshToken provided!" });
  }

  // Verify the refresh token
  jwt.verify(refresh_token, config.REFRESH_TOKEN_PRIVATE_KEY, async (err, decoded) => {
    // Handle verification error
    if (err) {
      err.data = { content: "Unauthorized! Please login again..." };
      return res.status(401).send({
        message: err.data.content
      });
    }

    // Find the user associated with the access token payload
    const user = await User.findByPk(decoded.id, { include: Role });
    
    // Generate a new access token
    const newToken = jwt.sign({ id: user.id }, config.ACCESS_TOKEN_PRIVATE_KEY, {
      expiresIn: "1m", // 1 minute
    });
    
    // Prepare the user's authorities
    const authorities = user.roles.map(role => "ROLE_" + role.roleName.toUpperCase());
    // Set the new access token as a cookie in the response
    // const access_token_opt = { maxAge: 1000 * 60 * 60 * 24, httpOnly: true };
    req.session.access_token = newToken;
    req.session.refresh_token = refresh_token;
    res.status(200)
      .send({
        id: user._id,
        username: user.username,
        email: user.email,
        roles: authorities
      });
  });
}