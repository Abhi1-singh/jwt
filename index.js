// const express = require("express");
// const mongoose = require("mongoose");
// const jwt = require("jsonwebtoken");
// const cors = require("cors");
// const User = require("./models/User"); // Make sure this path is correct
// require("dotenv").config();

// const app = express();

// // ✅ CORS Configuration
// const corsOptions = {
//   origin: [
//     "https://jwtfrontend-three.vercel.app",
//     "https://jwtfrontend-c28qe9bfu-abhi1-singhs-projects.vercel.app"
//   ],
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"]
// };

// app.use(cors(corsOptions));

// // ✅ Handle Preflight Requests Properly
// app.options("*", (req, res) => {
//   res.sendStatus(200);
// });

// app.use(express.json());

// // ✅ MongoDB Connection
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log("MongoDB connected"))
//   .catch(err => console.error("MongoDB Error:", err));

// // ✅ Signup Route
// app.post("/signup", async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     const user = new User({ username, password });
//     await user.save();
//     res.json({ message: "User registered" });
//   } catch (err) {
//     res.status(500).json({ error: "Signup failed" });
//   }
// });

// // ✅ Login Route
// app.post("/login", async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     const user = await User.findOne({ username, password });
//     if (!user) return res.status(401).json({ error: "Invalid credentials" });

//     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
//     res.json({ token });
//   } catch (err) {
//     res.status(500).json({ error: "Login failed" });
//   }
// });

// // ✅ Protected Route
// app.get("/profile", verifyToken, (req, res) => {
//   res.json({ message: "Welcome to protected profile route" });
// });

// // ✅ JWT Middleware
// function verifyToken(req, res, next) {
//   const bearer = req.headers.authorization;
//   if (!bearer) return res.status(403).send("Token missing");

//   const token = bearer.split(" ")[1];
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (err) {
//     res.status(403).send("Invalid token");
//   }
// }

// // ✅ Server Start
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log("Server running on", PORT));


const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const User = require("./models/User");
require("dotenv").config();

const app = express();

// ✅ Allowed Frontend URLs (add your frontend URLs here)
const allowedOrigins = [
//   "https://jwtfrontend-three.vercel.app",
//   "https://jwtfrontend-c28qe9bfu-abhi1-singhs-projects.vercel.app",
//   "https://jwtfrontend-prel.vercel.app",
//   "https://jwtfrontend-prel-g5nsh4xrh-abhi1-singhs-projects.vercel.app",
 "https://jwtfrontend-hli3.vercel.app",
  "https://jwtfrontend-hli3-j9wybpvn0-abhi1-singhs-projects.vercel.app",
  "http://localhost:5173" // for local development
];

// ✅ CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    console.log("🔄 Origin:", origin);
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // ✅ Preflight support

app.use(express.json());

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// ✅ Signup Route
app.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username or password missing" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    const user = new User({ username, password });
    await user.save();
    res.status(201).json({ message: "User registered" });
  } catch (err) {
    console.error("❌ Signup Error:", err); // <-- add this line
    res.status(500).json({ error: "Signup failed" });
  }
});


// ✅ Login Route
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

// ✅ Protected Route
app.get("/profile", verifyToken, (req, res) => {
  res.json({ message: "Welcome to protected profile route" });
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

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("🚀 Server running on port", PORT));
