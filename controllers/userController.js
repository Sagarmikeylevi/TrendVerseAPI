const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports.createSession = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });

    if (!user || user.password != req.body.password) {
      return res.status(422).json({
        message: "Invalid username or password",
      });
    }

    return res.status(200).json({
      message: "Sign in successful, here is your token, Please keep it safe!",
      data: {
        token: jwt.sign(user.toJSON(), process.env.SECRET_KEY, {
          expiresIn: "1000000",
        }),
      },
    });
  } catch (err) {
    console.log("******", err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports.register = async (req, res) => {
  try {
    let existingUser = await User.findOne({ email: req.body.email });
    if (!existingUser) {
      await User.create(req.body);
      return res.status(200).json({
        message: "Registered successfully",
      });
    } else {
      return res.status(409).json({
        error: "A user with the same email address already exists",
      });
    }
  } catch (err) {
    console.log("******", err);
    return res.status(500).json({
      message: "Error in registation",
    });
  }
};
