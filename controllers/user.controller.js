const ObjectID = require('mongoose').Types.ObjectId;
const UserModel = require('../models/user.model');

module.exports.getAllUsers = async (req, res) => {
  const users = await UserModel.find().select('-password');
  res.status(200).json(users);
};

module.exports.userInfo = (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send(`ID inconnu: ${req.params.id}`);
  }

  UserModel.findById(req.params.id, (err, docs) => {
    if (!err) return res.send(docs);
    return res.status(400).send(`ID inconnu: ${req.params.id}`);
  }).select('-password');
};

module.exports.updateUsers = async (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send(`ID Inconnu: ${req.params.id}`);
  }

  try {
    await UserModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          bio: req.body.bio
        }
      },

      { new: true, upsert: true, setDefaultsOnInsert: true },
      (err, docs) => {
        if (!err) return res.send(docs);
        return res.status(500).send({ message: err });
      }
    );
  }
  catch (err) {
    return res.status(500).json({ message: err });
  }
};

module.exports.deleteUser = async (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send(`ID Inconnu: ${req.params.id}`);
  }

  try {
    await UserModel.deleteOne({ _id: req.params.id }).exec();
    return res.status(200).json({
      message: 'Utilisateur suppime avec succes'
    });
  }
  catch (err) {
    return res.status(500).json({ message: err });
  }
};

module.exports.follow = async (req, res) => {
  if (
    !ObjectID.isValid(req.params.id)
    || !ObjectID.isValid(req.body.idToFollow)) {
    return res.status(400).send(`ID zi Inconnu: ${req.params.id}`);
  }

  try {
    // add to the follower list
    await UserModel.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { following: req.body.idToFollow } },
      { new: true, upsert: true }
        .then((data) => res.send(data))
        .catch((err) => res.status(500).send({ message: err }))
    ),

    // add to following list
    await UserModel.findByIdAndUpdate(
      req.body.idToFollow,
      { $addToSet: { followers: req.params.id } },
      { new: true, upsert: true }
        .then((data) => res.send(data))
        .catch((err) => res.status(500).send({ message: err }))
    );
  }
  catch (err) {
    return res.status(500).json({ message: err });
  }
};

module.exports.unfollow = async (req, res) => {
  if (
    !ObjectID.isValid(req.params.id)
 || !ObjectID.isValid(req.body.idToUnFollow)) return res.status(400).send(`ID Inconnu: ${req.params.id}`);

  try {
    // Ajouter a la liste des followers
    await UserModel.findByIdAndUpdate(req.params.id, {
      $pull: {
        following: req.body.idToUnfollow
      }
    }, {
      new: true,
      upsert: true
    }, (err, docs) => {
      if (!err) return res.status(201).json(docs);
      return res.status(400).json(err);
    });

    // Ajouter a la liste des following
    await UserModel.findByIdAndUpdate(
      req.body.idToUnFollow,
      { $pull: { followers: req.params.id } },
      { new: true, upsert: true },
      (err, docs) => {
        if (!err) return res.status(201).json(docs);
        return res.status(400).json(err);
      }
    );
  }
  catch (err) {
    return res.status(500).json({ message: err });
  }
};
