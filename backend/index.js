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


const AuthRoute=require("./AuthRoute");

const allowedOrigins = ["http://localhost:3000","http://localhost:3001"];

const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL;



const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));
app.use(bodyParser.json());
app.use(express.json())





app.get("/allHoldings", async (req, res) => {
  let allHoldings = await HoldingsModel.find({});
  res.json(allHoldings);
});

app.get("/allPositions", async (req, res) => {
  let allPositions = await PositionsModel.find({});
  res.json(allPositions);
});

 app.post("/newOrder", async (req, res) => {
    const { name, qty, price, mode } = req.body;

    try {
      // 1. Save or update order
      await OrdersModel.findOneAndUpdate(
        { name, mode },
        {
          $inc: { qty: qty },
          $set: { price: price },
        },
        { upsert: true, new: true }
      );

      // 2. Get existing holding
      const existing = await HoldingsModel.findOne({ name });

      if (mode === "BUY") {
        if (existing) {
          // update avg price and qty
          const totalQty = existing.qty + qty;
          const newAvg = (existing.qty * existing.avg + qty * price) / totalQty;

          existing.qty = totalQty;
          existing.avg = newAvg;
          existing.price = price; // latest price
          await existing.save();
        } else {
          // create new holding
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

      if (mode === "SELL") {
        if (!existing || existing.qty < qty) {
          return res.status(400).send("Not enough stock to sell");
        }

        existing.qty -= qty;

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

  app.get('/allOrders', async (req, res) => {
    let allOrders = await OrdersModel.find({});
    res.send(allOrders);
  });

  // user signup signin route
  app.use("/", AuthRoute);
  app.get("/logout", (req, res) => {
  res.clearCookie("token"); // or whatever your cookie name is
  return res.status(200).json({ success: true, message: "Logout successful" });
});





app.listen(PORT, () => {
  console.log("App started!");
  mongoose.connect(uri);
  console.log("DB started!");
});