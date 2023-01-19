const jwt = require('jsonwebtoken');
const { create } = require('../models/user.model');
const UserModel = require('../models/user.model');

const maxAge = 3 * 24 * 60 * 60 * 1000;

// Creation d'un token qui servira a l'authentification lors des connexion
const createToken = (id) => jwt.sign({ id }, process.env.TOKEN_SECRET, {
  expiresIn: maxAge
});

/**
 *
 * @param {*} req
 * @param {*} res
 *
 * Fonction de création d'un nouveau compte
 */
module.exports.signUp = async (req, res) => {
  const { pseudo, email, password } = req.body;
  try {
    const user = await UserModel.create({ pseudo, email, password });
    res.status(201).json({ user: user._id });
  }
  catch (err) {
    res.status(400).send({ err });
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 *
 * Fonction de connexion a un compte existant
 */
module.exports.signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.login(email, password);
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge });
    res.status(200).json({ user: user._id });
  }
  catch (err) {
    res.status(400).json({ err });
  }
};

module.exports.logout = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/');
};
