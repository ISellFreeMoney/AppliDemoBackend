const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.model');

const maxAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (id) => jwt.sign({ id }, process.env.TOKEN_SECRET, {
  expiresIn: maxAge
});

module.exports.signUp = async (req, res) => {
  const { pseudo, email, password } = req.body;
  try {
    const user = await UserModel.create({ pseudo, email, password });
    res.status(201).json({ user: user._id });
  }
  catch (err) {
    res.status(200).send({ err });
  }
};

module.exports.signIn = async (req, res) => {
  const { pseudo, email, password } = req.body;
  try {
    const user = await UserModel.create({ pseudo, email, password });
    res.status(201).json({ user: user._id });
  }
  catch (err) {
    res.status(200).send({ err });
  }
};

module.exports.logout = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/');
};
