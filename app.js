console.log("Welcome to the Project");

import express from "express";
import bodyParser from "body-parser";
import router from "./routes/web.js"; // import routes binded with controllers
import path from "path";
import { fileURLToPath } from "url";
import MongoStore from "connect-mongo";
import session from "express-session";
import flash from "express-flash";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
global.usertype = null;
global.app_response = null;
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true })); // body parser to convert data

const uri =
  "mongodb+srv://dpampatel:conestoga@cluster0.axpuuar.mongodb.net/?retryWrites=true&w=majority";
const session_store = MongoStore.create({
  mongoUrl: uri,
  dbName: "usersDB",
  collectionName: "user_sessions",
}); //create session store for storing sessions

//const session_store = mongoose.model("user_sessions", new mongoose.Schema({}));

app.use(
  session({
    secret: "chintoo", // A secret key to sign the cookie
    resave: false,
    saveUninitialized: false,
    store: session_store,
  })
);
app.use(flash());
app.use((req, res, next) => {
  usertype = req.session.user_UserType;
  next();
});

app.use("/", router); // importing custom routers and controller

app.listen(8888, () => {
  console.log("Listening to port 8888!!");
});
