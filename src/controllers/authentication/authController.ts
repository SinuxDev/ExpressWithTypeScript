import express from "express";

import { createUser, getUserByEmail } from "../../models/UserSchema";
import { random, authentication } from "../../helpers/authHelpers";

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { useremail, password } = req.body;

    if (!useremail || !password) {
      return res.status(400).send("Missing required fields");
    }

    const exisitingUser = await getUserByEmail(useremail).select(
      "+authentication.salt +authentication.password"
    );

    if (!exisitingUser) {
      return res.status(404).send("User not found");
    }

    const exceptedHash = authentication(
      exisitingUser.authentication.salt,
      password
    );

    if (exceptedHash !== exisitingUser.authentication.password) {
      return res.status(401).send("Invalid password");
    }

    const salt = random();
    exisitingUser.authentication.sessionToken = authentication(
      salt,
      exisitingUser._id.toString()
    );

    await exisitingUser.save();

    res.cookie("SHIN-AUTH", exisitingUser.authentication.sessionToken, {
      domain: "localhost",
      path: "/",
    });

    return res.status(200).json(exisitingUser).end();
  } catch (error) {
    console.error("Error logging in user: ", error);
    return res.status(500).send("Error logging in user");
  }
};

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { username, useremail, password } = req.body;

    if (!username || !useremail || !password) {
      return res.status(400).send("Missing required fields");
    }

    const existingUser = await getUserByEmail(useremail);

    if (existingUser) {
      return res.status(409).send("User already exists");
    }

    const salt = random();
    const newUser = await createUser({
      username,
      useremail,
      authentication: {
        password: authentication(salt, password),
        salt,
      },
    });

    return res
      .status(200)
      .json({
        success: true,
        newUser,
      })
      .end();
  } catch (error) {
    console.error("Error registering user: ", error);
    return res.status(500).send("Error registering user");
  }
};
