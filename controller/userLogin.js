require("dotenv").config();
const user = require("../model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const loginUser = async (req, res) => {
  try {
     const { email, password } = req.body;

    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    const existingUser = await user.findOne({ email });

    if (!existingUser) {
      return res.status(401).send("User not found");
    }

    const User = await bcrypt.compare(password, existingUser.password);
    if (!User) return res.status(401).send("Invalid credentails");

    const token = jwt.sign(
      {
        _id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN },
    );
    res.status(200).json({
        message: "Login successful",
        token, 
        user: {
            id: existingUser._id,
            name: existingUser.name,
            email: existingUser.email,
        }
    })
  } catch (err) {
    console.error(err);
    res.status(500).send("Error Logging in the user", err);
  }
};

module.exports = { loginUser };

function validate(data) {
  const schema = Joi.object({
    email: Joi.string().min(2).max(40).required().email(),
    password: Joi.string().min(6).max(30).required(),
  });
  return schema.validate(data);
}
