// const express = require("express");
// const mongoose = require("mongoose");
// const jwt = require("jsonwebtoken");
// const cors = require("cors");
// const User = require("./models/User");
// require("dotenv").config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// mongoose.connect(process.env.MONGO_URI)
//     .then(() => console.log("MongoDB connected"))
//     .catch(err => console.log(err));

// // Signup route
// app.post("/signup", async (req, res) => {
//     const { username, password } = req.body;
//     const user = new User({ username, password });
//     await user.save();
//     res.send({ message: "User registered" });
// });

// // Login route
// app.post("/login", async (req, res) => {
//     const { username, password } = req.body;
//     const user = await User.findOne({ username, password });
//     if (!user) return res.status(401).json({ error: "Invalid credentials" });

//     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
//     res.send({ token });
// });

// // Protected route
// app.get("/profile", verifyToken, (req, res) => {
//     res.send({ message: "Welcome to protected profile route" });
// });

// // JWT middleware
// function verifyToken(req, res, next) {
//     const bearer = req.headers.authorization;
//     if (!bearer) return res.status(403).send("Token missing");
//     const token = bearer.split(" ")[1];

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = decoded;
//         next();
//     } catch (err) {
//         res.status(403).send("Invalid token");
//     }
// }

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log("Server running on", PORT));

const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const User = require("./models/User");
require("dotenv").config();

const app = express();

// ✅ Fix: Allowed frontend origins
const allowedOrigins = [
  "https://jwtfrontend-three.vercel.app",
  "https://jwtfrontend-c28qe9bfu-abhi1-singhs-projects.vercel.app"
];

// ✅ Proper CORS middleware setup
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS Not Allowed for this Origin: " + origin));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// ✅ Preflight support
app.options("*", cors());

app.use(express.json());

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// ✅ Signup Route
app.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  const user = new User({ username, password });
  await user.save();
  res.send({ message: "User registered" });
});

// ✅ Login Route
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
  res.send({ token });
});

// ✅ Protected Route
app.get("/profile", verifyToken, (req, res) => {
  res.send({ message: "Welcome to protected profile route" });
});

// ✅ JWT Middleware
function verifyToken(req, res, next) {
  const bearer = req.headers.authorization;
  if (!bearer) return res.status(403).send("Token missing");
  const token = bearer.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).send("Invalid token");
  }
}

// ✅ Server Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on", PORT));
