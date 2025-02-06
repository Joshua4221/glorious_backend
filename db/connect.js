import mongoose from "mongoose";
import { configs } from "../config/index.js";
import { MongoStore } from "wwebjs-mongo";

const { DB_URL } = configs;

// let store;

const connect_db = async () => {
  try {
    await mongoose.connect(DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Store the connection in the 'store' variable for later use
    // store = new MongoStore({ mongoose: mongooseConnection });

    console.log("database ready to go");
  } catch (e) {
    console.log("🚀 ~ file: db_connection.js ~ line 12 ~ connect ~ e", e);
  }
};

export { connect_db };
