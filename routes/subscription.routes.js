import { Router } from "express";
import authorize from "../middlewares/auth.middleware.js";
import {
  createSubscription,
  getSubscriptions,
} from "../controllers/subscription.controller.js";

const subscriptionRouter = Router();

subscriptionRouter.get("/", (req, res) => {
  res.send({ title: "GET all subscriptions" });
});

subscriptionRouter.get("/:id", (req, res) => {
  res.send({ title: "GET subscription details" });
});

// Validating request with necessary authorization procedure
// authorize --> will poupulate the request that user with the user info that"s currently logged in if not logged in they wont be able to create a subscription
subscriptionRouter.post("/", authorize, createSubscription);

subscriptionRouter.put("/:id", (req, res) => {
  res.send({ title: "Update subscription" });
});

subscriptionRouter.put("/user/:id", (req, res) => {
  res.send({ title: "Update subscription" });
});

subscriptionRouter.put("/user/:id", authorize, getSubscriptions);
export default subscriptionRouter;
