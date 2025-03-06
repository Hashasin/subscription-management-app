import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Subscription name is required"],
      trim: true,
      minLength: 2,
      maxLength: 100,
    },
    price: {
      type: Number,
      required: [true, "Subscription price is required"],
      min: [0, "Price must be greater than 0"],
    },
    currency: {
      type: String,
      enum: ["USD", "EUR", "GBP"],
      default: "USD",
    },
    frequency: {
      type: String,
      enum: ["daily", "weekly", "monthly", "yearly"],
    },
    category: {
      type: String,
      enum: [
        "sports",
        "news",
        "entertainment",
        "lifestyle",
        "technology",
        "finance",
        "politics",
        "other",
      ],
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "cancelled", "expired"],
      default: "active",
    },
    startDate: {
      type: Date,
      required: true,
      validate: {
        validator: (value) => value <= new Date(),
        message: "Start date must be in the past",
      },
    },
    renewalDate: {
      type: Date,
      validate: {
        validator: function (value) {
          return value > this.startDate;
        },
        message: "Renewal date must be after the start date",
      },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

// this function Auto-calculate the renewable date if missing using 'pre'
subscriptionSchema.pre("save", function (next) {
  if (!this.renewalDate) {
    const renewablePeriod = {
      daily: 1,
      weekly: 7,
      monthly: 30,
      yearly: 365,
    };

    this.renewalDate = new Date(this.startDate);

    // adding no. of days from renewablePeriod based on the frquency that we pass in
    // Example -- if start on Jan 1st and if frequency is monthly (30 days) which will end up being Jan 31st so, then renewal date will be Feb 1st
    this.renewalDate.setDate(
      this.renewalDate.getDate() + renewablePeriod[this.frequency]
    );
  }

  // Auto update the status
  if (this.renewalDate < new Date()) {
    this.status = "expired";
  }
  // start creation of document in database
  next();
});

// creating model out of this schema
const Subscription = mongoose.model('Subscription', subscriptionSchema);
export default Subscription;