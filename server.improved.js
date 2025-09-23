const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;

dotenv.config();
const Car = require("./models/Car");

const app = express();
const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => console.log("Connected to MongoDB"));

app.use(express.json());
app.use(express.static(path.join(__dirname, "public"), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith(".js") || filePath.endsWith(".css") || filePath.endsWith(".woff2")) {
      res.setHeader("Cache-Control", "public, max-age=31536000");
    }
  }
}));

app.use(session({
  secret: process.env.SESSION_SECRET || "your-secret-key",
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, httpOnly: true }
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/github/callback"
}, (accessToken, refreshToken, profile, done) => {
  return done(null, profile);
}));

app.get("/auth/github", passport.authenticate("github", {
  scope: ["user:email"],
  prompt: "login"
}));

app.get("/auth/github/callback",
    passport.authenticate("github", { failureRedirect: "/" }),
    (req, res) => {
      req.session.userId = req.user.id;
      req.session.username = req.user.username;
      res.redirect("/");
    }
);

app.get("/logout", (req, res) => {
  req.logout(() => {
    req.session.destroy();
    res.redirect("/");
  });
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ error: "Not authenticated" });
}

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/user", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ username: req.session.username });
  } else {
    res.status(401).json({ error: "Not authenticated" });
  }
});

app.get("/results", ensureAuthenticated, async (req, res) => {
  const cars = await Car.find({ owner: req.session.userId });
  res.json(cars);
});

app.post("/submit", ensureAuthenticated, async (req, res) => {
  const { model, year, mpg } = req.body;
  const age = new Date().getFullYear() - year;

  try {
    const newCar = new Car({ model, year, mpg, age, owner: req.session.userId });
    await newCar.save();
    const cars = await Car.find({ owner: req.session.userId });
    res.json(cars);
  } catch (err) {
    res.status(400).json({ error: "Error adding car", details: err.message });
  }
});

app.put("/submit", ensureAuthenticated, async (req, res) => {
  const { model, year, mpg } = req.body;
  const age = new Date().getFullYear() - year;

  try {
    await Car.findOneAndUpdate({ model, owner: req.session.userId }, { year, mpg, age });
    const cars = await Car.find({ owner: req.session.userId });
    res.json(cars);
  } catch (err) {
    res.status(404).json({ error: "Car not found" });
  }
});

app.delete("/submit", ensureAuthenticated, async (req, res) => {
  const { model } = req.body;

  try {
    await Car.findOneAndDelete({ model, owner: req.session.userId });
    const cars = await Car.find({ owner: req.session.userId });
    res.json(cars);
  } catch (err) {
    res.status(404).json({ error: "Car not found" });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

//https://github.com/cfsghost/passport-github
//https://www.passportjs.org/docs/
//https://www.npmjs.com/package/express-session
//https://expressjs.com/en/guide/routing.html
//https://mongoosejs.com/docs/guide.html
// https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps
//https://developer.mozilla.org/en-US/docs/Web/HTTP/Session