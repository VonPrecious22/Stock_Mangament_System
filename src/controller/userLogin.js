const bcrypt = require("bcryptjs");
const user = require("../model/user");
const Joi = require("joi");

const showLogin = (req, res) => {
  if (req.session.userId) return res.redirect("/dashboard"); // already logged in
  res.render("auth/login", { error: null });
};



const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { error } = validate(req.body);
     if (error)
       return res.render("auth/login", { error: error.details[0].message });

    const existingUser = await user.findOne({ email });
   if (!existingUser)
     return res.render("auth/login", { error: "User not found" });
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password,
    );
    if (!isPasswordValid) return res.render("auth/login", { error: "Invalid password" });

    req.session.userId = existingUser._id;
    req.session.userName = existingUser.name;
    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    res.render("auth/login", {
      error: "Something went wrong. Please try again.",
    });
  }
};

//Logout function.

const logOut = (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.error(error);
      return res.redirect("/dashboard");
    }
    res.redirect("/login");
  });
};


module.exports = {
  showLogin,
  login,
  logOut,
};

function validate(data) {
  const schema = Joi.object({
    email: Joi.string().min(2).max(40).required().email(),
    password: Joi.string().min(6).max(30).required(),
  });
  return schema.validate(data);
}


