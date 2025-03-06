import aj from "../config/arcjet.js";

const arcjetMiddleware = async (req, res, next) => {
  try {
    // protect this request and tell me your decision should it be denied or let it through
    const decision = await aj.protect(req, { requested: 5 });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        res.status(429).json({ error: "Rate limit exceeded" });
      }
      if (decision.reason.isBot()) {
        res.status(403).json({ error: "Bot detected" });
      }

      //if neither one of these
      res.status(403).json({ error: "Acces Denied" });
    }

    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export default arcjetMiddleware;
