// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";

import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import GDPRWebhookHandlers from "./gdpr.js";

import mongoose from "mongoose";
import KeyModel from "./models/KeyModel.js";

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", false);

    await mongoose.connect('mongodb://localhost:27017/', {
      dbName: "Idp6ix",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("DB CONNECTED")
  } catch (error) {
    console.log('mongodb connection failed');
  }
};

connectDB();

const PORT = parseInt(process.env.BACKEND_PORT || process.env.PORT, 10);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: GDPRWebhookHandlers })
);

// All endpoints after this point will require an active session
app.use("/api/*", shopify.validateAuthenticatedSession());

app.use(express.json());

app.get("/api/products/count", async (_req, res) => {
  const countData = await shopify.api.rest.Product.count({
    session: res.locals.shopify.session,
  });
  res.status(200).send(countData);
});

app.get("/api/products/create", async (_req, res) => {
  let status = 200;
  let error = null;

  try {
    await productCreator(res.locals.shopify.session);
  } catch (e) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});

app.get("/api/idpkey/save", async (req, res) => {

  const getKey = await KeyModel.find(); 

  res.status(200).send({ status: 'success', data: getKey });
});

app.post("/api/idpkey/save", async (req, res) => {

  const session = res.locals.shopify.session; 

  const checkShop = await KeyModel.findOne({
    "shop": session.shop
  });

  if (checkShop) {

    let oldvalues = { "shop": session.shop };
    let newvalues = { $set: { 'idpkey': req.body.idpkey, 'updated_at': new Date() }};

    await KeyModel.findOneAndUpdate(oldvalues, newvalues);

    console.log("Key Details Updated!");

  } else {

    const idk_key = new KeyModel({
      _id: new mongoose.Types.ObjectId(),
      shop: session.shop,
      idpkey: req.body.idpkey,
      created_at: new Date(),
      updated_at: new Date()
    });
  
    await idk_key.save();

    console.log("Key Details Added!");

  }

  res.status(200).send({ status: 'success' });
});

app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

app.listen(PORT);
