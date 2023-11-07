const HttpError = require("../helpers/HttpError");
const { User } = require("../models/auth");
const bcrypt = require("bcrypt");
const ctrlWrapper = require("../helpers/ctrlWrapper");
const jwt = require("jsonwebtoken");

const { SECRET_KEY } = process.env;

const register = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email already in use");
  }
  const passHash = await bcrypt.hash(password, 10);
  const newUser = await User.create({ ...req.body, password: passHash });
  res.status(201).json({
    email: newUser.email,
  });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Not a valid email or password");
  }
  const passCompare = bcrypt.compare(password, user.password);
  if (!passCompare) {
    throw HttpError(401, "Not a valid email or password");
  }
  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "12h" });
  await User.findByIdAndUpdate(user._id, { token });
  res.json({
    token: token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

const current = (req, res, next) => {
  const { email, subscription } = req.user;
  res.json({
    email: email,
    subscription: subscription,
  });
};

const updateSub = async (req, res, next) => {
  const { _id } = req.user;
  const { subscription } = req.body;
  const subArray = ['starter', 'pro', 'business']
  if (!subArray.includes(subscription)) HttpError(400, "Bad request")
  const user= await User.findByIdAndUpdate(_id, req.body, {new:true})
  res.json(user)

}

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  current: ctrlWrapper(current),
  updateSub:ctrlWrapper(updateSub),
};
