require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const { HoldingsModel } = require("./models/HoldingsModel");
const { PositionsModel } = require("./models/PositionsModel");
const { OrdersModel } = require("./models/OrdersModel");
const { UserModel } = require("./models/UserModel");

const AuthRoute = require("./AuthRoute");

const allowedOrigins = ["https://zerodha-frontend-1e08.onrender.com", "https://zerodha-dashboard-sj2g.onrender.com"];
const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL;

const app = express();
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);


// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use(express.json());

// API Endpoints

// Get all holdings
app.get("/allHoldings", async (req, res) => {
  const allHoldings = await HoldingsModel.find({});
  res.json(allHoldings);
});

// Get all positions
app.get("/allPositions", async (req, res) => {
  const allPositions = await PositionsModel.find({});
  res.json(allPositions);
});

// Create new order (BUY / SELL)
app.post("/newOrder", async (req, res) => {
  const  name = req.body.name;
  const mode = req.body.mode?.toUpperCase(); 

  const qty = Number(req.body.qty);
  const price = Number(req.body.price);

  try {
    // Save order in OrdersModel
    await OrdersModel.findOneAndUpdate(
      { name, mode },
      {
        $inc: { qty: qty },
        $set: { price: price },
      },
      { upsert: true, new: true }
    );

    // Get existing holding
    const existing = await HoldingsModel.findOne({ name });

    if (mode === "BUY") {
      if (existing) {
        const totalQty = existing.qty + qty;
        const newAvg =
          (existing.qty * existing.avg + qty * price) / totalQty;

        existing.qty = totalQty;
        existing.avg = newAvg;
        existing.price = price;
        await existing.save();
      } else {
        await HoldingsModel.create({
          name,
          qty,
          avg: price,
          price,
          net: "+0%",
          day: "+0%",
        });
      }
    }
    console.log("Incoming order:", { name, mode, qty, price });

    if (mode === "SELL") {
      if (!existing || existing.qty < qty) {
        return res.status(400).send("Not enough stock to sell");
      }

      existing.qty -= qty;
      existing.price = price; // update to latest sell price

      if (existing.qty === 0) {
        await HoldingsModel.deleteOne({ name });
      } else {
        await existing.save();
      }
    }

    res.send("Order and Holdings updated successfully!");
  } catch (err) {
    console.error("Order update error:", err);
    res.status(500).send("Server error");
  }
});

// Get all orders
app.get("/allOrders", async (req, res) => {
  const allOrders = await OrdersModel.find({});
  res.send(allOrders);
});

// User auth routes
app.use("/", AuthRoute);

// Logout
app.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({ success: true, message: "Logout successful" });
});

// Start server
app.listen(PORT, () => {
  console.log("App started!");
  mongoose.connect(uri).then(() => console.log("DB connected!"));
});
