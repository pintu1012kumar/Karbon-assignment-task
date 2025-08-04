import express from "express";
import session from "express-session";
import passport from "passport";
import cors from "cors";
import dotenv from "dotenv";
import pkg from "@prisma/client";
import "./auth.js"; // Passport strategy config

dotenv.config();
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: true,
    methods: ["GET", "POST", "DELETE"],
  })
);

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,  
      secure: false,   
      sameSite: "lax", 
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "http://localhost:5173/login" }),
  (req, res) => {
    res.redirect("http://localhost:5173/dashboard");
  }
);

app.get("/auth/logout", (req, res) => {
  req.logout(() => {
    res.clearCookie("connect.sid");
    res.send({ message: "Logged out" });
  });
});

app.get("/auth/user", (req, res) => {
  res.json(req.user || null);
});


app.get("/notes", async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  const notes = await prisma.note.findMany({ where: { userId: req.user.id } });
  res.json(notes);
});

app.post("/notes", async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  const note = await prisma.note.create({
    data: {
      title: req.body.title,
      content: req.body.content,
      userId: req.user.id,
    },
  });
  res.json(note);
});

app.delete("/notes/:id", async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  await prisma.note.delete({ where: { id: req.params.id } });
  res.json({ message: "Note deleted" });
});

app.listen(3000, () => console.log("✅ Server running on http://localhost:3000"));
