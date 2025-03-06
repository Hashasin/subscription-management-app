import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";
import User from "../models/user.model.js";

// someone is making request to get user details --> we call this authorize middleware --> verify who is trying to do it --> if valid --> go to next step --> give access to user details
const authorize = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization.startsWith("Bearer")) {
      // split the word Bearer & return 2nd part of the string
      token = req.headers.authorization.split(" ")[1];
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }

    //if get the token, verify the token
    const decoded = jwt.verify(token, JWT_SECRET);

    // check if user still exists
    const user = await User.findById(decoded.userId);
    //if user not exist
    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
    }
    // if it does exist
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized", error: error.message });
  }
};

export default authorize;
