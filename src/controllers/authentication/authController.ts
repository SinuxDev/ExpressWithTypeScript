import express from "express";

import { createUser, getUserByEmail } from "models/UserSchema";
import { random, authentication } from "helpers/authHelpers";

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
