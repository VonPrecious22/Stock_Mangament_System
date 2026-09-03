const user = require("../model/user");
const bcrypt = require("bcryptjs");

const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).send("Please fill all the required fields");
    }
    const userExist = await user.findOne({ email });
    if (userExist) {
      return res.status(400).send("User already exits");
    }

    //hash password.
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //create user.

    const newUser = await user.create({
      name,
      email,
      password: hashedPassword,
    });
    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (err) {
    console.error(err);
    if(err.code === 11000){
      return res.status(400).send("Email already exists");
    }
    res.status(500).send("Error creating a new user", err);
  }
};

module.exports = { createUser };
