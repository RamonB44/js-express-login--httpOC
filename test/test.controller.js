// Controller for handling a request to access public content
exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

// Controller for handling a request to access user-specific content
exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

// Controller for handling a request to access admin-specific content
exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

// Controller for handling a request to access moderator-specific content
exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};