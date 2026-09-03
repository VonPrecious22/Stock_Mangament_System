const user = require("../model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).send("Please provide an email and password.");
    const existingUser = await user.find({ email });
    if (!existingUser)
      return res.status(400).send("User not found");
    const isUser = await bcrypt.compare(password, existingUser.password);
    if (!isUser) 
      return res.status(401).send("Invalid credentails");
  } catch (err) {}
};

function validate() {
  const schema = Joi.object({
    // name: Joi.string().min(4).max(40).required(),
    email: Joi.string().min(2).max(40).required(),
    password: Joi.string().min(6).required(),
  });
}
