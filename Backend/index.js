import express from "express";
import session from "express-session";
import passport from "passport";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import "./auth.js"; // passport config

dotenv.config();
const prisma = new PrismaClient();
const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Auth Routes
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
app.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "/" }), (req, res) => {
  res.redirect("http://localhost:5173/dashboard");
});
app.get("/auth/logout", (req, res) => {
  req.logout(() => res.send({ message: "Logged out" }));
});
app.get("/auth/user", (req, res) => {
  res.send(req.user || null);
});

// Notes Routes (Protected)
app.get("/notes", async (req, res) => {
  if (!req.user) return res.status(401).send("Unauthorized");
  const notes = await prisma.note.findMany({ where: { userId: req.user.id } });
  res.json(notes);
});

app.post("/notes", async (req, res) => {
  if (!req.user) return res.status(401).send("Unauthorized");
  const note = await prisma.note.create({
    data: { title: req.body.title, content: req.body.content, userId: req.user.id },
  });
  res.json(note);
});

app.delete("/notes/:id", async (req, res) => {
  if (!req.user) return res.status(401).send("Unauthorized");
  await prisma.note.delete({ where: { id: req.params.id, userId: req.user.id } });
  res.send({ message: "Note deleted" });
});

app.listen(4000, () => console.log("Server running on http://localhost:4000"));
