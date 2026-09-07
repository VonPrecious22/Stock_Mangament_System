const user = require("../model/user");
const bcrypt = require("bcryptjs");
const Joi = require("joi");


const renderRegisterForm = (req, res) => {
  return res.render("auth/register");
};
const createUser = async (req, res) => {
  try {
    const { name, email, password, contact } = req.body;
    const { error } = validate(req.body);
    if (error)
      return res.render("auth/register", { error: error.details[0].message });

    const userExist = await user.findOne({ email });
    if (userExist)
      return res.render("auth/register", { error: "Email already exists" });

    //hash password.
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //create user.

    const newUser = await user.create({
      name,
      email,
      contact,
      password: hashedPassword,
    });
    req.session.userId = newUser._id;
    req.session.userName = newUser.name;
    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    if (err.code === 11000)
      return res.render("auth/register", { error: "Email already exists" });
    res.render("auth/register", {
      error: "Something went wrong. Please try again.",
    });
  }
};

const getUser = async (req, res) => {
  try {
    const foundUser = await user
      .findById(req.session.userId)
      .select("-password");
    if (!foundUser) {
      return res.redirect("/login");
    }

    return res.render("user/profile", { profileUser: foundUser });
  } catch (err) {
    console.error(err);
   return res.render("errors/500");
  }
};

function validate(data) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(40).required(),
    contact: Joi.string().min(8).max(20).required(),
    email: Joi.string().min(2).max(40).required().email(),
    password: Joi.string().min(6).max(30).required(),
  });
  return schema.validate(data);
}

module.exports = { getUser, createUser,renderRegisterForm };
