import express from "express";

import {
  login,
  register,
} from "../../controllers/authentication/authController";

export default (router: express.Router) => {
  router.post("/api/auth/login", login);

  router.post("/api/auth/register", register);
};
