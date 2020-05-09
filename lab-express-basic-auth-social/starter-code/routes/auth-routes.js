const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const bcryptSalt = 10;
const passport = require('passport');
const User = require("../models/user");

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email"
    ]
  })
);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/" // here you would redirect to the login page using traditional login approach
  })
);

router.get("/signup", (req, res, next) => {
  try {
    res.render("auth/signup");
  } catch(e) {
    next(e);
  }
});

router.get("/login", (req, res, next) => {
  try {
    res.render("auth/login");
  } catch(e) {
    next(e);
  }
});

router.get("/logout", (req, res, next) => {
  // destroy passport session
  req.logout();
  // destroy basic session
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

router.post("/login", (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.render("auth/login", {
      errorMessage: "Please enter both, username and password to login"
    });

    return;
  }

  User.findOne({ "username" : username })
    .then(user => {
      if (!user) {
        res.render("auth/login", {
          errorMessage: "The username doesn't exit"
        });

        return;
      }

      if (bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user;
        res.redirect("/");
      } else {
        res.render("auth/login", {
          errorMessage: "Incorrect password"
        });
      }
    });
});




router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);
 
  // const isPasswordOk = password.match(/[A-Z]/g);
  // if (!isPasswordOk) {
  // }

  // Making sure username and password are not empty
  if (username === "" || password === "") {
    res.render("auth/signup", {
      errorMessage: "Indicate a username and password"
    });
    return;
  }

  // Making sure that user doesn't exist already
  User.findOne({ "username": username })
    .then(user => {
      if (user) {
        res.render("auth/signup", {
          errorMessage: "The username already exists"
        });
        return;
      }

      User.create({ username, password: hashPass })
      .then(() => {
        res.redirect("/");
      })
      .catch(error => {
        next(error);
      });
    });
});

module.exports = router;