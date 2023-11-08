const HttpError = require("../helpers/HttpError");
const { User } = require("../models/auth");
const bcrypt = require("bcrypt");
const ctrlWrapper = require("../helpers/ctrlWrapper");
const jwt = require("jsonwebtoken");
const gravatar = require('gravatar');
const path = require('path')
const fs = require('fs/promises')
const Jimp = require('jimp')
const sendEmail = require("../helpers");
const { nanoid } = require("nanoid");



const { SECRET_KEY, BASE_URL } = process.env;

const destPath = path.join(__dirname,'../', 'public', 'avatars')

const register = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email already in use");
  }
  const passHash = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const verifyCode = nanoid();
  const newUser = await User.create({ ...req.body, password: passHash, avatarURL, verifyCode });
  const verifyEmailBody = {
    to: email,
    from: "toreadorr.ua@gmail.com",
    subject: "Email confirmation",
    html: `<p>Please confirm your email. <br> You have to click this <a href = "${BASE_URL}api/auth/verify/${verifyCode}">link</a></p>`,
  };
  await sendEmail(verifyEmailBody);
  res.status(201).json({
    email: newUser.email,
  });
};

const verifySubmit = async (req, res) => {
  const {verifyCode} = req.params;
  const user = await User.findOne({ verifyCode });
  if (!user) {
    throw HttpError(404, 'Email not found')
  }
  await User.findByIdAndUpdate(user._id, { verifyCode: "", verify: true })
  res.json({message: 'Email authorized success!'})
}

const resendEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(404, 'User not found')
  }
  if (user.verify) {
    throw HttpError(401, 'User already verified')
  }
  const verifyEmailBody = {
    to: email,
    from: "toreadorr.ua@gmail.com",
    subject: "Email confirmation",
    html: `<p>Please confirm your email. <br> You have to click this <a href = "${BASE_URL}api/auth/verify/${user.verifyCode}">link</a></p>`,
  };
  await sendEmail(verifyEmailBody);
  res.json({message: 'Email authorized success!'})
}

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

const updAvatar= async(req, res, next) => {
  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file; 
  const img = await Jimp.read(tempUpload)
  img.resize(250, 250);
  const filename = `${_id}-${originalname}`;
  const resultUpload = path.join(destPath, filename);
  await fs.rename(tempUpload, resultUpload);
  const avatarURL = path.join("avatars", filename)
  await User.findByIdAndUpdate(_id, { avatarURL });
  res.json({avatarURL})
}

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  current: ctrlWrapper(current),
  updateSub: ctrlWrapper(updateSub),
  updAvatar: ctrlWrapper(updAvatar),
  verifySubmit: ctrlWrapper(verifySubmit),
  resendEmail:ctrlWrapper(resendEmail),
};
