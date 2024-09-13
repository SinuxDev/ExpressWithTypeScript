import express from "express";

import { register } from "controllers/authentication/authController";

export default (router: express.Router) => {
  router.post("/api/auth/register", register);
};
