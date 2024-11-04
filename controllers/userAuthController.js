import User from "../models/user.js";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";
import tokenSignature from "../views/global.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export const renderLoginPage = async (req, res) => {
  try {
    res.render("login", { isLoggedIn: global.isLoggedIn });
  } catch (error) {
    console.error(error);
    res.status(500).redirect("/error");
  }
};

export const login = async (req, res) => {
  const { userName, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { userName } })
    if (user) {
      const userPassword = user.password
      const isMatch = bcrypt.compare(password, userPassword);
      if (isMatch) {
          const token = JWT.sign({ userName }, tokenSignature);
          req.session.token = token;
          res.redirect("/");
        } else {
          res.redirect("/");
        }
      } else {
        res.redirect("/login");
      }

    
  } catch (error) {
    console.error(error);
    res.status(500).redirect("/error");
  }
};

export const renderSignup = async (req, res) => {
  try {
    res.render("sign-up", { isLoggedIn: global.isLoggedIn });
  } catch (error) {
    console.error(error);
    res.status(500).redirect("/error");
  }
};

export const signup = async (req, res) => {
  const { userName, password, confirmPassword } = req.body;

  try {
    const hashPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        userName: userName,
        password: hashPassword
      }
    })

    res.redirect("/login");
  } catch (error) {
    console.error(error);
    res.status(500).redirect("/error");
  }
};

export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.status(500).send("Error logging out");
    }
    // Once the session is destroyed, redirect to the home page
    res.redirect("/");
  });
};
