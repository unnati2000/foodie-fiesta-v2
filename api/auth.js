const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const auth = require("../middleware/auth.middleware");
const router = express.Router();

router.post("/", async (req, res) => {
  const { email, password } = req.body;
  if (password.length < 6) {
    return res
      .status(400)
      .json({ msg: "Password must be atleast 6 characters long" });
  }
  try {
    let user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password"
    );

    if (!user) {
      return res.status(401).json({ msg: "Invalid Credentials" });
    }

    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) {
      return res.status(401).json({ msg: "Invalid Credentials" });
    }

    const payload = { userId: user._id };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {
        expiresIn: "3d",
      },
      (err, token) => {
        if (err) throw err;

        res.status(200).json(token);
      }
    );
  } catch (err) {
    console.log(err);
    console.log("server error");
    res.status(500).json({ msg: "Server error" });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(400).json({
        msg: "Please login first",
      });
    }

    res.status(200).json({ user });
  } catch (err) {
    console.log(err);
    console.log("server error");
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
